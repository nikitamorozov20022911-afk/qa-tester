# AP-13: Пользователь без выдачи — Techory Lite: нет AI и Inventory, /aiworkspace закрыт, нет «Granted by Techory» (только чтение)
- Фича/экран: меню, /aiworkspace, /billingsubscription
- Тикеты: #2b3784, #b42657
- Роль/аккаунт: user «בדיקה» (wojeg27104@blobapps.com, auth/user.json)
- Устройство: desktop 1440×900
- Тип: позитив (@prod-safe)
- Предусловия: у «בדיקה» нет действующей выдачи (выдача Pro Tech b2475f37 истекла 2026-10-19 23:59 по Израилю)
## Шаги
1. /dashboard — меню.
2. Открыть /aiworkspace напрямую.
3. Billing & Subscription.
## Ожидаемо
- 1: в меню нет «AI» и «Inventory».
- 2: «AI tools are not part of your plan», «Current plan: Techory Lite».
- 3: тариф «Techory Lite», бейджа «Granted by Techory until …» нет.
(источник: «תיאור» #2b3784 — после даты окончания аккаунт сам возвращается на свой план; комментарий программиста 30.09 — назначение «до сегодня» действует до 23:59, потом возврат без действий)
## История
- 2026-10-20 · ✅ · #2b3784 / #b42657 (скрины r3c-1-user-menu, r3c-2-user-billing, r3c-3-user-ai-blocked)
