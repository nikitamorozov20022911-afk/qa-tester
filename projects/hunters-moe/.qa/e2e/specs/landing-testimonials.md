<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Landing testimonials carousel (2026-10-21)

STATUS: **READY** — Ticket #c8f678 (39a438d74070e328ffc8f678) «Testimonials carousel: Next/Previous buttons scroll a fixed 686px and ignore RTL». Passed QA 21.10.2026. Ticket is about desktop+mobile behaviour → tests have NO device tag (run on desktop, iPhone, Android). Testimonial texts are still placeholders (agreed in #d9ffaa) — do not assert on card text, only on order/position.
Source of expectations: reject 1c88db49 «needed behavior» (Done when: each press moves exactly one card, no card skipped, arrows disabled at the ends). Evidence: `.qa/screenshots/2026-10-21/c8f678-*.png`.
Rules: guest only (no storageState); no fixed waits / networkidle — wait for results via expect(); read-only (no @data). Do not run — only /qa-regress runs tests.

---

### 1. Landing testimonials carousel
**Seed:** `tests/seed.spec.ts` (guest)

#### 1.1 Next and Previous move exactly one card (he) @prod-safe (#c8f678)
**Device:** all · **Users:** guest · **Case:** `.qa/tests/landing-testimonials/TS-1-1.md`
**Steps:**
1. Open / as guest.
2. Scroll to the testimonials section («משתמשי Hunters משתפים בחוויה שלהם»).
3. Read the ordered list of cards (DOM order) and note which card is the first one fully visible in the carousel viewport (card index i=1).
4. Press «הבא» once; then again until it becomes disabled, noting the first fully visible card after each press.
5. Press «הקודם» repeatedly until it becomes disabled, noting the first fully visible card after each press.
**Expected:**
- At start «הקודם» is disabled and «הבא» is enabled.
- Each press of «הבא» changes the first visible card from i to i+1 (moves forward in reading direction, RTL); no card is skipped, no press is a no-op while enabled.
- At the last position «הבא» is disabled (toBeDisabled or aria-disabled="true").
- Each press of «הקודם» moves back exactly one card (i to i-1); after returning to card 1 «הקודם» is disabled.
- Buttons have accessible names matching their visible action (keyboard / screen reader).
- (source: reject 1c88db49 «needed behavior» (Done when: each press moves exactly one card, no card skipped, arrows disabled at the ends))

#### 1.2 Next and Previous move exactly one card (en) @prod-safe (#c8f678)
**Device:** all · **Users:** guest · **Case:** `.qa/tests/landing-testimonials/TS-1-2.md`
**Steps:**
1. Open /en as guest.
2. Scroll to the testimonials section (English heading of the same section ("Hunters users share their experience" — take the actual text from the page)).
3. Read the ordered list of cards (DOM order) and note which card is the first one fully visible in the carousel viewport (card index i=1).
4. Press «Next» once; then again until it becomes disabled, noting the first fully visible card after each press.
5. Press «Previous» repeatedly until it becomes disabled, noting the first fully visible card after each press.
**Expected:**
- At start «Previous» is disabled and «Next» is enabled.
- Each press of «Next» changes the first visible card from i to i+1 (moves forward in reading direction, LTR); no card is skipped, no press is a no-op while enabled.
- At the last position «Next» is disabled (toBeDisabled or aria-disabled="true").
- Each press of «Previous» moves back exactly one card (i to i-1); after returning to card 1 «Previous» is disabled.
- Buttons have accessible names matching their visible action (keyboard / screen reader).
- (source: reject 1c88db49 «needed behavior» (Done when: each press moves exactly one card, no card skipped, arrows disabled at the ends))

#### 1.3 Next and Previous move exactly one card (ar) @prod-safe (#c8f678)
**Device:** all · **Users:** guest · **Case:** `.qa/tests/landing-testimonials/TS-1-3.md`
**Steps:**
1. Open /ar as guest.
2. Scroll to the testimonials section (Arabic heading of the same section).
3. Read the ordered list of cards (DOM order) and note which card is the first one fully visible in the carousel viewport (card index i=1).
4. Press «التالي» once; then again until it becomes disabled, noting the first fully visible card after each press.
5. Press «السابق» repeatedly until it becomes disabled, noting the first fully visible card after each press.
**Expected:**
- At start «السابق» is disabled and «التالي» is enabled.
- Each press of «التالي» changes the first visible card from i to i+1 (moves forward in reading direction, RTL); no card is skipped, no press is a no-op while enabled.
- At the last position «التالي» is disabled (toBeDisabled or aria-disabled="true").
- Each press of «السابق» moves back exactly one card (i to i-1); after returning to card 1 «السابق» is disabled.
- Buttons have accessible names matching their visible action (keyboard / screen reader).
- (source: reject 1c88db49 «needed behavior» (Done when: each press moves exactly one card, no card skipped, arrows disabled at the ends))
