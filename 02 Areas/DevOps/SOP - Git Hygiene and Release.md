# SOP: Git Hygiene and Release

#sop #devops #git #vercel #firebase #release

> **Document Type:** DevOps & release SOP  
> **Stack:** Vercel (app) + Firebase Spark (Firestore) — see [[Architecture - Platform Stack]]  
> **Launch checklist:** [[P03 - Launch Plan (Vercel + Firebase Spark)]]  
> **Parent Project:** [[P01 - Free Course Website MVP]]  
> **Master Index:** [[Vault Overview]]

---

## 1. Git repository hygiene

Keep secrets and build artifacts out of git.

### `.gitignore` essentials
- `node_modules/`, `.next/`, `out/`, `build/`
- `.env`, `.env*.local`
- `.firebase/`, `.vercel/`
- `*firebase-adminsdk*.json`
- `playwright-report/`, `test-results/`

### Clean index (if needed)
```bash
git rm -r --cached .
git add .
git status
git commit -m "chore: clean git index"
```

---

## 2. What deploys where

| Change type | Deploy path |
| :--- | :--- |
| Next.js code (`src/`, `package.json`) | **Vercel** — auto on push to connected branch |
| Firestore rules (`firestore.rules`) | **Firebase CLI** or GitHub `firestore-rules.yml` |
| Coupon ingest | GitHub `sync-coupons.yml` → Firestore |
| Obsidian vault (`00 Meta/`, etc.) | Git only — not deployed |

---

## 3. Firebase (Spark) — database config

### `firebase.json` (Firestore only — no Hosting)
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### `.firebaserc`
```json
{
  "projects": {
    "default": "free-course-platform"
  }
}
```

### Manual rules deploy
```bash
firebase login
firebase use free-course-platform
firebase deploy --only firestore
```

---

## 4. Vercel — application deploy

1. Connect GitHub repo at [vercel.com](https://vercel.com).
2. Framework: Next.js.
3. Set environment variables (see [[P03 - Launch Plan (Vercel + Firebase Spark)#Phase 2 — Vercel (hosting)]]).
4. Every push to `main` triggers production deploy (default).

Local verify before push:
```bash
npm run test
npm run build
```

---

## 5. GitHub Actions secrets

| Secret | Used by |
| :--- | :--- |
| `FIREBASE_SERVICE_ACCOUNT_FREE_COURSE` | `firestore-rules.yml`, `sync-coupons.yml` |
| `ADMIN_SECRET_KEY` | optional future CI |
| `RAKUTEN_PUB_ID` | optional build-time public env |

**Not needed:** Firebase Hosting deploy secret, Blaze billing.

---

## 6. Release checklist

1. [ ] `npm run test` && `npm run build` pass locally
2. [ ] `.env.local` not staged
3. [ ] `git push origin main`
4. [ ] Vercel deployment green
5. [ ] Smoke test production `/` and `/admin`
6. [ ] Firestore rules workflow green (if `firestore.rules` changed)

---

## 7. First-time setup pointer

Full step-by-step: [[P03 - Launch Plan (Vercel + Firebase Spark)]].

Do **not** use `firebase deploy` with a `hosting` block on Spark — it requires Blaze for Next.js SSR.
