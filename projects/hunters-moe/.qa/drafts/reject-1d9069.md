Title: The auto NDA behind «שליחת הודעה» is not filled with the job, company and parties' details

What exists:
claude-test → J-150 «QA 0711 משרה האנטר 3» → «מנהל/ת המשרה» → «שליחת הודעה»: the chat opens at once with no manual NDA step, the NDA is signed automatically for claude-test and waits for the manager's approval; after approval both can write and «הסכמים» shows 07.11.2026–07.02.2027 — OK.
But the NDA itself is not filled: the initiator's «צפייה ב-NDA» shows only the general text «הסכם זה נערך בין הצדדים ששמותיהם מופיעים בו…» — no names, no job, no company (3/3). The manager sees the two names and dates but not the job / company. Only after approval «בנושא: QA 0711 משרה האנטר 3» appears, still without the company.
From a company's job (J-148) the same button opens a chat with no NDA at all — see #0224f4.

What is needed:
Per this ticket the NDA behind «שליחת הודעה» is «auto-filled with the job, company and both parties' details»:
1. In every NDA view (initiator before approval, manager before approval, «הסכמים» after approval) a «פרטי ההסכם» block shows: both parties' names, the job title (the job where «שליחת הודעה» was pressed), the company / job owner, date and validity (from–to).
2. The same for jobs published by a company (J-148) — the auto NDA is created there too (#0224f4).
One fix together with #0224f4. Texts in he/en/ru/ar.
Done when: claude-test → a job → «שליחת הודעה» → «צפייה ב-NDA» shows both names, the job and the company before the approval.

Steps to reproduce:
1. Log in as claude-test@hunters.dev → a job of another headhunter with no NDA between you → «שליחת הודעה» at «מנהל/ת המשרה».
2. In the chat → «צפייה ב-NDA»: §1 has no names / job / company (see screenshot).

Attachments: screenshots/0224f4-nda-not-filled-A-desktop.png, screenshots/0224f4-v-nda-initiator-desktop.png
Related: #0224f4.
