<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Candidacy submission: NDA, rejection, notifications (2026-10-21)

STATUS: READY — #4b3041, #501d04, #31a764 passed QA (user moved them to «הושלם», 2026-10-21). Not generated yet.
Updated 2026-10-21: section 2 (#805225 NDA signed → notification to both sides, multi-role) added — READY.
Rules: login only via saved sessions (seed per role / `asUser`); no fixed waits, no `networkidle`; test data prefix `QA-AUTO-`, cleanup in afterAll; no payments, no NDA signing (₪35), no time-based checks; `@data` = changes shared data (runs one at a time); `@prod-safe` = read-only. Status labels must not be changed by read-only tests (open menus, then Esc).

Tests 1.3 and 1.4 are **multi-role — пишет autotest-writer** (`asUser` from `.qa/e2e/fixtures.ts`), not `playwright-test-generator`.

---

### 1. Candidacy submission
**Seed:** `tests/seed.hunter_plus.spec.ts` (1.1–1.2); multi-role 1.3–1.4 via `asUser('hunter_free')`, `asUser('company_2')`

#### 1.1 NDA screen: «סירוב לחתימה» gives a clear result, candidate not submitted @desktop @prod-safe #4b3041
**Status:** BLOCKED (precondition) — needs an ACTIVE job with NDA = כן that hunter_plus has not signed (J-136 used on 21.10 is archived now). Generate once such a job exists; put its name in the test as a constant. · **Case:** `.qa/tests/candidacy-submission/SB-1-1.md` · **File:** `tests/candidacy-submission/nda-decline-not-submitted.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. /collaborations → the NDA job → block «הגשת מועמד» → «+ חדש» → choose a QA-AUTO candidate → continue until the screen «חתימה על הסכם סודיות (NDA) לפני הגשת מועמד».
2. Remember the count «מועמדים שהוגשו».
3. Click «סירוב לחתימה» → in the dialog click «חזרה לחתימה».
4. Click «סירוב לחתימה» again → «סגירה».
**Expected:**
- The NDA screen shows «המשרה הזו דורשת חתימה על הסכם סודיות (NDA) לפני הגשת מועמד/ת. בלי חתימה לא ניתן להגיש אליה.» and buttons «חתימה וסיום», «סירוב לחתימה». (source: «מה רצוי» #4b3041)
- After «סירוב לחתימה» the dialog «המועמד/ת לא הוגש/ה» with «חזרה לחתימה» and «סגירה».
- «חזרה לחתימה» returns to the NDA screen; after «סגירה» the candidate is not in «הגשת מועמד» and «מועמדים שהוגשו» is unchanged.
- Never click «חתימה וסיום».

#### 1.2 NDA screen: closing without a decision says the candidate was not submitted @desktop @prod-safe #4b3041
**Status:** BLOCKED (same precondition as 1.1) · **Case:** `.qa/tests/candidacy-submission/SB-1-2.md` · **File:** `tests/candidacy-submission/nda-close-says-not-submitted.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Reach the NDA screen as in 1.1; remember «מועמדים שהוגשו».
2. Close it with the arrow «סגירה» in its header.
**Expected:**
- A toast containing «לא הוגש/ה» appears. (source: «מה רצוי» #4b3041 «closing it says the candidate was not submitted»)
- «מועמדים שהוגשו» unchanged; no new row in «הגשת מועמד».

#### 1.3 Anonymous submission rejected → sender sends the full profile anyway → owner sees it @desktop @data #501d04 #3973c6
**multi-role — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/candidacy-submission/SB-1-3.md` · **File:** `tests/candidacy-submission/send-full-profile-after-rejection.spec.ts`
**Seed:** — (`asUser`)
**Device:** desktop
**Users:** hunter_free, company_2
**Steps:**
1. hunter_free: «הוספת מועמד» (/my-candidates/new) — anonymous profile «QA-AUTO 501d04 <ts>», phone 050-000-0097, required fields → «המשך» → «סיום»; submit it anonymously to J-135 «QA-AUTO 2110 cand».
2. company_2: «המשרות שלי» → J-135 → «מועמדים שהוגשו» → open the new anonymous submission → status «נדחה/תה» → reason from the list (e.g. «סיבה אחרת» + «QA-AUTO 501d04 reason»).
3. hunter_free: open the submission (job drawer or /applications/<id>) → «שליחת הפרופיל המלא בכל זאת» → confirm in «לשלוח את הפרופיל המלא?».
4. company_2: bell «התראות» → open the new notification / the submission.
5. Cleanup (afterAll): withdraw/delete the QA-AUTO 501d04 submission and candidate if the UI allows; otherwise log it for manual cleanup.
**Expected:**
- company_2 toast after rejection names the status in slash form: «המועמד/ת סומן/ה כ„נדחה/תה”». (source: «מה רצוי» #3973c6)
- hunter_free sees status «נדחה/תה» with the reason in «סטטוס מועמד», the text «עדיין אפשר לשלוח לבעל המשרה את הפרופיל המלא של המועמד.» and the button «שליחת הפרופיל המלא בכל זאת». (source: «מה רצוי» #501d04)
- After confirming: «הפרופיל המלא נשלח בהצלחה».
- company_2 gets a new notification (wait with `expect.poll`/`toBeVisible`, no fixed pause); the submission shows contact data (phone 050-000-0097) and the history keeps «נדחה/תה» and adds the step «פרופיל מלא נשלח לאחר…». (מה רצוי: «history keeps the rejection», «owner gets a notification and sees the full profile»)

#### 1.4 Every new application creates its own notification that opens that application @desktop @data #31a764
**multi-role — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/candidacy-submission/SB-1-4.md` · **File:** `tests/candidacy-submission/notification-per-application.spec.ts`
**Seed:** — (`asUser`)
**Device:** desktop
**Users:** hunter_free, company_2
**Steps:**
1. company_2: do NOT open the bell before the submissions (unread state is the bug scenario).
2. hunter_free: create 3 candidates «QA-AUTO 31a764 <ts> 1/2/3» (anonymous, «סיום») and submit them one after another to J-135 «QA-AUTO 2110 cand».
3. company_2: open the bell «התראות».
4. Click each of the 3 notifications (go back to the bell between clicks).
5. Cleanup (afterAll): withdraw/delete the 3 QA-AUTO 31a764 submissions and candidates if the UI allows; otherwise log them.
**Expected:**
- 3 separate notifications «התקבלה מועמדות חדשה למשרה „QA-AUTO 2110 cand”: <candidate title>» for the 3 candidates (or one grouped notification with the count 3). (source: «מה רצוי» #31a764)
- Each opens its own application: the URL contains that application id (`application=<id>` or `/applications/<id>`) and the page shows that candidate — not just the job.

---

### 2. Job NDA signed → both sides notified (#805225)
**Seed:** — multi-role via `asUser('company')`, `asUser('hunter_plus')` (`.qa/e2e/fixtures.ts`)

Source: rejection 5215d259 «needed behavior» (#805225, §73 AC04, §45 AC02); evidence `.qa/screenshots/2026-10-21/805225-*.png`.
This is the owner's job NDA (signature on the canvas «חתימה על הסכם סודיות» → «חתימה וסיום»), free. It is NOT the sender's own NDA (₪35): never choose an option with a price; if a payment window opens — fail with a clear message, do not pay.
The test creates its own NDA job each run (the old NDA jobs J-83/J-84/J-136 are archived and already signed by hunter_plus).

#### 2.1 Signing the job NDA notifies the owner and the sender @desktop @data #805225
**multi-role — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/candidacy-submission/SB-2-1.md` · **File:** `tests/candidacy-submission/nda-signed-notifies-both-sides.spec.ts`
**Seed:** — (`asUser`)
**Device:** desktop
**Users:** company (owner, demo-company-1), hunter_plus (sender, claude-test, display name «נועם כהן»)
`test.describe.configure({ mode: 'serial' })`.
**Steps:**
1. company: «+ פרסום» → «פרסום משרה» (/publish/job, 3 steps): «שם המשרה» = «QA-AUTO-805225-<ts> - לא לפרסם», description «QA-AUTO — משרת בדיקה, לא להגיש», required fields; «האם נדרשת חתימה על NDA לפני הגשת מועמד?» = «כן»; publish. In the upgrade popup «האם לשדרג את המשרה שלכם?» click «לא תודה». Read the job id from the URL / card.
2. hunter_plus: /my-candidates/new — anonymous candidate «QA-AUTO-805225-<ts>», phone 050-805-2250, «תחום התמחות» any → «המשך» → «סיום».
3. hunter_plus: open /collaborations/<job id> → «הגשת QA-AUTO-805225-<ts> … למשרה» → in the submit dialog choose the anonymous profile → the NDA screen «חתימה על הסכם סודיות»: draw a signature on the canvas → «חתימה וסיום» → continue the submission, answer required fields with «QA-AUTO 805225» → «סיום והגשה».
4. company: open the bell «התראות» (button whose name starts with «התראות»); wait (expect.poll with reload, no fixed pause) for the notification about this job.
5. company: click it.
6. hunter_plus: open the bell; wait for the notification about this job; click it.
7. Cleanup (afterAll): company archives the job («פעולות משרה» → «העברה לארכיון»); hunter_plus deletes the candidate if the UI allows; leftovers (job id, application id) → test-data journal.
**Expected:**
- Step 4: company bell has «ה-NDA למשרה „QA-AUTO-805225-<ts> - לא לפרסם” נחתם על ידי נועם כהן» (in addition to «התקבלה מועמדות חדשה למשרה „…”»). (needed behavior: «when the NDA is signed, both sides get «ה-NDA למשרה „…” נחתם על ידי <name>»»)
- Step 5: the link opens the application of this job (URL with the job id and/or `application=<id>`, page shows the candidate) or the signed agreement under «הסכמים» — not 404. (needed behavior: «the link opens the application, or the signed agreement under «הסכמים»»)
- Step 6: hunter_plus bell has the same NDA-signed notification for this job; its link opens a working page (application / «הסכמים» / «המועמדים שלי» with the candidate), not 404. (needed behavior: «Done when signing the NDA on an NDA-required job creates a bell notification for the owner and the sender»)
- No payment window at any step.
