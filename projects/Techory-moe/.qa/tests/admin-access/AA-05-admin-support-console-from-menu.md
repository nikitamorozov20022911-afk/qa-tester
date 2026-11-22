# AA-05: Admin открывает Support Console из меню как раньше
- Фича/экран: Support Console (/supportinbox)
- Тикеты: #09773471
- Роль/аккаунт: admin «Kirill · Admin» (iamdejar@gmail.com), .qa/auth/admin.json
- Устройство: desktop 1440×900
- Тип: позитив (регресс)
- Предусловия: язык EN
## Шаги
1. Открыть /dashboard.
2. В боковом меню нажать «Support Console».
3. Открыть /supportinbox напрямую.
## Ожидаемо
- Шаг 1: в меню есть «Admin Panel» и «Support Console».
- Шаг 2: URL /supportinbox; видны «Bug Report», «Support Task», «Chat»; нет «Access Denied».
- Шаг 3: остаётся /supportinbox (без редиректа), те же вкладки.
(источник: «מה רצוי» #09773471 — админ и сотрудник поддержки видят интерфейс как раньше)
## История
- 2026-10-08 · ✅ · #09773471 (.qa/screenshots/09773471/6-admin-*.png, run-admin.json)
