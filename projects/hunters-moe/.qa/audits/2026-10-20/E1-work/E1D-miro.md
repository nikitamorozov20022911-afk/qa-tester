# E1D · Miro: Candidacy Flow и Work Representation Flow, роли и тарифы, расхождения Miro ↔ PRD ↔ сайт

Прогон 2026-10-20, сессия E1, часть D. Доска: https://miro.com/app/board/uXjVLL2KpDc=/?share. Открыта гостем (playwright-cli `-s=e1d-miro`, 1440×900, «View only»).
На доске делал только две вещи: прокручивал и масштабировал (Ctrl+колесо), снимал скриншоты. По объектам доски не кликал, ничего не создавал и не комментировал. Текст снят через встроенную кнопку Miro «Enhance accessibility support»: это режим только для чтения, он показывает текст всех объектов по порядку. Включил её с клавиатуры (фокус → Enter), доска от этого не меняется.
Стрелки (кто куда ведёт) в этом режиме не видны. Поэтому связи узлов я сверил по скриншотам при 70% (`miro-c-*.png`, `miro-wr-*.png`).

- Скриншоты: `/Users/avielshnaider/hunters-moe/.qa/screenshots/run-1020/E1/miro-*.png`
  - `miro-overview.png`: вся доска при 7%. Видно 2 фрейма и под ними mind map ролей.
  - `miro-candidacy-overview.png`: оба фрейма при 26%.
  - `miro-c-top-1..4.png`, `miro-c-bot-1..3.png`: Candidacy Flow по частям при 70%.
  - `miro-wr-1.png`, `miro-wr-2.png`: Work Representation Flow (фрейм «Frame 1») при 70%.
  - `miro-roles-hh-company.png`, `miro-roles-plans-he.png`: mind map ролей и тарифов при 70%.
- Сырой текст доски (дословно): `/Users/avielshnaider/hunters-moe/.qa/audits/2026-10-20/E1-work/scripts/e1d-miro-outline.txt`
- Скрипты: `/Users/avielshnaider/hunters-moe/.qa/audits/2026-10-20/E1-work/scripts/e1d-*.js`

---

## Задача 1. Ветки Miro дословно

### 1.1 Candidacy Flow (фрейм «Candidacy Flow», заголовок внутри: «Candidacy Company flow»)

Корень: **«Button send candidacy»**. От него две ветки. Кто нажимает кнопку, на доске прямо не написано. По узлам «Talent pay for this», «Talent Want NDA?», «The talent pays», «Message to talent…» это **талант**. В PRD отправитель в §37–§41 — хедхантер, это расхождение (см. задачу 3).

#### Ветка A — «Send profile anonymous» (верх фрейма, `miro-c-top-1..4.png`)
```
Button send candidacy
 └─> Send profile anonymous
      └─> "Talent pay for this. Will create the 3 questions, and the AI Resume to send, questions from the business"
           └─> Talent Want NDA?
                ├─ Yes ─> "Company sign the NDA and tell the reason (customer will send list)"
                │          ├─ No ─> "Message to talent that the position owner doesn't want to sign NDA.
                │          │         If wants continue with following options:"
                │          │          ├─> "Send candidacy full profile"
                │          │          ├─> "Send candidacy without NDA (same flow before)"
                │          │          └─> "Work representation (anonymous questions) Extras questions."
                │          └─ Yes ─> (в узел ниже)
                └─ No ──> "Position Owner receive the AI Resume from user without private data + Questions"
                           (сюда же сходится Yes после подписи NDA компанией)
                           └─> "Company approves the AI Resume"
                                ├─ No ─> "Message to user reproved (from list from customer). User can send the full profile anyway"
                                └─ Yes ─> "Send to user message to send full profile."
                                           └─> "User accept to sent full profile with all data"
                                                ├─ Yes ─> (стрелка без продолжения: на доске следующего узла нет)
                                                └─ No ──> "END of scenario"
```

