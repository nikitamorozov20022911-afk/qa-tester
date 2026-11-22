<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Job upgrade: "already distributed" indication and re-distribution warning (2026-10-28)

STATUS: READY — #ae3aed passed QA, confirmed by the user 2026-10-28. Not generated yet. Environment: staging https://hunters-sooty.vercel.app.
Source of expectations: ticket #ae3aed «מה רצוי» p.1–4 + Done when («on J-70 the upgrade dialog says the job was already distributed on 22.10.2026, and choosing distribution again asks for confirmation before spending a distribution»); brief `.qa/research/ae3aed.md`; manual cases `.qa/tests/job-upgrade-distribution/JUD-1-1..5.md`; evidence `.qa/screenshots/ae3aed-*.png`.
Related plan: `specs/job-upgrade.md` (#1396b6 threshold, #25ee63 nothing pre-selected) — not duplicated here.

Rules:
- Login only via saved session (seed `tests/seed.hunter_plus.spec.ts`); no fixed waits, no `networkidle`; wait for results with `expect(...)`.
- READ-ONLY. NEVER click «הפצה נוספת» / «Distribute again» / «Разослать ещё раз» / «توزيع إضافي» (spends a free monthly distribution and notifies demo headhunters). NEVER click «הפעלת ההפצה» / «לרכישה» on a job that was never distributed (J-144) — there is no warning there, the click spends immediately. Close the warning only with «ביטול» (or its translation) and the popup only with «לא תודה» (or its translation).
- On J-70 «הפעלת ההפצה» may be clicked ONLY to open the warning. If the warning does not appear within the normal expect timeout, fail the test (and report — a distribution may have been spent).
- Counter «נותרו X מתוך 5 הפצות חינם החודש»: READ X at runtime (regex `נותרו (\d+) מתוך 5`), never hard-code it — it resets monthly. Compare X before/after.
- Data (hunter_plus = claude-test): J-70 «QA-AUTO 1020 C2 PLUS משרה 1» (distributed 22.10.2026) and J-144 «DEMO-4 • מנהל/ת מוצר (Product Manager)» (never distributed) must stay ACTIVE and must not be distributed by any QA action. If J-70 is ever distributed again, the expected date changes — update this plan.
- Language: via URL prefix (`/en/…`, `/ru/…`, `/ar/…`; Hebrew = no prefix).
- Tags: `@desktop` (ticket scenario desktop 1440×900), `@prod-safe` (no data created or spent). No `@data`.

Not automated: actually distributing again via «הפצה נוספת» (spends a unit, one-off — Т3, button presence asserted only); notification delivery to headhunters (§54 AC02–03); 375 px layout of the card line (ticket is not about adaptivity).

---

### 1. Job upgrade — already-distributed indication (headhunter PLUS)
**Seed:** `tests/seed.hunter_plus.spec.ts`

#### 1.1 Upgrade dialog of a distributed job shows the distribution date and counter @desktop @prod-safe #ae3aed
**Case:** `.qa/tests/job-upgrade-distribution/JUD-1-1.md` · **File:** `tests/job-upgrade-distribution/dialog-shows-already-distributed.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open «המשרות שלי»; on the card J-70 «QA-AUTO 1020 C2 PLUS משרה 1» open «•••» («פעולות משרה») → «שדרוג משרה».
2. Read the «שירותי הפצה» card. Do not select anything.
3. Click «לא תודה».
**Expected:**
- Popup «האם לשדרג את המשרה שלכם?» with subtitle «QA-AUTO 1020 C2 PLUS משרה 1».
- The «שירותי הפצה» card contains «המשרה כבר הופצה ב-22.10.2026 לכל ההד האנטרים». (source: «מה רצוי» p.1, Done when)
- The card shows a counter matching `נותרו \d+ מתוך 5 הפצות חינם החודש` (value read, not hard-coded).
- Neither service card is selected (`aria-pressed="false"`), the action button «לרכישה» is disabled. (regression #25ee63)
- After step 3 the popup is closed.

#### 1.2 Choosing distribution again shows a warning; «ביטול» spends nothing @desktop @prod-safe #ae3aed
**Case:** `.qa/tests/job-upgrade-distribution/JUD-1-2.md` · **File:** `tests/job-upgrade-distribution/redistribution-warning-cancel.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open the J-70 upgrade popup as in 1.1. Read X from «נותרו X מתוך 5 הפצות חינם החודש».
2. Click the «שירותי הפצה» card (selected). The action button reads «הפעלת ההפצה» — click it ONCE.
3. Read the warning dialog. Click «ביטול». NEVER click «הפצה נוספת».
4. Click «לא תודה». Reopen «שדרוג משרה» on J-70, read the counter again, click «לא תודה».
**Expected:**
- Step 3: a dialog with heading «להפיץ שוב את המשרה?» and text containing «המשרה כבר הופצה ב-22.10.2026» and «(נותרו X מתוך 5)» with the same X as step 1, ending «להמשיך?»; buttons «ביטול» and «הפצה נוספת» visible. (source: «מה רצוי» p.2 «warning before activation … «הפצה נוספת» / «ביטול»», Done when)
- After «ביטול» the warning is closed; no success message; the upgrade popup stays (or closes) without activation.
- Step 4: the counter is still X (not decreased). (source: Done when «asks for confirmation before spending a distribution»)

#### 1.3 Job card and «פרטי המשרה» show «הופצה ב-22.10.2026» @desktop @prod-safe #ae3aed
**Case:** `.qa/tests/job-upgrade-distribution/JUD-1-3.md` · **File:** `tests/job-upgrade-distribution/job-card-and-details-distributed-date.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open «המשרות שלי»; find the card J-70 «QA-AUTO 1020 C2 PLUS משרה 1».
2. Open the job («פרטי המשרה»).
**Expected:**
- The J-70 card contains the line «הופצה ב-22.10.2026». (source: «מה רצוי» p.3 «badge or line «הופצה ב-<date>»»)
- «פרטי המשרה» of J-70 contains «הופצה ב-22.10.2026».

#### 1.4 A never-distributed job has no "distributed" line @desktop @prod-safe #ae3aed
**Case:** `.qa/tests/job-upgrade-distribution/JUD-1-4.md` · **File:** `tests/job-upgrade-distribution/never-distributed-no-indication.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open «המשרות שלי»; find the card J-144 «DEMO-4 • מנהל/ת מוצר (Product Manager)».
2. «•••» → «שדרוג משרה». Read the «שירותי הפצה» card. Do NOT select it and do NOT click the action button.
3. Click «לא תודה».
**Expected:**
- The J-144 card has no text «הופצה ב-». (source: ticket, inverse case Т6)
- In the popup (subtitle contains «DEMO-4») the «שירותי הפצה» card shows «הפצת המשרה שלכם לכל הד האנטרים באתר Hunters» and does NOT contain «כבר הופצה».
- After step 3 the popup is closed.

#### 1.5 English: already-distributed texts and warning @desktop @prod-safe #ae3aed
**Case:** `.qa/tests/job-upgrade-distribution/JUD-1-5.md` · **File:** `tests/job-upgrade-distribution/already-distributed-en.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open «המשרות שלי» with the `/en` prefix; find the J-70 card.
2. Open the job actions «•••» → job upgrade; read the distribution card; read X from its counter.
3. Select the distribution card → click the activate-distribution button once → read the warning → click «Cancel». NEVER click «Distribute again».
4. Close the popup (English «No thanks»-type link).
**Expected:** (source: «מה רצוי» p.4 «Texts in he/en/ru/ar»)
- J-70 card: «Distributed on Oct 22, 2026».
- Distribution card: «This job was already distributed to all headhunters on Oct 22, 2026».
- Warning: heading «Distribute the job again?», text contains «already distributed on Oct 22, 2026» and «(X of 5 left)» with the same X; buttons «Cancel» and «Distribute again».
- No Hebrew text in these strings.

#### 1.6 Russian: already-distributed texts and warning @desktop @prod-safe #ae3aed
**Case:** `.qa/tests/job-upgrade-distribution/JUD-1-5.md` · **File:** `tests/job-upgrade-distribution/already-distributed-ru.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open «המשרות שלי» with the `/ru` prefix; find the J-70 card.
2. Job actions «•••» → job upgrade; read the distribution card; read X from its counter.
3. Select distribution → click the activate-distribution button once → read the warning → click «Отмена». NEVER click «Разослать ещё раз».
4. Close the popup.
**Expected:** (source: «מה רצוי» p.4)
- J-70 card: «Разослана 22.10.2026».
- Distribution card: «Вакансия уже разослана всем хедхантерам 22.10.2026».
- Warning: heading «Разослать вакансию ещё раз?», text contains «уже разослана 22.10.2026» and «(осталось X из 5)» with the same X; buttons «Отмена» and «Разослать ещё раз».

#### 1.7 Arabic: already-distributed texts and warning @desktop @prod-safe #ae3aed
**Case:** `.qa/tests/job-upgrade-distribution/JUD-1-5.md` · **File:** `tests/job-upgrade-distribution/already-distributed-ar.spec.ts`
**Device:** desktop
**Users:** hunter_plus
**Steps:**
1. Open «המשרות שלי» with the `/ar` prefix; find the J-70 card.
2. Job actions «•••» → «ترقية وظيفتك؟» popup; read the «خدمات التوزيع» card; read X from «المتبقي من التوزيعات المجانية هذا الشهر: X من 5».
3. Select «خدمات التوزيع» → click «تفعيل التوزيع» once → read the warning → click «إلغاء». NEVER click «توزيع إضافي».
4. Close the popup with «لا، شكرًا».
**Expected:** (source: «מה רצוי» p.4)
- J-70 card: «تم توزيعها في 2026/10/22».
- Distribution card: «تم توزيع الوظيفة بالفعل على جميع صائدي الكفاءات في 2026/10/22».
- Warning: heading «توزيع الوظيفة مرة أخرى؟», text contains «2026/10/22» and «(المتبقي X من 5)» with the same X; buttons «إلغاء» and «توزيع إضافي».
