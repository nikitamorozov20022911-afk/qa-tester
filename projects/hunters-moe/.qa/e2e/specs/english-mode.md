<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — English mode: system list values and phone format (2026-10-21)

STATUS: **READY** — Ticket #95bd33 (177d6270884bad33da95bd33) «English mode: cities, employment scope and AI summary stay in Hebrew/English; dates and phones in different formats; language names in the switcher». Passed QA 21.10.2026, user moved it to «הושלם».
Updated 2026-10-21: section 2 (#09132b admin job page region in English) added — READY.
Source of expectations: reject rej_1792402881266 «needed behavior» (items 1 and 6). Evidence: `.qa/screenshots/2026-10-21/95bd33-*.png`.
Related entries already in `copywriting.md` (same ticket, old hash #177d6270): 6.1 «English cards have no Hebrew dictionary values», 6.2 «Language switcher native names» — not repeated here.
Rules: saved sessions only (seed per role); read-only; no fixed waits / networkidle — wait for results via expect(); do not run — only /qa-regress runs tests.

---

### 1. English mode
**Seed:** `tests/seed.talent.spec.ts`, `tests/seed.spec.ts` (guest), `tests/seed.hunter_plus.spec.ts`

#### 1.1 Tender scope shown in English on cards and details @desktop @prod-safe #95bd33
**Device:** desktop · **Users:** talent · **Case:** `.qa/tests/english-mode/EN-1-1.md`
**Steps:**
1. Open /en/tenders (talent session).
2. Read the "Estimated scope" value on every tender card in the list.
3. Open tender T-8 «גיוס אנליסטים לחטיבת הסיכונים» (search the list by its title or code "T-8") — the «Tender details» dialog opens.
4. Read the value under "Estimated scope" in the dialog.
**Expected:**
- In the dialog "Estimated scope" shows "Quarter-time".
- No card and not the dialog shows a Hebrew scope value: none of «רבע משרה», «חצי משרה», «משרה מלאה», «לפי שעה», «משמרות», «לפי פרויקט».
- Each scope value on cards is one of the English names (e.g. "Full-time", "Part-time", "Quarter-time", "Hourly", "Per project", "Shifts").
- (source: reject «needed behavior» (1): «"Estimated scope" shows the English name of the scope (e.g. "Quarter-time" …), never "רבע משרה"»)

#### 1.2 Contact page phones use one grouped format @desktop @prod-safe #95bd33
**Device:** desktop · **Users:** guest · **Case:** `.qa/tests/english-mode/EN-1-2.md`
**Steps:**
1. Open /contact as guest (Hebrew).
2. Read the phone chips next to the e-mail chip «info@hunters.co.il».
3. Open /en/contact and read the same chips.
**Expected:**
- he and en show "050-382-2282" and "054-841-1474".
- No ungrouped form on the page: neither "050-3822282" nor "054-8411474" (no phone matches /\b0\d{2}-\d{7}\b/ or /\b0\d{9}\b/).
- (source: reject «needed behavior» (6): «/contact shows "050-382-2282" and "054-841-1474" … not "050-3822282"»)

#### 1.3 Talent bank profile phone uses the same format @desktop @prod-safe #95bd33
**Device:** desktop · **Users:** hunter_plus · **Case:** `.qa/tests/english-mode/EN-1-3.md`
**Steps:**
1. Open /talents-bank (hunter_plus, PLUS).
2. Open the first talent card that is not anonymous (no «פרופיל אנונימי» badge).
3. Find the phone number on the profile (if the profile shows a phone).
4. Repeat steps 1–3 on /en/talents-bank.
**Expected:**
- Every phone shown matches "0XX-XXX-XXXX" (/^0\d{2}-\d{3}-\d{4}$/) or "+972 XX-XXX-XXXX" — the same form on he and en.
- No "+972 521234567", "972521234567" or "0501234567" forms (no 9–10 digits without separators).
- Do not click «ייצג את הטאלנט הזה» / «שליחת הודעה» (they create data).
- (source: reject «needed behavior» (6): «one format across the whole site and in all languages – profiles, talent bank, candidate cards…»)

---

### 2. English admin: job region uses its English name (#09132b)
**Seed:** `tests/seed.admin.spec.ts`

Source: rejection d6239321 «needed behavior» (#09132b); developer note «the admin job page uses the region's localized name»; evidence `.qa/screenshots/2026-10-21/09132b-T1-*.png`.
ADMIN — READ ONLY (lesson L-20261020-1): only navigate and read text. NEVER click «Move to» status buttons (Active / Promoted / Inactive / Expired), «Grant», any combobox or menu in a job row, or anything in «Job status». Open a job only by its title link / direct URL.
Excluded on purpose: old demo jobs with the free-text location «מודיעין» (J-5, J-19, J-32) — the value is not from the regions list and shows the same in Hebrew on the public site (finding, not this ticket).

#### 2.1 /en/admin job page shows the region in English (title line and «Location») @desktop @prod-safe #09132b
**Status:** READY · **Case:** `.qa/tests/english-mode/EN-2-1.md` · **File:** `tests/english-mode/admin-job-region-english.spec.ts`
**Seed:** `tests/seed.admin.spec.ts`
**Device:** desktop
**Users:** admin (demo-admin)
**Steps:**
1. Open /en/admin/jobs (language «English»).
2. Open job J-66 «QA-AUTO 1020 C3 משרה» (search by «J-66» or the title; open by the title link). Read the subtitle under the title and «Job details» → «Location».
3. Back to «All jobs»; open J-35 «ראש צוות פיתוח Backend»; read the same.
4. Back; open J-31 «מהנדס/ת תכנון שבבים (VLSI)»; read the same.
**Expected:**
- J-66: subtitle «Technology, Product, Data & IT • Nationwide», «Location» = «Nationwide».
- J-35: subtitle ends with «• Tel Aviv»; J-31: subtitle «Industry, Manufacturing & Engineering • Haifa»; «Location» = «Tel Aviv» / «Haifa».
- No Hebrew region names on these pages: none of «כל הארץ», «תל אביב», «חיפה», «ירושלים», «צפון», «דרום», «מרכז», «חו"ל», «אילת» in the subtitle or «Location». (needed behavior #09132b: «Location: Nationwide … the subtitle under the job title uses the English region name too»)
- Nothing was clicked except the job title links and «All jobs».
