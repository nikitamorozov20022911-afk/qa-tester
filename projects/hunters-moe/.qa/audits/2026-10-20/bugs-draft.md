# Черновики багов · прогон 2026-10-20 · NOT SENT TO BOARD

Язык доски — английский. Оставляем подписи полей «מה קורה כרגע» / «מה צריך לקרות».
Отправлять на доску (mifrat «לביצוע», sprint «Headhunters QA») **только после «да» пользователя**.
Скриншоты лежат в `.qa/screenshots/run-1020/<SESSION>/`. Сайт: https://hunters-sooty.vercel.app.
Приоритет: High / Medium / Low.
Перед отправкой каждый черновик сверить с доской на дубли (mifrat `find_similar`).

> 2026-10-20: №1–5 (высокие) заведены на доску в לביצוע, sprint Headhunters QA: …63a7e8 (№1), …279169 (№2), …5200a6 (№3), …1604a7 (№4), …fc00c7 (№5).
> 2026-10-20: №6, 8, 10, 25 (монетизация) заведены: …1396b6 (№6 порог 20 000), …8cc94b (№8 Unique Position), …4ce54a (№10 распространение тендера), …64e2aa (№25 продвижение таланта).
> 2026-10-20: №11, 12, 13, 17, 22 (подача и полный профиль) заведены: …31a764 (№11), …9ac514 (№12), …e9ce1c (№13), …158449 (№17), …0f3888 (№22).
> 2026-10-20: №14, 15, 16 (NDA) заведены: …805225 (№14), …68f480 (№15), …4b3041 (№16).
> 2026-10-20: №19 (статусы) заведён: …24f795.
> 2026-10-20: №20 (админка), №7 и №21 (AI и файлы) заведены: …301e98 (№20), …344b9a (№7), …38bfa0 (№21).
> 2026-10-20: №9, 18, 23, 24 (компания и тендеры) заведены: …cf6dc1 (№9), …df647e (№18), …1004e9 (№23), …b55501 (№24).
> 2026-10-20: №26–31 (мобилка и интерфейс) заведены: …1afa56 (№26), …8f5282 (№27), …46b93c (№28), …a1dd4b (№29), …c8f678 (№30), …f15f60 (№31). №32–33 (необязательные) заведены с низким приоритетом: …283eb6 (№32, перепроверено 3/3 на активной вакансии J-49, только /applications/<id>), …437b26 (№33). ВСЕ 33 ЧЕРНОВИКА ОТПРАВЛЕНЫ.

---

### 1. Landing pages: hero job search on /headhunters and /talents leads to a 404 page (/jobs does not exist)
- **Priority:** High · **Category:** frontend · **Spec:** §10 AC01–02, §12 AC01–02
- **URL:** /headhunters, /talents, /en/headhunters (guest)
- **מה קורה כרגע:** The hero search "הציצו במשרות המפורסמות באתר שלנו" (תחום / תפקיד / אזור + search button) navigates to `/jobs?field=…&role=…&area=…`. This route does not exist, and the page returns HTTP 404 "אופס, הדף לא נמצא". It happens with empty fields, with one filter and with all three. From /en/headhunters it navigates to `/jobs` without the `/en` prefix, so the 404 is shown in Hebrew. On /organizations the same block correctly goes to `/login?next=/tenders…`.
- **מה צריך לקרות:** The search on every landing page leads to a working destination and keeps the selected filters and the current language:
  - Until a public job list exists, a guest is sent to `/<lang>/login?next=/collaborations?field=…&role=…&area=…` (same as /organizations → /tenders). After login, the user lands on the job list with the filters applied.
  - If a public job list is planned, the search opens it with the filters applied.
  - The language prefix is preserved (/en, /ru, /ar).
  - No landing-page CTA leads to a 404.
- **Steps:**
  1. Open /headhunters as a guest.
  2. Optionally pick תחום / תפקיד / אזור.
  3. Click the search button. Result: 404.
  4. Repeat on /talents and /en/headhunters.
- **Screenshots:** C1/verify-search-form-headhunters-desktop.png, C1/verify-search-jobs-404-desktop.png, C1/12-search-404-talents-desktop.png, N1/verify-A-en-headhunters-empty-desktop.png, N1/verify-A-organizations-compare-desktop.png
- **Verified:** yes, bug-verifier 3/3 (C1) and 3/3 (N1)

### 2. Payment window: card payment is impossible ("לא הצלחנו להתחבר לחברת הסליקה") and every opening creates a pending order
- **Priority:** High (please confirm whether the staging payment config is expected to work) · **Category:** backend · **Spec:** §69 AC03, §54/§64 AC06
- **URL:** any "תשלום" window: job upgrade (/my-jobs → פעולות משרה → שדרוג משרה → לרכישה), plan selection (/profile?tab=subscription → בחירת חבילה → המשך), NDA ₪35 on submission, talent PRO ₪480
- **מה קורה כרגע:**
  - About 2 s after the window opens, the toast "לא הצלחנו להתחבר לחברת הסליקה, ולכן אי אפשר לשלם בכרטיס כרגע. לא בוצע חיוב…" appears.
  - After `secure.cardcom.solutions/External/OpenFields/3DS.js` loads, the second `POST /my-jobs` returns `{"error":"unavailable"}`. The card fields stay empty and "אישור תשלום" is disabled.
  - Every opening of the window creates an order with `status:"pending"`. Over one night, 20+ such orders piled up on claude-test, demo-hunter-3, demo-company-1 and demo-talent-1.
  - On mobile the toast covers the window header and the back button for several seconds.
- **מה צריך לקרות:**
  - On staging the payment provider works in test mode: card fields render and a test card can complete the payment.
  - If the provider is truly unavailable, the user sees a clear message and nothing is half-created.
  - An order is created only when the user clicks "אישור תשלום", not when the window opens. An abandoned window leaves no "ממתין" order. Alternatively, abandoned pending orders expire automatically and are hidden from the user and from admin totals.
  - The toast never covers the window's close/back button.
- **Steps:**
  1. Log in as hunter_plus.
  2. /my-jobs → any own job → פעולות משרה → שדרוג משרה → pick an option → לרכישה.
  3. Wait 3 s and look at the toast and the Network tab.
  4. Close the window and check the orders in admin.
- **Screenshots:** C2/69-payment-provider-error-desktop-plus.png, C2/verify-payment-lowsal-toast-run1-desktop-plus.png, M2/B-payment-toast-covers-back-iphone.png, F1/site/167-28002-payment-plus-desktop.png
- **Verified:** yes, 4/4 (+3/3)

