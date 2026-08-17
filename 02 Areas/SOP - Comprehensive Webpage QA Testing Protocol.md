# SOP: Comprehensive Webpage QA Testing Protocol & Master Test Cases

#sop #qa #testing #verification #test-cases #compliance

> **Document Type:** Quality Assurance & Testing Protocol  
> **Area:** Software Engineering & Product QA  
> **Target Audience:** QA Engineers, Developers, Admins  
> **Parent Project:** [[P01 - Free Course Website MVP]]  
> **Admin Operations SOP:** [[SOP - Admin Operations and Revenue Guide]]  
> **Monetization Architecture:** [[Architecture - Monetization and Ad Placements]]  
> **Master Index:** [[Vault Overview]]

---

## 1. Executive Testing Strategy & Scope

This document defines the complete end-to-end Quality Assurance (QA) testing suite for the Free Course Aggregator platform. Every webpage, UI component, API endpoint, monetization container, and user interaction criteria must pass the criteria below prior to production release.

```
                    ┌─────────────────────────────────────────┐
                    │        Master Testing Pipeline          │
                    └────────────────────┬────────────────────┘
                                         │
     ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
     ▼                   ▼                               ▼                   ▼
1. Homepage (`/`)  2. Admin (`/admin`)           3. Legal Pages      4. API Endpoints
   - Search/Filters   - Auth Gate                   - Privacy           - /api/courses
   - Cards/Copy       - Moderation                  - Terms             - /api/report
   - Modals           - Add Form                    - Affiliate         - /api/sync
   - Ad Placement     - Scraper Sync                - FTC Rules         - /api/admin/*
```

---

## 2. Webpage Test Suites & Criteria

### A. Homepage Directory (`/`) Test Cases

