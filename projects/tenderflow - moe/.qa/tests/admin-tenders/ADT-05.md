# ADT-05: Прямой /tenders/<id>/analysis у platform admin → админ-страница деталей
- Фича/экран: admin-tenders · «ניהול מכרזים שנקלטו» (/admin/tenders, /admin/tenders/<id>)
- Тикет: #662546 (связанные #f29d93, #d8c954, #3608cf, #43e90c)
- Роль/аккаунт: platform admin (`auth/platform.json`; один вход — только --workers=1, не параллелить)
- Устройство: desktop 1440 (@prod-safe)
- Тип: позитив / דרישה 10
- Автотест: `.qa/e2e/tests/admin-tenders/admin-tenders-view.spec.ts`
## Шаги
1. Открыть /tenders/bbbbbbbb-0000-4000-8000-000000000006/analysis.
## Ожидаемо
- Редирект на /admin/tenders/<id>; страница «פרטי מכרז שנקלט» с обязательными подписями (не экран тендера компании, не /admin).
## История
- 2026-11-18 · ✅ · #662546 (бандл index-lp1EzSMf.js; dry-run автотеста прошёл)
