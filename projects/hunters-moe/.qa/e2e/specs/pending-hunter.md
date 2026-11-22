<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Headhunter waiting for approval (Pending): no plans popup, no loop, logout (2026-10-22)

STATUS: READY — #bebb61 and #f1f804 passed QA 22.10, user moved them to «הושלם» 2026-10-22. Not generated yet. Environment: staging.
Sources: session.json 22.10 (#bebb61 «no plan/trial popup 6 loads; לוח בקרה -> plain pending page; en/ru ok»; #f1f804 «התנתקות on pending page, header, burger 375; cookie removed; protected pages -> /login»), briefs `.qa/research/bebb61.md`, `.qa/research/f1f804.md`, screenshots `.qa/screenshots/bebb61-*.png`, `f1f804-*.png`.
**Account:** `hunter_pending` (licor78065, status Pending) — session `auth/hunter_pending.json`, **manual login only** (`npm run qa-login:manual -- hunter_pending`; not part of `npm run qa-login`). Seed: `tests/seed.hunter_pending.spec.ts`. The Admin must NOT approve this account — every test here needs it to stay Pending.
**Guard (every test):** after `page.goto('/onboarding/pending')` — if the URL is not `/onboarding/pending` (session expired → /login, or the account was approved) → `test.skip(true, 'hunter_pending session expired or account no longer Pending — re-login manually')`.
**Order / session:** §1 and §2.1–2.2 are read-only (never click «התנתקות»). §2.3 logs out and ENDS the saved session — it is opt-in, in its own file named `zz-…` so it sorts last, and skipped unless `QA_PENDING_LOGOUT=1`. After §2.3 the session must be re-created by hand.
Rules: saved session only; no fixed waits / `networkidle` (popup absence = `expect(...).toHaveCount(0)` after the page heading is visible); nothing is created; do not run — only /qa-regress runs tests.
Known findings — NOT asserted: en heading «What a profile :)» is a literal translation (session.json findings 22.10) — the en test checks buttons and the popup only.
Not automated: plans/trial offered AFTER Admin approval (needs approving the account — irreversible for this test account); talent payment popup at the end of talent onboarding (§69, needs a new talent); `/logout` as a route («if it is a route» — not verified 22.10); logout from the header and from the burger, re-login returns to pending — each ends the session / needs the password → manual (see §3).

---

### 1. Pending headhunter: only the waiting message, no plans popup, no loop (#bebb61)
**Seed:** `tests/seed.hunter_pending.spec.ts`

#### 1.1 Pending page shows the waiting message without the «בחירת חבילה» / PREMIUM trial popup on repeated loads @desktop @prod-safe #bebb61
**Status:** READY · **File:** `tests/pending-hunter/pending-page-no-plans-popup.spec.ts`
**Seed:** `tests/seed.hunter_pending.spec.ts`
**Device:** desktop
**Users:** hunter_pending
**Steps:**
1. Open /onboarding/pending (guard above).
2. Wait for the heading «איזה פרופיל יש לכם :)».
3. Reload the page 3 times; after each load wait for the same heading.
**Expected:**
- Every load: heading «איזה פרופיל יש לכם :)», text containing «אנחנו בודקים את הפרטים והמסמכים שלכם», buttons «לעמוד הבית» and «התנתקות» visible. (source: «מה רצוי» «A pending headhunter sees only the waiting message (and logout / contact)»)
- Every load: no dialog «בחירת חבילה»; no text «30 יום ניסיון חינם», «להתחלת תקופת הניסיון», «₪280», «₪320»; `getByRole('dialog')` count 0. (source: «מה רצוי» «without the plan purchase / trial popup; plans are offered only after approval»; QA 22.10 «no plan/trial popup 6 loads»)

#### 1.2 «לעמוד הבית» → header «לוח בקרה» returns to the plain pending page, no popup, every time @desktop @prod-safe #bebb61
**Status:** READY · **File:** `tests/pending-hunter/dashboard-link-no-loop-popup.spec.ts`
**Seed:** `tests/seed.hunter_pending.spec.ts`
**Device:** desktop
**Users:** hunter_pending
**Steps:**
1. Open /onboarding/pending (guard) → click «לעמוד הבית».
2. On the home page: read the header (do not click «התנתקות»).
3. Click the header button «לוח בקרה».
4. Repeat steps 1–3 once more (second round).
**Expected:**
- Step 1: URL leaves /onboarding (home page «/» or «/he»); hero «ברוכים הבאים ל-» visible; no dialog «בחירת חבילה».
- Step 2: header has «לוח בקרה» and «התנתקות» (no «התחברות»).
- Step 3 (both rounds): URL `/onboarding/pending`; heading «איזה פרופיל יש לכם :)» visible; no dialog «בחירת חבילה», no text «30 יום ניסיון חינם». (source: «מה רצוי» «"לוח בקרה" … show the pending message directly, without a loop»; QA 22.10 «לוח בקרה -> plain pending page»)

