<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Mobile header (burger) menu (2026-10-21)

STATUS: **READY** — Ticket #1604a7 (d2dd44dc8c8052b9401604a7) «Mobile: the burger-menu row "Login / Register / Language" does not wrap». Passed QA 21.10.2026. Device @mobile = iPhone 13 mini (375) + Pixel 7 (412) — exactly the widths in «Done when». 320 px is NOT in scope (separate finding: /ru 320 overflow from testimonials arrows).
Source of expectations: reject 38c704da «needed behavior» (Done when: at 375 and 412 the menu row and the language list are fully visible in all 4 languages and the page does not shift). Evidence: `.qa/screenshots/2026-10-21/1604a7-*.png`.
Rules: guest only (no storageState); no fixed waits / networkidle — wait for results via expect(); read-only (no @data). Do not run — only /qa-regress runs tests.

---

### 1. Mobile header burger menu
**Seed:** `tests/seed.spec.ts` (guest)

#### 1.1 Burger menu controls and language list fit the screen (he) @mobile @prod-safe (#1604a7)
**Device:** mobile · **Users:** guest · **Case:** `.qa/tests/mobile-header-menu/MM-1-1.md`
**Steps:**
1. Open / as guest; W = window.innerWidth.
2. Tap the burger (menu) button in the header.
3. Locate the login button (Hebrew «כניסה»-type label), the sign-up button (Hebrew sign-up label) and the language switcher (עברית).
4. Tap the language switcher to open the language list.
**Expected:**
- Login, sign-up and language switcher are visible; for each boundingBox: x >= 16 and x + width <= W - 16.
- Every option of the opened language list (עברית / English / Русский / العربية) is visible and within 16..W-16.
- With the menu open and with the list open: document.documentElement.scrollWidth <= window.innerWidth (no horizontal page scroll).
- (source: reject 38c704da «needed behavior» (Done when: at 375 and 412 the menu row and the language list are fully visible in all 4 languages and the page does not shift))

#### 1.2 Burger menu controls and language list fit the screen (en) @mobile @prod-safe (#1604a7)
**Device:** mobile · **Users:** guest · **Case:** `.qa/tests/mobile-header-menu/MM-1-2.md`
**Steps:**
1. Open /en as guest; W = window.innerWidth.
2. Tap the burger (menu) button in the header.
3. Locate the login button («Log in»), the sign-up button («Sign up») and the language switcher (English).
4. Tap the language switcher to open the language list.
**Expected:**
- Login, sign-up and language switcher are visible; for each boundingBox: x >= 16 and x + width <= W - 16.
- Every option of the opened language list (עברית / English / Русский / العربية) is visible and within 16..W-16.
- With the menu open and with the list open: document.documentElement.scrollWidth <= window.innerWidth (no horizontal page scroll).
- (source: reject 38c704da «needed behavior» (Done when: at 375 and 412 the menu row and the language list are fully visible in all 4 languages and the page does not shift))

#### 1.3 Burger menu controls and language list fit the screen (ru) @mobile @prod-safe (#1604a7)
**Device:** mobile · **Users:** guest · **Case:** `.qa/tests/mobile-header-menu/MM-1-3.md`
**Steps:**
1. Open /ru as guest; W = window.innerWidth.
2. Tap the burger (menu) button in the header.
3. Locate the login button (Russian login label), the sign-up button (Russian sign-up label) and the language switcher (Русский).
4. Tap the language switcher to open the language list.
**Expected:**
- Login, sign-up and language switcher are visible; for each boundingBox: x >= 16 and x + width <= W - 16.
- Every option of the opened language list (עברית / English / Русский / العربية) is visible and within 16..W-16.
- With the menu open and with the list open: document.documentElement.scrollWidth <= window.innerWidth (no horizontal page scroll).
- (source: reject 38c704da «needed behavior» (Done when: at 375 and 412 the menu row and the language list are fully visible in all 4 languages and the page does not shift))

#### 1.4 Burger menu controls and language list fit the screen (ar) @mobile @prod-safe (#1604a7)
**Device:** mobile · **Users:** guest · **Case:** `.qa/tests/mobile-header-menu/MM-1-4.md`
**Steps:**
1. Open /ar as guest; W = window.innerWidth.
2. Tap the burger (menu) button in the header.
3. Locate the login button (Arabic login label), the sign-up button (Arabic sign-up label) and the language switcher (العربية).
4. Tap the language switcher to open the language list.
**Expected:**
- Login, sign-up and language switcher are visible; for each boundingBox: x >= 16 and x + width <= W - 16.
- Every option of the opened language list (עברית / English / Русский / العربية) is visible and within 16..W-16.
- With the menu open and with the list open: document.documentElement.scrollWidth <= window.innerWidth (no horizontal page scroll).
- (source: reject 38c704da «needed behavior» (Done when: at 375 and 412 the menu row and the language list are fully visible in all 4 languages and the page does not shift))

#### 1.5 Language switch from burger menu works without page shift @mobile @prod-safe (#1604a7)
**Device:** mobile · **Users:** guest · **Case:** `.qa/tests/mobile-header-menu/MM-1-5.md`
**Steps:**
1. Open / (he) as guest.
2. Tap burger > language switcher > «English».
3. Then from the burger menu switch to «Русский», then «العربية», then back to «עברית».
**Expected:**
- After each switch the URL prefix and <html lang> match the chosen language (/en lang=en, /ru lang=ru, /ar lang=ar, / lang=he); dir is ltr for en/ru and rtl for he/ar.
- After each switch (menu closed): document.documentElement.scrollWidth <= window.innerWidth (no horizontal page scroll).
- The header logo is fully inside the screen (boundingBox x >= 0 and x + width <= W) — before the fix the ar logo was cut by 43px.
- (source: reject 38c704da «needed behavior» (Done when: at 375 and 412 the menu row and the language list are fully visible in all 4 languages and the page does not shift))