| ID | Test Target | Action / Input | Expected Result / Criterion | Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-HP-01` | Live Deal Counter | Load Homepage | Header notification ribbon displays active 100% OFF coupon count accurately. | PASS |
| `TC-HP-02` | Instant Search (Title) | Type `"Python"` into search bar | Catalog instantly filters using Fuse.js fuzzy engine to Python courses only in < 50ms. | PASS |
| `TC-HP-03` | Instant Search (Instructor) | Type `"Stephane"` into search bar | Displays courses authored by Stephane Maarek. | PASS |
| `TC-HP-04` | Search Clear Button | Click `X` icon inside search bar | Search field clears instantly and full category grid restores. | PASS |
| `TC-HP-05` | Category Filtering | Click `"IT & Security"` category pill | Grid displays cybersecurity, AWS, and ethical hacking deals only. Active pill receives indigo highlight. | PASS |
| `TC-HP-06` | Sorting (Most Popular) | Select `"Most Popular"` sort option | Cards reorder in descending order by `students_count`. | PASS |
| `TC-HP-07` | Sorting (Top Rated) | Select `"Top Rated"` sort option | Cards reorder in descending order by star `rating`. | PASS |
| `TC-HP-08` | Coupon Code Copy | Click `"Copy Code"` on any Course Card | Coupon code is copied to system clipboard; button text changes to `"Copied!"` with emerald background; confetti particles fire. | PASS |
| `TC-HP-09` | Affiliate Link Redirect | Click `"Get 100% Free Course"` button | Opens Rakuten deep link (`click.linksynergy.com...`) in new browser tab (`target="_blank"`), landing on Udemy checkout with `$0.00` price. | PASS |
| `TC-HP-10` | Expiry Timer Ticker | Inspect countdown badge | Displays remaining time formatted via `formatTimeRemaining(expires_at)` (e.g. `"1d 14h left"`). | PASS |
| `TC-HP-11` | Detail Modal Trigger | Click anywhere on Course Card body | Opens `CourseDetailModal` displaying full description, rating stats, instructor info, copy code box, and share buttons. | PASS |
| `TC-HP-12` | Social Share Triggers | Click Telegram / WhatsApp share icons in modal | Opens Telegram/WhatsApp share window prepopulated with deal text and UTM tracking parameters. | PASS |
| `TC-HP-13` | Report Flag Trigger | Click `"Report Broken Code"` on card | Opens `ReportModal` dialog. | PASS |
| `TC-HP-14` | Report Submission | Select reason `"Coupon code expired"`, click Submit | Sends `POST` to `/api/report-expired`; increments report count on card optimistically; displays success toast. | PASS |
| `TC-HP-15` | Empty Search State | Type `"xyz999nonexistent"` into search | Renders empty state card: *"No courses matched your search"* with a *"Reset Search"* button. | PASS |

---

### B. Dedicated Admin Dashboard (`/admin`) Test Cases

| ID | Test Target | Action / Input | Expected Result / Criterion | Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-ADM-01` | Auth Gate Protection | Navigate to `/admin` without key | Password challenge screen is rendered; dashboard content is hidden. | PASS |
| `TC-ADM-02` | Invalid PIN Entry | Enter incorrect PIN `"wrong123"` | Displays error message: *"Invalid Admin Access Key"*; access remains blocked. | PASS |
| `TC-ADM-03` | Valid PIN Access | Enter correct PIN (`admin123` or `.env` key) | Authenticates via `/api/admin/auth`; stores token in `localStorage`; unlocks Admin Dashboard. | PASS |
| `TC-ADM-04` | Admin Logout | Click Logout button in Admin Header | Clears `localStorage` auth token; locks dashboard; redirects to PIN screen. | PASS |
| `TC-ADM-05` | Metric Tickers | Inspect Analytics Ticker cards | Correctly calculates Active Deals, Flagged Reports, Expired Deals, and Catalog Value. | PASS |
| `TC-ADM-06` | Status Filter | Click `"Flagged"` filter pill | Moderation table filters to show courses with `report_count > 0` only. | PASS |
| `TC-ADM-07` | Reset Reports Action | Click `"Reset Flags"` on a reported course | Calls `PUT /api/admin/courses` with `action: 'reset_reports'`; sets `report_count = 0` and `is_expired = false`. | PASS |
| `TC-ADM-08` | Force Expire Action | Click `"Force Expire"` on active course | Calls `PUT /api/admin/courses` with `action: 'expire'`; sets `is_expired = true`. | PASS |
| `TC-ADM-09` | Re-activate Action | Click `"Re-activate"` on expired course | Restores course to active status and extends `expires_at` by +48 hours. | PASS |
| `TC-ADM-10` | 1-Click Broadcast Generator | Click `"Draft"` on any course row | Copies Telegram/WhatsApp post text to clipboard formatted with UTM parameters (`?utm_source=telegram&utm_medium=broadcast`). | PASS |
| `TC-ADM-11` | Delete Course | Click Delete trash icon, confirm prompt | Calls `DELETE /api/admin/courses?id=<ID>`; removes course row from table. | PASS |
| `TC-ADM-12` | Add New Course Form | Fill form in Tab 2, click Publish | Calls `POST /api/admin/courses`; validates fields; wraps Rakuten affiliate link; prepends new course to catalog; triggers confetti. | PASS |
| `TC-ADM-13` | Scraper Sync Trigger | Click `"Sync Scraper Pipeline"` | Calls `/api/sync-coupons`; displays sync summary message (*"Synced N courses"*). | PASS |

---

### C. Monetization & Ad Placement Container Test Cases

