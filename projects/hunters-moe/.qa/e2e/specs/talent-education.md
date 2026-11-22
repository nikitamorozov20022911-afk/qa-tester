<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Talent profile shows «השכלה» (own /profile and other roles' view) (2026-10-22)

STATUS: READY — #4ba724 (eb2ae6ae752b372a474ba724) passed QA 22.10, user moved it to «הושלם» 2026-10-22. Not generated yet.
Source of expectations: ticket «What is needed» #4ba724 — «/profile shows an "השכלה" section with the saved education entries (institution, degree, years), like "ניסיון תעסוקתי". Check also what headhunters/companies see on /profile/<id> (according to the profile's visibility)»; developer note 22.10 «anonymous profiles hide it, like work experience». Evidence: `.qa/screenshots/4ba724-*.png` (22.10: own add/edit/delete ok; PLUS hunter sees «השכלה» on open U-13; anonymous U-35 hides it; test entry removed).
Rules: one role per file; saved sessions; no fixed waits / `networkidle`; created data prefix `QA-AUTO-`, removed in the same test (`finally`/afterEach) and logged in `.qa/e2e/test-data-journal.log` if removal fails.
Known open finding (do not assert): «B.Sc. מדעי המחשב» is rendered «מדעי המחשב .B.Sc» (bidi) — compare texts after normalising order, or check institution + years only. FREE hunter gets a generic 404 on /profile/<id> (separate finding) — use hunter_plus.

---

### 1. Talent education
**Seed:** per test

#### 1.1 Own /profile: added education appears in «השכלה», removal returns the empty state @desktop @data #4ba724
**Status:** READY · **File:** `tests/talent-education/own-profile-education-card.spec.ts`
**Seed:** `tests/seed.talent.spec.ts` · **Device:** desktop · **Users:** talent (demo-talent-1, U-13, open profile)
**Steps:**
1. /profile, tab «החשבון שלי»: read the «השכלה» card.
2. «עריכה» → «ניסיון מקצועי» → «הוספת מוסד לימודים»: institution «QA-AUTO-EDU-<runId>», degree «B.Sc», field «מדעי המחשב», years 2017–2020 → save.
3. Back on /profile read the «השכלה» card.
4. Cleanup: «עריכה» → «ניסיון מקצועי» → delete the «QA-AUTO-EDU-<runId>» entry → save; read /profile again.
**Expected:**
- Step 1: card «השכלה» exists next to «ניסיון תעסוקתי» (entries or the empty text «עדיין לא הוספתם השכלה»). (source: «What is needed»)
- Step 3: «השכלה» shows an entry with «QA-AUTO-EDU-<runId>», «B.Sc» and the years 2017 and 2020, without page reload. (source: «What is needed» «institution, degree, years»)
- Step 4: the entry is gone; no broken/empty entry row remains.

#### 1.2 PLUS headhunter sees «השכלה» on an open talent profile and not on an anonymous one @desktop @prod-safe #4ba724
**Status:** READY · **File:** `tests/talent-education/hunter-sees-education-by-visibility.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts` · **Device:** desktop · **Users:** hunter_plus
**Steps:**
1. «מאגר טאלנטים» → find and open demo-talent-1 (U-13, open profile) → /profile/<id>.
2. Open the anonymous talent U-35 («QA-AUTO Talent2110», anonymous profile) → /profile/<id>.
**Expected:**
- U-13: heading «השכלה» visible (entries or the empty text «לא נוספה השכלה»), next to «ניסיון תעסוקתי». (source: «What is needed» «what headhunters/companies see … according to the profile's visibility»; developer note 22.10)
- U-35: no «השכלה» heading and no education entry (hidden like work experience). (developer note 22.10; §39 AC02 / §07 AC01)
