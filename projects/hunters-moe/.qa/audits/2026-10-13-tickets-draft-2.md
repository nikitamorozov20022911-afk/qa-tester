# Draft tickets — round 2 (actions, validation, mobile) · 2026-10-13
All in English, status לביצוע, sprint Headhunters QA. Screenshots = files in .qa/screenshots/ that will be attached.
Mobile = browser emulation of iPhone 13 Mini (375px) and Pixel 7 (412px).

---------------------------------------------------------------
## U1. UPDATE existing bug 80c43786 (anonymous talent revealed) — add the second path
Add to "What exists":
The same happens with the second button on the anonymous profile, "שליחת הודעה": a PLUS headhunter opens an anonymous talent profile and clicks "שליחת הודעה" – the new chat (/messages?c=6352e648-…) shows "עמית לוי", phone "972561239011" and "demo-talent-5@hunters.dev", the chat list shows "צרו קשר עם עמית לוי".
Add step: "Or click 'שליחת הודעה' on another anonymous profile".
Attach: copya-hunter-6.png

## U2. UPDATE existing task 0d3f4774 (raw key "onboarding.errors.Too big") — add a new screen
Comment: The same raw key "onboarding.errors.Too big" (also in English) is shown in the headhunter "הוספת מועמד" form (/my-candidates/new) when the name or "כמה מילים על המועמד" is longer than the limit. In "עריכת פרופיל" the same check correctly says "ארוך מדי (עד 100 תווים)".
Attach: copya-hunter-2.png

---------------------------------------------------------------
## T1. [Bug · high] NDA payment shows the raw key "checkout.products.application_nda" instead of the product name
What exists:
When a headhunter submits a candidate to a job and chooses "פרופיל אנונימי" + "לחייב NDA(₪35)" and clicks "המשך לתשלום", the payment window shows the product name as the raw translation key "checkout.products.application_nda". The key also overflows the product card. The user doesn't understand what he is paying for.
What is needed:
Requirement not met (§45 זרימת חתימת NDA / Subscriptions & Payments): the user pays for a clearly named service. Show a translated name, e.g. "חתימת NDA על הגשת מועמד" (EN "NDA signature for a candidate submission"), in all languages.
Steps to reproduce:
- Log in as a headhunter (claude-test@hunters.dev)
- Open any job in "שת״פים" and click "הגשת מועמד"
- Choose a candidate, "פרופיל אנונימי" and "לחייב NDA(₪35)"
- Click "המשך לתשלום" and look at the product name
Attach: copya-hunter-4.png

## T2. [Bug · high] Submitting a candidate to a job: no validation of summary, screening answers and salary, and no success message
What exists:
In the dialog "הגשת <מועמד> למשרה" a headhunter can leave "תקציר המועמד" empty, not answer the job's screening questions ("שאלות סינון") and type "abc" in "שכר מבוקש" – "סיום והגשה" accepts everything. The company then sees "—", "לא נענתה" and "abc" in the candidate card. After submitting there is no toast at all – the dialog just turns into the card (after "שליחת פרופיל מלא" there is a toast "הפרופיל המלא נשלח בהצלחה"). The anonymous submission card shows a pink/red banner "הגשת מועמד באופן דיסקרטי!" that looks like an error.
What is needed:
Requirement not met (§37 שליחת מועמד למשרה, §43 שאלות מקצועיות למועמדות אנונימית): the candidate is sent with the professional data and answers the receiving side needs to check the match.
- Required summary and answers: "יש למלא תקציר מועמד", "יש לענות על שאלת הסינון"
- Salary must be a number: "יש להזין שכר במספרים"
- After submit: toast "המועמד/ת הוגש/ה בהצלחה"
- The anonymous banner in a neutral style: "הגשה דיסקרטית"
Steps to reproduce:
- Log in as a headhunter (claude-test@hunters.dev)
- Open the job "QA company post test" (/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584) and click "הגשת מועמד"
- Choose a candidate, leave the summary empty, skip the screening question, type "abc" in "שכר מבוקש"
- Click "סיום והגשה"
Attach: copya-hunter-5.png

