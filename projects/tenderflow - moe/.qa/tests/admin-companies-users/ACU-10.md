# ACU-10: ADMIN и USER на /admin: «המסך זמין למנהלי מערכת בלבד», списков и кнопок «חסימה» нет
- Фича/экран: admin-companies-users · «ניהול חברות ומשתמשים» (/admin)
- Тикеты: #0fc9cd (связанные #05b294, #0fc9cd, #db2075, #3608cf)
- Роль/аккаунт: USER (`auth/user.json`), ADMIN (`auth/admin.json`)
- Устройство: desktop (@desktop @prod-safe)
- Тип: негатив (доступ)
- Предусловия: —
- Автотест: `.qa/e2e/tests/admin-companies-users/admin-access.spec.ts`
## Шаги
1. Под USER открыть /admin. 2. Под ADMIN открыть /admin.
## Ожидаемо
- «אין לך הרשאה למסך זה» и «המסך זמין למנהלי מערכת בלבד.» (для ADMIN сообщение уже в ACM-01 #43e90c).
- Нет «חברות (N)»/«משתמשים (M)», нет «חסימה», нет «יצירת חברה חדשה» (דרישה 5, AC ד).
## История
- 2026-11-17 · ✅ · #0fc9cd (скрин `0fc9cd-v-admin-denied-desktop.png`)
