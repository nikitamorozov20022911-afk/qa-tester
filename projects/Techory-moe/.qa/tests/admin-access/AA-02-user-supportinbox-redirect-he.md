# AA-02: Обычный пользователь на /supportinbox сразу попадает на /dashboard (HE)
- Фича/экран: Support Console (/supportinbox) — доступ
- Тикеты: #09773471
- Роль/аккаунт: user «בדיקה», .qa/auth/user.json
- Устройство: desktop 1440×900
- Тип: негатив (доступ)
- Предусловия: язык HE (`localStorage['preferred-language']='he'`)
## Шаги
1. Открыть /dashboard, посмотреть боковое меню.
2. Открыть /supportinbox напрямую.
## Ожидаемо
- Шаг 1: в меню нет пункта Support Console (EN «Support Console» и его ивритской подписи).
- Шаг 2: URL → /dashboard; нет «אין גישה» и «רק צוות התמיכה יכול לגשת לממשק התמיכה.».
- Крошки на пути редиректа (#26087e6e, исправлен 14.10) — проверяются в AA-10.
(источник: «מה רצוי» #09773471; решение владельца 07.10)
## История
- 2026-10-08 · ✅ · #09773471 (.qa/screenshots/09773471/2-he-redirect-desktop.png, 5-user-menu-he-desktop.png)
