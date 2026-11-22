<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Headhunters landing jobs block (2026-10-21)

STATUS: **READY** — Ticket #d9ffaa (788be9992d7afc1fc6d9ffaa) «Landing pages: placeholder testimonials, repeated job card and "30 יום ניסיון"». Passed QA 21.10.2026. Testimonials and the «30 יום ניסיון» banner stay as they are (agreed) — NOT tested. The reject allows 3 variants (14 different jobs / one row / moving strip); the developer implemented 2 rows × 7 different jobs, verified 21.10 — the count assertions pin that variant, the main assertion is "no repeated job".
Source of expectations: reject rej_1792420491424 «needed behavior» (Done when no job card appears twice in one viewport of the block). Evidence: `.qa/screenshots/2026-10-21/d9ffaa-*.png`.
Rules: guest only (no storageState); no fixed waits / networkidle — wait for results via expect(); read-only (no @data). Do not run — only /qa-regress runs tests.

---

### 1. Headhunters landing jobs block
**Seed:** `tests/seed.spec.ts` (guest)

#### 1.1 Jobs block shows 14 different jobs in two rows (he) @desktop @prod-safe (#d9ffaa)
**Device:** desktop · **Users:** guest · **Case:** `.qa/tests/landing-jobs-block/JB-1-1.md`
**Steps:**
1. Open /headhunters as guest.
2. Scroll to the jobs block «רק חלק מהמשרות שמחכות לכם בפנים».
3. Collect the job cards of the block, grouped by row (cards with the same top offset form a row); read each card title.
**Expected:**
- Exactly 2 rows with 7 cards each (14 cards).
- All 14 card titles are different (no title appears twice in the block).
- Every card has a title, a location and a salary range.
- (source: reject rej_1792420491424 «needed behavior» (Done when no job card appears twice in one viewport of the block))

#### 1.2 Jobs block shows 14 different jobs in two rows (en) @desktop @prod-safe (#d9ffaa)
**Device:** desktop · **Users:** guest · **Case:** `.qa/tests/landing-jobs-block/JB-1-2.md`
**Steps:**
1. Open /en/headhunters as guest.
2. Scroll to the jobs block (English heading of the same block — take the actual text from the page).
3. Collect the job cards of the block, grouped by row (cards with the same top offset form a row); read each card title.
**Expected:**
- Exactly 2 rows with 7 cards each (14 cards).
- All 14 card titles are different (no title appears twice in the block).
- Every card has a title, a location and a salary range.
- (source: reject rej_1792420491424 «needed behavior» (Done when no job card appears twice in one viewport of the block))

#### 1.3 Jobs block rows have no repeated job on phone @mobile @prod-safe (#d9ffaa)
**Device:** mobile · **Users:** guest · **Case:** `.qa/tests/landing-jobs-block/JB-1-3.md`
**Steps:**
1. Open /headhunters as guest on a phone.
2. Scroll to «רק חלק מהמשרות שמחכות לכם בפנים».
3. Collect all job card titles of row 1 and row 2.
**Expected:**
- No card title appears twice within the block (row 1 ∩ row 2 is empty, no duplicate inside a row).
- Row 1 and row 2 each have 7 cards.
- (source: reject rej_1792420491424 «needed behavior» (Done when no job card appears twice in one viewport of the block))
**Note:** Do NOT assert "no horizontal page scroll" here: /headhunters mobile h-scroll is a separate open finding (d9ffaa-finding-hscroll-mobile), outside this ticket.
