# ADT-09: 390 px: переход к деталям и страница деталей без горизонтального скролла страницы
- Фича/экран: admin-tenders · «ניהול מכרזים שנקלטו» (/admin/tenders, /admin/tenders/<id>)
- Тикет: #662546 (связанные #f29d93, #d8c954, #3608cf, #43e90c)
- Роль/аккаунт: platform admin (`auth/platform.json`; один вход — только --workers=1, не параллелить)
- Устройство: mobile 390×844 (@mobile) (@prod-safe)
- Тип: позитив / адаптив
- Автотест: `.qa/e2e/tests/admin-tenders/admin-tenders-mobile.spec.ts`
## Шаги
1. На 390 открыть /admin/tenders, поиск «QA-T6 upload», «פרטי מכרז». 2. Проверить страницу деталей.
## Ожидаемо
- /admin/tenders/<id>, подписи видны; scrollWidth страницы = 390, scrollX = 0; «חזרה למכרזים שנקלטו» в области видимости.
- Таблица списка на 390 — в mobile-tables (MT-04, #3608cf).
## История
- 2026-11-18 · ✅ · #662546 (бандл index-lp1EzSMf.js; dry-run автотеста прошёл)
