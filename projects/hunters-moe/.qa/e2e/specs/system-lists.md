<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Admin system lists (2026-10-21)

STATUS: **READY** — Ticket #3b5661 (6a7063193794e60bf33b5661) «ניהול רשימות מערכת — שמונה רשימות» (PRD §10.4). Passed QA 21.10.2026, user moved it to «הושלם».
Source of expectations: ticket AC («ניתן להוסיף, לערוך ולהסיר ערכים», «הסרת ערך שנמצא בשימוש אינה שוברת נתונים קיימים») + reject rej_1792423609419 «needed behavior» (in-use delete blocked with a deactivate offer; duplicate names rejected). Evidence: `.qa/screenshots/2026-10-21/3b5661-*.png`.

**ADMIN SAFETY (lesson L-20261020-1 — copy into every generated test as a comment):**
- Never click the status switch «פעיל / לא פעיל» in a row, the order arrows ↑/↓, or any menu / combobox inside a table row. No loops that open menus and pick items.
- Only targeted clicks: the button «הוספת פריט», buttons inside the open dialog («שמירה», «ביטול», «מחיקה», «סגירה»), and the pencil / trash icon of the ONE row whose name contains this run's `QA-AUTO-<runId>` (or the fixture name in 1.4).
- Before clicking a row icon, assert that exactly one row matches (`toHaveCount(1)`), then click inside that row only.
- Never edit or delete built-in values («משרה מלאה», «חצי משרה», …). They are only typed as names to provoke the duplicate error.
- Select the list with the filter «רשימה:» (targeted option «סוגי משרה») or a URL parameter if the page supports one.

Rules: `@data` tests change a shared global list → run serially (`test.describe.configure({ mode: 'serial' })`). Test values: he `QA-AUTO-<runId> סוג`, en `QA-AUTO-<runId> type`, key `qa_auto_<runId>` (runId = Date.now()), checkbox «פעיל (מוצג באתר)» UNCHECKED so the value never appears in site forms. Cleanup in afterAll: delete every row whose key starts with `qa_auto_<runId>` (one by one, each after `toHaveCount(1)`). No fixed waits. Do not run — only /qa-regress runs tests.

---

### 1. System lists (Admin)
**Seed:** `tests/seed.admin.spec.ts`

#### 1.1 System lists page shows the lists and their columns @desktop @prod-safe #3b5661
**Device:** desktop · **Users:** admin · **Case:** `.qa/tests/system-lists/SL-1-1.md`
**Steps:**
1. Open /admin and click «רשימות מערכת» in the side menu.
2. Open the filter «רשימה:» and read its options (do not pick anything except in step 3); close it with Escape.
3. Pick «סוגי משרה» in the filter «רשימה:».
**Expected:**
- Heading «רשימות מערכת» and button «הוספת פריט» are visible.
- The filter «רשימה:» has at least 8 lists (PRD §10.4: areas of expertise, roles, cities, languages, job types, position types, FAQ categories, report reasons), including «סוגי משרה».
- For «סוגי משרה» the table has columns «שם», «שם באנגלית», «מפתח», «סדר», «סטטוס», «פעולות» and rows «משרה מלאה» (key full_time, "Full-time") and «רבע משרה» (key quarter_time, "Quarter-time").
- Read-only: nothing is saved.
- (source: ticket AC «שמונה הרשימות (§10.4)», «הרשימות תומכות בריבוי שפות»)

