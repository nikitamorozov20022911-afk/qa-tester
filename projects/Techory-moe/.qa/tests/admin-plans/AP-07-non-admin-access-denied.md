# AP-07: Не-admin не получает экран Plans — прямой заход на /adminpanel перенаправляет на /dashboard
- Фича/экран: /adminpanel
- Тикеты: #ca557707, #2ae9da4d, #ed195248, #12126fac, #fc4fa4
- Роль/аккаунт: user «בדיקה» (wojeg27104@blobapps.com)
- Устройство: desktop 1440×900
- Тип: негатив (доступ)
- Предусловия: сессия .qa/auth/user.json; язык EN
## Шаги
1. Под user открыть /dashboard — посмотреть боковое меню.
2. Открыть https://app.techory.ai/adminpanel напрямую.
## Ожидаемо
- Шаг 1: в боковом меню нет «Admin Panel».
- Шаг 2: URL сразу меняется на /dashboard; экрана «Access Denied» нет; вкладок Users / Plans / Funnel, кнопок «Assign plan» и email других аккаунтов (например, «iamdejar@gmail.com») нет.
- Известный открытый баг #26087e6e: ~0.2–0.4 с в хлебных крошках мелькает «AdminPanel» — не проверяем.
(источник: решение владельца 07.10 — для обычного пользователя админ-панели «нет», редирект на /dashboard без «Access Denied» (.qa/context.md); реджект #12126fac 07.10; S-15 AC 05; RBAC #08 AC 03)
Подробные варианты (HE, варианты адреса, назад/вперёд, admin) — кейсы `.qa/tests/admin-access/AA-05…AA-08`.
## История
- 2026-10-04 · ✅ · #ca557707 (тогда ожидалось «Access Denied»; rpc admin_list_plan_accounts → 403 — вручную)
- 2026-10-07 · ❌ · #12126fac — «Access Denied» вместо редиректа (реджект); кейс переписан под решение владельца
- 2026-10-08 · ✅ · #12126fac — редирект на /dashboard (.qa/screenshots/12126fac/2026-10-08/)
- 2026-11-12 · ✅ · #fc4fa4 — редирект на /dashboard (повторно); прямое чтение журнала через API — .qa/tests/audit-log/AL-01…AL-03, dispatcher — AL-04.
