# AP-14: Окончание срока выдачи — аккаунт сам возвращается на свой тариф (ТОЛЬКО ВРУЧНУЮ, проверка по времени)
- Фича/экран: Admin → Plans, Audit log; у пользователя меню, /aiworkspace, Billing
- Тикеты: #2b3784, #b42657
- Роль/аккаунт: admin + user «בדיקה»
- Устройство: desktop 1440×900
- Тип: позитив, по времени — не автоматизируется
- Предусловия: «בדיקה» без выдачи
## Шаги
1. Admin: «Assign plan» у «בדיקה»: Pro Tech, Until (inclusive) = сегодня, причина «QA-…».
2. User: в меню появились AI и Inventory, Billing «Granted by Techory until <сегодня>».
3. На следующий день (после 23:59 по Израилю), никаких действий админа: user — меню, /aiworkspace, Billing.
4. Admin: строка «בדיקה» в Plans; Audit log.
## Ожидаемо
- 3: AI и Inventory нет; /aiworkspace — «AI tools are not part of your plan / Current plan: Techory Lite»; Billing — Techory Lite, без «Granted by Techory».
- 4: Plan Techory Lite, Source Free (не Assigned), Until «—», кнопка «Assign plan». Отдельной записи об истечении в журнале нет — норма (срок проверяется при чтении, без задачи по расписанию).
(источник: «תיאור» #2b3784; комментарий программиста 29.09/30.09)
## История
- 2026-10-19/20 · ✅ · #2b3784 / #b42657 (выдача b2475f37 до 2026-10-19T20:59:59Z; скрины r3b-*, r3c-1…5)