#### Ветка B — «Send full profile» (низ фрейма, `miro-c-top-1.png`, `miro-c-top-2.png`, `miro-wr-2.png`)
```
Button send candidacy
 └─> Send full profile
      └─> Company has NDA?
           ├─ Yes ─> "User sign company NDA" ─┐
           └─ No ─────────────────────────────┴─> Talent Want NDA?
                ├─ Yes ─> "The talent pays"
                │          └─> "Company sign the NDA and tell the reason (customer will send list)"
                │               ├─ No ─> "Message to talent that the position owner doesn't want to sign NDA.
                │               │         If wants continue with following options:"
                │               │          ├─> "Send profile anonymous"
                │               │          └─> "Send candidacy without NDA (same flow before)"
                │               └─ Yes ─> "Position Owner receive all the user data"
                └─ No ──> "Position Owner receive all the user data"
                           └─> "Company proceed with the process"
```

#### Что из этого следует (только наблюдения, без вывода о сайте)
- **Оплаты в Candidacy Flow:**
  - (1) анонимная подача — «Talent pay for this»;
  - (2) NDA по желанию таланта при полном профиле — «The talent pays».
  - В анонимной ветке за NDA таланта отдельной оплаты нет: она, видимо, входит в «Talent pay for this».
  - Цены здесь не указаны. Они есть в заметках тарифов таланта (1.3).
- **Два вида NDA:**
  - NDA компании: «Company has NDA? → User sign company NDA». Подписывает талант, вопрос есть только в ветке полного профиля.
  - NDA таланта: «Talent Want NDA? → Company sign the NDA…». Подписывает компания, вопрос есть в обеих ветках.
- **Компания отказалась подписать NDA таланта.** Талант получает сообщение и выбирает, как продолжить:
  - после анонимной подачи: полный профиль, подача без NDA или Work representation;
  - после полного профиля: анонимно или подача без NDA.
- **«tell the reason (customer will send list)»:** у компании должен быть список причин от заказчика. Списка на доске нет.
- **Решение по анонимной подаче — «Company approves the AI Resume» (да/нет).**
  - «Нет»: сообщение «reproved» с причиной из списка заказчика, и талант всё равно может отправить полный профиль.
  - «Да»: компания просит полный профиль, талант соглашается или нет. «Нет» = «END of scenario». У «Yes» на доске продолжения нет.
- **Вопросов от компании к отправителю** (дополнительных вопросов во время рассмотрения) в Candidacy Flow нет. Есть только «3 questions… questions from the business» при отправке, а «Extras questions» — через Work representation.
- **В Candidacy Flow нет:** уведомлений, статусов, popup «ממתינים», найма или отказа после раскрытия (кроме «Company proceed with the process»), участия хедхантера.

### 1.2 Work Representation Flow (фрейм «Frame 1», `miro-wr-1.png`, `miro-wr-2.png`)
Заголовок-условие (дословно): **«Work Representation Flow: Only related for anonymous requests: Only one time after»** (фраза на доске обрывается на «after»).
```
"The user requests work representation:"
 └─> "Open popup with free text to ask questions to the position owner (amount of 3 questions)"
      └─> "The company receive the questions and answer them (eveyrthing private)"
           └─> "Candidate receive the questions ans see them"
                ├─> "Im not feeling safe to identify, ask for help" ─> "Goes for admin portal and they will talk with the candidate"
                ├─> "Go for apply"
                └─> "Something wrong happend" ─> "Open Feedback for admin"
```
Рядом с фреймом есть отдельная заметка без стрелок: **«Admin: Option to give questions our give discount»**.
Связь с Candidacy Flow: в ветке A есть узел «Work representation (anonymous questions) Extras questions.» Это вариант для таланта после того, как компания отказалась подписать NDA.
**Оплаты** в самом фрейме не указаны. Цену WR задаёт админка (PRD §78 AC04, на сайте `representation_work` — «טרם תומחר»).

