# SSR-INFRA-01: Публичные страницы — SEO-блок в сыром HTML, h1, robots «index, follow»
- Фича/экран: SSR/SSG публичных страниц
- Тикеты: #be4863
- Роль/аккаунт: гость
- Устройство: desktop (HTTP-запрос без браузера и JS)
- Тип: позитив
- Предусловия: прод https://www.biz4sale.co.il, гость, только GET. Карточка — первая ссылка `/businessdetail?id=` из сырого HTML /search; категория — первая `/search?category=` из /sitemap.xml (не выдумывать значение: неизвестная категория отдаёт noindex и пустой #root).
## Шаги
1. GET (без JS) /, /search, /search?category=<из sitemap>, /businessdetail?id=<из /search>, /packages, /calculator, /buyerlistings.
## Ожидаемо (источник: #be4863 «מה רצוי» — תוכן מרונדר בשרת לדפים ציבוריים)
- 200, text/html; внутри `<div id="root">` есть `[data-seo-body]` с непустым текстом и непустым `<h1>`.
- `<meta name="robots" content="index, follow">`; нет X-Robots-Tag noindex.
## История
- 2026-11-01 · ✅ · עבר QA #be4863 (провёл пользователь); сверено curl на проде
