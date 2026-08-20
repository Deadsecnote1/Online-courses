# P03 - Launch Plan (Vercel + Firebase Spark)

#project #launch #vercel #firebase #spark #checklist

> **Goal:** Ship the MVP at **$0/month** — Vercel hosts the site; Firebase Spark holds the catalog.  
> **Architecture:** [[Architecture - Platform Stack]]  
> **Parent:** [[P01 - Free Course Website MVP]]  
> **After launch:** [[P02 - Revenue Plan and Unit Economics]]  
> **Master Index:** [[Vault Overview]]

---

## Phase 0 — Prerequisites

- [ ] GitHub repo with this codebase pushed
- [ ] Node 20 locally (`node -v`)
- [ ] Firebase project **`free-course-platform`** created
- [ ] Billing stays on **Spark** (no Blaze required for this plan)

---

## Phase 1 — Firebase (database only)

### 1.1 Create Firestore
1. [Firebase Console](https://console.firebase.google.com/) → project **free-course-platform**
2. **Build** → **Firestore Database** → **Create database**
3. **Standard edition** → **Next**
4. Database ID: `(default)`
5. Location: **`us-central1`** (cannot change later)
6. **Start in production mode** → **Create**

### 1.2 Deploy security rules (local, once)
```bash
cd /path/to/free-course
npm install -g firebase-tools
firebase login
firebase use free-course-platform
firebase deploy --only firestore
```

You should see `firestore.rules` deployed (all client access denied).

### 1.3 Service account (for Vercel + GitHub)
1. [Google Cloud Console](https://console.cloud.google.com/) → project **free-course-platform**
2. **IAM & Admin** → **Service accounts**
3. Default Firebase Admin SDK account → **Keys** → **Add key** → **JSON** → download
4. Store safely; never commit to git

### 1.4 Verify locally
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
FIREBASE_PROJECT_ID=free-course-platform
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...entire JSON one line...}
ADMIN_SECRET_KEY=choose-a-long-random-string
CRON_SECRET=another-random-string
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

```bash
npm run dev
```

- Open `http://localhost:3000`
- Firebase Console → Firestore → collection **`courses`** should appear after first page load
- `GET /api/courses` response includes `"driver":"firestore"`

**Phase 1 done when:** local app reads/writes Firestore.

---

## Phase 2 — Vercel (hosting)

### 2.1 Import project
1. [vercel.com](https://vercel.com) → sign in with GitHub
2. **Add New** → **Project** → import your `free-course` repo
3. Framework: **Next.js** (auto)
4. Root directory: `.`
5. Do **not** deploy yet — add env vars first

### 2.2 Production environment variables

In Vercel → Project → **Settings** → **Environment Variables**, add for **Production** (and Preview if you want):

| Name | Value |
| :--- | :--- |
| `FIREBASE_PROJECT_ID` | `free-course-platform` |
| `FIREBASE_SERVICE_ACCOUNT` | Full JSON from Phase 1.3 (single line) |
| `ADMIN_SECRET_KEY` | Same as local |
| `CRON_SECRET` | Same as local |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-PROJECT.vercel.app` (update after first deploy) |
| `NEXT_PUBLIC_RAKUTEN_PUB_ID` | (empty until Rakuten approved) |

Optional later: `NEXT_PUBLIC_AFFILIATE_VPN_URL`, `VPS`, `TOOLS`.

### 2.3 Deploy
1. **Deploy** (or push to `main` if Git integration is on)
2. Wait for build green
3. Open production URL → homepage loads
4. `/admin` → login with `ADMIN_SECRET_KEY`
5. Update `NEXT_PUBLIC_SITE_URL` in Vercel to the final URL → **Redeploy**

**Phase 2 done when:** production site + admin work against Firestore.

---

## Phase 3 — GitHub Actions

### 3.1 Repository secrets

**Settings** → **Secrets and variables** → **Actions**:

| Secret | Purpose |
| :--- | :--- |
| `FIREBASE_SERVICE_ACCOUNT_FREE_COURSE` | Full service account JSON |
| `ADMIN_SECRET_KEY` | (optional) for future CI tests |

### 3.2 Workflows (already in repo)

| Workflow | Trigger | Does |
| :--- | :--- | :--- |
| `firestore-rules.yml` | push `main` | Deploy `firestore.rules` only |
| `sync-coupons.yml` | every 6h + manual | Ingest + expire → Firestore |

Vercel deploys the **app** on its own when connected to GitHub — no `firebase-deploy` workflow.

### 3.3 Test cron manually
GitHub → **Actions** → **Sync Free Udemy Coupons** → **Run workflow**  
Check Firestore for new pipeline coupons (Rust/Docker samples if not already present).

**Phase 3 done when:** rules deploy + sync workflow succeed.

---

## Phase 4 — Custom domain (optional)

1. Vercel → **Domains** → add `courses.yourdomain.com`
2. Add DNS records Vercel shows
3. Set `NEXT_PUBLIC_SITE_URL=https://courses.yourdomain.com`
4. Redeploy
5. Use this URL in Telegram/WhatsApp templates ([[Swipe File - Broadcast Templates]])

---

## Phase 5 — Go-live checklist

- [ ] Firestore `courses` populated in production
- [ ] `/admin` secured (not `admin123`)
- [ ] Legal pages live: `/privacy-policy`, `/terms-of-service`, `/affiliate-disclosure`
- [ ] `/course/[id]` share links use production `NEXT_PUBLIC_SITE_URL`
- [ ] Manual QA spot-check ([[SOP - Manual QA Execution Runbook]])
- [ ] Revenue R0 when ready ([[P02 - Revenue Plan and Unit Economics]])

---

## Phase 6 — Ongoing ops

| Task | Where |
| :--- | :--- |
| Deploy code | `git push main` → Vercel auto-build |
| Deploy Firestore rules | push `main` → GitHub Action |
| Refresh coupons | `/admin` Sync or wait for 6h cron |
| Moderate deals | `/admin` |
| Monitor costs | Firebase Spark + Vercel Hobby = $0 at MVP scale |

---

## Troubleshooting

| Symptom | Fix |
| :--- | :--- |
| `"driver":"memory"` on production | Add `FIREBASE_SERVICE_ACCOUNT` in Vercel env; redeploy |
| Permission denied Firestore | Service account needs Firestore/Datastore access in GCP IAM |
| Admin 401 | `ADMIN_SECRET_KEY` mismatch between browser session and Vercel env |
| Empty catalog | Trigger sync or visit homepage once to seed |
| Build fails on Vercel | Check build logs; run `npm run build` locally |

---

## Definition of done for P03

1. Production URL on Vercel serves the directory from **Firestore**.
2. Firebase stays on **Spark** (no Blaze).
3. GitHub sync + rules workflows green.
4. Custom domain optional but documented.
