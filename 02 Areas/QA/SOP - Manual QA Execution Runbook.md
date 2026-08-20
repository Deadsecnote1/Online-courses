# SOP: Manual QA Execution Runbook (Re-test)

#sop #qa #manual #retest #signoff

> **Document Type:** Live execution sheet  
> **Execution:** 19 Aug 2026 — tester reported **all sessions PASS** (0 FAIL, 0 BLOCKED)  
> **Base URL:** `http://localhost:3000`  
> **Protocol (reference):** [[SOP - Comprehensive Webpage QA Testing Protocol]]  
> **Parent:** [[P01 - Free Course Website MVP]]  
> **After launch:** [[P03 - Launch Plan (Vercel + Firebase Spark)]] then [[P02 - Revenue Plan and Unit Economics]]  
> **Master Index:** [[Vault Overview]]

---

## How to record a result

For every ID, reply with one of: **PASS** | **FAIL** | **BLOCKED**

On FAIL / BLOCKED include:

1. Test ID  
2. What you did  
3. What you saw  
4. What you expected  
5. Viewport (desktop / tablet / phone) and browser  

Then we debug that session before starting the next one.

---

## Session 0 — Setup (do once)

- [ ] `npm run dev` is running with no compile errors  
- [ ] Open `http://localhost:3000` in Chrome (or Edge)  
- [ ] DevTools → Network is open (we will use it in later sessions)  
- [ ] You have a **desktop** window (~1280px) and will use **phone width** later (375px)  

**Stop.** Tell me Session 0 PASS/FAIL. If the site does not load, we debug before Session 1.

---

## Session 1 — Homepage: load, search, filter, sort

| ID | Do this | Pass if |
| :--- | :--- | :--- |
| `M-HP-01` | Load `/`. Look at the top green **LIVE DEALS** bar. | Count of active deals matches the number of course cards (not ads). Hero “Available Deals” matches that count. |
| `M-HP-02` | Desktop: type `Python` in the header search. | Grid shows Python-related courses only, quickly, without a page reload. |
| `M-HP-03` | Clear search. Type `Stephane`. | AWS / Stephane Maarek course appears. |
| `M-HP-04` | With text in search, click the **X** in the search box. | Query clears; full grid returns. |
| `M-HP-05` | Click category pill **IT & Security**. | Only IT & Security cards. Pill looks selected (indigo). |
| `M-HP-06` | Click **All**, then sort **Most Popular**. | First course has the highest student count (AWS is 112,000 in mock data). |
| `M-HP-07` | Sort **Top Rated**. | Highest rating first (4.9s before 4.8s). |
| `M-HP-08` | Sort **Newest**. | Grid changes vs Popular (order is not identical). |
| `M-HP-09` | Search `xyz999nonexistent`. | Empty state: “No courses matched your search” and **Reset Search & Filters**. Click reset → catalog returns. |
| `M-HP-10` | Logo **FREECOURSES** click (from any scroll position). | Stays on or returns to `/`. |

**Stop.** Paste results for `M-HP-01` … `M-HP-10`. We debug, then Session 2.

---

## Session 2 — Course card, claim, report, detail modal

Use the Python card when a specific course is needed (`FREEPYTHON2026`).

| ID | Do this | Pass if |
| :--- | :--- | :--- |
| `M-CD-01` | On a card, click **Copy Code** (not the card body). | Button becomes **Copied!** (green). Paste somewhere: coupon matches the code on the card. Confetti is optional. |
| `M-CD-02` | Click **Get 100% Free Course**. | New tab. URL contains `click.linksynergy.com` and `mid=13884`. Tab is not the same as the directory. (Udemy may 404 — still PASS if Rakuten URL is correct; note destination.) |
| `M-CD-03` | Look at the countdown on the image (`… left` or `Expired`). | Readable; not `NaN` / blank. Struck-through price and **$0.00** both show. |
| `M-CD-04` | Click the **card body** (title/image), not the buttons. | Detail modal opens: title, instructor, description, copy + claim still work. |
| `M-CD-05` | In the modal, Telegram / WhatsApp share. | New tab/app with prefilled text that mentions the course. Close extra tabs. |
| `M-CD-06` | Close modal (X and click-outside if supported). | Modal gone; page usable. If click-outside does nothing, mark FAIL and say so. |
| `M-CD-07` | Card: **Report Broken Code**. | Modal title like “Report Dead Deal / Broken Code”. |
| `M-CD-08` | Leave default reason, submit. | Success (“Thank You…”). After it closes, report count on that card goes up (e.g. `(1)`). Network: `POST /api/report-expired` → 200. |
| `M-CD-09` | Copy and Claim inside the modal. | Same as card: clipboard + new Rakuten tab. Clicks do not close the modal accidentally. |
| `M-CD-10` | Featured badge on at least one card. | “Featured” visible on Python / hacking / AWS style cards. |

**Stop.** Paste `M-CD-*` results. We debug, then Session 3.

---

## Session 3 — Ads, layout, desktop + phone

