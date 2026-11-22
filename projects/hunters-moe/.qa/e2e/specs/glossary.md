<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Glossary: one term per concept (2026-10-21)

STATUS: **READY** — Ticket #cf108e (47533803e7a5d6d05ecf108e) «The same things are called by different words … one glossary is needed». Passed QA 21.10.2026 (all roles incl. headhunter, 14 headhunter pages), user moved it to «הושלם».
Source of expectations: reject rej_1792420448716 «needed behavior» (3 items: candidate salary «ציפיות שכר», «מועמדים שהוגשו», no double ה before «הד האנטר»). Out of scope (agreed in the reject): «שיתוף פעולה» on /headhunters, «דיסקרטי» as an adjective, MentMe footer. Evidence: `.qa/screenshots/2026-10-21/cf108e-*.png`.
Related entries already in `copywriting.md` (same ticket, old hash #47533803): 1.4 «One term per entity on publish flow», 1.5 «Brand written one way» — not repeated here.
Rules: read-only (forms are opened, never saved); saved sessions only; no fixed waits; do not run — only /qa-regress runs tests. Tests 1.3–1.5 depend on staging demo data (J-40, J-49).

---

### 1. Glossary by role
**Seed:** `tests/seed.spec.ts` (guest), `tests/seed.company.spec.ts`, `tests/seed.talent.spec.ts`, `tests/seed.hunter_plus.spec.ts`

#### 1.1 Public pages have no double ה before «הד האנטר» @desktop @prod-safe #cf108e
**Device:** desktop · **Users:** guest · **Case:** `.qa/tests/glossary/GL-1-1.md`
**Steps:**
1. Open /organizations as guest; read document.body.innerText.
2. Repeat for /, /headhunters, /talents, /about.
**Expected:**
- No page contains «ההד האנטר» (covers «ההד האנטרים», «ההד האנטרית»).
- /organizations contains «הד האנטרים יגישו הצעות» (or another wording without «ההד האנטר»).
- (source: reject «needed behavior» 3: «No double ה before "הד האנטר": "הד האנטרים יגישו הצעות שתוכלו להשוות"»)

#### 1.2 Companies FAQ has no double ה before «הד האנטר» @desktop @prod-safe #cf108e
**Device:** desktop · **Users:** company · **Case:** `.qa/tests/glossary/GL-1-2.md`
**Steps:**
1. Open /faq (company session; for a guest /faq redirects to /login).
2. Open the tab for companies / organizations and expand every question of that tab.
**Expected:**
- The expanded answers contain no «ההד האנטר».
- (source: reject «needed behavior» 3; current behavior named «/organizations and the companies FAQ»)

#### 1.3 Talent job page — «פרטי הד האנטר זמינים למנויי PRO» @desktop @prod-safe #cf108e
**Device:** desktop · **Users:** talent · **Case:** `.qa/tests/glossary/GL-1-3.md`
**Steps:**
1. Open /collaborations (talent, FREE).
2. Open job J-40 «מנהל רכש בכיר לחברת פארמה מוכרת» (job dialog «פרטי המשרה»).
3. Read block «מנהל/ת המשרה».
**Expected:**
- Text «פרטי הד האנטר המשרה זמינים למנויי PRO» or «פרטי הד האנטר זמינים למנויי PRO» is shown (no ה before «הד האנטר»).
- The dialog contains no «ההד האנטר».
- (source: reject «needed behavior» 3: «"פרטי הד האנטר זמינים למנויי PRO"»)

#### 1.4 Talent profile edit — salary called «ציפיות שכר» @desktop @prod-safe #cf108e
**Device:** desktop · **Users:** talent · **Case:** `.qa/tests/glossary/GL-1-4.md`
**Steps:**
1. Open the talent profile and click «עריכת פרופיל» (or the edit button of the profile).
2. Find the salary fields. Close the form without saving.
**Expected:**
- Labels «ציפיות שכר מ-» and «ציפיות שכר עד» (with or without «(₪)»).
- No «שכר מבוקש» in the form.
- (source: reject «needed behavior» 1: «Candidate salary has one name everywhere, e.g. "ציפיות שכר מ- / עד" … the talent profile edit»)

#### 1.5 Headhunter add-candidate form — salary called «ציפיות שכר» @desktop @prod-safe #cf108e
**Device:** desktop · **Users:** hunter_plus · **Case:** `.qa/tests/glossary/GL-1-5.md`
**Steps:**
1. Open /my-candidates («המועמדים שלי»).
2. Click «+ הוספה» (dialog «הוספת מועמד»).
3. Scroll to the salary fields. Close the dialog without saving.
**Expected:**
- Labels «ציפיות שכר מ- (₪)» and «ציפיות שכר עד (₪)».
- No «שכר מבוקש» in the dialog.
- (source: reject «needed behavior» 1: «"ציפיות שכר מ- / עד" in the headhunter add-candidate form»)

#### 1.6 Company job page — submissions called «מועמדים שהוגשו» @desktop @prod-safe #cf108e
**Device:** desktop · **Users:** company · **Case:** `.qa/tests/glossary/GL-1-6.md`
**Steps:**
1. Open «המשרות שלי» (company demo-company-1).
2. Open own job J-49 «QA company post test» (dialog «פרטי המשרה»).
**Expected:**
- The counter in the job details is labelled «מועמדים שהוגשו» (with a number).
- The side list title is «מועמדים שהוגשו».
- The dialog contains no «הצעות שהוגשו».
- (source: reject «needed behavior» 2: «"מועמדים שהוגשו" in both places (counter and list title)»)
