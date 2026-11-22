# ADT-08: Гость на /admin/tenders и /admin/tenders/<id> → /login
- Фича/экран: admin-tenders · «ניהול מכרזים שנקלטו» (/admin/tenders, /admin/tenders/<id>)
- Тикет: #662546 (связанные #f29d93, #d8c954, #3608cf, #43e90c)
- Роль/аккаунт: гость (без сессии)
- Устройство: desktop 1440 (@prod-safe)
- Тип: негатив / доступ
- Автотест: `.qa/e2e/tests/admin-tenders/admin-tenders-access.spec.ts`
## Шаги
1. Без входа открыть /admin/tenders, затем /admin/tenders/<id>.
## Ожидаемо
- Редирект на /login; данных тендера нет.
## История
- 2026-11-18 · ✅ · #662546 (бандл index-lp1EzSMf.js; dry-run автотеста прошёл)