## T3. [Task · medium] "הוספת מועמד" form: anonymous candidate can be saved without title and summary, second phone not validated, anonymous hint shown for an open profile
What exists:
In /my-candidates/new:
1. Step 2 with "פרופיל אנונימי": "כותרת" and "תקציר" can be empty – "סיום" saves the candidate ("המועמד נוסף בהצלחה"), so the anonymous profile has nothing to show.
2. "טלפון נוסף" accepts "abc" (also in "עריכת פרופיל"), while the main phone is validated ("יש להכניס מספר טלפון תקין").
3. Step 2 with "פרופיל גלוי" shows the text "בפרופיל אנונימי יוצגו רק הכותרת והתקציר" – it is about the anonymous profile.
What is needed:
Requirement not met (§39 זרימת שליחת פרופיל אנונימי – "המבוססת על תקציר AI ושאלות מקצועיות"; §29 גרסה אנונימית): an anonymous candidate always has a title and a summary.
- "יש למלא כותרת ותקציר לפרופיל אנונימי"
- validate "טלפון נוסף" like the main phone
- for an open profile hide the anonymous hint or write "כותרת ותקציר המועמד"
Steps to reproduce:
- Log in as a headhunter (claude-test@hunters.dev)
- Open "המועמדים שלי" > "+ הוספה", fill step 1, type "abc" in "טלפון נוסף"
- Choose "פרופיל גלוי" > "המשך" – see the hint; go back, choose "פרופיל אנונימי", clear "כותרת" and "תקציר", click "סיום"
Attach: copya-hunter-3.png, copya-hunter-2.png

## T4. [Bug · medium] Publish tender: a non-existing date (31.02) passes the form and returns a generic error
What exists:
In "פרסום מכרז" step 3 the end date can be set to 31.2.2027. The form accepts it, and on "המשך" the server returns "משהו השתבש, נסו שוב" (EN "Something went wrong, please try again"). The user doesn't know what to fix and may retry endlessly.
What is needed:
The documentation has no explicit requirement for date validation; the rule is that form errors say what to fix.
- The date picker doesn't offer 29–31 for short months
- If an invalid date is typed: "התאריך שנבחר לא קיים" under the field
Steps to reproduce:
- Log in as a company (demo-company-1@hunters.dev)
- "+ פרסום" > "פרסום מכרז", fill steps 1–2
- In step 3 set the end date to 31.02.2027 and click "המשך"
Attach: copya-company-3.png, copya-company-9.png

## T5. [Bug · medium] Free (₪0) tender and free promotion go through a payment window; unpaid free tender stays "ממתין לתשלום"
What exists:
1. Company: "פרסום מכרז" with "מכרז ללא קידום (₪0…)" opens the window "תשלום" – "תשלום חד פעמי · ₪0.00", button "אישור תשלום ₪0.00". If the user closes it, the tender stays in "המכרזים שלי" with "ממתין לתשלום" / "להשלמת התשלום", although it is free. The tender also got the industry "בריאות, מדעי החיים וביוטכנולוגיה", which is not asked in the wizard.
2. Headhunter: after publishing a job, the window "האם לשדרג את השת״פ שלך?" with a free promotion ("קידום שת״פ (₪700 ₪0)") goes through "לרכישה" > "אישור תשלום ₪0.00", and closes without any message (the promotion is applied: "קידום עד 27.10.2026").
What is needed:
Requirement (Subscriptions & Payments; Admin pricing "השירות יינתן בחינם"): a free action is not a purchase.
- For ₪0 publish/activate directly; button "פרסום המכרז" / "הפעלת הקידום"
- Toast after activation: "הקידום הופעל עד 27.10.2026"
- An unfinished free tender is shown as "טיוטה – הפרסום לא הושלם" / "להשלמת הפרסום"
Steps to reproduce:
- Log in as a company (demo-company-1@hunters.dev) > "+ פרסום" > "פרסום מכרז" > "מכרז ללא קידום" > finish step 4 – see the payment window; close it and open "המכרזים שלי"
- Log in as a headhunter (claude-test@hunters.dev) > publish a job > in "האם לשדרג את השת״פ שלך?" choose the free promotion > "לרכישה" > "אישור תשלום ₪0.00"
Attach: copya-company-5.png, copya-company-6.png

