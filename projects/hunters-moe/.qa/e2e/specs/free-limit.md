<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — FREE headhunter sees the monthly submission quota before submitting (2026-10-22)

STATUS: READY — #437b26 (fdac94c8a0086fe9e4437b26) passed QA 22.10, user moved it to «הושלם» 2026-10-22. Not generated yet.
Source of expectations: reject 1 «needed» — «the remaining quota is shown in the submission dialog and on the plan card … when the quota is 0, «הגשה» is disabled up front, with the upgrade CTA and the date the quota resets» + reject 2 «needed» — «quota the same on all jobs (incl. already submitted): candidates disabled + text «ניצלתם את 4 ההגשות של החודש במסלול FREE. אפשר להגיש שוב ב-<date>…» + «שדרוג ל-PLUS»; plan card FREE shows the remainder». Evidence: `.qa/screenshots/437b26-*.png` (22.10: text + date 01.11.2026 + «שדרוג ל-PLUS» on all 40 jobs incl. J-49/J-48, candidates disabled, plan card «0 מתוך 4»).
Rules: one role per file; read-only (never submit, never buy a plan) `@prod-safe`; no fixed waits / `networkidle` (plan card remainder appears ~1.5–2 s late — wait with `expect`, it is a known finding, not a failure).
**Not time-based:** the quota resets on the 1st of each month, so the tests read the remainder first and branch: remainder 0 → blocked state; remainder 1–4 → counter state. The reset date is checked by format (1st day of next month), never by a fixed value.
Never open DEMO-* jobs (demo-2026-10-22.md). Not automated: server rejection of a 5th submission (needs a bypass request).

---

### 1. FREE submission quota
**Seed:** `tests/seed.hunter_free_2.spec.ts`

#### 1.1 Job panel shows the quota state on already-submitted and other jobs @desktop @prod-safe #437b26
**Status:** READY · **File:** `tests/free-limit/job-panel-quota-state.spec.ts`
**Seed:** `tests/seed.hunter_free_2.spec.ts` · **Device:** desktop · **Users:** hunter_free_2 (demo-hunter-3, FREE)
**Steps:**
1. Open the plan card: header badge «FREE» → «בחירת חבילה»; read «נותרו N מתוך 4 הגשות החודש» on the FREE card; close.
2. /collaborations → open J-49 «QA company post test» (already submitted), J-48 «QA promo test» (already submitted), J-40 (control) and the first 2 other non-DEMO jobs; on each read the block «הגשת מועמד».
**Expected:**
- Step 1: N is an integer 0–4 (never negative). (reject 2 «on the FREE plan card the remainder»)
- If N = 0, on every job: text «ניצלתם את 4 ההגשות של החודש במסלול FREE. אפשר להגיש שוב ב-DD.MM.YYYY…» where the date is the 1st of the next month (`01.MM.YYYY`); button «שדרוג ל-PLUS» visible; candidate rows disabled (aria-disabled / not clickable) so the submission form cannot be opened. (reject 2 «needed»)
- If N > 0, on every job: «נותרו N מתוך 4» shown before choosing a candidate, same N as the plan card. (reject 1 «remaining quota is shown in the submission dialog»)

#### 1.2 Plan card shows the remaining FREE quota in he and en @desktop @prod-safe #437b26
**Status:** READY · **File:** `tests/free-limit/plan-card-remaining-quota.spec.ts`
**Seed:** `tests/seed.hunter_free_2.spec.ts` · **Device:** desktop · **Users:** hunter_free_2
**Steps:**
1. Header «FREE» → «בחירת חבילה»; wait for the FREE card remainder.
2. Switch to English; open the plan window again; switch back to Hebrew.
**Expected:**
- he: FREE card shows «נותרו N מתוך 4 הגשות החודש» (0 ≤ N ≤ 4). (reject 1/2 «needed»)
- en: the FREE card shows the same N and «4» in an English sentence (no Hebrew letters in that line).
- Do not click «PLUS» / «PREMIUM» / any purchase button; close with the X.
