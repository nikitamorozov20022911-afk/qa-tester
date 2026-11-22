<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — «פרסום משרה» removed from onboarding (2026-10-21)

STATUS: §1 **MANUAL** (needs brand-new / pending accounts) · §2 **READY** for `playwright-test-generator` (selectors not live-checked: hunter_plus session busy 21.10).
Tickets passed QA 21.10.2026 (user moved to «הושלם»): #9a6101 and #9a6103 — duplicates, same title «[דחייה] הסרת "פרסום משרה" מתהליך ה-Onboarding».
Cases: `.qa/tests/onboarding-publish-removed/OP-*.md`.
Rules: saved sessions only; read-only — never fill the publish form, never click «המשך»/publish; no fixed waits / networkidle; do not run — only /qa-regress runs tests.
Related (not duplicated here): talent onboarding step content — `talent-onboarding.md`; publish wizard texts — `copywriting.md` 1.4, `job-drafts.md`.

---

### 1. Onboarding flows without «פרסום משרה» (MANUAL, not for the generator)
**Seed:** — (fresh accounts; account creation is not automated)

#### 1.1 Talent onboarding: 6 steps, no «פרסום משרה», ends at /collaborations @desktop #9a6101 #9a6103 — MANUAL
**Device:** desktop · **Users:** new talent · **Case:** `OP-1-1.md`
**Steps:** 1. /onboarding → «טאלנטים / קריירה». 2. Go through all steps. 3. After step 6 click «לעמוד הבית».
**Expected:**
- «שלב N מתוך 6»; URLs in order: /onboarding/visibility, /talent-details, /cv, /experience, /summary, /terms.
- No «פרסום משרה» step / button / link on any step.
- /onboarding/pending, then «לעמוד הבית» → /collaborations.
- (source: AC «השלב / הכפתור "פרסום משרה" אינו מופיע», «מגיע ליעד הרגיל שלו»)

#### 1.2 Headhunter onboarding: 4 steps, no «פרסום משרה» @desktop #9a6101 #9a6103 — MANUAL
**Device:** desktop · **Users:** new headhunter · **Case:** `OP-1-2.md`
**Steps:** 1. /onboarding → «הד האנטר». 2. Go through 4 steps (2 required documents on step 3). 3. Finish step 4.
**Expected:**
- «שלב N מתוך 4»; URLs: /onboarding/details, /profile, /documents, /terms.
- No «פרסום משרה» on any step.
- /onboarding/pending with «איזה פרופיל יש לכם :)» and «אנחנו בודקים את הפרטים והמסמכים שלכם…».
- (source: AC; PRD §6.2)

#### 1.3 Pending headhunter opening /publish/job is redirected @desktop #9a6101 #9a6103 — MANUAL
**Device:** desktop · **Users:** headhunter awaiting approval (no shared account) · **Case:** `OP-1-3.md`
**Steps:** 1. Open /publish/job directly.
**Expected:** redirect to /onboarding/pending; no publish form.
Can become a test if the project gets a saved "pending hunter" session (`tests/seed.<role>.spec.ts`).

---

### 2. Job publishing stays in normal navigation (existing approved hunter, read-only)
**Seed:** `tests/seed.hunter_plus.spec.ts`

#### 2.1 Header «+ פרסום» leads to the job publish form @desktop @prod-safe #9a6101 #9a6103
**Device:** desktop · **Users:** hunter_plus · **Case:** `OP-2-1.md`
**Steps:**
1. Open /collaborations.
2. Click «+ פרסום» in the header.
3. Click «פרסום משרה» in the menu.
**Expected:**
- «+ פרסום» is visible in the header.
- The menu has «פרסום משרה».
- URL becomes /publish/job; step 1 of the publish form is shown (step 1 heading visible); URL does not contain /onboarding.
- Do not fill or submit anything.
- (source: AC «פרסום משרה נשאר זמין מהניווט הרגיל לאחר ההרשמה»)
