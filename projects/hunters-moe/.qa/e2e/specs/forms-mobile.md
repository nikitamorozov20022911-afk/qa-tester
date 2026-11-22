<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — iPhone forms: inputs ≥ 16px, fields ≥ 44px, tag field grows (2026-10-22)

STATUS: READY — #46b93c (65b58e116b9e65dad846b93c) passed QA 22.10, user moved it to «הושלם» 2026-10-22. Not generated yet.
Source of expectations: initial «needed» #46b93c — «on mobile breakpoints all inputs, selects and textareas use font-size ≥ 16px, so Safari does not zoom on focus; no maximum-scale / user-scalable hacks that block user zoom; field height ≥ 44px» + reject rej_0158803c «needed» — «on phones (<768) every field, including tag/chip, ≥44px; tags wrap, the field grows. Done: «חוזקות» ≥44px on iPhone 375»; developer note 22.10 (custom selects ≥ 44px). Evidence: `.qa/screenshots/46b93c-*.png` (22.10: «חוזקות» min 44px, grows with tags; custom selects 44px in add candidate / job wizard / profile; inputs 16px).
Rules: one role per file; `@iphone` (WebKit iPhone 13 Mini 375); nothing is saved — forms are closed with «יציאה» / X; no payment window (no card fields); no fixed waits / `networkidle`.
Measurements: for each visible `input:not([type=hidden],[type=checkbox],[type=radio],[type=file])`, `select`, `textarea` and custom select trigger (`[role=combobox]`, `button[aria-haspopup=listbox]`): computed `font-size ≥ 16px` (inputs/textarea/select) and boundingBox `height ≥ 44` (field or its visible container).
Not automated: the real Safari zoom on focus (not reproducible in WebKit emulation — manual on a real iPhone). Known open findings 22.10 (exclude from the height assertion, annotate): /profile status select 38px, reviews selects 40px, /my-candidates filter buttons 40px, dropdown options 37–38px, job wizard language select 36px.

---

### 1. Mobile form fields
**Seed:** per test

#### 1.1 Guest forms: 16px font, 44px height, zoom not blocked @iphone @prod-safe #46b93c
**Status:** READY · **File:** `tests/forms-mobile/guest-forms-font-height.spec.ts`
**Seed:** `tests/seed.spec.ts` · **Device:** iphone · **Users:** guest
**Steps:**
1. Open /login, /forgot-password, /register (first step only — do not submit).
2. Measure all fields; read `<meta name="viewport">`.
**Expected:**
- Every field font-size ≥ 16px and height ≥ 44px. (source: initial «needed»)
- Viewport meta content contains neither `maximum-scale` < 5 / `maximum-scale=1` nor `user-scalable=no`. («no maximum-scale / user-scalable hacks»)
- After focusing the e-mail field `window.visualViewport.scale` stays 1.

#### 1.2 «הוספת מועמד»: «חוזקות» tag field ≥ 44px and grows with tags; selects ≥ 44px @iphone #46b93c
**Status:** READY · **File:** `tests/forms-mobile/add-candidate-strengths-tag-field.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** iphone · **Users:** hunter_plus
**Steps:**
1. Open /my-candidates/new («הוספת מועמד»); scroll to «חוזקות»; measure the empty tag field container.
2. Type 5 tags (e.g. «QA-AUTO מנהיגות», «עבודת צוות», «Project management», «חשיבה אנליטית», «תקשורת בין-אישית»), each + Enter; measure again.
3. Measure all fields and custom selects of the form (step 1 of the dialog).
4. Close the dialog → «יציאה» (nothing saved).
**Expected:**
- Step 1: «חוזקות» container height ≥ 44px. (reject rej_0158803c «Done: «חוזקות» ≥44px on iPhone 375»)
- Step 2: height grew compared with step 1; every tag chip box lies inside the container (not clipped). («tags wrap, the field grows»)
- Step 3: all inputs font-size ≥ 16px, fields and custom selects height ≥ 44px. (initial «needed»; developer note 22.10)
- Step 4: no candidate created.

#### 1.3 «עריכת פרופיל» and job wizard step 1: 16px / 44px @iphone @prod-safe #46b93c
**Status:** READY · **File:** `tests/forms-mobile/profile-and-job-wizard-fields.spec.ts`
**Seed:** `tests/seed.company.spec.ts` · **Device:** iphone · **Users:** company
**Steps:**
1. /profile → «עריכה» («עריכת פרופיל»): measure all fields; close without saving.
2. /publish/job step 1: measure all fields; leave without «המשך» (no draft is created).
**Expected:**
- All inputs/textarea font-size ≥ 16px; fields and custom selects height ≥ 44px, except the known findings listed above (annotated). (source: initial «needed»; developer note 22.10)

#### 1.4 Admin search fields: 16px / 44px @iphone @prod-safe #46b93c
**Status:** READY · **File:** `tests/forms-mobile/admin-search-fields.spec.ts`
**Seed:** `tests/seed.admin.spec.ts` · **Device:** iphone · **Users:** admin
**Steps:**
1. Open /admin/users and /admin/applications; measure the search inputs. Open /admin/pricing; measure inputs (do not save).
**Expected:**
- font-size ≥ 16px and height ≥ 44px on every measured input. (initial «needed» «admin search and /admin/pricing»)
