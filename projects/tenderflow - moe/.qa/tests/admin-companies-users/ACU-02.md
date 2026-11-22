# ACU-02: Списки на экране совпадают с ответами сервера platform_list_companies / platform_list_users
- Фича/экран: admin-companies-users · «ניהול חברות ומשתמשים» (/admin)
- Тикеты: #0fc9cd (связанные #05b294, #0fc9cd, #db2075, #3608cf)
- Роль/аккаунт: platform admin (`auth/platform.json`, qa-tester-platform; один вход — не параллелить)
- Устройство: desktop (@desktop @prod-safe)
- Тип: позитив / API
- Предусловия: вход platform; только чтение
- Автотест: `.qa/e2e/tests/admin-companies-users/admin-readonly.spec.ts`
## Шаги
1. Открыть /admin, взять N и M из заголовков. 2. От имени platform вызвать RPC platform_list_companies и platform_list_users (токен из сессии, anon key из бандла сайта).
## Ожидаемо
- Оба ответа 200, массивы.
- Длина массивов = N и M (דרישות 1, 2 #0fc9cd).
## История
- 2026-11-17 · ✅ · #0fc9cd
