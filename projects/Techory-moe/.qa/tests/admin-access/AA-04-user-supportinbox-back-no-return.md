# AA-04: «Назад» после редиректа с /supportinbox не возвращает на /supportinbox
- Фича/экран: Support Console (/supportinbox) — доступ
- Тикеты: #09773471
- Роль/аккаунт: user «בדיקה», .qa/auth/user.json
- Устройство: desktop 1440×900
- Тип: негатив (навигация)
- Предусловия: язык EN
## Шаги
1. Открыть /dashboard.
2. Открыть /supportinbox напрямую → дождаться /dashboard.
3. Нажать «Назад» в браузере.
## Ожидаемо
- Шаг 2: URL /dashboard.
- Шаг 3: URL не /supportinbox; нет «Access Denied»; нет вкладок Bug Report / Support Task / Chat.
(источник: «מה רצוי» #09773471 — Support Console для пользователя «нет»; чек-лист QA 08.10)
## История
- 2026-10-08 · ✅ · #09773471 (.qa/screenshots/09773471/4-back-desktop.png)