### 1.3 Узлы ролей и тарифов (mind map под фреймами), дословно
**HeadHunters** (`miro-roles-hh-company.png`):
- «Freemium: -He can publish job position without limitation -Cannot upload talent in the system -Cannot see the bids -Cannot apply candidate for a job position -Not receiving pushing -Dont have job recommendation -Dont have chat»
- «Premium: Full Access»
- «Can send candidacy for bid published by a company - Flow above (option to send anonymous or full profile)»
- «Can publish a job position for headhunters, talent.»
- «Send candidates for other head hunters and company job positions» · «Chat with other head hunters» · «Can receive candidacy from Talents» · «Can look for talents in a bank of users»
- «Promotion: -Extra service that headhunter can show a job position in the top of the list and the searching. Two options: Two weeks: Price and will be two weeks in the top. After this time, the post will be normal. Four weeks: Price and will be four weeks in top. -Extra service: "Unique position". The head hunter will be able to choose a position and show with the bade "unique" with turquoise color. Send emails to head hunter weekly that the position is updated (reminder)»
- «Extra service: Can propagate talent for other head hunters. Default: Will share for all the users (headhunters) from the talent area of expertise (cat)»
- Иврит, Freemium: «מותנה בהרשמה מלאה 1. מענה לשת"פים - לא ניתן 2. פרסום שת"פים ללא הגבלה 3. מכרזים - צופה בלבד ללא גישה לפרטי מפרסם – מקבל חלון קופץ לשדרוג מנוי או לרכישה חד פעמית של פרטי המכרז) 4. שירותי קידום - בתשלום מלא 5. שירותי הפצה – בתשלום מלא 6. נכנס לפול הפצות (יקבל הפצות של אחרים לפי הגדרה בפרופיל) 7. לא מקבל סוכן חכם של המערכת… 8. אפשרות לדירוג ולהיות מדורג»
- Иврит, подписка: «מנוי הד האנטרים - מותנה בהרשמה + כ. אשראי מענה לשת"פים ללא הגבלה פרסום שת"פים ללא הגבלה מכרזים – חינם שירותי קידום –2 חינם בחודש שירותי הפצה– 5 חינם בחודש נכנס לפול הפצות… סוכן חכם של המערכת… אפשרות לדירוג ולהיות מדורג»

**Talent:**
- «Freemium: -Can see all the positions but cannot see all details. -Can send one time candicacy for specific time one time by month. -If want to use discret job position, will pay extra amount -NDA»
- «Premium: -Can see all the poisitons -Can send candidacy without limitation. -If want to use the discret need to pay X amount.»
- «Send Candidacy for job positions from other head hunters, companies» · «Extra service: Can propagate his profile for other head hunters. Will share for all the users (headhunters / companies) that fits with his area of expertise» · «Extra service: Promote his profile in the talent's page to appear in the top.»
- Иврит, Pro: «מנוי טאלנט Pro הפופולרית ביותר שלושה חודשים מתחדש מותנה בהרשמה + כ. אשראי צופה בכל המשרות כולל פרטי מפרסם… סוכן חכם… יכול לקבל שירותי דיסקרטיות, לפי משרה, בעלות של – 85 ₪ יכול לרכוש NDA לאותה משרה (חד פעמית) בתוספת עלות של – 15 ₪ עלות: 185 ₪ שת"פים (משרות) – פתוח : יוכל להגיש בקשה לפרטים לכל שת"פ סוכן חכם – גישה מלאה התאמות AI – פתוח… רכישת תוספות: קידומים + הפצות - פתוח»
- Иврит, Freemium: «מנוי טאלנט Talent Freemium מנוי חינם אין צורך בכרטיס אשראי יכול לפתוח פרופיל צופה בכל המשרות ללא יכולת לחשוף פרטי מפרסם… יכול לשלם על הגשת מועמדות חד פעמית – 150 ש"ח יכול לקבל שירותי דיסקרטיות לאותה משרה (חד פעמית) בתוספת עלות של – 200 ₪ יכול לרכוש NDA לאותה משרה (חד פעמית) בתוספת עלות של – 35 ₪ עלות: חינם שת"פים + משרות - צופה בלבד לא יוכל להגיש – פופ אפ: תשלום חד פעמי על דיסקרטיות או מנוי 2. התאמות AI – סגור 3. רכישת תוספות: קידומים + הפצות - סגור»

**Company:**
- «No plans, only payment by post:» · «No monthly plans» · «Choose if want to publish מכרז or משרה» · «Publish job position: Will appear for talent, head hunters» · «Publish Bid: Headhunters and HR users»
- «Can chat with talent, head hunters» · «Have access to headhunter bank of users» · «Can see details of other job positions or bids but dont have any action»
- «Can propagate position / bid by push for other users: Default: Will share for all the users (talents, headhunters if is position / headhunters HR users if is bid) from the position area of expertise (cat)»
- «Choose a category price for it:» → «Normal post» / «Promoted post» / «Premium Post». Три описания, по порядку:
  - (Normal) «The first time that is published will share notification for all relevant based in the category. The Post will be updated to the top once in a week. Two options: Two weeks… Four weeks: Specific price and after the period will send to the post creator message in email and notification if want to renew. If no, the post will be inactive and will not be displayed for others.»
  - (Promoted) то же, но «updated to the top daily».
  - (Premium) «…share notification for all relevant and after 7 days will share new notification based in the category. The Post will be updated to the top daily…» + те же 2/4 недели и продление.
