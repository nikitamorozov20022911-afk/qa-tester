# CP-07: Фильтр по состоянию
- Фича/экран: Admin Panel → Coupons → «All states»
- Тикеты: #b93722
- Роль/аккаунт: admin
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: QA-купоны Disabled; активных купонов может не быть.
## Шаги
1. Фильтр → Disabled.
2. Фильтр → Active.
3. Фильтр → All states.
## Ожидаемо
1. Только строки Disabled (есть QA-PCT10-1410).
2. Только Active, или «No coupons match these filters.» (QA-PCT10-1410 скрыт).
3. Все купоны.
(источник: комментарий программиста п.6 — фильтр по статусу)
## История
- 2026-10-19 · ✅ · #b93722 (r1-s7-filter-active-desktop.png, r1-s7-filter-disabled-desktop.png)