### 3. Mobile (Russian): non-wrapping CTA and H1 overflow the screen on /ru/headhunters, /ru/about, /ru/privacy
- **Priority:** High · **Category:** frontend · **Spec:** §01 AC03, §02
- **URL:** /ru/headhunters, /ru/about, /ru/privacy — 375×812 (iPhone 13 mini) and 412×915 (Pixel 7)
- **מה קורה כרגע:**
  - The CTA "Начать бесплатный пробный период" has `white-space: nowrap`, 24px, and is **488px** wide.
  - On /ru/headhunters the hero button (16..504) is cut on the right, and buttons 2–3 sit at x −57..432. The page scrolls sideways by **57px** (iPhone) / **39px** (Android).
  - On /ru/about the H2 "30 дней бесплатно и без обязательств", the subtitle and the button are cut on both sides ("0 дней бесплатно и", "ачать бесплатный пробный перио").
  - On /ru/privacy the H1 "Политика конфиденциальности" (44px, `overflow-wrap: normal`) is 462px wide, so the page is **103px / 66px** wider than the screen.
  - he/en/ar are fine (button 300px).
- **מה צריך לקרות:**
  - On mobile, buttons and headings never exceed the viewport minus the 16px side padding: max 343px on 375, 380px on 412.
  - Long button labels wrap (`white-space: normal`, `max-width: 100%`) or use a shorter mobile label.
  - Large headings use a smaller mobile font size and/or `overflow-wrap: anywhere` / `hyphens: auto`.
  - No horizontal page scroll on any page in any language.
- **Steps:** Open /ru/headhunters at 375 px → hero, then scroll down and swipe sideways. Open /ru/about → bottom banner. Open /ru/privacy.
- **Screenshots:** M1/ver-A-ru-headhunters-hero-{iphone,android}.png, M1/ver-A-ru-headhunters-sideways-*.png, M1/ver-A-ru-about-cta-h2-*.png, M1/ver-C-ru-privacy-h1-{iphone,android}.png, C1/01-headhunters-ru-cta-overflow-mobile.png, C1/01-privacy-ru-overflow-mobile.png
- **Verified:** yes, 3/3 on both devices. Not covered by the open reject "במובייל: טקסטים גולשים…".

### 4. Mobile: the burger-menu row "Login / Register / Language" does not wrap — the language switcher goes off-screen in en/ru/ar
- **Priority:** High · **Category:** frontend · **Spec:** §01 AC02–03, §02 AC01
- **URL:** all public pages, open burger menu, 375 and 412 px, en/ru/ar
- **מה קורה כרגע:**
  - The bottom row of the open menu is `flex nowrap`.
  - iPhone: the "Русский" switcher sits at 305..435 (+60px), "العربية" at −59..50, "English" at 264..385 (+10). In he it has only 4px margin instead of 16.
  - Android: ru +23px (the language list 235..435 is off-screen too); in ar the page shifts by 22px.
  - After choosing a language, the page stays shifted: "едхантеры" on the left, a white strip on the right. In ar the logo is cut by 43px.
- **מה צריך לקרות:**
  - The menu row wraps (`flex-wrap`), or the language switcher gets its own full-width line.
  - All controls and the language dropdown stay within 16px..(W−16px) in every language.
  - Opening or closing the menu never creates a horizontal scroll or shifts the page.
- **Steps:** Open /ru (or /ar, /en) at 375×812 → ☰ → look at the bottom row → open the language list.
- **Screenshots:** M1/ver-B-menu-row-{ru,ar,en}-{iphone,android}.png, M1/ver-B-menu-lang-dropdown-*.png, C1/verify-menu-lang-ru-mobile.png, C1/verify-menu-lang-ar-scrolled-mobile.png
- **Verified:** yes, 3/3 (M1 and C1)

### 5. Mobile: candidate rows in the job drawer have a fixed 52px height and overlap each other
- **Priority:** High · **Category:** frontend · **Spec:** §01 AC03, §02 AC02, §48/§50
- **URL:** /collaborations/<id> (job details drawer, e.g. J-49 7e4ad713…): block "הגשת מועמד" (hunter_plus, hunter_free_2) and "מועמדים שהוגשו" (company); iPhone and Android
- **מה קורה כרגע:**
  - Each candidate row is a button with `h-[52px]` and the name is `line-clamp-2`. A two-line name needs ~63px, so it spills out of the row: the top of the name is hidden under the previous row and the bottom of the job title under the next one, by 5–10px.
  - Affected rows: hunter_plus 18 of 29 on iPhone and 2 of 29 on Android; FREE 4 of 5 / 1 of 5.
  - For the company the name column is only 83px on iPhone, e.g. "QA-AUTO / 1020 …".
  - Statuses are cut at 96px: "פרופיל מלא או…", "התבקש פרופי…".
  - Latin job titles are cut from the start: "…or Backend Developer".
  - Nested scroll: a list of 387/1540 inside a drawer body of 448/1260.
- **מה צריך לקרות:**
  - Row height follows its content (`min-height` instead of a fixed height); the name and the status are fully readable or wrap onto a second line.
  - Latin text uses `dir="auto"`, so any truncation happens at the end.
  - The drawer has a single scroll container.
  - Rows never overlap on any device width.
- **Steps:** Log in as hunter_plus on a phone → /collaborations → open any job → scroll to the candidate list. Do the same as company on J-49.
- **Screenshots:** M2/ver-A1-candidates-list-{iphone,android}.png, M2/ver-B1-candidates-row-{iphone,android}.png, M2/ver-B1-subtitle-start-cut-*.png, M2/A-job-drawer-rows-overlap-*.png
- **Verified:** yes, 3/3 (blocks A and B). Related to «במובייל: רשימות קוטעות טקסט חשוב…» and «במובייל: טקסטים גולשים…», but the fixed-height overlap is not described there.

### 6. §57 Minimum-salary threshold (20,000 ₪) for promotion/distribution is not applied anywhere
- **Priority:** Medium (PM must confirm which services it covers — D-08) · **Category:** backend + frontend · **Spec:** §57 AC01–03
- **URL:** /publish/job → after publishing "האם לשדרג את המשרה שלכם?"; /my-jobs → פעולות משרה → שדרוג משרה (hunter PLUS and FREE)
- **מה קורה כרגע:**
  - A job with salary 10,000–12,000 or 12,000–15,000 ₪ gets the same upsell as a 25,000–32,000 ₪ job: "קידום משרה (₪700)" and "שירותי הפצה (₪700)".
  - "לרכישה" is enabled and the payment window opens (₪1,050 for PLUS with discount, ₪1,400 for FREE).
  - There is no message about a threshold, and "20,000" does not appear anywhere on the site.
