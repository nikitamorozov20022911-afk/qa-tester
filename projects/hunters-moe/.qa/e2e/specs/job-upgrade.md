<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Job upgrade popup: ₪20,000 salary threshold for promotion and distribution (2026-10-21)

STATUS: GENERATED 2026-10-21 (written manually, headless; desktop 2/2 pass, retries=0). READY — #1396b6 (aff691b6d70e0702251396b6) passed QA, user moved it to «הושלם» 2026-10-21. Not generated yet. Environment: staging https://hunters-sooty.vercel.app.
Source of expectations: rejection 470b5ee9 «needed behavior» (#1396b6, §57 AC01–03) + developer note «the ₪20,000 floor applies … to job promotion/distribution (bottom of the range)»; evidence `.qa/screenshots/2026-10-21/1396b6-*.png`.
Rules: login only via saved sessions; no fixed waits, no `networkidle`; read-only — NEVER click «לרכישה» or «הפעלת הקידום» (purchase / spends the free monthly counters); close the popup only with «לא תודה»; `@prod-safe`.
Data (hunter_plus = claude-test): J-73 «QA-AUTO 1020 C2 verify שכר נמוך» (salary below 20,000) and J-70 «QA-AUTO 1020 C2 PLUS משרה 1» (salary ≥ 20,000) must stay ACTIVE — do not archive them in test-data cleanup.
Updated 2026-10-22: section 2 (#25ee63 nothing pre-selected, button names the chosen service) added — READY (passed QA 22.10, user moved to «הושלם» 2026-10-22).
Not automated: talent extras threshold (<20,000 talent not verifiable without changing a shared profile); the server-side block of a direct call; the known finding «לרכישה» stays enabled when both services are disabled (not part of the requirement).

---

### 1. Job upgrade popup (headhunter PLUS)
**Seed:** `tests/seed.hunter_plus.spec.ts`

#### 1.1 Job below ₪20,000: promotion and distribution are disabled with the threshold text @desktop @prod-safe #1396b6
**Status:** DONE · **Case:** `.qa/tests/job-upgrade/JU-1-1.md` · **File:** `tests/job-upgrade/below-threshold-services-disabled.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open «המשרות שלי»; on the card J-73 «QA-AUTO 1020 C2 verify שכר נמוך» open «•••» («פעולות משרה») → «שדרוג משרה».
2. Read the popup «האם לשדרג את המשרה שלכם?».
3. Try to select the «קידום משרה» card (click it).
4. Click «לא תודה».
**Expected:**
- Subtitle = the job title «QA-AUTO 1020 C2 verify שכר נמוך».
- Both «קידום משרה» and «שירותי הפצה» show the text «זמין למשרות עם שכר של ₪20,000 ומעלה» (with «(לפי תחילת טווח השכר)»), look disabled (greyed) and cannot be selected — after step 3 the card is not marked as selected. (source: needed behavior #1396b6 «below the threshold the option is shown disabled with an explanation … and cannot be bought»; ticket brief: text «זמין למשרות עם שכר של ₪20,000 ומעלה»)
- After step 4 the popup is closed; no payment window opened.

#### 1.2 Job at or above ₪20,000: promotion and distribution are available @desktop @prod-safe #1396b6
**Status:** DONE · **Case:** `.qa/tests/job-upgrade/JU-1-2.md` · **File:** `tests/job-upgrade/above-threshold-services-available.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. «המשרות שלי» → card J-70 «QA-AUTO 1020 C2 PLUS משרה 1» → «•••» → «שדרוג משרה».
2. Read the popup; do not click «הפעלת הקידום» / «לרכישה».
3. Click «לא תודה».
**Expected:**
- Subtitle «QA-AUTO 1020 C2 PLUS משרה 1».
- «קידום משרה» and «שירותי הפצה» are enabled: each shows its description («תווית "משרה חמה" והקפצה לראש הרשימה…», «הפצת המשרה שלכם לכל הד האנטרים באתר Hunters») and its counter/price, and the text «זמין למשרות עם שכר של ₪20,000 ומעלה» is NOT shown. (source: needed behavior #1396b6 «a job above 20,000 can [buy the restricted services]»)
- «תקופת הקידום» switch is visible; after step 3 the popup is closed and the counters are unchanged.

---

### 2. Nothing is pre-selected; the button names what will be activated (#25ee63)
**Seed:** `tests/seed.hunter_plus.spec.ts`

Source: ticket «What is needed» #25ee63 — «When «שדרוג משרה» opens, no service is pre-selected; the button is disabled until the user chooses at least one service … The action button names exactly what will be activated, e.g. «הפעלת הקידום» / «הפעלת ההפצה» / «הפעלת הקידום וההפצה» (למשל)». Evidence: `.qa/screenshots/25ee63-*.png` (22.10 J-70: nothing preselected, button «לרכישה» disabled; distribution only → «הפעלת ההפצה»; distribution counter 4/5→3/5, promotions 1/2 unchanged).
Rules: read-only — NEVER click the activate/purchase button (spends the monthly free quota: 2 promotions / 5 distributions; the 22.10 distribution on J-70 is already active). Close only with «לא תודה». Card selection = `aria-pressed`.
Not automated: «selecting only distribution activates only the distribution» (spends a free monthly unit — one-off manual check done 22.10). Known open findings (do not assert): «תקופת הקידום: שבועיים» looks checked when promotion is not selected; distribution can be selected again on a job where it is already active.

#### 2.1 Upgrade popup opens with no service selected and a disabled button @desktop @prod-safe #25ee63
**Status:** READY · **File:** `tests/job-upgrade/nothing-preselected.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. «המשרות שלי» → card J-70 «QA-AUTO 1020 C2 PLUS משרה 1» → «•••» → «שדרוג משרה».
2. Read both service cards and the action button.
3. Click «לא תודה».
**Expected:**
- «קידום משרה» and «שירותי הפצה» both have `aria-pressed="false"` (no turquoise selection). (source: «What is needed» «no service is pre-selected»)
- The action button is disabled. («disabled until the user chooses at least one service»)
- Counters «נותרו X מתוך 2 קידומים…», «נותרו Y מתוך 5 הפצות…» visible; unchanged after closing.

#### 2.2 Button label follows the selection; deselecting both disables it again @desktop @prod-safe #25ee63
**Status:** READY · **File:** `tests/job-upgrade/button-label-follows-selection.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. Open the J-70 upgrade popup as in 2.1.
2. Select only «שירותי הפצה» → read the button. Deselect it.
3. Select only «קידום משרה» → read the button.
4. Also select «שירותי הפצה» (both) → read the button.
5. Deselect both → read the button. Click «לא תודה».
**Expected:**
- Step 2: button text mentions distribution only (e.g. «הפעלת ההפצה»), not promotion; the promotion card stays `aria-pressed="false"`. (source: «What is needed» «names exactly what will be activated»; «A free quota unit is used only for a service the user selected explicitly»)
- Step 3: text mentions promotion only (e.g. «הפעלת הקידום»).
- Step 4: text mentions both (e.g. «הפעלת הקידום וההפצה»).
- Step 5: button disabled. Counters unchanged; nothing activated.
