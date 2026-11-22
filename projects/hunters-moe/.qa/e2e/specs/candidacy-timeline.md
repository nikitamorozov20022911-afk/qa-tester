<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Candidacy status timeline: each real event once, both states visible (2026-10-28)

STATUS: READY — #cea191 passed QA, user moved it to «הושלם» 2026-10-28. Not generated yet. Environment: staging.
Sources: ticket «מה רצוי» / Done when (brief `.qa/research/cea191.md`): «The timeline shows each real event once, in the order it happened: נשלחה → נצפה/תה → התבקש פרופיל מלא → סומן/ה כמתאים/ה (no repeated last step)»; «While the full-profile request is open, the current state is clear on both sides – … «מתאים/ה» also visible in the list card/view»; «The same for job applications (the timeline component is shared)»; Done when «… shows 4 timeline rows on both sides, without a duplicate». QA 28.10 (session.json): T-62, T-45, J-49 app 3d5257f9; screenshots `.qa/screenshots/cea191-*.png`.
Manual cases: `.qa/tests/candidacy-timeline/CT-*.md`.
Related (not duplicated): HR → tender submission flow — `tender-candidacy.md` §1 (its chain now also asserts the 4-row timeline, updated 28.10); status labels / «נצפה/תה» — `candidacy-status.md`.

**Rules (whole file):** one role per test file (Supabase rotating refresh tokens) — the cross-role job flow (§2) is a CHAIN `tests/candidacy-timeline/chain-timeline-job-<N>-<role>.spec.ts`, handoff `.qa/e2e/.handoff/timeline-job.json` (`{ runId, createdAt, candidate: { id?, name, phone }, applicationId }`; NOT test-results), later steps `test.skip(!handoff, 'run the chain from step 1')`; run in order `npx playwright test tests/candidacy-timeline/chain-timeline-job- --project=tests --workers=1`; chains are written by autotest-writer (handoff code), not by the generator. Saved sessions only; no fixed waits / `networkidle`. Created candidates: name prefix `QA-AUTO-`, UNIQUE phone `uniquePhone()` (`'05' + String(Date.now()).slice(-8)`, helper queued for `tests/add-candidate/helpers.ts` — add it first, see `GENERATION-QUEUE-2026-10-21.md`); every created item → `.qa/e2e/test-data-journal.log` (candidates have no UI delete — journal only). Never touch DEMO-* data. NEVER choose «לחייב NDA (₪35)» — always «אין צורך ב-NDA (ללא עלות)».
**How to count timeline rows:** the block titled «סטטוס מועמד» (owner / job sender) or «סטטוס המועמדות» (HR tender sender) — count its rows (each row = check icon + label + date). Read labels by text content (`toHaveText` / `allTextContents()`), NOT by visible text: labels are visually truncated with «…» (separate finding `cea191-finding-timeline-truncated-desktop.png` — do not assert truncation). The first row label differs by side: «נשלח/ה» (owner / job) or «המועמדות נשלחה» (HR tender sender) — match the first row with `/נשלח/`.
**Known findings — NOT asserted:** owner dialog title for an anonymous HR tender submission is empty «הגשת מועמד:» (`cea191-finding-owner-empty-title-desktop.png`) — do not assert the dialog title.
Not automated: order by time of real events (timestamps are dates only); the server event list (API) — UI rows only.

---

### 1. Tender candidacy timeline — existing 22.10 / 28.10 data (read-only)
**Seed:** `tests/seed.company_6.spec.ts` (1.1, 1.2), `tests/seed.company.spec.ts` (1.3)

Data (KEEP — do not change statuses): T-62 «QA-AUTO 2110 tsub» HR anonymous submission e9a47077-7545-47cf-89fd-573d4b6bb7a9; T-45 «QA-AUTO bc890b מכרז» HR submission f6378225-5715-4723-bed3-566ebc7b2ca9. Both: full profile requested, then «מתאים/ה», request still open. Owner of both: demo-company-1 («סופר פארם»). If a submission's current status is no longer «התבקש פרופיל מלא» (HR answered / data cleaned) → `test.skip` with annotation «cea191 data changed» for that tender.