- «Promotion: -Extra service that company can show a job position or bid in the top of the list and the searching. Two options: Two weeks… Four weeks…»

**HR Users:** «Send candidacy for bids» · «Pay per post:» · «Add new user role, when user sign up, choose a option. HR Providers» · «Option to apply anonymous» · «He can only see the "bids" tab» · «Goes for onboarding with data: (SAME AS HEADHUNTER USER) - First name Last Name username Phone extra phone Step 2: Profile pic Description about user Company name ID number are of expertise website linkedin facebook instragram Step 3: תעודת עוסק מורשה/חברה בע"מ (נדרש) רישיון עסק (נדרש) רישיון ניהול לשכה (אופציונלי) Step 4: 3 checkbox and signature» · «Need to receive permission from admin» · «HR will have profile only with their data like head hunter in top (no need for other data.»

**Admin:** «Manage all users: See all details, accept, remove users» · «Option to change the list of area of expertise» · «Change price» · «Option to give the extra questions for users/ give extra weeks of promotion, extra הפצה»

**Публикация и продвижение:** отдельного фрейма нет. Всё, что есть, перечислено выше: Company — категории Normal/Promoted/Premium, 2/4 недели, продление, push-распространение; HeadHunters — Promotion 2/4 недели, Unique position, propagate talent; Talent — propagate и promote profile.

---

## Задача 3. Расхождения Miro ↔ PRD ↔ сайт (Candidacy Flow и Work Representation)

Обозначения в колонке «Сайт» — ссылки на отчёты этого прогона: C3 = компания/HR, C2 = хедхантер, C4 = талант, C5 = админка, N3 = негатив компании. Скриншоты лежат в `.qa/screenshots/run-1020/<КОД>/`.
Вывод: «совпадает» / «вопрос к PM» / «баг». Если расхождение не покрыто решением из `.qa/context.md`, это «вопрос к PM», а не баг. «Баг» ставлю только там, где сайт не выполняет AC PRD и это уже подтверждено отчётом.

