# ACU-11: Гость на /admin → /login
- Фича/экран: admin-companies-users · «ניהול חברות ומשתמשים» (/admin)
- Тикеты: #05b294 (связанные #05b294, #0fc9cd, #db2075, #3608cf)
- Роль/аккаунт: гость
- Устройство: desktop (@desktop @prod-safe)
- Тип: негатив (доступ)
- Предусловия: сессии нет
- Автотест: `.qa/e2e/tests/admin-companies-users/admin-access.spec.ts`
## Шаги
1. Открыть /admin без входа.
## Ожидаемо
- Переход на /login; списков нет (AC д).
## История
- 2026-11-17 · ✅ · #05b294
