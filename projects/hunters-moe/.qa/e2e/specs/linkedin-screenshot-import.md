<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — LinkedIn screenshot import in Edit Profile (2026-11-15)

Ticket #8fc7be «Client request: Auto-fill candidate profile from a LinkedIn profile screenshot (Edit Profile + Registration)». QA passed, user moved to «הושלם» 15.11.2026 (after reject rej_609567e7 «headline not used» was fixed).
Cases: `.qa/tests/linkedin-screenshot-import/LSI-*.md`. Brief: `.qa/research/8fc7be.md`. Evidence: `.qa/screenshots/8fc7be-r3-*.png`, `.qa/screenshots/2026-11-15/8fc7be-reg-*.png`.

STATUS: §1 and §2 **READY** for `playwright-test-generator` (Edit Profile, talent session). §3 **MANUAL** (registration needs a brand-new talent; paste / drag / languages / 375px).

Rules for every test here:
- Seed `tests/seed.talent.spec.ts` (demo-talent-1, public profile). Saved session only, no passwords.
- Route `/profile?edit=personal` (dialog «עריכת פרופיל», tab «פרטים אישיים»). The dialog is RTL Hebrew.
- **Never click «שמירה» / save.** The import only fills the unsaved form. Each test ends by closing the dialog (the « > » button next to «עריכת פרופיל») without saving.
- Fixtures (already copied): `fixtures/linkedin-screenshot/li-mock-1.png` (synthetic profile «Dana Levi QA0711», 1440 wide), `fixtures/linkedin-screenshot/neg-1.gif`, `fixtures/linkedin-screenshot/neg-big-6mb.png` (6.1 MB). Upload via `setInputFiles` on the block's file input (or the file chooser opened by «בחירת תמונה»). Paths relative to the spec file: `path.join(__dirname, '../../fixtures/linkedin-screenshot/<file>')`.
- The AI read takes seconds to tens of seconds: wait for the result with `expect(...).toBeVisible({ timeout: 90_000 })` on the summary box, no fixed pauses, no networkidle.
- Account state is not hardcoded: values the test compares against (first name, last name, address, «כמה מילים עליכם», «כותרת התפקיד», experience rows) are READ from the form BEFORE the import and compared AFTER. Screenshot values are fixed (below).
- Screenshot values (li-mock-1.png): first name `Dana`; last name `Levi QA0711`; headline `Senior Backend Developer at Wix` (the part after « | » may be dropped); address `Tel Aviv District, Israel`; About starts `Backend developer with 8 years of experience building scalable services in Node.js and Go.`; LinkedIn URL `linkedin.com/in/dana-levi-qa0711`; jobs `Senior Backend Developer` @ Wix (03.2021 – now), `Software Engineer` @ Check Point Software Technologies (01.2017 – 02.2021); education `Tel Aviv University`, `Bachelor of Science - BSc, Computer Science` (2013 – 2016); languages Hebrew, English, Russian.
- No `@data`: nothing is saved. No `@prod-safe` on tests that call the AI (cost); the three negative tests (§2) are client-side checks and are `@prod-safe`.
- If the live site differs from a case — stop and report, do not adjust the expectation.

---

### 1. LinkedIn screenshot import — Edit Profile
**Seed:** `tests/seed.talent.spec.ts`

#### 1.1 The screenshot-import block is on «פרטים אישיים» under the LinkedIn import @desktop @prod-safe #8fc7be
**Device:** desktop · **Users:** talent · **Case:** `.qa/tests/linkedin-screenshot-import/LSI-1-1.md` · **test-file:** `tests/linkedin-screenshot-import/import-block-present.spec.ts`
**Steps:**
1. Open /profile?edit=personal (talent session).
2. If the tab «פרטים אישיים» is not active — click it.
3. Scroll to the heading «ייבוא מצילום מסך של LinkedIn», right under «ייבוא מקובץ PDF של LinkedIn».
**Expected:**
- Heading «ייבוא מצילום מסך של LinkedIn» is visible, below the PDF import block (button «העלאת PDF מ-LinkedIn»). (AC1)
- A dashed drop zone with the text «הדביקו כאן צילום מסך (Ctrl+V) או גררו תמונה לכאן» and the button «בחירת תמונה». (AC1; developer note)
- Hint text «PNG, JPG או WebP, עד 5MB לתמונה, עד 4 תמונות בכל פעם». (developer note: up to 4 images, 5 MB each)
- Nothing is uploaded and nothing is saved.

