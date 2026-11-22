<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# AUTH-RT-004: /login под вошедшим пользователем → дашборд роли
- Фича/экран: вход (F-05, S-03)
- Тикеты: #01649c9c8c436e2d1a46f007
- Роль/аккаунт: business, user, admin (сохранённые сессии)
- Устройство: desktop 1440×900
- Тип: регрессия
- Предусловия: нет
## Шаги
1. Под ролью открыть /login.
## Ожидаемо
- business → «/» h1 «שלום, …»; user → «/» h1 «שלום, …»; admin → /admin/businesses h1 «בתי העסק» (AC F-05 — «מועבר לדשבורד המתאים להרשאתו»).
## История
- 2026-10-05 · ✅ · #01649c9c
- 2026-10-05 · עבר QA · автотест tests/auth-routing/login-return.spec.ts
