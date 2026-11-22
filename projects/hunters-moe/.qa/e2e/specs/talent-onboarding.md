<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Talent onboarding and Edit Profile (2026-10-21)

STATUS (§5 #a904f9 added 28.10 — see §5; 1.1 and 2.1 rewritten for #a904f9) · (§4 #1866ba added 22.10 — see §4) · §1 **MANUAL** (needs a brand-new talent account — not automated) · §2 **READY** for `playwright-test-generator`.
Tickets passed QA 21.10.2026 (user moved to «הושלם»): #1866b9 «Onboarding מועמד — שלב 4: העלאת CV» (§3), #1866b6 «Onboarding מועמד — שלב 1: בחירת סוג פרופיל (אנונימי / פתוח)», #2443cb «Success message after Talent registration is displayed in English», #ca2463 «Data entered during Talent registration is missing in Edit Profile». Verified on fresh account tacivoh962 (talent).
Cases: `.qa/tests/talent-onboarding/TO-*.md`.
Rules: saved sessions only (seed per role); read-only — never click «שמירה»/save, never change a radio or a chip; no fixed waits / networkidle — wait for results via expect(); do not run — only /qa-regress runs tests. Do NOT use hunter_plus or company sessions for this plan.

---

### 1. Talent onboarding — new account (MANUAL, not for the generator)
**Seed:** — (needs a fresh, just-registered talent; account creation is not automated)

Kept as a manual regression checklist. Do not generate: every step needs a brand-new talent who has not finished onboarding. If the project later gets a reusable "onboarding-not-finished" talent session, these can become tests with seed `tests/seed.<that-role>.spec.ts`.

#### 1.1 Onboarding starts at details: no profile-type step, 5 steps, anonymous notice @desktop #a904f9 — MANUAL
**Device:** desktop · **Users:** new talent (manual precondition) · **Case:** `.qa/tests/talent-onboarding/TO-1-1.md`
OUTDATED 28.10 and replaced: the old 1.1 «Step 1 shows anonymous / public choice #1866b6» («שלב 1 מתוך 6», /onboarding/visibility) — removed by #a904f9 (client decision 25.10).
**Steps:**
1. Open /onboarding; choose טאלנטים / קריירה.
2. Go through /onboarding/talent-details → /onboarding/cv → /onboarding/experience → /onboarding/summary → /onboarding/terms → /onboarding/pending.
**Expected:**
- First step after the role choice is /onboarding/talent-details with «שלב 1 מתוך 5»; no anonymous/public question. (#a904f9 מה רצוי п.1)
- Text on the details step: «הפרופיל שלכם אנונימי: השם, פרטי הקשר וקורות החיים שלכם לא יוצגו למשתמשים אחרים באתר. ניתן לעבור לפרופיל גלוי בכל עת ב«עריכת פרופיל».» (п.2–3)
- cv 2/5, experience 3/5, summary 4/5, terms 5/5; no «מתוך 6». (п.4)

#### 1.2 Success page after the last step (5 of 5) is Hebrew and RTL @desktop #2443cb — MANUAL
**Device:** desktop · **Users:** new talent (manual precondition) · **Case:** `.qa/tests/talent-onboarding/TO-1-2.md`
**Steps:**
1. Finish step 5 /onboarding/terms «שלב 5 מתוך 5» (site in Hebrew; was step 6 before #a904f9).
2. Land on /onboarding/pending.
**Expected:**
- `html[lang="he"][dir="rtl"]`.
- Heading «איזה כיף! הפרופיל שלכם נוצר בהצלחה»; button «לעמוד הבית».
- Plans popup (FREE / PRO) opens over the page with the same heading.
- No English title, description or button.
- (source: ticket Expected Result «…displayed in Hebrew and follow the RTL layout»)

#### 1.3 Onboarding values reach Edit Profile @desktop #ca2463 — MANUAL
**Device:** desktop · **Users:** new talent (manual precondition) · **Case:** `.qa/tests/talent-onboarding/TO-1-3.md`
**Steps:**
1. At /onboarding/talent-details pick values in תחומי התמחות, תפקידים רצויים, שפות; note them.
2. Finish onboarding; open /profile?edit=details, tab «פרטים אישיים».
**Expected:**
- The noted values appear as chips in the three fields; hidden inputs `expertise`, `desired_roles`, `languages` hold them.
- (source: ticket Expected Result «all previously selected values should be displayed in the corresponding fields and available for editing»)

---

### 2. Talent Edit Profile — saved onboarding data (existing talent, read-only)
**Seed:** `tests/seed.talent.spec.ts`

Precondition: the `talent` account (.qa/auth/talent.json) finished onboarding and has values in תחומי התמחות, תפקידים רצויים, שפות. If the generator finds these fields empty on this account — stop and report (do not fill them in, do not save).

#### 2.1 Edit Profile has the anonymous / public profile radios with explanations @desktop @prod-safe #1866b6 #a904f9
**Device:** desktop · **Users:** talent · **Case:** `.qa/tests/talent-onboarding/TO-2-1.md`
UPDATED 28.10 (#a904f9): the choice is no longer made in onboarding — the radios are now the ONLY place to change the profile type; route /profile?edit=personal; explanations required. Existing file `tests/talent-onboarding/edit-profile-visibility-radios.spec.ts` (#1866b6) — regenerate it from this item (test name changed) and delete the old file.
**Steps:**
1. Open /profile?edit=personal (talent session).
2. If the tab «פרטים אישיים» is not active — click it.
3. Find the radio group `profile-visibility` (anonymous / public).
**Expected:**
- Two radios: «פרופיל אנונימי» (value anonymous) and «פרופיל גלוי» (value public); exactly one checked; for demo-talent-1 — public (existing talents kept their choice). (#a904f9 п.3; developer note «existing talents keep their choice»)
- Each option has its own privacy explanation text next to it (assert both explanation texts as found live; non-empty). (#a904f9 п.3; §36 AC05)
- Do not click a radio and do not save.

#### 2.2 Edit Profile shows saved expertise, desired roles and languages @desktop @prod-safe #ca2463
**Device:** desktop · **Users:** talent · **Case:** `.qa/tests/talent-onboarding/TO-2-2.md`
**Steps:**
1. Open /profile?edit=details (talent session), tab «פרטים אישיים».
2. Read the values of hidden inputs `input[name="expertise"]`, `input[name="desired_roles"]`, `input[name="languages"]`.
3. Read the chips shown under תחומי התמחות, תפקידים רצויים, שפות.
**Expected:**
- All three hidden inputs exist and are not empty.
- Each of the three fields shows at least one chip.
- Every value from a hidden input is shown as a chip in its field (check by visible chip text).
- Do not remove/add chips and do not save.
- (source: #ca2463 Expected Result «all previously selected values should be displayed in the corresponding fields and available for editing»)

---

### 3. Talent CV upload — #1866b9 «Onboarding מועמד — שלב 4: העלאת CV» (added 21.10)
Cases: `.qa/tests/talent-onboarding/TO-3-*.md`. Fixtures: `fixtures/qa-auto-cv-salary-range.pdf`, `fixtures/qa-auto-cv-no-salary.pdf`.
Not automated: onboarding upload itself (needs a brand-new talent) — MANUAL 3.1–3.2. Read-only everywhere: never upload a file into the shared talent account, never click «המשך»/save.

#### 3.1 Onboarding CV step rejects a non-PDF file @desktop #1866b9 — MANUAL
**Device:** desktop · **Users:** new talent (manual precondition) · **Case:** `TO-3-1.md`
**Steps:** 1. Reach /onboarding/cv («שלב 2 מתוך 5» since #a904f9; was «שלב 3 מתוך 6»). 2. Upload a .txt file.
**Expected:**
- file input accept="application/pdf";
- toast «הקובץ אינו PDF תקין. יש להעלות קובץ PDF»; input stays empty.
- (source: AC «מוצגת הודעת שגיאה ברורה על סוג קובץ לא נתמך»)

#### 3.2 PDF upload starts AI parsing and prefills experience @desktop #1866b9 — MANUAL
**Device:** desktop · **Users:** new talent (manual precondition) · **Case:** `TO-3-2.md`
**Steps:** 1. Upload `fixtures/qa-auto-cv-salary-range.pdf`. 2. Click «המשך».
**Expected:**
- file name + «בלחיצה על המשך, ה-AI שלנו יקרא את קורות החיים...» are shown;
- /onboarding/experience is prefilled (experience, education, headline) from the CV.
- (source: AC «ניתן להעלות קובץ CV», «העלאה מפעילה אוטומטית את ניתוח ה-AI»)

#### 3.3 Talent's CV link is a signed storage URL @desktop @prod-safe #1866b9 — BLOCKED
**Device:** desktop · **Users:** talent · **Seed:** `tests/seed.talent.spec.ts` · **Case:** `TO-3-3.md`
BLOCKED 21.10: the shared `talent` account (demo-talent-1, U-13) has no CV — /profile has no «קו״ח» link, tab «מסמכים» shows «הוספת קובץ». Uploading a CV into the shared account = data change → needs the user's decision (or a second talent session with a CV). Do not generate until then; do not use test.skip.
**Steps:** 1. Open /profile. 2. Find link «קו״ח». 3. Open /profile?edit=details, tab «מסמכים».
**Expected:**
- «קו״ח» href contains `/storage/v1/object/sign/documents/` and `token=`;
- tab «מסמכים» shows the CV file name under «קובץ קו״ח».
- (source: AC «הקובץ נשמר במערכת המסמכים ומשוייך לפרופיל», «מאוחסן באופן מאובטח»)

#### 3.4 Edit Profile «מסמכים» tab: CV accepts PDF only @desktop @prod-safe #1866b9 — READY (generator)
**Device:** desktop · **Users:** talent · **Seed:** `tests/seed.talent.spec.ts` · **Case:** `TO-3-4.md`
**Steps:**
1. Open /profile?edit=details (talent session).
2. In dialog «עריכת פרופיל» click tab «מסמכים».
**Expected:**
- tab «מסמכים» has aria-selected="true";
- dialog shows text «קובץ קו״ח» and either «הוספת קובץ» (no CV) or a file name (CV exists);
- `input[type=file]` in the dialog has accept="application/pdf".
- Do not upload, do not click «המשך».
- (source: AC «ניתן להעלות קובץ CV» + PDF-only error; checked read-only 21.10)

#### 3.5 CV bucket has no public URL @desktop @prod-safe #1866b9 — WRITTEN (API, by autotest-writer)
**Device:** desktop (API only, one run) · **Users:** none · **File:** `tests/talent-onboarding/cv-bucket-not-public.spec.ts` · **Case:** `TO-3-5.md`
**Steps:** GET `<supabase>/storage/v1/object/public/documents/<probe>` and `/object/sign/documents/<probe>` (no token) without auth; Supabase ref from cookie `sb-<ref>-auth-token` in auth/talent.json.
**Expected:** both not 200; public one answers «Bucket not found». (source: AC §21)

#### 3.6 Headhunter sees no CV / name of an anonymous talent @desktop @prod-safe #1866b9 — READY (generator, not verified by autotest-writer)
**Device:** desktop · **Users:** hunter_plus · **Seed:** `tests/seed.hunter_plus.spec.ts` · **Case:** `TO-3-6.md`
**Steps:** 1. Open /talents-bank. 2. Find a card with «פרטים חסויים». 3. Open its profile.
**Expected:**
- card shows «פרטים חסויים»;
- profile page has no link with text «קו״ח» and no `a[href*="/storage/v1/object/"]`.
- Read-only: do not send offers/messages.
- (source: AC «ה-CV המלא אינו נחשף ללא הרשאה»)

#### 3.7 Company gets 404 on a talent profile @desktop @prod-safe #1866b9 — MULTI-ROLE (autotest-writer, pending)
**Device:** desktop · **Users:** hunter_plus, company (`asUser`) · **Case:** `TO-3-7.md`
**Steps:** 1. hunter_plus: /talents-bank → take the id of a talent card (/profile/<id>). 2. company: open /profile/<id>.
**Expected:** company sees «אופס, הדף לא נמצא»; no `a[href*="/storage/v1/object/"]` on the page. (source: AC §21)
Pending: hunter_plus/company sessions were busy 21.10 — write with live selector check later.

---

### 4. CV parsing fills the profile — #1866ba «Onboarding מועמד — שלב 4ב: פענוח CV ומילוי אוטומטי של 7 שדות» (added 2026-10-22)
STATUS: §4.1 **MANUAL / opt-in** (needs a brand-new talent — onboarding runs once per account) · §4.2–4.4 **READY** for `playwright-test-generator` (read-only). #1866ba passed QA 22.10 (rejection resolved), user moved it to «הושלם» 2026-10-22.
Sources: session.json 22.10 (#1866ba «new talent U-48: CV adds English, technology, desired role מפתח/ת אוטומציה (QA), editable; AI summary mentions English; experience/title/education extracted; salary empty; hunter sees level מיד-לבל + summary + languages»), brief `.qa/research/1866ba.md` (AC: experience, roles, expertise, level, languages, education, summary; name; salary only if in CV; every field editable; not found → empty, no guessing; level feeds the step-5 AI summary. Reject 1 «needed»: after the CV upload languages, expertise and desired positions are ADDED from the CV and stay editable), screenshots `.qa/screenshots/1866ba-*.png`. No case files — checks taken from session.json + screenshots.
Data: `talent_new` = U-48 (registered by the user 22.10 for this ticket, onboarding finished with `fixtures/qa-auto-cv-no-salary.pdf`-style CV: «QA Automation Engineer at QA-AUTO Labs Ltd. (2021 – now)», «B.Sc. Computer Science», «Languages: Hebrew, English», tech/QA, no salary; step 2 had only «משאבי אנוש וגיוס» + עברית). Session `auth/talent_new.json` — manual login only (`npm run qa-login:manual -- talent_new`); seed `tests/seed.talent_new.spec.ts` (created 22.10). Public profile id `2bd7411d-1521-4e05-9abb-ae6e4c5c3e53`.
Rules: read-only everywhere — never click «שמירה», never remove/add a chip, never change a radio, never upload; hunter_plus never clicks «ייצוג הטאלנט הזה» / «שליחת הודעה». Do not assert the account's e-mail / phone values (personal data) — only their absence on the anonymous view. No @prod-safe: U-48 exists on staging only.
If U-48 values were changed by hand later (chips differ) — stop and report, do not "fix" the account.

#### 4.1 CV parsing adds languages, expertise and desired role from the CV; nothing guessed @desktop #1866ba — MANUAL / opt-in
**Device:** desktop · **Users:** brand-new talent (manual precondition — account creation is not automated)
Not for the generator. Becomes an opt-in test only if the project gets a fresh "onboarding-not-finished" talent session (then: autotest-writer, file `tests/talent-onboarding/zz-cv-parse-new-talent.spec.ts`, `test.skip(process.env.QA_NEW_TALENT !== '1', 'needs a fresh talent that has not finished onboarding')`).
**Steps:**
1. New talent → /onboarding → step 2 /onboarding/talent-details: only required fields — תחומי התמחות «משאבי אנוש וגיוס», שפות «עברית»; תפקידים רצויים empty.
2. Step /onboarding/cv: upload `fixtures/qa-auto-cv-no-salary.pdf` (Hebrew + English, QA / technology, no salary) → «המשך».
3. Experience step: read the prefilled values → continue; AI summary step: read the summary.
4. Finish; open /profile?edit=details — tabs «פרטים אישיים» and «ניסיון מקצועי».
**Expected:**
- Step 3: «כותרת התפקיד» «QA Automation Engineer»; experience «QA Automation Engineer» / «QA-AUTO Labs Ltd.» from 2021 to «היום»; education «B.Sc. Computer Science». (AC «ניסיון תעסוקתי • תפקידים • השכלה»)
- AI summary mentions English («אנגלית»), not only Hebrew. (reject 1; AC «רמת הניסיון שזוהתה מזינה את שלב 5»)
- Step 4: תחומי התמחות = «משאבי אנוש וגיוס» + «טכנולוגיה, מוצר, דאטה ומערכות מידע»; תפקידים רצויים contains «מפתח/ת אוטומציה (QA)»; שפות = «עברית» + «אנגלית» — step-2 values kept, CV values added; every chip removable (editable). Salary from/to empty (no salary in the CV — no guessing). (reject 1 «needed»; AC «שדה שלא זוהה נשאר ריק»)

#### 4.2 Edit Profile «פרטים אישיים» keeps the CV-filled expertise, desired role and languages; salary empty @desktop #1866ba
**Status:** READY (generator) · **File:** `tests/talent-onboarding/cv-filled-details-saved.spec.ts`
**Seed:** `tests/seed.talent_new.spec.ts` · **Device:** desktop · **Users:** talent_new (U-48)
**Steps:**
1. Open /profile?edit=details → dialog «עריכת פרופיל»; tab «פרטים אישיים» (click it if not active).
2. Read the chips of «תחומי התמחות», «תפקידים רצויים», «שפות» (and hidden inputs `expertise`, `desired_roles`, `languages`).
3. Read «ציפיות שכר מ- (₪)» and «ציפיות שכר עד (₪)».
4. Close the dialog without saving.
**Expected:**
- «תחומי התמחות» chips: «משאבי אנוש וגיוס» and «טכנולוגיה, מוצר, דאטה ומערכות מידע». (reject 1 «needed» expertise added from the CV; screenshot 1866ba-edit-profile-details)
- «תפקידים רצויים» chip: «מפתח/ת אוטומציה (QA)». (reject 1 «needed» desired position from the CV)
- «שפות» chips: «עברית» and «אנגלית». (reject 1 «needed» English from the CV)
- Each of these chips has its remove «×» control (editable — do NOT click it). (AC «המועמד יכול לערוך כל שדה שמולא אוטומטית»)
- Both salary inputs are empty. (AC «שדה שלא זוהה נשאר ריק ולא ממולא בניחוש»; CV has no salary)

#### 4.3 Edit Profile «ניסיון מקצועי» keeps the CV-extracted title, experience and education @desktop #1866ba
**Status:** READY (generator) · **File:** `tests/talent-onboarding/cv-filled-experience-saved.spec.ts`
**Seed:** `tests/seed.talent_new.spec.ts` · **Device:** desktop · **Users:** talent_new (U-48)
**Steps:**
1. Open /profile?edit=details → tab «ניסיון מקצועי».
2. Read «כותרת התפקיד», «ניסיון תעסוקתי», «השכלה».
3. Close without saving.
**Expected:**
- «כותרת התפקיד» value «QA Automation Engineer». (AC «תפקידים»)
- «ניסיון תעסוקתי» row: «QA Automation Engineer», «QA-AUTO Labs Ltd.», period from 2021 to «היום»; it has an edit (pencil) control. (AC «ניסיון תעסוקתי», editable)
- «השכלה» row: «QA-AUTO University», «B.Sc. Computer Science». (AC «השכלה»; screenshot 1866ba-edit-profile-experience)

#### 4.4 Headhunter sees the CV-derived level, languages and role on the anonymous talent profile @desktop #1866ba
**Status:** READY (generator) · **File:** `tests/talent-onboarding/hunter-sees-cv-level-languages.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. Open /profile/2bd7411d-1521-4e05-9abb-ae6e4c5c3e53.
2. Read the header card.
**Expected:**
- Code «U-48»; badge «פרופיל אנונימי».
- «רמת ניסיון:» followed by text starting «מיד-לבל» (the line may be truncated — prefix match). (AC «רמת ניסיון»; screenshot 1866ba-hunter-view-level)
- «שפות:» «עברית, אנגלית». (reject 1 — English from the CV)
- «תפקידים כלליים:» «מפתח/ת אוטומציה (QA)»; expertise chips «משאבי אנוש וגיוס», «טכנולוגיה, מוצר, דאטה ומערכות מידע».
- The summary paragraph mentions «אנגלית». (AC «תקציר מקצועי»; session 22.10 «AI summary mentions English»)
- Anonymous profile: no talent name («מאיה» / «QA-AUTO 1866ba»), no e-mail (`/\S+@\S+\.\S+/`) and no Israeli phone (`/05\d-?\d{3}-?\d{4}/`) in the card. (profile type «פרופיל אנונימי»)
- Do not click «ייצוג הטאלנט הזה» / «שליחת הודעה».

---

### 5. Talent profile type after onboarding — #a904f9 «Talent registration – remove the «פרופיל אנונימי / פרופיל גלוי» step, every talent starts anonymous (changeable in the profile)» (added 2026-10-28)
STATUS: §5.1 **MANUAL** (new talent) · §5.2 **READY** for `playwright-test-generator` (read-only) · §5.3 **WRITTEN** by autotest-writer (two roles — asUser), not run.
#a904f9 passed QA 28.10 (user confirmed «עבר QA»). Sources: brief `.qa/research/a904f9.md`, screenshots `.qa/screenshots/a904f9-*.png`, agreed rule `.qa/context.md` 2026-10-28 (anonymous → name and all hidden personal data invisible everywhere incl. CV / AI summary / card; public → shown incl. CV; switching back hides again).
Cases: `TO-1-1` (rewritten), `TO-2-1` (updated), `TO-5-1`, `TO-5-2`.
Data: demo-talent-1 = account `talent` (U-13, profile id `8a5a5e39-8633-469a-9589-32ece69f54c9`), original type PUBLIC — must end public. New talent U-50 (af9b38c2-6897-43d3-8cb2-340fbf43312c) has no saved session → manual only.
Not automated: registration/onboarding of a new talent (account creation).

#### 5.1 New talent is anonymous by default; hunter sees no personal data @desktop #a904f9 — MANUAL
**Device:** desktop · **Users:** new talent + hunter_free (manual) · **Case:** `TO-5-1.md`
**Steps:** 1. New talent (after TO-1-1): /profile?edit=personal → «פרטים אישיים». 2. hunter_free: /profile/<new talent id>.
**Expected:**
- «פרופיל אנונימי» checked by default. (מה רצוי п.2)
- Hunter: headline as title (e.g. «מפתח Backend…»), badge «פרופיל אנונימי»; no name, phone, e-mail, employers, CV link; AI summary without the name. (מה רצוי п.2; context.md 2026-10-28)

#### 5.2 Profile-type radios are translated in en / ru / ar @desktop @data #a904f9 — READY (generator)
**Seed:** `tests/seed.talent.spec.ts` · **Device:** desktop · **Users:** talent · **Case:** `TO-2-1.md` step 4
**File:** `tests/talent-onboarding/profile-type-radios-translated.spec.ts`
No @prod-safe; @data: switching the site language may be stored on the shared talent account (other talent tests must not see English). At the end always switch back to עברית.
**Steps:**
1. Open /profile?edit=personal (talent session); tab «פרטים אישיים»; read the labels and explanations of the two `profile-visibility` radios (Hebrew baseline).
2. Close the dialog without saving; switch the site language via the header language selector («עברית») to English; open /profile?edit=personal again, tab «פרטים אישיים» in English.
3. Repeat step 2 for Русский and العربية.
4. Switch the language back to עברית; check «פרופיל אנונימי» is shown again.
**Expected:**
- Hebrew: «פרופיל אנונימי», «פרופיל גלוי», each with an explanation.
- en / ru / ar: `html[lang]` = en / ru / ar, `dir` = ltr / ltr / rtl; still exactly 2 radios, 1 checked (public for demo-talent-1); both labels and both explanations are non-empty and contain no Hebrew letters (`/[\u0590-\u05FF]/`). Assert the exact translated strings as found live. (#a904f9 п.4 «texts in he/en/ru/ar»)
- Never click a radio, never save. Final language — Hebrew.

#### 5.3 Talent switches anonymous → public: hunter sees personal data hidden / shown @desktop @data #a904f9 — WRITTEN (autotest-writer, multi-role)
**Device:** desktop · **Users:** talent, hunter_free (`asUser`) · **Case:** `TO-5-2.md`
**File:** `tests/talent-onboarding/profile-type-switch-hunter-view.spec.ts` (written by hand — two roles; not run; selectors for «שמירה» and the language-free parts to be confirmed on the first /qa-regress)
**Steps:**
1. talent: /profile?edit=personal → «פרטים אישיים»; precondition public checked (otherwise stop — do not change the account).
2. talent: check «פרופיל אנונימי» → warning «שימו לב!… לא ייחשפו לפני האישור שלכם» → «שמירה»; reopen → anonymous checked.
3. hunter_free: /profile/8a5a5e39-8633-469a-9589-32ece69f54c9.
4. talent: check «פרופיל גלוי» → «שמירה»; reopen → public checked.
5. hunter_free: reload the profile.
6. Cleanup (always, in finally): if not public — set public and save.
**Expected:**
- Step 3: «פרופיל אנונימי» badge; no «משה כהן», no «@moshecohen», no e-mail, no Israeli phone, no employers «Monday» / «Deploy», no «קו״ח» link / `a[href*="/storage/v1/object/"]`. (מה רצוי п.2–3; context.md 2026-10-28)
- Step 5: «משה כהן», e-mail, phone, employers shown; no «פרופיל אנונימי» badge. (מה רצוי п.3; context.md «public → shown incl. CV»; CV link not asserted — demo-talent-1 has no CV)
- End state: demo-talent-1 public.

