<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Tender submissions say «מכרז» / tender / тендер / مناقصة, jobs keep «משרה» (2026-10-28)

STATUS: READY — #9dc615 passed QA, user moved it to «הושלם» 2026-10-28. Not generated yet. Environment: staging.
Sources: ticket «מה רצוי» / Done when (brief `.qa/research/9dc615.md`): «On every screen and notification of a tender submission the object is called a tender, in all 4 languages: he «במכרז» / «למכרז» / «מנהל/ת המכרז»; en "tender"; ru «тендер»; ar «مناقصة»»; «The role label of the submitter shows the real role (HR user / headhunter), not «טאלנט»»; «Job submissions keep the job texts»; Done when «every notification, the submission view and the owner's view say «מכרז» (and tender/тендер/مناقصة in en/ru/ar)». Wording in «e.g.» is an example — assert the WORD (מכרז/tender/тендер/مناقصة) and the absence of the job word, not whole sentences (decision 2026-10-18). QA 28.10: screenshots `.qa/screenshots/9dc615-T*.png`.
Manual cases: `.qa/tests/tender-submissions-texts/TT-*.md`.
Related (not duplicated): fresh HR → tender flow with new notifications — `tender-candidacy.md` §1 (its chain now asserts «מכרז» in he, updated 28.10); notification format (name, quotes, status) — #7a4d7f.

**Rules (whole file):** all tests read-only (`@prod-safe` — no data is created; data exists on staging only). Saved sessions only; no fixed waits / `networkidle`. Language: switch with the header language switcher («עברית» → English / Русский / العربية) or the URL prefix `/en`, `/ru`, `/ar`; switch back to Hebrew at the end (afterEach). Bell: open «התראות», scroll the list until the item is found (`expect.poll`); if the 28.10 notification is no longer in the list → `test.skip` «9dc615 notifications aged out» (fresh coverage: `tender-candidacy.md` §1.3/1.4).
**Word checks (per language), applied to the specific text block, not to the whole page:**
- he: contains `/מכרז/` (e.g. «במכרז», «למכרז», «מנהל/ת המכרז»); does NOT contain `/משרה/`.
- en: contains `/tender/i`; does NOT contain `/\bjob\b/i`.
- ru: contains `/тендер/i`; does NOT contain `/ваканси/i`.
- ar: contains `/مناقص/`; does NOT contain `/وظيف/`.
Data (KEEP): T-62 «QA-AUTO 2110 tsub» HR anonymous submission e9a47077-7545-47cf-89fd-573d4b6bb7a9 (request full profile + «מתאים/ה», 22.10); T-45 «QA-AUTO bc890b מכרז» HR submission f6378225-5715-4723-bed3-566ebc7b2ca9 (28.10, new notifications for HR and owner); T-55 «QA-AUTO 1020 N3 מכרז תאריך 29.02» HR full-profile submission /applications/3cdc8644-a96e-460d-b27c-8884770ca4ca. Owner of all: company = demo-company-1 («סופר פארם»). HR: company_6 = demo-company-6 «מיכל לוי».
Not automated: old 22.10 notifications (text stored at creation — may keep «משרה», not a defect); hunter_plus tender submission notifications (PLUS tender quota per month; manual).

---

### 1. Sender side (HR, company_6)
**Seed:** `tests/seed.company_6.spec.ts`

#### 1.1 HR submission view on a tender says «מנהל/ת המכרז» in he/en/ru/ar @desktop @prod-safe #9dc615
**Status:** READY · **Case:** `.qa/tests/tender-submissions-texts/TT-1-1.md` · **File:** `tests/tender-submissions-texts/hr-submission-view-tender-word-4-languages.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts`
**Device:** desktop
**Users:** company_6 (HR)
**Steps:**
1. Open «ההצעות שלי» → card «QA-AUTO 2110 tsub» (T-62) → dialog «המועמדות שלי – QA-AUTO 2110 tsub».
2. Read the anonymous banner (title «הגשת מועמדות אנונימית») and the full-profile request block («…ביקש/ה את הפרופיל המלא»); close without clicking its buttons.
3. Switch to English, Russian, Arabic; for each repeat steps 1–2 (dialog title «My application – …» / «Мой отклик – …» / Arabic equivalent).
**Expected:**
- he: banner contains «למנהל/ת המכרז»; request block starts with «מנהל/ת המכרז ביקש/ה»; neither contains «משרה». (source: «מה רצוי» «מנהל/ת המכרז»; was «…אינם מוצגים למנהל/ת המשרה», «מנהל/ת המשרה ביקש/ה…»)
- en / ru / ar: banner and request block pass the word check of that language (tender / тендер / مناقصة; no job / вакансия / وظيفة). (source: «מה רצוי» «in all 4 languages»; QA 28.10 `9dc615-T7-hr-view-*.png`)

