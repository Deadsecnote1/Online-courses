# P01 - Free Course Website MVP

#project #mvp #backlog #nextjs #tailwind #admin

> **Project Goal:** Design, build, and deploy a high-performance web platform that aggregates, filters, and publishes 100% free Udemy discount coupon links, monetized via display ads and affiliate deep-links.

---

## 1. Project Metadata
- **Status:** ✅ MVP built — launch via [[P03 - Launch Plan (Vercel + Firebase Spark)]] (Vercel + Firestore). Revenue: [[P02 - Revenue Plan and Unit Economics]].
- **Hosting:** [[Architecture - Platform Stack|Vercel]] · **DB:** Firebase Spark Firestore
- **Target Launch:** Q3 2026
- **Primary Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Fuse.js, Node.js Scraper
- **Monetization Engine:** Google AdSense (Display Units) + Rakuten Advertising (Udemy Affiliate Deep Links)
- **Primary Traffic Drivers:** Telegram Broadcast Channels, WhatsApp Broadcast Channels, Organic Search (SEO)
- **Web Admin Portal:** [[SOP - Admin Operations and Revenue Guide|Web Dashboard (/admin)]]
- **Related SOP:** [[SOP - Automated Sourcing Pipeline]]
- **Monetization Blueprint:** [[Architecture - Monetization and Ad Placements]]
- **Revenue Plan:** [[P02 - Revenue Plan and Unit Economics]]
- **Launch Plan:** [[P03 - Launch Plan (Vercel + Firebase Spark)]]
- **Social Swipe File:** [[Swipe File - Broadcast Templates]]
- **Master Index:** [[Vault Overview]]

---

## 2. Sprint Backlog & Feature Breakdown

### Phase 1: Core Web Platform Setup
- [x] Workspace Initialization & Directory Setup
- [x] Next.js 14+ (App Router) + TypeScript Boilerplate Setup
- [x] Tailwind CSS Design System Configuration (Dark Mode default, gradient accents, custom glassmorphism utilities)
- [x] Global Layout (`layout.tsx`) with dynamic SEO Meta Tags, Open Graph previews, and header/footer components
- [x] Component: Navbar (`Header.tsx`) with instant search bar, category navigation links, and mobile drawer
- [x] Component: Hero Banner with live statistics (Active Courses, Total Saved, Last Updated Ticker)

### Phase 2: Dynamic Course Directory & Interactive Filters
- [x] Data Schema Definition (`src/types/course.ts`)
- [x] Course Card Component (`CourseCard.tsx`):
  - [x] 100% OFF Badge & Expiry Countdown Ticker
  - [x] Star Rating, Instructor Name, Student Count
  - [x] "Copy Coupon Code" button with instant visual feedback toast
  - [x] "Get Free Course" direct Rakuten affiliate redirect button
  - [x] "Report Expired" broken link trigger with modal dialog
- [x] Client-Side Search Engine (`Fuse.js` integration for fuzzy title/instructor search)
- [x] Category Filter Pills (Development, IT & Cyber Security, Business, Design, Marketing, Data Science)
- [x] Sorting Drawer (Newest, Expiry Soonest, Highest Rated, Most Popular)

### Phase 3: Dedicated Web Admin Dashboard (`/admin`)
- [x] Password PIN Gate Challenge Modal (`/api/admin/auth`)
- [x] Real-time Admin Metric Cards (Active Deals, Expired Deals, Flagged Reports, Catalog Value)
- [x] Course Moderation Table with 1-Click "Reset Reports", "Force Expire", "Toggle Featured", and "Delete"
- [x] Add New Course Form with automatic Rakuten affiliate link generator
- [x] 1-Click Pipeline Scraper Trigger (`/api/sync-coupons`)
- [x] 1-Click Telegram / WhatsApp Broadcast Post Copy Generator (formatted with UTM parameters)

### Phase 4: Monetization & Ad Layout Placement
- [x] Responsive Google AdSense Container Component (`AdBanner.tsx`)
- [x] Header Leaderboard Unit (`728x90` / Responsive Top Banner)
- [x] In-Feed Ad Slots (Automatically injected every 6th card in grid)
- [x] Sidebar Sticky Rectangle (`300x250` / `300x600` Desktop)
- [x] Floating Sticky Bottom Mobile Banner (`320x50` / `360x50`)
- [x] Secondary Affiliate Widgets (Cloud Hosting referral cards, VPN banners, Developer tool discounts)

### Phase 5: Legal & Compliance Pages
- [x] `/privacy-policy` Route: GDPR/CCPA compliant privacy statement, cookie tracking disclosures
- [x] `/terms-of-service` Route: Disclaimer of course availability, Udemy trademark disclaimer
- [x] `/affiliate-disclosure` Route: FTC compliance disclosure regarding affiliate link commissions

### Phase 6: Automated Sourcing & Pipeline Integration
- [x] Shared catalog: Firestore `courses` (Admin SDK) with memory fallback for tests / offline dev
- [x] Pipeline module (`src/lib/couponPipeline.ts`) **actually appends** new coupons; CLI + `POST /api/sync-coupons`
- [x] Coupon regex extraction + Rakuten wrap; expire on `expires_at` or `report_count >= 3`
- [x] GitHub Actions validates CLI and optionally POSTs the live site (`SITE_URL` + `CRON_SECRET`)
- [x] Share/deal route `/course/[id]`; footer category query `/?category=`
- [x] Search respects category and hides expired deals (`filterDirectory`)

---

## 3. Definition of Done (DoD)
1. **Performance:** Lighthouse Score > 90 for Mobile & Desktop (LCP < 2.5s, CLS < 0.1).
2. **Reliability:** Public catalog is the API catalog; sync ingest is real in-process; unknown IDs return 404.
3. **Admin Control:** Dedicated `/admin` route allows deal posting, moderation, and authenticated pipeline sync.
4. **Compliance:** FTC affiliate disclosure banner visible on all pages; privacy policy fully accessible.

**Still not done:** real RSS feeds; partner IDs for revenue. Catalog persists in Firestore. See [[SOP - Automated Sourcing Pipeline]] and [[P03 - Launch Plan (Vercel + Firebase Spark)]].
