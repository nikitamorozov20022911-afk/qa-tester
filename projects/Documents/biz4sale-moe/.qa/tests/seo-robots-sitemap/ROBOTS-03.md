# ROBOTS-03: публичные страницы и все URL sitemap открыты для поисковых и AI-ботов; /guides закрыта
- Фича/экран: «תשתית SEO טכנית לאתר» · /robots.txt + /sitemap.xml
- Тикеты: #d777c9 (также #500d1d — AI-боты не закрыты; #b3dc2e, #b489db), #359741 (гайды скрыты — /guides больше не публичная)
- Роль/аккаунт: guest
- Устройство: не важно (HTTP GET) → desktop
- Тип: позитив (технический), прод, только чтение (@prod-safe)
- Предусловия: нет.
## Шаги
1. GET /robots.txt, разобрать правила.
2. GET /sitemap.xml, взять все `<loc>`.
3. Для ботов `*`, Googlebot, Bingbot, Google-Extended, GPTBot, ClaudeBot, PerplexityBot проверить: /, /search, /packages, /calculator, /buyerlistings, /accessibility, /privacy, /privacy-policy, /terms, /terms-of-use, /faq.html, /llms.txt, /sitemap.xml, /b/<код>, первая категория и первое объявление из sitemap, затем каждый URL из sitemap (путь + параметры).
## Ожидаемо
- В robots.txt есть `Allow: /`; каждый перечисленный AI-бот назван в `User-agent` (он в общей группе, отдельной закрытой группы нет).
- Все пути из шага 3 разрешены для каждого бота; ни один URL sitemap не попадает под Disallow.
- /guides: в sitemap нет; в robots.txt `Disallow: /guides` — закрыта для каждого бота (с #359741, принято пользователем при проведении тикета 2026-11-10).
(источник: AC3 #d777c9 «מאפשר סריקה של דפים ציבוריים»; מצב רצוי реджекта — публичные остаются открытыми; #500d1d — AI-боты читают публичные страницы)
## История
- 2026-11-02 · ✅ · עבר QA #d777c9 — 399 URL sitemap, все разрешены
- 2026-11-10 · ✍️ · #359741 — /guides больше не публичная: убрана из открытых путей, проверяется Disallow и отсутствие в sitemap
