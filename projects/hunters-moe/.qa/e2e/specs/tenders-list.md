<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Tenders list: filters and sort (2026-10-19, updated 2026-10-21)

STATUS: READY — #5adfe3 passed QA (user moved it to «הושלם», 2026-10-19). NOT generated yet: the `playwright-test` MCP was disconnected when this plan was written.
Rules: saved sessions only; no fixed waits; read-only.
Known finding 2026-10-18 (sort on «המכרזים שלי» did not change the order) was fixed in #0d978b (passed QA, «הושלם» 2026-10-21) — now covered by section 2 below; tests 1.x still assert only the label.
Updated 2026-10-21: sections 2 (#0d978b) and 3 (#9a6100) added — READY.

---

### 1. Tenders list
**Seed:** `tests/seed.company_2.spec.ts`, `tests/seed.hunter_plus.spec.ts`

#### 1.1 No budget filter and the selected sort is shown — company @desktop @prod-safe #5adfe3
**Status:** READY · **Case:** `.qa/tests/tenders-list/TL-1-1.md` · **File:** `tests/tenders-list/no-budget-filter-sort-label-company.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts`
**Device:** desktop
**Users:** company_2
**Steps:**
1. Open /tenders («כל המכרזים»), look at the «מסננים» panel.
2. Open «מיין לפי» and choose «תוקף קרוב».
3. Open «המכרזים שלי», open «מיין לפי» and choose another option.
**Expected:**
- No «תקציב» filter (the ticket allows removing it instead of showing the budget). (source: «מה רצוי» #5adfe3)
- The button shows «מיין לפי תוקף קרוב» after step 2 and the chosen option after step 3.
- «כל המכרזים» cards are ordered by «תאריך תוקף» ascending after step 2.

#### 1.2 No budget filter and the selected sort is shown — headhunter @desktop @prod-safe #5adfe3
**Status:** READY · **Case:** `.qa/tests/tenders-list/TL-1-2.md` · **File:** `tests/tenders-list/no-budget-filter-sort-label-headhunter.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open /tenders, look at «מסננים».
2. «מיין לפי» → «תוקף קרוב».
**Expected:**
- No «תקציב» filter; the button shows «מיין לפי תוקף קרוב». (source: «מה רצוי» #5adfe3)

#### 1.3 Tenders on iPhone: no budget filter, sort label shown @iphone @prod-safe #5adfe3
**Status:** READY · **Case:** `.qa/tests/tenders-list/TL-1-3.md` · **File:** `tests/tenders-list/no-budget-filter-sort-label-iphone.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts`
**Device:** iphone
**Users:** company_2
**Steps:**
1. Open /tenders, open the filters panel.
2. «מיין לפי» → «תוקף קרוב».
**Expected:**
- No «תקציב» in the filters panel; the sort button shows the chosen option. (source: «מה רצוי» #5adfe3; ticket screenshots were taken in a narrow window)

---

### 2. «המכרזים שלי» — sort changes the order (#0d978b)
**Seed:** `tests/seed.company_2.spec.ts` (hunter test — `tests/seed.hunter_plus.spec.ts`)

Data: demo-company-2 has ≥ 6 own tenders with different creation dates, «תאריך תוקף» and «מס' הצעות» (T-13, T-28, T-4, T-32, T-35, T-36 on 2026-10-18). Read the values from the cards: creation date — after the company name in the card header («ספר פארם • 11.09.2026»), «תאריך תוקף», «מס' הצעות». Cards without a date («–», drafts) are ignored in the order check.

#### 2.1 «המכרזים שלי» — «החדשים ביותר» sorts by creation date, newest first @desktop @prod-safe #0d978b
**Status:** READY · **Case:** `.qa/tests/tenders-list/TL-2-1.md` · **File:** `tests/tenders-list/my-tenders-sort-newest.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts`
**Device:** desktop
**Users:** company_2
**Steps:**
1. Open /tenders → tab «המכרזים שלי» (URL ?mine=1).
2. «מיון לפי» → «החדשים ביותר» (default).
**Expected:**
- The button shows «החדשים ביותר»; card creation dates go from newest to oldest (non-increasing). (source: needed behavior #0d978b)

#### 2.2 «המכרזים שלי» — «תוקף קרוב» sorts by end date, closest first @desktop @prod-safe #0d978b
**Status:** READY · **Case:** `.qa/tests/tenders-list/TL-2-2.md` · **File:** `tests/tenders-list/my-tenders-sort-deadline.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts`
**Device:** desktop
**Users:** company_2
**Steps:**
1. /tenders → «המכרזים שלי».
2. «מיון לפי» → «תוקף קרוב».
**Expected:**
- URL contains `mine=1` and `sort=deadline`; the button shows «תוקף קרוב».
- «תאריך תוקף» of the cards is non-decreasing (closest first). (source: needed behavior #0d978b)

#### 2.3 «המכרזים שלי» — «הכי הרבה הצעות» sorts by number of offers, most first @desktop @prod-safe #0d978b
**Status:** READY · **Case:** `.qa/tests/tenders-list/TL-2-3.md` · **File:** `tests/tenders-list/my-tenders-sort-offers.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts`
**Device:** desktop
**Users:** company_2
**Steps:**
1. /tenders → «המכרזים שלי».
2. «מיון לפי» → «הכי הרבה הצעות».
**Expected:**
- URL contains `sort=offers`; «מס' הצעות» of the cards is non-increasing. (source: needed behavior #0d978b)

#### 2.4 «המכרזים שלי» — sort kept after reload and on direct URL @desktop @prod-safe #0d978b
**Status:** READY · **Case:** `.qa/tests/tenders-list/TL-2-4.md` · **File:** `tests/tenders-list/my-tenders-sort-reload-direct-url.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts`
**Device:** desktop
**Users:** company_2
**Steps:**
1. Open /tenders?mine=1&sort=deadline directly.
2. Reload the page.
3. Open /tenders?mine=1&sort=offers directly.
**Expected:**
- After steps 1 and 2: «המכרזים שלי» is active, the button shows «תוקף קרוב», «תאריך תוקף» non-decreasing.
- After step 3: the button shows «הכי הרבה הצעות», «מס' הצעות» non-increasing. (source: needed behavior #0d978b — «kept after reload and when the URL with ?sort= is opened directly»)

#### 2.5 «ההצעות שלי» (headhunter) — sort works the same way @desktop @prod-safe #0d978b
**Status:** READY · **Case:** `.qa/tests/tenders-list/TL-2-5.md` · **File:** `tests/tenders-list/my-offers-sort-deadline-headhunter.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. /tenders → «ההצעות שלי».
2. «מיון לפי» → «תוקף קרוב»; then «הכי הרבה הצעות».
**Expected:**
- With «תוקף קרוב» the «תאריך תוקף» values are non-decreasing; with «הכי הרבה הצעות» the «מס' הצעות» values are non-increasing (check only if ≥ 2 cards). (source: needed behavior #0d978b — «If "ההצעות שלי" has the same sort, it works the same way»)

---

### 3. Field chips on /tenders — multi-select, in sync with the sidebar (#9a6100)
**Seed:** `tests/seed.hunter_free.spec.ts`

Chips used: «טכנולוגיה, מוצר, דאטה ומערכות מידע» (`technology`), «בריאות, מדעי החיים וביוטכנולוגיה» (`health`). Results count — text «N תוצאות» above the list. Sidebar — «מסננים» → «תחומי התמחות» checkboxes.

#### 3.1 Two chips are active together (OR), list matches the sidebar result @desktop @prod-safe #9a6100
**Status:** READY · **Case:** `.qa/tests/tenders-list/TL-3-1.md` · **File:** `tests/tenders-list/field-chips-multi-select.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free
**Steps:**
1. Open /tenders («כל המכרזים»). Note «N תוצאות» with «כל התחומים».
2. Click chip «טכנולוגיה, מוצר, דאטה ומערכות מידע». Note the count A.
3. Click chip «בריאות, מדעי החיים וביוטכנולוגיה».
**Expected:**
- After step 3 both chips are highlighted (active); «כל התחומים» is not active; URL `fields` contains both `technology` and `health`. (source: needed behavior #9a6100)
- In the sidebar both checkboxes are checked, the others are not.
- The count after step 3 ≥ A, and every card has one of the two fields (OR logic, same as the sidebar).

#### 3.2 Clicking an active chip removes only it; none selected → «כל התחומים» @desktop @prod-safe #9a6100
**Status:** READY · **Case:** `.qa/tests/tenders-list/TL-3-2.md` · **File:** `tests/tenders-list/field-chips-remove-one.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free
**Steps:**
1. Open /tenders?fields=technology,health.
2. Click the active chip «בריאות, מדעי החיים וביוטכנולוגיה».
3. Click the active chip «טכנולוגיה, מוצר, דאטה ומערכות מידע».
**Expected:**
- After step 2 only «טכנולוגיה…» stays active (chip and checkbox), URL `fields=technology`.
- After step 3 no field is selected, «כל התחומים» is active, no sidebar checkbox is checked, the count equals the unfiltered count. (source: needed behavior #9a6100)

#### 3.3 Sidebar checkboxes → chips in sync; kept after direct URL and reload @desktop @prod-safe #9a6100
**Status:** READY · **Case:** `.qa/tests/tenders-list/TL-3-3.md` · **File:** `tests/tenders-list/field-chips-sidebar-sync.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free
**Steps:**
1. Open /tenders, tick «טכנולוגיה…» and «בריאות…» in the sidebar «תחומי התמחות».
2. Reload the page.
3. Open the same URL in a new page (direct URL).
**Expected:**
- After each step both chips are highlighted and both checkboxes checked; «כל התחומים» not active; the count is the same as after step 1. (source: needed behavior #9a6100 — «chips and checkboxes always show the same selection … also after opening the URL directly or reloading»)

#### 3.4 Chips combine on iPhone (RTL) @iphone @prod-safe #9a6100
**Status:** READY · **Case:** `.qa/tests/tenders-list/TL-3-4.md` · **File:** `tests/tenders-list/field-chips-multi-select-iphone.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** iphone
**Users:** hunter_free
**Steps:**
1. Open /tenders on iPhone.
2. Tap chip «טכנולוגיה…», then chip «בריאות…» (scroll the chip row if needed).
3. Open the filters panel.
**Expected:**
- Both chips active; URL `fields` has both values; in the filters panel both checkboxes are checked; the page has no horizontal scroll (document width ≤ viewport). (source: needed behavior #9a6100 — «works the same on desktop and mobile, RTL»)