#### 1.2 Admin adds an own value and deletes it while unused @desktop @data #3b5661
**Device:** desktop · **Users:** admin · **Case:** `.qa/tests/system-lists/SL-1-2.md`
**Steps:**
1. Open «רשימות מערכת», pick list «סוגי משרה»; note the counter «N פריטים».
2. Click «הוספת פריט». In dialog «פריט חדש • סוגי משרה» fill «שם בעברית» = `QA-AUTO-<runId> סוג`, «שם באנגלית» = `QA-AUTO-<runId> type`, «מפתח» = `qa_auto_<runId>`; uncheck «פעיל (מוצג באתר)»; click «שמירה».
3. In the ONE row with `QA-AUTO-<runId> סוג` click the trash icon.
4. In dialog «מחיקה» click «מחיקה».
**Expected:**
- After step 2: toast «הפריט נוסף»; one row with `QA-AUTO-<runId> סוג`, `QA-AUTO-<runId> type`, key `qa_auto_<runId>`, status «לא פעיל»; counter N+1.
- Step 3 dialog text: «למחוק את "QA-AUTO-<runId> סוג"? אי אפשר לבטל את הפעולה.»
- After step 4: toast «הפריט נמחק»; no row with `QA-AUTO-<runId>`; counter back to N.
- Cleanup (afterAll): if the row still exists, delete it (rules above).
- (source: ticket AC «ניתן להוסיף, לערוך ולהסיר ערכים בכל רשימה»)

#### 1.3 Duplicate names are rejected on add and on rename @desktop @data #3b5661
**Device:** desktop · **Users:** admin · **Case:** `.qa/tests/system-lists/SL-1-3.md`
**Steps:**
1. Open «רשימות מערכת», list «סוגי משרה»; note the counter «N פריטים».
2. «הוספת פריט»: «שם בעברית» = «משרה מלאה» (existing), «שם באנגלית» = `QA-AUTO-<runId> dup1`, «מפתח» = `qa_auto_<runId>_dup1`, uncheck «פעיל»; «שמירה».
3. Change the fields in the same dialog: «שם בעברית» = `QA-AUTO-<runId> dup2`, «שם באנגלית» = «Full-time» (existing), «מפתח» = `qa_auto_<runId>_dup2`; «שמירה».
4. Same with «שם באנגלית» = « full-time » (lower case + spaces), «מפתח» = `qa_auto_<runId>_dup3`; «שמירה». Then «ביטול».
5. Add an own value (as in 1.2 step 2, key `qa_auto_<runId>`), then click the pencil icon in its ONE row and set «שם בעברית» = «משרה מלאה»; «שמירה»; then «ביטול».
**Expected:**
- Steps 2, 3, 4 and 5: toast «כבר יש ברשימה הזו ערך עם השם הזה (בעברית או באנגלית)»; the dialog stays open; nothing saved.
- After step 4: counter still N; no row with key `qa_auto_<runId>_dup…`.
- After step 5: the own row still shows `QA-AUTO-<runId> סוג`; only one row named «משרה מלאה» exists.
- Cleanup (afterAll): delete every row whose key starts with `qa_auto_<runId>` (also a dup row if the site wrongly saved it).
- (source: reject «needed behavior»: «the admin cannot save two values with the same name in one list (he or en) – a clear error is shown»)

#### 1.4 In-use own value cannot be deleted — deactivation offered @desktop @data #3b5661
**Device:** desktop · **Users:** admin · **Case:** `.qa/tests/system-lists/SL-1-4.md`
**Precondition (fixture):** list «סיבות דיווח» (report reasons) has the QA value «QA-AUTO 2110 list» (key `qa_auto_2110_list`, inactive), used by report R-17. It is listed in session.json test_data — **keep it while this test exists**; if it was cleaned, remove this test from the plan (do not create reports in the test).
**Steps:**
1. Open «רשימות מערכת», pick list «סיבות דיווח», status filter «כל הסטטוסים».
2. In the ONE row «QA-AUTO 2110 list» click the trash icon; confirm «מחיקה» in the first dialog.
3. Read the second dialog; click «סגירה» (NOT «הגדרה כלא פעיל»).
**Expected:**
- Dialog «אי אפשר למחוק» with text «"QA-AUTO 2110 list" כבר בשימוש באתר (למשל במשרות, במכרזים, בפרופילים, בערים או בדיווחים), ולכן אי אפשר למחוק אותו.» and the hint «אפשר להגדיר אותו כלא פעיל…».
- Buttons «הגדרה כלא פעיל» and «סגירה».
- After «סגירה» the row «QA-AUTO 2110 list» is still in the table (not deleted).
- (source: reject «needed behavior»: «Delete of an in-use value is blocked with a clear message … and the admin can only deactivate it»)
