<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# AUTH-RT-006: страница 404 — один h1, RTL, путь на главную; гость → /login
- Фича/экран: 404 (несуществующий маршрут)
- Тикеты: #01649c9c8c436e2d1a46f007
- Роль/аккаунт: admin, business, user (сохранённые сессии); guest
- Устройство: desktop 1440×900
- Тип: позитив / доступность
- Предусловия: нет
## Шаги
1. Под ролью открыть /no-such-page.
2. Гостем открыть /no-such-page.
## Ожидаемо
- Ровно один h1 «המסך לא נמצא», direction rtl, ссылка «חזרה למסך הבית» (admin → /admin/businesses, business/user → /) (источник: «מה רצוי» — «לדף 404 יש כותרת ראשית»).
- Гость → /login (404 гостю не показывается), history.state.usr.from = /no-such-page.
## История
- 2026-10-04 · ✅ · #01649c9c
- 2026-10-05 · ✅ · #01649c9c (admin/user перепроверено)
- 2026-10-05 · עבר QA · автотест — план .qa/e2e/specs/auth-routing.md, 2.x
