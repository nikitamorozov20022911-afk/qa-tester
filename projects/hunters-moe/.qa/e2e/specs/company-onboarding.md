<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Company onboarding (2026-10-21)

STATUS: §1 **MANUAL** (needs a brand-new company account — not automated) · nothing READY for `playwright-test-generator`.
Tickets passed QA 21.10.2026 (user moved to «הושלם»): #41452a «Non-Anonymous Company Registration – Incorrect step counter…», #47b00b «Company Registration – Unclear tender validity fields and non-functional "Signature" field…». Verified on fresh account topol87542 (company), path: promoted tender, public, no NDA.
Cases: `.qa/tests/company-onboarding/CO-*.md`.
Rules: never pay (₪1,500 promotion / ₪100 NDA) — if a payment window opens, stop; created data prefixed `QA-AUTO-`; account creation is not automated.

Flow (6 steps, «שלב N מתוך 6»): /onboarding → «חברה/ארגון» → 1 /onboarding/tender-type → 2 /onboarding/tender-visibility → 3 /onboarding/company → 4 /onboarding/tender («פרטי המכרז») → 5 /onboarding/contact («פרטי יצירת קשר») → 6 /onboarding/terms («רק מוודאים…»).

---

### 1. Company onboarding — new account (MANUAL, not for the generator)
**Seed:** — (needs a fresh, just-registered company whose onboarding is not finished)

Kept as a manual regression checklist. If the project later gets a reusable "company onboarding-not-finished" session, these become read-only tests with seed `tests/seed.<that-role>.spec.ts` (navigate steps without the final submit and without payment).

#### 1.1 Step counter is «שלב N מתוך 6» throughout, Hebrew, last step «שלב 6 מתוך 6» @desktop #41452a — MANUAL
**Device:** desktop · **Users:** new company (manual precondition) · **Case:** `.qa/tests/company-onboarding/CO-1-1.md`
**Steps:**
1. /onboarding → «חברה/ארגון».
2. Go through steps 1–5 (promoted or not promoted, public, NDA none, company details, tender details with QA-AUTO- title, contact details) — do not pay.
3. On /onboarding/contact click «המשך» → /onboarding/terms.
**Expected:**
- Steps 1…6 show «שלב 1 מתוך 6» … «שלב 6 מתוך 6» in order; total always 6.
- /onboarding/contact — «שלב 5 מתוך 6»; /onboarding/terms «רק מוודאים…» — «שלב 6 מתוך 6».
- No English counter («Step 5 of 5»). (source: Expected Result #41452a)

#### 1.2 «פרטי המכרז»: one validity date, no text «חתימה» field; signature canvas on step 6 @desktop #47b00b — MANUAL
**Device:** desktop · **Users:** new company (manual precondition) · **Case:** `.qa/tests/company-onboarding/CO-1-2.md`
**Steps:**
1. Reach /onboarding/tender («שלב 4 מתוך 6»).
2. Inspect the validity question and all fields; continue to /onboarding/terms.
**Expected:**
- «עד מתי המכרז תקף?» — one end date: day / month / year dropdowns (validDay / validMonth / validYear); no separate days-or-months duration fields.
- No text input labelled «חתימה» on «פרטי המכרז».
- /onboarding/terms: 3 checkboxes (agreeRole, agreeUpdates, agreeTerms) + signature canvas «חתמו כאן». (source: Expected Result #47b00b)

---

### Not planned (needs confirmation first)
Candidate read-only test for an existing company (seed `tests/seed.company.spec.ts`): the regular tender wizard /publish/tender (4 steps, «שלב N מתוך 4») may reuse the same «פרטי המכרז» fields («עד מתי המכרז תקף?» day/month/year, no text «חתימה»). NOT planned: which wizard step holds these fields is not confirmed in existing cases/specs, and «המשך» on step 1 of a new wizard creates a draft (CW-8-3) — the test would have to open an existing draft (e.g. fc32fe66 «QA-AUTO bc890b-v draft») without saving. Confirm the step and field names in a free company session, then add as 2.1 (@desktop @prod-safe, read-only).
