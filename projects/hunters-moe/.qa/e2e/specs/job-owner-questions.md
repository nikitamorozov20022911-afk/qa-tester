<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Questions to the job owner before submitting: talent and headhunter (anonymous), answers, follow-ups, limit of 3 unanswered (2026-10-28)

STATUS: READY — #e0e6cc passed QA, user confirmed («עבר QA») 2026-10-28. Not generated yet. Environment: staging (https://hunters-sooty.vercel.app). §1 → `playwright-test-generator`; §2 (cross-role CHAIN, handoff code) → written by autotest-writer, not by the generator.
Sources: ticket «מה רצוי» / Done when (brief `.qa/research/e0e6cc.md`): (1) «שאלה למנהל/ת המשרה» on the job drawer and in the submit flow, before submitting; (2) talent or headhunter for a candidate — anonymous, the owner does not see which candidate; (4) more questions after answers, thread with dates kept for both sides; (5) answers visible only to the asker and the owner, bell for new questions / answers, he/en/ru/ar. Developer note 27.10: «one thread per asker per job … max 3 unanswered at a time … Not on tenders». Client decision 25.10 replaces §47 AC01/AC02/AC04 (context.md). QA 28.10: screenshots `.qa/screenshots/e0e6cc-*.png`, session.json.
Manual cases: `.qa/tests/job-owner-questions/JQ-*.md`. Related plan (NOT duplicated here): `specs/work-representation-questions.md` (#246105 — post-NDA-refusal flow on application 45967f8d of talent_2, form closes after send, double click, the limit message for talent_2).

**Data / job:** J-49 «QA company post test» `/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584`, owner demo-company-1 (company, display name «סופר פארם»). DEMO-1 is NOT used (demo data, context.md 28.10).
**Rules (whole file):** desktop 1440×900 only (`@desktop`; the ticket scenario is desktop, no adaptive requirement). Saved sessions via seed, no passwords; no fixed waits / `networkidle`. A sent question (headhunter's especially) can appear in the thread ~10–19 s after the POST 200 (QA 28.10) — wait with `expect(...).toBeVisible({ timeout: 30_000 })` / `expect.poll`, never a pause. Do NOT click any submit button («הגשה», «פרופיל אנונימי/מלא» → send), do NOT sign NDA, no payments. Questions and answers cannot be deleted in the UI → each sent text is appended to `.qa/e2e/test-data-journal.log`. Texts: `QA-AUTO jq <runId> …`.
**Do not use talent_2 (demo-talent-2) here:** its J-49 thread (post-NDA, app 45967f8d) is the WR chain's data and sits at the 3-unanswered limit by design.
Not automated: the 3-limit on the server (POST replay); bell notifications in en/ru/ar (texts not recorded in QA); the owner = headhunter variant (no headhunter-owned QA job); a submission after the answers (creates a real application each run).

---

### 1. Job owner questions — entry points and texts (read-only)
**Seed:** `tests/seed.hunter_free.spec.ts` (1.1, 1.2, 1.5), `tests/seed.talent.spec.ts` (1.3), `tests/seed.hunter_plus.spec.ts` (1.4)

#### 1.1 Job drawer has «שאלה למנהל/ת המשרה»; the dialog shows the empty thread, field, counter and limit hint @desktop @prod-safe #e0e6cc
**Status:** READY · **Case:** `.qa/tests/job-owner-questions/JQ-1-1.md` · **File:** `tests/job-owner-questions/drawer-entry-and-dialog-texts.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free (has never asked on J-49)
**Steps:**
1. Open `/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584` → drawer «פרטי המשרה» with heading «QA company post test».
2. Read the hint near the question button; click «שאלה למנהל/ת המשרה».
3. In the dialog «שאלות למנהל/ת המשרה» type «QA» into the field (do NOT send); then clear it and close with «סגירה».
**Expected:**
- Drawer shows the hint starting with «יש לכם שאלה על המשרה? אפשר לשאול את מנהל/ת המשרה לפני שמגישים מועמדות» and the button «שאלה למנהל/ת המשרה». (source: «מה רצוי» 1 «on the job page (job details drawer) … before submitting»)
- Dialog heading «שאלות למנהל/ת המשרה», job name «QA company post test», box «רק אתם ומנהל/ת המשרה רואים את השאלות והתשובות». (source: «מה רצוי» 5 «answers visible only to the asker (and the owner)»)
- Text «עוד לא שאלתם שאלות על המשרה.»; field with placeholder «השאלה שלכם»; counter «0/1,000» → after typing «QA» «2/1,000»; hint «עד 3 שאלות שממתינות לתשובה בכל פעם.»; buttons «שליחת השאלה» and «סגירה». (QA 28.10 `e0e6cc-talent-form-desktop.png`; limit — developer note «max 3 unanswered at a time»)
- After «סגירה» the dialog is hidden; nothing was sent (no «נשאלה ב-» in a reopened dialog).

#### 1.2 Another headhunter does not see other askers' questions or answers @desktop @prod-safe #e0e6cc
**Status:** READY · **Case:** `.qa/tests/job-owner-questions/JQ-1-2.md` · **File:** `tests/job-owner-questions/other-hunter-sees-no-foreign-questions.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free
**Steps:**
1. Open J-49 drawer → «שאלה למנהל/ת המשרה» → dialog.
**Expected:**
- «עוד לא שאלתם שאלות על המשרה.» is shown; the dialog contains no text matching `/QA-AUTO (2810 e0e6cc|jq )/` (questions of demo-talent-1 / claude-test exist on J-49) and no «נענתה ב-» / «נשאלה ב-». (source: «מה רצוי» 5 «Answers are visible only to the asker (and the owner)»; QA 28.10 `e0e6cc-other-hunter-empty-desktop.png`)

#### 1.3 The submit dialog «הגשת מועמדות» has «שאלה למנהל/ת המשרה» and it opens the questions dialog @desktop @prod-safe #e0e6cc
**Status:** NEEDS-JOB · **Case:** `.qa/tests/job-owner-questions/JQ-1-3.md` · **File:** `tests/job-owner-questions/submit-dialog-question-link.spec.ts`
**Seed:** `tests/seed.talent.spec.ts`
**Device:** desktop
**Users:** talent (demo-talent-1)
Data: demo-talent-1 ALREADY applied to J-49 (28.10, full profile) — J-49 cannot be used. At generation pick an active job of demo-company-1 (not DEMO-1) where demo-talent-1 has no application, write its id here, and keep it in the test as a constant. If none exists → leave BLOCKED and ask the user.
**Steps:**
1. Open the chosen job's drawer → the talent's submit button → dialog «הגשת מועמדות».
2. Click «שאלה למנהל/ת המשרה» at the top of the dialog.
3. Close the questions dialog («סגירה») and close «הגשת מועמדות» (X / Esc) — do NOT submit.
**Expected:**
- «הגשת מועמדות» shows the link «שאלה למנהל/ת המשרה» above «להגיש עם פרופיל מלא או באופן אנונימי?». (source: «מה רצוי» 1 «and in the submit flow»; QA 28.10 `e0e6cc-submit-flow-button-desktop.png`)
- Step 2 opens the dialog «שאלות למנהל/ת המשרה» with the field «השאלה שלכם». No application is created.

#### 1.4 Tenders have no «שאלה למנהל/ת המשרה» @desktop @prod-safe #e0e6cc
**Status:** READY · **Case:** `.qa/tests/job-owner-questions/JQ-1-4.md` · **File:** `tests/job-owner-questions/tender-has-no-question-button.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus (claude-test)
**Steps:**
1. Open `/tenders` → open the first tender card (drawer/page with the tender details).
**Expected:**
- No button/link «שאלה למנהל/ת המשרה» and no hint «יש לכם שאלה על המשרה?» anywhere on the tender view. (source: developer note 27.10 «Not on tenders»; QA 28.10 `e0e6cc-tender-no-question-desktop.png`)

#### 1.5 en / ru / ar: the question button and dialog are translated @desktop @prod-safe #e0e6cc
**Status:** READY · **Case:** `.qa/tests/job-owner-questions/JQ-1-5.md` · **File:** `tests/job-owner-questions/question-button-i18n.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free
Locale ONLY via URL prefix (`/en`, `/ru`, `/ar`) — never the language switcher (it saves the user's setting).
**Steps:**
1. Open `/en/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584` → click «Ask the job manager».
2. Open `/ru/collaborations/7e4ad713-…`; open `/ar/collaborations/7e4ad713-…`.
**Expected:**
- en: button «Ask the job manager»; dialog heading «Questions to the job manager»; the dialog has no Hebrew text «שאלות למנהל/ת המשרה».
- ru: button «Вопрос менеджеру вакансии»; ar: button «سؤال لمدير الوظيفة»; neither page shows «שאלה למנהל/ת המשרה». (source: «מה רצוי» 5 «in he/en/ru/ar»; QA 28.10)

---

### 2. Job owner questions — CHAIN talent + headhunter → owner answers → askers see answers, ask again, limit (company / talent / hunter_plus)
**multi-role chain — пишет autotest-writer** (one role per file, handoff, like `tests/add-candidate/chain-daf026-visibility-*`)
**Seed:** `tests/seed.company.spec.ts` (2.1, 2.4), `tests/seed.talent.spec.ts` (2.2, 2.5), `tests/seed.hunter_plus.spec.ts` (2.3, 2.6)
**Chain rules:** files `tests/job-owner-questions/chain-jq-<N>-<role>.spec.ts`; `test.use({ storageState: '../../../auth/<role>.json' })`; handoff `.qa/e2e/.handoff/jq.json` = `{ runId, createdAt, talentQ, hhQ, talentAnswer, hhAnswer, threadUrl? }` written by 2.1, extended by 2.2–2.4; steps 2.2–2.6 `test.skip(!handoff, 'run the chain from step 1')`. Run in order, one worker: `npx playwright test tests/job-owner-questions/chain-jq- --project=tests --workers=1`. All `@data`.
**Accumulating data / limit:** each run adds 2 + 1 (talent follow-up) + 3 (headhunter limit) = 6 questions and 2 answers on J-49 — journal each. Every run ends with demo-talent-1 at 1 unanswered and claude-test at 3 unanswered (limit) → step 2.1 of the next run MUST answer all pending questions of both first, otherwise 2.3 cannot send. If 2.1 cannot answer in the UI → the whole chain is BLOCKED (do not weaken 2.3 / 2.6).
**Owner's entry to the questions dialog:** bell notification «התקבלה שאלה חדשה על המשרה „QA company post test”» → URL `?questions=<threadId>` → dialog «שאלות על המשרה» listing every asker's card. At generation check whether J-49's owner view has a direct entry (e.g. on «המשרות שלי» / the job) — prefer it if present; otherwise the newest matching bell item; save the URL as `threadUrl` in the handoff.
**Owner's cards:** talent → «מועמד/ת אנונימי/ת» / «שואל/ת על עצמו/ה»; headhunter → «נועם כהן» / «הד האנטר · שואל/ת בשביל מועמד/ת, בלי לחשוף מי». Each card: question text, «נשאלה ב-<dd.mm.yyyy>», for unanswered — field «התשובה שלכם»; one «שליחת התשובות» per card; answered → answer text + «נענתה ב-<dd.mm.yyyy>». (QA 28.10 `e0e6cc-owner-sees-hh-desktop.png`)

#### 2.1 CHAIN step 1 — owner answers every pending question of demo-talent-1 and claude-test on J-49 (frees the limit) @desktop @data #e0e6cc
**multi-role chain — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/job-owner-questions/JQ-2-1.md` · **File:** `tests/job-owner-questions/chain-jq-1-company.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company (demo-company-1, owner of J-49)
**Steps:**
1. `runId = Date.now()`; write handoff `.handoff/jq.json`.
2. Open the owner's questions dialog «שאלות על המשרה» for J-49 (see «Owner's entry»).
3. For every card that contains a question matching `/QA-AUTO (2810 e0e6cc|jq )/` (cards of demo-talent-1 and claude-test; NOT the talent_2 card with `246105` / `wr` texts): fill every empty «התשובה שלכם» with «QA-AUTO jq <runId> cleanup» and click that card's «שליחת התשובות».
4. Reload / reopen the dialog.
**Expected:**
- In those cards no «התשובה שלכם» field remains; every question shows an answer with «נענתה ב-». (precondition for 2.2–2.6; «מה רצוי» 4 thread «questions + answers, with dates»)

#### 2.2 CHAIN step 2 — talent asks from the job drawer before (re)submitting; question shows «נשאלה ב-…» and «ממתינה לתשובה» @desktop @data #e0e6cc
**multi-role chain — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/job-owner-questions/JQ-2-2.md` · **File:** `tests/job-owner-questions/chain-jq-2-talent.spec.ts`
**Seed:** `tests/seed.talent.spec.ts` · **Device:** desktop · **Users:** talent (demo-talent-1)
Note: demo-talent-1 already has an application on J-49 (28.10). At generation verify the drawer still shows «שאלה למנהל/ת המשרה»; if it only appears in the application view («המועמדויות שלי» → J-49 → «השאלות שלכם למנהל/ת המשרה»), use that entry and note it here. Do not switch to talent_2.
**Steps:**
1. Read handoff. Open J-49 drawer → «שאלה למנהל/ת המשרה» → dialog «שאלות למנהל/ת המשרה».
2. Check the info box; type `talentQ = «QA-AUTO jq <runId> talent»` into «השאלה שלכם»; `waitForResponse` for the questions POST; click «שליחת השאלה». Journal it.
3. Wait (≤30 s) for the question in the thread; close; reload; reopen.
**Expected:**
- Box «רק אתם ומנהל/ת המשרה רואים את השאלות והתשובות». (source: «מה רצוי» 5)
- POST 2xx; the thread shows `talentQ` exactly once with «נשאלה ב-<today dd.mm.yyyy>» and «ממתינה לתשובה», also after reload. (source: «מה רצוי» 1 «before submitting», 4 «with dates»; QA 28.10 `e0e6cc-talent-q1-sent-desktop.png`)
- Earlier questions of this talent are still in the thread with their answers (one thread per asker per job — developer note).

#### 2.3 CHAIN step 3 — headhunter asks for a candidate (no candidate choice, anonymous) @desktop @data #e0e6cc
**multi-role chain — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/job-owner-questions/JQ-2-3.md` · **File:** `tests/job-owner-questions/chain-jq-3-hunter_plus.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus (claude-test «נועם כהן»)
**Steps:**
1. Read handoff. Open J-49 drawer → «שאלה למנהל/ת המשרה» → dialog.
2. Read the info box; type `hhQ = «QA-AUTO jq <runId> hh»`; `waitForResponse` for the POST; «שליחת השאלה». Journal it.
3. Wait for the question in the thread with `timeout: 30_000` (a headhunter's question appears ~10–19 s after the POST).
**Expected:**
- Info box «רק אתם ומנהל/ת המשרה רואים את השאלות והתשובות» with the text that the owner sees the question is from you but not which candidate («מנהל/ת המשרה יראו שהשאלה מכם, אבל לא על איזה מועמד/ת מדובר»). (source: «מה רצוי» 2 «anonymous … not which candidate»; QA 28.10 `e0e6cc-hh-q1-sent-desktop.png`)
- No candidate selector in the dialog. `hhQ` shown once with «נשאלה ב-<today>» and «ממתינה לתשובה».

#### 2.4 CHAIN step 4 — owner gets the bell, sees the anonymous headhunter thread and the anonymous talent thread, answers both @desktop @data #e0e6cc
**multi-role chain — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/job-owner-questions/JQ-2-4.md` · **File:** `tests/job-owner-questions/chain-jq-4-company.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company (demo-company-1)
**Steps:**
1. Read handoff. Open the bell → newest notification «התקבלה שאלה חדשה על המשרה „QA company post test”» → click it.
2. In «שאלות על המשרה» find the card containing `hhQ` and the card containing `talentQ`.
3. Answer: card `talentQ` → «התשובה שלכם» = `talentAnswer «QA-AUTO jq <runId> answer talent»` → «שליחת התשובות»; card `hhQ` → `hhAnswer «QA-AUTO jq <runId> answer hh»` → «שליחת התשובות». Journal both. Save `threadUrl`.
**Expected:**
- The notification exists (wait ≤30 s, reopen the bell); clicking it leads to a URL with `?questions=` and the dialog «שאלות על המשרה». (source: «מה רצוי» 5 «Notifications in the bell for new questions»; QA 28.10 `e0e6cc-owner-bell-q1-desktop.png`, `e0e6cc-owner-bell-hh-desktop.png`)
- Card `hhQ`: «נועם כהן» + «הד האנטר · שואל/ת בשביל מועמד/ת, בלי לחשוף מי»; no candidate name in the card (e.g. not «משה כהן», not «QA-AUTO-daf026 …»). Card `talentQ`: «מועמד/ת אנונימי/ת» + «שואל/ת על עצמו/ה», no talent name. (source: «מה רצוי» 2; §36 anonymity; QA 28.10 `e0e6cc-owner-sees-hh-desktop.png`)
- After sending: both questions show their answers with «נענתה ב-<today>»; no «התשובה שלכם» left for them. (QA 28.10 `e0e6cc-owner-answered-hh-desktop.png`)

#### 2.5 CHAIN step 5 — talent gets the answer in the bell and in the thread, and asks again @desktop @data #e0e6cc
**multi-role chain — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/job-owner-questions/JQ-2-5.md` · **File:** `tests/job-owner-questions/chain-jq-5-talent.spec.ts`
**Seed:** `tests/seed.talent.spec.ts` · **Device:** desktop · **Users:** talent (demo-talent-1)
**Steps:**
1. Read handoff. Open the bell (wait ≤30 s, reopen if needed).
2. Open J-49 → «שאלה למנהל/ת המשרה» (same entry as 2.2).
3. Send the follow-up «QA-AUTO jq <runId> talent follow-up» (journal); wait ≤30 s.
**Expected:**
- Bell: notification «סופר פארם ענו על השאלה שלכם על המשרה „QA company post test”». (source: «מה רצוי» 5 «new answers»; QA 28.10 `e0e6cc-talent-bell-answer-desktop.png`)
- Thread: `talentQ` with `talentAnswer` and «נענתה ב-»; the field «השאלה שלכם» and «שליחת השאלה» are available (no limit message). (source: «מה רצוי» 4 «after answers are received, the asker can send additional questions»; QA 28.10 `e0e6cc-talent-thread-answer-desktop.png`)
- Follow-up appears once with «ממתינה לתשובה»; `talentQ` + answer still above it.

#### 2.6 CHAIN step 6 — headhunter sees the answer, asks again up to 3 unanswered → limit message, no field @desktop @data #e0e6cc
**multi-role chain — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/job-owner-questions/JQ-2-6.md` · **File:** `tests/job-owner-questions/chain-jq-6-hunter_plus.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus (claude-test)
**Steps:**
1. Read handoff. Open the bell; open J-49 → «שאלה למנהל/ת המשרה».
2. Send «QA-AUTO jq <runId> hh 1», «… hh 2», «… hh 3» one after another, each time waiting (≤30 s) until it is in the thread before the next (journal each).
3. Read the bottom of the dialog.
**Expected:**
- Bell: «סופר פארם ענו על השאלה שלכם על המשרה „QA company post test”». Thread: `hhQ` with `hhAnswer` and «נענתה ב-». (source: «מה רצוי» 5)
- Before the 3rd send the field is still available (follow-ups allowed). After 3 unanswered: text «3 שאלות שלכם ממתינות לתשובה. אפשר לשאול שוב אחרי שמנהל/ת המשרה יענו»; no «השאלה שלכם» field and no enabled «שליחת השאלה»; «סגירה» available. (source: developer note «max 3 unanswered at a time»; QA 28.10 `e0e6cc-hh-limit3-desktop.png`)
- Each of the 3 questions appears exactly once.
