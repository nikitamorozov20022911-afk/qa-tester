<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Tender candidacy instead of a money offer: HR submits own profile anonymously / full, owner reviews (2026-10-22)

STATUS: READY — updated 2026-10-28: assertions for #9dc615 (tender wording) and #cea191 (4-row timeline) added to §1.3/§1.4; #541d6c passed QA 22.10 (both rejections resolved), user moved it to «הושלם» 2026-10-22. Not generated yet. Environment: staging.
Sources: session.json 22.10 (#541d6c «HR anon to T-62, full to T-55; no notAllowed; ההצעות שלי ok; old ₪ offers readable; owner T-62 anon card no PII, request full profile + מתאים/ה ok; T-55 full profile visible»), brief `.qa/research/541d6c.md` (reject 1 «needed»: candidate instead of money, anonymous / full, company reviews like job applications; reject 2 «needed»: HR submits own profile anonymously or full, server accepts, HR sees it in «ההצעות שלי» with a status, owner reviews it), screenshots `.qa/screenshots/541d6c-*.png`.
Related (not duplicated): old money-offer amount validation — `tender-offers.md` (#1004e9); owner tender actions / archive — `tender-actions.md` (#cf6dc1); job candidacy statuses — `candidacy-status.md`.
**22.10 rules:** one role per test file (Supabase rotating refresh tokens) — the cross-role flow is a CHAIN `tests/tender-candidacy/chain-hr-tender-<N>-<role>.spec.ts`, handoff `.qa/e2e/.handoff/hr-tender.json` (`{ runId, createdAt, anon: { id, title }, full: { id, title } }`; NOT test-results), later steps `test.skip(!handoff, 'run the chain from step 1')`. Run in order: `npx playwright test tests/tender-candidacy/chain-hr-tender- --project=tests --workers=1`. Each step logs created data to `.qa/e2e/test-data-journal.log`. Chains are written by autotest-writer (handoff code), not by the generator. Created tenders are named `QA-AUTO-541d6c-<runId> …`; never touch DEMO-* data or T-62 / T-55 (22.10 manual data).
Why fresh tenders: HR can submit its own profile to a tender only once (after submission the row shows the status instead of «הגשה»), so each run creates two free QA-AUTO tenders (one for anonymous, one for full profile) with `tests/_helpers/tender-wizard.ts` (`fillFreeTenderWizardToTerms`, `publishFromTerms`, `journal`) and archives them at the end.
Roles: `company` = demo-company-1 (tender owner, company name shown as «סופר פארם»); `company_6` = demo-company-6, HR, own profile card «מיכל לוי · הפרופיל שלי».
Rules: saved sessions only; no fixed waits / `networkidle`; NEVER choose «לחייב NDA (₪35)» (paid) — always «אין צורך ב-NDA (ללא עלות)»; no payments; HR never clicks «שליחת פרופיל מלא» / «דחיית הבקשה».
**28.10 — fixed and now ASSERTED (#9dc615, #cea191 passed QA 28.10):** tender texts say «מכרז» («מנהל/ת המכרז», «במכרז», «למכרז», «התקבלה מועמדות חדשה למכרז») and never «משרה» — see `tender-submissions-texts.md`; the timeline has exactly 4 rows `/נשלח/` → «נצפה/תה» → «התבקש פרופיל מלא» → «סומן/ה כמתאים/ה» (no duplicate) — see `candidacy-timeline.md`; HR role label on the full profile is «משאבי אנוש», not «טאלנט».
**Known findings — NOT asserted (do not check these texts):** HR anonymous card title is empty «הגשת מועמד:» — do not assert the dialog title; owner drawer «מס׳ הצעות 0» — do not assert counters; «שאלות נוספות» disabled after «מתאים/ה» — do not check.
Not automated: NDA request / signing (₪35, paid); «לא מתאים/ה» with reason on a tender candidacy (same mechanism as jobs — covered in candidacy-status §4); hunter_plus tender submission regression (checked 21.10; PLUS tender quota per month); FREE hunter upsell; HR approving / declining the full-profile request.

---

### 1. HR candidacy to a tender — CHAIN (company → company_6 → company → company_6 → company)
**Seed:** chain — `tests/seed.company.spec.ts` (steps 1, 3, 5), `tests/seed.company_6.spec.ts` (steps 2, 4)

#### 1.1 CHAIN step 1 — owner publishes two free QA-AUTO tenders @desktop @data #541d6c
**Status:** READY · **File:** `tests/tender-candidacy/chain-hr-tender-1-company.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps:**
1. `runId = Date.now()`. `fillFreeTenderWizardToTerms(page, 'QA-AUTO-541d6c-<runId> anon', 'QA-AUTO — מכרז בדיקה להגשת מועמדות, לא להגיש מועמדים אמיתיים')` → `publishFromTerms(page)`.
2. Same for title `QA-AUTO-541d6c-<runId> full`.
3. Write handoff `.handoff/hr-tender.json` with both ids and titles; `journal()` both tenders.
**Expected:**
- Both tenders appear in /tenders?mine=1 with status «פעיל»; no payment window (`expectNoPayment`).

#### 1.2 CHAIN step 2 — HR submits own profile: anonymous to «anon», full to «full»; no money field, server accepts @desktop @data #541d6c
**Status:** READY · **File:** `tests/tender-candidacy/chain-hr-tender-2-company_6.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts` · **Device:** desktop · **Users:** company_6 (HR)
**Steps:**
1. Read handoff. /tenders → «מילת מפתח» = title «anon» → open the card → tender details dialog «פרטי המכרז».
2. Panel «הגשת מועמדות למכרז»: row «מיכל לוי» / «הפרופיל שלי» → «הגשה».
3. Dialog «הגשת מיכל לוי»: read the options; choose «פרופיל אנונימי» and «אין צורך ב-NDA (ללא עלות)»; continue («המשך» if present).
4. Submission form: wait until «סיום והגשה» is enabled; «הערות נוספות על המועמד/ת» = «QA-AUTO 541d6c <runId>»; start `page.waitForResponse` for the submit request; click «סיום והגשה».
5. Close; repeat steps 1–4 for title «full» with «פרופיל מלא» + «אין צורך ב-NDA (ללא עלות)».
6. Open «ההצעות שלי» (HR tenders page, link «ההצעות שלי» / filter of own submissions).
7. Update handoff (application ids if visible in URL / response); `journal()` both submissions.
**Expected:**
- Step 3: the dialog offers «פרופיל אנונימי» and «פרופיל מלא» (+ NDA choice «לחייב NDA (₪35)» / «אין צורך ב-NDA (ללא עלות)»). (source: reject 1 «needed» «submits a CANDIDATE … choosing פרופיל אנונימי or פרופיל מלא»; reject 2 «HR can apply anonymously … with NDA options»)
- No money field anywhere in the flow: no textbox labelled «ההצעה שלי (לפרויקט) ₪», no button «הגשת הצעה». (reject 1 «needed»; QA 22.10 «no ₪ field» — the ₪ in the NDA option label is not a money field)
- #9dc615 (added 28.10): the «הגשה» button of row «מיכל לוי» has aria-label containing «הגשת מיכל לוי למכרז»; the anonymous form banner says «…יועברו למנהל/ת המכרז…»; no «משרה» in either.
- Anonymous form shows the banner «הגשה דיסקרטית» and the AI blocks «תקציר המועמד», «חוזקות»; full form shows «תקציר המועמד» / «חוזקות» without that banner.
- Step 4 (both): response HTTP 200 whose body has no `"error"` (in particular not `notAllowed`); no toast «אין לכם הרשאה להגיש מועמדים»; block «סטטוס מועמד» shows «נשלח/ה»; the tender panel row «מיכל לוי» now shows «נשלח/ה» instead of «הגשה». (reject 2 «needed» «the server accepts»; QA 22.10 «no notAllowed»)
- Step 6: both cards (titles «… anon» and «… full») listed with badge «נשלח/ה». (reject 2 «HR sees the candidacy in ההצעות שלי with a status»)

#### 1.3 CHAIN step 3 — owner reviews: anonymous card without personal data → «בקשת פרופיל מלא» + «מתאים/ה»; full card shows the profile @desktop @data #541d6c
**Status:** READY · **File:** `tests/tender-candidacy/chain-hr-tender-3-company.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps:**
1. Read handoff. /tenders?mine=1 → open tender «anon» → «מועמדויות שהוגשו למכרז» → open the HR candidacy (the only row).
2. Read the card; then click «בקשת פרופיל מלא» (confirm in a dialog if one appears).
3. Click «מתאים/ה» → confirm in the dialog if one appears.
4. Close; open tender «full» → «מועמדויות שהוגשו למכרז» → the HR candidacy; read; do not change its status.
**Expected:**
- Step 1: banner «הגשה אנונימית»; AI «תקציר המועמד» non-empty; no personal data in the card: no text «מיכל לוי», no e-mail (`/\S+@\S+\.\S+/`), no Israeli phone (`/05\d-?\d{3}-?\d{4}/`); timeline «סטטוס מועמד» contains «נשלח/ה» and «נצפה/תה»; buttons «בקשת פרופיל מלא», «מתאים/ה», «לא מתאים/ה». (reject 1 «the company reviews the tender candidacies like job applications (request full profile, NDA, statuses)»; QA 22.10 «anon card no PII»)
- Step 2: toast «הבקשה נשלחה. נעדכן אתכם כשהפרופיל המלא יגיע»; button becomes «התבקש פרופיל מלא» (disabled); timeline contains «התבקש פרופיל מלא».
- Step 3 (#cea191, added 28.10): after «מתאים/ה» the owner timeline has exactly 4 rows «נשלח/ה» → «נצפה/תה» → «התבקש פרופיל מלא» → «סומן/ה כמתאים/ה»; «התבקש פרופיל מלא» exactly once. Owner bell (#9dc615): item «התקבלה מועמדות חדשה למכרז „<title anon>”» (contains «למכרז», no «למשרה»).
- Step 3: the button reads «סומן/ה כמתאים/ה»; timeline contains «סומן/ה כמתאים/ה». (QA 22.10 «request full profile + מתאים/ה ok»)
- Step 4: full profile visible — name «מיכל לוי», a phone and the e-mail «demo-company-6@…» (prefix match), «תקציר המועמד» non-empty; status «נצפה/תה». (reject 1 «full profile»; QA 22.10 «T-55 full profile visible»)

#### 1.4 CHAIN step 4 — HR sees the statuses and the notifications @desktop @prod-safe #541d6c
**Status:** READY · **File:** `tests/tender-candidacy/chain-hr-tender-4-company_6.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts` · **Device:** desktop · **Users:** company_6 (HR)
**Steps:**
1. Read handoff. Open the bell «התראות»; collect the items whose text contains the «anon» or «full» title (expect.poll with reload until they appear, no fixed pause).
2. Click the item «… עודכן ל„מתאים/ה”» of «anon».
3. Read the dialog «המועמדות שלי – <title anon>»; close it without clicking anything inside.
4. Open «ההצעות שלי»; read the badges of «anon» and «full».
**Expected:**
- Bell for «anon»: an item with «ביקש את הפרופיל המלא של מיכל לוי» and the title; an item with «מיכל לוי» + title + «עודכן ל„מתאים/ה”»; an item with «מיכל לוי» + title + «עודכן ל„נצפה/תה”». Bell for «full»: an item with «מיכל לוי» + title + «עודכן ל„נצפה/תה”». (reject 2 «owner reviews … HR is notified»; screenshot 541d6c-hr-notif-bell-he-desktop) #9dc615 (added 28.10): every one of these items contains «במכרז» or «למכרז» and none contains «במשרה» / «למשרה».
- Step 3: banner «הגשת מועמדות אנונימית» containing «למנהל/ת המכרז»; request block «מנהל/ת המכרז ביקש/ה את הפרופיל המלא» (#9dc615); timeline exactly 4 rows `/נשלח/` → «נצפה/תה» → «התבקש פרופיל מלא» → «סומן/ה כמתאים/ה», no duplicate (#cea191); «מתאים/ה» visible next to the open request; buttons «שליחת פרופיל מלא» and «דחיית הבקשה» visible (NOT clicked). (QA 22.10 notif-t62-answer-buttons)
- Step 4: «anon» card shows both «התבקש פרופיל מלא» and «מתאים/ה» (#cea191 «מה רצוי», added 28.10); «full» badge «נצפה/תה». (reject 2 «with a status»)

#### 1.5 CHAIN step 5 — cleanup: owner closes and archives both QA-AUTO tenders @desktop @data #541d6c
**Status:** READY · **File:** `tests/tender-candidacy/chain-hr-tender-5-company.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps:**
1. Read handoff. For each tender: /tenders?mine=1 → card → «•••» → «העברה לארכיון» → «להעביר את המכרז לארכיון?» → «העברה לארכיון» (as in `tender-actions` 1.2; archiving also closes it).
2. `journal()` «archived» for both; delete the handoff file.
**Expected:**
- Both cards gone from «המכרזים שלי» and listed with badge «בארכיון» on «מכרזים בארכיון». If archiving fails — the ids stay in the journal for manual cleanup.

---

### 2. HR «ההצעות שלי» — legacy money offers stay readable (#541d6c)
**Seed:** `tests/seed.company_6.spec.ts`

#### 2.1 Old ₪ offers are still listed and open without errors @desktop @prod-safe #541d6c
**Status:** READY · **File:** `tests/tender-candidacy/hr-legacy-offers-readable.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts` · **Device:** desktop · **Users:** company_6 (HR)
Data (21.10, may be cleaned): legacy offers on T-53 «QA-AUTO 1020 C3» and T-58 «QA-AUTO 1020 E1» with badge «ההצעה נדחתה». If no card has a legacy-offer badge («ההצעה נדחתה» / «ההצעה התקבלה» / «ממתינה») → `test.skip` «legacy offers cleaned».
**Steps:**
1. Open «ההצעות שלי».
2. Open the first card with badge «ההצעה נדחתה» (arrow button of the card).
3. Read the dialog; close it.
**Expected:**
- The card is listed with its badge and «T-…» code. (dev note 21.10 «old money offers stay readable»; QA 22.10 «old ₪ offers readable»)
- The dialog / page opens with the tender title; no toast «משהו השתבש, נסו שוב»; no page error (`pageerror` count 0).
- No action to submit a new money offer is offered (no «הגשת הצעה»).
