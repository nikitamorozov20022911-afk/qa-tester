# ROBOTS-01: robots.txt отдаётся как text/plain и ссылается на рабочий sitemap
- Фича/экран: «תשתית SEO טכנית לאתר» · /robots.txt
- Тикеты: #d777c9 (также #26657c, #25314c)
- Роль/аккаунт: guest
- Устройство: не важно (HTTP GET без браузера) → desktop
- Тип: позитив (технический), прод, только чтение (@prod-safe)
- Предусловия: нет.
## Шаги
1. GET https://www.biz4sale.co.il/robots.txt.
2. Найти строку `Sitemap:`; GET указанного адреса.
## Ожидаемо
- robots.txt — 200, `content-type` содержит `text/plain`.
- Ровно одна строка `Sitemap: https://www.biz4sale.co.il/sitemap.xml` (абсолютный адрес, https, www).
- Ответ на адрес из `Sitemap:` — 200, XML (`<urlset`), не HTML-шелл.
(источник: AC4 #d777c9 «קיימת הפניה תקינה ל-sitemap מתוך robots.txt»; фича — «robots.txt שמפנה ל-sitemap»)
## История
- 2026-11-02 · ✅ · עבר QA #d777c9 (подтвердил пользователь)
