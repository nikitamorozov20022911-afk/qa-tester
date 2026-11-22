# JSONLD-01: JSON-LD объявления — валиден, без цены нет полей цены, нет контактов
- Фича/экран: S-07 /businessdetail?id=… · Тикеты: #fbeedf · Роль: гость · Тип: SEO (curl по sitemap)
## Шаги
1. Взять все /businessdetail?id= из /sitemap.xml, скачать сырой HTML.
2. Распарсить все application/ld+json, обойти граф рекурсивно.
## Ожидаемо
- У каждого 2 блока (BreadcrumbList + объявление), JSON.parse без ошибок.
- Нет цены у объявления → нет price/priceCurrency/lowPrice/highPrice/priceSpecification.
- Нет telephone/email/contactPoint/address/geo/seller/author.
- Отсутствующие category/место/image не выводятся (ключа нет).
- Несуществующий id → только BreadcrumbList, robots noindex.
(источник: AC1–AC5 #fbeedf)
## История
- 2026-10-18 · ✅ · #fbeedf (279 объявлений; RRT: 00e1485f — 3 valid, 016a7d92/d869e89c — Breadcrumbs valid, 0 ошибок)