- **מה צריך לקרות:**
  - Services restricted by §57 are offered only when the job's salary is above 20,000 ₪. The same applies to candidate promotion/distribution and the candidate's salary expectations (§57 AC01–02).
  - Below the threshold, the option is shown disabled with an explanation, e.g. "זמין למשרות עם שכר מעל ₪20,000", and cannot be bought, including via a direct server call.
  - The threshold value comes from admin settings.
  - The exact services and the salary field used (min/max of the range) follow the PM decision (D-08).
- **Steps:** Publish a job with salary 10,000–15,000 → in the upgrade popup choose קידום משרה → לרכישה → the payment window opens.
- **Screenshots:** C2/57-low-salary-upgrade-clicked-desktop-plus.png, C2/57-verify-upsell-run1..3-desktop.png, C2/57-verify-payment-run1..3-desktop.png
- **Verified:** yes, 3/3 (FREE) and 3/3 (PLUS)

### 7. AI CV parsing does not extract salary expectations (§27 AC03)
- **Priority:** Medium · **Category:** backend (AI) · **Spec:** §27 AC02–03
- **URL:** /my-candidates/new → "קובץ קו״ח" (hunter_plus)
- **מה קורה כרגע:**
  - After uploading a CV that contains "32,000 ILS per month" or "Expected salary: 22,000 - 26,000 NIS per month", the message "מילאנו מקורות החיים…" appears, but "שכר מבוקש מ-/עד" stays empty (2 of 2 CVs).
  - The response of `POST /my-candidates/new` has no salary keys.
  - Education is extracted only partially.
  - A CV whose name line is "QA-AUTO 1020 C2 Testcv Candidate" leaves the name empty.
- **מה צריך לקרות:**
  - The parser extracts expected salary from common formats (single value or range; ILS / NIS / ₪ / שקלים; per month / per year, converted to monthly) and fills "שכר מבוקש מ-" / "עד".
  - It also fills education (degree, institution, years).
  - Fields the parser could not determine stay empty; nothing is invented.
  - The list of auto-filled fields shown to the hunter includes salary when it was filled.
- **Steps:** Add candidate → upload a PDF with "Expected salary: 22,000 - 26,000 NIS per month" → wait for the parse → check the salary fields.
- **Screenshots:** C2/27-cv-after-parse-desktop-plus.png, C2/verify-cv-salary-*.png
- **Verified:** yes, 3/3

### 8. Unique Position badge (§55) cannot be purchased — "תג ייחודי — עדיין לא זמין לרכישה"
- **Priority:** Medium (confirm whether intentionally postponed) · **Category:** backend + frontend · **Spec:** §55 AC01–03
- **URL:** job upgrade popup (/my-jobs → שדרוג משרה), hunter PLUS and FREE
- **מה קורה כרגע:** The "תג ייחודי" card is disabled with "עדיין לא זמין לרכישה". The turquoise badge and the weekly e-mail cannot be bought, and therefore cannot be tested.
- **מה צריך לקרות:**
  - A hunter can buy Unique Position for a job at the price set in admin.
  - After payment, the job shows the turquoise "ייחודי" badge in all listings and is included in the weekly e-mail to relevant users (§55 AC01–03).
  - The badge is removed when the period ends.
  - If the feature is postponed, it is hidden instead of shown as "not yet available".
- **Steps:** /my-jobs → any job → פעולות משרה → שדרוג משרה → look at "תג ייחודי".
- **Screenshots:** C2/54-upgrade-options-desktop-plus.png, C2/54-upgrade-dialog-selected-desktop-free.png
- **Verified:** yes (stable in all 6 verifier runs)

### 9. Company cannot close, archive, renew or edit its own tender, although the notification says "אפשר לחדש את הפרסום"
- **Priority:** Medium · **Category:** frontend + backend · **Spec:** §66 (renewal), §05, parity with jobs
- **URL:** /tenders?mine=1 → own tender (company demo-company-1: T-25 expired, T-53 active; company_2: T-58)
- **מה קורה כרגע:**
  - The owner's tender card has only "share" and "copy number". There is no way to close, archive, renew, edit or promote the tender.
  - The bell still says "…הסתיים ולא מוצג יותר. אפשר לחדש את הפרסום.".
  - On step 4 of the wizard the company commits "לעדכן אם נסגר הפרויקט ו/או להסיר את הפרסום".
  - Jobs have all of these actions ("פעולות משרה"). Only an admin can set "סגור / פג תוקף / נדחה".
  - After an offer is approved, the tender stays "פעיל" and keeps accepting offers.
- **מה צריך לקרות:**
  - The owner has a "פעולות מכרז" menu on the tender card and the tender page: צפייה, עריכה (fields allowed after publishing), קידום, הארכה (same price rules as jobs), סגירת מכרז (with confirmation), העברה לארכיון.
  - An expired tender offers "חידוש פרסום", matching the bell text.
  - Closed and archived tenders disappear from the public list but stay in the owner's history.
  - Behaviour after an approved offer (auto-close, auto-reject others, multiple approvals) follows the PM decision.
- **Steps:** Log in as company → מכרזים → המכרזים שלי → open T-25 (expired) or T-53 (active) → look for actions.
- **Screenshots:** C3/verify-V1-expired-tender-no-renew-desktop.png, C3/verify-V1-bell-renew-text-desktop.png, E1/33-E1B-tender-owner-view-desktop.png, F1/site/167-24683-my-tenders-desktop.png
- **Verified:** yes, 3/3 (C3), confirmed by E1 and F1

### 10. Tender distribution (§59) is missing — only promotion (₪1,500) exists
- **Priority:** Medium · **Category:** frontend + backend · **Spec:** §59 AC01–06, §80
- **URL:** /publish/tender steps 1–4, tender page (company)
- **מה קורה כרגע:** Neither the tender wizard nor the tender card lets the company distribute the tender — not to all users, specific users, a specialization, or headhunters/HR. The only option is "מכרז מקודם (₪1,500)". The admin side (§80 approval queue) is therefore always empty.
- **מה צריך לקרות:**
  - When publishing, and later from the tender's actions, the company can choose distribution: to all, to selected users, by specialization, to headhunters and/or HR (§59 AC01–04), at the admin price.
  - The distribution request goes to the admin for approval (§59 AC06, §80 AC01–03), and is sent only after approval.
  - Recipients get a notification.
- **Steps:** company → + פרסום → פרסום מכרז → go through all 4 steps; open an own tender — there is no distribution option.
- **Screenshots:** C3/verify-V2-tender-step1-only-promotion-desktop.png, C3/verify-V2-tender-step4-no-distribution-desktop.png
- **Verified:** yes

