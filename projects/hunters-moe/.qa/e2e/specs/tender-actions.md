<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Tender owner actions «פעולות מכרז»: edit, extend, close, archive, renew (2026-10-21)

STATUS: READY — #cf6dc1 (96f1d9f6c7685e2867cf6dc1) passed QA, user moved it to «הושלם» 2026-10-21. Not generated yet. Environment: staging https://hunters-sooty.vercel.app.
Source of expectations: rejection 0bf8cc73 «needed behavior» (#cf6dc1); evidence `.qa/screenshots/2026-10-21/cf6dc1-*.png`.
Rules: login only via saved sessions (seed per role); no fixed waits, no `networkidle`; created data — title prefix `QA-AUTO-`, cleanup in afterAll; never choose «מכרז חם» (₪1,500) or «קידום המכרז» purchase, never open or confirm a payment window; `@data` = changes shared data (runs one at a time); `@prod-safe` = read-only.
Precondition: Admin price «פרסום מכרז» = ₪0 and «מכרז רגיל» = «ללא עלות» in the extend/renew dialogs (as on 2026-10-21). If a payment window or a price ≠ 0 appears for a regular tender — fail with a clear message, do not pay.
Not automated: behaviour after an approved offer (PM decision, not a fixed requirement); «קידום המכרז» (goes to payment); renewal confirm on T-25 (one-time: would change the shared expired tender — only the dialog is checked).

---

### 1. Tender owner actions (company)
**Seed:** `tests/seed.company.spec.ts`

#### 1.1 Owner sees «פעולות מכרז» on the card and on the tender page @desktop @prod-safe #cf6dc1
**Status:** DONE 21.10 (written manually, pass; on the tender page the menu has the 5 actions without «צפייה בפרטי המכרז», as in QA evidence cf6dc1-T1-page-menu) · **Case:** `.qa/tests/tender-actions/TA-1-1.md` · **File:** `tests/tender-actions/owner-actions-menu-card-and-page.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company (demo-company-1; has active own tenders, e.g. T-53 «QA-AUTO 1020 C3 מכרז», T-55)
**Steps:**
1. Open /tenders?mine=1 («המכרזים שלי»).
2. On the first card with the badge «פעיל» click «•••» (actions menu).
3. Press Escape. Open the same tender (arrow / card) → dialog «פרטי המכרז»; click «•••» next to the tender number.
4. Press Escape, close the dialog. Do not click any menu item.
**Expected:**
- Step 2 and step 3: the menu has exactly the items «צפייה בפרטי המכרז», «עריכת מכרז», «קידום המכרז», «הארכת המכרז», «סגירת מכרז», «העברה לארכיון» (source: needed behavior #cf6dc1 «a «פעולות מכרז» menu on the tender card and the tender page: צפייה, עריכה, קידום, הארכה, סגירת מכרז, העברה לארכיון»).
- The tender stays «פעיל» after Escape.

#### 1.2 Edit, extend, close with confirmation and archive own tender @desktop @data #cf6dc1
**Status:** DONE 21.10 (written manually, pass; closed-tender «•••» checked on the tender page — only «העברה לארכיון»; the card menu also keeps «צפייה בפרטי המכרז») · **Case:** `.qa/tests/tender-actions/TA-1-2.md` · **File:** `tests/tender-actions/edit-extend-close-archive-own-tender.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
`test.describe.configure({ mode: 'serial' })` — steps depend on each other.
**Steps:**
1. Create a free regular tender: «+ פרסום» → «פרסום מכרז» → «מכרז ללא קידום»; title «QA-AUTO-cf6dc1-<timestamp>», description «QA-AUTO — מכרז בדיקה, נא לא להגיש הצעות»; any required fields; click «פרסום המכרז». (Same wizard as `tender-drafts.md` 1.2, but finished.)
2. /tenders?mine=1 → card «QA-AUTO-cf6dc1-<timestamp>» → «•••» → «עריכת מכרז»; change the title to «QA-AUTO-cf6dc1-<timestamp> edited»; save.
3. «•••» → «הארכת המכרז» → dialog «הארכת המכרז»: read «המכרז פעיל עד <date>»; set «תאריך תוקף חדש» = that date + 14 days; keep «מכרז רגיל — ללא עלות»; «אישור».
4. «•••» → «סגירת מכרז» → in «לסגור את המכרז?» click «ביטול».
5. «•••» → «סגירת מכרז» → «סגירת המכרז».
6. /tenders («כל המכרזים») → search «QA-AUTO-cf6dc1-<timestamp>» in «מילת מפתח».
7. /tenders?mine=1 → open the tender → «•••» → «העברה לארכיון» → «להעביר את המכרז לארכיון?» → «העברה לארכיון».
8. Open «ארכיון» (link on /tenders?mine=1).
9. Cleanup (afterAll): if any step failed before 7 — close and archive the tender via the menu; if not possible, write its id (from the URL) to the test-data journal.
**Expected:**
- Step 2: the card and the tender page show the new title. (needed behavior: «עריכה (fields allowed after publishing)»)
- Step 3: «תאריך תוקף» on the card = the new date; no payment window. (needed behavior: «הארכה (same price rules as jobs)»)
- Step 4: dialog text «המכרז יוסר מרשימת המכרזים ולא יתקבלו בו הצעות נוספות…»; after «ביטול» the tender is still «פעיל». (needed behavior: «סגירת מכרז (with confirmation)»)
- Step 5: badge «סגור», text «המכרז סגור ואינו מקבל הצעות.»; the «•••» menu now has only «העברה לארכיון».
- Step 6: no card with that title in «כל המכרזים». (needed behavior: «closed and archived tenders disappear from the public list but stay in the owner's history»)
- Step 8: page «מכרזים בארכיון» lists the card with badge «בארכיון» and the edited title; the card is gone from «המכרזים שלי». (same source)

#### 1.3 Expired tender: bell «אפשר לחדש את הפרסום» leads to a working renewal dialog (no renewal) @desktop @prod-safe #cf6dc1
**Status:** DONE 21.10 (written manually, pass; T-25 has no bell note on 21.10 → test uses the first «אפשר לחדש את הפרסום» note, e.g. T-26, and annotates) · **Case:** `.qa/tests/tender-actions/TA-1-3.md` · **File:** `tests/tender-actions/expired-tender-bell-renew-dialog.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company (T-25 «מנהלי/ות מרכזי קבלה בבתי מלון», expired 16.10.2026, demo-company-1 — do NOT renew it)
**Steps:**
1. Open /tenders?mine=1; click the bell «התראות».
2. Click the notification containing «אפשר לחדש את הפרסום» for T-25 (in «התראות» or «נקראו»). If it is no longer in the list — open T-25 from «המכרזים שלי» instead and note it in the test annotation.
3. On the tender page click «חידוש הפרסום».
4. Read the dialog; click «לא תודה».
**Expected:**
- Step 2: dialog «פרטי המכרז» of T-25 opens with badge «פג תוקף» and the text «המכרז הסתיים ב-16.10.2026 ולא מוצג יותר.» and the button «חידוש הפרסום». (needed behavior: «an expired tender offers «חידוש פרסום», matching the bell text»; «the bell link «אפשר לחדש את הפרסום» leads to a working renewal»)
- Step 3: dialog «חידוש הפרסום» with the tender title, «המכרז הסתיים ב-16.10.2026», required «תאריך תוקף חדש», «סוג הפרסום» options «מכרז רגיל — ללא עלות» (selected) and «מכרז חם — ₪1,500», buttons «אישור» and «לא תודה».
- Step 4: dialog closes; T-25 is still «פג תוקף» (nothing renewed).