#### 1.2 Import by «בחירת תמונה» fills «כמה מילים עליכם» and the LinkedIn link, shows a summary @desktop #8fc7be
**Device:** desktop · **Users:** talent · **Case:** `LSI-1-2.md` · **test-file:** `tests/linkedin-screenshot-import/import-fills-about-and-link.spec.ts`
**Steps:**
1. Open /profile?edit=personal, tab «פרטים אישיים».
2. Read and remember the value of «כמה מילים עליכם» and of the LinkedIn field (placeholder `https://linkedin.com/in/…`) before the import.
3. Upload `li-mock-1.png` through «בחירת תמונה».
4. Wait for the light-blue summary box with the title «יובא מצילום המסך של LinkedIn».
**Expected:**
- The summary box appears; the button text in the drop zone changes to «בחירת תמונה נוספת». (AC3)
- The summary says what was filled; for fields that were empty before the import the value from the screenshot is in the field, for fields that were not empty the old value is kept. (AC3, AC4; developer note)
- «כמה מילים עליכם»: if it was empty — now starts with `Backend developer with 8 years of experience`; if it was filled — the old text is unchanged and the suggestion row «כמה מילים עליכם:» with that text and «להשתמש בזה» is in the summary. (AC4)
- The LinkedIn field: empty before → now holds `linkedin.com/in/dana-levi-qa0711`; filled before → unchanged. (AC3)
- The fields stay editable (can type into «כמה מילים עליכם»). (AC5)
- Do not save; close the dialog.

#### 1.3 Filled fields are kept and the screenshot value is offered with «להשתמש בזה» @desktop #8fc7be
**Device:** desktop · **Users:** talent · **Case:** `LSI-1-3.md` · **test-file:** `tests/linkedin-screenshot-import/filled-fields-suggestion-use-this.spec.ts`
**Steps:**
1. Open /profile?edit=personal, tab «פרטים אישיים». Remember the values of «שם פרטי», «שם משפחה», «כתובת».
2. Upload `li-mock-1.png`, wait for the summary box.
3. In the summary read the line «בשדות האלה השארנו את מה שמילאתם, ובצילום המסך כתוב אחרת:» and its rows.
4. Click «להשתמש בזה» next to the row «שם פרטי:».
**Expected:**
- Under that line there are rows «שם פרטי:» = `Dana`, «שם משפחה:» = `Levi QA0711`, «כתובת:» = `Tel Aviv District, Israel` (rows only for fields that were filled and differ), each with its own «להשתמש בזה». (developer note; AC5)
- Right after the import the form fields «שם פרטי», «שם משפחה», «כתובת» still hold the remembered old values (nothing overwritten).
- After the click: «שם פרטי» holds `Dana`; «שם משפחה» and «כתובת» are still the old values.
- Do not save; close the dialog.

#### 1.4 The import summary lists «כותרת התפקיד» @desktop #8fc7be
**Device:** desktop · **Users:** talent · **Case:** `LSI-1-4.md` · **test-file:** `tests/linkedin-screenshot-import/summary-lists-job-title.spec.ts`
**Steps:**
1. Open /profile?edit=personal, tab «פרטים אישיים».
2. Upload `li-mock-1.png`, wait for the summary box.
3. Scroll the summary box to its bottom.
**Expected:**
- The summary contains a row «כותרת התפקיד:» with `Senior Backend Developer at Wix` (the skills after « | » may be absent) and «להשתמש בזה». (the fixed reject rej_609567e7: «The import summary lists «כותרת התפקיד»»)
- Nothing from the summary is saved; close the dialog.

#### 1.5 Experience and education are added unsaved, without duplicates @desktop #8fc7be
**Device:** desktop · **Users:** talent · **Case:** `LSI-1-5.md` · **test-file:** `tests/linkedin-screenshot-import/experience-education-no-duplicates.spec.ts`
**Steps:**
1. Open /profile?edit=personal. Open the tab «ניסיון מקצועי» and remember the list of work places (title + company) and education rows.
2. Back on «פרטים אישיים»: upload `li-mock-1.png`, wait for the summary box.
3. Open the tab «ניסיון מקצועי»; read «ניסיון תעסוקתי» and «השכלה».
4. Switch to «מסמכים», then back to «ניסיון מקצועי»; read both lists again.
**Expected:**
- Every work place that was there before is still there, unchanged. (AC5)
- «ניסיון תעסוקתי» contains exactly one row `Senior Backend Developer` / `Wix` and exactly one row `Software Engineer` / `Check Point Software Technologies`; no row appears twice, even if the account already had the same job. (developer note; brief Т5.3)
- «השכלה» contains exactly one row `Tel Aviv University` / `Bachelor of Science - BSc, Computer Science`.
- Dates of the added jobs: Wix «מרץ 2021 - היום»; Check Point «ינו׳ 2017 - פבר׳ 2021»; education «2016 - 2013».
- The lists are the same after the tab switch (the unsaved rows survive).
- Do not save; close the dialog.

