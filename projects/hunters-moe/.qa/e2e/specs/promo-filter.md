<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — «מסלול קידום והפצה» filter on site lists (2026-10-21)

STATUS: READY — #521d84 passed QA (user moved it to «הושלם», 2026-10-21). Environment: staging.
Rules: saved sessions only; no fixed waits / `networkidle`; read-only (filters only).
Filter values on /collaborations: «הכל» (default) · «ללא קידום» · «קידום» · «הפצה» · «Unique Position (ייחודית)». Results count — text «N תוצאות» above the list. Admin /admin/jobs is not part of these tests (already met the criteria before the ticket).

---

### 1. Promotion filter — jobs and tenders lists
**Seed:** `tests/seed.hunter_free.spec.ts`

#### 1.1 Default value «הכל» and a results count on /collaborations @desktop @prod-safe #521d84
**Status:** DONE 21.10 (pass) · **Case:** `.qa/tests/promo-filter/PF-1-1.md` · **File:** `tests/promo-filter/collaborations-default-all-and-count.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free
**Steps:**
1. Open /collaborations, open the sidebar section «מסלול קידום והפצה».
**Expected:**
- The section has the value «הכל», and it is selected; the other values are not. (source: AC1 / needed behavior #521d84)
- A count «N תוצאות» (N > 0) is shown above the list. (source: AC4)
- URL has no `promo` parameter.

#### 1.2 Choosing a value: count changes, URL ?promo=, removable chip @desktop @prod-safe #521d84
**Status:** DONE 21.10 (pass) · **Case:** `.qa/tests/promo-filter/PF-1-2.md` · **File:** `tests/promo-filter/collaborations-promo-chip-and-count.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free
**Steps:**
1. Open /collaborations, note the count N.
2. «מסלול קידום והפצה» → choose «קידום».
3. In the active-filters bar click «×» on the chip «קידום».
**Expected:**
- After step 2: URL contains `promo=`; the count M ≤ N is shown and the number of cards matches the filter; «הכל» is no longer selected; a chip «קידום» with «×» appears in the active-filters bar. (source: AC3, AC4, AC7)
- After step 3: the chip is gone, `promo` removed from the URL, «הכל» selected again, the count is N again. (source: needed behavior #521d84 — «removing it restores the full list and the URL»)

#### 1.3 «הכל» clears the promo filter; AND with a field filter; kept after reload @desktop @prod-safe #521d84
**Status:** DONE 21.10 (pass) · **Case:** `.qa/tests/promo-filter/PF-1-3.md` · **File:** `tests/promo-filter/collaborations-promo-and-field-reload.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free
**Steps:**
1. Open /collaborations, tick field «טכנולוגיה, מוצר, דאטה ומערכות מידע»; note count F.
2. «מסלול קידום והפצה» → «ללא קידום»; note count P.
3. Reload the page.
4. Choose «הכל».
**Expected:**
- P ≤ F, every card has the technology field (AND logic). (source: AC5)
- After reload: URL still has `promo=` and the field; «ללא קידום» selected; count P again. (source: AC6)
- After step 4: `promo` removed from the URL, the promo chip gone, count F again (the field filter stays). (source: needed behavior #521d84 — «choosing it clears the promo filter»)

#### 1.4 Same behaviour on /tenders @desktop @prod-safe #521d84
**Status:** DONE 21.10 (pass) · **Case:** `.qa/tests/promo-filter/PF-1-4.md` · **File:** `tests/promo-filter/tenders-promo-filter.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free
**Steps:**
1. Open /tenders, open «מסלול קידום והפצה».
2. Choose a value other than «הכל» (e.g. «ללא קידום»).
3. Remove its chip with «×».
**Expected:**
- Step 1: «הכל» exists and is selected; «N תוצאות» shown.
- Step 2: URL `promo=`, the count is updated, a removable chip is shown.
- Step 3: back to «הכל», count N, no `promo` in the URL. (source: needed behavior #521d84 — «the same … on /collaborations, /my-jobs and /tenders»)

#### 1.5 Same behaviour on /my-jobs @desktop @prod-safe #521d84
**Status:** DONE 21.10 (pass) · **Case:** `.qa/tests/promo-filter/PF-1-5.md` · **File:** `tests/promo-filter/my-jobs-promo-filter.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free
**Steps:**
1. Open /my-jobs, open «מסלול קידום והפצה».
2. Choose «ללא קידום»; then remove the chip with «×».
**Expected:**
- «הכל» selected by default; a count is shown and updated after choosing; the chip appears and its removal restores «הכל» and the count. (source: needed behavior #521d84)

#### 1.6 English: the filter and its values are translated @desktop @prod-safe #521d84
**Status:** DONE 21.10 (pass) · **Case:** `.qa/tests/promo-filter/PF-1-6.md` · **File:** `tests/promo-filter/collaborations-promo-filter-en.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free
**Steps:**
1. Open /collaborations, switch the language to English.
2. Open the promotion filter section, choose the English counterpart of «קידום».
**Expected:**
- Section title and all values are in English — no Hebrew text and no raw keys (no «.» separated keys like `filters.promo…`); the default «All» value is selected before step 2. (source: AC8)
- After step 2 the count is shown in English and a removable chip appears. (source: AC4, AC7)
