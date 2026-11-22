<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Headhunter profile: actions by role (2026-10-19)

STATUS: READY — #674be0 passed QA (user moved it to «הושלם», 2026-10-19). NOT generated yet: the `playwright-test` MCP was disconnected when this plan was written.
Rules: saved sessions only; no fixed waits; read-only — never click «בקש ייצוג». Guest is redirected to /login on a headhunter profile (no cell).
Profile under test: «הד האנטר דמו 3» (demo-hunter-3, U-10) — open it from /headhunters.

---

### 1. «בקש ייצוג» visibility
**Seed:** `tests/seed.talent_2.spec.ts`, `tests/seed.company_2.spec.ts`, `tests/seed.hunter_plus.spec.ts`, `tests/seed.company_6.spec.ts`, `tests/seed.admin.spec.ts`

#### 1.1 Talent sees «בקש ייצוג» on a headhunter profile @desktop @prod-safe #674be0
**Status:** READY · **Case:** `.qa/tests/headhunter-profile/HP-1-1.md` · **File:** `tests/headhunter-profile/talent-sees-request-representation.spec.ts`
**Seed:** `tests/seed.talent_2.spec.ts`
**Device:** desktop
**Users:** talent_2
**Steps:**
1. Open /headhunters and open «הד האנטר דמו 3».
2. Look at the action buttons of the profile card.
**Expected:**
- «בקש ייצוג» is visible; «שליחת הודעה» and «דיווח על הפרופיל» are also there. (source: «מה רצוי» #674be0 — «Show בקש ייצוג only to talents»)

#### 1.2 Company does not see «בקש ייצוג» @desktop @prod-safe #674be0
**Status:** READY · **Case:** `.qa/tests/headhunter-profile/HP-1-2.md` · **File:** `tests/headhunter-profile/company-no-request-representation.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts`
**Device:** desktop
**Users:** company_2
**Steps:**
1. Open /headhunters and open «הד האנטר דמו 3».
2. Look at the action buttons of the profile card.
**Expected:**
- No «בקש ייצוג» button. (source: «מה רצוי» #674be0 — «only to talents»)
- Other profile actions this role had are still there (e.g. «שליחת הודעה» if present). (§03, §51)

#### 1.3 Headhunter does not see «בקש ייצוג» on another headhunter @desktop @prod-safe #674be0
**Status:** READY · **Case:** `.qa/tests/headhunter-profile/HP-1-3.md` · **File:** `tests/headhunter-profile/headhunter-no-request-representation.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open /headhunters and open «הד האנטר דמו 3».
2. Look at the action buttons of the profile card.
**Expected:**
- No «בקש ייצוג» button. (source: «מה רצוי» #674be0 — «only to talents»)
- Other profile actions this role had are still there (e.g. «שליחת הודעה» if present). (§03, §51)

#### 1.4 HR user does not see «בקש ייצוג» @desktop @prod-safe #674be0
**Status:** READY · **Case:** `.qa/tests/headhunter-profile/HP-1-4.md` · **File:** `tests/headhunter-profile/hr-no-request-representation.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts`
**Device:** desktop
**Users:** company_6
**Steps:**
1. Open /headhunters and open «הד האנטר דמו 3».
2. Look at the action buttons of the profile card.
**Expected:**
- No «בקש ייצוג» button. (source: «מה רצוי» #674be0 — «only to talents»)
- Other profile actions this role had are still there (e.g. «שליחת הודעה» if present). (§03, §51)

#### 1.5 Admin does not see «בקש ייצוג» @desktop @prod-safe #674be0
**Status:** READY · **Case:** `.qa/tests/headhunter-profile/HP-1-5.md` · **File:** `tests/headhunter-profile/admin-no-request-representation.spec.ts`
**Seed:** `tests/seed.admin.spec.ts`
**Device:** desktop
**Users:** admin
**Steps:**
1. Open /headhunters and open «הד האנטר דמו 3».
2. Look at the action buttons of the profile card.
**Expected:**
- No «בקש ייצוג» button. (source: «מה רצוי» #674be0 — «only to talents»)
- Other profile actions this role had are still there (e.g. «שליחת הודעה» if present). (§03, §51)

#### 1.6 Company does not see «בקש ייצוג» on iPhone @iphone @prod-safe #674be0
**Status:** READY · **Case:** `.qa/tests/headhunter-profile/HP-1-6.md` · **File:** `tests/headhunter-profile/company-no-request-representation-iphone.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts`
**Device:** iphone
**Users:** company_2
**Steps:**
1. Open /headhunters and open «הד האנטר דמו 3».
2. Look at the action buttons of the profile card.
**Expected:**
- No «בקש ייצוג» button. (source: «מה רצוי» #674be0 — «only to talents»)
- Other profile actions this role had are still there (e.g. «שליחת הודעה» if present). (§03, §51)
