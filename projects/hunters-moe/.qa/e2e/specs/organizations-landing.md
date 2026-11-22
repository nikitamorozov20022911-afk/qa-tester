<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — /organizations landing: CTAs by role, tender price (2026-10-21)

STATUS: READY — #b55501 and #33f14b passed QA (user moved them to «הושלם», 2026-10-21). Environment: staging.
Rules: saved sessions only (seed / `asUser`), no passwords; no fixed waits / `networkidle`; read-only — nothing is published, the tender wizard is only opened, the admin price is only read (never changed).
Not automated: changing the price in Admin (`tender_post` 0.00→1.00→0.00 was done once by hand on 2026-10-21 — it changes the price for everybody and touches payments).

---

### 1. /organizations — «publish tender» CTAs by role
**Seed:** per test (see below)

CTAs on the page (5 checked by hand on 2026-10-21): hero «פרסמו מכרז עכשיו», block «איך מפרסמים מכרז?» → «פרסמו מכרז עכשיו», bottom banner «פרסום מכרז באתר», plus the other tender-publish CTAs on the page. Each test clicks every one of them (go back to /organizations between clicks).

#### 1.1 Logged-in company: every CTA opens the tender wizard (HE) @desktop @prod-safe #b55501
**Status:** READY · **Case:** `.qa/tests/organizations-landing/OL-1-1.md` · **File:** `tests/organizations-landing/company-cta-opens-tender-wizard-he.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
**Steps:**
1. Open /organizations (Hebrew). The header shows «לוח בקרה» (logged in).
2. Click the hero CTA «פרסמו מכרז עכשיו».
3. Go back; click «פרסמו מכרז עכשיו» under «איך מפרסמים מכרז?».
4. Go back; click «פרסום מכרז באתר» in the bottom banner (and any other tender-publish CTA on the page).
**Expected:**
- After every click the URL is /publish/tender (tender wizard, step 1); never /register; no registration form is shown. (source: needed behavior #b55501 — «a logged-in company goes straight to /publish/tender»)
- Do not finish the wizard (nothing is created).

#### 1.2 Logged-in company: CTAs open the tender wizard (EN) @desktop @prod-safe #b55501
**Status:** READY · **Case:** `.qa/tests/organizations-landing/OL-1-2.md` · **File:** `tests/organizations-landing/company-cta-opens-tender-wizard-en.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
**Steps:**
1. Open /organizations, switch the language to English in the header.
2. Click every tender-publish CTA on the page (back to /organizations between clicks).
**Expected:**
- Every CTA leads to /publish/tender; none leads to /register. (source: needed behavior #b55501)

#### 1.3 Logged-in HR: CTAs lead to /tenders, not to registration @desktop @prod-safe #b55501
**Status:** READY · **Case:** `.qa/tests/organizations-landing/OL-1-3.md` · **File:** `tests/organizations-landing/hr-cta-opens-tenders.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts`
**Device:** desktop
**Users:** company_6 (HR)
**Steps:**
1. Open /organizations.
2. Click every tender-publish CTA (back between clicks).
**Expected:**
- Every CTA opens /tenders (the HR's relevant page); never /register, no registration form. (source: needed behavior #b55501 — «a logged-in HR / headhunter / talent gets their relevant page»; QA 21.10: HR → /tenders)

#### 1.4 Logged-in headhunter: CTAs lead to /tenders, not to registration @desktop @prod-safe #b55501
**Status:** READY · **Case:** `.qa/tests/organizations-landing/OL-1-4.md` · **File:** `tests/organizations-landing/headhunter-cta-opens-tenders.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open /organizations.
2. Click every tender-publish CTA (back between clicks).
**Expected:**
- Every CTA opens /tenders; never /register. (source: needed behavior #b55501; QA 21.10: hunter → /tenders)

#### 1.5 Guest: CTAs lead to registration @desktop @prod-safe #b55501
**Status:** READY · **Case:** `.qa/tests/organizations-landing/OL-1-5.md` · **File:** `tests/organizations-landing/guest-cta-opens-register.spec.ts`
**Seed:** `tests/seed.spec.ts`
**Device:** desktop
**Users:** guest
**Steps:**
1. Open /organizations without a session.
2. Click every tender-publish CTA (back between clicks).
**Expected:**
- Every CTA opens /register (registration/login). (source: needed behavior #b55501 — «a guest goes to registration/login»)

---

### 2. /organizations — tender price in «איך מפרסמים מכרז?» step 3
**Seed:** per test

#### 2.1 Step 3 shows the tender price as ₪<number>, the same in HE/EN/RU/AR @desktop @prod-safe #33f14b
**Status:** READY · **Case:** `.qa/tests/organizations-landing/OL-2-1.md` · **File:** `tests/organizations-landing/step3-tender-price-all-languages.spec.ts`
**Seed:** `tests/seed.spec.ts`
**Device:** desktop
**Users:** guest
**Steps:**
1. Open /organizations (Hebrew), scroll to «איך מפרסמים מכרז?», read the step-3 title «תשלום עבור תקופת המכרז – ₪<n>».
2. Switch the language to English, then Russian, then Arabic; read the step-3 title each time.
**Expected:**
- The step-3 title contains «₪» followed by a number (format ₪ + digits with a thousands separator, e.g. ₪0 / ₪1,200), not a text without an amount. (source: needed behavior #33f14b)
- The amount is the same in he / en / ru / ar. (source: needed behavior #33f14b — «the same amount is shown in all languages»)
- Do not hard-code ₪0 — only the format and the equality between languages.

#### 2.2 Step-3 price equals Admin «פרסום מכרז» (tender_post) @desktop @prod-safe #33f14b
**Status:** READY · **Case:** `.qa/tests/organizations-landing/OL-2-2.md` · **File:** `tests/organizations-landing/step3-price-matches-admin-tender-post.spec.ts`
**Seed:** — (multi-role — пишет autotest-writer: `import { test, expect } from '../../fixtures'`, `asUser('admin')`, `asUser('guest')`)
**Device:** desktop
**Users:** admin, guest — two roles: written by autotest-writer with `asUser`, not by the official generator
**Steps:**
1. admin: open /admin/pricing («מחירים וקופונים»), read the price of «פרסום מכרז» (tender_post). Read only — do not edit or save.
2. guest: open /organizations, read the amount in step 3 «תשלום עבור תקופת המכרז – ₪<n>» and in the bottom banner «החל מ-₪<n> לשבועיים».
**Expected:**
- The step-3 amount equals the admin tender_post price (e.g. admin 0.00 → «₪0»), and the banner «החל מ-₪<n>» shows the same amount. (source: needed behavior #33f14b — «taken dynamically from Admin > מחירים וקופונים (tender_post)… any other place … shows the same amount»; QA 21.10: 0.00 → ₪0, 1.00 → ₪1)
- No changes are made in Admin.
