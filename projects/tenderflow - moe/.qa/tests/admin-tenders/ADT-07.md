# ADT-07: ADMIN компании и USER на /admin/tenders и /admin/tenders/<id>: «אין לך הרשאה למסך זה»
- Фича/экран: admin-tenders · «ניהול מכרזים שנקלטו» (/admin/tenders, /admin/tenders/<id>)
- Тикет: #662546 (связанные #f29d93, #d8c954, #3608cf, #43e90c)
- Роль/аккаунт: admin (`auth/admin.json`), user (`auth/user.json`)
- Устройство: desktop 1440 (@prod-safe)
- Тип: негатив / права (#43e90c)
- Автотест: `.qa/e2e/tests/admin-tenders/admin-tenders-access.spec.ts`
## Шаги
1. Войти как ADMIN, открыть /admin/tenders и /admin/tenders/<id>. 2. То же как USER.
## Ожидаемо
- «אין לך הרשאה למסך זה» + «המסך זמין למנהלי מערכת בלבד.»; нет «פרטי מכרז שנקלט», колонки «פירוט», названия QA-T6.
## История
- 2026-11-18 · ✅ · #662546 (бандл index-lp1EzSMf.js; dry-run автотеста прошёл)
