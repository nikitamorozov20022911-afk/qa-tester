<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Admin search: full names, numbers, applications list and details (2026-10-22)

STATUS: READY — #301e98 (0cfb74394f30a7c65d301e98) passed QA 22.10, user moved it to «הושלם» 2026-10-22. Not generated yet.
Source of expectations: initial reject «needed behavior» (#301e98: full query matches full name of any number of words, e-mail, job title, J-/U- number; case-insensitive, tolerant to extra spaces; placeholder examples exist) + reject rej_26feba7a «needed» (/admin/applications without a query lists all with «N תוצאות» = chip number; every row opens the admin details page; no 404). Evidence: `.qa/screenshots/301e98-*.png` (22.10: «91 תוצאות» = chip 91; placeholder «חיפוש לפי משרה, מועמד, מגיש או מספר (J-48, U-2)»).
Rules: one role per file; saved admin session; no fixed waits / `networkidle` (wait for the result count to change via `expect`); read-only — never change a status in admin (`@prod-safe`). Do not assert absolute counts (data grows) — only relations (search ≤ total, ≥ 1 match, equal counts).
Not automated: «error → error message, not אין תוצאות» (needs a failing backend).

---

### 1. Admin search
**Seed:** `tests/seed.admin.spec.ts`

#### 1.1 Applications list without a query: result count equals the status chip @desktop @prod-safe #301e98
**Status:** READY · **File:** `tests/admin-search/applications-list-count-matches-chip.spec.ts`
**Seed:** `tests/seed.admin.spec.ts` · **Device:** desktop · **Users:** admin
**Steps:**
1. Open /admin/applications («מועמדויות»), search box empty.
2. Read the number on the chip «סטטוס: כל הסטטוסים» and the text «N תוצאות».
**Expected:**
- «N תוצאות» with N > 0, and N equals the number on the chip. (source: reject rej_26feba7a «without a query — all applications, N תוצאות = chip»)
- The table shows rows (columns «משרה», «הוגש ע"י», «מועמד/ת», «סוג הגשה», «סטטוס», «הוגש»); no «אין תוצאות».

#### 1.2 Applications search: multi-word name, J-number, case and extra spaces @desktop @prod-safe #301e98
**Status:** READY · **File:** `tests/admin-search/applications-search-name-number.spec.ts`
**Seed:** `tests/seed.admin.spec.ts` · **Device:** desktop · **Users:** admin
**Steps:**
1. /admin/applications; read total N.
2. Search «הד האנטר דמו 3» (submitter full name, 4 words) → read count.
3. Search «   הד  האנטר   דמו 3  » (extra spaces) → read count.
4. Search «נועם» → read count. Search «J-66» → read count.
5. Search «qa-auto» and «QA-AUTO» → read both counts.
**Expected:**
- Step 2: ≥ 1 row and every row's «הוגש ע"י» or «מועמד/ת» contains «הד האנטר דמו 3»; count ≤ N. (source: «Done when … "הד האנטר דמו 3" in /admin/applications returns the matching rows»)
- Step 3 count = step 2 count (tolerant to extra spaces).
- Step 4: «נועם» ≥ 1 row; «J-66» ≥ 1 row and < N.
- Step 5: both counts equal and ≥ 1 (case-insensitive).

#### 1.3 Application row opens the admin details page (no 404) @desktop @prod-safe #301e98
**Status:** READY · **File:** `tests/admin-search/application-row-opens-details.spec.ts`
**Seed:** `tests/seed.admin.spec.ts` · **Device:** desktop · **Users:** admin
**Steps:**
1. /admin/applications → search «QA-AUTO» → click the first row.
2. Read the page; go back.
**Expected:**
- URL becomes `/admin/applications/<id>`, main response status 200, no «404»/«הדף לא נמצא». (source: reject rej_26feba7a «every row opens the application details in admin»)
- The page shows the status, the sender («הוגש ע"י»/sender name), the receiver/job and a status timeline.
- Do not click any status control.

#### 1.4 Users search: full name, e-mail, U-number, placeholder examples exist @desktop @prod-safe #301e98
**Status:** READY · **File:** `tests/admin-search/users-search-full-name.spec.ts`
**Seed:** `tests/seed.admin.spec.ts` · **Device:** desktop · **Users:** admin
**Steps:**
1. Open /admin/users; read the search placeholder.
2. Search «נועם כהן»; then «demo-hunter-2@hunters.dev»; then «U-2»; then «  נועם   כהן » .
3. On /admin/applications read the placeholder example numbers (e.g. «J-48», «U-2») and search each one.
**Expected:**
- «נועם כהן» → ≥ 1 row whose name is «נועם כהן». (source: «Done when "נועם כהן" in /admin/users … returns the matching rows»)
- e-mail → exactly the row of that user; «U-2» → ≥ 1 row; extra spaces → same rows as «נועם כהן».
- Every example number shown in a placeholder returns ≥ 1 row (no non-existing example like «J-1042»). (initial reject «example numbers in placeholders use real existing formats»)