| ID | Do this | Pass if |
| :--- | :--- | :--- |
| `M-AD-01` | Desktop: area **under the hero**, above the grid. | A reserved ad/sponsor block is there (leaderboard). Content below does not jump after load. |
| `M-AD-02` | Count course cards. Find **Sponsored Ad** / in-feed cards. | An in-feed sponsored card appears after every 6th **course** (not counting itself). |
| `M-AD-03` | Scroll to bottom on desktop. | A **SPONSORED** bar is stuck to the bottom of the window. It must not hide the last card’s **Report** link — if it does, FAIL. |
| `M-AD-04` | Open a course modal. Look for a tool/VPN/VPS style extra offer. | Present or absent — record honestly. Architecture promised a widget; missing = FAIL for this ID. |
| `M-AD-05` | DevTools device **375px** width, reload `/`. | 1-column cards. Hamburger menu opens/closes. Search still works (header or drawer). Sticky footer still visible. |
| `M-AD-06` | **768px** width. | About 2 columns; category pills usable (scroll if needed). |
| `M-AD-07` | **1280px**. | About 3 columns; desktop search visible. |
| `M-AD-08` | Phone: tap Copy, Claim, Report. | Same behavior as desktop; no double-open of modal when tapping Copy. |

**Stop.** Paste `M-AD-*`. We debug, then Session 4.

---

## Session 4 — Footer and legal pages

| ID | Do this | Pass if |
| :--- | :--- | :--- |
| `M-LG-01` | Footer → **Privacy Policy**. URL `/privacy-policy`. | Mentions cookies / AdSense or tracking / Rakuten or affiliates. Readable, not empty. |
| `M-LG-02` | Footer → **Terms of Service**. | Mentions availability / Udemy as trademark or independent site. |
| `M-LG-03` | Footer → **Affiliate Disclosure**. | FTC-style “we may earn”; free coupon guarantee. |
| `M-LG-04` | On each legal page, **Back to Free Courses** (or equivalent). | Returns to `/`. |
| `M-LG-05` | Footer “Popular Domains” links (Python, Hacking, etc.). | They go somewhere useful **or** FAIL if they all dump to `/` with no filter. Record what happens. |
| `M-LG-06` | Header **Telegram Channel** and **WhatsApp Alerts**. | New tab. (Placeholder `t.me` / `whatsapp.com` is OK for QA; note if it is generic.) |

**Stop.** Paste `M-LG-*`. We debug, then Session 5.

---

## Session 5 — Admin (`/admin`)

Default PIN if unset: `admin123`.  
If you already logged in, **Logout** first so auth tests are real.

| ID | Do this | Pass if |
| :--- | :--- | :--- |
| `M-ADMN-01` | Open `/admin` logged out (or private window). | PIN / secret key screen only. No course table. |
| `M-ADMN-02` | Submit `wrong123`. | Error similar to **Invalid Admin Access Key**. Still locked. |
| `M-ADMN-03` | Submit `admin123` (or your `.env` key). | Dashboard: metrics + table. |
| `M-ADMN-04` | Refresh the page. | Still logged in (key in `localStorage`). |
| `M-ADMN-05` | **Logout**. | Back to PIN. Refresh stays locked. |
| `M-ADMN-06` | Log in again. Read metric cards. | Active / flagged / expired / catalog value look consistent with the table (spot-check one number). |
| `M-ADMN-07` | Filter **Flagged**. | Only rows with reports. |
| `M-ADMN-08` | On a flagged row, **Reset Flags**. | Report count 0; row leaves Flagged filter. |
| `M-ADMN-09` | **Force Expire** on an active row. | Marked expired. Homepage (other tab, reload) should hide it. |
| `M-ADMN-10` | **Re-activate** that row. | Active again; homepage can show it after reload. |
| `M-ADMN-11` | **Draft**. Paste clipboard. | Telegram/WhatsApp-style text with course title and `utm_source=telegram` (or similar). |
| `M-ADMN-12` | **Delete** (confirm if prompted) on a test row if you added one — **or skip delete on mock catalog and note SKIP**. | Row gone. Prefer delete only after Add Course. |
| `M-ADMN-13` | Tab **Add**. Fill title, coupon, Udemy URL, publish. | Success; course in table; destination URL contains `click.linksynergy.com`. |
| `M-ADMN-14` | **Sync Scraper Pipeline** (or header sync). | Message with synced counts, or a clear error (record the exact text). |

**Stop.** Paste `M-ADMN-*`. We debug, then Session 6.

---

## Session 6 — Smoke APIs + broken URL (DevTools Network)

Stay on the site; you do not need curl unless you want it.

| ID | Do this | Pass if |
| :--- | :--- | :--- |
| `M-API-01` | Reload `/`. Find `GET /api/courses` if the homepage calls it. | 200, or note if homepage is mock-only (no call). Either is a finding — record it. |
| `M-API-02` | Submit one report. | `POST /api/report-expired` → 200 and `success: true`. |
| `M-API-03` | Admin login Network. | `POST /api/admin/auth` → 200 on good key, 401 on bad. |
| `M-API-04` | Open `http://localhost:3000/this-page-does-not-exist`. | A not-found page, not a blank crash. |
| `M-API-05` | Console on `/` and `/admin`: no red errors during the happy path. | 0 unexpected red errors. Warnings: note them, not auto-fail. |

**Stop.** Paste `M-API-*`. Then we close remaining bugs and only after that talk revenue.

---

## Sign-off (QA lead — after all sessions + fixes)

- [x] Sessions 0–6 executed for real (tester: everything PASS)  
- [x] All FAIL items fixed or accepted in writing (none raised)  
- [x] Ready for revenue work ([[P02 - Revenue Plan and Unit Economics]])

**QA verdict:** Website functional QA is closed. Function-level repairs landed 19 Aug 2026 (shared catalog, real ingest, search+category, `/course/[id]`, 404s, offer env URLs). Re-spot-check Session 1 search-within-category, Session 2 share URL, Session 5 sync “new” count, then revenue ([[P02 - Revenue Plan and Unit Economics]]).