#### 1.3 Pending page in English and Russian: no plans popup, home and logout buttons translated @desktop @prod-safe #bebb61
**Status:** READY · **File:** `tests/pending-hunter/pending-page-en-ru-no-popup.spec.ts`
**Seed:** `tests/seed.hunter_pending.spec.ts`
**Device:** desktop
**Users:** hunter_pending
**Steps:**
1. Open /onboarding/pending (guard).
2. Language switcher «עברית» → «English»; wait for the button «Log out».
3. Language switcher → «Русский»; wait for the button «Выйти».
4. Cleanup (finally): switch back to «עברית»; heading «איזה פרופיל יש לכם :)» visible.
**Expected:**
- English: buttons «Go to home page» and «Log out»; text containing «We are reviewing your details and documents»; no `dialog`, no text «free trial» / «PREMIUM». (Heading text NOT asserted — known finding «What a profile :)».)
- Russian: buttons «На главную» and «Выйти»; text containing «Мы проверяем ваши данные и документы»; no `dialog`, no text «PREMIUM». (source: QA 22.10 «en/ru ok»; «מה רצוי» no plans popup before approval)
- URL stays on /onboarding/pending (any locale prefix) after each switch.

---

### 2. Pending headhunter can log out (#f1f804)
**Seed:** `tests/seed.hunter_pending.spec.ts`

#### 2.1 «התנתקות» is offered on the pending page and in the home header @desktop @prod-safe #f1f804
**Status:** READY · **File:** `tests/pending-hunter/logout-offered-page-and-header.spec.ts`
**Seed:** `tests/seed.hunter_pending.spec.ts`
**Device:** desktop
**Users:** hunter_pending
**Steps:**
1. Open /onboarding/pending (guard); read the buttons.
2. Click «לעמוד הבית»; read the header.
3. Do NOT click «התנתקות».
**Expected:**
- Step 1: button «התנתקות» visible and enabled next to «לעמוד הבית». (source: «מה רצוי» «a "התנתקות" action on the pending page and/or in the header»)
- Step 2: header has the button «התנתקות» (next to «לוח בקרה»), visible and enabled. (same source; QA 22.10 «header»)

#### 2.2 Mobile: «התנתקות» in the burger menu and on the pending page @iphone @prod-safe #f1f804
**Status:** READY · **File:** `tests/pending-hunter/logout-offered-mobile-burger.spec.ts`
**Seed:** `tests/seed.hunter_pending.spec.ts`
**Device:** iphone (project `iphone`, 375 px)
**Users:** hunter_pending
**Steps:**
1. Open /onboarding/pending (guard); read the buttons.
2. Click «לעמוד הבית» → on the home page click the burger «פתיחת תפריט».
3. Read the opened menu; close it (the «×» button / Escape). Do NOT click «התנתקות».
**Expected:**
- Step 1: «התנתקות» visible inside the viewport (boundingBox within 0…viewport width/height after scrollIntoViewIfNeeded) and enabled.
- Step 3: the menu shows «לוח בקרה» and «התנתקות» (visible, enabled). (source: «מה רצוי»; Т4 of the brief «mobile width: logout available in the burger/on the page»; QA 22.10 «burger 375»)

#### 2.3 OPT-IN, ENDS THE SESSION — «התנתקות» on the pending page signs the user out; protected pages require login @desktop @data #f1f804
**Status:** READY — opt-in, run LAST and alone · **File:** `tests/pending-hunter/zz-logout-ends-session.spec.ts`
**Seed:** `tests/seed.hunter_pending.spec.ts`
**Device:** desktop
**Users:** hunter_pending
First line of the test: `test.skip(process.env.QA_PENDING_LOGOUT !== '1', 'Ends the saved hunter_pending session (manual login only). Run alone: QA_PENDING_LOGOUT=1 npx playwright test tests/pending-hunter/zz-logout --project=tests')`.
**Steps:**
1. Open /onboarding/pending (guard).
2. Click «התנתקות».
3. Read cookies of the context (`context.cookies()`).
4. Open /onboarding/pending directly.
5. Open /profile directly.
6. Annotate: «hunter_pending session ended — re-login: npm run qa-login:manual -- hunter_pending».
**Expected:**
- Step 2: URL leaves /onboarding (home page); toast «התנתקת מהחשבון»; header shows «התחברות» and «הרשמה», no «לוח בקרה», no «התנתקות». (source: «מה רצוי» «signs the user out and goes to the home page / login»; screenshot f1f804-after-logout-desktop)
- Step 3: no cookie whose name matches `/^sb-.*-auth-token/`. (QA 22.10 «cookie removed»)
- Steps 4–5: redirected to /login — heading «התחברות», fields «האימייל שלכם» / «הסיסמה שלכם» visible; not /onboarding/pending. (source: Т2 «the session is really closed»; QA 22.10 «protected pages -> /login»; screenshot f1f804-pending-after-logout-desktop)

---

### 3. MANUAL (not for the generator)
**Seed:** — (each ends the session or needs the password)

#### 3.1 Logout from the home header and from the burger (375) @desktop @mobile #f1f804 — MANUAL
**Users:** hunter_pending (re-login by hand before each)
**Steps:** home → header «התנתקות»; re-login; 375 px → burger «פתיחת תפריט» → «התנתקות».
**Expected:** same as 2.3 (home page, «התחברות»/«הרשמה», protected pages → /login).

#### 3.2 Re-login of a pending headhunter lands on /onboarding/pending without the plans popup @desktop #bebb61 #f1f804 — MANUAL
**Users:** hunter_pending (password from `.qa/accounts.env`, typed by the user / manual-login)
**Expected:** after login → /onboarding/pending, waiting message, no «בחירת חבילה».
