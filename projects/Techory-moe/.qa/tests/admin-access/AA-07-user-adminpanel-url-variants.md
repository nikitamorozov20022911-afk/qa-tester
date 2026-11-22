# AA-07: Варианты адреса /adminpanel у обычного пользователя тоже ведут на /dashboard
- Фича/экран: Admin Panel (/adminpanel) — доступ
- Тикеты: #12126fac
- Роль/аккаунт: user «בדיקה», .qa/auth/user.json
- Устройство: desktop 1440×900
- Тип: граница (варианты URL)
- Предусловия: язык EN
## Шаги
1. Открыть /adminpanel/ (со слэшем).
2. Открыть /adminpanel?tab=plans.
3. Открыть /AdminPanel (другой регистр).
4. Открыть /adminpanel#funnel.
## Ожидаемо
- Каждый шаг: URL → /dashboard; нет «Access Denied»; нет вкладок Users / Plans / Funnel; нет кнопок «Assign plan».
(источник: реджект #12126fac 07.10, решение владельца 07.10; варианты адреса — чек-лист QA 08.10)
## История
- 2026-10-08 · ✅ · #12126fac (.qa/screenshots/12126fac/2026-10-08/3a…3f-*.png)