#### 1.1 HR sees 4 timeline rows without a duplicate on its tender submissions @desktop @prod-safe #cea191
**Status:** READY · **Case:** `.qa/tests/candidacy-timeline/CT-1-1.md` · **File:** `tests/candidacy-timeline/hr-tender-timeline-four-rows.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts`
**Device:** desktop
**Users:** company_6 (HR, demo-company-6 «מיכל לוי»)
**Steps:**
1. Open «ההצעות שלי» (HR tenders page, own submissions).
2. Open the card «QA-AUTO 2110 tsub» (T-62) → dialog «המועמדות שלי – QA-AUTO 2110 tsub».
3. Read the rows of block «סטטוס המועמדות»; close the dialog (do not click «שליחת פרופיל מלא» / «דחיית הבקשה»).
4. Repeat steps 2–3 for «QA-AUTO bc890b מכרז» (T-45).
**Expected:**
- Each dialog: exactly 4 timeline rows, in this order: `/נשלח/` → «נצפה/תה» → «התבקש פרופיל מלא» → «סומן/ה כמתאים/ה». (source: «מה רצוי» «each real event once, in the order it happened … (no repeated last step)»)
- «התבקש פרופיל מלא» occurs exactly once in the timeline. (Done when «4 timeline rows on both sides, without a duplicate»)

#### 1.2 HR: while the full-profile request is open, «מתאים/ה» is visible next to «התבקש פרופיל מלא» @desktop @prod-safe #cea191
**Status:** READY · **Case:** `.qa/tests/candidacy-timeline/CT-1-2.md` · **File:** `tests/candidacy-timeline/hr-request-and-suitable-both-visible.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts`
**Device:** desktop
**Users:** company_6 (HR)
**Steps:**
1. Open «ההצעות שלי»; find the cards «QA-AUTO 2110 tsub» and «QA-AUTO bc890b מכרז».
2. Read each card's status badge(s).
3. Open the card «QA-AUTO 2110 tsub» → in the dialog scroll to the full-profile request block (text «ביקש/ה את הפרופיל המלא»); close without clicking its buttons.
**Expected:**
- Each card shows the open request («התבקש פרופיל מלא») AND «מתאים/ה» (two badges or one combined line — any form; both words present inside the card). (source: «מה רצוי» «badge «התבקש פרופיל מלא» with «מתאים/ה» also visible in the list card/view (or one combined line)»)
- Dialog: the request block («…ביקש/ה את הפרופיל המלא») is visible together with the label «מתאים/ה»; buttons «שליחת פרופיל מלא» and «דחיית הבקשה» visible (NOT clicked). (QA 28.10 `cea191-T1-hr-timeline-confirm-desktop.png`)

