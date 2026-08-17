# Standard Operating Procedure: Automated Sourcing Pipeline

#sop #automation #cron #pipeline #data-ingestion

> **Document Type:** Standard Operating Procedure (SOP)  
> **Area:** Operations & Data Engineering  
> **Frequency:** Automated every 6–12 Hours | Manual Review Daily  
> **Primary Script:** `scripts/scrape-coupons.ts`  
> **Workflow:** `.github/workflows/sync-coupons.yml`  
> **Parent Project:** [[P01 - Free Course Website MVP]]  
> **Monetization Reference:** [[Architecture - Monetization and Ad Placements]]  
> **Master Index:** [[Vault Overview]]

---

## 1. Purpose & Overview
This SOP defines the automated ingestion, transformation, affiliate wrapping, and expiration lifecycle of 100% discount Udemy coupon links on the free course aggregation platform. Maintaining zero broken links and fresh deals is critical for user retention, search engine authority, and affiliate conversions.

---

## 2. Data Feed Sources & Ingestion Targets
The automated pipeline pulls candidate 100% discount coupons from verified RSS, JSON endpoints, and scraper feeds:

| Source Name | Endpoint Type | Feed URL / Method | Coupon Discount Target | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **RealDiscount Feed** | RSS / JSON | `https://api.real.discount/v2/coupons` | 100% OFF Only | Priority 1 |
| **DiscUdemy RSS** | XML Feed | `https://www.discudemy.com/rss` | 100% OFF Only | Priority 2 |
| **CourseMania Feed** | API / JSON | `https://api.coursemania.xyz/coupons` | 100% OFF Only | Priority 3 |
| **Udemy Official API** | REST API | `https://www.udemy.com/api-2.0/courses/` | Validation & Pricing check | Metadata verification |

---

## 3. Transformation & Affiliate Deep-Linking Rules

Every raw incoming URL must undergo URL parsing and transformation before storage (for deeper specifications, refer to [[Architecture - Monetization and Ad Placements#2-rakuten-affiliate-link-architecture-udemy-deep-links|Rakuten Deep-Link Specs]]):

### Step 3.1: Extract Udemy Coupon Code
- Raw Link Pattern: `https://www.udemy.com/course/course-slug/?couponCode=FREE2026AUG`
- Regex Extractor: `/(?:couponCode=|\?code=)([A-Z0-9_\-]+)/i`
- Standardized Storage: Store `coupon_code` separately from clean destination URL.

### Step 3.2: Rakuten Affiliate Deep-Link Wrapper
All destination URLs must be wrapped with the Rakuten Advertising affiliate tracking structure to guarantee commission attribution.

- **Rakuten Publisher ID (MID):** `13884` (Udemy Merchant ID)
- **Rakuten Link Template:**
  ```text
  https://click.linksynergy.com/deeplink?id={PUBLISHER_ID}&mid=13884&murl={ENCODED_DESTINATION_URL}
  ```
- **Example Wrapped URL:**
  ```text
  https://click.linksynergy.com/deeplink?id=xYz9876543&mid=13884&murl=https%3A%2F%2Fwww.udemy.com%2Fcourse%2Fpython-masterclass%2F%3FcouponCode%3DFREE2026AUG
  ```

---

## 4. Execution Schedule & GitHub Actions Automation

### Schedule Definition
The ingestion pipeline runs on a scheduled cron cadence via GitHub Actions:
- **Primary Schedule:** `0 */6 * * *` (Every 6 hours UTC: 00:00, 06:00, 12:00, 18:00)
- **Peak Hours Cadence (Optional):** `0 */3 * * *` during promo events (Black Friday, Cyber Week).

### GitHub Actions Workflow File Configuration (`.github/workflows/sync-coupons.yml`)
```yaml
name: Sync Free Udemy Coupons

on:
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:

jobs:
  sync-coupons:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Dependencies
        run: npm ci

      - name: Execute Sourcing & Expiration Pipeline
        env:
          RAKUTEN_PUBLISHER_ID: ${{ secrets.RAKUTEN_PUBLISHER_ID }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        run: npx tsx scripts/scrape-coupons.ts

      - name: Commit Updated Static Feed (If using static JSON engine)
        run: |
          git config --global user.name 'Coupon Sync Bot'
          git config --global user.email 'bot@domain.com'
          git add src/data/mockCourses.ts
          git diff-index --quiet HEAD || git commit -m "auto: sync coupons and clean expired [skip ci]"
          git push
```

---

## 5. Coupon Expiration & Cleaning Logic

Coupons on Udemy typically expire within 24 to 72 hours, or after 1,000 redemptions. The pipeline enforces strict multi-layered expiration rules:

### Automated Rules:
1. **Time-To-Live (TTL) Hard Cap:**
   - Any coupon created over **48 hours** ago is automatically marked `is_expired: true`.
2. **Community Flagging Threshold:**
   - Incremented whenever a user clicks "Report Expired" on the frontend.
   - If `report_count >= 3`, the system sets `is_expired: true` immediately without waiting for TTL.
3. **HTTP Status Validation:**
   - Scraper tests Udemy URL HTTP status. If redirect leads to full-price page or returns `404`, mark `is_expired: true`.

---

## 6. Manual Override & Emergency Instructions

When a coupon code is manually reported in broadcast channels or a high-value course needs immediate featured status:

### Adding a Featured Manual Coupon
1. Open database management dashboard (or `src/data/mockCourses.ts`).
2. Append new object with:
   - `is_featured: true`
   - `created_at`: Current ISO timestamp
   - `expires_at`: ISO timestamp (+48 hours)
   - `report_count`: 0
   - `is_expired`: false
3. Wrap destination URL via Rakuten format manually.

### Force-Expiring a Dead Deal
To immediately suppress a deal across website and API:
```bash
# Execute local CLI override command
npx tsx scripts/force-expire.ts --id="COURSE_ID_HERE"
```
Or set `is_expired = true` directly in database console.
