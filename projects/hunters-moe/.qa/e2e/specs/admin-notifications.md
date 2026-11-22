<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Notification event 15: report / contact → admin bell (2026-10-21)

STATUS: **READY** — Ticket #62222f (6a706481de1cc9acec62222f) «אירועי התראה — ארבעה-עשר האירועים» (PRD §15, §6.18). Passed QA 21.10.2026, user moved it to «הושלם». Only event 15 «התקבל דיווח או Feedback» is automated here (the reject was about it); other events need paid actions / new accounts / dates — manual.
Source of expectations: reject rej_1792423003501 «needed behavior» + ticket AC («כל התראה מופיעה בפעמון», «כל התראה מובילה לפריט הרלוונטי», «משתמש מקבל רק התראות השייכות לו»). Evidence: `.qa/screenshots/2026-10-21/62222f-*.png`.

**multi-role — пишет autotest-writer** (not `playwright-test-generator`): `import { test, expect } from '../../fixtures'`, one window per role via `asUser('talent')`, `asUser('admin')`, `asUser('company')`. Wait for the other role's result with `expect(...).toPass()` / `expect.poll` + page reload — no fixed pauses.
**ADMIN SAFETY (lesson L-20261020-1):** in the admin window only read: open the bell, click the ONE new notification, read /admin/reports. Never click «טופל», «בטיפול», «דחייה», «הודעה למשתמש/ת» or the status filter menu. No cleanup clicks in the admin panel.
Rules: `@data` (creates a report / contact request, run serially). Text marker `QA-AUTO-<runId>` (runId = Date.now()). Reports and contact requests cannot be deleted from the UI and the admin panel stays read-only → cleanup = add a `test.info().annotations` entry `{ type: 'qa-cleanup', description: 'report/contact QA-AUTO-<runId>' }` for the manual QA cleanup list. Do not run — only /qa-regress runs tests.

---

### 1. Admin bell for reports and contact requests
**Seed:** none — multi-role via `asUser` (`.qa/e2e/fixtures.ts`)

#### 1.1 Talent reports a job — admin gets a bell notification that opens the report @desktop @data #62222f
**Device:** desktop · **Users:** talent, admin, company · **Case:** `.qa/tests/admin-notifications/AN-1-1.md` · **multi-role — пишет autotest-writer**
**Steps:**
1. admin window: open / (site header), click the bell, count items containing «דיווח חדש:» (before = B); close the bell.
2. talent window: open /collaborations, open job J-49 «QA company post test» (owner: company demo-company-1).
3. talent: click «דיווח על המשרה», choose reason «אחר», text `QA-AUTO-<runId> report`, send.
4. admin window: reload / and open the bell until a new item appears (expect.toPass).
5. admin: click the newest item «דיווח חדש: אחר על QA company post test».
6. talent window: open the bell; company window: open / and the bell.
**Expected:**
- Step 3: toast «תודה! הדיווח נשלח לצוות Hunters».
- Step 4: the admin bell has B+1 items with «דיווח חדש:»; the new one is in the unread block (above «נקראו»), text «דיווח חדש: אחר על QA company post test», time «עכשיו» / «לפני דקה».
- Step 5: URL is /admin/reports…; page «דיווחים ופניות», tab «דיווחים»; exactly one row is shown, it has status «פתוח», type «דיווח על משרה», reporter demo-talent-1@hunters.dev, item «QA company post test», reason «אחר» and text `QA-AUTO-<runId> report`.
- Step 6: neither the talent (reporter) nor the company (job owner) has an item with «דיווח חדש» about this report.
- (source: reject «needed behavior»: «every admin user sees a new unread item in the bell … clicking it opens the report … only admins get it; the reporter and the owner of the reported item do not»)

#### 1.2 Contact form message — admin gets a bell notification that opens the request @desktop @data #62222f
**Device:** desktop · **Users:** talent, admin · **Case:** `.qa/tests/admin-notifications/AN-1-2.md` · **multi-role — пишет autotest-writer**
**Steps:**
1. talent window: open /contact.
2. Fill «שם מלא» = `QA-AUTO-<runId>`, «טלפון» = «050-000-0000», «אימייל» = demo-talent-1@hunters.dev (if not prefilled), «הודעה» = `QA-AUTO-<runId> contact test`; click «שליחה».
3. admin window: open / and the bell until the new item appears (reload + expect.toPass).
4. admin: click the item «פנייה חדשה בטופס יצירת הקשר מ-QA-AUTO-<runId>».
**Expected:**
- Step 2: toast «תודה! ההודעה נשלחה ונחזור אליכם בהקדם.»
- Step 3: an unread item «פנייה חדשה בטופס יצירת הקשר מ-QA-AUTO-<runId>» is in the admin bell.
- Step 4: URL /admin/reports…; tab «טופס יצירת קשר» is active; exactly one row: name `QA-AUTO-<runId>`, «050-000-0000», demo-talent-1@hunters.dev, status «פתוח», message `QA-AUTO-<runId> contact test`.
- (source: reject «needed behavior»: «the same for feedback, if feedback is a separate type»; «Done when sending a report from the site creates an admin bell notification that opens that report»)
