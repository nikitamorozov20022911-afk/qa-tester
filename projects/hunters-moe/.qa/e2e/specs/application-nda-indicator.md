<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Application NDA indicator: NDA status + one-click signed NDA popup (2026-10-28)

STATUS: READY — #68f480 «Application on an NDA job shows no NDA status» passed QA (עבר QA, confirmed by the user 2026-10-28). Not generated yet. Environment: staging.
Sources: ticket «מה רצוי» (rejection №1, closed 22.10) «NDA-required applications show the NDA state on both sides: the status timeline includes «ממתין ל-NDA» … and «NDA נחתם» (signed, with date) … the same status is shown to the owner, the sender and in admin; … NDA indicator with a link to the signed agreement»; rejection №2 «… opens THIS signed NDA directly («הסכם סודיות (NDA): <job title>», sections, «נחתם על ידי <name> בתאריך <date>») … While only requested — no link … Admin: NDA block in /admin/applications/<id> … leads to the same agreement. Texts he/en/ru/ar»; dev note 26.10 «popup (title, sections, signer, date, signature) for the owner and the sender». Brief `.qa/research/68f480.md`; screenshots `.qa/screenshots/68f480-*.png`.
Manual cases: `.qa/tests/application-nda-indicator/AN-*.md` (AN-1-1…AN-1-5, AN-2-1, AN-3-1, AN-3-2).
Related (not duplicated): job-application timeline rows / no duplicates — `candidacy-timeline.md`; status labels — `candidacy-status.md`.

**Rules (whole file):** ALL tests are read-only and `@prod-safe` — open pages and the popup, read, close. NEVER click status actions («עדכון ידני», «לעמוד המשרה בניהול», «לטיפול בהגשה», «שליחת הודעה»), never sign/request an NDA. One role per test file (Supabase rotating refresh tokens). Saved sessions only (seed); no `waitForTimeout` / `networkidle` — wait for the result with `expect(...)`. Selectors by role/text.
**Data (KEEP — do not change):** job J-49 «QA company post test» `7e4ad713-60a0-4e68-9926-56e0ee667584` (owner demo-company-1); application `0cc56444-27c3-4d3d-82cf-d83e8cddb5b1` («QA-AUTO recv 850649 anon NDA», sender demo-hunter-2 «הד האנטר דמו 2», NDA signed 22.10.2026). Requested-only: application `d7a89587-59a9-40cd-832e-84e399f80ec7` (J-45 «ראש צוות פיתוח Frontend», candidate «רון שגיא», sender claude-test «נועם כהן»). If the data changed (application not found / NDA state differs) → `test.skip` with annotation «68f480 data changed», do not adapt the expectation.
**Popup checks (shared):** dialog (`getByRole('dialog')`) with heading «הסכם סודיות (NDA): QA company post test»; exactly 5 numbered section headings «1.»…«5.» (he: «מטרת ההסכם», «"מידע סודי"», «התחייבויות המגייס/ת», «תקופת ההסכם», «סנקציות»); signer line with date 22.10.2026; «בתוקף עד שנתיים מתום התהליך». Before clicking save `page.url()`; after the popup opens the URL is identical and does not contain `/profile` / `tab=agreements`. Close via the back/close control or Escape; dialog hidden after close.
**Known — NOT asserted:** owner on `/applications/0cc56444…` gets 404 «אופס, הדף לא נמצא» (owner sees the application only in the job dialog — `68f480-owner-app-page-soft404-desktop.png`); the signature image area may render empty for the owner — assert the `img` with alt «החתימה על ההסכם» only for the sender (AN-1-2); dates in en/ar have locale formats («Oct 22, 2026», «2026/10/22»).
Not automated: talent as sender (no talent application with a signed NDA on the stand); «הסכמים» tab in the profile (regression С1 — not part of the confirmed cases).

---

### 1. Application NDA indicator — signed NDA opens in a popup (read-only)
**Seed:** `tests/seed.company.spec.ts` (1.1, 1.5, 1.7), `tests/seed.hunter_free.spec.ts` (1.2, 1.6, 1.8), `tests/seed.admin.spec.ts` (1.3, 1.9, 1.10), `tests/seed.hunter_plus.spec.ts` (1.4)

