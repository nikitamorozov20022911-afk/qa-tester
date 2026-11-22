<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — «אימות אמינות והתחייבות» (paid verification): package toggle, FREE purchase, badge, verified chat (2026-11-08)

STATUS: READY — #1eabe4 passed QA (retest 08.11 after rej_83115d84), user moved it to «הושלם» 2026-11-08. Not generated yet. Environment: staging.
Sources: #1eabe4 «מה רצוי» / AC: "At the bottom of the Hunters PLUS and Hunters PREMIUM cards, add an on/off toggle"; "Add the same verification to the FREE card as a separate purchase"; "the price is divided by 12 months and added to the monthly package price — the exact amount, no rounding"; "blue verified checkmark badge with the text "מאומת" … "NDA Committed" on its frame"; "A verified user does not need to sign an NDA each time when working with other headhunters". Developer 05.11: toggle «+₪12.5 לחודש», FREE «רכישת האימות ב-₪150», price in Admin › מחירים וקופונים (`nda_verification`). Evidence: `.qa/screenshots/1eabe4-*.png` (r2 = 08.11). Cases: `.qa/tests/hunter-verification/HV-1-1..5`.

**Rules (all tests):**
- Account: hunter_free_2 = demo-hunter-3, FREE plan, verification bought 07.11 (user paid), valid until 07.11.2027.
- **No payment:** never press «המשך עם החבילה שנבחרה», «רכישת האימות…», «הארכה…». Close «בחירת חבילה» with its ✕ or `Escape`.
- **Prices are set by admin — never hardcode totals** (project decision 20.10). Read P (card price), D (toggle caption «+₪D לחודש») and V (FREE block «₪V ל-12 חודשים») from the page; assert `D === V/12` (compare as numbers, tolerance 1e-9 — "no rounding") and card price `=== P + D`. Parse numbers from text with `/[\d.,]+/` (strip «,»).
- Open «בחירת חבילה»: `/profile?tab=subscription` → button «בחירת חבילה» → dialog with heading «בחירת חבילה». Make sure the billing switch is on «מחיר חודשי» (if «מחיר שנתי» is active — switch it to monthly).
- Toggle = the switch next to «אימות אמינות והתחייבות» inside the card (PLUS / PREMIUM). Read its state (`aria-checked` / checked); the test toggles it and restores the initial state.
- **Not automated:** the purchase itself, auto-renewal / stop-resume in «המנוי שלי», annual package (+V once a year — open question to the client), badge on /hunters list, job cards and public profile (manual, screenshots 1eabe4-after-pay-*, r2-badge-hunters-list), reverse direction "unverified hunter → verified" (no free unverified pair), `#294851` (separate price per package — todo).

---

### 1. Verification add-on
**Seed:** `tests/seed.hunter_free_2.spec.ts`

