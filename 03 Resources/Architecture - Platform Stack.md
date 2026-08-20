# Architecture: Platform Stack (Vercel + Firebase Spark)

#architecture #vercel #firebase #firestore #spark #infra

> **Document Type:** Infrastructure blueprint (single source of truth)  
> **Plan:** [[P03 - Launch Plan (Vercel + Firebase Spark)]]  
> **Parent Project:** [[P01 - Free Course Website MVP]]  
> **Release SOP:** [[SOP - Git Hygiene and Release]]  
> **Master Index:** [[Vault Overview]]

---

## 1. Why this split

| Layer | Provider | Plan | Role |
| :--- | :--- | :--- | :--- |
| **Website + APIs** | [Vercel](https://vercel.com) | Free (Hobby) | Next.js App Router, `/api/*`, `/admin`, SSR |
| **Database** | [Firebase](https://firebase.google.com) | **Spark** ($0) | Cloud Firestore collection `courses` |
| **Coupon cron** | GitHub Actions | Free | Writes Firestore every 6h via service account |

Firebase **Hosting + Next.js SSR requires Blaze**. Spark cannot run this app on Firebase Hosting.  
Vercel free tier runs Next.js server routes; Firebase Spark only stores data.

```
                    ┌─────────────────────────────────────┐
                    │           End users / admin           │
                    └──────────────────┬──────────────────┘
                                       │ HTTPS
                    ┌──────────────────▼──────────────────┐
                    │  Vercel (Next.js 15, us region)      │
                    │  /  /admin  /course/[id]  /api/*     │
                    └──────────────────┬──────────────────┘
                                       │ firebase-admin (server only)
                    ┌──────────────────▼──────────────────┐
                    │  Firebase Spark — Firestore           │
                    │  collection: courses                  │
                    │  firestore.rules → deny all clients   │
                    └──────────────────▲──────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │  GitHub Actions sync-coupons.yml      │
                    │  scripts/scrape-coupons.ts            │
                    └───────────────────────────────────────┘
```

---

## 2. Firebase project

| Setting | Value |
| :--- | :--- |
| Project ID | `free-course-platform` |
| Plan | **Spark** |
| Firestore | Standard edition, **`us-central1`**, production rules |
| Collection | `courses` (doc id = `course.id`) |
| Client SDK | **Not used** — all access via Admin SDK on Vercel |

First API read on empty DB seeds from `src/data/mockCourses.ts`.

---

## 3. Vercel project

| Setting | Value |
| :--- | :--- |
| Framework | Next.js (auto-detected) |
| Root | repository root |
| Build | `npm run build` |
| Env | Mirror `.env.example` (see [[P03 - Launch Plan (Vercel + Firebase Spark)#Phase 3 — Environment variables]]) |

Production URL becomes `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-app.vercel.app`).

---

## 4. Repo layout (code vs knowledge)

```
free-course/
├── src/                    # Next.js app
│   ├── app/                # routes + API
│   ├── components/
│   ├── data/catalogStore.ts
│   └── lib/
│       ├── firebaseAdmin.ts
│       └── couponPipeline.ts
├── scripts/scrape-coupons.ts
├── firebase.json           # Firestore rules only (no hosting)
├── firestore.rules
├── .firebaserc
├── .github/workflows/
│   ├── firestore-rules.yml
│   └── sync-coupons.yml
└── 00 Meta/ … 03 Resources/   # Obsidian second brain (PARA)
```

---

## 5. Security model

- **Firestore rules:** deny all reads/writes from browsers (`firestore.rules`).
- **Admin routes:** `ADMIN_SECRET_KEY` bearer on `/api/admin/*`.
- **Sync:** `CRON_SECRET` or admin key on `POST /api/sync-coupons`.
- **Secrets:** never commit `.env.local` or service account JSON.

---

## 6. What we deliberately do not use

- Firebase Hosting for this Next.js app (needs Blaze).
- Firebase client SDK in the browser.
- Supabase / separate DB (Firestore is the catalog).