### 11. Company does not get a separate notification for each new application while the previous one is unread (and the link opens the job, not the application)
- **Priority:** Medium (reproduced 3/3 by C3, but not reproduced later in N3/E1 — possibly intermittent) · **Category:** backend · **Spec:** §73 AC02, §74 AC03
- **URL:** bell of the job owner (company demo-company-1, J-49)
- **מה קורה כרגע:**
  - 3 submissions in a row to the same job produced 1 `application_received` notification; a repeat with 2 more gave 1 again. A new one is not created while the previous one for that job is unread.
  - The notification has `candidate: null` and opens the job, not the application.
  - Later runs (N3 on J-66, E1 on a hunter-owned job) received separate notifications, so the behaviour looks intermittent or depends on the owner type.
- **מה צריך לקרות:**
  - Every new application creates its own notification, e.g. "התקבלה מועמדות חדשה למשרה „…”: <candidate title/anonymous>", regardless of read state. Optional grouping must still show the correct count ("3 מועמדויות חדשות").
  - Clicking opens that application (`/collaborations/<job>?application=<id>`).
- **Steps:** hunter_free submits two candidates in a row to a company job → company bell / `rest/v1/notifications`.
- **Screenshots:** C3/verify-V3-bell-one-notif-desktop.png, C3/verify-V3-notif-opens-job-desktop.png
- **Verified:** yes, 3/3 (C3); not reproduced by N3/E1

### 12. Full-profile submission / disclosed profile: company sees only contact data — no AI summary, answers, salary expectation, hunter notes or current workplace
- **Priority:** Medium · **Category:** backend + frontend · **Spec:** §38 AC01/AC03, §39 AC03, §40 AC04, §42
- **URL:** /applications/9869fac9-1ae8-46a5-b97f-fc48e629ac1f (company); /applications/8d25a157… (hunter owner after disclosure)
- **מה קורה כרגע:**
  - For a "פרופיל מלא" submission, and for an anonymous one after the profile was approved, the receiver sees only name, phone, e-mail, LinkedIn and an empty experience block.
  - The AI summary, answers to screening questions, "שכר מבוקש" and the hunter's "הערות נוספות" are missing. The hunter sees all of them in the same submission.
  - Notes never reach the receiver, not even on anonymous submissions (`notes:null`).
  - After disclosure, "מקום עבודה נוכחי" ("QA-AUTO 1020 E1 Alpha Workplace") is missing too, also from the HTML.
- **מה צריך לקרות:** A full-profile submission, and an approved disclosure, show the receiver everything the sender sent:
  - full profile: name, phone, e-mail, LinkedIn, current and previous workplaces with years, full experience;
  - AI summary and strengths;
  - answers to the job's screening questions;
  - salary expectation;
  - the hunter's notes;
  - the CV file.
  Anonymous submissions keep showing the anonymous summary, answers and notes without PII.
- **Steps:** hunter_free submits "QA-AUTO 1020 C3 פתוח 3" with full profile to J-49 → company opens J-49 → מועמדים שהוגשו → the candidate.
- **Screenshots:** C3/verify-V4-full-profile-company-view-desktop.png, C3/verify-V4-hunter-sees-full-submission-card-desktop.png, E1/E1A-40-full-profile-no-workplace-annot-desktop.png
- **Verified:** yes, 2/2 (C3); E1 workplace part — 1 run, stable in HTML

### 13. Receiving side has no "מתאים / לא מתאים" and no "בקשת NDA" actions on an application
- **Priority:** Medium (PM: may be replaced by "בקשת פרופיל מלא") · **Category:** frontend + backend · **Spec:** §41 AC02, §42 AC01, §42 AC03
- **URL:** anonymous application card (company on J-49; hunter owner on J-81)
- **מה קורה כרגע:** Available actions are only "בקשת פרופיל מלא / דחייה / ביטול / שאלות נוספות / שליחת הודעה". There is no way to mark the candidate as suitable or not suitable, and no way to request an NDA.
- **מה צריך לקרות:**
  - The receiver can mark an anonymous candidate "מתאים" or "לא מתאים" (§41 AC02, §42 AC01). The sender sees the result as a status and gets a notification.
  - The receiver can request an NDA before disclosure (§42 AC03). This starts the NDA flow: the sender gets a request, signs, and the status shows Waiting for NDA → NDA Signed.
  - If PM decides "בקשת פרופיל מלא" replaces "מתאים", document it and close this item.
- **Steps:** Open an anonymous application on your job and look at the actions.
- **Screenshots:** C3/verify-V5-anon-card-actions-desktop.png, E1/E1A-42-owner-app0-desktop.png
- **Verified:** yes, 2/2

### 14. NDA signed before submitting a candidate — no notification to either side
- **Priority:** Medium · **Category:** backend · **Spec:** §73 AC04, §45 AC02
- **URL:** bell of the job owner (hunter_free demo-hunter-2) and of the sender (hunter_plus claude-test); jobs J-83/J-84 with NDA = כן
- **מה קורה כרגע:** The sender signed the job's NDA and submitted a candidate. The owner received only "התקבלה מועמדות חדשה למשרה „…”", with nothing about the NDA. The sender received nothing. The templates `nda_signed` / `nda_requested` exist in the page dictionary but are never triggered.
- **מה צריך לקרות:**
  - When an NDA is requested, the other side gets "נדרשת חתימה על NDA למשרה „…”".
  - When the NDA is signed, both sides get "ה-NDA למשרה „…” נחתם על ידי <name>". The link opens the application, or the agreement under "הסכמים".
  - Notifications appear in the bell (and by e-mail/push if enabled in settings).
- **Steps:** demo-hunter-2 publishes a job with "האם נדרשת חתימה על NDA לפני הגשת מועמד?" = כן → claude-test clicks "הגשה" on a candidate → signs → submits → check both bells.
- **Screenshots:** E1/verify-nda-owner-bell-run3-no-nda-annot-desktop.png, E1/E1A-73-owner-bell-no-nda-notif-annot-desktop.png
- **Verified:** yes, 3/3 (J-83, J-84)

### 15. Application on an NDA job shows no NDA status (no "Waiting for NDA" / "NDA Signed")
- **Priority:** Medium · **Category:** backend + frontend · **Spec:** §06 AC01–02
- **URL:** application card on J-83/J-84, owner and sender
- **מה קורה כרגע:** The status timeline shows only "נשלח · נצפה". Nothing in the application says an NDA was required or signed; the server returns `status:"sent"`. The strings "ממתין ל-NDA / NDA נחתם" exist in the dictionary but are never shown. The NDA is visible only in the "הסכמים" tab.
- **מה צריך לקרות:**
  - For NDA-required applications the timeline includes "ממתין ל-NDA" (requested, not signed) and "NDA נחתם" (signed, with date), per §06 AC01. These are the same status on both sides and in admin.
  - The card shows an NDA indicator with a link to the signed agreement.
