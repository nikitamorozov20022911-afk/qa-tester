# AP-12: Строка «בדיקה» в Plans совпадает с тем, что действует у пользователя (только чтение)
- Фича/экран: Admin → Plans (строка wojeg27104) + у пользователя меню и /billingsubscription
- Тикеты: #2b3784, #b42657
- Роль/аккаунт: admin + user «בדיקה» (два окна), ничего не сохраняется
- Устройство: desktop 1440×900
- Тип: позитив (@prod-safe)
- Предусловия: нет
## Шаги
1. Окно admin: Plans → поиск wojeg27104@blobapps.com — прочитать Plan, Source, Until.
2. Окно user: /dashboard — меню.
3. Окно user: Billing & Subscription.
## Ожидаемо
- Plan — один из Techory Lite / Starter Tech / Pro Tech / Growth Company / Scale Enterprise.
- Source «Assigned» → Until не в прошлом, кнопки «Change / extend» и «Revoke»; Billing — бейдж «Granted by Techory until <та же дата>».
- Не Assigned → кнопка «Assign plan», «Revoke» нет; Billing без «Granted by Techory» (20.10: Techory Lite · Free · Trial ended · Until —).
- Меню: «AI» только для Pro Tech и выше; «Inventory» — для Starter Tech и выше.
- Billing показывает тот же тариф, что колонка Plan.
(источник: «תיאור» #2b3784 — одна функция resolve_active_plan для всех проверок доступа; после срока аккаунт сам на своём плане; F-16 — AI с Pro; наблюдение 19.10 — Starter: Inventory без AI)
## История
- 2026-10-20 · ✅ · #2b3784 / #b42657 (скрины r3c-1…5)
