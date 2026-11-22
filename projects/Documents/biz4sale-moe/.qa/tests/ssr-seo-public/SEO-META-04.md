# SEO-META-04: объявление — twitter:card, JSON-LD Product/Offer по цене, BreadcrumbList
- Фича/экран: structured data объявления
- Тикеты: #b489db (дополняет listing-jsonld #fbeedf)
- Роль/аккаунт: guest
- Тип: позитив (технический), прод, только чтение (@prod-safe)
- Устройство: не важно (сырой HTML)
## Шаги
1. Все объявления из sitemap → сырой HTML: twitter:card, JSON-LD, строка «מחיר מבוקש:» SSR-блока.
## Ожидаемо
- twitter:card = summary_large_image.
- Все JSON-LD — валидный JSON; есть BreadcrumbList.
- С ценой: @type Product, offers{price > 0, priceCurrency "ILS"}; без цены — @type Offer без price. Цена в JSON-LD ⇔ «מחיר מבוקש:» в SSR-блоке.
(источник: «מה רצוי» #b489db)
## История
- 2026-11-01 · ✅ · #b489db
