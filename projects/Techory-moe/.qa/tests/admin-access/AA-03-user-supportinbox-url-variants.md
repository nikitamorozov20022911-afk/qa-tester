# AA-03: Варианты адреса /supportinbox у обычного пользователя тоже ведут на /dashboard
- Фича/экран: Support Console (/supportinbox) — доступ
- Тикеты: #09773471
- Роль/аккаунт: user «בדיקה», .qa/auth/user.json
- Устройство: desktop 1440×900
- Тип: граница (варианты URL)
- Предусловия: язык EN
## Шаги
1. Открыть /supportinbox/ (со слэшем).
2. Открыть /supportinbox?x=1.
3. Открыть /SupportInbox (другой регистр).
## Ожидаемо
- Каждый шаг: URL → /dashboard; нет «Access Denied»; нет вкладок Bug Report / Support Task / Chat.
(источник: «מה רצוי» #09773471 — сразу на /dashboard; варианты адреса — чек-лист QA 08.10)
## История
- 2026-10-08 · ✅ · #09773471 (.qa/screenshots/09773471/3-variant-*.png)
