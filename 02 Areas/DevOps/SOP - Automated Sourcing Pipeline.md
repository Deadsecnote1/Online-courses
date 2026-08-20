# SOP: Automated Sourcing Pipeline

#sop #automation #cron #pipeline #data-ingestion

> **Document Type:** Standard Operating Procedure (SOP)  
> **Area:** DevOps & Data Engineering  
> **Platform:** [[Architecture - Platform Stack]]  
> **Frequency:** Every 6 hours (GitHub Action) + on-demand from `/admin`  
> **Catalog:** Cloud Firestore collection `courses` (Admin SDK). Memory fallback if no Firebase credentials (`CATALOG_DRIVER=memory`).  
> **Pipeline module:** `src/lib/couponPipeline.ts`  
> **CLI:** `scripts/scrape-coupons.ts`  
> **HTTP:** `POST /api/sync-coupons`  
> **Workflow:** `.github/workflows/sync-coupons.yml`  
> **Parent Project:** [[P01 - Free Course Website MVP]]  
> **Master Index:** [[Vault Overview]]

---

## 1. What is actually true (read this first)

The public site and admin UI share **Cloud Firestore** (`courses` documents, keyed by course id):

1. First read against an empty collection **seeds** from `src/data/mockCourses.ts`.
2. Admin add/expire/delete, reports, and pipeline ingest **write to Firestore**.
3. Homepage loads `GET /api/courses` on **Vercel**, which reads Firestore via `firebase-admin`.
4. Clients never talk to Firestore directly (`firestore.rules` deny all). Next.js APIs use `firebase-admin`.

**Local without credentials:** `catalogStore` uses in-memory seed so `next dev` still works. Copy `.env.example` → `.env.local` and add a service account to use the real DB.

**GitHub Actions:** `sync-coupons.yml` runs `scripts/scrape-coupons.ts` with `FIREBASE_SERVICE_ACCOUNT` and writes Firestore.

External RSS is **not wired**. Ingest still uses hardcoded `PIPELINE_FEEDS` until a real feed client is added.

---

## 2. Coupon code extraction

Used by `extractCouponCode()`:

```text
/(?:[?&](?:couponCode|coupon_code|code)=)([^&]+)/i
```

---

## 3. Affiliate wrap

Every ingested or admin-created URL goes through `generateUdemyAffiliateUrl()` (Rakuten `mid=13884`, SubID `cron_sync` or `admin_portal`).

---

## 4. Expiration

`expireStaleCourses()` / `isCourseStale()`:

1. `expires_at <= now` → `is_expired = true`
2. `report_count >= 3` → `is_expired = true`

Public directory (`filterDirectory`, default) hides expired rows. `GET /api/courses?id=` still returns an expired deal so share links do not 404.

---

## 5. How to run

### Admin (preferred for the running app)

1. Log in to `/admin`.
2. Click **Sync Scraper Pipeline**.
3. Request uses `Authorization: Bearer <admin key>`.
4. New feed coupons are **pushed** into the catalog; stale rows are expired.
5. Refresh `/` to see new cards.

### CLI

```bash
npx tsx scripts/scrape-coupons.ts
```

With Firebase credentials in the environment, this writes **Firestore**. Without them, it only mutates process memory.

### GitHub Actions

`sync-coupons.yml` runs the CLI with `FIREBASE_SERVICE_ACCOUNT_FREE_COURSE` so ingest lands in Firestore every 6 hours.

Admin **Sync Scraper Pipeline** also writes Firestore via `POST /api/sync-coupons`.

Sync auth accepts **either** `CRON_SECRET` or `ADMIN_SECRET_KEY`.

---

## 6. Manual add

Use `/admin` → Add Course. Do not edit `mockCourses.ts` for day-to-day deals (that file is seed only).
