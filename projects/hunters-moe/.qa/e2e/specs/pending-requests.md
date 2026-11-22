<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — «ממתינים»: headhunter sees and answers open requests (active and archived jobs) (2026-10-22)

STATUS: READY — #0f3888 (96ad283924abddcd9b0f3888) passed QA 22.10, user moved it to «הושלם» 2026-10-22. Not generated yet.
Source of expectations: reject 1 «needed» option (b) chosen by the developer — «the actions stay allowed, and the sender can respond from /applications/<id> and from «ממתינים»; the notification link opens the application …, never a 404» + reject 2 «needed» (§44 AC03) — «ממתינים» lists everything the hunter must answer; each row: candidate, job (with an «archive» mark), type, date; click opens the application panel with actions; answered items leave the list; the counter on «ממתינים» = number of open items. Evidence: `.qa/screenshots/0f3888-*.png` (22.10: archived-job request with «בארכיון», rows «בקשה / משרה / תאריך», «מעבר למענה», answered + approved from there, leave list, tab counter matches; J-136 notification links no 404).
Rules: one role per file; CHAIN convention as in `specs/candidacy-status.md` (handoff `.qa/e2e/.handoff/pending.json`, run with `--workers=1` in file order, written by autotest-writer); created data `QA-AUTO-` + UNIQUE phone `uniquePhone()`; never DEMO-*; no fixed waits / `networkidle`. Known open decision D-30 (header counter = sum of both tabs) — assert only the tab counter.
Not automated: creating a request on an ARCHIVED job (needs archiving a job with submissions — one-off manual check done 22.10); «בקשת NDA» rows (NDA flow is manual).

---

### 1. Pending requests
**Seed:** per test

#### 1.1 «ממתינים» lists open requests with candidate, job, type, date; tab counter = number of cards @desktop @prod-safe #0f3888
**Status:** READY · **File:** `tests/pending-requests/pending-list-structure.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. Header «עוד» → «ממתינים»; tab «מועמדים ממתינים לאישור».
2. Read the tab counter and all cards.
3. Click «מעבר למענה» on the first card; read where it lands; close without answering.
**Expected:**
- Tab counter = number of cards in the tab (0 → empty state text, no counter or «0»). (reject 2 «counter on ממתינים = number of open items»)
- Each card: candidate name (title), rows «בקשה» (type, e.g. «שאלות שממתינות לתשובה» / «התבקש הפרופיל המלא»), «משרה» (job title), «תאריך» (DD.MM.YYYY) and button «מעבר למענה»; a card of an archived job has the badge «בארכיון». (reject 2 «each row — candidate, job (with archive mark), type, date»)
- Step 3: the application panel / page opens (not 404) with an answer action («שליחת התשובות» or «שליחת פרופיל מלא» / «דחיית הבקשה»). (reject 2 «click opens the application panel with actions»)

#### 1.2 CHAIN step 1 — headhunter submits an anonymous candidate to J-49 @desktop @data #0f3888
**Status:** READY · **File:** `tests/pending-requests/chain-pending-1-hunter_plus.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. «הוספת מועמד» → anonymous profile, first name «QA-AUTO-0f3888», last name `<runId>`, phone `uniquePhone()`, any «תחום התמחות» → «המשך» → «סיום».
2. J-49 (/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584) → «הגשת מועמד» → «פרופיל אנונימי» → «אין צורך ב-NDA» → «המשך» → wait for «סיום והגשה» enabled → answer «QA-AUTO answer <runId>» → «סיום והגשה».
3. Write handoff (candidate name, application id).
**Expected:** submission created, status «נשלח/ה».

#### 1.3 CHAIN step 2 — company sends «שאלות נוספות» @desktop @data #0f3888
**Status:** READY · **File:** `tests/pending-requests/chain-pending-2-company.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps:**
1. Read handoff. «המשרות שלי» → J-49 → «מועמדים שהוגשו» → the candidate → «שאלות נוספות».
2. Question «QA-AUTO question <runId>?» → send.
**Expected:**
- Toast «השאלות נשלחו» (or equivalent success); status «נשלחו שאלות / ממתין לתשובה». (reject 1 — receiver actions stay allowed)

#### 1.4 CHAIN step 3 — headhunter answers from «ממתינים»; the item leaves the list @desktop @data #0f3888
**Status:** READY · **File:** `tests/pending-requests/chain-pending-3-hunter_plus.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. Read handoff. «עוד» → «ממתינים» → tab «מועמדים ממתינים לאישור»: read the counter C and find the card «QA-AUTO-0f3888 <runId>».
2. Click its «מעבר למענה» → answer «QA-AUTO reply <runId>» → «שליחת התשובות».
3. Re-open «ממתינים».
**Expected:**
- Step 1: the card exists with «בקשה» = «שאלות שממתינות לתשובה», «משרה» = «QA company post test», «תאריך» = today (DD.MM.YYYY). (reject 2 «lists … answers to anonymous questions»)
- Step 2: success message; the application shows the answer.
- Step 3: the card is gone; tab counter = C − 1 and equals the number of cards. (reject 2 «answered items leave the list»)

#### 1.5 Notification about the archived job J-136 opens the application, not 404 @desktop @prod-safe #0f3888
**Status:** READY · **File:** `tests/pending-requests/archived-job-notification-link.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. Open the bell «התראות»; find a notification mentioning «QA-AUTO 2110 nda» (archived J-136; candidate «QA-AUTO 1020 E1 Alpha»). If none is listed → `test.skip` «no J-136 notification in the list».
2. Click it.
**Expected:**
- The target page is not 404 (no «404»/«הדף לא נמצא») and shows the candidate «QA-AUTO 1020 E1 Alpha». (reject 1 option (b) «the notification link opens the application …, never a 404»)
- J-136 must NOT be cleaned (job-drawer tests read it too).
