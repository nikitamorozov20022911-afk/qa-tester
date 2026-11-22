Title: Auto NDA works only between headhunters and is not filled with the parties / job / company details

What exists:
Between two headhunters the flow works: the NDA is signed automatically on the initiator's side, the other side approves it with one click, the chat is blocked until approval, and «הסכמים» shows the dates 07.11.2026–07.02.2027 (3 months). But:
1. Headhunter ↔ company: demo-hunter-3 (no NDA with סופר פארם) → J-148 «QA 0711 משרה חברה» → «מנהל/ת המשרה» → «שליחת הודעה» opens the chat with the message box enabled; no NDA is created or requested, nothing in «הסכמים» (3/3).
2. Headhunter ↔ candidate: claude-test (no NDA with this talent) → «מאגר טאלנטים» → anonymous talent U-50 → «שליחת הודעה» → «פתיחת שיחה» opens a chat with no NDA; nothing in «הסכמים» (3/3).
3. The NDA is not filled with the details: for the initiator (claude-test → demo-hunter-1, «צפייה ב-NDA» while waiting) §1 only says «הסכם זה נערך בין הצדדים ששמותיהם מופיעים בו…» — no names of the parties, no job, no company; only the footer says «ממתין לאישור של הד האנטר דמו 1». The receiver sees «פרטי ההסכם» with the two names and dates, but without the job / company. After approval the agreement shows «בנושא: <job>», but no company and no parties block.

What is needed:
Per this ticket:
1. The same standard auto-signed NDA (signed by the initiator automatically, approved by the other side with one click, valid 3 months, reminder 3 days before, renewal) applies to every new contact: headhunter ↔ headhunter (done), headhunter ↔ company and headhunter ↔ candidate — from «שליחת הודעה» on a job, on a company/talent profile, and on submission. Until approval the chat shows the same waiting / refusal bars as between headhunters.
2. Every NDA view (initiator before approval, receiver before approval, «הסכמים» after approval) shows a filled «פרטי ההסכם» block: both parties' names, date, validity (from–to), and when the contact started from a job — the job title and the company (or the job owner); when it is about a candidate — the candidate (anonymous label if the profile is anonymous).
Texts in he/en/ru/ar.
Done when: demo-hunter-3 → J-148 → «שליחת הודעה» creates an auto NDA that סופר פארם approves; claude-test → U-50 → «שליחת הודעה» creates an auto NDA the talent approves; claude-test's «צפייה ב-NDA» shows both names, the job and the company.

Steps to reproduce:
1. Log in as demo-hunter-3@hunters.dev → /collaborations/fedc4b3d-3de6-414e-9821-af96a34469ae → «שליחת הודעה» at «מנהל/ת המשרה» → chat without NDA (screenshot 1).
2. Log in as claude-test@hunters.dev → «מאגר טאלנטים» → U-50 /profile/af9b38c2-6897-43d3-8cb2-340fbf43312c → «שליחת הודעה» → «פתיחת שיחה» → chat without NDA (screenshot 2).
3. As claude-test → chat with הד האנטר דמו 1 → «שליחת NDA לאישור» → «צפייה ב-NDA»: no parties / job / company (screenshot 3).

Attachments: screenshots/0224f4-v-B-company-chat-no-nda-desktop.png, screenshots/0224f4-v-A-talent-chat-no-nda-desktop.png, screenshots/0224f4-v-nda-initiator-desktop.png