#### 1.1 Owner opens the signed NDA of an application in a popup from the job dialog @desktop @prod-safe #68f480
**Status:** READY · **Case:** `.qa/tests/application-nda-indicator/AN-1-1.md` · **File:** `tests/application-nda-indicator/owner-opens-signed-nda-popup.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company (demo-company-1, owner of J-49)
**Steps:**
1. Open `/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584?application=0cc56444-27c3-4d3d-82cf-d83e8cddb5b1` — the application dialog opens.
2. Save the current URL. Click the button «NDA נחתם ב-22.10.2026 צפייה בהסכם».
3. Read the popup; check the URL; close the popup.
**Expected:**
- Popup heading «הסכם סודיות (NDA): QA company post test». (rejection №2 «opens THIS signed NDA directly … «הסכם סודיות (NDA): <job title>»»)
- 5 section headings; text «נחתם על ידי הד האנטר דמו 2 בתאריך 22.10.2026»; «בתוקף עד שנתיים מתום התהליך». (rejection №2 «sections, «נחתם על ידי <name> בתאריך <date>»»)
- URL unchanged after the click, no `/profile?tab=agreements`. (rejection №2 «without searching the general list»)
- After close the dialog is hidden.

#### 1.2 Sender opens the signed NDA from /applications/<id> and from the job dialog @desktop @prod-safe #68f480
**Status:** READY · **Case:** `.qa/tests/application-nda-indicator/AN-1-2.md` · **File:** `tests/application-nda-indicator/sender-opens-signed-nda-popup.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free (demo-hunter-2, sender)
**Steps:**
1. Open `/applications/0cc56444-27c3-4d3d-82cf-d83e8cddb5b1`.
2. Save the URL; click «NDA נחתם ב-22.10.2026 צפייה בהסכם»; read the popup; check the URL; close.
3. Open `/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584?application=0cc56444-27c3-4d3d-82cf-d83e8cddb5b1` (own application dialog) → repeat step 2.
**Expected:**
- In both places: popup heading «הסכם סודיות (NDA): QA company post test», 5 section headings, signer line «נחתם על ידכם» with date 22.10.2026, image with alt «החתימה על ההסכם», «בתוקף עד שנתיים מתום התהליך». (rejection №2; dev note 26.10 «title, sections, signer, date, signature … for the owner and the sender»)
- URL unchanged after each click, no `/profile?tab=agreements`. (rejection №2)

#### 1.3 Admin opens the same signed NDA from /admin/applications/<id> @desktop @prod-safe #68f480
**Status:** READY · **Case:** `.qa/tests/application-nda-indicator/AN-1-3.md` · **File:** `tests/application-nda-indicator/admin-opens-signed-nda.spec.ts`
**Seed:** `tests/seed.admin.spec.ts`
**Device:** desktop
**Users:** admin (demo-admin)
**Steps:**
1. Open `/admin/applications/0cc56444-27c3-4d3d-82cf-d83e8cddb5b1`.
2. In the «NDA» block (value «נחתם ב-22.10.2026») click «צפייה בהסכם».
3. Read the opened agreement; close it.
**Expected:**
- Agreement heading «הסכם סודיות (NDA): QA company post test»; text «נחתם על ידי הד האנטר דמו 2 בתאריך 22.10.2026»; 5 section headings. (rejection №2 «Admin: NDA block … leads to the same agreement»)

#### 1.4 Requested-only NDA: sender sees «ממתין/ה ל-NDA» without a link to an agreement @desktop @prod-safe #68f480
**Status:** READY · **Case:** `.qa/tests/application-nda-indicator/AN-1-4.md` · **File:** `tests/application-nda-indicator/sender-requested-only-no-link.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus (claude-test, sender of d7a89587)
**Steps:**
1. Open `/applications/d7a89587-59a9-40cd-832e-84e399f80ec7`.
2. Read the status indicator and the block «סטטוס מועמד».
**Expected:**
- Status «ממתין/ה ל-NDA» is visible (indicator and the last timeline row). (rejection №1 «ממתין ל-NDA (requested, not yet signed)»; decision 19.10 neutral gender «ממתין/ה»)
- No button/link «צפייה בהסכם»; no text «NDA נחתם» on the page. (rejection №2 «While only requested — no link»)

#### 1.5 Requested-only NDA in admin: «ממתין לחתימה», no «צפייה בהסכם» @desktop @prod-safe #68f480
**Status:** READY · **Case:** `.qa/tests/application-nda-indicator/AN-1-5.md` · **File:** `tests/application-nda-indicator/admin-requested-only-no-link.spec.ts`
**Seed:** `tests/seed.admin.spec.ts`
**Device:** desktop
**Users:** admin (demo-admin)
**Steps:**
1. Open `/admin/applications/d7a89587-59a9-40cd-832e-84e399f80ec7`.
2. Read the heading badges, the «NDA» block and the «סטטוס מועמד» block.
**Expected:**
- Badge «ממתין/ה ל-NDA»; «NDA» block shows «ממתין לחתימה»; timeline rows «נשלח/ה» → «ממתין/ה ל-NDA», no row «NDA נחתם». (rejection №1 «the same status is shown to the owner, the sender and in admin»)
- No «צפייה בהסכם» and no «נחתם ב-» in the «NDA» block. (rejection №2 «While only requested — no link»)

---

### 2. Application NDA indicator — languages en / ru / ar (read-only)
**Seed:** `tests/seed.company.spec.ts` (2.1), `tests/seed.hunter_free.spec.ts` (2.2)

Language is set by the URL prefix (`/en/…`, `/ru/…`, `/ar/…`); do NOT use the language switcher (it may persist the account's language).

#### 2.1 Owner: NDA indicator and popup in en / ru / ar @desktop @prod-safe #68f480
**Status:** READY · **Case:** `.qa/tests/application-nda-indicator/AN-2-1.md` · **File:** `tests/application-nda-indicator/owner-nda-popup-i18n.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company (demo-company-1)
**Steps:**
1. For each of `en`, `ru`, `ar`: open `/<lang>/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584?application=0cc56444-27c3-4d3d-82cf-d83e8cddb5b1`.
2. Read the NDA button; click it; read the popup; close it.
**Expected:**
- Button: en «NDA signed on Oct 22, 2026 View agreement»; ru «NDA подписано 22.10.2026 Посмотреть соглашение»; ar contains «تم توقيع NDA في» and «عرض الاتفاقية». (rejection №2 «Texts he/en/ru/ar»)
- Popup heading: en/ru «NDA: QA company post test»; ar «اتفاقية عدم الإفصاح (NDA): QA company post test». Section headings in the page language (en «1. Purpose»…«5. Sanctions»; ru «1. Цель»…«5. Санкции»; ar «1. الغرض»…«5. العقوبات»); signer line with the date (en «Signed by … on Oct 22, 2026», ru «Подписано: 22.10.2026 …»); no Hebrew interface labels (Hebrew allowed only in the signer name). (rejection №2)

