# ACU-15: Заблокированный: прямые заходы на /setup, /users, /onboarding — без мастера создания компании, без петли
- Фича/экран: admin-companies-users · «ניהול חברות ומשתמשים» (/admin) и экран блокировки
- Тикеты: #db2075 (связанные #05b294, #0fc9cd, #db2075, #3608cf)
- Роль/аккаунт: INV14 + platform
- Устройство: desktop (@desktop @data)
- Тип: негатив / навигация
- Предусловия: пользователь заблокирован (ACU-13)
- Автотест: `.qa/e2e/tests/admin-companies-users/admin-block-flow.spec.ts`
## Шаги
1. Открыть /setup. 2. Открыть /users, /onboarding.
## Ожидаемо
- /setup уводит с /setup и показывает «הגישה שלך למערכת חסומה» (комментарий jleprog39).
- /users и /onboarding: меню есть, URL не /setup, «הקמת חשבון חברה» и «יצירת חברה» нет.
## История
- 2026-11-17 · ✅ · #db2075 (скрины `db2075-inv14-user-setup-desktop.png`, `-onboarding-`)
