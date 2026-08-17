# SOP: Git Repository Hygiene & Firebase Deployment

#sop #devops #git #firebase #ci-cd #deployment

> **Document Type:** DevOps & Release SOP  
> **Area:** Software Engineering & Infrastructure  
> **Target Audience:** Release Engineers, Admins, Developers  
> **Parent Project:** [[P01 - Free Course Website MVP]]  
> **QA Protocol:** [[SOP - Comprehensive Webpage QA Testing Protocol]]  
> **Master Index:** [[Vault Overview]]

---

## 1. Git Repository Hygiene & Index Cleaning

To maintain a clean GitHub repository free of binary bloat, `.next/` build outputs, and `.env` secrets:

### Standard `.gitignore` Exclusions
Ensure `.gitignore` contains rules for:
- Dependencies: `node_modules/`, `.pnp*`
- Next.js build outputs: `.next/`, `out/`, `build/`
- Environment secrets: `.env`, `.env*.local`, `.env.production`
- Test artifacts: `playwright-report/`, `test-results/`, `coverage/`
- Firebase/Vercel caches: `.firebase/`, `firebase-debug.log*`, `.vercel`

### Cleaning Git Staging Index
If `node_modules/` or build artifacts were previously tracked by mistake:

```bash
# 1. Remove all tracked files from git index (leaves local disk files intact)
git rm -r --cached .

# 2. Re-add files adhering to updated .gitignore rules
git add .

# 3. Inspect staged changes to verify node_modules is ignored
git status

# 4. Commit clean initial state
git commit -m "chore: clean git index and configure gitignore"
```

---

## 2. Firebase Hosting Configuration

The Next.js App Router application is configured for Firebase Hosting via Next.js Web Frameworks integration.

### `firebase.json` Configuration
```json
{
  "hosting": {
    "source": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "frameworksBackend": {
      "region": "us-central1"
    }
  }
}
```

### `.firebaserc` Environment Target
```json
{
  "projects": {
    "default": "free-course-platform-2026"
  }
}
```

---

## 3. GitHub Actions Automated Deployment Workflow

The workflow `.github/workflows/firebase-deploy.yml` automatically triggers on `git push` to `main`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Unit Tests
        run: npx vitest run

      - name: Build Next.js Application
        env:
          NEXT_PUBLIC_RAKUTEN_PUB_ID: ${{ secrets.RAKUTEN_PUB_ID }}
          ADMIN_SECRET_KEY: ${{ secrets.ADMIN_SECRET_KEY }}
        run: npm run build

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_FREE_COURSE }}'
          channelId: live
          projectId: free-course-platform-2026
```

---

## 4. Release Checklist & Step-by-Step Push to GitHub

1. **Set Up GitHub Secrets (`Settings > Secrets and variables > Actions`):**
   - `RAKUTEN_PUB_ID`: Your Rakuten Publisher Token.
   - `ADMIN_SECRET_KEY`: Secret password for `/admin` web console.
   - `FIREBASE_SERVICE_ACCOUNT_FREE_COURSE`: Service account key JSON for Firebase Hosting.

2. **Push to Remote GitHub Repository:**
   ```bash
   git add .
   git commit -m "feat: complete MVP launch with Next.js platform, /admin portal, tests, and Firebase deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/free-course-platform.git
   git push -u origin main
   ```
