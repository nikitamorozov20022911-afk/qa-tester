# SEO-OG-01: faq.html — og:* и twitter:* в сыром HTML, og:image валидна
- Фича/экран: «תשתית SEO טכנית לאתר» · /faq.html
- Тикеты: #9f2c12
- Роль/аккаунт: guest
- Устройство: не важно (сырой HTML, curl/request)
- Тип: позитив (технический)
- Предусловия: нет. Только чтение.
## Шаги
1. GET https://www.biz4sale.co.il/faq.html (без JS).
2. Прочитать meta og:*, twitter:*, link rel=canonical.
3. GET URL из og:image.
## Ожидаемо
- 200, text/html; og:title, og:description, og:url (= canonical = https://www.biz4sale.co.il/faq.html), og:image — есть и не пусты.
- twitter:card = summary_large_image; twitter:title/description/image не пусты.
- og:image → 200 image/jpeg (1200×630 — «למשל», не требование).
(источник: «מה רצוי» #9f2c12; фича — теги в HTML без JS)
## История
- 2026-10-25 · ✅ · #9f2c12
