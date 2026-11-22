<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Copywriting / texts audit (2026-10-13)

STATUS (2026-10-19): entries marked **READY** belong to tickets the user confirmed as passed («הושלם») — ready for `playwright-test-generator`. NOT generated yet: the `playwright-test` MCP was disconnected when the plan was written. All other entries stay PREPARED (ticket not passed yet).
Board hashes: older entries quote the first 8 chars of the task id (e.g. #d6c93b41); READY entries use the 6-char board hash (#49f47c). Mapping is in each case file («ранее #…»).
Generate a test (playwright-test-generator → tests/copywriting/<name>.spec.ts) ONLY after its ticket is moved to «הושלם» / «עבר QA» by the user. Until then these expectations describe the FIXED state and would fail.
Rules: login only via saved sessions (seed per role); no fixed waits; test data prefix `QA-AUTO-`, cleanup in afterAll; no payments; `@data` = changes shared data (run serially); `@prod-safe` = read-only.
Text expectations are the suggested texts from the tickets — if the client approves different wording, update Expected before generating.

---

### 1. Hebrew spelling & glossary
**Seed:** `tests/seed.spec.ts` (guest), `tests/seed.hunter_plus.spec.ts`, `tests/seed.company.spec.ts`, `tests/seed.admin.spec.ts`

#### 1.1 No known misspellings on public pages @desktop @prod-safe (#9efe48d7)
**Device:** desktop · **Users:** guest
**Steps:** 1. Open /, /headhunters, /talents, /organizations, /about. 2. Read document.body.innerText of each.
**Expected:** none of: «פוטנציטל», «שאויישו», «ריווחיים», «הדאנטרים», «הדהאנטרים», «ההד האנטרים», «פירסום», «מירבית», «רלוונטים», «אירגונים», «איזור», «דיסקרטים», «להבין כשיש», «שתתן».

#### 1.2 No known misspellings in headhunter area @desktop @prod-safe (#9efe48d7)
**Device:** desktop · **Users:** hunter_plus
**Steps:** 1. Open /collaborations (+ filters panel), /my-jobs (+ own job menu «...»), /tenders (+ a tender card), /my-candidates, /profile?tab=subscription, /publish/job step 1.
**Expected:** no «איזור», «שידרוג», «עידכון», «פירסום», «רלוונטים», «תעשיה», «פרויקטאלי», «Scrum Masterית».

#### 1.3 Company wizard & admin texts @desktop @prod-safe (#9efe48d7)
**Users:** company, admin
**Steps:** 1. company: /publish/tender steps 3–4 (open only). 2. admin: /admin/reports, /admin/pricing.
**Expected:** no «איזור», «פירסום», «רק מוודאים . . .», «1 תוצאות», «שידרוג».

#### 1.4 One term per entity on publish flow @desktop @prod-safe (#47533803)
**Users:** hunter_plus
**Steps:** 1. Click «+ פרסום» > «פרסום משרה». 2. Read the page title. 3. Open «שת״פים» and read nav item + page heading.
**Expected:** menu item and page title use the same term (per approved glossary); nav item and heading match.

#### 1.5 Brand written one way @desktop @prod-safe (#47533803)
**Users:** guest
**Steps:** Open /, /talents, /headhunters, /organizations.
**Expected:** no «האנטרס» (brand written as approved, e.g. «Hunters»).

---

### 2. Texts for the right role
**Seed:** `tests/seed.talent.spec.ts`, `tests/seed.company.spec.ts`, `tests/seed.company_6.spec.ts`

#### 2.1 Talent "my application" is written for the talent @desktop @prod-safe (#eb3cf227)
**Users:** talent
**Steps:** 1. Open a job the talent applied to. 2. Click «צפייה במועמדות שלי».
**Expected:** no «הגשת מועמד:», no «למועמד/ת» in 3rd person, no «לא נענתה»; status equals the status on the job card.

#### 2.2 Talent header "pending" and tooltip @desktop @prod-safe (#eb3cf227)
**Users:** talent
**Steps:** 1. Click «ממתינים». 2. Hover «i» near «טווח שכר».
**Expected:** no «מועמדים ממתינים לאישור»; tooltip does not contain «התקציב שהלקוח הגדיר».

#### 2.3 Talent rating criteria @desktop @prod-safe (#eb3cf227)
**Users:** talent
**Steps:** Open a headhunter profile > «עריכת הדירוג שלך».
**Expected:** no category «איכות המועמדים».

#### 2.4 Talents landing CTA @desktop @prod-safe (#eb3cf227)
**Users:** guest
**Steps:** Open /talents, scroll to the bottom block.
**Expected:** no «יותר גיוסים בפחות זמן».

#### 2.5 Company sees job wording @desktop @prod-safe (#eb3cf227)
**Users:** company
**Steps:** 1. Open the bell. 2. Open own job dialog. 3. Profile > «עריכת פרופיל».
**Expected:** no «לשת”פ» / «לשת״פ» in company notifications; no «הצעות שהוגשו לשת״פ»; no «תואר מקצועי», «כמה מילים עליך», «הד האנטרית ויועצת קריירה».

#### 2.6 HR tender offer wording @desktop @prod-safe (#eb3cf227)
**Users:** company_6
**Steps:** Open an active tender > offer form (do not submit).
**Expected:** no «לייצוג משרה זו».

#### 2.7 Talent profile tab has no headhunter term @desktop @prod-safe #7e0769
**Status:** READY — #7e0769 прошёл QA, «עבר QA» 2026-10-21 · **Case:** `.qa/tests/copywriting/CW-2-7.md` · **File:** `tests/copywriting/talent-profile-tab-no-collaboration-term.spec.ts`
**Seed:** `tests/seed.talent.spec.ts`
**Device:** desktop
**Users:** talent
**Steps:**
1. Open /profile (talent session).
2. Read the profile tab row and the page text.
**Expected:**
- The tab row is, in order: «החשבון שלי», «המועמדויות שלי», «המנוי שלי», «הסכמים», «חשבוניות». (source: «מה רצוי» #7e0769 — talent tab renamed to «המועמדויות שלי»)
- No tab «השת״פים שלי».
- The page text contains none of «שת״פ» (U+05F4), «שת"פ» (ASCII "), «שת”פ» (U+201D).

#### 2.8 Talent apply dialog says «מנהל/ת המשרה», not «מנהל השת״פ» @desktop @prod-safe #7e0769
**Status:** READY — #7e0769 прошёл QA, «עבר QA» 2026-10-21 · **Case:** `.qa/tests/copywriting/CW-2-8.md` · **File:** `tests/copywriting/talent-apply-dialog-job-manager-wording.spec.ts`
**Seed:** `tests/seed.talent.spec.ts`
**Device:** desktop
**Users:** talent
**Precondition / skip:** the shared talent accounts used their FREE apply quota (talent until 28.10, talent_2 until 23.10). If after step 2 the dialog «הגשת מועמדות» does not open (an upgrade / «מעוניין במשרה הזאת?» block instead, or no «הגשת מועמדות» button) — `test.skip(true, 'talent apply quota used — dialog not available')` with an annotation; never click upgrade/payment. READ-ONLY: never submit, never click «המשך»/«המשך לתשלום»/«הגשה».
**Steps:**
1. Open /collaborations, open a job the talent has not applied to (/collaborations/<id>; the job page shows the button «הגשת מועמדות»).
2. Click «הגשת מועמדות».
3. Read the texts of the dialog «הגשת מועמדות».
4. Close the dialog without submitting (close arrow / Escape).
**Expected:**
- The dialog contains «האם לחייב את מנהל/ת המשרה לחתום על NDA לפני הצפייה בהגשה?». (source: «מה רצוי» #7e0769 — replace «מנהל השת״פ» with «מנהל/ת המשרה»)
- The dialog contains «מנהל/ת המשרה יחתמו על הסכם סודיות לפני שיראו את פרטי ההגשה». (same source)
- The dialog text contains none of «שת״פ», «שת"פ», «שת”פ». (same source)
- The NDA option («לחייב NDA») is still present. (§45 AC01/AC07)

---

### 3. NDA, FAQ, legal & landing content
**Seed:** `tests/seed.hunter_plus.spec.ts`, `tests/seed.company.spec.ts`, `tests/seed.spec.ts`

#### 3.1 NDA term consistent @desktop @prod-safe (#b2dc02cd)
**Users:** hunter_plus, company
**Steps:** /profile?tab=agreements > «צפייה» on a signed NDA.
**Expected:** term in the text matches «בתוקף עד»; no «לא נשמרה חתימה סרוקה להסכם זה»; company NDA has no «מנהל/ת השת״פ».

#### 3.2 FAQ legal sentence and NDA consistency @desktop @prod-safe (#86f99209)
**Users:** hunter_plus
**Steps:** Open /faq, tab headhunters, expand all questions.
**Expected:** no «חוק מאגרי המידע, חל על המשתמש»; contains «תיקון 13 לחוק הגנת הפרטיות»; no answer is empty.

#### 3.3 FAQ footer link opens for guest @desktop @prod-safe (#86f99209)
**Users:** guest
**Steps:** Click footer «שאלות נפוצות».
**Expected:** URL is not /login.

#### 3.4 Legal pages have real text @desktop @prod-safe (#83984efe)
**Users:** guest
**Steps:** Open /terms, /privacy, /accessibility (he, en).
**Expected:** no «כותרת בדרגה 2», no «Heading level 2», no «Lorem», no «Duis aute».

#### 3.5 Landing content @desktop @prod-safe (#83984efe)
**Users:** guest
**Steps:** Open /, /headhunters, /login.
**Expected:** no «טראמפ», «מסי», «נואלס»; no «מבוסס ומלווה»; /login has no «בהרשמה לאתר»; footer year = current year.

---

### 4. Prices, payment & dev texts
**Seed:** `tests/seed.company.spec.ts`, `tests/seed.hunter_plus.spec.ts`, `tests/seed.talent.spec.ts`, `tests/seed.admin.spec.ts`

#### 4.1 Free publish has no payment wording @desktop @prod-safe (#5398ef59 #6f413ce2)
**Users:** company
**Steps:** /publish/tender step 1; existing tender draft → step 4 (do not create new drafts).
**Expected:** no «50% הנחה» next to a ₪0 option; a ₪0 tender is published without a «אישור תשלום ₪0.00» window; no «ממתין לתשלום» on a free tender.

#### 4.2 Talent plans popup texts @desktop @prod-safe (#5398ef59)
**Users:** talent
**Steps:** Click the FREE badge.
**Expected:** no «צפייה מוגבלת בכל המשרות», no «עד 10% חיסכון», no «ממחיר מחירון».

#### 4.3 Payment window texts and coupon errors for a headhunter @desktop @prod-safe #f8ec88
**Status:** READY — #f8ec88 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-4-3.md` · **File:** `tests/copywriting/payment-window-texts-and-coupon-errors-hunter.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open «המשרות שלי», open an own job, click «שדרוג משרה», choose «שירותי הפצה», click «לרכישה» — the «תשלום» window opens.
2. Leave «קוד קופון» empty and click its «אישור».
3. Type «QA-AUTO-WRONG» in «קוד קופון» and click «אישור».
4. Close the window with the «>» arrow. Never click «אישור תשלום».
**Expected:**
- The window has no «עתידות» and no «דיירקט»; it shows «כרטיס אשראי» and «לרכישות עתידיות». (source: «מה רצוי» #f8ec88)
- Empty coupon → message «יש להזין קוד קופון». (source: «מה רצוי»)
- Wrong coupon → message «קוד הקופון אינו בתוקף». (source: «מה רצוי»)
- The product, amount and «סה״כ» are shown. (§69 AC02)

#### 4.3b Company coupon errors match the headhunter @desktop @prod-safe #f8ec88
**Status:** READY — #f8ec88 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-4-7.md` · **File:** `tests/copywriting/payment-window-coupon-errors-company.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
**Steps:**
1. Open «המשרות שלי», open an own job, open its promotion («קידום» / «שדרוג משרה»), click «לרכישה».
2. Empty coupon → «אישור»; then «QA-AUTO-WRONG» → «אישור».
3. Close the window without paying.
**Expected:**
- Empty → «יש להזין קוד קופון»; wrong → «קוד הקופון אינו בתוקף» — same texts as for the headhunter. (source: «מה רצוי» #f8ec88, «the same feedback for all roles»)
- No «עתידות», no «דיירקט».

#### 4.3c NDA payment shows a translated product name in he/en/ru/ar @desktop @data #9df6cb
**Status:** READY — #9df6cb прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-4-6.md` · **File:** `tests/copywriting/nda-payment-product-name-translated.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open the job «QA company post test» (/collaborations, job of demo-company-1), click «הגשת מועמד», pick an existing candidate, choose «פרופיל אנונימי» and «לחייב NDA (₪35)», click «המשך לתשלום».
2. Read the product name in the right card; close the window without paying.
3. Repeat in English, Russian and Arabic (language switcher or /en, /ru, /ar URL prefix).
4. Cleanup: if an unpaid submission appears, log it for cleanup (test-data journal).
**Expected:**
- No text «checkout.» anywhere in the window (no «checkout.products.application_nda»); the product name contains «NDA» (he: «חתימת NDA על הגשת מועמד»). (source: «מה רצוי» #9df6cb, «in all languages»)
- In en/ru/ar the name is not in Hebrew.
- The name fits its card (element scrollWidth ≤ clientWidth).
- Card shows ₪35 and «סה״כ» ₪35. (§69 AC02)
#### 4.4 Admin pricing has no dev notes @desktop @prod-safe (#ff5d40b7)
**Users:** admin
**Steps:** Open /admin/pricing.
**Expected:** no «PRD 5», no «בכרטיסי החבילות כתוב», no «(דיווחים › ייצוג)»; raw keys not shown without a label.

#### 4.5 No "coming soon" stub in filters @desktop @prod-safe (#ff5d40b7)
**Users:** hunter_plus
**Steps:** /collaborations > open filters.
**Expected:** no «יתווספו בקרוב».

---

### 5. Action messages & validation
**Seed:** `tests/seed.hunter_plus.spec.ts`, `tests/seed.company.spec.ts`

#### 5.1 Add candidate: too-long error is translated and shows the limit @desktop @prod-safe #49f47c
**Status:** READY — #49f47c прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-5-1.md` · **File:** `tests/copywriting/add-candidate-too-long-error-translated.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open /my-candidates/new, choose «פרופיל גלוי».
2. Type 101 characters in «שם פרטי» and «שם משפחה», 3001 characters in «כמה מילים על המועמד», leave «טלפון» empty.
3. Click «המשך».
4. Repeat on /en/my-candidates/new. Close the dialog without saving.
**Expected:**
- No «onboarding.errors» anywhere (he and en). (source: «מה רצוי» #49f47c)
- Under first and last name: «הטקסט ארוך מדי (עד 100 תווים)» (en: a too-long text with «100»).
- Under «כמה מילים על המועמד»: a too-long text with its limit number.
- The length errors appear together with «יש להכניס מספר טלפון תקין» after one click. (#445683 regression)
#### 5.2 Add candidate: anonymous profile requires title and summary @desktop @data #ba4009
**Status:** READY — #ba4009 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-5-2.md` · **File:** `tests/copywriting/add-candidate-anonymous-requires-title-summary.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open /my-candidates/new, choose «פרופיל אנונימי», fill step 1 validly (first name «QA-AUTO-ba4009», last name, phone 0501231234), click «המשך».
2. Step 2: «כותרת» → «עריכה» → clear; «תקציר המועמד» → «עריכה» → clear.
3. Click «סיום».
4. Close the dialog. Cleanup (afterAll): if «QA-AUTO-ba4009» appears in «המועמדים שלי», delete it.
**Expected:**
- The dialog stays open; under «כותרת» and «תקציר המועמד»: «יש למלא כותרת ותקציר לפרופיל אנונימי». (source: «מה רצוי» #ba4009)
- «המועמדים שלי» has no «QA-AUTO-ba4009».

#### 5.2b Add candidate: second phone is validated like the main phone @desktop @prod-safe #ba4009
**Status:** READY — #ba4009 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-5-12.md` · **File:** `tests/copywriting/add-candidate-second-phone-validated.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open /my-candidates/new, «פרופיל גלוי», fill first/last name and «טלפון» 0501231234.
2. Type «abc» in «טלפון נוסף», click «המשך».
3. Clear «טלפון נוסף», click «המשך». Close the dialog without saving.
**Expected:**
- Step 2: under «טלפון נוסף» «יש להכניס מספר טלפון תקין»; still on step 1. (source: «מה רצוי» #ba4009)
- Step 3: no error, step 2 opens (field stays optional).

#### 5.2c Add candidate: no anonymous hint for an open profile @desktop @prod-safe #ba4009
**Status:** READY — #ba4009 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-5-13.md` · **File:** `tests/copywriting/add-candidate-open-profile-no-anonymous-hint.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open /my-candidates/new, «פרופיל גלוי», fill step 1 validly, click «המשך».
2. Read step 2 hints. Close without clicking «סיום».
**Expected:**
- No «בפרופיל אנונימי יוצגו רק הכותרת והתקציר» on the open-profile step 2 (or the text «כותרת ותקציר המועמד» instead). (source: «מה רצוי» #ba4009 — either is accepted)
#### 5.3 Submit candidate: summary, screening answer and salary are validated @desktop @data #3b9172
**Status:** READY — #3b9172 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-5-3.md` · **File:** `tests/copywriting/submit-candidate-validation.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open the job «QA company post test» (has the screening question «QA test question»), click «הגשת מועמד», pick a candidate not yet submitted to it, choose «פרופיל אנונימי» without NDA, continue to the submission form.
2. Clear «תקציר המועמד», leave the screening answer empty, type «abc» in «שכר מבוקש».
3. Click «סיום והגשה».
4. Close the dialog without submitting.
**Expected:**
- Nothing is submitted, the dialog stays open. (source: «מה רצוי» #3b9172)
- Errors: «יש למלא תקציר מועמד», «יש לענות על שאלת הסינון», «יש להזין שכר במספרים».

#### 5.3b Submitted candidate: success toast for the headhunter and a clean card for the company @desktop @data #3b9172
**Status:** READY — #3b9172 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-5-14.md` · **File:** `tests/copywriting/submit-candidate-toast-and-company-card.spec.ts`
**Seed:** — (multi-role: `import { test, expect } from '../../fixtures'`, `asUser('hunter_plus')`, `asUser('company')`)
**Device:** desktop
**Users:** hunter_plus, company — two roles: written by autotest-writer with `asUser`, not by the official generator
**Steps:**
1. hunter_plus: /my-candidates/new → «פרופיל אנונימי», name «QA-AUTO-3b9172-<timestamp>», save the candidate.
2. hunter_plus: job «QA company post test» → «הגשת מועמד» → this candidate → anonymous, NO NDA → summary «QA-AUTO summary», answer «QA-AUTO answer», salary 15000 → «סיום והגשה».
3. company: «המשרות שלי» → «QA company post test» → the new anonymous submission.
4. Cleanup (afterAll): company rejects the submission («דחייה»); hunter_plus deletes the QA-AUTO candidate; anything left → test-data journal.
**Expected:**
- Toast «המועמד/ת הוגש/ה בהצלחה» after step 2. (source: «מה רצוי» #3b9172)
- Company card: summary «QA-AUTO summary» (not «—»), answer «QA-AUTO answer» (not «לא נענתה»), salary 15000 (not «abc»).
- Banner title without «!» (now «הגשה אנונימית»); no «הגשת מועמד באופן דיסקרטי!». (#11606e p.5; banner colour is not checked — user decision 2026-10-18)
#### 5.4 Tender wizard – invalid date message @desktop @prod-safe (#2e0433e8)
**Users:** company
**Steps:** Existing tender draft > step 3 > end date 31.02.2027 > «המשך».
**Expected:** no «משהו השתבש»; field error about the date.

#### 5.5 Validation errors clear after fixing @desktop @prod-safe (#4c9e57c4)
**Users:** company
**Steps:** Tender draft step 4: click «המשך» empty, then check the boxes.
**Expected:** «יש לאשר כדי להמשיך» disappears after checking.

#### 5.6 Company profile – website error and required name @desktop @prod-safe (#4c9e57c4)
**Users:** company
**Steps:** Profile > «עריכת פרופיל», website «abc», clear company name, save (expect block), then cancel.
**Expected:** website error mentions a link («קישור»), not «כתובת»; empty company name is rejected. Do not save changes.

#### 5.7 Candidate status labels @desktop @prod-safe (#6143e27e)
**Users:** company
**Steps:** Own job «QA company post test» > candidate > open status menu (do not change).
**Expected:** no «מוכר ונשלל», no «הסיר מועמדות» without subject; a "hired" status exists.

#### 5.8 Notification texts @desktop @prod-safe (#ee66432b)
**Users:** hunter_plus
**Steps:** Open the bell.
**Expected:** «ביקש/ה את הפרופיל המלא» notifications contain a candidate name; status-update notifications contain the new status; ended-job notifications contain «המשרה».

#### 5.9 Report dialog reasons for tender, job and profile @desktop @prod-safe #11606e
**Status:** READY — #11606e прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-5-9.md` · **File:** `tests/copywriting/report-dialog-reasons.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. /tenders → open a tender → «דיווח» → read reasons → close (✕ / «ביטול»).
2. /collaborations → open a job of another user → «דיווח» → read reasons → close.
3. /headhunters → «הד האנטר דמו 3» → «דיווח על הפרופיל» → read reasons → close. Never send a report.
**Expected:**
- Tender: «מכרז מזויף» present, «פרופיל מזויף» absent. (source: «מה רצוי» #11606e p.2)
- Job: «משרה מזויפת» present, «פרופיל מזויף» absent.
- Profile: «פרופיל מזויף» present (not broken). (§82 AC02)

#### 5.9b Archive confirmation title is a question @desktop @prod-safe #11606e
**Status:** READY — #11606e прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-5-15.md` · **File:** `tests/copywriting/archive-confirmation-question.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
**Steps:**
1. «המשרות שלי» → active job «QA company post test» → «...» → «העברה לארכיון».
2. Read the dialog title; close with ✕ (do not archive).
**Expected:**
- Title «להעביר את המשרה לארכיון?» — ends with «?», no «!». (source: «מה רצוי» #11606e p.4)
- The job is still active after closing.

#### 5.9c Archived job cards have no hot label @desktop @prod-safe #11606e
**Status:** READY — #11606e прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-5-16.md` · **File:** `tests/copywriting/archived-job-card-no-hot-label.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
**Steps:**
1. «המשרות שלי» → «ארכיון» («משרות בארכיון»).
**Expected:**
- Every card has the «בארכיון» badge and no «משרה חמה». (source: «מה רצוי» #11606e p.4)
- No future end date on archived cards.

#### 5.9d Company: anonymous submission banner title has no exclamation @desktop #11606e
**Status:** READY — #11606e прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-5-17.md` · **File:** `tests/copywriting/anonymous-submission-banner-title.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
**Steps:**
1. «המשרות שלי» → «QA company post test» → «הצעות שהוגשו למשרה» → an anonymous submission («מועמד/ת אנונימי/ת»).
2. Read the banner; close.
**Expected:**
- No «הגשת מועמד באופן דיסקרטי!»; banner title has no «!» (now «הגשה אנונימית»). (source: «מה רצוי» #11606e p.5)
#### 5.10 AI summary uses only given data @desktop @data (#558523f8)
**Users:** hunter_plus
**Steps:** Create QA-AUTO candidate with minimal summary (no teamwork/projects) and submit to a test job; read AI summary.
**Expected:** summary does not mention «לעבוד בצוות» / «ניהול פרויקט». Cleanup: delete candidate/submission.

#### 5.11 Anonymous talent not revealed @desktop @prod-safe (#80c43786)
**Users:** hunter_plus
**Steps:** /profile/6d861aae-d59d-4b36-9d25-92d9b7069f08 > «ייצג את הטאלנט הזה»; another anonymous profile > «שליחת הודעה».
**Expected:** chat header and chat list show «טאלנט אנונימי»; no real name, no phone, no email before approved disclosure.

#### 5.12 Add candidate: anonymous profile text speaks about the candidate @desktop @prod-safe #cccb78
**Status:** READY — #cccb78 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-5-18.md` · **File:** `tests/copywriting/add-candidate-anonymous-text-third-person.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open /my-candidates/new.
2. Read the descriptions of «פרופיל אנונימי» and «פרופיל גלוי». Close.
**Expected:**
- «פרופיל אנונימי» description has no «שמך», «פרטיך», «תבחר לחשוף את פרטיך». (source: «מה רצוי» #cccb78)
- It contains «המועמד» and «NDA» (now «ללא פרטים אישיים. השם ופרטי הקשר של המועמד ייחשפו רק למי שתבחרו, לאחר חתימה על NDA»).
- «פרופיל גלוי» description contains «של המועמד».

#### 5.12b Talent edit profile: anonymous option still addresses the talent @desktop @prod-safe #cccb78
**Status:** READY — #cccb78 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-5-19.md` · **File:** `tests/copywriting/talent-edit-profile-anonymous-text.spec.ts`
**Seed:** `tests/seed.talent_2.spec.ts`
**Device:** desktop
**Users:** talent_2
**Steps:**
1. /profile → «עריכה» → the anonymous / open profile choice.
2. Read the anonymous description; close without saving.
**Expected:**
- The talent's anonymous text does not talk about «המועמד» — it still addresses the talent (shared key not broken). (brief #cccb78 Р1)

#### 5.13 Add candidate: CV block text and +972 prefix on the left in RTL @desktop @prod-safe #7f472d
**Status:** READY — #7f472d прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-5-20.md` · **File:** `tests/copywriting/add-candidate-cv-text-and-phone-prefix.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open /my-candidates/new («פרופיל גלוי»), scroll to «קובץ קו״ח».
2. Type 501231234 in «טלפון»; look at «טלפון נוסף».
3. Repeat on /en/my-candidates/new. Close without saving.
**Expected:**
- No «תנאי הכרחי לכל הד האנטר», «הפרופיל שלך יופעל ויפורסם», «התחברות לאתר ולחיצה על הפרופיל». (source: «מה רצוי» #7f472d)
- CV block: heading «קובץ קו״ח», button «הוספת קובץ».
- he: «טלפון» and «טלפון נוסף» prefix shows «+972» (not «972+») and is left of the number field (prefix box right edge ≤ field box left edge).
- en: prefix also left of the field.
---

### 6. Translations
**Seed:** `tests/seed.hunter_plus.spec.ts`, `tests/seed.spec.ts`

#### 6.1 English cards have no Hebrew dictionary values @desktop @prod-safe (#177d6270)
**Users:** hunter_plus
**Steps:** /en/collaborations and /en/tenders.
**Expected:** no «תל אביב», «הרצליה», «משרה מלאה» on cards; dates not in «MM.DD.YYYY».

#### 6.2 Language switcher native names @desktop @prod-safe (#177d6270)
**Users:** guest
**Steps:** Open the language switcher on /.
**Expected:** options «English», «עברית», «Русский», «العربية».

---

### 7. Mobile layout (emulation)
**Seed:** role seeds; devices iPhone 13 Mini / Pixel 7

#### 7.1 Admin burger menu shows all sections @mobile @prod-safe #0bb217
**Status:** READY — #0bb217 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-7-1.md` · **File:** `tests/copywriting/admin-burger-menu-mobile.spec.ts`
**Seed:** `tests/seed.admin.spec.ts`
**Device:** mobile (iPhone 13 Mini + Pixel 7)
**Users:** admin
**Steps:**
1. Open /admin/users, tap the burger.
2. Check the items; tap «משרות».
3. Open /admin/pricing, burger → «יומן פעולות».
**Expected:**
- Menu overlays the page; all 10 items visible (last one reachable by scrolling the menu): משתמשים, משרות, מכרזים, מועמדויות, דיווחים ופניות, הודעות מערכת, מחירים וקופונים, שאלות נפוצות, רשימות מערכת, יומן פעולות. (source: «מה רצוי» #0bb217)
- elementFromPoint at each item centre is that link.
- «משרות» → /admin/jobs and the menu closes; «יומן פעולות» → /admin/log.
#### 7.2 Company: publish job and tender in the mobile burger @mobile @prod-safe #282d5b
**Status:** READY — #282d5b прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-7-2.md` · **File:** `tests/copywriting/company-publish-items-mobile-burger.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** mobile
**Users:** company
**Steps:**
1. Open /, tap the burger.
2. Tap «פרסום משרה» → wizard opens; go back.
3. Burger → «פרסום מכרז» → wizard opens. Do not click «המשך».
**Expected:**
- Burger has «פרסום משרה» and «פרסום מכרז». (source: «מה רצוי» #282d5b)
- They open /publish/job and /publish/tender step 1. (§34 AC03)

#### 7.2b Headhunter PLUS: publish item and plan badge in the mobile burger @mobile @prod-safe #282d5b
**Status:** READY — #282d5b прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-7-8.md` · **File:** `tests/copywriting/headhunter-plus-publish-and-plan-badge-mobile.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** mobile
**Users:** hunter_plus
**Steps:**
1. Open /, tap the burger; read the items and the plan badge.
2. Tap «פרסום משרה» → /publish/job step 1 opens (do not click «המשך»).
**Expected:**
- Publish item («פרסום משרה» per glossary) and plan badge «PLUS» in the burger. (source: «מה רצוי» #282d5b)
- The item opens the job wizard.

#### 7.2b-2 Headhunter FREE: plan badge in the mobile burger @mobile @prod-safe #282d5b
**Status:** READY — #282d5b прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-7-8.md` · **File:** `tests/copywriting/headhunter-free-plan-badge-mobile.spec.ts`
**Seed:** `tests/seed.hunter_free_2.spec.ts`
**Device:** mobile
**Users:** hunter_free_2 (demo-hunter-3, FREE). Do not use hunter_free (demo-hunter-2): it is PLUS until 24.10.2026.
**Steps:**
1. Open /, tap the burger; read the plan badge.
**Expected:**
- Plan badge «FREE» in the burger. (source: «מה רצוי» #282d5b — badge reflects the real plan)
#### 7.2c Talent gets no publish item on mobile @mobile @prod-safe #282d5b
**Status:** READY — #282d5b прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-7-9.md` · **File:** `tests/copywriting/no-publish-item-for-talent-mobile.spec.ts`
**Seed:** `tests/seed.talent_2.spec.ts`
**Device:** mobile
**Users:** talent_2
**Steps:**
1. Open /, tap the burger; then open the avatar menu.
**Expected:**
- No «פרסום משרה», «פרסום מכרז», «+ פרסום». (brief #282d5b С2, §03)

#### 7.2c-2 HR user gets no publish item on mobile @mobile @prod-safe #282d5b
**Status:** READY — #282d5b прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-7-9.md` · **File:** `tests/copywriting/no-publish-item-for-hr-mobile.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts`
**Device:** mobile
**Users:** company_6 (HR)
**Steps:**
1. Open /, tap the burger; then open the avatar menu.
**Expected:**
- No «פרסום משרה», «פרסום מכרז», «+ פרסום» (same as HR on desktop). (brief #282d5b С2)
#### 7.3 Footer fits the screen in every language @mobile @prod-safe #d1fbd5
**Status:** READY — #d1fbd5 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-7-3.md` · **File:** `tests/copywriting/footer-fits-mobile-all-languages.spec.ts`
**Seed:** `tests/seed.spec.ts`
**Device:** mobile
**Users:** guest
**Steps:**
1. Open /ru/login, /en/login, /login, /ar/login, /ru, /en.
2. Scroll to the footer on each.
**Expected:**
- document.documentElement.scrollWidth ≤ window.innerWidth on every page. (source: «מה רצוי» #d1fbd5)
- Footer bottom row (©, accessibility link) fully inside 0..innerWidth with ≥ 8 px side margin.
#### 7.4 Admin tables usable on mobile @mobile @prod-safe #e11528
**Status:** READY — #e11528 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-7-4.md` · **File:** `tests/copywriting/admin-tables-mobile.spec.ts`
**Seed:** `tests/seed.admin.spec.ts`
**Device:** mobile
**Users:** admin
**Steps:**
1. Open /admin/users, /admin/jobs, /admin/tenders, /admin/applications, /admin/lists, /admin/log, /admin/pricing.
2. For a table wider than its container: check the hint at the left (RTL) edge, scroll the container to the actions/status column.
**Expected:**
- No page side scroll (scrollWidth ≤ innerWidth). (source: «מה רצוי» #e11528)
- Each table: cards «label: value», or (scrollWidth > clientWidth) a visible scroll hint (shadow/arrow) at the hidden-columns edge, and after scrolling the actions/status column is visible.

#### 7.4b Admin empty states centred on the screen @mobile @prod-safe #e11528
**Status:** READY — #e11528 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-7-10.md` · **File:** `tests/copywriting/admin-empty-states-mobile.spec.ts`
**Seed:** `tests/seed.admin.spec.ts`
**Device:** mobile
**Users:** admin
**Steps:**
1. Open /admin/messages.
2. Open /admin/pricing, block «קופונים».
(Data-dependent: if the lists are no longer empty, annotate and skip the check instead of failing.)
**Expected:**
- «עוד לא נשלחו הודעות מערכת» and «עוד אין קופונים» fully inside 0..innerWidth, text centre within ±24 px of the screen centre. (source: «מה רצוי» #e11528)

#### 7.4c Company agreements and invoices usable on mobile @mobile @prod-safe #e11528
**Status:** READY — #e11528 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-7-11.md` · **File:** `tests/copywriting/company-agreements-invoices-mobile.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** mobile
**Users:** company
**Steps:**
1. Open /profile?tab=agreements.
2. Open /profile?tab=invoices.
**Expected:**
- Agreements: name, date, status and «צפייה» visible, or a visible scroll hint and reachable by scrolling. (source: «מה רצוי» #e11528)
- Invoices: «צפייה» visible without scrolling (scrollWidth ≤ clientWidth).
- No page side scroll.

#### 7.4c-2 Headhunter agreements, invoices and candidate activity usable on mobile @mobile @prod-safe #e11528
**Status:** READY — #e11528 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-7-11.md` · **File:** `tests/copywriting/headhunter-agreements-invoices-activity-mobile.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** mobile
**Users:** hunter_plus
**Steps:**
1. Open /profile?tab=agreements and /profile?tab=invoices.
2. «המועמדים שלי» → open a candidate → «פעילות אחרונה».
**Expected:**
- Agreements and invoices as in 7.4c. (source: «מה רצוי» #e11528)
- Activity: the time column is visible.
#### 7.5 Profile tabs reachable on mobile — talent @mobile @prod-safe #950890
**Status:** READY — #950890 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-7-5.md` · **File:** `tests/copywriting/profile-tabs-mobile-talent.spec.ts`
**Seed:** `tests/seed.talent_2.spec.ts`
**Device:** mobile
**Users:** talent_2
**Steps:**
1. Open /profile, /profile?tab=subscription, /profile?tab=invoices, /profile?tab=agreements.
2. «עריכה» → dialog tabs → «ניסיון מקצועי».
**Expected:**
- The active tab is fully inside 0..innerWidth on each URL. (source: «מה רצוי» #950890)
- If the tab row overflows: a visible hint (fade/arrow) on the hidden side; scrolling the row reveals the last tab.
- In the dialog «ניסיון מקצועי» is visible or reachable and fully visible when selected.
- No page side scroll.

#### 7.5b Profile tabs reachable on mobile — headhunter, he and en @mobile @prod-safe #950890
**Status:** READY — #950890 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-7-12.md` · **File:** `tests/copywriting/profile-tabs-mobile-headhunter.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** mobile
**Users:** hunter_plus
**Steps:**
1. /profile, ?tab=subscription, ?tab=invoices, ?tab=agreements.
2. /en/profile?tab=invoices, /en/profile?tab=agreements.
3. «עריכת פרופיל» dialog tabs.
**Expected:**
- Active tab fully visible; overflowing row has a visible hint; «Agreements», «Invoices» reachable. (source: «מה רצוי» #950890)
#### 7.6 Texts fit containers @mobile @prod-safe (#3d66fbfa)
**Users:** talent, company_6, guest
**Steps:** Open a job dialog; a tender dialog; /headhunters promo card.
**Expected:** salary range element scrollWidth <= clientWidth and does not overlap neighbors; category chip text inside chip box; «משרה חמה» one line; /headhunters icon does not overlap the heading.

#### 7.7 Lists show key text @mobile @prod-safe (#daccd032)
**Users:** company_6, hunter_plus
**Steps:** /tenders; /talents-bank.
**Expected:** tender description and talent title not cut to one line (line-clamp ≥ 2).

---

### 8. Role-specific titles, wizard and admin/settings texts
**Seed:** `tests/seed.company.spec.ts`, `tests/seed.hunter_plus.spec.ts`, `tests/seed.admin.spec.ts`, `tests/seed.company_6.spec.ts`, `tests/seed.company_2.spec.ts`

#### 8.1 Company sees job titles, not collaboration titles @desktop @prod-safe #535002
**Status:** READY — #535002 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-8-1.md` · **File:** `tests/copywriting/company-job-titles.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
**Steps:**
1. «+ פרסום» → «פרסום משרה»; read the step 1 title (do not click «המשך»).
2. «המשרות שלי» → «QA company post test»; read the dialog title.
**Expected:**
- Wizard title «פרסום משרה», no «פרסום שת״פ». (source: «מה רצוי» #535002)
- Job dialog title «פרטי המשרה», no «פרטי השת״פ».

#### 8.2 Headhunter publish wizard and job dialog titles (regression) @desktop @prod-safe #535002
**Status:** READY — #535002 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-8-2.md` · **File:** `tests/copywriting/headhunter-job-titles.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. «+ פרסום» → publish wizard; read the step 1 title.
2. «המשרות שלי» → own job; read the dialog title.
**Expected:**
- Titles present and per glossary: «פרסום משרה», «פרטי המשרה» (state on 2026-10-18). (brief #535002 С1)

#### 8.3 Tender wizard NDA question is about submitting an offer @desktop @prod-safe #9e49e0
**Status:** READY — #9e49e0 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-8-3.md` · **File:** `tests/copywriting/tender-wizard-nda-question.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
**Steps:**
1. Open an EXISTING tender draft of demo-company-1 (e.g. «QA copy audit - לא לפרסם» 1f000004 or «QA-AUTO bc890b-v draft - לא לפרסם» fc32fe66) and go to step 2 («שלב 2 מתוך 4»). Do not start a new wizard and click «המשך» on step 1 (it creates a draft).
2. Read the NDA question and both options. Leave without publishing.
**Expected:**
- Question about submitting an offer: «האם הגשת הצעה למכרז מחייבת חתימה על מסמך סודיות (NDA)?»; no «צפייה בפרטי המכרז מחייבת». (source: «מה רצוי» #9e49e0)
- Option «לחייב NDA» says hunters must sign NDA «כדי להגיש הצעה»; «אין צורך ב-NDA» says they submit «ללא חתימה על NDA».

#### 8.4 Remote region has a Hebrew name in filters @desktop @prod-safe #9e49e0
**Status:** READY — #9e49e0 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-8-4.md` · **File:** `tests/copywriting/remote-region-hebrew-filters.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. /collaborations → filter «אזור משרה».
2. /tenders → region filter.
**Expected:**
- «עבודה מרחוק» present, no «Remote». (source: «מה רצוי» #9e49e0)

#### 8.5 Admin regions list names the remote region in Hebrew @desktop @prod-safe #9e49e0
**Status:** READY — #9e49e0 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-8-5.md` · **File:** `tests/copywriting/admin-regions-remote-hebrew.spec.ts`
**Seed:** `tests/seed.admin.spec.ts`
**Device:** desktop
**Users:** admin
**Steps:**
1. /admin → «רשימות מערכת» → «אזורים».
**Expected:**
- The remote region is «עבודה מרחוק», not «Remote». (source: «מה רצוי» #9e49e0)

#### 8.6 Admin pricing: PLUS/PREMIUM not described as plans for HR @desktop @prod-safe #a92a99
**Status:** READY — #a92a99 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-8-6.md` · **File:** `tests/copywriting/admin-plans-not-for-hr.spec.ts`
**Seed:** `tests/seed.admin.spec.ts`
**Device:** desktop
**Users:** admin
**Steps:**
1. /admin/pricing → «חבילות להד האנטרים»; read PLUS/PREMIUM monthly and yearly descriptions.
2. Same on /en/admin/pricing. Never click «שמירה».
**Expected:**
- No description contains «ולמשתמשי HR» (en: no «and HR users»). (source: «מה רצוי» #a92a99)
- Descriptions say the plan is for headhunters («להד האנטרים»).

#### 8.7 HR profile has no monthly plan (control) @desktop @prod-safe #a92a99
**Status:** READY — #a92a99 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-8-7.md` · **File:** `tests/copywriting/hr-profile-no-monthly-plan.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts`
**Device:** desktop
**Users:** company_6 (HR)
**Steps:**
1. /profile → «החשבון שלי».
**Expected:**
- Text that HR accounts have no monthly subscription («לחשבונות HR אין מנוי חודשי…»). (brief #a92a99 Т6, §67 AC01)

#### 8.8 Notification settings have no development text — company @desktop @prod-safe #62b022
**Status:** READY — #62b022 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-8-8.md` · **File:** `tests/copywriting/notification-settings-no-dev-text-company.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts`
**Device:** desktop
**Users:** company_2
**Steps:**
1. Click the bell → «הגדרות התראות».
2. Read the dialog; close («סיום» or ✕) without toggling anything.
**Expected:**
- No «התראות בדפדפן עוד לא הוגדרו במערכת» or other service text. (source: «מה רצוי» #62b022)
- Browser notifications option hidden or with a user-facing text (hidden on 2026-10-18).
- Title «הגדרות התראות», «התראות במייל» with its toggle and «סיום» are present.

#### 8.8-2 Notification settings have no development text — headhunter @desktop @prod-safe #62b022
**Status:** READY — #62b022 прошёл QA, «הושלם» 2026-10-19 · **Case:** `.qa/tests/copywriting/CW-8-8.md` · **File:** `tests/copywriting/notification-settings-no-dev-text-headhunter.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Click the bell → «הגדרות התראות».
2. Read the dialog; close without toggling anything.
**Expected:**
- Same as 8.8. (source: «מה רצוי» #62b022)