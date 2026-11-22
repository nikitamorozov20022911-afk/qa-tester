<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — «הוספת מועמד»: save only on «סיום», CV salary parsing (2026-10-21)

STATUS: GENERATED 2026-10-21 (§1 + §2, written manually, headless, shared tests/add-candidate/helpers.ts; desktop 6/6 pass, retries=0; candidates cannot be deleted in the UI — creating tests log them for manual cleanup; #d9db64 check ignores negation sentences «…לא צוין/צוינו»). READY — #7818c8, #344b9a passed QA (user moved them to «הושלם», 2026-10-21). Not generated yet.
Updated 2026-10-21: section 2 (#d9db64 AI texts for a minimal candidate) added — READY.
**Updated 2026-10-28 (#daf026 passed QA, user confirmed 28.10):** «הוספת מועמד» and «עריכת מועמד» NO LONGER have the «פרופיל אנונימי / פרופיל גלוי» choice — every candidate added by a headhunter is anonymous; instead step 1 always shows the info line «פרופיל המועמד אנונימי: השם ופרטי הקשר שלו לא יוצגו למשתמשים אחרים באתר. הפרטים המלאים נחשפים רק בהגשה עם «פרופיל מלא» או לאחר אישור בקשת פרופיל מלא.» Plan 1.1, 1.2, 2.1 rewritten (profile-type step removed, `uniquePhone()`); section 3 (#daf026) added. The SUBMISSION dialog («האם להגיש פרופיל מלא או אנונימי?» → «פרופיל אנונימי» / «פרופיל מלא») is unchanged — 2.2 and section 3 still use it. Generated files that still click «פרופיל גלוי» / assert the add-dialog radio → HEAL (list in section «Outdated generated files» at the end).
Rules: login only via saved sessions (seed per role / `asUser`); no fixed waits, no `networkidle`; test data prefix `QA-AUTO-`, cleanup in afterAll; no payments, no NDA signing (₪35), no time-based checks; `@data` = changes shared data (runs one at a time); `@prod-safe` = read-only. Status labels must not be changed by read-only tests (open menus, then Esc).

**22.10 — UNIQUE PHONE REQUIRED (finding 22.10, session.json findings_2210):** «הוספת מועמד» now rejects a phone already used by another candidate. Generated tests `tests/add-candidate/close-step2-confirm-not-saved.spec.ts` and `finish-creates-candidate-once.spec.ts` use the fixed phone `0500000098` (plan 1.1/1.2 «050-000-0098») → they now fail at the duplicate-phone check and must be changed to a unique phone. `ai-title-summary-minimal-candidate.spec.ts` and `ai-submit-summary-strengths-regenerations.spec.ts` use `050990${ts.slice(-4)}` — only 10,000 values, collisions over repeated runs → change too. Fix: add `export const uniquePhone = () => '05' + String(Date.now()).slice(-8);` to `tests/add-candidate/helpers.ts` and use it in all four tests (and in every new plan that creates a candidate). Not done yet — queued.
CV fixtures: `fixtures/qa-auto-cv-salary-range.pdf`, `fixtures/qa-auto-cv-no-salary.pdf` (relative to `.qa/e2e`; regenerate with `node fixtures/make-cv-pdf.mjs`). Related older plan for the same form: `specs/copywriting.md` (validation texts) — not duplicated here.

---

### 1. Add candidate
**Seed:** `tests/seed.hunter_plus.spec.ts`

#### 1.1 Closing on step 2 asks to confirm and does not create the candidate @desktop @data #7818c8
**Status:** DONE → OUTDATED 28.10 (#daf026: clicks «פרופיל גלוי» via `fillStep1({visible:true})`, fixed phone 0500000098) — HEAL · **Case:** `.qa/tests/add-candidate/AC-1-1.md` · **File:** `tests/add-candidate/close-step2-confirm-not-saved.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open /my-candidates/new («הוספת מועמד») — no profile-type choice (#daf026). Fill «שם פרטי» «QA-AUTO 7818c8», «שם משפחה» «<timestamp>», phone `uniquePhone()` (unique — a repeated phone is rejected), «כמה מילים על המועמד», «תחומי התמחות» → «המשך».
2. On step 2 click «סגירה» (arrow) → «המשך עריכה».
3. Click «סגירה» again → «יציאה».
4. Open «המועמדים שלי» and search «<timestamp>».
5. Cleanup (afterAll): if a «QA-AUTO 7818c8 <timestamp>» candidate exists (regression), delete it if the UI allows, otherwise log it.
**Expected:**
- Dialog «לצאת בלי לשמור?» with «המועמד לא יישמר. מה שמילאתם עד עכשיו יימחק» and buttons «יציאה», «המשך עריכה». (source: «מה רצוי» #7818c8)
- «המשך עריכה» keeps step 2 open with the entered data.
- After «יציאה» «המועמדים שלי» has no «QA-AUTO 7818c8 <timestamp>».

#### 1.2 Candidate is created only on «סיום» and exactly once @desktop @data #7818c8
**Status:** DONE → OUTDATED 28.10 (step 1 as in 1.1 — «פרופיל גלוי» + fixed phone) — HEAL · **Case:** `.qa/tests/add-candidate/AC-1-2.md` · **File:** `tests/add-candidate/finish-creates-candidate-once.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Step 1 as in 1.1 (no profile-type choice, phone `uniquePhone()`) with «שם פרטי» «QA-AUTO 7818c8 fin», «שם משפחה» «<timestamp>» → «המשך».
2. Step 2 → «סיום».
3. «המועמדים שלי» → search «<timestamp>».
4. Cleanup (afterAll): delete «QA-AUTO 7818c8 fin <timestamp>» if the UI allows; otherwise log it for manual cleanup.
**Expected:**
- After «סיום» exactly 1 card «QA-AUTO 7818c8 fin <timestamp>». (מה רצוי: «appears once»)

#### 1.3 CV parsing fills «ציפיות שכר מ-/עד» from a salary range @desktop #344b9a
**Status:** DONE · **Case:** `.qa/tests/add-candidate/AC-1-3.md` · **File:** `tests/add-candidate/cv-parsing-fills-salary.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. /my-candidates/new → «קובץ קו״ח» → upload `fixtures/qa-auto-cv-salary-range.pdf` (contains «Expected salary: 22,000 - 26,000 NIS per month»).
2. Wait for the message «מילאנו מקורות החיים…» (AI parsing — use a long `expect` timeout, not a fixed wait).
3. Close the dialog → «יציאה» (nothing saved).
**Expected:**
- «ציפיות שכר מ- (₪)» = 22000 and «ציפיות שכר עד (₪)» = 26000 (digits, separators ignored). (source: «מה רצוי» #344b9a, Done when)
- After «יציאה» no «QA-AUTO Salary Testcv» in «המועמדים שלי».

#### 1.4 CV without salary leaves the salary fields empty @desktop #344b9a
**Status:** DONE · **Case:** `.qa/tests/add-candidate/AC-1-4.md` · **File:** `tests/add-candidate/cv-without-salary-fields-empty.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. /my-candidates/new → «קובץ קו״ח» → upload `fixtures/qa-auto-cv-no-salary.pdf`.
2. Wait for «מילאנו מקורות החיים…».
3. Close → «יציאה».
**Expected:**
- «ציפיות שכר מ-» and «ציפיות שכר עד» are empty. (source: «מה רצוי» #344b9a «fields the parser could not determine stay empty – nothing is invented»)
- The name is filled from the CV («QA-AUTO» / «Nosalary»).

---

### 2. AI title / summary / strengths for a candidate with minimal data (#d9db64)
**Seed:** `tests/seed.hunter_plus.spec.ts`

Source: rejections rej_1792402358329 and rej_1792403054161 «needed behavior» (#d9db64, §28 AC01); developer note «no experience/expert claims without data, job never presented as the candidate's fit, gender-neutral; post-checks drop such sentences»; evidence `.qa/screenshots/2026-10-21/d9db64-c8/c9/c10-*.png` (11 generations on 21.10, all clean).
AI is NOT deterministic: never assert an exact text. Assert only (a) the field is not empty, (b) none of the forbidden patterns below appears. Wait for the AI result with `expect(locator).not.toHaveValue('')` / `toHaveValue(/.+/)` with a long timeout (up to 60 s) — no fixed pauses.
Forbidden patterns (case-insensitive, after removing the allowed phrases «ניסיון והשכלה לא צוינו», «ניסיון לא צוין», «לא צוין», «לא צוינו»):
- invented level / experience: `מומחה`, `מומחית`, `מקצוען`, `מקצוענית`, `ניסיון` (any remaining occurrence), `שנות ניסיון`, `בעל ניסיון`, `בעלת ניסיון`;
- invented soft skills from the old bug: `צוות`, `ניהול פרויקט`;
- masculine-only address: `המועמד ` / `המועמד,` / `המועמד.` (not followed by «/ת»), `בעל `, `דובר עברית` (without «/ת»);
- the job presented as the candidate's fit (submit dialog only): `מתאים לתפקיד`, `בהתאם למשרה`, `בתל אביב`, `חברת טכנולוגיה`.

#### 2.1 «הוספת מועמד» step 2: AI title and summary use only the entered data, neutral form @desktop @data #d9db64
**Status:** DONE → OUTDATED 28.10 (#daf026: asserts `radio «פרופיל אנונימי»` checked in the add dialog — the radio is gone; phone `050990<4>`) — HEAL · **Case:** `.qa/tests/add-candidate/AC-2-1.md` · **File:** `tests/add-candidate/ai-title-summary-minimal-candidate.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open /my-candidates/new («הוספת מועמד») — no profile-type choice (every candidate is anonymous, #daf026).
2. Fill only: first name «QA-AUTO-d9db64-<ts> מיכל», last name «כהן», phone `uniquePhone()`, «תחום התמחות» = «שיווק, מכירות ופיתוח עסקי». No experience, education, title, summary or CV.
3. «המשך»; wait for the AI title (`#c-ai-title`) and summary (`#c-ai-summary`) to be filled.
4. Read both values; click «סיום».
5. Cleanup (afterAll): delete the candidate if the UI allows; otherwise log it to the test-data journal.
**Expected:**
- Title and summary are not empty and contain none of the forbidden patterns (experience/expert, team/project, masculine-only). (needed behavior: «no "ניסיון", "מומחה", "מקצוען", years or education unless they were entered … gender-neutral wording … never "המועמד בעל…"»)
- Summary mentions the entered area «שיווק, מכירות ופיתוח עסקי» (or its words «שיווק»). (§28 AC01 «יוצר תקציר מקצועי ברור מתוך מידע המועמד»)

#### 2.2 Submit dialog: AI summary and strengths stay clean on 3 regenerations, job not presented as the fit @desktop @data #d9db64
**Status:** DONE (still valid after #daf026 — «פרופיל אנונימי» here is the SUBMISSION dialog; only the phone `050990<4>` → `uniquePhone()` is queued) · **Case:** `.qa/tests/add-candidate/AC-2-2.md` · **File:** `tests/add-candidate/ai-submit-summary-strengths-regenerations.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Create a minimal candidate as in 2.1 (phone `uniquePhone()`, first name «QA-AUTO-d9db64-<ts> נועה», last name «לוי», «תחום התמחות» = «טכנולוגיה, מוצר, דאטה ומערכות מידע») → «סיום».
2. Open /collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584 (J-49 «QA company post test», Tel Aviv, company demo-company-1) → «הגשת <candidate> למשרה».
3. In «האם להגיש פרופיל מלא או אנונימי»: «פרופיל אנונימי» → «אין צורך ב-NDA» → «המשך».
4. Wait until «תקציר המועמד» (1st textarea) and «חוזקות» (2nd textarea) are filled (placeholder no longer «יוצר…»); read both.
5. «חזרה» → «המשך» again; repeat step 4. Do this for 3 generations in total.
6. Close the dialog WITHOUT «סיום והגשה» (nothing is submitted).
7. Cleanup (afterAll): delete the candidate if the UI allows; otherwise log it.
**Expected (every generation):**
- «תקציר המועמד» not empty, no forbidden pattern, and none of the job-fit patterns («מתאים לתפקיד», «בהתאם למשרה», «בתל אביב», «חברת טכנולוגיה»). (needed behavior: «the job's role, company type and city are never written as the candidate's qualities»; «The same rules apply on every regeneration … at least 3 generations»)
- «חוזקות» not empty: either «לא צוין» or a text without forbidden patterns. (needed behavior: «when there is nothing to say, "חוזקות" shows "לא צוין" instead of staying empty»)

---

### 3. Candidate added by a headhunter is always anonymous (#daf026)
**Seed:** `tests/seed.hunter_plus.spec.ts` (3.1–3.3, chain step 1), `tests/seed.company.spec.ts` (chain step 2)

Source: ticket «מה רצוי» #daf026 — «1. Remove the «פרופיל אנונימי / פרופיל גלוי» choice from «הוספת מועמד» (create) and from editing a candidate. 2. Every candidate added by a headhunter is anonymous by default: name and contact details are not shown to other users … 3. Full details are revealed only per submission: when the headhunter submits with «פרופיל מלא» … Done when: «הוספת מועמד» has no profile-type question, and a newly added candidate is shown to others as anonymous.» Brief `.qa/research/daf026.md`; evidence `.qa/screenshots/daf026-*.png` (28.10: add-step1, edit-new, edit-old, lang-en/ru/ar, company-anon, company-full).
Info line (exact he text, step 1 of create and edit): «פרופיל המועמד אנונימי: השם ופרטי הקשר שלו לא יוצגו למשתמשים אחרים באתר. הפרטים המלאים נחשפים רק בהגשה עם «פרופיל מלא» או לאחר אישור בקשת פרופיל מלא.» Translations (assert the beginning, via URL prefix `/en/…`, `/ru/…`, `/ar/…`, NOT the language switcher): en «The candidate's profile is anonymous…», ru «Профиль кандидата анонимный…», ar «الملف الشخصي للمرشح مجهول الهوية…». Patterns: `ANON_INFO` in `tests/add-candidate/helpers.ts`.
Not automated: T5 migration count «85/85» (developer DB claim); other hunter's view of the candidate (no stable entry point); full-profile REQUEST approval flow (covered by specs/pending-requests.md); DEMO-1 (never touch DEMO-*).

#### 3.1 «הוספת מועמד» step 1: info line, no profile-type choice @desktop @prod-safe #daf026
**Status:** READY (generator) · **Case:** `.qa/tests/add-candidate/AC-3-1.md` · **File:** `tests/add-candidate/add-dialog-anonymous-info-no-choice.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open /my-candidates/new → dialog «הוספת מועמד».
2. Read the text under the title (above «תמונת פרופיל»).
3. Close the dialog without filling anything (if «לצאת בלי לשמור?» appears → «יציאה»).
**Expected:**
- Under the title: text starting «פרופיל המועמד אנונימי: השם ופרטי הקשר שלו לא יוצגו למשתמשים אחרים באתר» and containing «פרופיל מלא». (source: «מה רצוי» #daf026 p.1–2; QA 28.10 `daf026-add-step1-desktop.png`)
- The dialog has 0 elements with role `radio`; no text «פרופיל גלוי»; no option «פרופיל אנונימי» (the only «אנונימי» is the info line). (Done when «has no profile-type question»)
- First field after «תמונת פרופיל» is «שם פרטי» (the form starts right after the info line). Nothing is saved.

#### 3.2 «עריכת מועמד»: info line, no profile-type choice, also for an old «גלוי» candidate @desktop @prod-safe #daf026
**Status:** READY (generator) · **Case:** `.qa/tests/add-candidate/AC-3-2.md` · **File:** `tests/add-candidate/edit-dialog-anonymous-info-no-choice.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. /my-candidates?q=7818c8 → open the candidate «QA-AUTO 7818c8 fin …» (created 21.10 as «פרופיל גלוי»; if none — open the first card in «המועמדים שלי» and annotate).
2. Click the edit action → dialog «עריכת מועמד».
3. Read the text under the title; close WITHOUT saving (if «לצאת בלי לשמור?» appears → «יציאה»).
**Expected:**
- Dialog «עריכת מועמד» shows the same info line «פרופיל המועמד אנונימי: …». (source: «מה רצוי» #daf026 p.1 «and from editing a candidate», p.4 old «גלוי» → anonymous; QA 28.10 `daf026-edit-old-desktop.png`)
- 0 `radio` elements; no «פרופיל גלוי» text. Fields «שם פרטי» / «שם משפחה» / «טלפון» keep their values (not cleared).

#### 3.3 Info line in en / ru / ar, no choice @desktop @prod-safe #daf026
**Status:** READY (generator) · **Case:** `.qa/tests/add-candidate/AC-3-3.md` · **File:** `tests/add-candidate/add-dialog-anonymous-info-i18n.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. For each prefix `en`, `ru`, `ar`: open `/<prefix>/my-candidates/new` (language by URL prefix only — do NOT use the switcher, it may persist the account language).
2. Read the text under the dialog title; close («Exit»/equivalent if a confirm appears) — nothing saved.
**Expected:**
- en: starts «The candidate's profile is anonymous» (apostrophe `'` or `’`); ru: starts «Профиль кандидата анонимный»; ar: starts «الملف الشخصي للمرشح مجهول الهوية». (QA 28.10 `daf026-lang-en/ru/ar-desktop.png`)
- In every language: 0 `radio` elements in the dialog; no Hebrew «פרופיל גלוי» / «פרופיל אנונימי» leftovers.

#### 3.4 CHAIN step 1 — hunter creates 2 candidates (no profile choice) and submits one anonymously, one with «פרופיל מלא» to J-49 @desktop @data #daf026
**Status:** WRITTEN by autotest-writer 28.10 (not run; selectors of the submit form from 2.2, «סיום והגשה» + screening answer unverified — heal on first /qa-regress) · **Case:** `.qa/tests/add-candidate/AC-3-4.md` · **File:** `tests/add-candidate/chain-daf026-visibility-1-hunter_plus.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus (claude-test)
**Steps:**
1. `runId = stamp()`. «הוספת מועמד» (no profile choice): first name «QA-AUTO-daf026», last name `A<runId>`, phone `uniquePhone()`, «אימייל» `qa-auto-daf026-a<runId>@example.com`, «תחומי התמחות» «טכנולוגיה, מוצר, דאטה ומערכות מידע» → «המשך» → «סיום».
2. Same for the second candidate: last name `F<runId>`, its own `uniquePhone()`, e-mail `qa-auto-daf026-f<runId>@example.com`.
3. J-49 (/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584) → search `A<runId>` → «הגשת … למשרה» → «פרופיל אנונימי» + «אין צורך ב-NDA» → «המשך» → wait for «תקציר המועמד» → answer «QA test question» with «QA-AUTO daf026 anon <runId>» → «סיום והגשה».
4. Same for `F<runId>` with «פרופיל מלא», answer «QA-AUTO daf026 full <runId>».
5. Write handoff `.qa/e2e/.handoff/daf026-visibility.json` `{ runId, anon:{last,phone,email,answer}, full:{…}, createdAt }`; append both candidates + submissions to `test-data-journal.log` (no delete in UI).
**Expected:**
- Each «סיום» closes the dialog; the candidate appears in «המועמדים שלי» (search by last name — 1 card). (§24 AC04)
- Each «סיום והגשה» closes the submit form without error. (existing flow, «מה רצוי» p.3)

#### 3.5 CHAIN step 2 — company: anonymous submission hides name/phone/e-mail, full-profile submission shows them @desktop @data #daf026
**Status:** WRITTEN by autotest-writer 28.10 (not run; company list selectors unverified — heal on first /qa-regress) · **Case:** `.qa/tests/add-candidate/AC-3-5.md` · **File:** `tests/add-candidate/chain-daf026-visibility-2-company.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company (demo-company-1, owner of J-49)
**Steps:**
1. Read handoff (skip if missing: «run the chain from step 1»).
2. /my-jobs → «QA company post test» → submissions list. Find anonymous rows «מועמד/ת אנונימי/ת»; open them newest-first (max 6) until the dialog contains the answer «QA-AUTO daf026 anon <runId>» (open from the list only — the direct link to an anonymous submission is a known 404).
3. Read the dialog; close.
4. Open the row «QA-AUTO-daf026 F<runId>»; read the page/dialog.
**Expected:**
- Anonymous: list row is «מועמד/ת אנונימי/ת» (no `A<runId>`); dialog has banner «הגשה אנונימית» and the answer, and does NOT contain `A<runId>`, the phone (digits with or without dashes) or the e-mail. (source: «מה רצוי» p.2 «name and contact details are not shown to other users»; §36 AC03–AC04; QA 28.10 `daf026-company-anon-desktop.png`)
- Full profile: page shows «QA-AUTO-daf026 F<runId>», the phone (dashes ignored) and the e-mail. (source: «מה רצוי» p.3 «revealed only per submission … «פרופיל מלא»»; QA 28.10 `daf026-company-full-desktop.png`)
- Run the chain in order, one worker: `npx playwright test tests/add-candidate/chain-daf026-visibility --workers=1 --project=tests`.

---

### Outdated generated files after #daf026 (28.10) — heal with `playwright-test-healer` (change only the profile-type step + phone, keep every other assertion)
- `tests/add-candidate/helpers.ts` — `fillStep1({visible:true})` clicks «פרופיל גלוי» and asserts the radio → remove the `visible` branch (option becomes a no-op). `uniquePhone()` and `ANON_INFO` ADDED 28.10.
- `tests/add-candidate/close-step2-confirm-not-saved.spec.ts` — `visible: true`, phone `0500000098` → drop `visible`, `uniquePhone()`.
- `tests/add-candidate/finish-creates-candidate-once.spec.ts` — same as above (via `fillStep1`/fixed phone).
- `tests/add-candidate/ai-title-summary-minimal-candidate.spec.ts` — line 25 `expect(radio «פרופיל אנונימי»).toBeChecked()` → replace with `expect(dialog.getByText(ANON_INFO.he)).toBeVisible()`; phone → `uniquePhone()`.
- `tests/add-candidate/ai-submit-summary-strengths-regenerations.spec.ts` — profile radio is the SUBMISSION dialog (valid); only phone → `uniquePhone()`.
- NOT affected: `tests/talent-onboarding/edit-profile-visibility-radios.spec.ts` (talent's own profile, other feature); `cv-parsing-fills-salary.spec.ts`, `cv-without-salary-fields-empty.spec.ts` (no profile step).
Other READY plans (not generated yet) whose «הוספת מועמד» step still chooses the profile type — drop that choice before generation (the submission dialog choice stays):
- specs/copywriting.md 5.1, 5.2b, 5.13 (step «פרופיל גלוי» → remove); 5.3b (step «פרופיל אנונימי» on create → remove); 5.2 (anonymous title/summary validation — re-check on staging that it still applies, every candidate is anonymous now); 5.2c and 5.12 OBSOLETE (open-profile hint / option texts no longer exist) → mark not to generate.
- specs/submit-candidate.md 1.1 #7178a2 («פרופיל גלוי» on create).
- specs/candidacy-status.md 3.1 #abe526 («פרופיל גלוי» on create), 4.1 #e9ce1c («anonymous profile» on create).
- specs/candidacy-timeline.md 2.1 #cea191, specs/pending-requests.md 1.2 #0f3888, specs/candidacy-submission.md 1.3 #501d04 («anonymous profile» on create).
