# AL-07: Супер-админ — Admin Panel → Audit log: записи есть, фильтр «Coupons» — только купонные, раскрытие строки — Field / Before / After
- Фича/экран: /adminpanel → вкладка «Audit log»
- Тикеты: #fc4fa4 (регресс реджекта 1)
- Роль/аккаунт: admin «Kirill» (iamdejar@gmail.com), бизнес test, .qa/auth/admin.json
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: язык EN; в журнале есть купонные записи (QA-AUDIT-PCT-1111 и др., 11.11). Только просмотр.
## Шаги
1. /adminpanel → вкладка «Audit log».
2. Фильтр (по умолчанию «Everything») → «Coupons».
3. Кликнуть строку «Coupon changed».
## Ожидаемо
- 1: заголовок «Audit log», колонки When / Who / What / Account / member; есть записи (Who — email исполнителя).
- 2: все строки — купонные («Coupon created / changed / disabled / attached to an account / detached from its account»); нет «Role changed», «Invited», «Joined», «Plan …».
- 3: под строкой — таблица «Field / Before / After».
(источник: AC4 «כל פעולה נרשמת ל-audit log עם מבצע, סוג פעולה, חשבון מושפע וערכי לפני/אחרי»; комментарий программиста №2 — фильтр «Coupons», клик по строке → старое/новое)
## История
- 2026-10-14 · ❌ · #fc4fa4 — нет до/после и фильтра Coupons (реджект 1)
- 2026-11-12 · ✅ · #fc4fa4 (dc0451ee552ed1b25afc4fa4), повторная проверка после реджекта 2 (.qa/screenshots/fc4fa4-2-audit-log-coupons-filter-desktop.png, fc4fa4-2-audit-log-before-after-desktop.png)
