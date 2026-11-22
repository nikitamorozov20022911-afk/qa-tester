# ACU-12: Сервер: ADMIN и USER получают 403 / 42501 «platform admin only» на 4 RPC
- Фича/экран: admin-companies-users · «ניהול חברות ומשתמשים» (/admin)
- Тикеты: #0fc9cd (связанные #05b294, #0fc9cd, #db2075, #3608cf)
- Роль/аккаунт: ADMIN, USER
- Устройство: desktop (@desktop @prod-safe)
- Тип: негатив / API
- Предусловия: параметры безвредные: нулевой uuid и p_*:false (запись не существует — менять нечего даже при дыре)
- Автотест: `.qa/e2e/tests/admin-companies-users/admin-access.spec.ts`
## Шаги
1. От имени роли вызвать platform_list_companies, platform_list_users, platform_set_company_suspended{p_company:0000…,p_suspended:false}, platform_set_user_blocked{p_user:0000…,p_blocked:false}.
## Ожидаемо
- Каждый вызов: HTTP 403, code 42501, message содержит «platform admin only» (דרישה 5 на сервере).
## История
- 2026-11-17 · ✅ · #0fc9cd (2 прогона, RPC от ADMIN/USER 403)