#### 1.6 A filled «כותרת התפקיד» is kept and the screenshot headline is offered with «להשתמש בזה» @desktop #8fc7be
**Device:** desktop · **Users:** talent · **Case:** `LSI-1-6.md` · **test-file:** `tests/linkedin-screenshot-import/filled-job-title-suggestion.spec.ts`
**Steps:**
1. Open /profile?edit=personal; open the tab «ניסיון מקצועי»; remember the value of the required field «כותרת התפקיד».
2. Back on «פרטים אישיים»: upload `li-mock-1.png`, wait for the summary box.
3. Open the tab «ניסיון מקצועי».
4. Click «להשתמש בזה» in the light-blue row under «כותרת התפקיד».
**Expected:**
- «כותרת התפקיד» still holds the remembered value after the import (not overwritten). (the fixed reject: «already filled — it stays as it is»)
- Directly under the field a row «בצילום המסך של LinkedIn: Senior Backend Developer at Wix» with the button «להשתמש בזה». (the fixed reject, item 2)
- After the click «כותרת התפקיד» = `Senior Backend Developer at Wix` (only in the form).
- Edge not automated: an empty «כותרת התפקיד» cannot be tested in Edit Profile (the field is required and cannot be empty); the empty case was checked in Registration (§3.1).
- Do not save; close the dialog.

#### 1.7 Closing the dialog without saving leaves every field unchanged @desktop #8fc7be
**Device:** desktop · **Users:** talent · **Case:** `LSI-1-7.md` · **test-file:** `tests/linkedin-screenshot-import/close-without-saving-unchanged.spec.ts`
**Steps:**
1. Open /profile?edit=personal. Remember: «שם פרטי», «שם משפחה», «כמה מילים עליכם», LinkedIn field, «כתובת»; on «ניסיון מקצועי» «כותרת התפקיד», the work places and education.
2. Upload `li-mock-1.png`, wait for the summary box; click «להשתמש בזה» next to «שם פרטי:».
3. Close the dialog with the « > » button next to «עריכת פרופיל» (no save). If a "discard changes" confirm appears — confirm leaving without saving.
4. Reload /profile?edit=personal; read the same values again.
**Expected:**
- Every value from step 1 is exactly the same after the reload (first name is NOT `Dana` unless it was before). (AC5; developer note «nothing is saved until save»)
- The list of work places and education is exactly the one from step 1 (no Wix / Check Point / Tel Aviv University rows added, unless they existed before).
- Nothing was saved, so nothing needs cleaning.

---

### 2. LinkedIn screenshot import — invalid files (client-side)
**Seed:** `tests/seed.talent.spec.ts`

#### 2.1 A GIF is rejected with a clear message @desktop @prod-safe #8fc7be
**Device:** desktop · **Users:** talent · **Case:** `LSI-2-1.md` · **test-file:** `tests/linkedin-screenshot-import/reject-gif.spec.ts`
**Steps:**
1. Open /profile?edit=personal, tab «פרטים אישיים».
2. Upload `neg-1.gif` through «בחירת תמונה» (input accepts files; the check is in the page).
**Expected:**
- Error toast «הקובץ אינו תמונה תקינה. אפשר להעלות צילום מסך מסוג PNG, JPG או WebP». (developer note: PNG/JPG/WebP only; clear error)
- No summary box appears; no field changes.

#### 2.2 A file over 5 MB is rejected with a clear message @desktop @prod-safe #8fc7be
**Device:** desktop · **Users:** talent · **Case:** `LSI-2-2.md` · **test-file:** `tests/linkedin-screenshot-import/reject-over-5mb.spec.ts`
**Steps:**
1. Open /profile?edit=personal, tab «פרטים אישיים».
2. Upload `neg-big-6mb.png` (6.1 MB).
**Expected:**
- Error toast that starts with «התמונה גדולה מדי» and mentions «עד 5MB» (assert the text from the toast as found live; it auto-hides — read it with `expect(...)` right after the upload). (developer note: 5 MB each)
- No summary box appears; no field changes.

#### 2.3 Five images at once are rejected with a clear message @desktop @prod-safe #8fc7be
**Device:** desktop · **Users:** talent · **Case:** `LSI-2-3.md` · **test-file:** `tests/linkedin-screenshot-import/reject-five-images.spec.ts`
**Steps:**
1. Open /profile?edit=personal, tab «פרטים אישיים».
2. Upload five files in one action: `li-mock-1.png` five times (`setInputFiles` with an array of five paths).
**Expected:**
- Error toast «אפשר להעלות עד 4 תמונות בכל פעם». (developer note: up to 4 images)
- No summary box appears; no field changes.

---

### 3. NOT automated (manual checklist)
- **3.1 Registration** — `LSI-3-1.md`: new talent at /onboarding/talent-details: same block, import, headline filled when empty / offered when filled, experience and education on the experience step without duplicates, no save before the end. Needs a brand-new account — not automated.
- **3.2 Ctrl+V, drag and drop, 4 languages, 375px** — `LSI-3-2.md`: manual (clipboard / DataTransfer in the shared session are not reliable).
- The "screenshot deleted right after reading" claim cannot be checked from outside.
