<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Work Representation questions: the form closes after send, one click = one question, limit of 3 unanswered (2026-10-28)

STATUS: READY (precondition below) — #246105 passed QA, user moved it to «הושלם» 2026-10-28. Not generated yet. Environment: staging.
Sources: ticket «מה רצוי» / Done when (brief `.qa/research/246105.md`): «After a successful «שליחת השאלות» the form closes immediately (or turns read-only), with a confirmation, e.g. «השאלות נשלחו למנהל/ת המשרה. נעדכן אתכם כשתתקבל תשובה», and the button is no longer available»; Done when «after sending, the questions form is gone without a reload, and a second send is impossible». The point «The server rejects a second set of questions» is SUPERSEDED by client decision #e0e6cc (context.md 2026-10-28: questions are allowed many times, max 3 unanswered at a time) — NOT asserted; instead: one click / double click = one question, and the 3-unanswered limit. QA 28.10 (session.json): app 45967f8d / J-49; screenshots `.qa/screenshots/246105-*.png`.
Manual cases: `.qa/tests/work-representation-questions/WR-*.md`.

**PRECONDITION (current state 28.10):** talent_2 (demo-talent-2) already has 3 UNANSWERED questions on J-49 application 45967f8d-0a50-4d8d-8fa2-a061c166effe («QA-AUTO 2810 246105 שאלה», «… dbl», «… m») — the limit is reached, so §1 cannot send anything until the job owner answers. The chain therefore starts with step 1 (company answers every pending question). Each full run sends exactly 3 questions (1.2 + 1.3 + 1.4) and ends at the limit again; the next run's step 1 frees it. If step 1 cannot answer in the UI → the chain is BLOCKED (do not generate §1.2–1.4; mark here and ask the user). DEMO-1 is not used (context.md 28.10).
**Rules (whole file):** one role per test file — cross-role CHAIN `tests/work-representation-questions/chain-wr-<N>-<role>.spec.ts`, handoff `.qa/e2e/.handoff/wr.json` (`{ runId, createdAt, sent: [texts] }`), later steps `test.skip(!handoff, 'run the chain from step 1')`; run in order `npx playwright test tests/work-representation-questions/chain-wr- --project=tests --workers=1`; written by autotest-writer (handoff code), not by the generator. Saved sessions only; no fixed waits / `networkidle`. Question texts `QA-AUTO wr <runId> <n>`; questions cannot be deleted — journal each sent question in `.qa/e2e/test-data-journal.log`. A new question can appear in the J-49 thread up to ~19 s after the POST 200 (QA 28.10) — wait with `expect(...).toBeVisible({ timeout: 30_000 })` / `expect.poll`, never a fixed pause. Do NOT click «שליחת פרופיל מלא» / «שליחה ללא NDA».
**Known findings — NOT asserted (belong to #e0e6cc):** the «שאלות למנהל/ת המשרה» button on the application page disappears after 1 pending question (<3); the form hint text «עד 3 שאלות, פעם אחת…» may be outdated.
Not automated: server-side replay of the POST (DevTools); the job owner's answer notification to the talent.

---

### 1. Work Representation questions — CHAIN (company → talent_2)
**Seed:** chain — `tests/seed.company.spec.ts` (step 1), `tests/seed.talent_2.spec.ts` (steps 2–4); `tests/seed.talent_2.spec.ts` (1.5, mobile)

#### 1.1 CHAIN step 1 — owner answers every pending question of talent_2 on J-49 @desktop @data #246105
**multi-role chain — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/work-representation-questions/WR-1-1.md` · **File:** `tests/work-representation-questions/chain-wr-1-company.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company (demo-company-1, owner of J-49)
**Steps:**
1. `runId = Date.now()`; write handoff `.handoff/wr.json`.
2. «המשרות שלי» → J-49 «QA company post test» → «מועמדים שהוגשו» → open the anonymous application of demo-talent-2 (45967f8d-0a50-4d8d-8fa2-a061c166effe).
3. In the questions block find every question with «ממתין/ה לתשובה» / without an answer; type «QA-AUTO wr answer <runId>» and send for each.
**Expected:**
- No unanswered talent question remains on this application (every question shows an answer). (precondition for §1.2–1.4; §47 AC06 «show questions and answers»)

#### 1.2 CHAIN step 2 — after «שליחת השאלות» the form closes at once with a confirmation, no reload @desktop @data #246105
**multi-role chain — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/work-representation-questions/WR-1-2.md` · **File:** `tests/work-representation-questions/chain-wr-2-talent_2.spec.ts`
**Seed:** `tests/seed.talent_2.spec.ts` · **Device:** desktop · **Users:** talent_2 (demo-talent-2)
**Steps:**
1. Read handoff. Open the application 45967f8d (J-49, anonymous, NDA refused by the company «מוקדם מדי בתהליך הגיוס») — block «מנהל/ת המשרה לא חתם/ה על ה-NDA שלכם».
2. Click «שאלות למנהל/ת המשרה» (if the questions form is already shown — use it); type «QA-AUTO wr <runId> 1» in the first field.
3. Start `page.waitForResponse` for the questions POST; click «שליחת השאלות».
4. Without reloading, read the area.
**Expected:**
- POST status 200. (QA 28.10)
- Without reload: no textarea of the questions form and no button «שליחת השאלות» remain in the dialog / page; a confirmation is shown — text matching `/השאלות נשלחו/` (QA 28.10: «השאלות נשלחו למנהל/ת המשרה. נעדכן אתכם כשתתקבל תשובה»; exact wording is an example). (source: «מה רצוי» «the form closes immediately … with a confirmation … and the button is no longer available»; Done when «gone without a reload»)
- Block «השאלות שלכם» lists «QA-AUTO wr <runId> 1» exactly once with «ממתין/ה לתשובה».

#### 1.3 CHAIN step 3 — a double click on «שליחת השאלה» sends ONE question @desktop @data #246105
**multi-role chain — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/work-representation-questions/WR-1-3.md` · **File:** `tests/work-representation-questions/chain-wr-3-talent_2.spec.ts`
**Seed:** `tests/seed.talent_2.spec.ts` · **Device:** desktop · **Users:** talent_2
**Steps:**
1. Read handoff. Open job J-49 «QA company post test» as talent_2 → «שאלות למנהל/ת המשרה» → dialog «שאלות למנהל/ת המשרה» (thread).
2. Type «QA-AUTO wr <runId> dbl» in «השאלה שלכם»; count the POST requests to the questions endpoint (listener).
3. Double-click «שליחת השאלה» (`dblclick`).
4. Wait until «QA-AUTO wr <runId> dbl» is visible in the thread (timeout 30 s); close the dialog; reload the page; reopen the dialog.
**Expected:**
- Exactly ONE question with text «QA-AUTO wr <runId> dbl» in the thread, before and after reload; at most one successful POST for it. (source: «מה רצוי» «a second send is impossible»; QA 28.10 `246105-dblclick-desktop.png`)
- After send the field is empty or the send button is disabled while sending (no second copy).

#### 1.4 CHAIN step 4 — after reload each question is shown once; the 3rd unanswered question shows the limit message @desktop @data #246105
**multi-role chain — пишет autotest-writer**
**Status:** READY · **Case:** `.qa/tests/work-representation-questions/WR-1-4.md` · **File:** `tests/work-representation-questions/chain-wr-4-talent_2.spec.ts`
**Seed:** `tests/seed.talent_2.spec.ts` · **Device:** desktop · **Users:** talent_2
**Steps:**
1. Read handoff. Reload; open the J-49 thread dialog «שאלות למנהל/ת המשרה».
2. Count the questions «QA-AUTO wr <runId> 1» and «QA-AUTO wr <runId> dbl».
3. Send a third question «QA-AUTO wr <runId> 3» («שליחת השאלה»); wait until it is visible (timeout 30 s).
4. Read the bottom of the dialog.
**Expected:**
- Step 2: each of the two earlier questions appears exactly once (no duplicates after reload). (source: Done when «a second send is impossible»; QA 28.10 `246105-after-reload-desktop.png`)
- Step 4: 3 unanswered questions → limit message matching `/3 שאלות שלכם ממתינות לתשובה/` (QA 28.10: «3 שאלות שלכם ממתינות לתשובה. אפשר לשאול שוב אחרי שמנהל/ת המשרה יענו»); no question field / no enabled «שליחת השאלה»; only «סגירה». (source: client decision #e0e6cc «max 3 unanswered at a time», context.md 28.10; QA 28.10 `246105-thread-limit-mobile.png`)

#### 1.5 Mobile 375: the thread at the limit — questions once, limit message, no send, no horizontal scroll @mobile @prod-safe #246105
**Status:** READY · **Case:** `.qa/tests/work-representation-questions/WR-1-5.md` · **File:** `tests/work-representation-questions/mobile-thread-limit-state.spec.ts`
**Seed:** `tests/seed.talent_2.spec.ts`
**Device:** mobile
**Users:** talent_2
Data: read-only; valid while talent_2 has 3 unanswered questions on J-49 (true now and after a full chain run). If the limit message is absent → `test.skip` «not at the limit».
**Steps:**
1. Open job J-49 → «שאלות למנהל/ת המשרה» → thread dialog.
2. Scroll the dialog to the bottom.
**Expected:**
- Every question text in the thread is shown once (no two identical question headings). (Done when «a second send is impossible»)
- Limit message `/3 שאלות שלכם ממתינות לתשובה/` visible; no enabled «שליחת השאלה»; «סגירה» visible and inside the viewport. (#e0e6cc; QA 28.10 `246105-thread-limit-mobile.png`, `246105-thread-after-send-mobile.png`)
- `document.documentElement.scrollWidth <= window.innerWidth` (no horizontal scroll).
