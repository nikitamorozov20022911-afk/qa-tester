<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — FAQ texts on landing pages (2026-10-21)

STATUS: **READY** — Ticket #24eb58 (9efe48d779043f2a9924eb58) «Hebrew spelling mistakes repeat on many screens», item 8 (FAQ «ההד האנטרים»). Passed QA 21.10.2026. Same ticket as copywriting.md 1.1–1.3 (old 8-char hash #9efe48d7) — those read body text only; collapsed FAQ answers are not in it, so FAQ gets its own tests here. /faq for logged-in roles was checked manually (hunter_plus), not planned here (user asked guest only).
Source of expectations: reject rej_1792402661703 «needed behavior» (Done when the visible Hebrew FAQ text contains no «ההד האנטר»). Evidence: `.qa/screenshots/2026-10-21/24eb58-*.png`.
Rules: guest only (no storageState); no fixed waits / networkidle — wait for results via expect(); read-only (no @data). Do not run — only /qa-regress runs tests.

---

### 1. FAQ texts on landing pages
**Seed:** `tests/seed.spec.ts` (guest)

#### 1.1 FAQ answers have no "ההד האנטר" on /organizations @desktop @prod-safe (#24eb58)
**Device:** desktop · **Users:** guest · **Case:** `.qa/tests/faq-texts/FQ-1-1.md`
**Steps:**
1. Open /organizations as guest (Hebrew).
2. Scroll to the FAQ section («שאלות נפוצות»).
3. For each FAQ tab (including «חברות/ארגונים»): click the tab, expand every question (+) and read the answer texts.
**Expected:**
- No expanded answer and no question contains «ההד האנטר».
- Tab «חברות/ארגונים»: answer of «איך מפרסמים מכרז לאיתור הד האנטר?» contains «הד האנטרים יגישו הצעות שתוכלו להשוות».
- Tab «חברות/ארגונים»: answer of «האם אפשר לחייב NDA?» contains «שהד האנטרים יחתמו על הסכם סודיות».
- No answer is empty.
- (source: reject rej_1792402661703 «needed behavior» (Done when the visible Hebrew FAQ text contains no «ההד האנטר»))

#### 1.2 FAQ answers have no "ההד האנטר" on /headhunters @desktop @prod-safe (#24eb58)
**Device:** desktop · **Users:** guest · **Case:** `.qa/tests/faq-texts/FQ-1-2.md`
**Steps:**
1. Open /headhunters as guest (Hebrew).
2. Scroll to the FAQ section («שאלות נפוצות»).
3. For each FAQ tab (including «חברות/ארגונים»): click the tab, expand every question (+) and read the answer texts.
**Expected:**
- No expanded answer and no question contains «ההד האנטר».
- Tab «חברות/ארגונים»: answer of «איך מפרסמים מכרז לאיתור הד האנטר?» contains «הד האנטרים יגישו הצעות שתוכלו להשוות».
- Tab «חברות/ארגונים»: answer of «האם אפשר לחייב NDA?» contains «שהד האנטרים יחתמו על הסכם סודיות».
- No answer is empty.
- (source: reject rej_1792402661703 «needed behavior» (Done when the visible Hebrew FAQ text contains no «ההד האנטר»))

#### 1.3 FAQ answers have no "ההד האנטר" on /talents @desktop @prod-safe (#24eb58)
**Device:** desktop · **Users:** guest · **Case:** `.qa/tests/faq-texts/FQ-1-3.md`
**Steps:**
1. Open /talents as guest (Hebrew).
2. Scroll to the FAQ section («שאלות נפוצות»).
3. For each FAQ tab (including «חברות/ארגונים»): click the tab, expand every question (+) and read the answer texts.
**Expected:**
- No expanded answer and no question contains «ההד האנטר».
- Tab «חברות/ארגונים»: answer of «איך מפרסמים מכרז לאיתור הד האנטר?» contains «הד האנטרים יגישו הצעות שתוכלו להשוות».
- Tab «חברות/ארגונים»: answer of «האם אפשר לחייב NDA?» contains «שהד האנטרים יחתמו על הסכם סודיות».
- No answer is empty.
- (source: reject rej_1792402661703 «needed behavior» (Done when the visible Hebrew FAQ text contains no «ההד האנטר»))