- **Steps:** Open the application submitted to J-83 as owner and as sender.
- **Screenshots:** E1/verify-nda-owner-card-no-nda-status-annot-desktop.png
- **Verified:** yes, 3/3

### 16. NDA signing screen has no "decline" option — only close
- **Priority:** Medium (low-medium) · **Category:** frontend · **Spec:** §46 AC04, §45 AC06, §36 AC05
- **URL:** "חתימה על הסכם סודיות (NDA) לפני הגשת מועמד" screen (sender)
- **מה קורה כרגע:** There are only two buttons, "סגירה" (arrow) and "חתימה וסיום". There is no explicit decline, no explanation that the candidate cannot be submitted without signing, and no "submit anonymously only" alternative. "סגירה" silently closes the window and nothing is created.
- **מה צריך לקרות:**
  - The screen explains that this job requires an NDA before submission.
  - It offers "סירוב לחתימה". Declining returns the user to the anonymous-only option (§46 AC04) or stops the process with a clear message, per the PM decision on the refusal model (Miro vs PRD).
  - Closing without a decision says that nothing was submitted.
- **Steps:** Open a job with NDA = כן as another hunter → "הגשה" on a candidate.
- **Screenshots:** E1/verify-nda-screen-no-decline-annot-desktop.png
- **Verified:** yes, 3/3

### 17. After the owner archives a job, the sender loses all access to their submissions and final statuses
- **Priority:** Medium · **Category:** frontend + backend · **Spec:** §06 user story "לעקוב אחרי סטטוס כל מועמדות ששלחתי"
- **URL:** sender hunter_plus; job J-81 archived by demo-hunter-2
- **מה קורה כרגע:**
  - The job drawer is the sender's only list of submissions with statuses, and after archiving it returns 404.
  - "המועמדים שלי", candidate cards, /my-jobs and "ממתינים" show nothing.
  - The status survives only in the text of an old notification (whose link gives 404) and on /applications/<id> by direct URL, without the job name.
  - The sender can no longer see that Alpha was "התקבל/ה לעבודה".
- **מה צריך לקרות:**
  - The sender always sees every submission they made, with job name, current/final status and history, even after the job is archived, expired or closed.
  - For example: a "ההגשות שלי" list, or a "הגשות" section on each candidate card.
  - An archived job opens read-only for participants instead of a 404.
- **Steps:**
  1. claude-test submits a candidate to demo-hunter-2's job.
  2. demo-hunter-2 → פעולות משרה → העברה לארכיון.
  3. claude-test tries to find the submission and its status.
- **Screenshots:** E1/verify-F4-J81-archived-404-sender-desktop.png, E1/verify-F4-compare-active-J49-sender-sees-status-desktop.png, E1/verify-F4-applications-Alpha-direct-url-shows-hired-no-job-desktop.png
- **Verified:** yes, 3/3. Related known ticket: «קישור ההתראה למשרה בארכיון פותח דף 404».

### 18. Tender offers: "אישור ההצעה" / "דחיית ההצעה" are applied in one click — no confirmation, no reason, no undo
- **Priority:** Medium · **Category:** frontend · **Spec:** §42 (analogue for tenders), consistency with job archive confirmation
- **URL:** /tenders/<id> → expand an offer row (company_2, T-58)
- **מה קורה כרגע:** Clicking "אישור ההצעה" or "דחיית ההצעה" applies the decision immediately: the toast "ההצעה נדחתה ונשלח עדכון למגיש/ה" appears and the decision buttons disappear. There is no confirmation dialog, no reason field and no undo. The bidder is notified at once.
- **מה צריך לקרות:**
  - Both actions open a confirmation dialog naming the bidder and the amount ("לאשר את ההצעה של <name> בסך ₪X?").
  - Rejection allows an optional reason, which the bidder sees.
  - After approval, the next step follows the PM decision (close the tender / reject the others / allow more approvals).
  - A short undo window or a "change decision" option is available, or the irreversibility is stated in the dialog.
- **Steps:** company_2 → T-58 → expand an offer → אישור / דחייה.
- **Screenshots:** E1/42-E1F-company2-approve-confirm-desktop.png, E1/verify-F2-after-reject-no-undo-company2-desktop.png
- **Verified:** yes (rejection once, irreversible; state 3/3)

### 19. Candidacy statuses: final statuses (התקבל/ה לעבודה / נדחה / סגור) can be flipped back and forth in one click, with no confirmation and no reason
- **Priority:** Medium · **Category:** frontend + backend · **Spec:** §06 AC02, §42 AC05
- **URL:** /applications/<id> status menu (company), e.g. b9f47818… (full-profile submission)
- **מה קורה כרגע:**
  - The company can switch "התקבל/ה לעבודה" → "נדחה" → "התקבל/ה לעבודה", and "סגור" → "נצפה" → "התקבל/ה לעבודה". Each change is one click; the server action `[id,"rejected"]` / `[id,"accepted"]` returns 200 within 50–70 ms. Only a toast "המועמד/ת סומן/ה כ„נדחה”" appears.
  - This also works on an archived job.
  - The hunter receives contradictory notifications, and some are collapsed (6 changes → 1 notification).
  - When the status is "פרופיל מלא אושר", the menu has no selected item and can go back to "נצפה".
  - "דחייה" / "בקשת פרופיל מלא" / the hunter's "שליחת פרופיל מלא" (irreversible disclosure) have no confirmation either.
  - An anonymous rejected application cannot be "revived" because it has no status menu, so the two submission types behave differently.
- **מה צריך לקרות:**
  - Final statuses are final, or changing them requires a confirmation dialog with a mandatory reason, logged in the application history and in admin. The hiring status affects the commission.
  - Moving backwards in the funnel (e.g. to "נצפה") is not offered.
  - Irreversible actions (disclosure, rejection, hire) show a confirmation dialog.
  - The sender gets one clear notification per real change.
  - The same rules apply to anonymous and full submissions.
- **Steps:** company → J-66 → open the "QA-AUTO 1020 N3 פתוח 3" application → status menu → נדחה → menu again → התקבל/ה לעבודה → check the hunter's bell.
- **Screenshots:** N3/app-company-hired-status-menu-reversible.png, N3/verify-C2-company-hired-to-rejected-no-confirm.png, N3/verify-C2-hunter-bell-contradictory.png, C3/42-a2-reject-step1-desktop.png, C3/06-a1-status-menu-company-desktop.png
- **Verified:** yes, 2 runs (N3). Observed on J-66, which was temporarily inactive because of the QA admin incident; the behaviour does not depend on the job status.

