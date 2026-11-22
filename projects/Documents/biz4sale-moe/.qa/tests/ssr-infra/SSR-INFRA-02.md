# SSR-INFRA-02: Приватные страницы — пустой #root и noindex
- Фича/экран: SSR/SSG — исключения
- Тикеты: #be4863
- Роль/аккаунт: гость
- Устройство: desktop (HTTP-запрос без браузера и JS)
- Тип: негатив
- Предусловия: прод https://www.biz4sale.co.il, гость, только GET. Карточка — первая ссылка `/businessdetail?id=` из сырого HTML /search; категория — первая `/search?category=` из /sitemap.xml (не выдумывать значение: неизвестная категория отдаёт noindex и пустой #root).
## Шаги
1. GET /messages, /addbusiness, /mybusinesses, /userprofile, /changepassword, /favoritesandconversations, /savedsearches.
## Ожидаемо (источник: #be4863 — דפים פרטיים לא מרונדרים בשרת ולא באינדקס)
- `<div id="root"></div>` пустой, нет `data-seo-body`.
- noindex: `<meta name="robots">` с noindex и/или заголовок X-Robots-Tag с noindex (на проде сейчас оба «noindex, follow»).
- Связано (#d777c9, 2026-11-02): эти пути также закрыты `Disallow` в robots.txt — noindex остаётся вдобавок к Disallow, не вместо него (решение пользователя: AC3 #d777c9 буквально). Полный список и проверка — `seo-robots-sitemap/ROBOTS-02`, `ROBOTS-04`.
## История
- 2026-11-01 · ✅ · עבר QA #be4863 (провёл пользователь)
- 2026-11-02 · ✅ · #d777c9 (noindex остался после PR #185)