#### 2.2 Sender: NDA indicator and popup in en / ru / ar @desktop @prod-safe #68f480
**Status:** READY · **Case:** `.qa/tests/application-nda-indicator/AN-2-1.md` · **File:** `tests/application-nda-indicator/sender-nda-popup-i18n.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free (demo-hunter-2)
**Steps:**
1. For each of `en`, `ru`, `ar`: open `/<lang>/applications/0cc56444-27c3-4d3d-82cf-d83e8cddb5b1`.
2. Read the NDA button; click it; read the popup; close it.
**Expected:**
- Button texts as in 2.1 per language. (rejection №2 «Texts he/en/ru/ar»)
- Popup heading/section headings in the page language as in 2.1; ar signer line «وقعتها بتاريخ 2026/10/22»; «ساري حتى سنتين بعد انتهاء العملية» (ar), «Valid until 2 years after the process ends» (en), «Действует 2 года после окончания процесса» (ru). (rejection №2)

---

### 3. Application status timeline on an NDA job (read-only, regression of rejection №1)
**Seed:** `tests/seed.company.spec.ts` (3.1), `tests/seed.hunter_free.spec.ts` (3.2), `tests/seed.admin.spec.ts` (3.3)

Count the rows of the block «סטטוס מועמד» (row = check icon + label + date); read labels by text content (labels may be visually truncated with «…»).

#### 3.1 Owner: timeline Sent → Viewed → Waiting for NDA → NDA signed @desktop @prod-safe #68f480
**Status:** READY · **Case:** `.qa/tests/application-nda-indicator/AN-3-1.md` · **File:** `tests/application-nda-indicator/owner-nda-timeline.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company (demo-company-1)
**Steps:**
1. Open `/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584?application=0cc56444-27c3-4d3d-82cf-d83e8cddb5b1`.
2. Read the rows of «סטטוס מועמד» in order.
**Expected:**
- Rows in order «נשלח/ה» → «נצפה/תה» → «ממתין/ה ל-NDA» → «NDA נחתם»; the last row has date 22.10.2026. (rejection №1 «Done when … shows «NDA נחתם» with date in the timeline for both sides»; §06 AC01)

#### 3.2 Sender: timeline Sent → Viewed → Waiting for NDA → NDA signed @desktop @prod-safe #68f480
**Status:** READY · **Case:** `.qa/tests/application-nda-indicator/AN-3-1.md` · **File:** `tests/application-nda-indicator/sender-nda-timeline.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free (demo-hunter-2)
**Steps:**
1. Open `/applications/0cc56444-27c3-4d3d-82cf-d83e8cddb5b1`.
2. Read the rows of «סטטוס מועמד» in order.
**Expected:**
- Same 4 rows in the same order; «NDA נחתם» with date 22.10.2026. (rejection №1 «for both sides»)

#### 3.3 Admin: NDA status, timeline and NDA block of the signed application @desktop @prod-safe #68f480
**Status:** READY · **Case:** `.qa/tests/application-nda-indicator/AN-3-2.md` · **File:** `tests/application-nda-indicator/admin-nda-timeline.spec.ts`
**Seed:** `tests/seed.admin.spec.ts`
**Device:** desktop
**Users:** admin (demo-admin)
**Steps:**
1. Open `/admin/applications/0cc56444-27c3-4d3d-82cf-d83e8cddb5b1`.
2. Read the heading badges, the rows of «סטטוס מועמד» and the «NDA» block (do not click anything).
**Expected:**
- Badge «NDA נחתם»; timeline rows «נשלח/ה» → «נצפה/תה» → «ממתין/ה ל-NDA» → «NDA נחתם», last with date 22.10.2026. (rejection №1 «the same status is shown to the owner, the sender and in admin»)
- «NDA» block shows «נחתם ב-22.10.2026» and the button «צפייה בהסכם». (rejection №2 «Admin: NDA block … («נחתם ב-<date>»)»)
- If the admin view of 0cc56444 differs from this (case AN-3-2 was confirmed on the same admin layout, screenshot of another application) — STOP and report, do not adapt.