### 20. Admin: search by full name does not find users/applications (multi-word names)
- **Priority:** Medium · **Category:** backend · **Spec:** §76 AC01, field placeholder
- **URL:** /admin/applications ("חיפוש לפי משרה, מועמד, מגיש או מספר"), /admin/users ("חיפוש לפי שם…")
- **מה קורה כרגע:**
  - /admin/applications: "הד האנטר דמו 3" → 0, "הד האנטר דמו" → 0, "QA-AUTO 1020 C3 אנונימי 5" → 0; but "האנטר דמו 3" → 2, and two-word "נועם כהן" → 24. It looks as if the query is split at the first space into first and last name.
  - /admin/users: a full name never matches, even "נועם כהן" → 0, although "נועם" → U-2.
  - The placeholder example "J-1042" does not exist.
- **מה צריך לקרות:**
  - The search matches the full query as a substring of the full name (first + last name, any number of words), the e-mail, the job title and the J-/T-/U- number.
  - It is case- and extra-space-insensitive.
  - Example numbers in placeholders are real formats.
- **Steps:** admin → /admin/applications → "הד האנטר דמו 3" → Enter → "0 תוצאות"; /admin/users → "נועם כהן" → 0.
- **Screenshots:** C5/verify-f1-apps-fullname-0.png, C5/verify-f1-apps-partial-2.png, C5/verify-f1-users-noam-cohen-0.png
- **Verified:** yes, 3/3

### 21. CV upload does not validate file content: empty PDFs and non-PDF files renamed to .pdf (txt, Windows exe) are accepted and stored
- **Priority:** Medium (security) · **Category:** backend · **Spec:** §22 AC03, §23 AC03 (file rules not in spec — common sense / security)
- **URL:** /profile?edit=documents "קובץ קו״ח" (talent, talent_2); /my-candidates/new "קובץ קו״ח" (hunter_plus)
- **מה קורה כרגע:**
  - Talent:
    - a 0-byte PDF and a 31-byte text file renamed to .pdf are accepted without an error;
    - on file selection, `POST storage/v1/object/documents/<uid>/cv-…pdf` → 200, then the server action → 200;
    - the file is attached to the profile immediately (before "המשך"), and the profile header shows a "קו״ח" link to the empty or fake file;
    - storage has size 0 / 31 with mime `application/pdf`.
  - Hunter: a Windows exe (`4d5a 9000`, MZ) named `qa-n2-fake.pdf` is uploaded to storage → 200 and attached to the form; the only reaction is "לא הצלחנו לקרוא את קורות החיים, אפשר למלא את הפרטים ידנית".
  - Extension and size are checked: .png/.txt/.docx are rejected where not allowed, >10 MB → "הקובץ גדול מדי (עד 10MB)", and an empty file on the hunter form → "הקובץ ריק".
- **מה צריך לקרות:**
  - The server checks the real file signature (`%PDF`, DOCX zip header if Word is allowed, PNG/JPEG/WebP where images are allowed) and rejects empty files.
  - On mismatch, nothing is stored, and the user sees a clear message at the field, e.g. "הקובץ אינו PDF תקין".
  - The upload is committed only when the form is saved; or, if uploaded immediately, the file is deleted when the user removes it or abandons the form.
  - Files that companies later download are never executable content.
- **Steps:** talent_2 → /profile?edit=documents → הוספת קובץ → choose a 0-byte .pdf or a .txt renamed to .pdf → reload: the CV is still there. Hunter: add candidate → upload exe renamed to .pdf → Network: 200.
- **Screenshots:** N4/verify-cv-0byte-accepted-after-reload-desktop.png, N4/verify-cv-fakepdf-accepted-after-reload-desktop.png, N2/verify-A-exe-as-pdf-uploaded-desktop-plus.png, N2/verify-A-docx-rejected-desktop-plus.png
- **Verified:** yes, 3/3 (N4) and 3/3 (N2). Regression of the 04.10 negative audit item #3 (partially fixed).

### 22. Requests/questions on an inactive or archived job: company can still act, hunter cannot respond (dead end, link → 404)
- **Priority:** Medium · **Category:** frontend + backend · **Spec:** §40 AC02, §43 AC02–03, §44 AC01
- **URL:** /collaborations/3a6fab44… (J-66, archived), /applications/<id>; company + hunter_free
- **מה קורה כרגע:**
  - On an inactive or archived job the company still has "בקשת פרופיל מלא", "שאלות נוספות", "דחייה", "ביטול", and they work ("הבקשה נשלחה…", "השאלות נשלחו", status "נשלחו שאלות / ממתין לתשובה").
  - The hunter receives the notifications ("סופר פארם ביקשו את הפרופיל המלא של…", "…שאלו שאלות על…"), but the link `/collaborations/3a6fab44…?application=…` → 404.
  - "עוד → ממתינים" is empty, and /applications/<id> has no "שליחת פרופיל מלא / דחיית הבקשה" and no way to answer.
  - The company waits for an answer the hunter cannot give.
  - Note: part of this was observed while J-66 was "לא פעילה" due to a QA admin-script incident. The archived-job part (actions available + 404) was re-verified on a legitimately archived job.
- **מה צריך לקרות:** One of two consistent options (PM to choose):
  - (a) On an inactive or archived job, the receiver's actions are disabled with an explanation such as "המשרה אינה פעילה". Pending requests are auto-closed and both sides are notified.
  - (b) Actions stay allowed, and the sender can respond from /applications/<id> and from "ממתינים". The notification link opens the application (read-only job context), never a 404.
- **Steps:** The job becomes inactive or archived → company opens an anonymous "נצפה" application → בקשת פרופיל מלא / שאלות נוספות → hunter_free: bell → click → 404; עוד → ממתינים → empty.
- **Screenshots:** N3/verify-C1-company-archived-nonfinal-actions.png, N3/verify-C1-hunter-fullreq-link-404.png, N3/verify-C1-hunter-questions-link-404.png, N3/app-hunter-pending-empty-while-request.png
- **Verified:** partially — actions on archived job and 404 confirmed (3/3); empty "ממתינים" only from the tester's screenshots. The 404 itself is known: «קישור ההתראה למשרה בארכיון פותח דף 404»; the new part is the dead-end flow.

### 23. HR tender offer amount: negative, huge and fractional values are accepted; −50 is saved as ₪50; HR cannot see, edit or withdraw the offer
- **Priority:** Medium · **Category:** frontend + backend · **Spec:** §33 AC02, §67
- **URL:** /tenders/<foreign tender> → "הגשת הצעה" (HR company_6); company view of T-53
- **מה קורה כרגע:**
  - The field "ההצעה שלי (לפרויקט) ₪" (`type=text inputmode=decimal`, no min/step) lets −50, 999999999 and 1.5 through; the request is sent without a hint (3/3 each).
  - Empty, 0 and "abc" are blocked with "יש להזין סכום גדול מ-0", so the hint itself promises >0.
  - A real offer of −50 on T-53 was accepted ("ההצעה שלכם נשלחה / ממתין לתשובה מהחברה"). The company sees it as "מיכל לוי ₪50 לפרויקט" (`"amount":50`): the sign was silently dropped.
  - HR cannot see its own amount, and cannot correct or withdraw the offer.
