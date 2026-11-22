# AP-11: Выдача Pro Tech → смена на Starter Tech → Revoke: пользователь видит без перезагрузки, журнал До/После, карта не добавляется (запись на проде)
- Фича/экран: Admin → Plans («Assign plan», «Change / extend», «Revoke»), Admin → Audit log; у пользователя меню, /billingsubscription
- Тикеты: #2b3784 (6eed7c73f86190f44e2b3784), #b42657 (226301e0b345e86872b42657, дубль)
- Роль/аккаунт: admin (iamdejar@gmail.com) + user «בדיקה» (wojeg27104@blobapps.com), два окна
- Устройство: desktop 1440×900
- Тип: позитив (пишет данные — @writes @data, Revoke обязателен в конце)
- Предусловия: у «בדיקה» нет выдачи (Plans: «Assign plan»); пользователь на своём тарифе (20.10 — Techory Lite, без AI и Inventory)
## Шаги
1. Окно user: Billing — запомнить блок «Payment method»; /dashboard — в меню нет «AI».
2. Окно admin: Plans → «Assign plan» у «בדיקה»: Plan = Pro Tech, Until (inclusive) = сегодня + 7, Reason «QA-AUTO #2b3784 grant …» → Save.
3. Окно user (без перезагрузки): ждать до 90 с; открыть Billing.
4. Окно admin: «Change / extend» → Plan = Starter Tech, Reason «QA-AUTO #2b3784 change …» → Save.
5. Окно user (без перезагрузки): ждать до 90 с; Billing.
6. Окно admin: «Revoke» — пустая причина, затем Reason «QA-AUTO #2b3784 revoke …» → Revoke.
7. Окно user (без перезагрузки): ждать до 90 с; Billing.
8. Окно admin: Audit log — записи по wojeg27104, раскрыть каждую.
## Ожидаемо
- 2: строка — Plan «Pro Tech», Source «Assigned» + причина, Until = выбранная дата, кнопки «Change / extend» и «Revoke».
- 3: в меню появились «AI» и «Inventory» (≤60 с; 19.10 — 44 с); Billing — «Pro Tech», бейдж «Granted by Techory until <дата>».
- 5: «AI» пропал, «Inventory» остался (41 с); Billing — «Starter Tech», бейдж тот же.
- 6: без причины «Revoke» неактивна; после — строка «Assign plan», без «Assigned», Plan = исходный (Techory Lite).
- 7: «AI» и «Inventory» пропали (47 с); Billing — исходный тариф, бейджа «Granted by Techory» нет; блок «Payment method» как в шаге 1; переходов в Stripe нет.
- 8: «Plan granted» (pro_tech + дата), «Plan changed» (pro_tech → starter_tech), «Plan revoked» — Who = iamdejar@gmail.com, Account = wojeg27104@blobapps.com; в деталях Field / Before / After и причина.
(источник: «תיאור» #2b3784 — ручная выдача перекрывает Stripe до даты окончания; комментарий программиста 29.09 — изменение видно меньше чем за минуту без обновления, каждое изменение пишется с исполнителем, прежним и новым значением; S-15 AC 4, AC 6)
## История
- 2026-10-19 · ✅ · #2b3784 / #b42657 (скрины r3-2…r3-7; карта не добавлена, Stripe не открывался)