| ID | Test Target | Action / Input | Expected Result / Criterion | Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-AD-01` | Header Leaderboard Zone | View top of homepage below header | Container reserved at `min-height: 100px` (`728x90` / `320x50`); zero layout shift (CLS < 0.1). | PASS |
| `TC-AD-02` | Native In-Feed Grid Slot | Scroll through main course grid | Native sponsored ad card is injected every 6th slot (`index % 6 === 0`). | PASS |
| `TC-AD-03` | Mobile Sticky Footer Anchor | Load homepage on mobile viewport (<768px) | Fixed bottom banner stays anchored to viewport with sponsor tag and affiliate call-to-action. | PASS |
| `TC-AD-04` | Secondary Affiliate Widget | Open `CourseDetailModal` | Displays contextual referral offer (Cloud VPS \$100 credit / 70% OFF VPN deal) below course specs. | PASS |

---

### D. Legal Compliance Pages Test Cases

| ID | Test Target | Route / Page | Expected Result / Criterion | Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-LEG-01` | Privacy Policy | `/privacy-policy` | Contains GDPR/CCPA disclosures, Google AdSense cookies explanation, and Rakuten tracking statement. | PASS |
| `TC-LEG-02` | Terms of Service | `/terms-of-service` | Disclaims course availability, 1,000 redemption caps, and Udemy trademark ownership. | PASS |
| `TC-LEG-03` | Affiliate Disclosure | `/affiliate-disclosure` | Provides FTC compliance statement, Rakuten merchant disclosure, and 100% FREE price guarantee. | PASS |
| `TC-LEG-04` | Back Navigation | Click `"Back to Free Courses"` link on any legal page | Navigates back to homepage (`/`). | PASS |

---

### E. Backend API Endpoints Test Cases

```bash
# 1. Test Courses Retrieval Endpoint
curl -X GET "http://localhost:3000/api/courses?category=Development&q=python&sort=newest"
# Expected: 200 OK JSON with filtered courses array.

# 2. Test Report Expired Endpoint
curl -X POST "http://localhost:3000/api/report-expired" \
  -H "Content-Type: application/json" \
  -d '{"course_id":"udemy-py-2026-001","reason":"expired_code","notes":"Shows $12.99"}'
# Expected: 200 OK JSON with incremented report_count.

# 3. Test Sync Pipeline Endpoint
curl -X POST "http://localhost:3000/api/sync-coupons" \
  -H "Authorization: Bearer demo-cron-secret"
# Expected: 200 OK JSON with active_courses & expired_cleaned stats.

# 4. Test Admin Auth Endpoint
curl -X POST "http://localhost:3000/api/admin/auth" \
  -H "Content-Type: application/json" \
  -d '{"key":"admin123"}'
# Expected: 200 OK JSON {"success":true}.
```

---

## 3. Responsive Breakpoint & Performance Criteria

### Responsive Breakpoints Audit
- **Mobile (`375px` - iPhone SE / 13):** Navbar converts to drawer toggle; course grid collapses to 1 column; mobile sticky ad remains anchored.
- **Tablet (`768px` - iPad Air):** Course grid adapts to 2 columns; category pills scroll horizontally.
- **Desktop (`1280px` - Full HD):** Course grid expands to 3 columns; header search bar fully expanded; sidebar ad containers enabled.

### Performance Benchmarks (Lighthouse Criteria)
- **Performance Score:** ≥ 90 / 100
- **Largest Contentful Paint (LCP):** ≤ 2.5 seconds
- **Cumulative Layout Shift (CLS):** ≤ 0.1 (Ad container dimensions pre-reserved)
- **First Input Delay / INP:** ≤ 200 milliseconds

---

## 4. Master QA Execution Checklist Sign-Off

- [x] All 15 Homepage Test Cases (`TC-HP-01` to `TC-HP-15`) Verified PASS.
- [x] All 13 Admin Portal Test Cases (`TC-ADM-01` to `TC-ADM-13`) Verified PASS.
- [x] All 4 Ad Container Test Cases (`TC-AD-01` to `TC-AD-04`) Verified PASS.
- [x] All 4 Legal Compliance Test Cases (`TC-LEG-01` to `TC-LEG-04`) Verified PASS.
- [x] All 4 API Endpoint cURL Contracts Verified PASS.
- [x] Next.js Production Build (`npm run build`) Zero Errors Sign-Off.
