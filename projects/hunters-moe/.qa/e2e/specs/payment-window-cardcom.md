<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Payment window: Cardcom card fields survive resize / rotation (2026-10-28)

STATUS: READY — #43c7ff passed QA, user confirmed «עבר QA» 2026-10-28. Not generated yet.
Source of expectations: #43c7ff «מה רצוי» — "The Cardcom card fields (number, CVV) keep working and keep their layout when the window is resized … (desktop and mobile rotation): the iframe size follows its container"; "No red error frame appears unless the entered number is really invalid". Evidence: `.qa/screenshots/43c7ff-*.png`. Cases: `.qa/tests/payment-window-cardcom/PWC-1-1..4`.
No other payment specs existed — this file is the payment-window plan; future payment-window tickets append here.

**Rules (all tests):**
- Read-only, nothing is charged. Open the window via the PLUS plan of a FREE hunter; **never type card data, never press «אישור תשלום»**; close the window with `Escape` at the end. Tag `@prod-safe @payment-window`.
- Opening the payment window: `/profile?tab=subscription` → «בחירת חבילה» → card «PLUS» → «המשך עם החבילה שנבחרה» → dialog «תשלום». If the dialog offers a saved card first, choose «כרטיס אשראי» to show the new-card form (#bc3456).
- Cardcom fields are cross-origin iframes `#CardComCardNumber` and `#CardComCvv` (ids are Cardcom's own — the only stable handle; use `page.locator('iframe#CardComCardNumber')` / `page.frameLocator(...)`). "Container" = the iframe's parent element.
- Resizes via `page.setViewportSize`; after each, wait with `expect.poll` on the measured widths (no `waitForTimeout`, no `networkidle`).
- Precondition guard: if the dialog shows «לא הצלחנו להתחבר לחברת הסליקה» the test must fail with a clear message "Cardcom unavailable (environment)" — not a layout failure.
- **Not automated (manual only):** typed digits staying fully visible after a real OS window resize/move/zoom (PWC-M-1 — agents may not type card numbers; Playwright cannot move the OS window; user checked in real Chrome 28.10) and real-iPhone rotation with typed digits (PWC-M-2, not checked). Page zoom 0.8–1.5 was checked manually only.

---

### 1. Payment window — Cardcom fields
**Seed:** `tests/seed.hunter_free_2.spec.ts`

#### 1.1 Cardcom card-number and CVV fields load in the payment window @desktop @prod-safe @payment-window #43c7ff
**File:** `tests/payment-window-cardcom/cardcom-fields-load.spec.ts`
**Device:** desktop · **Users:** hunter_free_2 (demo-hunter-3, FREE)
**Steps:**
1. Go to `/profile?tab=subscription`; click «בחירת חבילה».
2. Select the «PLUS» card; click «המשך עם החבילה שנבחרה».
3. Wait for the dialog with heading «תשלום» (choose «כרטיס אשראי» if a saved card is offered).
4. Press `Escape`.
**Expected:**
- The dialog «תשלום» is visible; text «לא הצלחנו להתחבר לחברת הסליקה» is not present. (#214b19 context)
- `iframe#CardComCardNumber` and `iframe#CardComCvv` are visible, bounding box width > 0 and height > 0; each frame contains an `input`. (#43c7ff «מה רצוי» — fields work)
- Labels «מספר כרטיס» and «CVV» visible. After `Escape` the dialog is hidden.

#### 1.2 Cardcom iframes follow their container while the window is resized 1440→800→1440→375→1440 @desktop @prod-safe @payment-window #43c7ff
**File:** `tests/payment-window-cardcom/cardcom-fields-resize-desktop.spec.ts`
**Device:** desktop (starts 1440×900) · **Users:** hunter_free_2
**Steps:**
1. Open the payment window as in 1.1 (steps 1–3).
2. For each viewport in order: 800×900, 1440×900, 375×812, 1440×900 — `page.setViewportSize(...)`, scroll each iframe into view, then measure.
3. Press `Escape`.
**Expected (after every resize):**
- For each of `#CardComCardNumber`, `#CardComCvv`: `iframe.getBoundingClientRect().width` equals the parent element's `getBoundingClientRect().width` within ±1px; iframe visible, height > 0. (#43c7ff «מה רצוי» — "the iframe size follows its container")
- `document.documentElement.scrollWidth <= document.documentElement.clientWidth` (no page horizontal overflow). (#43c7ff — layout kept)
- Empty fields show no error frame: the input inside each frame has no `aria-invalid="true"` and its computed `border-color` is not red (not R≥180 with G,B≤90); same for the iframe/container border. (#43c7ff «מה רצוי» — "No red error frame appears unless the entered number is really invalid")

#### 1.3 Cardcom iframes keep their layout on mobile rotation 375×812 ↔ 812×375 @iphone @prod-safe @payment-window #43c7ff
**File:** `tests/payment-window-cardcom/cardcom-fields-rotation-mobile.spec.ts`
**Device:** iphone (iPhone 13 Mini) · **Users:** hunter_free_2
**Steps:**
1. `page.setViewportSize({width:375,height:812})`; open the payment window as in 1.1 (steps 1–3; on mobile the plan window may need scrolling to «המשך עם החבילה שנבחרה»).
2. Rotate in order: 812×375, 375×812, 812×375, 375×812 — after each, scroll each iframe into view and measure.
3. Press `Escape`.
**Expected (after every rotation):** same three checks as 1.2 — iframe width = container width ±1px and visible; no page horizontal overflow; no red frame on the empty fields. (#43c7ff «מה רצוי» — "desktop and mobile rotation")

#### 1.4 Empty Cardcom fields still take focus after a resize, no red frame on blur @desktop @prod-safe @payment-window #43c7ff
**File:** `tests/payment-window-cardcom/cardcom-fields-focus-after-resize.spec.ts`
**Device:** desktop · **Users:** hunter_free_2
**Steps:**
1. Open the payment window as in 1.1 (steps 1–3).
2. `setViewportSize` 800×900, then 1440×900 (wait until iframe width = container width).
3. Click the input inside `#CardComCardNumber`; then click the input inside `#CardComCvv`; then click the dialog heading «תשלום» (blur). **Do not type anything.**
4. Press `Escape`.
**Expected:**
- After each click the input inside that frame is focused (`expect(frame.locator('input')).toBeFocused()`). (#43c7ff Done when — "the field … accepts input")
- After blur both empty inputs have no `aria-invalid="true"` and no red border (rule as in 1.2). (#43c7ff «מה רצוי»)

---

## Update 2026-11-07 — #cca841 close button «סגירה» on the payment step

STATUS (§2): READY — #cca841 passed QA, user confirmed and moved it to «הושלם» 2026-11-07. Not generated yet.
Source: #cca841 «מה רצוי» п.1 "The payment step has a visible close button (X, aria-label «סגירה»), like the other windows on the site"; «Done when» "on the payment step the user can close the window with one click (X)". п.2 (Escape inside the Cardcom iframes) is NOT done — developer: cross-origin iframe, keys never reach the site; the ticket allows it ("If this is impossible because of Cardcom, at least item 1") → manual case PWC-M-3, not automated. Evidence: `.qa/screenshots/cca841-*.png`. Cases: `.qa/tests/payment-window-cardcom/PWC-2-1..5`, `PWC-M-3`.
Same rules as §1: read-only, `@prod-safe`, never type card data / never press «אישור תשלום»; open the window via PLUS of hunter_free_2; if a saved card is offered choose «כרטיס אשראי». Closed state = `expect(page.getByRole('dialog')).toHaveCount(0)`.
Close button: `dialog.getByRole('button', { name: 'סגירה' })` on the «תשלום» step (header, next to the back arrow «חזרה»).

### 2. Payment window — close button and keyboard (#cca841)
**Seed:** `tests/seed.hunter_free_2.spec.ts`

#### 2.1 Close button «סגירה» on the payment step closes the whole window in one click @desktop @prod-safe @payment-window #cca841
**File:** `tests/payment-window-cardcom/close-button-closes-payment.spec.ts`
**Device:** desktop · **Users:** hunter_free_2 (demo-hunter-3, FREE)
**Steps:**
1. Open the payment window as in 1.1 (steps 1–3); wait for heading «תשלום».
2. Read the button with accessible name «סגירה» inside the dialog; click it once.
**Expected:**
- Button «סגירה» is visible on the «תשלום» step; bounding box about 36×36 (width and height ≥ 24). (#cca841 «מה רצוי» п.1)
- After ONE click no dialog is left on the page (count 0) — not a return to «בחירת חבילה». (#cca841 «Done when» — "close the window with one click (X)")

#### 2.2 Close button is reachable with Tab and closes on Enter and on Space @desktop @prod-safe @payment-window #cca841
**File:** `tests/payment-window-cardcom/close-button-keyboard.spec.ts`
**Device:** desktop · **Users:** hunter_free_2
**Steps:**
1. Open the payment window (as in 1.1); press Tab until the button «סגירה» is focused (max 15 presses; `expect(closeBtn).toBeFocused()`).
2. Press Enter.
3. Open the payment window again; Tab to «סגירה»; press Space.
**Expected:**
- «סגירה» receives keyboard focus. (#cca841 tag accessibility, «מה רצוי» п.1 "like the other windows on the site")
- Enter closes the window (0 dialogs); Space closes the window (0 dialogs).
- Not asserted: the focus ring colour (default blue, not the teal of #730ae5 — QA finding, not part of the ticket).

#### 2.3 Escape with focus in the coupon field still closes the payment window @desktop @prod-safe @payment-window #cca841
**File:** `tests/payment-window-cardcom/escape-from-coupon-closes.spec.ts`
**Device:** desktop · **Users:** hunter_free_2
**Steps:**
1. Open the payment window (as in 1.1).
2. Click the coupon input `#coupon` (do not type); `expect(page.locator('#coupon')).toBeFocused()`; press Escape.
**Expected:**
- No dialog left (0). (#cca841 «מה קיים» + developer note — "Escape still closes the window when focus is outside the two Cardcom fields")

#### 2.4 Back arrow «חזרה» on the payment step returns to plan selection @desktop @prod-safe @payment-window #cca841
**File:** `tests/payment-window-cardcom/back-returns-to-plans.spec.ts`
**Device:** desktop · **Users:** hunter_free_2
**Steps:**
1. Open the payment window (as in 1.1).
2. Click the button «חזרה» in the dialog header.
3. Close the window with «סגירה».
**Expected:**
- After «חזרה» a dialog is still open and shows the plan step: heading «בחירת חבילה», card «PLUS», button «המשך עם החבילה שנבחרה»; heading «תשלום» is gone. (#cca841 «מה קיים» — "back arrow «חזרה» to plan selection")

#### 2.5 iPhone 375×812: close button visible in the payment header, not overlapping «תשלום», tap closes @iphone @prod-safe @payment-window #cca841
**File:** `tests/payment-window-cardcom/close-button-mobile.spec.ts`
**Device:** iphone (iPhone 13 Mini, 375×812) · **Users:** hunter_free_2
**Steps:**
1. Open the payment window (as in 1.1; on mobile scroll the plan window to «המשך עם החבילה שנבחרה» if needed). Do not scroll after the «תשלום» step opens.
2. Measure the bounding boxes of the button «סגירה» and the heading «תשלום»; tap «סגירה».
**Expected:**
- «סגירה» is inside the viewport (`toBeInViewport()`), width and height ≥ 24. (#cca841 «מה רצוי» п.1; brief — mobile 375: ✕ visible and tappable)
- The two boxes do not intersect. (#cca841 — the ✕ must not cover «תשלום»)
- After the tap no dialog is left (0).

**Not automated (§2):** Escape with focus inside «מספר כרטיס» / «CVV» (PWC-M-3) — Cardcom limitation accepted by the ticket; the ✕ in the other windows with a payment step (job upgrade, tender «שירותי הפצה», NDA payment) — each needs new paid-flow data (published job / tender) and opens a draft order; checked manually only.
