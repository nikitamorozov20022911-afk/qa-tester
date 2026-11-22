<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Tender offer: amount validation, view / edit / withdraw own offer (2026-10-21); owner decision with confirmation / reason / 5-minute undo (§2–3, #df647e, 2026-10-22)

STATUS: READY — #1004e9 passed QA (user moved it to «הושלם», 2026-10-21). Environment: staging.
Rules: saved sessions only; no fixed waits / `networkidle`; created data — prefix `QA-AUTO-`, cleanup in afterAll; no payments.
Messages at the amount field (QA 21.10): «יש להזין סכום בשקלים שלמים גדול מ-0» (≤ 0, fractions, non-numeric), «הסכום המרבי הוא ₪9,999,999» (above the maximum).
Withdrawing is final: «ההצעה תוסר מהמכרז, ולא תהיה אפשרות להגיש הצעה חדשה למכרז הזה» — so the edit/withdraw test always runs on a fresh QA-AUTO tender.
Not automated: headhunter (hunter_plus) edit/withdraw — PLUS allows 2 tender offers a month, a withdrawn offer cannot be re-sent (one-time); server-side check (requests with invalid amounts sent past the client) — checked by hand on 2026-10-21.

---

### 1. Offer amount validation and own offer management
**Seed:** per test

#### 1.1 Offer form rejects invalid amounts and sends nothing @desktop @prod-safe #1004e9
**Status:** WRITTEN 21.10 (manual, headless) — skips until an open offer-type tender without a company_6 offer exists · **Case:** `.qa/tests/tender-offers/TO-1-1.md` · **File:** `tests/tender-offers/offer-amount-validation.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts`
**Device:** desktop
**Users:** company_6 (HR)
**Steps:**
1. Open /tenders, open an open tender of another company where this HR has no offer yet («הגשת הצעה למכרז» form with an empty amount field «ההצעה שלי (לפרויקט) ₪»).
2. For each value: −50, 0, 12.5, 1.5, abc, 999999999, 1000000000000 — clear the field, type the value, click the submit button of the form.
3. Close the tender without sending a valid amount.
**Expected:**
- −50, 0, 12.5, 1.5, abc: the message «יש להזין סכום בשקלים שלמים, גדול מ-0» (site i18n has the comma) under the field; the field is marked as invalid. (source: needed behavior #1004e9 — «reject amounts ≤ 0, non-numeric values … decimals follow the PM rule (whole shekels)»)
- 999999999 and 1000000000000: the message «הסכום המרבי הוא ₪9,999,999». (source: needed behavior #1004e9 — «values above an agreed maximum»)
- No offer request is sent for any value (no POST to the offers endpoint; the success text «ההצעה שלכם נשלחה» never appears). Nothing is created — safe for prod.

#### 1.2 HR sees, edits and withdraws its pending offer; the company sees the exact amount — multi-role @desktop @data #1004e9
**Status:** READY · **Case:** `.qa/tests/tender-offers/TO-1-2.md` · **File:** `tests/tender-offers/hr-offer-view-edit-withdraw.spec.ts`
**Seed:** — (multi-role — пишет autotest-writer: `import { test, expect } from '../../fixtures'`, `asUser('company')`, `asUser('company_6')`)
**Device:** desktop
**Users:** company, company_6 (HR) — two roles: written by autotest-writer with `asUser`, not by the official generator
**Preconditions:** Admin tender_post = ₪0 (free tender, no payment window — if one appears, stop the test).
**Steps:**
1. company: publish a free tender «QA-AUTO-1004e9-<timestamp>» («מכרז ללא קידום», description «QA-AUTO — לא להגיש הצעות אמיתיות», deadline in a month) — ends with the tender published, no payment.
2. company_6: open that tender → «הגשת הצעה למכרז», amount 50, notes «QA-AUTO offer» → send.
3. company_6: look at the offer block.
4. company_6: «עריכת ההצעה» → amount 1.5 → «שמירת השינויים»; then amount 60 → «שמירת השינויים».
5. company: open the tender → offers.
6. company_6: «ביטול ההצעה» → confirm «ביטול ההצעה» in «לבטל את ההצעה?».
7. company: reload the tender offers.
8. Cleanup (afterAll): company closes/archives the QA-AUTO tender via the card menu; leftovers → test-data journal.
**Expected:**
- Step 3: «ההצעה שלכם נשלחה», «ממתין לתשובה מהחברה», «סכום ההצעה» «₪50 לפרויקט», date «נשלחה ב-<today>», buttons «עריכת ההצעה» and «ביטול ההצעה». (source: needed behavior #1004e9 — «HR sees its offer (amount, notes, status) … can edit or withdraw it while the status is «ממתין לתשובה»»)
- Step 4: 1.5 is blocked with «יש להזין סכום בשקלים שלמים גדול מ-0»; 60 is saved — toast «ההצעה עודכנה», the block shows «₪60 לפרויקט».
- Step 5: the company sees the HR offer with ₪60 exactly (not a changed value — the server does not transform the amount). (source: needed behavior #1004e9 — «the server never transforms the value»)
- Step 6: the HR block shows «ביטלת את ההצעה» / «ההצעה למכרז הזה בוטלה ואינה מוצגת יותר לחברה»; no offer form.
- Step 7: the HR offer is no longer shown to the company (or is shown as cancelled), «מס' הצעות» back to 0.

---

## Owner decision on a legacy money offer — confirmation, reason, 5-minute undo window (#df647e, added 2026-10-22)

STATUS: READY — #df647e passed QA 22.10 (both rejections resolved), user moved it to «הושלם» 2026-10-22. Not generated yet. Environment: staging.
Sources: session.json 22.10 (#df647e «confirm dialog name+amount; undo deadline IDT; אחר text field; bidder sees nothing during window (30s/2m/4m), decision+reason+1 notification at 5:35; approve undone never reached bidder»; test_data «T-13 offer of demo-hunter-3 rejected (אחר); T-35 approve undone (no change)»), brief `.qa/research/df647e.md` (reject 1 «needed»: confirmation naming bidder + amount, optional reason the bidder sees, undo window; reject 2 «needed»: during the window the decision is visible to the bidder nowhere, after it — decision + reason + notification; undo deadline in local time Asia/Jerusalem; «אחר» opens a free-text field), screenshots `.qa/screenshots/df647e-offer-*.png`, `df647e-bidder-*.png`. No case files — checks taken from session.json + screenshots.
Roles: `company_2` = demo-company-2, tender owner, company name «טכנו-סייבר בע״מ»; `hunter_free_2` = demo-hunter-3, bidder, shown to the owner as «הד האנטר דמו 3».
Data: **new money offers can no longer be created** (after #541d6c tenders take candidacies) — every test works on the EXISTING legacy offers of company_2 tenders: T-35 «סמנכ״ל/ית מוצר» (deadline 20.11.2026; offers «הד האנטר דמו 1» ₪150, «הד האנטר דמו 2» ₪175, «הד האנטר דמו 3» ₪200 לפרויקט — all pending on 22.10) and T-13 «מנהלי/ות תוכניות לעמותה חברתית» (deadline 22.10.2026; demo-hunter-3 offer ₪200 לשעה rejected with «אחר» 22.10). **If the needed offer is not there / not pending → `test.skip(true, '<reason>: legacy money offers cannot be created any more')`** — never fail, never try to create an offer.
22.10 rules: one role per test file (Supabase rotating refresh tokens); the cross-role flow is a CHAIN (`chain-offer-window-<N>-<role>.spec.ts`, handoff `.qa/e2e/.handoff/offer-window.json`); never touch DEMO-* data; reasons typed by tests start with `QA-AUTO-df647e-<runId>`; every decision a test makes is UNDONE inside the 5-minute window (a decision left for 5 min becomes final and the pending offer is lost for good) — leftovers → `.qa/e2e/test-data-journal.log`.
Time: browser `test.use({ timezoneId: 'Asia/Jerusalem' })`; expected «אפשר לבטל עד HH:MM» = `Intl.DateTimeFormat('he-IL', { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })` of (click time + 5 min), ±1 minute.
**SLOW / OPT-IN:** everything that has to wait real minutes (bidder during and after the window) is in §3 — skipped unless `QA_SLOW_OFFERS=1`, ~7 min, run alone. §2 has normal (fast) tests only.
Not automated: final decision delivered after the window (consumes the last pending offer of demo-hunter-3, irreversible — MANUAL 3.6); approval «next step» per PM; e-mail notifications.

---

### 2. Owner decision on a money offer — dialogs, «אחר» field, undo deadline (normal tests)
**Seed:** per test

#### 2.1 «אישור ההצעה» opens a confirmation naming the bidder and the amount; «חזרה» changes nothing @desktop #df647e
**Status:** READY (generator) · **File:** `tests/tender-offers/owner-approve-dialog-names-bidder-amount.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts` · **Device:** desktop · **Users:** company_2 (owner)
**Steps:**
1. Open the own tenders list (/tenders?mine=1, «המכרזים שלי»), open T-35 «סמנכ״ל/ית מוצר» → dialog «פרטי המכרז».
2. Block «הצעות שהוגשו (N)»: open the first offer row that shows the buttons «אישור ההצעה» and «דחיית ההצעה» (pending). If no such row on T-35 → `test.skip` «no pending legacy money offer».
3. Note the row name (e.g. «הד האנטר דמו 1») and amount (e.g. «₪150 לפרויקט»).
4. Click «אישור ההצעה».
5. Click «חזרה».
**Expected:**
- Step 4: a confirmation appears with the text «לאשר את ההצעה של <name> בסך ₪<amount> <unit>?» — contains the row name and the same ₪ amount (e.g. «לאשר את ההצעה של הד האנטר דמו 1 בסך ₪150 לפרויקט?»); nothing is applied yet: no toast, no badge «אושרה». (source: reject 1 «needed» «both actions open a confirmation dialog naming the bidder and the amount»; screenshot df647e-offer-approve-dialog)
- Step 5: the row is back to «אישור ההצעה» / «דחיית ההצעה»; no badge «אושרה» / «נדחתה»; no «ביטול ההחלטה»; no toast «ההצעה אושרה».

#### 2.2 «דחיית ההצעה»: optional reason; «אחר» opens a required free-text field; dialog states the 5-minute window; «חזרה» changes nothing @desktop #df647e
**Status:** READY (generator) · **File:** `tests/tender-offers/owner-reject-dialog-other-reason-field.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts` · **Device:** desktop · **Users:** company_2 (owner)
**Steps:**
1. As 2.1 steps 1–3 (skip if no pending row).
2. Click «דחיית ההצעה».
3. Read the confirmation; in «סיבת הדחייה (לא חובה)» choose «אחר».
4. Type «QA-AUTO-df647e check» into the new field; read the counter.
5. Click «חזרה» (do NOT click the red «דחיית ההצעה» inside the confirmation).
**Expected:**
- Step 2: text «לדחות את ההצעה של <name> בסך ₪<amount> <unit>?» with the row name and amount; label «סיבת הדחייה (לא חובה)»; note «הסיבה תוצג לצד ההצעה שנדחתה»; note «העדכון יישלח בעוד 5 דקות, ועד אז אפשר לבטל את ההחלטה.»; buttons «דחיית ההצעה» and «חזרה». (reject 1 «needed» «rejection allows an optional reason, which the bidder sees» + «a short undo window»; screenshot df647e-offer-reject-other-field)
- Step 3: choosing «אחר» shows a required field «פרטו את הסיבה *» (placeholder «הסיבה במילים שלכם», counter «0/500»). (reject 2 «needed» «אחר opens a free-text field»)
- Step 4: the counter shows the typed length («20/500»).
- Step 5: the row is back to «אישור ההצעה» / «דחיית ההצעה»; no badge «נדחתה»; no toast.

#### 2.3 Reject with «אחר» + own text → undo deadline is local (Asia/Jerusalem) time → «ביטול ההחלטה» restores the pending offer @desktop @data #df647e
**Status:** READY (generator; cleanup step must stay) · **File:** `tests/tender-offers/owner-reject-other-undo-local-deadline.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts` · **Device:** desktop · **Users:** company_2 (owner)
`test.use({ timezoneId: 'Asia/Jerusalem' })`. Use a pending row that is NOT «הד האנטר דמו 3» (that one is reserved for the slow chain §3); skip if none.
**Steps:**
1. As 2.1 steps 1–3, row «הד האנטר דמו 1» (else «הד האנטר דמו 2»).
2. «דחיית ההצעה» → reason «אחר» → field «פרטו את הסיבה» = «QA-AUTO-df647e-<runId>» → note `clickedAt = Date.now()` → click «דחיית ההצעה» in the confirmation.
3. Read the toast and the row.
4. Click «ביטול ההחלטה».
5. Cleanup (`afterEach`): if «ביטול ההחלטה» is still visible on that row — click it; if the row is decided and cannot be undone — write it to the test-data journal («T-35 <name> rejected by test, window missed»).
**Expected:**
- Step 3: toast contains «העדכון יישלח בעוד 5 דקות»; row badge «נדחתה»; text «סיבה: QA-AUTO-df647e-<runId>» (the typed text, NOT «סיבה: אחר»); button «ביטול ההחלטה»; text «אפשר לבטל עד HH:MM» where HH:MM = Jerusalem time of `clickedAt` + 5 min (±1 min) — and not the UTC time. (reject 2 «needed» «undo deadline in local time»; «אחר» text saved; screenshot df647e-offer-rejected-undo-until)
- Step 4: toast «ההחלטה בוטלה, וההצעה ממתינה לתשובה»; the row shows «אישור ההצעה» and «דחיית ההצעה» again; no badge «נדחתה», no reason line, no «ביטול ההחלטה». (reject 1 «needed» «a short undo window»; screenshot df647e-offer-undo-pending-again)

#### 2.4 Approve → toast promises a 5-minute delay → «ביטול ההחלטה» restores the pending offer @desktop @data #df647e
**Status:** READY (generator; cleanup step must stay) · **File:** `tests/tender-offers/owner-approve-undo.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts` · **Device:** desktop · **Users:** company_2 (owner)
`test.use({ timezoneId: 'Asia/Jerusalem' })`. Same row rule as 2.3 (not «הד האנטר דמו 3»; skip if none).
**Steps:**
1. As 2.1 steps 1–3.
2. «אישור ההצעה» → `clickedAt = Date.now()` → confirm «אישור ההצעה» in the confirmation.
3. Read the toast and the row.
4. Click «ביטול ההחלטה».
5. Cleanup (`afterEach`) as 2.3 step 5.
**Expected:**
- Step 3: toast «ההצעה אושרה. העדכון יישלח בעוד 5 דקות»; badge «אושרה»; «ביטול ההחלטה»; «אפשר לבטל עד HH:MM» = Jerusalem `clickedAt` + 5 min (±1). (session 22.10 run B; screenshot df647e-bidder-runB-owner-approve-toast)
- Step 4: toast «ההחלטה בוטלה, וההצעה ממתינה לתשובה»; «אישור ההצעה» / «דחיית ההצעה» back; no badge «אושרה». (screenshot df647e-bidder-runB-owner-undo-toast)

#### 2.5 Owner: a decision older than 5 minutes is final — badge + reason, no undo, no decision buttons @desktop #df647e
**Status:** READY (generator) · **File:** `tests/tender-offers/owner-final-decision-no-undo.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts` · **Device:** desktop · **Users:** company_2 (owner)
Data: T-13 «מנהלי/ות תוכניות לעמותה חברתית», row «הד האנטר דמו 3» ₪200 לשעה, rejected 22.10 with «אחר». T-13 deadline was 22.10.2026 — if T-13 / the rejected row is not reachable any more → `test.skip` «T-13 legacy offer gone». Read-only.
**Steps:**
1. Own tenders list → T-13 → «הצעות שהוגשו» → open row «הד האנטר דמו 3».
**Expected:**
- Badge «נדחתה»; a reason line starting «סיבה: QA-AUTO df647e» (free text, not «סיבה: אחר»); NO «ביטול ההחלטה» and no «אפשר לבטל עד»; no «אישור ההצעה» / «דחיית ההצעה» on this row. (reject 1 QA 21.10 «undo … disappears after»; reject 2 «after the window — decision + reason»)

#### 2.6 Bidder: a pending offer shows «ממתין לתשובה מהחברה» with the amount @desktop #df647e
**Status:** READY (generator) · **File:** `tests/tender-offers/bidder-pending-offer-waiting.spec.ts`
**Seed:** `tests/seed.hunter_free_2.spec.ts` · **Device:** desktop · **Users:** hunter_free_2 (bidder demo-hunter-3)
Read-only: never click «עריכת ההצעה» / «ביטול ההצעה» (withdrawing is final). If the T-35 offer is not pending (block shows «ההצעה שלכם לא אושרה» / «אושרה») → `test.skip` «T-35 offer already decided — legacy offers cannot be re-created».
**Steps:**
1. Open «ההצעות שלי» (tenders page, link «ההצעות שלי»); find the card «סמנכ״ל/ית מוצר» T-35.
2. Open it (arrow button) → «פרטי המכרז», block «הגשת הצעה למכרז».
**Expected:**
- Step 1: card title ends with «(ממתין לתשובה)». (screenshot df647e-bidder-baseline-mine)
- Step 2: «ההצעה שלכם נשלחה»; «ממתין לתשובה מהחברה. נעדכן אתכם באימייל ובאתר.»; «סכום ההצעה» «₪200 לפרויקט»; buttons «עריכת ההצעה», «ביטול ההצעה»; no «לא אושרה», no «סיבת הדחייה». (screenshot df647e-bidder-baseline-T-35-page; reject 2 «needed» bidder sees «ממתין לתשובה» until the decision is delivered)

#### 2.7 Bidder: a final rejection shows the decision and the owner's «אחר» text @desktop #df647e
**Status:** READY (generator) · **File:** `tests/tender-offers/bidder-rejected-offer-shows-reason.spec.ts`
**Seed:** `tests/seed.hunter_free_2.spec.ts` · **Device:** desktop · **Users:** hunter_free_2
Data: T-13 offer rejected 22.10 (reason «QA-AUTO df647e B סיבה אחרת»). If T-13 is not in «ההצעות שלי» / not reachable → `test.skip` «T-13 legacy offer gone». Read-only.
**Steps:**
1. «ההצעות שלי» → card «מנהלי/ות תוכניות לעמותה חברתית» T-13 → open.
2. Read block «הגשת הצעה למכרז».
**Expected:**
- «ההצעה שלכם לא אושרה»; «הפעם החברה לא אישרה את ההצעה…»; «סיבת הדחייה:» followed by text starting «QA-AUTO df647e» (the owner's free text, not «אחר»); «₪200 לשעה»; no «עריכת ההצעה» / «ביטול ההצעה». (reject 1 «the bidder sees the reason»; reject 2 «אחר … participant sees it»; screenshot df647e-bidder-A-7m04s-T-13-page)

---

### 3. Bidder during and after the 5-minute window — SLOW / OPT-IN CHAIN (company_2 ↔ hunter_free_2)
**Seed:** chain — `tests/seed.hunter_free_2.spec.ts` (steps 1, 3, 5), `tests/seed.company_2.spec.ts` (steps 2, 4)

Written by autotest-writer (handoff + timing code), not by the generator. **First line of every step:** `test.skip(process.env.QA_SLOW_OFFERS !== '1', 'SLOW opt-in (~7 min, real 5-minute window). Run alone: QA_SLOW_OFFERS=1 npx playwright test tests/tender-offers/chain-offer-window- --project=tests --workers=1')`. Steps 2–5 also `test.skip(!handoff, 'run the chain from step 1')`. Each step `test.setTimeout(8 * 60_000)`. Do NOT run with `-x` / `--max-failures` — step 4 (undo) must run even if step 3 fails.
Waiting: the only place where waiting for wall-clock time is allowed — `await expect.poll(() => Date.now(), { timeout }).toBeGreaterThanOrEqual(decidedAt + X)`; checks themselves still wait via `expect(...)`. No `waitForTimeout`.
Repeatable: the decision is UNDONE in step 4, so T-35 «הד האנטר דמו 3» stays pending (22.10 run B did the same with approve). Bell items of this company have no tender name — compare the COUNT of bell items containing «טכנו-סייבר» and «את ההצעה שלכם».
Handoff `.qa/e2e/.handoff/offer-window.json`: `{ runId, tender: 'T-35', bidderRow: 'הד האנטר דמו 3', baselineBell, decidedAt, deadlineText }`.

#### 3.1 CHAIN step 1 — bidder baseline: T-35 offer pending; bell count @desktop #df647e
**Status:** READY (opt-in) · **File:** `tests/tender-offers/chain-offer-window-1-hunter_free_2.spec.ts` · **Users:** hunter_free_2
**Steps:** 1. As 2.6 (skip the whole chain — no handoff written — if T-35 is not pending). 2. Open the bell «התראות», count items with «טכנו-סייבר» + «את ההצעה שלכם». 3. Write handoff `{ runId, baselineBell }`.
**Expected:** as 2.6; handoff written.

#### 3.2 CHAIN step 2 — owner rejects demo-hunter-3's T-35 offer with «אחר» @desktop @data #df647e
**Status:** READY (opt-in) · **File:** `tests/tender-offers/chain-offer-window-2-company_2.spec.ts` · **Users:** company_2
`timezoneId: 'Asia/Jerusalem'`.
**Steps:** 1. Read handoff. T-35 → row «הד האנטר דמו 3» (₪200 לפרויקט) with «דחיית ההצעה» (skip if absent). 2. «דחיית ההצעה» → «אחר» → «QA-AUTO-df647e-<runId> slow» → confirm. 3. Write `decidedAt`, `deadlineText` to handoff; `journal()` «T-35 demo-hunter-3 rejected, undo due by <deadline>».
**Expected:** toast contains «העדכון יישלח בעוד 5 דקות»; badge «נדחתה»; «אפשר לבטל עד HH:MM» = Jerusalem `decidedAt` + 5 (±1).

#### 3.3 CHAIN step 3 — during the window the bidder sees nothing: page, «ההצעות שלי», bell @desktop #df647e
**Status:** READY (opt-in) · **File:** `tests/tender-offers/chain-offer-window-3-hunter_free_2.spec.ts` · **Users:** hunter_free_2
**Steps:** 1. Read handoff. 2. Check A at ≥ `decidedAt + 30 s`, check B at ≥ `decidedAt + 2 min 30 s` (must end before `decidedAt + 4 min`; if already later — skip check B, do not fail): reload «ההצעות שלי», then T-35 block, then bell count.
**Expected (A and B):** T-35 card «(ממתין לתשובה)»; block «ההצעה שלכם נשלחה» / «ממתין לתשובה מהחברה»; no «ההצעה שלכם לא אושרה», no «QA-AUTO-df647e-<runId>»; bell count == `baselineBell`. (reject 2 «needed» «during the undo window the decision is visible to the bidder nowhere (bell, tender page, ההצעות שלי)»; session 22.10 «bidder sees nothing during window (30s/2m/4m)»)

#### 3.4 CHAIN step 4 — owner undoes before the deadline @desktop @data #df647e
**Status:** READY (opt-in) · **File:** `tests/tender-offers/chain-offer-window-4-company_2.spec.ts` · **Users:** company_2
**Steps:** 1. Read handoff; if `Date.now() > decidedAt + 4 min 40 s` → fail with «window may have closed — check T-35 demo-hunter-3 by hand» + journal. 2. T-35 → row «הד האנטר דמו 3» → «ביטול ההחלטה». 3. Write `undoneAt`; journal «undone».
**Expected:** toast «ההחלטה בוטלה, וההצעה ממתינה לתשובה»; «אישור ההצעה» / «דחיית ההצעה» back.

#### 3.5 CHAIN step 5 — after the window an undone decision never reaches the bidder @desktop #df647e
**Status:** READY (opt-in) · **File:** `tests/tender-offers/chain-offer-window-5-hunter_free_2.spec.ts` · **Users:** hunter_free_2
**Steps:** 1. Read handoff (skip if no `undoneAt`). 2. Wait until ≥ `decidedAt + 6 min`. 3. Reload «ההצעות שלי», T-35 block, bell. 4. Delete the handoff file.
**Expected:** still pending everywhere (as 3.3); bell count == `baselineBell`; no text «QA-AUTO-df647e-<runId>». (reject 1 «needed» «undo window»; session 22.10 «approve undone never reached bidder»)

#### 3.6 Final decision delivered after the window — MANUAL (consumes the offer)
**Device:** desktop · **Users:** company_2 + hunter_free_2 (two windows)
Not automated: the last pending offer of demo-hunter-3 is lost for good after this, and new money offers cannot be created. Manual checklist (done 22.10 on T-13): owner rejects with «אחר» + text → bidder at 30 s / 2 min / 4 min sees «ממתין לתשובה» → at ~5:35 the bidder sees «ההצעה שלכם לא אושרה» + «סיבת הדחייה: <text>» on the tender page and in «ההצעות שלי», and exactly ONE new bell item «לצערנו טכנו-סייבר בע״מ לא אישרו את ההצעה שלכם»; owner row has no «ביטול ההחלטה». (reject 2 «needed» «after the window — decision + reason + notification together»)
