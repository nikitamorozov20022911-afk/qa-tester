<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Unfinished (free) tender = draft (2026-10-21)

STATUS: READY — #bc890b passed QA (user moved it to «הושלם», 2026-10-21). Environment: staging.
Rules: saved sessions only; no fixed waits / `networkidle`; created data — title prefix `QA-AUTO-`, cleanup in afterAll; never click «פרסום המכרז», never open or confirm a payment window.
Precondition: Admin «פרסום מכרז» (tender_post) = ₪0 (free). If a payment window appears at any step — stop the test (fail with a clear message), do not pay.
Not automated: the headhunter's free promotion (ticket items Т3–Т4): one free promotion per month on the PLUS account (one-time) and it goes through the upgrade/payment window.

---

### 1. Tender drafts — «המכרזים שלי» (company)
**Seed:** `tests/seed.company.spec.ts`

#### 1.1 Unfinished tenders are listed with the mark «טיוטה – הפרסום לא הושלם» @desktop #bc890b
**Status:** DONE 21.10 (written manually, pass) · **Case:** `.qa/tests/tender-drafts/TD-1-1.md` · **File:** `tests/tender-drafts/my-tenders-shows-draft-mark.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company (demo-company-1 has unfinished tenders, e.g. T-57, T-59, T-61 on 2026-10-21)
**Steps:**
1. Open /tenders → «המכרזים שלי» (?mine=1).
**Expected:**
- At least one card has the badge «טיוטה – הפרסום לא הושלם»; none of the cards shows «ממתין לתשלום» for a free tender. (source: needed behavior #bc890b; «מה רצוי» — «An unfinished free tender is shown as "טיוטה – הפרסום לא הושלם"»)

#### 1.2 A tender stopped before «פרסום המכרז» becomes a draft and can be continued @desktop @data #bc890b
**Status:** DONE 21.10 (written manually, pass; no delete for drafts → id goes to `.qa/e2e/test-data-journal.log`) · **Case:** `.qa/tests/tender-drafts/TD-1-2.md` · **File:** `tests/tender-drafts/unfinished-tender-draft-continue.spec.ts`
**Seed:** `tests/seed.company.spec.ts`
**Device:** desktop
**Users:** company
**Steps:**
1. «+ פרסום» → «פרסום מכרז» → «מכרז ללא קידום».
2. Fill the required fields of the wizard with title «QA-AUTO-bc890b-<timestamp>» and description «QA-AUTO — לא לפרסם»; go on to step 4 (terms). Do NOT click «פרסום המכרז».
3. Open /tenders → «המכרזים שלי».
4. On the card «QA-AUTO-bc890b-<timestamp>» use the continue action («להשלמת הפרסום» / open the card).
5. Cleanup (afterAll): delete the draft via the card menu «•••» if the option exists; otherwise write its id to the test-data journal.
**Expected:**
- Step 3: the card is listed with the badge «טיוטה – הפרסום לא הושלם» (not «ממתין לתשלום»), «מס' הצעות» 0. (source: needed behavior #bc890b)
- Step 4: the wizard opens (URL /publish/tender…?id=<draft id>) with the entered title — not a new empty wizard from step 1. (source: needed behavior #bc890b — «a way to continue publishing, like unfinished jobs»)
- No payment window at any step.

#### 1.3 A draft is not visible to other users — multi-role @desktop @data #bc890b
**Status:** READY · **Case:** `.qa/tests/tender-drafts/TD-1-3.md` · **File:** `tests/tender-drafts/draft-hidden-from-others.spec.ts`
**Seed:** — (multi-role — пишет autotest-writer: `import { test, expect } from '../../fixtures'`, `asUser('company')`, `asUser('hunter_plus')`)
**Device:** desktop
**Users:** company, hunter_plus — two roles: written by autotest-writer with `asUser`, not by the official generator
**Steps:**
1. company: create a draft as in 1.2 (title «QA-AUTO-bc890b-hidden-<timestamp>», stop at step 4), read its id from the wizard URL (`id=`).
2. company: «המכרזים שלי» shows the draft card.
3. hunter_plus: /tenders → search «QA-AUTO-bc890b-hidden-<timestamp>».
4. hunter_plus: open /tenders/<draft id> directly.
5. Cleanup (afterAll): company deletes the draft via «•••» if possible; otherwise id → test-data journal.
**Expected:**
- Step 2: the draft is listed for the company with «טיוטה – הפרסום לא הושלם».
- Step 3: no card with that title in «כל המכרזים» for the headhunter.
- Step 4: the tender page is not shown (404 / not found), no offer form. (source: needed behavior #bc890b — «It is not shown to other users»)
