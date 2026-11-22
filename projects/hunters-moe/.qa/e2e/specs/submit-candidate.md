<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Submit candidate dialog: AI loading state (#7178a2) and iPhone titles (#63b8d1) (2026-10-22)

STATUS: READY — #7178a2 (a4970ff8058552754c7178a2) and #63b8d1 (3d66fbfa9395b618e663b8d1) passed QA 22.10, user moved them to «הושלם» 2026-10-22. Not generated yet.
Sources: #7178a2 «What is needed» — «While the AI texts are being generated, «סיום והגשה» is disabled (or shows a loading state) and becomes active only when generation finishes; the submission is never sent with half-generated or empty AI fields»; developer note 22.10 (loading label «ממתינים לתקציר ה-AI…», also after «חזרה» → «המשך»). #63b8d1 reject rej_7d7f21a7 «needed» — «on iPhone 375 step 2 shows the whole name, «QA copy test» in one line» + reject rej_1792408115 (Latin part never split, right order; also in the NDA title). Evidence: `.qa/screenshots/7178a2-*.png` (button disabled + aria-busy from ~110 ms until both AI fields filled, incl. regeneration), `.qa/screenshots/63b8d1-*.png` (13/13 + 3/3 runs on J-40).
Rules: one role per file (hunter_plus); no fixed waits / `networkidle` (wait for the button state / field values via `expect`); created data prefix `QA-AUTO-`, UNIQUE phone `uniquePhone()` (`05` + last 8 digits of `Date.now()`; add-candidate rejects reused phones); never use DEMO-* jobs or candidates; no NDA charge — always «אין צורך ב-NDA».
Related, not duplicated: `specs/add-candidate.md` 2.2 (AI texts content on regenerations), `specs/copywriting.md` (submit validation).

---

### 1. AI loading state blocks «סיום והגשה» (#7178a2)
**Seed:** `tests/seed.hunter_plus.spec.ts`

#### 1.1 «סיום והגשה» is disabled while AI summary/strengths are generated, also after «חזרה» → «המשך» @desktop @data #7178a2
**Status:** READY · **File:** `tests/submit-candidate/ai-loading-blocks-submit.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus (claude-test, PLUS)
**Steps:**
1. «הוספת מועמד» → «פרופיל גלוי», first name «QA-AUTO-7178a2», last name `<runId>`, phone `uniquePhone()`, «כמה מילים על המועמד», any «תחום התמחות» → «המשך» → «סיום».
2. Open J-36 (/collaborations/93808c3a-a1ef-4457-9f6f-b7d4926414ee) → «הגשת מועמד» → this candidate → «פרופיל מלא» → «אין צורך ב-NDA» → «המשך».
3. Immediately read the submit button; then wait until «תקציר המועמד» and «חוזקות» are both non-empty and not the «✨ יוצר תקציר…» placeholder; read the button again.
4. Click «חזרה» (header) → «המשך»; repeat step 3.
5. Answer the screening questions «QA-AUTO 7178a2»; click «סיום והגשה»; open the created submission.
**Expected:**
- Step 3 (during generation): the button is disabled (`disabled` or `aria-disabled="true"`, `aria-busy="true"`) and shows «ממתינים לתקציר ה-AI…»; a click does nothing (no submission request). (source: «What is needed» #7178a2)
- Step 3 (after generation): button «סיום והגשה» enabled.
- Step 4: the same disabled → enabled sequence on regeneration. (developer note 22.10)
- Step 5: the submission page shows non-empty «תקציר המועמד» and «חוזקות». («never sent with half-generated or empty AI fields»)
- Log candidate + application id to the test-data journal (no delete in UI).

---

### 2. iPhone: Latin names in submit dialog titles (#63b8d1 item 7)
**Seed:** `tests/seed.hunter_plus.spec.ts`

Check helper: for a title element and substring S, build a DOM Range over S and read `getClientRects()`; «S in one line» = all rects have the same `top` (±2 px). «Not clamped» = `scrollHeight ≤ clientHeight + 1` and the full name is in `textContent` and visible.

#### 2.1 Step 2 title shows the whole candidate name, «QA copy test» on one line (3 runs) @iphone @prod-safe #63b8d1
**Status:** READY · **File:** `tests/submit-candidate/iphone-step2-title-latin-name.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** iphone · **Users:** hunter_plus
**Steps:**
1. Open J-40 → «הגשת מועמד» → candidate «QA copy test מועמד גלוי»: read the dialog title (step 1).
2. «פרופיל מלא» → «אין צורך ב-NDA» → «המשך»: read the step-2 title «הגשת מועמד: QA copy test מועמד גלוי».
3. Close the dialog without submitting (X / «ביטול»). Repeat steps 1–3 three times.
4. Repeat once with «QA copy test מועמד אנונימי» («פרופיל אנונימי»).
**Expected:**
- Every run: the step-2 title is not clamped and its visible text contains the full name (incl. «גלוי» / «אנונימי»). (reject rej_7d7f21a7 «Done when on iPhone 375 step 2 shows the whole name»)
- Every run: «QA copy test» lies on one line in both titles. (reject rej_7d7f21a7 «the Latin part is never split»)
- Nothing is submitted (no new application).

#### 2.2 NDA agreement title keeps «QA test» together @iphone @prod-safe #63b8d1
**Status:** READY · **File:** `tests/submit-candidate/iphone-nda-title-latin-name.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** iphone · **Users:** hunter_plus
**Steps:**
1. /profile → tab «הסכמים» → on the agreement «QA test» click «צפייה».
2. Read the dialog title «הסכם סודיות (NDA): QA test»; close.
**Expected:**
- «QA test» on one line and after the colon (title text order: «הסכם סודיות (NDA): QA test»). (reject rej_1792408115 «name in the right order, Latin part not split … also in NDA»)
- Do not sign anything.

---

## Update 2026-11-07 — #f2c5ce neutral candidate wording in the submit window

STATUS (§3): READY — #f2c5ce passed QA (rejection rej_fdbf266b… closed); user moved it to «הושלם» 2026-11-07. Not generated yet.
Source: #f2c5ce «מה רצוי» "neutral «/» everywhere about the candidate – «…ללא הפרטים האישיים של המועמד/ת», «הגשת מועמד/ת: …», «תקציר המועמד/ת», «סטטוס מועמד/ת». Same in job submit form and on the owner side. Done when: submit form (tender and job) has no masculine-only strings about the candidate"; rule 2026-10-19. Evidence: `.qa/screenshots/f2c5ce-v-hr-*.png`, `f2c5ce-job-step*.png`. Cases: `.qa/tests/submit-candidate/SC-3-1, SC-3-2`. Owner-side badge → `candidate-badge.md` 2.1. Tender-specific words («מנהל/ת המכרז») → `tender-submissions-texts.md` 1.3 (not duplicated).
**Rules (§3):** read-only, `@prod-safe` — NEVER click the final «הגשה» / «סיום והגשה»; close the window with «סגירה» (confirm «יציאה» if asked). Do not wait for the AI fields (finding: «חוזקות» may stay «ממתינים לתקציר ה-AI…» for a few seconds — not asserted).
**Masculine-only check (shared, step 2 dialog text, bidi marks removed with `norm()` from `tests/_helpers/i18n.ts`):** text contains «הגשת מועמד/ת:», «ללא הפרטים האישיים של המועמד/ת», «תקציר המועמד/ת», «סטטוס מועמד/ת»; and does NOT match `/המועמד(?!\/ת)/`, `/הגשת מועמד(?!\/ת)/`, `/סטטוס מועמד(?!\/ת)/`. AI-generated summary text is user data — exclude the value of the textbox «תקציר המועמד/ת» before the regex check.

### 3. Submit window — neutral candidate wording (#f2c5ce)

#### 3.1 HR submit window on a tender, anonymous: neutral wording on steps 1–2, nothing submitted @desktop @prod-safe #f2c5ce
**Case:** `.qa/tests/submit-candidate/SC-3-1.md` · **File:** `tests/submit-candidate/hr-tender-submit-neutral-anon.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts` · **Device:** desktop · **Users:** company_6 (demo-company-6, HR)
**Steps:**
1. Go to `/tenders/65d2b6a1-234b-47db-9984-b4dcbe984452` (T-44); if not found → `test.skip(true, 'f2c5ce data changed: T-44 not found')`.
2. In the panel click «הגשה» of the first candidate (ticket: «מיכל לוי»). Step 1: read the option cards; choose «פרופיל אנונימי»; click «המשך».
3. Step 2: read the dialog; close with «סגירה» without submitting.
**Expected:**
- Step 1 cards use «המועמד/ת» (no `/המועמד(?!\/ת)/`). (#f2c5ce dev note — step-1 cards)
- Step 2: shared masculine-only check passes — heading «הגשת מועמד/ת: <name>», «…ללא הפרטים האישיים של המועמד/ת», label «תקציר המועמד/ת», side block «סטטוס מועמד/ת». (#f2c5ce «מה רצוי»)
- After close no dialog of the submit window is left; nothing was submitted.

#### 3.2 HR submit window on a tender, full profile: same neutral wording, nothing submitted @desktop @prod-safe #f2c5ce
**Case:** `.qa/tests/submit-candidate/SC-3-1.md` · **File:** `tests/submit-candidate/hr-tender-submit-neutral-full.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts` · **Device:** desktop · **Users:** company_6
**Steps:** as 3.1, but on step 1 choose «פרופיל מלא».
**Expected:** step 2 — heading «הגשת מועמד/ת: <name>», «תקציר המועמד/ת», «סטטוס מועמד/ת»; no masculine-only forms (shared check; the «ללא הפרטים האישיים…» banner belongs to the anonymous variant and is not required here). (#f2c5ce «מה רצוי»)

#### 3.3 Headhunter submit window on a job, anonymous: neutral wording, nothing submitted @desktop @prod-safe #f2c5ce
**Case:** `.qa/tests/submit-candidate/SC-3-2.md` · **File:** `tests/submit-candidate/hunter-job-submit-neutral-anon.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus (claude-test, PLUS)
**Steps:**
1. Find a foreign job as in `submit-panel.md` (J-148 `/collaborations/fedc4b3d-3de6-414e-9821-af96a34469ae`, else first foreign job in `/collaborations`, else `test.skip` with reason). Skip jobs that show an NDA payment option only.
2. In «הגשת מועמד/ת» search a QA-AUTO candidate (e.g. «QA-AUTO 0211 d4f6e7») and click the button «הגשת <name> למשרה» of the first one that is not marked as already submitted; if none → `test.skip(true, 'f2c5ce: no unsubmitted QA-AUTO candidate for this job')`.
3. Step 1: «פרופיל אנונימי», «אין צורך ב-NDA (ללא עלות)» → «המשך». Read step 2. Close without «סיום והגשה».
**Expected:** shared masculine-only check passes on step 2 (incl. «…ללא הפרטים האישיים של המועמד/ת»). (#f2c5ce — "Same in job submit form")