#### 1.3 Owner sees 4 timeline rows without a duplicate and both states on the HR tender submissions @desktop @prod-safe #cea191
**Status:** READY · **Case:** `.qa/tests/candidacy-timeline/CT-1-3.md` · **File:** `tests/candidacy-timeline/owner-tender-timeline-four-rows.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company (demo-company-1, owner of T-62 / T-45)
**Steps:**
1. /tenders?mine=1 → open tender «QA-AUTO 2110 tsub» (T-62) → «מועמדויות שהוגשו למכרז».
2. Read the status shown in the list for the anonymous HR submission.
3. Open that submission; read the rows of block «סטטוס מועמד» and the action buttons; close (do not click any action).
4. Repeat steps 1–3 for «QA-AUTO bc890b מכרז» (T-45).
**Expected:**
- Exactly 4 timeline rows in order «נשלח/ה» → «נצפה/תה» → «התבקש פרופיל מלא» → «סומן/ה כמתאים/ה»; «התבקש פרופיל מלא» exactly once. (source: «מה רצוי» + Done when «on both sides»)
- Both states visible for the owner: list row and/or the opened submission show «התבקש פרופיל מלא» and «מתאים/ה» (e.g. buttons «התבקש פרופיל מלא» + «סומן/ה כמתאים/ה»). (source: «מה רצוי» «the current state is clear on both sides»)

---

### 2. Job application timeline — CHAIN (hunter_plus → company → hunter_plus) (#cea191 «same for job applications»)
**Seed:** chain — `tests/seed.hunter_plus.spec.ts` (steps 1, 3), `tests/seed.company.spec.ts` (step 2)

Data: job J-49 «QA company post test» (owner company = demo-company-1, /collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584). Sender hunter_plus (claude-test, PLUS — no monthly submission limit). Each run creates 1 candidate + 1 application on J-49 (QA data, kept; journal).

#### 2.1 CHAIN step 1 — sender submits a new anonymous candidate to J-49 @desktop @data #cea191
**multi-role chain — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/candidacy-timeline/CT-2-1.md` · **File:** `tests/candidacy-timeline/chain-timeline-job-1-hunter_plus.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. `runId = Date.now()`. «הוספת מועמד» (/my-candidates/new) → anonymous profile, first name «QA-AUTO-cea191», last name `<runId>`, phone `uniquePhone()`, any «תחומי התמחות» → «המשך» → «סיום».
2. /collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584 → «הגשת מועמד» → this candidate → «פרופיל אנונימי» → «אין צורך ב-NDA (ללא עלות)» → «המשך» → wait until «סיום והגשה» is enabled → screening answer «QA-AUTO cea191 <runId>» → «סיום והגשה».
3. Read the application id (URL `application=<id>` / link); write handoff `.handoff/timeline-job.json`; journal candidate + application.
**Expected:**
- Submission created; its block «סטטוס מועמד» has exactly 1 row «נשלח/ה».

#### 2.2 CHAIN step 2 — owner: «בקשת פרופיל מלא», then «מתאים/ה» → owner timeline has 4 rows, no duplicate @desktop @data #cea191
**multi-role chain — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/candidacy-timeline/CT-2-2.md` · **File:** `tests/candidacy-timeline/chain-timeline-job-2-company.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps:**
1. Read handoff. «המשרות שלי» → J-49 → «מועמדים שהוגשו» → open the new submission «QA-AUTO-cea191 <runId>» (dialog / `?application=<id>`).
2. Click «בקשת פרופיל מלא» (confirm if a dialog appears); wait for the button to read «התבקש פרופיל מלא».
3. Click «מתאים/ה» → confirm in the dialog if one appears; wait for «סומן/ה כמתאים/ה».
4. Close; reopen the same submission from the list; read block «סטטוס מועמד» and the list row status.
**Expected:**
- After step 4: exactly 4 rows «נשלח/ה» → «נצפה/תה» → «התבקש פרופיל מלא» → «סומן/ה כמתאים/ה»; «התבקש פרופיל מלא» exactly once (also after the reopen — no phantom row). (source: «מה רצוי» «The same for job applications»; Done when «4 timeline rows on both sides»)
- Owner sees both states: «התבקש פרופיל מלא» and «מתאים/ה» (buttons / list row). (source: «מה רצוי» «clear on both sides»)

#### 2.3 CHAIN step 3 — sender: 4 rows, no duplicate; «מתאים/ה» visible while the request is open @desktop @prod-safe #cea191
**multi-role chain — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/candidacy-timeline/CT-2-3.md` · **File:** `tests/candidacy-timeline/chain-timeline-job-3-hunter_plus.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. Read handoff. /collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584 → block «הגשת מועמד»: read the row of «QA-AUTO-cea191 <runId>».
2. Open `/applications/<id>`; read block «סטטוס מועמד» and the status badge / request block. Do not answer the full-profile request.
3. Reload; read the timeline again.
**Expected:**
- Exactly 4 rows `/נשלח/` → «נצפה/תה» → «התבקש פרופיל מלא» → «סומן/ה כמתאים/ה»; «התבקש פרופיל מלא» exactly once; same after reload. (source: Done when)
- The sender sees both states: the list row or the application page shows «התבקש פרופיל מלא» AND «מתאים/ה». (source: «מה רצוי» «so the sender sees that the candidate was marked suitable and the request still waits for an answer»)
