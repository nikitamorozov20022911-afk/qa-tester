# AA-09: Admin видит Admin Panel как раньше — вкладки, шапка, меню
- Фича/экран: Admin Panel (/adminpanel)
- Тикеты: #12126fac
- Роль/аккаунт: admin «Kirill · Admin» (iamdejar@gmail.com), .qa/auth/admin.json
- Устройство: desktop 1440×900
- Тип: позитив (регресс)
- Предусловия: язык EN
## Шаги
1. Открыть /dashboard.
2. В меню нажать «Admin Panel».
3. Поочерёдно нажать вкладки «Users», «Plans», «Funnel».
## Ожидаемо
- Шаг 1: в шапке «Kirill» и «Admin»; в меню есть «Admin Panel» и «Support Console».
- Шаг 2: URL /adminpanel (без редиректа); нет «Access Denied»; видны вкладки «Users», «Plans», «Funnel».
- Шаг 3: каждая вкладка открывается (для «Plans» — заголовок «Plans»); URL остаётся /adminpanel.
(источник: реджект #12126fac и решение владельца — изменение только для обычного пользователя, admin как раньше)
## История
- 2026-10-08 · ✅ · #12126fac (.qa/screenshots/12126fac/2026-10-08/6-admin-*.png, 7-admin-header-menu-desktop.png)
