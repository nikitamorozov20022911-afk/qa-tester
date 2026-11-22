# SEO-META-03: canonical без utm/from; /b/<код> → редирект → canonical на /businessdetail?id=<uuid>
- Фича/экран: SEO canonical
- Тикеты: #b489db
- Роль/аккаунт: guest
- Тип: позитив (технический), прод, только чтение (@prod-safe)
- Устройство: не важно
## Шаги
1. GET /businessdetail?id=<uuid>&utm_source=x&from=wa.
2. GET /b/<id8> без следования редиректу; затем по Location.
## Ожидаемо
- canonical и og:url = https://www.biz4sale.co.il/businessdetail?id=<uuid> (без utm/from).
- /b/<id8> → 3xx, Location → /businessdetail?id=<uuid>; там canonical = тот же чистый URL.
(источник: «מה רצוי» #b489db)
## История
- 2026-11-01 · ✅ · #b489db