- **מה צריך לקרות:**
  - Client and server both reject amounts ≤0, non-numeric values and values above an agreed maximum (PM), with a message at the field. Decimals follow the PM rule (e.g. whole shekels only).
  - The server never transforms the value (no abs()).
  - After sending, HR sees its offer (amount, notes, status) on the tender page and can edit or withdraw it while the status is "ממתין לתשובה".
- **Steps:** HR → open a foreign open tender without NDA → הגשת הצעה → amount `-50` → "אני מאשר…" → send → company opens the tender.
- **Screenshots:** N3/verify-hr-offer-minus50-filled.png, N3/verify-hr-offer-999999999-filled.png, N3/verify-hr-offer-1_5-filled.png, N3/verify-hr-offer-0-blocked.png, N3/verify-T53-company-offer-amount.png, N3/app-T53-hr-offer-amount-company-view.png
- **Verified:** partially — the client-side pass is confirmed 3/3 (requests intercepted); "₪50" shown to the company 3/3 by data.

### 24. /organizations: for a logged-in company (and HR) all "publish tender" CTAs lead to /register
- **Priority:** Medium · **Category:** frontend · **Spec:** §11 AC02
- **URL:** /organizations, logged in as company (demo-company-1) or HR
- **מה קורה כרגע:** All 3 CTAs ("פרסמו מכרז עכשיו" ×2, "פרסום מכרז באתר") have a static `href=/register`. The registration form opens even though the user is logged in (header shows "לוח בקרה"). The wizard /publish/tender works when opened directly.
- **מה צריך לקרות:**
  - Landing CTAs depend on the session: a logged-in company goes straight to /publish/tender; a logged-in HR/hunter/talent gets their relevant page (or the CTA is hidden); a guest goes to registration/login.
  - A logged-in user never sees the registration form.
- **Steps:** Log in as company → open /organizations → click "פרסמו מכרז עכשיו".
- **Screenshots:** F1/site/verify-organizations-cta-company-desktop.png, F1/site/verify-organizations-cta-company-desktop-register.png
- **Verified:** yes, 3/3

### 25. Talent profile promotion (§56) does not exist — no entry point anywhere
- **Priority:** Medium (confirm release scope) · **Category:** frontend + backend · **Spec:** §56 AC01, Miro (Talent Pro: "קידומים + הפצות – פתוח")
- **URL:** /profile (all tabs), /recommendations, /hunters, /collaborations, plan selection — talent / talent_2
- **מה קורה כרגע:** There is no "קידום פרופיל" anywhere, not even as an upsell, and plan cards do not mention it. The words "קידום/לקדם" appear 0 times on the talent side.
- **מה צריך לקרות:**
  - A talent (per plan rules: PRO, or paid add-on per PM) can pay to have the profile shown at the top of the Talents page for a period at the admin price (§56 AC01).
  - The promoted profile is marked and ordered first.
  - The salary threshold (§57) applies if PM confirms.
  - FREE users see the option as an upsell.
- **Steps:** Log in as talent_2 → look through account menu, profile tabs, plan window.
- **Screenshots:** C4/verify-talent-free-upgrade.png, C4/verify-talent-subscription.png
- **Verified:** yes, 3/3

### 26. Footer social icons and founders' LinkedIn links on /about point to "#"
- **Priority:** Medium (needs real URLs from the client) · **Category:** frontend / content · **Spec:** common sense; footer content partly known (MentMe template, 6a719ec6)
- **URL:** footer on all pages (all languages); /about → "נעים להכיר!"
- **מה קורה כרגע:** The footer icons YouTube / Instagram / TikTok / Facebook / LinkedIn have `href="#"`, so a click goes to "/#". On /about, "בת אל הוד ב-LinkedIn" and "חלי קרן ב-LinkedIn" are also `href="#"`.
- **מה צריך לקרות:**
  - Each icon links to the real Hunters profile, opening in a new tab with `rel="noopener"`. Icons without a real profile are hidden.
  - The founders' LinkedIn links open their profiles, or are removed.
  - No link on the site points to "#".
- **Steps:** Any page → footer → click an icon; /about → click a LinkedIn link.
- **Screenshots:** C1/verify-footer-social-desktop.png, C1/verify-about-linkedin-desktop.png, M1/ver-F-footer-social-hash-he-*.png
- **Verified:** yes, 3/3

### 27. Mobile: the payment window opens scrolled to the bottom (inherits the scroll of the plans window)
- **Priority:** Medium · **Category:** frontend · **Spec:** §69, §01 AC03
- **URL:** /profile?tab=subscription → בחירת חבילה → PREMIUM → המשך עם החבילה שנבחרה (hunter_plus, hunter_free_2); iPhone and Android
- **מה קורה כרגע:** The "תשלום" window opens with scrollTop 604 of 1209 on iPhone (header and "חזרה" at y≈−560), and 375 of 1190 on Android. The user first sees only "אישור תשלום ₪320.00". The title, back button, coupon and card fields are visible only after scrolling up.
- **מה צריך לקרות:** Every modal/step opens scrolled to the top (scrollTop 0), with the title and the "חזרה"/close button visible. Focus moves to the window title.
- **Steps:** Phone → profile → המנוי שלי → בחירת חבילה → PREMIUM → המשך (do not pay; close with Escape).
- **Screenshots:** M2/ver-A2-payment-scrolled-{iphone,android}.png
- **Verified:** yes, 3/3

### 28. iPhone: input fields use 14px font, so Safari zooms the page on focus (all forms)
- **Priority:** Medium · **Category:** frontend · **Spec:** §01 AC03
- **URL:**
  - guest: /login, /forgot-password, /register;
  - logged in: "הוספת מועמד", "עריכת פרופיל", /publish/job, list searches, admin search and /admin/pricing, coupon and card fields in the payment window.
- **מה קורה כרגע:**
  - The computed font-size of inputs is 14px (15px on /admin/messages), height 38px. Examples: /my-candidates/new — 16 of 18 fields; edit profile — 15/15; /publish/job — 5/6.
  - The viewport is `width=device-width, initial-scale=1`. iOS Safari auto-zooms on focus into any field below 16px and does not zoom back.
  - The zoom itself is not reproducible in WebKit emulation; the 14px size is confirmed.
