<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Company job drafts in «המשרות שלי» (2026-10-19)

STATUS: READY — #478fcf passed QA (user moved it to «הושלם», 2026-10-19). NOT generated yet: the `playwright-test` MCP was disconnected when this plan was written.
Rules: login only via saved sessions (seed per role); no fixed waits; test data prefix `QA-AUTO-`, cleanup in afterAll; nothing is published (company publishing is Pay Per Post); `@data` = changes shared data (run one at a time); `@prod-safe` = read-only.
Do not delete «QA copy audit - לא לפרסם» (f945a5db) — the user keeps it.

---

### 1. Job drafts
**Seed:** `tests/seed.company.spec.ts`, `tests/seed.hunter_plus.spec.ts`

#### 1.1 Company drafts show «טיוטה» and continue/delete actions @desktop @prod-safe #478fcf
**Status:** READY · **Case:** `.qa/tests/job-drafts/JD-1-1.md` · **File:** `tests/job-drafts/company-drafts-marked-with-actions.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
**Steps:**
1. Open «המשרות שלי».
2. On the card «QA copy audit - לא לפרסם» open the «...» menu.
3. Click «להמשיך בפרסום» — the job wizard opens; leave it without publishing (do not click «פרסום»).
**Expected:**
- Draft cards show the badge «טיוטה». (source: «מה רצוי» #478fcf)
- The draft menu has «להמשיך בפרסום» and «מחיקת הטיוטה».
- «להמשיך בפרסום» opens the wizard with the saved job title «QA copy audit - לא לפרסם».

#### 1.2 Company draft lifecycle: saved at step 1, marked, deleted @desktop @data #478fcf
**Status:** READY · **Case:** `.qa/tests/job-drafts/JD-1-2.md` · **File:** `tests/job-drafts/company-draft-save-mark-delete.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
**Steps:**
1. «+ פרסום» → «פרסום משרה». Step 1: title «QA-AUTO 478fcf <timestamp> - לא לפרסם», description, «תחום התמחות», «תפקידים», salary 10000–20000 → «המשך» (the draft is saved).
2. Open «המשרות שלי» and find the QA-AUTO card.
3. «...» → «מחיקת הטיוטה» → confirm.
4. Cleanup (afterAll): if a QA-AUTO 478fcf card is still there, delete it the same way.
**Expected:**
- After step 1 the QA-AUTO card is in «המשרות שלי» with the badge «טיוטה». (source: «מה רצוי» #478fcf)
- After deletion the card is gone.

#### 1.3 Published company job has no draft mark @desktop @prod-safe #478fcf
**Status:** READY · **Case:** `.qa/tests/job-drafts/JD-1-3.md` · **File:** `tests/job-drafts/published-job-no-draft-mark.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
**Steps:**
1. Open «המשרות שלי» and find the card «QA company post test».
**Expected:**
- The card has the status «פעילה» and no «טיוטה». (brief #478fcf С2)

#### 1.4 Company drafts are not in the headhunter feed @desktop @prod-safe #478fcf
**Status:** READY · **Case:** `.qa/tests/job-drafts/JD-1-3.md` · **File:** `tests/job-drafts/drafts-not-in-headhunter-feed.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open /collaborations and search «לא לפרסם».
**Expected:**
- No company drafts in the feed («QA copy audit - לא לפרסם», «QA-AUTO … - לא לפרסם»). (brief #478fcf Т4)
