<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Smart agent /recommendations: AI reasons in plural (2026-10-21)

STATUS: GENERATED 2026-10-21 — tests/smart-agent/recommendations-jobs-ai-reason-plural.spec.ts (1.1), recommendations-tenders-ai-reason-plural.spec.ts (1.2); written manually, headless; desktop 2/2 pass. **READY** — Ticket #1d74c2 (f500c96bfb9c65b4cb1d74c2) «Smart agent (/recommendations) and talent bank: "100% התאמה" on every card, AI reason invents data, unclear labels». Passed QA 21.10.2026, user moved it to «הושלם».
Source of expectations: reject rej_1792402539100 «needed behavior» (2): «One addressing form in the AI reason, the same as the page (plural "לכם/שלכם")». Items (6) plan renewal and (9) test data of the same reject are not automated (accepted by the user without them). Evidence: `.qa/screenshots/2026-10-21/1d74c2-*.png`.
Rules: read-only (do not save «הגדרות התאמה»); hunter_plus (PLUS) session; no fixed waits; do not run — only /qa-regress runs tests.

---

### 1. Smart agent recommendations
**Seed:** `tests/seed.hunter_plus.spec.ts`

#### 1.1 Job recommendations — badge and AI reason use plural address @desktop @prod-safe #1d74c2
**Device:** desktop · **Users:** hunter_plus · **Case:** `.qa/tests/smart-agent/SA-1-1.md`
**Steps:**
1. Open /recommendations (page «הסוכן החכם»).
2. Select tab «משרות (N)».
3. For each card read the badge and the AI reason line under it (italic text with the ✨ icon).
**Expected:**
- Heading «הסוכן החכם»; the banner text contains «לכם» (e.g. «מצאנו N משרות שמתאימות לכם»).
- Every card has the badge «מתאים לתחום שלכם»; no «100% התאמה».
- Every card has an AI reason line (count of reasons = count of cards).
- No AI reason contains singular forms: «שלך», « לך », «לך כי», «מתאים לך», «מתאימה לך» (regex /(^|[\s,.])(לך|שלך)([\s,.]|$)/ must not match).
- (source: reject «needed behavior» (2); current behavior quoted «"מתאים לתפקידים שלך", "מתאימה למקצוע שלך", "תואמת תחום ההתמחות שלך"»)

#### 1.2 Tender recommendations — badge and AI reason use plural address @desktop @prod-safe #1d74c2
**Device:** desktop · **Users:** hunter_plus · **Case:** `.qa/tests/smart-agent/SA-1-2.md`
**Steps:**
1. Open /recommendations.
2. Select tab «מכרזים (N)».
3. For each tender card read the badge and the AI reason line.
**Expected:**
- Banner «מצאנו N מכרזים שמתאימים לכם» (N = number in the tab).
- Every card has the badge «מתאים לתחום שלכם» and an AI reason line that starts with «מתאים לתחום שלכם:».
- No AI reason contains «מתאים לך כי», «שלך» or « לך » (same regex as 1.1).
- (source: reject «needed behavior» (2); current behavior quoted «tenders "מתאים לך כי…"»)
