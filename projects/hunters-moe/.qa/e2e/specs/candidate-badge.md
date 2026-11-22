<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Candidate badge: neutral «מועמד/ת» in the profile header (2026-11-07)

STATUS: READY — #416558 and #f2c5ce (owner-side rejection rej_fdbf266b…, closed) passed QA; user moved both to «הושלם» 2026-11-07. Not generated yet. Environment: staging https://hunters-sooty.vercel.app.
Sources: #416558 «מה רצוי» "The badge on /my-candidates/<id> reads «מועמד/ת» in Hebrew; en «Candidate», ru «Кандидат», ar «مرشح» stay. One shared fix for the badge component on every page where it appears"; #f2c5ce rejection "Owner side: the full-profile page of a submission shows the masculine-only badge «מועמד»"; rule 2026-10-19 (context.md) — neutral «/» about the candidate, masculine-only = reject. Evidence: `.qa/screenshots/416558-*.png`, `.qa/screenshots/f2c5ce-B-badge-*-desktop.png`, `f2c5ce-v-badge-8f88518a-he-desktop.png`. Cases: `.qa/tests/candidate-badge/CB-1-1, CB-1-2, CB-2-1`.
Related, not duplicated: submit window texts — `submit-candidate.md` §3; panel heading/search — `submit-panel.md`.

**Rules (whole file):** read-only, `@prod-safe`; one role per file; saved sessions via seed; language ONLY via URL prefix (`/en`, `/ru`, `/ar`) — never the header switcher (it saves the user's setting; helper `withLocale` in `tests/_helpers/i18n.ts`); no `waitForTimeout` / `networkidle`.
**Badge locator:** the yellow badge under the candidate headline in the profile header — `page.getByText('מועמד/ת', { exact: true })` (he). Masculine-only check: `page.getByText('מועמד', { exact: true })` has count 0 (exact match — does not hit «מועמד/ת» or «מועמדים»).
**Data guard:** if the page shows «אופס, הדף לא נמצא» / no candidate header → `test.skip(true, '<hash> data changed: <id> not found')` — do not adapt the expectation.

---

### 1. Headhunter's own candidate page (#416558)
**Seed:** `tests/seed.hunter_plus.spec.ts`

#### 1.1 /my-candidates/<id> shows the badge «מועמד/ת», no masculine-only «מועמד» @desktop @prod-safe #416558
**Case:** `.qa/tests/candidate-badge/CB-1-1.md` · **File:** `tests/candidate-badge/hunter-candidate-page-badge-he.spec.ts`
**Device:** desktop · **Users:** hunter_plus (claude-test)
**Steps:**
1. Go to `/my-candidates/3342cb1e-2c63-4959-ba77-db9437b4569f` («רון QA2810y»).
2. Wait for the candidate heading «רון QA2810y».
**Expected:**
- Text «מועמד/ת» (exact) is visible in the header. (#416558 «Done when»)
- No element with exact text «מועמד». (#416558 «מה רצוי»; rule 19.10)

#### 1.2 Badge in en/ru/ar stays «Candidate» / «Кандидат» / «مرشح» @desktop @prod-safe #416558
**Case:** `.qa/tests/candidate-badge/CB-1-2.md` · **File:** `tests/candidate-badge/hunter-candidate-page-badge-i18n.spec.ts`
**Device:** desktop · **Users:** hunter_plus
**Steps:**
1. For each of `/en`, `/ru`, `/ar`: go to `<prefix>/my-candidates/3342cb1e-2c63-4959-ba77-db9437b4569f`; wait for the candidate heading.
**Expected:**
- en: exact text «Candidate» visible; ru: «Кандидат»; ar: «مرشح». (#416558 «מה רצוי» — "en … ru … ar stay")
- No «מועמד» (exact) on the page in any of the three.

### 2. Owner's full-profile submission page (#f2c5ce)
**Seed:** `tests/seed.company.spec.ts`

#### 2.1 Owner on /applications/<id> sees «מועמד/ת» (he) and Candidate/Кандидат/مرشح (en/ru/ar) @desktop @prod-safe #f2c5ce
**Case:** `.qa/tests/candidate-badge/CB-2-1.md` · **File:** `tests/candidate-badge/owner-application-badge.spec.ts`
**Device:** desktop · **Users:** company (demo-company-1, owner of T-62)
**Steps:**
1. Go to `/applications/8f88518a-a6fc-4b25-a8f6-8a824868262a` (T-62 «QA-AUTO 1020 E1 Bravo», full profile).
2. Read the badge; repeat with `/en`, `/ru`, `/ar` prefixes.
**Expected:**
- he: «מועמד/ת» visible; no element with exact text «מועמד». (#f2c5ce rejection rej_fdbf266b…; rule 19.10)
- en «Candidate», ru «Кандидат», ar «مرشح». (rejection — "en/ru/ar unchanged")

**Not automated:** owner's page for a JOB submission (old d6766cca deleted in #2b0521; new job submissions are QA data that may disappear — checked manually 07.11, `f2c5ce-v-job-badge-desktop.png`).