## T6. [Task · medium] Payment window: typo "להזמנות עתידות", unclear "דיירקט", no coupon error for headhunter
What exists:
In the payment window (job promotion, distribution, NDA): checkbox "שמירת פרטי כרטיס להזמנות עתידות" (typo), method "כרטיס אשראי/דיירקט" (unclear) with a PayPal icon. For a headhunter an empty or wrong coupon (e.g. "QAWRONG") + "אישור" does nothing; at ₪0 the "אישור" button is disabled with no explanation. For a company the same wrong coupon shows "קוד הקופון אינו בתוקף".
What is needed:
The documentation has no explicit requirement; the rule is correct Hebrew and the same feedback for all roles.
- "שמירת פרטי הכרטיס לרכישות עתידיות"
- "כרטיס אשראי"
- wrong coupon: "קוד הקופון אינו בתוקף", empty: "יש להזין קוד קופון"
Steps to reproduce:
- Log in as a headhunter (claude-test@hunters.dev)
- "המשרות שלי" > own job > "שדרוג משרה" > choose "קידום" > "לרכישה"
- Read the checkbox and payment method; type "QAWRONG" in the coupon field and click "אישור"
Attach: copya-hunter-1.png, copya-company-1.png

## T7. [Task · medium] Form validation messages: stale errors, vague texts, silent truncation, missing checks
What exists:
1. Errors don't disappear after fixing: tender step 4 "יש לאשר כדי להמשיך" stays under checked boxes; job step 1 "שדה חובה" stays under a filled field.
2. Vague texts: salary "abc"/"-3" → "יש להזין מספר" (one text for both fields, doesn't say what is wrong); guarantee days 1.5 → "יש להזין מספר"; tender offer amount 0 → "יש להזין סכום"; empty "שעתי/פרויקטאלי" group → "שדה חובה".
3. Company profile: wrong website/LinkedIn → "יש להכניס כתובת תקינה" (EN "Enter a valid address") – confused with the field "כתובת" (address). Empty "שם החברה/העסק" is accepted.
4. Salary min = max is accepted, but the error for min > max says "השכר המקסימלי צריך להיות גבוה מהמינימלי".
5. Length limits: job title is silently cut to 200 chars (tender shows "ארוך מדי (עד 200 תווים)"); "📣 עידכון שותפים" silently cut to 300; screening questions have no limit and accept a question of spaces; report "אחר" can be sent without text and is cut at 3000 without counter; descriptions say "הטקסט ארוך מדי (עד 5,000 תווים)" vs "ארוך מדי (עד 5,000 תווים)".
6. Chat over 4,000 chars: company sees "ההודעה ארוכה מדי (עד 4000 תווים)", headhunter sees only a red counter "5013/4000" and Enter does nothing; "4000" without comma vs "5,000".
What is needed:
The documentation has no explicit requirement for these messages; the rule is that every error is shown next to its field, says what to fix, and disappears when fixed (as it already works for "יש לבחור לפחות מוצר אחד", "התאריך חייב להיות בעתיד"):
- clear the error on change
- "שכר מינימלי: יש להזין מספר חיובי", "יש להזין מספר ימים שלם", "יש להזין סכום גדול מ-0", "יש לבחור לפחות מודל אחד"
- "יש להזין קישור תקין, למשל https://…" (EN "Enter a valid URL, e.g. https://…"); "יש להזין את שם החברה"
- "…גבוה מהמינימלי או שווה לו" (or reject equal values)
- one text "הטקסט ארוך מדי (עד X תווים)" + counter for every limited field; limit and non-empty check for screening questions; "יש לפרט את הסיבה" for "אחר"
- chat: "ההודעה ארוכה מדי (עד 4,000 תווים)" for all roles
Steps to reproduce:
- Log in as a company (demo-company-1@hunters.dev)
- "+ פרסום" > "פרסום משרה": submit step 1 empty, then fill the fields (item 1); type "abc", "-3", 1.5, min = max, a 300-char title (items 2, 4, 5)
- "+ פרסום" > "פרסום מכרז" step 3–4: submit empty, then check the boxes (items 1, 2)
- Profile > "עריכת פרופיל": wrong website, empty company name (item 3)
- Log in as a headhunter (claude-test@hunters.dev): tender offer with amount 0; chat message of 5,000 chars (items 2, 6)
Attach: copya-company-4.png, copya-company-11.png, copya-company-7.png, copya-company-10.png

## T8. [Task · medium] Candidate status labels for company have no subject, masculine only, no "hired" status, and differ between screens
What exists:
A company opens a candidate in its job and opens the status menu: "הסיר מועמדות", "מועמד לא מגיב", "מוכר ונשלל" – no subject, masculine only, jargon. There is no final positive status (hired). The same submission is "חדש" in the dialog and "נשלח לשת״פ" on the page. Rejecting is done without confirmation; the toast is just "הסטטוס עודכן".
What is needed:
Requirement (§06 מודל סטטוסי מועמדות – "מודל סטטוסים למועמדות, המשקף את שלבי התהליך מהשליחה ועד הסגירה"):
- "המועמד/ת הסיר/ה מועמדות", "המועמד/ת לא מגיב/ה", "המועמד/ת כבר מוכר/ת לנו"; add "התקבל/ה לעבודה"
- one status name on all screens
- toast with the new status: "המועמד/ת סומן/ה כ"נדחה""
Steps to reproduce:
- Log in as a company (demo-company-1@hunters.dev)
- Open own job "QA company post test" > a candidate > status menu
- Compare the status in the dialog and on the candidate page; choose "נדחה"
Attach: copya-company-8.png

## T9. [Task · low] Notification texts: no candidate name, job title without quotes, "updated" without the new status; company gets no notifications for its own actions
What exists:
Headhunter bell:
- "מנהל/ת המשרה QA company post test ביקש/ה את הפרופיל המלא" – no candidate; the job title without quotes reads like a person's name; the company is called "מנהל/ת".
- "QA low salary test הסתיים ולא מוצג יותר…", "…מסתיים בעוד יומיים…" – no word "המשרה", no quotes.
- 5 identical "הסטטוס של ההגשה שלך לשת״פ … עודכן" – the new status is not written.
Company bell: no notification after its own actions (publish, renew, archive, approve/reject an offer).
What is needed:
Requirement (§73 אירועי התראה, §74 פעמון התראות): the notification says what happened, to which item and with which result.
- "סופר פארם ביקשה את הפרופיל המלא של <מועמד> למשרה "QA company post test""
- "המשרה "QA low salary test" הסתיימה ולא מוצגת יותר…"
- "הסטטוס של <מועמד> במשרה "…" עודכן ל"<סטטוס>""
- (if intended) confirm with PM that the company doesn't need notifications for own actions
Steps to reproduce:
- Log in as a headhunter (claude-test@hunters.dev) and open the bell
- Log in as a company (demo-company-1@hunters.dev), publish/renew/archive a job and open the bell
Attach: — (texts quoted)

## T10. [Task · low] Small texts after actions: tender offer success, report reasons, renew/archive, discreet submission
What exists:
1. Tender offer success: "ההצעה הוגשה בהצלחה / נעדכן אותך בסטטוס הפנייה באימייל ובאתר" – "הפנייה" instead of "ההצעה"; the close button is "איזה כיף!".
2. Report on a job or tender: reason "פרופיל מזויף".
3. Renew a job: toast "הפרסום חודש" without the new end date.
4. Archive dialog title "העברת משרה לארכיון!" ("!" in a confirmation); after archiving the job still shows "משרה חמה", "תאריך סיום: 10.11.2026" and "📣 עידכון שותפים".
5. Discreet submission dialog: "הגשת מועמד באופן דיסקרטי!" and "תקציר המועמד – נוצר באמצעות AI – —" (empty summary shown as "—").
What is needed:
The documentation has no explicit requirement; the rule is clear and accurate texts:
- "נעדכן אותך בסטטוס ההצעה…", button "סגירה"
- "משרה מזויפת" / "מכרז מזויף"
- "הפרסום חודש עד 10.11.2026"
- "להעביר את המשרה לארכיון?"; archived job without "משרה חמה" / future end date / partners update
- "הגשה דיסקרטית"; "התקציר עדיין לא זמין"
Steps to reproduce:
- Log in as a headhunter (claude-test@hunters.dev): submit an offer on a tender (item 1); report a job (item 2)
- Log in as a company (demo-company-1@hunters.dev): own job > "חידוש הפרסום" (item 3), "העברה לארכיון" (item 4); open an anonymous submission (item 5)
Attach: —

## T11. [Bug · medium] AI candidate summary invents facts that are not in the candidate data
What exists:
When a headhunter adds a candidate and submits it, the AI summary includes statements that are not in the data entered, e.g. "…המועמד מציין יכולת לעבוד בצוות…", "ניסיון בניהול פרויקטי טכנולוגיה…" for a test candidate without such data. The summary is written in masculine for any candidate. The receiving company decides based on this text.
What is needed:
Requirement not met (§28 יצירת תקציר מקצועי באמצעות AI – "יוצר תקציר מקצועי ברור מתוך מידע המועמד"): the summary uses only the candidate's data, and the gender form matches the candidate (or is neutral).
Steps to reproduce:
- Log in as a headhunter (claude-test@hunters.dev)
- "המועמדים שלי" > "+ הוספה", fill only name, title and a short summary without teamwork/project management
- Submit the candidate to a job and read the AI summary in the candidate card
Attach: copya-hunter-5.png

---------------------------------------------------------------
MOBILE

## M1. [Bug · high] Admin panel on mobile: burger menu opens empty, sections can't be reached
What exists:
On a phone (iPhone 13 Mini / Pixel 7) any /admin page: the burger opens only a white strip 71px high with "✕". The menu items "משתמשים … יומן פעולות" are rendered under the page content (the overlay is fixed inside the sticky header with backdrop-filter, so it is limited to the header). The admin can't move between sections on mobile.
What is needed:
Requirement (§01 תשתית Web רספונסיבית – "כל האזורים והעמודים נדרשים להיות רספונסיביים"): the admin menu opens full screen with all sections.
Steps to reproduce:
- Open the site on a phone-width screen (375px)
- Log in as admin (demo-admin@hunters.dev), open /admin/users
- Tap the burger menu
Attach: copym2-admin-ios-3.png, copym2-admin-android-1.png

## M2. [Bug · high] On mobile "+ פרסום" (publish job/tender) and the plan badge are missing for company and headhunter
What exists:
Below 640px the "+ פרסום" button and the plan badge (FREE/PLUS) are hidden, and they are not in the burger or the avatar menu. A company or a headhunter on a phone can't start publishing from the menu and doesn't see the plan.
What is needed:
Requirement (§01 – responsive, all areas available on mobile; §8.2 popup "בחירת סוג פרסום"): the burger contains "פרסום משרה" / "פרסום מכרז" (company) or "פרסום שת״פ" (headhunter) and a plan line (e.g. "PLUS ♛").
Steps to reproduce:
- Open the site at 375px width
- Log in as a company (demo-company-1@hunters.dev) or a headhunter (claude-test@hunters.dev)
- Open the burger and the avatar menu
Attach: copym2-company-ios-5.png, copym3-hunter-ios-2.png, copym3-hunter-android-5.png

## M3. [Bug · high] Footer in Russian/English doesn't wrap on mobile and pushes the page sideways
What exists:
Footer row "© 2025 Hunters / Условия использования / Конфиденциальность / Доступность" is 561px wide and doesn't wrap. On iPhone the page scrolls 93px sideways and "© 2025 Hunters" is cut; on Android the page becomes 486px on a 412px screen and everything shrinks, "Доступность" is cut. In English the row is 378px on 375px (1px scroll, no margins). Hebrew is fine.
What is needed:
Requirement (§01 responsive; §02 multi-language): the footer wraps to several lines with 16px side margins in every language.
Steps to reproduce:
- Open /ru/login at 375px width as a guest
- Scroll to the footer and swipe sideways
Attach: copym-guest-ios-1.png, copym-guest-android-1.png, copym-guest-ios-2.png

## M4. [Task · medium] Tables on mobile hide columns without any scroll hint (admin, agreements, invoices, candidate activity)
What exists:
On a phone tables are much wider than the screen and scroll sideways without a scrollbar, shadow or arrow, so they look like a one-column list:
- Admin: users 760px in 341px (only "שם", "תפקיד" cut; "סטטוס, חבילה, הצטרפות, פעולות" hidden), jobs 1326px (only "משרה"), tenders, applications, lists, log, messages, pricing. "הד האנטר" wraps to 2 lines, "שינוי סטטוס משרה" to 3.
- Admin empty states are centered on the 760px table: only "עוד לא נ" of "עוד לא נשלחו הודעות מערכת" / "עוד אין קופונים" is visible.
- Profile "הסכמים" 880px in 303/340px: names cut to "הד האנטר...", dates "…026", "צפייה" / "בקשה לביטול" and statuses hidden; "חשבוניות" 560px – "צפייה" hidden; candidate "פעילות אחרונה" 640px – "שעה" hidden.
What is needed:
Requirement (§01 responsive): on mobile tables show rows as cards ("label: value") or keep the main column + actions and show a scroll hint; empty states are centered on the screen.
Steps to reproduce:
- Open the site at 375px width
- Log in as admin (demo-admin@hunters.dev) > /admin/users, /admin/jobs, /admin/messages
- Log in as a company (demo-company-1@hunters.dev) or headhunter (claude-test@hunters.dev) > profile > "הסכמים", "חשבוניות"; a candidate > "פעילות אחרונה"
Attach: copym2-admin-ios-1.png, copym2-admin-ios-4.png, copym2-admin-ios-2.png, copym2-admin-android-2.png, copym2-company-ios-4.png, copym3-hunter-ios-4.png, copym3-hunter-ios-9.png, copym3-hunter-ios-10.png

## M5. [Task · medium] Tab rows on mobile are cut without scroll hint (profile tabs, edit profile tabs)
What exists:
- Profile tabs "החשבון שלי · השת”פים שלי · המנוי שלי · הסכמים · חשבוניות" (talent 591px, headhunter 448px) in 343/380px: on iPhone "המנוי ש", "הסכמים" and "חשבוניות" are not visible; on Android it looks like there are only 3 tabs. When "?tab=subscription" or "?tab=invoices" is open, the active tab stays out of view. In English "Agreements" and "Invoices" are hidden.
- "עריכת פרופיל" tabs (377px in 299px): only "ניסיון" of "ניסיון מקצועי" is visible.
What is needed:
Requirement (§01 responsive): all tabs are reachable – scroll to the active tab, show a fade/arrow, or wrap to 2 rows.
Steps to reproduce:
- Open the site at 375px width
- Log in as a talent (demo-talent-2@hunters.dev) > /profile?tab=subscription
- Click "עריכת פרופיל"
Attach: copym-talent-ios-2.png, copym-talent-ios-4.png, copym-talent-android-2.png, copym-talent-ios-3.png

## M6. [Task · medium] Texts overflow, overlap or break on mobile (salary range, chips, badges, NDA price, e-mail, Latin names, /headhunters icon)
What exists (375px / 412px):
1. Job dialog "טווח שכר" "25,000 - 30,000" is 142px in a 117px column – overflows the card and merges with the next value: "25,000 - 30,0002" / "80,0000".
2. Category chip "טכנולוגיה, מוצר, דאטה ומערכות מידע" has a fixed height 29px; on mobile the text is 2–3 lines and goes out of the chip by 15px.
3. Badge "משרה חמה" wraps to 2 lines ("משרה / חמה").
4. Submit-candidate dialog: "לחייב NDA(₪35)" shows as "לחייב (₪35 NDA" (bidi); "אין צורך ב-NDA(ללא עלות)" breaks between "ב-" and "NDA".
5. Tender step 1 "מכרז מקודם (₪1,500 למכרז לשבועיים)" – 24px title in 183px, 3 lines, the price bracket is split.
6. Job dialog "מנהל/ת המשרה": "demo-company-1@hunters.dev" breaks at the hyphen into 2 lines.
7. Dialog titles with Latin text ("הסכם סודיות (NDA): QA test") split "QA" / "test" between lines.
8. /headhunters, card "שירותי קידום והפצה": the icon covers the first word of "שת”פ חדש במיוחד בשבילך באתר HUNTERS!".
9. HR "/tenders?mine=1": link "כל המכרזים" wraps to "כל / המכרזים".
What is needed:
Requirement (§01 responsive, §02 RTL): on mobile all texts fit their container and read in the right order:
- salary: allow wrap / wider column with a gap; chips: min-height instead of fixed height; badges and short links: nowrap
- prices as a separate line/badge, mixed Hebrew/Latin wrapped in <bdi>, non-breaking "ב-NDA"
- e-mails: dir=ltr, no hyphen break (or truncate + title)
- /headhunters: icon above the text or padding
Steps to reproduce:
- Open the site at 375px width
- As a guest open /headhunters (item 8)
- Log in as a talent (demo-talent-2@hunters.dev) > open a job (items 1–3)
- Log in as a headhunter (claude-test@hunters.dev) > a job > "הגשת מועמד" (item 4); profile > "הסכמים" > צפייה (item 7)
- Log in as a company (demo-company-1@hunters.dev) > own job (item 6); "+ פרסום מכרז" step 1 (item 5)
- Log in as HR (demo-company-6@hunters.dev) > /tenders?mine=1 (item 9)
Attach: copym-talent-ios-1.png, copym-talent-android-1.png, copym-hr-ios-2.png, copym-hr-android-2.png, copym3-hunter-ios-6.png, copym3-hunter-android-4.png, copym2-company-ios-6.png, copym2-company-android-1.png, copym3-hunter-ios-11.png, copym-guest-ios-3.png, copym-guest-android-2.png, copym-hr-ios-3.png, copym2-company-ios-2.png, copym3-hunter-ios-1.png

## M7. [Task · low] Lists on mobile cut important text to one line (tender descriptions, talent bank titles and areas, candidate names, category chips)
What exists:
- /tenders cards: description in one line with "…" – 25–57% of the text is lost ("גיוס 4 מפתחי Full Stack לסניף הניו יורקי…").
- /talents-bank and /hunters: title "מנהלת מוצר עם 10 שנות ניסיון ב-SaaS" cut mid-word ("מנהלת מוצר עם 10 ש..."); "תחום" shows only the first of 3–5 areas (EN worse).
- /my-candidates and the submit dialog: names cut, the distinguishing part lost ("QA copy test מועמד אנ..."); Latin names cut from the start in RTL ("candidate Close-test…").
- Job cards with "משרה חמה": category chip cut to "טכנולוגיה, מוצר, דאט…".
What is needed:
Requirement (§01 responsive): on mobile key texts use 2 lines (line-clamp 2), areas show the first one + "+N", names use dir=auto.
Steps to reproduce:
- Open the site at 375px width
- Log in as HR (demo-company-6@hunters.dev) > /tenders
- Log in as a headhunter (claude-test@hunters.dev) > /talents-bank, /hunters, /my-candidates
- Log in as a company (demo-company-1@hunters.dev) > own job > "הצעות שהוגשו"; /collaborations
Attach: copym-hr-ios-1.png, copym-hr-android-1.png, copym3-hunter-ios-7.png, copym3-hunter-ios-8.png, copym3-hunter-android-1.png, copym3-hunter-ios-3.png, copym3-hunter-ios-5.png, copym2-company-ios-3.png, copym2-company-ios-1.png
