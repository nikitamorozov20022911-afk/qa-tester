<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Candidacy status labels and menus (2026-10-21)

STATUS: READY — #283eb6, #3973c6, #a1dd4b passed QA (user moved them to «הושלם», 2026-10-21). Not generated yet.
Updated 2026-10-21: section 2 (#b63fa1 «נצפה/תה» notification to the headhunter, multi-role) added — READY.
Updated 2026-10-22: sections 3–5 added — READY (#abe526 direct link sets «נצפה/תה»; #e9ce1c receiver «מתאים/ה / לא מתאים/ה / בקשת NDA»; #24f795 final statuses + one notification per change; #9ac514 what the receiver sees). All passed QA 22.10, user moved them to «הושלם» 2026-10-22.
**22.10 rule changes (apply to the whole file):** one role per test file (Supabase rotating refresh tokens — two windows of different roles in one file are no longer planned; §2.1 must be rewritten as a CHAIN like §3, it is NOT to be generated as `asUser`). Add-candidate now rejects a phone already used by another candidate — every created candidate needs a UNIQUE phone: `05` + last 8 digits of `Date.now()` (helper `uniquePhone()` to add to `tests/add-candidate/helpers.ts`); §2.1 «050-631-0001» is a fixed phone → replace. Never touch DEMO-* jobs/candidates (demo-2026-10-22.md); senders below use hunter_plus (claude-test, PLUS, no monthly limit) because hunter_free (demo-hunter-2) becomes FREE (4/month) after 24.10.
**CHAIN convention (one role per file, cross-role flow):** files `tests/<feature>/chain-<name>-<N>-<role>.spec.ts`; step 1 creates the data and writes `{ runId, ids, names, createdAt }` to `.qa/e2e/.handoff/<name>.json` (NOT test-results — it is wiped each run); later steps read it and `test.skip(!handoff, 'run the chain from step 1')`. Run in order: `npx playwright test tests/<feature>/chain-<name>- --project=tests --workers=1`. Each step logs created data to `.qa/e2e/test-data-journal.log`. Chains are written by autotest-writer (handoff code), not by the generator.
Rules: login only via saved sessions (seed per role / `asUser`); no fixed waits, no `networkidle`; test data prefix `QA-AUTO-`, cleanup in afterAll; no payments, no NDA signing (₪35), no time-based checks; `@data` = changes shared data (runs one at a time); `@prod-safe` = read-only. Status labels must not be changed by read-only tests (open menus, then Esc).

---

### 1. Candidacy status
**Seed:** `tests/seed.hunter_free.spec.ts`, `tests/seed.company_2.spec.ts`, `tests/seed.company.spec.ts`

#### 1.1 Sender sees status badge only, no status menu @desktop @prod-safe #283eb6
**Status:** READY · **Case:** `.qa/tests/candidacy-status/CS-1-1.md` · **File:** `tests/candidacy-status/sender-sees-status-badge-only.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free
**Steps:**
1. Open /collaborations, open job J-135 «QA-AUTO 2110 cand».
2. In the block «הגשת מועמד» open each own submission (up to 5) — /applications/<id>.
3. On each page click the status button (e.g. «נצפה/תה»).
**Expected:**
- The status button has no `aria-haspopup="menu"`; after the click no menu items «התקבל/ה לעבודה», «נדחה/תה», «סגור» are visible. (source: «מה רצוי» #283eb6 «sees no status menu»)
- The block «סטטוס מועמד» shows the history with «נשלח/ה» and «נצפה/תה». (מה רצוי: «status badge and the status history»)
- No toast «משהו השתבש, נסו שוב».

#### 1.2 Company sees candidate statuses in slash form (job list and status menu) @desktop @prod-safe #3973c6
**Status:** READY · **Case:** `.qa/tests/candidacy-status/CS-1-2.md` · **File:** `tests/candidacy-status/company-status-labels-slash-form.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts`
**Device:** desktop
**Users:** company_2
**Steps:**
1. «המשרות שלי» → job J-135 «QA-AUTO 2110 cand» → drawer «מועמדים שהוגשו»; read the status of every row.
2. Open a submission with status «נצפה/תה» → click the status button → read the menu items → press Escape (do not choose).
**Expected:**
- Candidate statuses are only slash forms: «נשלח/ה», «נצפה/תה», «נדחה/תה», «התקבל/ה לעבודה»; no row/menu item equals «נשלח», «נצפה», «נדחה» without «/». (source: «מה רצוי» #3973c6)
- Non-candidate statuses stay as is: «התבקש פרופיל מלא», «סגור». (מה רצוי)
- Menu items: «נצפה/תה», «התקבל/ה לעבודה», «נדחה/תה», «סגור»; status unchanged after Escape.

#### 1.3 Headhunter sees the same slash-form statuses @desktop @prod-safe #3973c6
**Status:** READY · **Case:** `.qa/tests/candidacy-status/CS-1-3.md` · **File:** `tests/candidacy-status/headhunter-status-labels-slash-form.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free
**Steps:**
1. /collaborations → J-135 → block «הגשת מועמד»; read the status of every row.
2. Open one submission → block «סטטוס מועמד».
**Expected:**
- Only «נשלח/ה», «נצפה/תה», «נדחה/תה», «התקבל/ה לעבודה» (+ «התבקש פרופיל מלא», «סגור»); no masculine-only form without «/». (source: «מה רצוי» #3973c6 «exactly the same labels on every screen»)
- Toast and notifications in slash form — covered by multi-role test `candidacy-submission` 1.3.

#### 1.4 iPhone: status menu is fully on screen @iphone @prod-safe #a1dd4b
**Status:** READY · **Case:** `.qa/tests/candidacy-status/CS-1-4.md` · **File:** `tests/candidacy-status/iphone-status-menu-on-screen.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** iphone
**Users:** company
**Steps:**
1. «המשרות שלי» → J-49 «QA company post test» → «מועמדים שהוגשו» → candidate «אדיר כהן» → /applications/<id>.
2. Scroll so the status button is near the bottom edge of the viewport; tap it.
3. Press Escape; scroll so the button is near the top edge; tap it again; Escape.
**Expected:**
- Each time all 4 menu items (current status, «התקבל/ה לעבודה», «נדחה/תה», «סגור») have boundingBox top ≥ 0 and bottom ≤ viewport height, without scrolling the page; near the bottom edge the menu opens upward. (source: «מה רצוי» #a1dd4b «all 4 status options are visible and selectable»)
- After Escape the status is unchanged.

---

### 2. «נצפה/תה» notification to the sender on the first open (#b63fa1)
**Seed:** — multi-role via `asUser('hunter_plus')`, `asUser('company')` (`.qa/e2e/fixtures.ts`)

Source: rejection 56dbaebe «needed behavior» (#b63fa1); developer note «the sender is notified the first time the owner opens the submission»; evidence `.qa/screenshots/2026-10-21/b63fa1-*.png`.
Known finding (do not use this path): opening the submission via /applications/<id> does not mark it viewed — the company must open it from the job's «מועמדים שהוגשו» list (job page / drawer, URL `?application=<id>`). — 22.10: fixed by #abe526 (direct link now sets «נצפה/תה», see §3); the list path stays valid.

#### 2.1 Company opens a new submission → headhunter gets «עודכן ל„נצפה/תה”» exactly once @desktop @data #b63fa1 #3973c6
**multi-role — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/candidacy-status/CS-2-1.md` · **File:** `tests/candidacy-status/viewed-notification-to-headhunter-once.spec.ts`
**Seed:** — (`asUser`)
**Device:** desktop
**Users:** hunter_plus (sender, claude-test, PLUS — no submission limit), company (owner of J-49 «QA company post test», 7e4ad713-60a0-4e68-9926-56e0ee667584)
`test.describe.configure({ mode: 'serial' })`.
**Steps:**
1. hunter_plus: /my-candidates/new — anonymous candidate «QA-AUTO-b63fa1-<ts>», phone 050-631-0001, any «תחום התמחות» → «המשך» → «סיום».
2. hunter_plus: /collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584 → «הגשת QA-AUTO-b63fa1-<ts> … למשרה» → «פרופיל אנונימי» → «אין צורך ב-NDA» → «המשך» → answer the screening question with «QA-AUTO b63fa1» → «סיום והגשה».
3. company: «המשרות שלי» → J-49 → «מועמדים שהוגשו» → click the new submission «QA-AUTO-b63fa1-<ts>» (URL gets `application=<id>`); close it.
4. hunter_plus: open the bell «התראות»; wait (expect.poll with reload, no fixed pause).
5. company: open the same submission again from the list (second view); close.
6. hunter_plus: reload, open the bell again.
7. Cleanup (afterAll): hunter_plus deletes the candidate if the UI allows; application id + candidate → test-data journal (no status change by the company — it would create more notifications).
**Expected:**
- Step 3: the submission status becomes «נצפה/תה» (timeline «נצפה»).
- Step 4: hunter_plus has the notification «הסטטוס של QA-AUTO-b63fa1-<ts> … במשרה „QA company post test” עודכן ל„נצפה/תה”»; clicking it opens that submission (`/collaborations/7e4ad713…?application=<id>` or the application page with this candidate). (needed behavior #b63fa1: «the headhunter who submitted it gets a bell notification … clicking it opens that submission»)
- Step 6: still exactly ONE «נצפה/תה» notification for this candidate. (needed behavior: «sent once per submission (not on every later view), only to the submitter»)
- Status label in slash form «נצפה/תה». (#3973c6)

---

### 3. Receiver opens a submission by its direct link → «נצפה/תה» (#abe526)
**Seed:** chain — `tests/seed.hunter_plus.spec.ts` (steps 1, 3), `tests/seed.company.spec.ts` (step 2)

Source: ticket «What is needed» #abe526 — «When the receiver (job owner) opens an application page, by any route (list, notification, e-mail, direct link), an application in «נשלח/ה» becomes «נצפה/תה»». Evidence `.qa/screenshots/abe526-*.png` (22.10: direct link by company → «נצפה/תה», sender open keeps «נשלח/ה», single history entry, notification link ok).
Data: job J-49 «QA company post test» (owner company = demo-company-1, id 7e4ad713-60a0-4e68-9926-56e0ee667584). Use a FULL-profile («פרופיל מלא»/«גלוי») submission — company direct link to an anonymous submission is a known 404 finding (opens only as a dialog in the job); do not assert on anonymous direct links.
Not automated: Р2 «later status is not rolled back» (company direct link to its own rejected submission is a known 404 finding).

#### 3.1 CHAIN step 1 — sender creates a full-profile submission; opening it himself keeps «נשלח/ה» @desktop @data #abe526
**Status:** READY · **File:** `tests/candidacy-status/chain-direct-link-1-hunter_plus.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. «הוספת מועמד» (/my-candidates/new) → «פרופיל גלוי», first name «QA-AUTO-abe526», last name `<runId>`, phone `uniquePhone()`, «כמה מילים על המועמד», any «תחומי התמחות» → «המשך» → «סיום».
2. /collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584 → «הגשת מועמד» → this candidate → «פרופיל מלא» → «אין צורך ב-NDA» → «המשך» → wait until «סיום והגשה» is enabled → answer the screening question «QA-AUTO abe526» → «סיום והגשה».
3. Read the new application id (link / URL `application=<id>`); write handoff `.handoff/direct-link.json`.
4. hunter_plus opens `/applications/<id>` directly; reload.
**Expected:**
- Submission created with status «נשלח/ה».
- Step 4: status still «נשלח/ה» after reload; timeline has only «נשלח/ה». (Р3 — sender's own open does not mark viewed)

#### 3.2 CHAIN step 2 — company opens the direct link → «נצפה/תה», one history entry @desktop @data #abe526
**Status:** READY · **File:** `tests/candidacy-status/chain-direct-link-2-company.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps:**
1. Read handoff; open `/applications/<id>` directly (not from the list).
2. Reload; open the same URL a second time.
**Expected:**
- After step 1 the status button / timeline shows «נצפה/תה» (expect with auto-retry, no fixed pause). (source: «What is needed» «by any route … direct link»)
- After step 2: still «נצפה/תה»; the timeline contains exactly one «נצפה/תה» entry. (Р1 — no duplicates on repeated opens)
- Do not change the status.

#### 3.3 CHAIN step 3 — sender sees «נצפה/תה» and one notification @desktop @prod-safe #abe526
**Status:** READY · **File:** `tests/candidacy-status/chain-direct-link-3-hunter_plus.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. Read handoff; open `/applications/<id>`.
2. Open the bell «התראות».
**Expected:**
- Status «נצפה/תה» (badge and timeline). (source: «What is needed» «the sender relies on this status»)
- Exactly one notification «הסטטוס של QA-AUTO-abe526 <runId> … עודכן ל„נצפה/תה”»; clicking it opens this submission (not 404).

---

### 4. Receiver decisions «מתאים/ה / לא מתאים/ה / בקשת NDA» (#e9ce1c) and one notification per change (#24f795)
**Seed:** chain — `tests/seed.hunter_plus.spec.ts` (steps 1, 3), `tests/seed.company.spec.ts` (step 2); read-only tests 4.4–4.6 — own seed each

Source: #e9ce1c reject 1 «needed» (§41 AC02, §42 AC01/AC03/AC05) + reject 2 «needed» — «the current status after the decision is «מתאים/ה» (or «נדחה/תה» with the reason for «לא מתאים/ה») everywhere: badge and list of the sender, list of the company … same in en/ru/ar»; #24f795 reject 1 «needed» (final statuses locked or confirm + mandatory reason, no step back, confirmation for irreversible actions) + reject 2 «needed» — «each real change is a separate notification … view + rejection within a minute = 2 notifications». Evidence `.qa/screenshots/e9ce1c-*.png`, `24f795-*.png`.
Not automated: NDA request → signature → «NDA נחתם» (signing is a paid/irreversible step — manual); «notifications still there after 5–19 min» (time-based); bell unread counter +2 (shared counter, other activity changes it).

#### 4.1 CHAIN step 1 — sender submits 2 anonymous candidates to J-49 @desktop @data #e9ce1c #24f795
**Status:** READY · **File:** `tests/candidacy-status/chain-decision-1-hunter_plus.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. Create 2 candidates via «הוספת מועמד» (anonymous profile): «QA-AUTO-dec-<runId> S» and «QA-AUTO-dec-<runId> R», each with its own `uniquePhone()`, any «תחום התמחות», «הערות נוספות על המועמד/ת» = «QA-AUTO note <runId>» → «סיום».
2. For each: J-49 (/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584) → «הגשת מועמד» → «פרופיל אנונימי» → «אין צורך ב-NDA» → «המשך» → wait for «סיום והגשה» enabled → screening answer «QA-AUTO answer <runId>» → «סיום והגשה».
3. Write handoff `.handoff/decision.json` (names + application ids).
**Expected:**
- Both submissions exist with status «נשלח/ה».

#### 4.2 CHAIN step 2 — company opens both from the list, marks S «מתאים/ה» and R «לא מתאים/ה» with a reason @desktop @data #e9ce1c #24f795
**Status:** READY · **File:** `tests/candidacy-status/chain-decision-2-company.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps:**
1. «המשרות שלי» → J-49 → «מועמדים שהוגשו» → click S (dialog / `?application=<id>`).
2. Check the action buttons; click «מתאים/ה» → confirm in the dialog.
3. Open R from the list → «לא מתאים/ה» → try to confirm with an empty reason → enter reason «QA-AUTO reason <runId>» → confirm.
4. Re-open R; click the status button.
**Expected:**
- Step 2: the receiver has «מתאים/ה», «לא מתאים/ה», «בקשת NDA», «בקשת פרופיל מלא», «שאלות נוספות» (do not click NDA / full profile). (#e9ce1c §41 AC02, §42 AC01/AC03) After confirm: S shows «מתאים/ה» in the dialog and in «מועמדים שהוגשו». (#e9ce1c reject 2)
- Step 3: confirmation is blocked without a reason (button disabled or a field error). After confirm R shows «נדחה/תה» in the list. (#24f795 «mandatory reason»)
- Step 4: the final status «נדחה/תה» cannot be changed: no menu, or the menu has no «נצפה/תה» / «התקבל/ה לעבודה» items. (#24f795 «final statuses are final … moving backwards is not offered») Press Escape.

#### 4.3 CHAIN step 3 — sender sees the decisions as statuses and gets 2 separate notifications per candidate @desktop @prod-safe #e9ce1c #24f795
**Status:** READY · **File:** `tests/candidacy-status/chain-decision-3-hunter_plus.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. Read handoff. J-49 → block «הגשת מועמד»: read the status of S and R.
2. Open `/applications/<id>` of S and of R: read the status badge and timeline.
3. Open the bell «התראות»; collect the notifications that mention S and R.
**Expected:**
- S: «מתאים/ה» in the list and badge (not «נצפה/תה»); R: «נדחה/תה» and the reason «QA-AUTO reason <runId>» visible. (source: #e9ce1c reject 2 «needed»)
- Bell: for R two separate notifications — «…עודכן ל„נצפה/תה”» and «…עודכן ל„נדחה/תה”» (with the reason); for S two — «נצפה/תה» and «מתאים/ה». A single merged notification is acceptable ONLY if it names both statuses explicitly. (source: #24f795 reject 2 «Done when view + rejection within a minute = 2 notifications»)

#### 4.4 Sender sees decided statuses on existing 22.10 submissions (he/en/ru/ar) @desktop @prod-safe #e9ce1c
**Status:** READY · **File:** `tests/candidacy-status/sender-decided-statuses-languages.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts` · **Device:** desktop · **Users:** hunter_free (demo-hunter-2 — sender of the 22.10 data)
Data (KEEP — do not clean): J-49 submissions «QA-AUTO recv 850649 anon A1/A2/A3» (marked «מתאים/ה») and «… anon R1/R2» (marked «לא מתאים/ה» → «נדחה/תה» with reason) — session.json test_data 22.10.
**Steps:**
1. J-49 → block «הגשת מועמד»: read statuses of A1–A3 and R1–R2.
2. Open A1 and R1 pages; read badge + timeline.
3. Switch language to English, Russian, Arabic (language switcher) and re-read A1 and R1 badges; switch back to Hebrew.
**Expected:**
- A1–A3 «מתאים/ה», R1–R2 «נדחה/תה»; none shows «נצפה/תה». R1 shows its reason text. (#e9ce1c reject 2)
- en: R1 badge «Rejected», A1 badge ≠ «Viewed»; ru/ar: badges translated and equal to the last timeline entry (not the Hebrew word, not the «viewed» label of that language). (#e9ce1c reject 2 «same in en/ru/ar»)
- If the data is missing → `test.skip` with annotation «22.10 data cleaned».

#### 4.5 Company list shows the decided statuses; final status is locked @desktop @prod-safe #e9ce1c #24f795
**Status:** READY · **File:** `tests/candidacy-status/company-decided-statuses-locked.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps:**
1. «המשרות שלי» → J-49 → «מועמדים שהוגשו»: read rows A1–A3, R1–R2 (22.10 data, KEEP).
2. Open R1 from the list; click its status button if present; Escape.
**Expected:**
- A1–A3 «מתאים/ה», R1–R2 «נדחה/תה» in the company list. (#e9ce1c reject 2 «list of the company»)
- R1: no status change offered (no menu, or no «נצפה/תה»/«התקבל/ה לעבודה» items). (#24f795)

#### 4.6 Company: rejecting a full-profile submission needs a reason; Esc leaves the status unchanged @desktop @prod-safe #24f795
**Status:** READY · **File:** `tests/candidacy-status/company-reject-needs-reason.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps:**
1. J-49 → «מועמדים שהוגשו» → open the first full-profile row with status «נצפה/תה» (skip DEMO-*; `test.skip` with annotation if none).
2. Click «נדחה/תה» (status menu or action) → in the confirmation dialog leave the reason empty → read the confirm button; Cancel / Escape.
**Expected:**
- A confirmation dialog appears; with an empty reason the confirm button is disabled (or an error under the reason field) — nothing is changed. (source: #24f795 reject 1 «requires a confirmation dialog with a mandatory reason»)
- After Cancel the status is still «נצפה/תה».

---

### 5. What the receiver sees in full, disclosed and anonymous submissions (#9ac514)
**Seed:** `tests/seed.company.spec.ts`

Source: #9ac514 reject 1 «needed» — «A full-profile submission, and an approved disclosure, show the receiver everything the sender sent: full profile …; AI summary and strengths; answers …; salary expectation; the hunter's notes; the CV file. Anonymous submissions keep showing the anonymous summary, the answers and the notes, without personal data» + reject 2 «needed» (CV «קו״ח» downloadable; notes on anonymous). Evidence `.qa/screenshots/9ac514-*.png`.
Data (KEEP — do not clean): J-49 submissions from demo-hunter-2 on 22.10: «QA-AUTO recv 112956 full cv» (full profile with PDF), «QA-AUTO recv 850649 anon A2» (anonymous), «QA-AUTO recv 850649 anon DISC» (anonymous, full profile approved). If a row is missing → `test.skip` «22.10 data cleaned».
Open submissions only from «המשרות שלי» → J-49 → «מועמדים שהוגשו» (company direct link to anonymous submissions is a known 404 finding).

#### 5.1 Full-profile submission: company sees contacts, workplace, AI texts, answers, salary, notes and the CV @desktop @prod-safe #9ac514
**Status:** READY · **File:** `tests/candidacy-status/receiver-full-profile-content.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps:**
1. J-49 → «מועמדים שהוגשו» → «QA-AUTO recv 112956 full cv».
2. Read the card «פרטי ההגשה»; click «קו״ח» and capture the response (popup/download/`waitForResponse`).
**Expected:**
- Visible: phone, e-mail, «מקום עבודה נוכחי» (non-empty), «תקציר המועמד» (non-empty), «חוזקות» (non-empty), «שאלות סינון» with the answer, «ציפיות שכר», «הערות נוספות על המועמד/ת». (reject 1 «needed»)
- «קו״ח» link exists; its response is HTTP 200 with content-type `application/pdf`. (reject 2 «company sees and can download the CV»)

#### 5.2 Anonymous submission: notes and answers visible, no personal data, no CV @desktop @prod-safe #9ac514
**Status:** READY · **File:** `tests/candidacy-status/receiver-anonymous-content.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps:**
1. J-49 → «מועמדים שהוגשו» → «QA-AUTO recv 850649 anon A2».
2. Read the dialog text.
**Expected:**
- Visible: «הערות נוספות על המועמד/ת» with non-empty text, «שאלות סינון» with an answer, the anonymous summary. (reject 2 «on the anonymous one sees the notes together with the anonymous summary and answers»)
- No e-mail (no text matching `/\S+@\S+\.\S+/`), no Israeli phone (`/05\d-?\d{3}-?\d{4}/`), no «קו״ח» link. (§39 AC02, §07 AC02)

#### 5.3 Disclosed (approved) anonymous submission: workplace and CV visible @desktop @prod-safe #9ac514
**Status:** READY · **File:** `tests/candidacy-status/receiver-disclosed-content.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps:**
1. J-49 → «מועמדים שהוגשו» → «QA-AUTO recv 850649 anon DISC».
2. Read the card; click «קו״ח».
**Expected:**
- Visible: name, phone, e-mail, «מקום עבודה נוכחי» (non-empty), AI summary, answers, notes. (reject 1 «after disclosure … מקום עבודה נוכחי»; §40 AC04)
- «קו״ח» response HTTP 200, `application/pdf`. (reject 2)
