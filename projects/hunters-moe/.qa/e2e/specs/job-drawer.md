<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Job drawer: archived job for sender, mobile candidate rows (2026-10-21)

STATUS: READY — #158449, #fc00c7 passed QA (user moved them to «הושלם», 2026-10-21). Not generated yet.
Rules: login only via saved sessions (seed per role / `asUser`); no fixed waits, no `networkidle`; test data prefix `QA-AUTO-`, cleanup in afterAll; no payments, no NDA signing (₪35), no time-based checks; `@data` = changes shared data (runs one at a time); `@prod-safe` = read-only. Status labels must not be changed by read-only tests (open menus, then Esc).

Dependency: tests 1.1–1.2 read J-136 «QA-AUTO 2110 nda - לא לפרסם» (547e6014-c8da-4c61-956f-c03f4947015b, archived) and its 4 claude-test submissions — do NOT clean J-136 while these tests exist.

---

### 1. Job drawer
**Seed:** `tests/seed.hunter_plus.spec.ts`, `tests/seed.company.spec.ts`

#### 1.1 Archived job opens read-only for the sender with their submissions @desktop @prod-safe #158449
**Status:** READY · **Case:** `.qa/tests/job-drawer/DR-1-1.md` · **File:** `tests/job-drawer/archived-job-sender-read-only.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. «המועמדים שלי» → «QA-AUTO 1020 E1 Alpha» → block «הגשות» → click «QA-AUTO 2110 nda - לא לפרסם» (or open /collaborations/547e6014-c8da-4c61-956f-c03f4947015b).
**Expected:**
- No 404: «פרטי המשרה» with title «QA-AUTO 2110 nda - לא לפרסם» and the banner «המשרה הועברה לארכיון ואינה פעילה יותר» / «אפשר לראות את המשרה ואת ההגשות שלכם, אבל אי אפשר להגיש אליה.». (source: «מה רצוי» #158449)
- Block «המועמדים שהגשתם» has 4 rows with statuses; one of them «התקבל/ה לעבודה».
- No submit action («+ חדש») in that block.

#### 1.2 Candidate card «הגשות» shows the archived job and the final status @desktop @prod-safe #158449
**Status:** READY · **Case:** `.qa/tests/job-drawer/DR-1-2.md` · **File:** `tests/job-drawer/candidate-card-submissions-final-status.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. «המועמדים שלי» → «QA-AUTO 1020 E1 Alpha» → block «הגשות».
**Expected:**
- A row «QA-AUTO 2110 nda - לא לפרסם» with the status «התקבל/ה לעבודה» and «נשלח/ה ב-…». (source: «מה רצוי» #158449 «finds each submission with its job name and final status»)

#### 1.3 Mobile: headhunter candidate rows in the job drawer do not overlap @mobile @prod-safe #fc00c7
**Status:** READY · **Case:** `.qa/tests/job-drawer/DR-1-3.md` · **File:** `tests/job-drawer/mobile-headhunter-rows-no-overlap.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** mobile (iPhone + Android)
**Users:** hunter_plus
**Steps:**
1. /collaborations → J-49 «QA company post test» → block «הגשת מועמד»; scroll through the whole list.
**Expected:**
- For every pair of neighbouring rows: bottom(row i) ≤ top(row i+1) (no overlap); rows with a two-line name are taller than one-line rows (no fixed 52px). (source: «מה רצוי» #fc00c7)
- Inside each row the name and status are not clipped: `scrollHeight ≤ clientHeight` for the name/status elements.

#### 1.4 Mobile: company «מועמדים שהוגשו» rows do not overlap @mobile @prod-safe #fc00c7
**Status:** READY · **Case:** `.qa/tests/job-drawer/DR-1-4.md` · **File:** `tests/job-drawer/mobile-company-rows-no-overlap.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** mobile (iPhone + Android)
**Users:** company
**Steps:**
1. «המשרות שלי» → J-49 → drawer «מועמדים שהוגשו»; scroll through the list.
**Expected:**
- No row overlaps the next one; statuses are not cut (no «התבקש פרופי…» ending with «…»), long ones wrap. (source: «מה רצוי» #fc00c7)