### 3.1 Candidacy Flow
| # | Узел Miro (дословно) | PRD § | Сайт (по отчётам) | Вывод |
|---|---|---|---|---|
| 1 | «Button send candidacy» — отправитель **талант** (Talent pay / Talent Want NDA) | §37 (хедхантер), §61 AC04 (талант Premium: полный/анонимный), §52 AC04 | Подача хедхантером работает (C2 §37 ✅, `37-anon-submitted-desktop-plus.png`). Отклик таланта ⛔: у обоих FREE-талантов исчерпан лимит (C4 «Главное», `52-AC03-job-details-talent-desktop.png`) | **Вопрос к PM:** по Miro поток описан для таланта, по PRD — для хедхантера. Применяются ли ветки Miro (оплата, NDA таланта) к подаче хедхантером? |
| 2 | «Send profile anonymous» / «Send full profile» — выбор в начале | §37 AC02, §38, §39 | ✅ Выбор обязателен: «האם להגיש פרופיל מלא או אנונימי?» (C2 §37 AC02, C3 §37 `37-submit-a1-step1-desktop.png`) | **Совпадает** |
| 3 | «Talent pay for this» — анонимная подача платная для таланта | §62 AC01 (дискретность Pro 85₪ / Freemium 150₪), §60 AC03 | Таланту ⛔ (лимит, окно не открыть, C4 §62). Для хедхантера анонимная подача бесплатна (C2, C3). В админке «דיסקרטיות Pro 85 / Free 150» (C5 §78 AC04) | **Вопрос к PM:** цена Freemium в Miro 200₪, в §62 и в админке 150₪ (известно: C4 вопрос 1). Цены — из админки (решение #96db6c), сам факт оплаты таланта нужно проверить (E1C/E1B) |
| 4 | «Will create the 3 questions, and the AI Resume to send, questions from the business» | §39 AC01/AC03, §43 AC01, §41 AC01 | ✅ AI-резюме без PII, «שאלות סינון» владельца вакансии, на них отвечает отправитель (C2 §39, C3 §36/§39 `42-a2-anon-company-view-desktop.png`). PII нет ни в DOM, ни в RSC (C3 §36 AC04). Число вопросов на доске «3», на сайте их задаёт владелец; в C2 видели вакансию с 3 вопросами | **Совпадает** (лимит «3» не проверялся — пройти E1A) |
| 5 | «Talent Want NDA?» → «Company sign the NDA and tell the reason» | §45 AC01/AC07 (NDA в обе стороны), §41 AC01 («אינדיקציה האם נדרש NDA»), §62 AC02 | Отправитель при подаче выбирает «לחייב NDA(₪35)» / «אין צורך ב-NDA(ללא עלות)» (C2 §39 AC07, C3 §37). Путь с NDA ⛔: платно, оплата запрещена, Cardcom `unavailable` (C2 №1) | **Вопрос к PM:** ₪35 — это цена NDA Freemium-таланта (§62). Почему её платит хедхантер? И что значит «tell the reason»: причина подписи или причина отказа? Сайт по этому шагу неизвестен (⛔) |
| 6 | «Company sign the NDA… → No → Message to talent… options: Send candidacy full profile / Send candidacy without NDA / Work representation» | §45 AC06 / §46 AC04 («עוצר את התהליך או מחזיר לאפשרות אנונימית בלבד» — когда отказывается **подписывающий**) | ⛔ не проверено. У компании в анонимной карточке нет действий по NDA (C3 №5, `verify-V5-anon-card-actions-desktop.png`) | **Вопрос к PM:** в Miro компания может отказаться подписывать NDA таланта, и тогда у таланта 3 варианта. В PRD при отказе — только «стоп/анонимно». Какой вариант правильный? |
| 7 | «(customer will send list)» — список причин | — (в PRD нет) | В админке есть списки «Report reasons» (§77), отдельного списка «причин отказа/NDA» в отчётах C5 нет | **Вопрос к PM:** заказчик присылал список причин? Где он должен быть на сайте? |
| 8 | «Position Owner receive the AI Resume from user without private data + Questions» | §39 AC01–02, §36 AC03–04, §07 | ✅ Компания видит анонимную карточку без PII. Нет уровня опыта и общих ролей, заметки хедхантера не доходят (C3 §36 AC03 ⚠️, №4) | **Совпадает** по сути. Мелкие пробелы — баг по §36 AC03 (C3 №4, известно) |
| 9 | «Company approves the AI Resume» (да/нет) | §41 AC02 / §42 AC01 («מתאים / לא מתאים») | ❌ Кнопки «מתאים» нет. Есть «בקשת פרופיל מלא / דחייה / ביטול / שאלות נוספות / שליחת הודעה» (C3 №5, перепроверено 2/2) | **Баг по PRD** (C3 №5, уже в отчёте, перепроверен). В Miro «approves» = просьба полного профиля, то есть на сайте фактически так и сделано. Ставлю **вопрос к PM**: достаточно ли модели Miro (approve = запрос профиля), можно ли закрыть §42 AC01? |
| 10 | «No → Message to user reproved (from list from customer)» | §73 AC02 (уведомление об отклонении); причины в PRD нет | «דחייה» в один клик, без причины и подтверждения. Хедхантер получает «…עודכן ל„נדחה”» (C3 №14, §73 ✅, `42-a2-reject-step1-desktop.png`) | **Вопрос к PM:** в Miro у отказа есть причина из списка заказчика, на сайте причины нет (C3 вопрос 9) |
| 11 | «User can send the full profile anyway» (после отказа) | — (в PRD нет) | Неизвестно: после «נדחה» у отправителя есть ли «שליחת פרופיל מלא» — в отчётах не видно | **Вопрос к PM** + шаг для E1A (проверить карточку отклонённой подачи у отправителя) |
| 12 | «Yes → Send to user message to send full profile.» | §39 AC05, §40 AC01, §73 AC03 | ✅ «בקשת פרופיל מלא» → «הבקשה נשלחה…». Хедхантеру приходит «סופר פארם ביקשו את הפרופיל המלא של…» (C3 §40, §73; C2 §74 `74-bell-open-desktop-plus.png`) | **Совпадает** |
| 13 | «User accept to sent full profile with all data» → No → «END of scenario» | §40 AC02, AC05 (Full Profile Approved/Rejected), §39 AC06 | ✅ «שליחת פרופיל מלא / דחיית הבקשה»; статус «פרופיל מלא אושר» (C3 §40, `40-hunter-approve-desktop.png`). Ветка «דחיית הבקשה» не нажималась | **Совпадает** (отказ — проверить E1A) |
| 14 | «User accept… → Yes» — продолжения нет | §40 AC04 (раскрытие), §38 AC03 | ⚠️ После раскрытия компания видит имя, «מיוצג ע״י…», телефон, email. CV и опыт не видны, ответов и зарплаты нет (C3 §40 AC04, №4) | Miro неполная: следующего шага на доске нет. По PRD — **баг** C3 №4 (известно в отчёте) |
| 15 | «Company has NDA? → Yes → User sign company NDA» (полный профиль) | §45 AC07 (NDA со стороны публикатора), §46 | В вакансии можно задать «האם נדרשת חתימה על NDA לפני הגשת מועמד?», у тендера — «לחייב NDA (₪100 למכרז)» (C3 §45 AC01). Подпись отправителем ⛔ не проверялась | **Совпадает** по наличию. Сам шаг подписи неизвестен — E1A/E1B |
| 16 | «Talent Want NDA? → Yes → The talent pays» (полный профиль) | §62 AC02 | ⛔ (лимит таланта, платно) | Совпадает с PRD по смыслу. Сайт неизвестен |
| 17 | «…doesn't want to sign NDA… → Send profile anonymous / Send candidacy without NDA» (полный профиль) | §45 AC06 | ⛔ | **Вопрос к PM** (как в п. 6) |
| 18 | «Position Owner receive all the user data» → «Company proceed with the process» | §38 AC01–05 | ❌ По подаче с полным профилем компания видит только профиль, без AI-резюме, ответов, зарплаты и заметок (C3 №4, 2/2, `verify-V4-full-profile-company-view-desktop.png`). Найм/отказ работают: «התקבל/ה לעבודה» (C3 §42) | **Баг по PRD §38 AC01** (C3 №4, известно в отчёте). «Proceed» — совпадает |
| 19 | Нет в Miro: «שאלות נוספות» компании к отправителю во время рассмотрения | §42 AC02, §43 AC02–03 | Кнопка «שאלות נוספות» есть, весь сценарий ⛔ не проходился (C3 §42 AC02). N3 №6–7 — только длина ввода | В Miro «Extras questions» идут через Work representation. **Вопрос к PM:** это одно и то же или две разные функции? |
| 20 | Нет в Miro: popup «ממתינים», статусы, уведомления | §44, §06, §73/§74 | ⚠️ «ממתינים» частично (C3 №16). Статусы נשלח → נצפה → התבקש פרופיל מלא → פרופיל מלא אושר → נדחה/התקבל/ה לעבודה/סגור (C3 §06). Уведомления частично: нет «נצפה» (известно), одно уведомление на несколько подач — C3 №3, в N3 не воспроизвелось | Сверять только с PRD; в Miro этого нет |
| 21 | Нет в Miro: подача хедхантера на тендер «Flow above (option to send anonymous or full profile)» (узел HeadHunters) | §33 AC02 (хедхантер/HR подают на тендер) | На тендер подаётся **предложение с ценой** («הגשת הצעה», «ההצעה שלי (לפרויקט) ₪»), а не кандидат анонимно/открыто (C3 §33 AC02, N3 №2, C2 §64 лимит 2 предложения) | **Вопрос к PM:** по Miro на тендер подаётся кандидатура (анонимно/полностью), на сайте — денежное предложение. HR «Option to apply anonymous» — есть ли анонимное предложение? |

### 3.2 Work Representation Flow
| # | Узел Miro (дословно) | PRD § | Сайт (по отчётам) | Вывод |
|---|---|---|---|---|
| W1 | «Only related for anonymous requests: Only one time after» | §47 AC01–02 | Входа в WR в отчётах нет. Хедхантер (владелец) не видит входящих WR-вопросов в «ממתינים» (C2 §47 ⛔, `43-pending-answers-tab-desktop-plus.png`). Таланту ⛔ — нет свежей анонимной подачи (лимит, C4). В админке цена `representation_work` «טרם תומחר», выключена (C5 §78 AC04) | Совпадает Miro ↔ PRD. **Сайт неизвестен, вероятно не реализовано**: проверить E1C (талант с анонимной подачей). Если входа нет — баг по §47 (сначала уточнить, есть ли решение) |
| W2 | «The user requests work representation:» — где кнопка | §47 (экрана нет) | Не найдено. На сайте есть другая функция — «בקשת ייצוג» (талант просит хедхантера его представлять; FREE: «בקשת ייצוג זמינה למנויי PRO», C4 №7, `53-represent-free-desktop.png`; в админке тип «בקשת הד האנטר (בתשלום)», C5 §83 AC01) | **Вопрос к PM:** «בקשת ייצוג» (найм хедхантера) и Work Representation §47 (вопросы владельцу вакансии) — разные функции? На сайте видна только первая. Риск путаницы названий |
| W3 | «Open popup with free text to ask questions to the position owner (amount of 3 questions)» | §47 AC03–04 («עד כ-3») | ⛔ не найдено | Совпадает Miro ↔ PRD. Сайт неизвестен |
| W4 | «The company receive the questions and answer them (eveyrthing private)» | §47 AC05 (компания **или хедхантер**) | ⛔ | Совпадает (PRD шире: владельцем может быть и хедхантер) |
| W5 | «Candidate receive the questions ans see them» | §47 AC06 | ⛔ | Совпадает |
| W6 | «Go for apply» | §47 AC07 | ⛔ | Совпадает. **Вопрос к PM:** по Miro WR открывается «after» (после подачи), а потом снова «Go for apply». Что значит «apply», если подача уже отправлена: продолжить или раскрыть профиль? |
| W7 | «Im not feeling safe to identify, ask for help» → «Goes for admin portal and they will talk with the candidate» | §47 AC08, §83 AC03/AC05, D-34 (открыто) | В админке есть тип жалобы «בקשת עזרה» (0 штук), отдельного потока нет (C5 §83 AC03/AC05 ⚠️). Вход у кандидата неизвестен | Совпадает Miro ↔ PRD. «Admin portal» не определён (D-34) → **вопрос к PM** (уже открыт) |
| W8 | «Something wrong happend» → «Open Feedback for admin» | §47 AC09, §83 AC02 | В админке есть тип «משוב» (0), отдельного «משהו לא תקין» нет (C5 §83 AC02 ⚠️). Вход у кандидата неизвестен | Совпадает Miro ↔ PRD; на сайте частично (только в админке) |
| W9 | Вход в WR из Candidacy Flow: «…doesn't want to sign NDA… → Work representation (anonymous questions) Extras questions.» | §47 (такого триггера нет; там «после отправки анонимной кандидатуры») | ⛔ | **Вопрос к PM:** WR доступен после любой анонимной подачи (PRD) или только когда компания отказалась от NDA (Miro)? |
| W10 | «Admin: Option to give questions our give discount» + Admin «Option to give the extra questions for users» | §79 (ручная выдача функций), §78 AC04 | В админке «פיצ׳רים שנפתחו», 11 опций, ✅ 6 AC (C5 §79). Есть ли среди них «дополнительные вопросы WR» — в отчёте не указано | **Проверить E1 (админ, только чтение):** есть ли пункт «extra questions». Если нет — вопрос к PM |
| W11 | Оплата WR (в Miro во фрейме не указана) | §78 AC04 «Work Representation» — цена в админке | `representation_work` «טרם תומחר», выключено (C5 §78 AC04, вопрос C5 №4) | **Вопрос к PM** (уже есть в C5): платная ли WR и до сдачи ли |

### 3.3 Роли и тарифы — короткая сверка (подробно уже в C1 «часть D», C4 «Miro», C2)
| Узел Miro | PRD | Сайт | Вывод |
|---|---|---|---|
| HH Freemium «Cannot upload talent / Cannot apply candidate / Cannot see the bids / Dont have chat»; иврит «מענה לשת"פים - לא ניתן» | §63 AC06 [שאלת אפיון] «возможные» ограничения | FREE добавляет кандидатов и подаёт их с лимитом «4 в месяц» (C2 FREE §23, §37 ✅; N2 №2). Тендеры и чат закрыты апселлом ✅ | **Вопрос к PM:** по Miro FREE не подаёт кандидатов совсем, на сайте подаёт с лимитом. Возможно, покрыто решением #96db6c («лимиты по PRD») — уточнить |
| HH подписка: «מכרזים – חינם, קידום 2 חינם בחודש, הפצה 5 חינם בחודש» | §64 | PLUS: «2 הצעות למכרזים בחודש», «קידום משרה אחד בחודש ללא עלות», счётчика нет (C2 §64, вопрос 4) | **Вопрос к PM** (цифры лимитов). Цены — из админки (решение) |
| HH «Unique position» бирюзовый + еженедельное письмо | §55 (נגזר מה-Miro) | «תג ייחודי — עדיין לא זמין לרכישה» (C2 №4) | Баг/недоделка по §55 (C2 №4, уже в отчёте) |
| Talent Pro «שלושה חודשים מתחדש… 185 ₪» | §61 | PRO ₪480/חודש, помесячно (C4 §61) | Цена — из админки (решение). Период 3 мес. против месяца — **вопрос к PM** (C4 вопрос 2) |
| Talent «Promote his profile…» / «propagate his profile» | §56 / §58 | Продвижения нет (C4 №1 ❌), распространение — только строка в тарифе (C4 §58 ⚠️) | Баг по §56 (C4 №1, уже в отчёте) |
| Company «Normal / Promoted / Premium», 2/4 недели, продление | §65 AC02, §66 | Три уровня «(חינם) בתקופת ההשקה», 4 недели «בקרוב» у апгрейда, у тендера только 2 недели (C3 §65/§66) | Известно («טקסטי המחירים והתוכניות סותרים…»); цены по решению |
| Company «Can propagate position / bid by push» | §59 (тендер), §54 (вакансия) | Распространения тендера нет (C3 №2 ❌), вакансия — «לכל הד האנטרים» за ₪700 (C2 №5) | Баг по §59 (C3 №2, уже в отчёте) |
| HR «Pay per post», «Option to apply anonymous», «only bids tab» | §67 | «משלמים רק על הצעות שנשלחות למכרזים – בתקופת ההשקה ללא עלות»; виден только раздел тендеров ✅ (C3 §67) | Совпадает. Анонимная подача HR неизвестна (п. 21) |
| Admin: users / areas / price / extra features | §75–§79 | ✅ (C5) | Совпадает |

### Итог по задаче 3
- **Совпадает:**
  - выбор «анонимно/полный профиль»;
  - AI-резюме + вопросы бизнеса без PII;
  - запрос полного профиля → согласие отправителя → раскрытие (кроме деталей);
  - NDA со стороны публикатора есть в формах;
  - шаги WR в Miro и PRD §47 совпадают 1:1;
  - роли HR/Admin.
- **Баги по PRD, уже записанные в отчётах этого прогона** (новыми не заводить):
  - C3 №4 — §38: при полном профиле не видны ответы, зарплата, резюме;
  - C3 №5 — §42: нет «מתאים» и «בקשת NDA»;
  - C3 №2 — §59;
  - C4 №1 — §56;
  - C2 №4 — §55.
- **Вопросы к PM (новые из Miro):**
  - (1) кто отправитель в Candidacy Flow — талант или хедхантер, и кто платит NDA ₪35;
  - (2) компания может отказаться подписать NDA таланта — варианты продолжения по Miro или «стоп/анонимно» по PRD;
  - (3) списки причин «customer will send list» для отказа и NDA;
  - (4) «User can send the full profile anyway» после отказа;
  - (5) «Company approves the AI Resume» = «בקשת פרופיל מלא» — достаточно ли этого вместо «מתאים»;
  - (6) на тендер — кандидат (Miro) или денежное предложение (сайт);
  - (7) WR: когда открывается (после любой анонимной подачи или после отказа от NDA), это то же, что «Extras questions» и «שאלות נוספות»? Где вход? Не путается ли с «בקשת ייצוג»?
  - (8) лимиты FREE-хедхантера (Miro: не подаёт кандидатов совсем).
- **Неизвестно на сайте** (пройти E1A/E1B/E1C):
  - вход в WR и весь поток §47;
  - путь с NDA (подпись, отказ);
  - отказ отправителя в раскрытии;
  - что видит отправитель после «נדחה»;
  - «שאלות נוספות» от начала до конца;
  - анонимное предложение HR на тендер;
  - есть ли в админке выдача «extra questions» (§79).

Тестовые данные: нет (на сайте ничего не делал, в Miro ничего не менял). Сессия `e1d-miro` закрыта, сессия `e1d-guest` не открывалась (не понадобилась).