#### 1.2 HR bell: tender notifications use the tender word in he/en/ru/ar @desktop @prod-safe #9dc615
**Status:** READY · **Case:** `.qa/tests/tender-submissions-texts/TT-1-2.md` · **File:** `tests/tender-submissions-texts/hr-bell-tender-word-4-languages.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts`
**Device:** desktop
**Users:** company_6 (HR)
**Steps:**
1. Open the bell «התראות».
2. Collect the items whose text contains «QA-AUTO bc890b» (T-45, 28.10): status «נצפה/תה», full-profile request by «סופר פארם», status «מתאים/ה».
3. Close the bell; switch to English, Russian, Arabic; repeat steps 1–2 each time.
**Expected:**
- he: at least the 3 items are found; each passes the he word check — status items contain «במכרז „QA-AUTO bc890b מכרז”», the request item contains «למכרז „QA-AUTO bc890b מכרז”»; none contains «במשרה» / «למשרה». (source: «מה רצוי» «HR / headhunter notifications … «במכרז» / «למכרז»»)
- en: items contain "in the tender" / "for the tender" (word check en); ru: word check ru; ar: word check ar. (source: «מה רצוי» «en "tender"; ru «тендер»; ar «مناقصة»»; QA 28.10 `9dc615-T7-hr-bell-*.png`)
- Format kept: candidate name «מיכל לוי», tender title in quotes, new status. (#7a4d7f)

#### 1.3 Submit form on a tender: «יועברו למנהל/ת המכרז» and button «הגשת מיכל לוי למכרז» (he/en/ru/ar), nothing submitted @desktop @prod-safe #9dc615
**Status:** READY · **Case:** `.qa/tests/tender-submissions-texts/TT-1-3.md` · **File:** `tests/tender-submissions-texts/hr-submit-form-tender-word-4-languages.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts`
**Device:** desktop
**Users:** company_6 (HR)
Data: any active tender of another company where the HR row «מיכל לוי» / «הפרופיל שלי» in panel «הגשת מועמדות למכרז» still has «הגשה» (not yet submitted). If none → `test.skip` «no tender open for HR submission» (fresh tenders: `tender-candidacy.md` §1.2).
**Steps:**
1. /tenders → open the first suitable tender → dialog «פרטי המכרז» → panel «הגשת מועמדות למכרז».
2. Read the aria-label of the «הגשה» button of row «מיכל לוי».
3. Click «הגשה» → dialog «הגשת מיכל לוי» → «פרופיל אנונימי» + «אין צורך ב-NDA (ללא עלות)» → «המשך» (if present) → submission form; read the banner «הגשה דיסקרטית» and the note under «הערות נוספות על המועמד/ת».
4. Close the form WITHOUT «סיום והגשה» (close button / Escape; confirm leaving without saving if asked).
5. Switch to English, Russian, Arabic; repeat steps 1–4.
**Expected:**
- he: button aria-label contains «הגשת מיכל לוי למכרז» (not «למשרה»); banner «…יועברו למנהל/ת המכרז…»; the note under «הערות נוספות» mentions «המכרז», not «המשרה». (source: «מה רצוי»; was «יועברו למנהל/ת המשרה», aria-label «הגשת מיכל לוי למשרה»)
- en / ru / ar: aria-label and banner pass the word check of that language. (source: «in all 4 languages»; QA 28.10 `9dc615-T7-submit-form-*.png`)
- After step 4 the HR row still shows «הגשה» (nothing was submitted).

---

### 2. Owner side (company = demo-company-1)
**Seed:** `tests/seed.company.spec.ts`

#### 2.1 Owner's view of the HR full-profile submission: «הוגש/ה למכרז» and role «משאבי אנוש», not «טאלנט» (he/en/ru/ar) @desktop @prod-safe #9dc615
**Status:** READY · **Case:** `.qa/tests/tender-submissions-texts/TT-2-1.md` · **File:** `tests/tender-submissions-texts/owner-application-view-tender-word-and-hr-role.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
**Steps:**
1. Open /applications/3cdc8644-a96e-460d-b27c-8884770ca4ca (HR «מיכל לוי» → T-55).
2. Read block «פרטי ההגשה» (line «הוגש/ה ל… „<title>”») and the role chip under the name «מיכל לוי».
3. Switch to English, Russian, Arabic; reread both.
**Expected:**
- he: «הוגש/ה למכרז „QA-AUTO 1020 N3 מכרז תאריך 29.02”» (contains «למכרז», no «למשרה»); role chip «משאבי אנוש»; the text «טאלנט» is not shown as the role. (source: «מה רצוי» «the owner's view say «מכרז»»; «The role label … shows the real role (HR user …), not «טאלנט»»; QA 28.10 `9dc615-T5-company-app-view-he-desktop.png`)
- en / ru / ar: the «Submitted to …» line passes the word check of that language; role chip is the HR role in that language (en contains "HR"), not "Talent" / «Талант» / «موهبة». (QA 28.10 `9dc615-T5-company-app-view-{en,ru,ar}-desktop.png`)

#### 2.2 Owner bell: «התקבלה מועמדות חדשה למכרז „…”» (he/en/ru/ar) @desktop @prod-safe #9dc615
**Status:** READY · **Case:** `.qa/tests/tender-submissions-texts/TT-2-2.md` · **File:** `tests/tender-submissions-texts/owner-bell-new-tender-candidacy-4-languages.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
**Steps:**
1. Open the bell «התראות»; find the item containing «QA-AUTO bc890b» (new HR candidacy on T-45, 28.10).
2. Switch to English, Russian, Arabic; repeat.
**Expected:**
- he: item text contains «התקבלה מועמדות חדשה למכרז „QA-AUTO bc890b מכרז”» (no «למשרה»); the anonymous candidate is named neutrally («מועמד/ת אנונימי/ת»). (source: «מה רצוי» Company bell; was «התקבלה מועמדות חדשה למשרה …»; QA 28.10 `9dc615-T2-company-bell-desktop.png`)
- en / ru / ar: the same item passes the word check of that language. (QA 28.10 `9dc615-T6-company-bell-*.png`)

---

### 3. Regression — job submissions keep the job texts (hunter_plus)
**Seed:** `tests/seed.hunter_plus.spec.ts`

#### 3.1 Headhunter bell: job notifications still say «במשרה» / «למשרה» (he) and "job" (en) @desktop @prod-safe #9dc615
**Status:** READY · **Case:** `.qa/tests/tender-submissions-texts/TT-3-1.md` · **File:** `tests/tender-submissions-texts/hunter-bell-job-keeps-job-word.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus (claude-test)
Data: notifications about candidate «QA-AUTO 2810 cea191 job» on J-49 «QA company post test» (28.10) — or any newer notification about J-49 (e.g. from `candidacy-timeline.md` §2). If none with «QA company post test» → `test.skip` «job notifications aged out».
**Steps:**
1. Open the bell «התראות»; collect the items containing «QA company post test».
2. Switch to English; repeat; switch back to Hebrew.
**Expected:**
- he: status items contain «במשרה „QA company post test”», the full-profile request item contains «למשרה „QA company post test”»; none contains «מכרז». (source: «מה רצוי» «Job submissions keep the job texts»; QA 28.10 `9dc615-T8-hunter-bell-job-desktop.png`)
- en: the same items contain `/\bjob\b/i` and not `/tender/i`.

#### 3.2 Job submit form: «יועברו למנהל/ת המשרה» and button «הגשת … למשרה», nothing submitted @desktop @prod-safe #9dc615
**Status:** READY · **Case:** `.qa/tests/tender-submissions-texts/TT-3-2.md` · **File:** `tests/tender-submissions-texts/hunter-job-submit-form-keeps-job-word.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. /collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584 (J-49) → «הגשת מועמד» → read the aria-label of the first candidate's submit button.
2. Choose that candidate → «פרופיל אנונימי» + «אין צורך ב-NDA (ללא עלות)» → «המשך» → submission form; read the banner «הגשה דיסקרטית».
3. Close WITHOUT «סיום והגשה» (confirm leaving without saving if asked).
**Expected:**
- aria-label matches `/^הגשת .+ למשרה/`; banner contains «למנהל/ת המשרה»; no «מכרז» in either. (source: «מה רצוי» «Job submissions keep the job texts»; QA 28.10 `9dc615-T8-job-submit-form-desktop.png`)
- Nothing submitted: the candidate is not added to J-49 «הגשת מועמד» list as a new submission.
