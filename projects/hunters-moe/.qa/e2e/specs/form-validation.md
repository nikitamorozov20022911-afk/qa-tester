<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Form validation: errors clear on fix, specific texts, no silent truncation, chat limit (2026-10-22)

STATUS: READY — #710d8c (4c9e57c462bb7f2a5d710d8c) passed QA 22.10, user moved it to «הושלם» 2026-10-22. Not generated yet.
Already planned for the same ticket (as #4c9e57c4) — NOT duplicated here: `specs/copywriting.md` 5.5 (tender step 4 «יש לאשר כדי להמשיך» clears) and 5.6 (company profile website error / empty company name).
Source of expectations: ticket «What is needed» (error at the field, disappears when fixed, says what to fix; no silent truncation — counter or message; in chat a «too long» message for both roles; «4,000» with a comma) + reject rej_1792402771 (job wizard: fixing MIN to min ≤ max removes the error and red frame immediately; 20000/20000 valid, also after «abc») + reject rej_0d2601a5 («הוספת מועמד»: the salary pair is re-checked on any change; at min ≤ max the error and frame disappear from both fields without blur and without «המשך»). Copy-ticket decision 18.10: another clear wording is not a reject → texts are matched loosely (regex), not verbatim. Evidence: `.qa/screenshots/710d8c-*.png` (22.10: add-candidate salary error clears in 20–75 ms without blur 3/3; wizard required/abc/-3/length ok; chat 4001 → «ההודעה ארוכה מדי» for hunter and company, nothing sent).
Rules: one role per file; nothing is saved — add-candidate closed with «יציאה» before «סיום»; job wizard never passes step 1 with valid data (a valid «המשך» creates a draft); chat messages are typed but never sent; no fixed waits / `networkidle` — «without blur» = assert right after `fill()` with no Tab/click elsewhere; no DEMO-*.

---

### 1. Salary pairs re-validate on every change
**Seed:** per test

#### 1.1 «הוספת מועמד»: fixing «ציפיות שכר מ-» clears the range error on both fields without blur @desktop @prod-safe #710d8c
**Status:** READY · **File:** `tests/form-validation/add-candidate-salary-pair-clears.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. Open /my-candidates/new; fill required fields (first name «QA-AUTO-710d8c», last name `<runId>`, phone `uniquePhone()`, «תחום התמחות»).
2. «ציפיות שכר מ-» 30000, «עד» 20000 → «המשך».
3. Change «מ-» to 10000 (fill only; no blur).
4. Change «מ-» to 20000 and «עד» to 20000.
5. Close the dialog → «יציאה».
**Expected:**
- Step 2: an error under the pair (max must be ≥ min) and `aria-invalid="true"` on «עד»; the dialog stays on step 1.
- Step 3: the error text is gone and both fields have `aria-invalid` ≠ "true" — without blur and without «המשך». (reject rej_0d2601a5 «needed»)
- Step 4: no error (min = max accepted). (ticket item 4 «או שווה לו or forbid equal — both ok»; QA 22.10 accepted equal)
- Step 5: no candidate created.

#### 1.2 Job wizard step 1: range error clears on MIN fix; «abc» / «-3» get a specific message; 20000/20000 valid @desktop @prod-safe #710d8c
**Status:** READY · **File:** `tests/form-validation/job-wizard-salary-pair.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps:**
1. «+ פרסום» → «פרסום משרה» (/publish/job) step 1; leave the title empty.
2. Salary MIN 30000, MAX 20000 → «המשך» (blocked by errors — no draft).
3. Change MIN to 10000.
4. MIN «abc» → read the error; MIN «-3» → read the error.
5. MIN 20000, MAX 20000; leave the page without «המשך».
**Expected:**
- Step 2: range error visible; «שדה חובה» under the empty title.
- Step 3: range error and red frame gone immediately. (reject rej_1792402771 «needed»)
- Step 4: each error says what to fix (matches `/מספר|חיובי|גדול|0/`), not only «שדה חובה». (ticket item 2)
- Step 5: no salary error. (reject rej_1792402771 «20000/20000 valid, also after abc»)

### 2. Required fields and length limits
**Seed:** `tests/seed.company.spec.ts`

#### 2.1 Job wizard step 1: required error clears on typing; long title is not silently cut @desktop @prod-safe #710d8c
**Status:** READY · **File:** `tests/form-validation/job-wizard-required-and-length.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps:**
1. /publish/job step 1 → «המשך» with empty fields.
2. Type «QA-AUTO 710d8c» into «שם המשרה».
3. Clear the title; fill it with 250 characters «QA-AUTO » + «א»×242.
4. Leave the page without a valid «המשך».
**Expected:**
- Step 1: «שדה חובה» under required fields.
- Step 2: the title error disappears without «המשך». (ticket item 1 «errors disappear when fixed»)
- Step 3: either a visible counter «N/200» (N ≥ 200) with an error/limit message, or the input keeps all 250 characters and shows a «too long» error — never a value silently cut to 200 without any counter or message. (ticket item 5 «no silent truncation»)

### 3. Chat message over the limit
**Seed:** per test

#### 3.1 Headhunter: 4,001-character message shows «too long» and is not sent @desktop @prod-safe #710d8c
**Status:** READY · **File:** `tests/form-validation/chat-too-long-hunter.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. /messages → open the conversation with «סופר פארם» (demo-company-1); count the messages.
2. Fill the message box with 4,001 characters (`'QA-AUTO ' + 'א'.repeat(3993)`).
3. Press Enter; then click the send button if it is enabled.
4. Clear the box.
**Expected:**
- Step 2: the text «ההודעה ארוכה מדי (עד 4,000 תווים)» (match `/ארוכה מדי.*4,000/`) and the counter «4,001/4,000» are visible. (ticket item 6 «both roles see a too-long message; 4,000 with a comma»; screenshot 710d8c-chat-4001)
- Step 3: the message count did not change and no new bubble with «QA-AUTO» appears — nothing sent (the send button may look enabled; assert the outcome, not the button state).

#### 3.2 Company: the same «too long» behaviour @desktop @prod-safe #710d8c
**Status:** READY · **File:** `tests/form-validation/chat-too-long-company.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company
**Steps / Expected:** as 3.1 in the company's conversation with «הד האנטר דמו 3» (demo-hunter-3) or the first conversation if it is absent.
