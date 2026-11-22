<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Test-data cleanup: no traces of deleted jobs (2026-11-08)

STATUS: READY — #2b0521 passed QA (retest 08.11 after rej_8aad1e88), user moved it to «הושלם» 2026-11-08. Not generated yet. Environment: staging.
Sources: #2b0521 AC3 "Related data of the deleted jobs/collaborations (e.g. submissions) is removed so no broken references remain", AC5 "Jobs and collaborations screens open without errors"; rejection 07.11 "Done when: demo-hunter-2 opens the bell and there is no «המשרה „QA test”…» notification". Evidence: `.qa/screenshots/2b0521-r2-*.png`. Cases: `.qa/tests/jobs-cleanup/JC-1-1, JC-1-2`.

**Not asserted:** empty lists — new QA jobs J-148/149/150 were published after the cleanup (07.11); 45 accounts / all roles log in (manual, no passwords in tests); tender notification soft-404 and admin tender i18n key (separate findings, not this ticket).

---

### 1. Jobs cleanup — no stale job data
**Seed:** `tests/seed.hunter_free.spec.ts`

#### 1.1 Bell of demo-hunter-2 has no notifications about the deleted job «QA test» @desktop @prod-safe #2b0521
**Case:** JC-1-1 · **File:** `tests/jobs-cleanup/bell-no-deleted-job-notices.spec.ts`
**Device:** desktop · **Users:** hunter_free (demo-hunter-2)
**Steps:**
1. Go to `/`; click the bell button (accessible name starts with «התראות»).
2. Wait for the panel with heading «התראות».
3. Scroll the notifications list to the end: scroll the last item into view, repeat until the number of items stops growing (`expect.poll` on the count, no fixed waits).
**Expected:**
- The panel text does not match `/המשרה\s*[„"“]QA test/` and does not contain «„QA test”». (#2b0521 AC3; rejection 07.11 "Done when … no «המשרה „QA test”…» notification")
- In particular no «המשרה „QA test” הסתיימה ולא מוצגת יותר» and no «המשרה „QA test” מסתיימת בעוד יומיים».

#### 1.2 «משרות» (/collaborations) and «המשרות שלי» (/my-jobs) open without errors @desktop @prod-safe #2b0521
**Case:** JC-1-2 · **File:** `tests/jobs-cleanup/jobs-screens-open.spec.ts`
**Device:** desktop · **Users:** hunter_free (demo-hunter-2)
**Steps:**
1. Collect `page.on('pageerror')`.
2. Go to `/collaborations`; wait for the page heading/main content.
3. Go to `/my-jobs`; wait for the page heading/main content (list of the user's jobs or the empty state «עדיין לא פרסמתם משרות»).
**Expected:**
- Both navigations respond with status < 400; main content is visible (not a blank page); no error text («שגיאה», «Something went wrong», «Application error»). (#2b0521 AC5)
- No uncaught page errors were collected. (AC5 "without errors")
- Do not assert empty lists (see header).