- **מה צריך לקרות:**
  - On mobile breakpoints all inputs, selects and textareas use font-size ≥16px, so Safari does not zoom (no `maximum-scale` hacks that block user zoom).
  - Field height ≥44px.
- **Steps:** iPhone → /login → tap the e-mail field; logged in → /my-candidates/new → tap "שם פרטי".
- **Screenshots:** M1/ver-E-login-input-14px-{iphone,android}.png, M2/ver-A3-input-14px-iphone.png, M2/ver-B4-input-14px-iphone.png, M2/ver-C3-*-14px-*.png
- **Verified:** yes (size, 3/3); the zoom itself needs a real iPhone

### 29. iPhone: application status menu opens below the screen edge
- **Priority:** Medium · **Category:** frontend · **Spec:** §01 AC03
- **URL:** /applications/9869fac9… (application to J-49), company; iPhone 375×629
- **מה קורה כרגע:** The status button is at y564, and the menu opens downward at y600–778 on a 629px screen. "התקבל/ה לעבודה", "נדחה" and "סגור" are fully off-screen and "נצפה" partially. The menu does not flip up. On Android (839px) all 4 items are visible.
- **מה צריך לקרות:** Dropdowns flip upward when there is no room below, or are shown as a bottom sheet on mobile. All items are reachable without scrolling the page.
- **Steps:** iPhone → company → J-49 → an application → status button (do not select; Escape).
- **Screenshots:** M2/ver-B2-status-menu-cut-iphone.png
- **Verified:** yes, iPhone 3/3 (Android 0/3)

### 30. Testimonials carousel: Next/Previous buttons scroll a fixed 686px and ignore RTL — "הבא" does nothing, cards are skipped
- **Priority:** Medium · **Category:** frontend · **Spec:** §02 AC02, §09 AC04
- **URL:** / → "משתמשי Hunters משתפים בחוויה שלהם" (he, ar, en); mobile (also visible on desktop)
- **מה קורה כרגע:**
  - The buttons call `scrollBy(±686px)` (≈1.8 cards, snap to 2) without RTL handling.
  - RTL: "הבא"/"التالي" on card 1 does nothing (3 presses); on card 2 it goes back to card 1; "הקודם"/"السابق" on card 1 jumps to card 3.
  - en: "Next" goes 1→3 and "Previous" 3→1, so card 2 is skipped.
  - Swipe on Android moves exactly one card (correct).
- **מה צריך לקרות:**
  - "הבא" always shows the next card and "הקודם" the previous one, one card per press, in both RTL and LTR (scroll direction inverted for `dir=rtl`).
  - At the first/last card the corresponding arrow is disabled.
  - Keyboard and screen-reader labels match the behaviour.
- **Steps:** / → scroll to testimonials → press "הבא" and "הקודם" (also on /ar and /en).
- **Screenshots:** M1/ver-D-he-next-noop-*.png, M1/ver-D-ar-next-noop-*.png, M1/ver-D-he-prev-jump-to-3-*.png, M1/ver-D-en-next-skip-to-3-*.png
- **Verified:** yes, 3/3

### 31. Mobile /headhunters: titles of the 4 "מה Hunters מציעה" feature cards are clipped on both sides
- **Priority:** Medium · **Category:** frontend · **Spec:** §01 AC03, §10 AC03
- **URL:** /<lang>/headhunters → 4 dark feature cards; iPhone and Android; all languages
- **מה קורה כרגע:**
  - The H3 is `absolute left-1/2 -translate-x-1/2` with a fixed width (RTL 290–435px, LTR `w-[470px]`) and 32px font, inside a card of 343/380px with `overflow-clip`, so both edges are cut.
  - Worst cases: ru "Сотрудничество с другими хедхантерами" −44px per side (iPhone), −26 (Android); he "צ’אטים עם הד האנטרים, חברות וטאלנטים" −36/−17; en "Promotion and distribution" −36/−18.
  - (The campaign.svg icon no longer overlaps the text — this is a different issue from the one in the known reject.)
- **מה צריך לקרות:** On mobile, card titles are in normal flow (not absolute), with width ≤ card width and text wrapping onto 2–3 lines. A smaller mobile font size if needed. No text is cut in any language.
- **Steps:** Phone → /ru/headhunters (and /headhunters, /en/headhunters) → scroll to the 4 dark cards.
- **Screenshots:** M1/ver-G-ru-collab-title-clipped-*.png, M1/ver-G-he-chats-title-clipped-*.png, M1/ver-G-en-promotion-title-clipped-*.png
- **Verified:** yes, 3/3. Compare with the open reject «במובייל: טקסטים גולשים… אייקון /headhunters» before filing — it may be better as a rejection comment.

### 32. (optional) Sender sees the receiver's status menu on their own submission; any choice → "משהו השתבש, נסו שוב"
- **Priority:** Low (low-medium) · **Category:** frontend · **Spec:** §06
- **URL:** /applications/eca3b727… (own submission), hunter_free
- **מה קורה כרגע:** The sender sees the company's status menu "נצפה / התקבל/ה לעבודה / נדחה / סגור". Any selection shows the toast "משהו השתבש, נסו שוב", and the server returns `{"error":"generic"}` (empty response for `viewed`). The status does not change (3/3).
- **מה צריך לקרות:** For the sender the status is read-only (a badge plus history, no menu). Only the receiver can change it.
- **Steps:** hunter_free → /applications/eca3b727… → status button → התקבל/ה לעבודה.
- **Screenshots:** N3/app-hunter-status-menu-own-submission.png, N3/app-hunter-status-change-error.png
- **Verified:** no (3/3 by the tester). Observed on a J-66 application.

### 33. (optional) FREE headhunter learns about the monthly submission limit only at the final step
- **Priority:** Low · **Category:** frontend · **Spec:** §63 AC06
- **URL:** job drawer → "הגשת מועמד" (hunter_free_2, FREE)
- **מה קורה כרגע:** After the limit of 4 submissions per month is reached, the hunter can still choose a profile and answer "שאלות סינון". Only after "סיום והגשה" does the toast "הגעתם למגבלה של מסלול FREE. אפשר לשדרג כדי להמשיך להגיש" + "בחירת חבילה" appear, and the filled form is lost. There is no "נותרו X מתוך 4" counter anywhere. The limit itself works server-side (the 5th submission is not created).
- **מה צריך לקרות:** FREE users see the remaining quota ("נותרו X מתוך 4 הגשות החודש") in the submission dialog and on the plan card. When the quota is 0, "הגשה" is disabled up front with the upgrade CTA and the reset date. The server check stays.
- **Steps:** FREE hunter with 4 submissions this month → open another job → go through the dialog to "סיום והגשה".
- **Screenshots:** N2/63-free-limit-reached-desktop-free.png
- **Verified:** no (low; server response is unambiguous)