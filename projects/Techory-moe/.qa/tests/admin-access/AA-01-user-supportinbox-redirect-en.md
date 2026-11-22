# AA-01: Обычный пользователь на /supportinbox сразу попадает на /dashboard (EN)
- Фича/экран: Support Console (/supportinbox) — доступ
- Тикеты: #09773471
- Роль/аккаунт: user «בדיקה» (wojeg27104@blobapps.com), .qa/auth/user.json
- Устройство: desktop 1440×900
- Тип: негатив (доступ)
- Предусловия: язык EN (`localStorage['preferred-language']='en'`)
## Шаги
1. Открыть /dashboard, посмотреть боковое меню.
2. Открыть https://app.techory.ai/supportinbox напрямую.
## Ожидаемо
- Шаг 1: в меню нет «Support Console» (и нет «Admin Panel»).
- Шаг 2: URL → /dashboard; нет «Access Denied» и «Only support staff can access the support console.»; нет вкладок Bug Report / Support Task / Chat и блока HISTORY.
- Крошки на пути редиректа (#26087e6e, исправлен 14.10) — проверяются в AA-10.
(источник: «מה רצוי» #09773471 — как в решении по /adminpanel: сразу на /dashboard, без экрана «нет доступа» и без упоминания Support Console; решение владельца 07.10 в .qa/context.md)
## История
- 2026-10-08 · ✅ · #09773471 (.qa/screenshots/09773471/1-en-redirect-desktop.png, 5-user-menu-en-desktop.png, run-user.json)
