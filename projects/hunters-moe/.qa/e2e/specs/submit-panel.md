<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Job/tender submit panel: neutral heading and search (2026-11-07)

STATUS: READY — #8ad3b0 passed QA; user moved it to «הושלם» 2026-11-07. Not generated yet. Environment: staging.
Source: #8ad3b0 «מה רצוי» "heading «הגשת מועמד/ת», placeholder «חיפוש מועמד/ת» — in the job panel, the tender panel and anywhere else these components are used. en/ru/ar unchanged"; rule 2026-10-19 (context.md). Evidence: `.qa/screenshots/8ad3b0-*.png`. Cases: `.qa/tests/submit-panel/SP-1-1, SP-1-2, SP-2-1`.
Related: older specs still name the block «הגשת מועמד» (`job-drawer.md`, `candidacy-submission.md`) and generated tests use `getByRole('searchbox', { name: 'חיפוש מועמד' })` — non-exact role-name matching still finds «חיפוש מועמד/ת», so they keep working; do not use `exact: true` with the old text.

**Rules (whole file):** read-only, `@prod-safe`; one role per file; language via URL prefix only; no fixed waits.
**Finding a job (test data may be deleted):**
1. Go to `/collaborations/fedc4b3d-3de6-414e-9821-af96a34469ae` (J-148 «QA 0711 משרה חברה», owner demo-company-1 — foreign for every headhunter).
2. If the dialog «פרטי המשרה» does not open (404 «אופס, הדף לא נמצא» or no dialog) → go to `/collaborations`, open the first job card whose owner is NOT the logged-in hunter («הד האנטר דמו 3»), i.e. the dialog shows the side block with a searchbox.
3. If no such job exists → `test.skip(true, '8ad3b0: no foreign active job on the stand (J-148 deleted, /collaborations has none) — publish a job as demo-company-1 and rerun')`. Do NOT create a job inside the test.
**Locators:** side block heading `dialog.getByRole('heading', { level: 3, name: 'הגשת מועמד/ת' })`; search `dialog.getByRole('searchbox')` (or `getByPlaceholder`) — assert `toHaveAttribute('placeholder', 'חיפוש מועמד/ת')` and `toHaveAttribute('aria-label', 'חיפוש מועמד/ת')`.

---

### 1. Job panel — headhunter on a foreign job
**Seed:** `tests/seed.hunter_free_2.spec.ts`

#### 1.1 Job panel heading «הגשת מועמד/ת» and search «חיפוש מועמד/ת» (he) @desktop @prod-safe #8ad3b0
**Case:** `.qa/tests/submit-panel/SP-1-1.md` · **File:** `tests/submit-panel/job-panel-heading-search-he.spec.ts`
**Device:** desktop · **Users:** hunter_free_2 (demo-hunter-3)
**Steps:**
1. Find a foreign job as described above; wait for the dialog «פרטי המשרה».
2. Read the side-block heading and the search field.
**Expected:**
- h3 «הגשת מועמד/ת» visible; no heading with exact text «הגשת מועמד». (#8ad3b0 «מה רצוי»)
- Search field placeholder = «חיפוש מועמד/ת» and aria-label = «חיפוש מועמד/ת». (#8ad3b0 «מה רצוי»)

#### 1.2 Job panel in English: «Submit candidate» / «Search candidate» @desktop @prod-safe #8ad3b0
**Case:** `.qa/tests/submit-panel/SP-1-2.md` · **File:** `tests/submit-panel/job-panel-heading-search-en.spec.ts`
**Device:** desktop · **Users:** hunter_free_2
**Steps:**
1. Find the job as above, then open the same job path with prefix `/en` (e.g. `/en/collaborations/<id>`).
**Expected:**
- Heading «Submit candidate»; search placeholder «Search candidate». (#8ad3b0 — "en/ru/ar unchanged")
- No Hebrew letters (`/[֐-׿]/`) in that heading and placeholder.

### 2. Tender panel — HR
**Seed:** `tests/seed.company_6.spec.ts`

#### 2.1 Tender panel search «חיפוש מועמד/ת» for HR on T-44 @desktop @prod-safe #8ad3b0
**Case:** `.qa/tests/submit-panel/SP-2-1.md` · **File:** `tests/submit-panel/tender-panel-search-he.spec.ts`
**Device:** desktop · **Users:** company_6 (demo-company-6, HR)
**Steps:**
1. Go to `/tenders/65d2b6a1-234b-47db-9984-b4dcbe984452` (T-44). If not found → `test.skip(true, '8ad3b0 data changed: T-44 not found')`.
2. Read the search field of the submit panel.
**Expected:**
- Placeholder «חיפוש מועמד/ת». (#8ad3b0 «Done when» — "the same on a tender panel (T-44 as demo-company-6)")

**Not automated:** the same check for hunter_free (demo-hunter-2) — same component, checked manually 07.11; ru/ar of the panel — screenshots only (`8ad3b0-J1-panel-ru/ar-desktop.png`), no fixed reference string in the ticket.