#### 1.1 Verified hunter can write at once: «אתם מאומתים (NDA Committed) – אין צורך ב-NDA, אפשר לכתוב מיד.» in chats with headhunters without NDA @desktop @prod-safe #1eabe4
**Case:** HV-1-1 · **File:** `tests/hunter-verification/verified-chat-writable.spec.ts`
**Device:** desktop · **Users:** hunter_free_2
**Steps:**
1. Go to `/messages`; in the conversation list click «הד האנטר דמו 1» (URL becomes `/messages?c=525fb19b…` — at generation time resolve the full id and hardcode `/messages?c=<full id>` for the following runs).
2. Wait for the chat header «הד האנטר דמו 1».
3. Same for «דב האנטר» (`c=11ec1344…`).
**Expected (each chat):**
- Text «אתם מאומתים (NDA Committed) – אין צורך ב-NDA, אפשר לכתוב מיד.» is visible. (#1eabe4 AC7; user decision 07.11 "verified hunter writes at once")
- No text «ממתינים לאישור»; textbox «כתיבת הודעה» (placeholder) is enabled.
- Never type or send.

#### 1.2 Toggle on PLUS and PREMIUM adds exactly V/12 to the monthly price; off restores it @desktop @prod-safe #1eabe4
**Case:** HV-1-2 · **File:** `tests/hunter-verification/package-toggle-price.spec.ts`
**Device:** desktop · **Users:** hunter_free_2
**Steps:**
1. Open «בחירת חבילה» (monthly) — see Rules.
2. FREE card: read V from «₪V ל-12 חודשים».
3. PLUS card: read P_plus (price «₪…» above «/חודש»), toggle caption «אימות אמינות והתחייבות» + «+₪D לחודש» → D_plus. Make sure the toggle is off (switch it off if on, then re-read P_plus).
4. Turn the PLUS toggle on → read the card price; turn it off → read again.
5. Same for PREMIUM (P_premium, D_premium).
6. Restore toggles, close the dialog with ✕ / `Escape`.
**Expected:**
- Both PLUS and PREMIUM cards contain «אימות אמינות והתחייבות» with a switch. (AC1)
- `D_plus === V/12` and `D_premium === V/12` (no rounding; with V=150 → 12.5). (AC4)
- Toggle on: PLUS price === P_plus + D_plus; PREMIUM price === P_premium + D_premium (verification is not included in PREMIUM). Toggle off: back to P. (AC3, AC5)
- Dialog closed; no payment dialog «תשלום» was opened.

#### 1.3 FREE card offers the verification as a separate 12-month purchase; verified user sees «אתם מאומתים עד …» @desktop @prod-safe #1eabe4
**Case:** HV-1-3 · **File:** `tests/hunter-verification/free-card-separate-purchase.spec.ts`
**Device:** desktop · **Users:** hunter_free_2
**Steps:**
1. Open «בחירת חבילה» — see Rules; scroll to the bottom of the FREE card.
2. Close with ✕ / `Escape` (do not click any purchase button).
**Expected:**
- FREE card has the heading «אימות אמינות והתחייבות» and text matching `/₪\s?[\d.]+ ל-12 חודשים/` and «רכישה נפרדת, ללא קשר לחבילה». (AC2)
- Text matching `/אתם מאומתים עד \d{2}\.\d{2}\.\d{4}/`. (developer 05.11 — 12 months; demo-hunter-3 verified until 07.11.2027)
- A button matching `/(רכישת האימות|הארכה ב-12 חודשים) ב-₪\s?[\d.]+/` is visible; its amount equals V from the «₪V ל-12 חודשים» text. Not clicked.

#### 1.4 Own profile shows the blue medal «מאומת» / «NDA COMMITTED» @desktop @prod-safe #1eabe4
**Case:** HV-1-4 · **File:** `tests/hunter-verification/profile-verified-badge.spec.ts`
**Device:** desktop · **Users:** hunter_free_2
**Steps:**
1. Go to `/profile`; wait for the heading «הד האנטר דמו 3».
**Expected:**
- The verified medal is visible on the profile photo area: an element/img whose accessible name or text contains «מאומת», and the text «NDA COMMITTED» (case-insensitive `/NDA COMMITTED/i`) is present in the medal (SVG text / alt / aria-label — pick the stable handle at generation time). (AC6)
- Medal bounding box is inside or overlapping the profile photo box.

#### 1.5 Mobile: PLUS toggle visible and changes the price by V/12 @mobile @prod-safe #1eabe4
**Case:** HV-1-5 · **File:** `tests/hunter-verification/package-toggle-mobile.spec.ts`
**Device:** mobile (iPhone 13 Mini / Pixel 7) · **Users:** hunter_free_2
**Steps:**
1. Open «בחירת חבילה» (monthly); read V on the FREE card (scroll inside the dialog as needed).
2. Scroll to the bottom of the PLUS card; read P_plus with the toggle off; turn it on; read; turn it off.
3. Close the dialog.
**Expected:**
- The switch and the caption «אימות אמינות והתחייבות» / «+₪D לחודש» are fully inside the viewport when scrolled into view (bounding box within 0…viewport width); `document.documentElement.scrollWidth <= clientWidth`. (AC1, ticket scenario: mobile 390)
- D === V/12; price on === P_plus + D, off === P_plus. (AC4–5)
