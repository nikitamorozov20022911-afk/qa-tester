# ROBOTS-02: robots.txt закрывает Disallow приватные и служебные разделы — для всех ботов
- Фича/экран: «תשתית SEO טכנית לאתר» · /robots.txt
- Тикеты: #d777c9 (реджект rej_0effd95e, PR #185)
- Роль/аккаунт: guest
- Устройство: не важно (HTTP GET) → desktop
- Тип: негатив (доступ краулеров), прод, только чтение (@prod-safe)
- Предусловия: нет.
## Шаги
1. GET /robots.txt, разобрать группы User-agent и правила (как Google: самое длинное совпадение, при равенстве — Allow).
2. Для ботов `*`, Googlebot, Bingbot, Google-Extended, GPTBot, ClaudeBot, PerplexityBot проверить пути:
   - технические: /admin, /api/, /qa/ (и /qa/payments), /auth-test, /payment/ (и /payment/success, /payment/error);
   - вход и профиль: /auth, /complete-profile, /userprofile, /changepassword, /usernotifications, /userpackages;
   - личные разделы: /messages, /favoritesandconversations, /savedsearches, /mybusinesses;
   - мастера и служебные: /addbusiness (и /addbusiness?id=…), /postbuyerrequest, /publishconfirmation, /businessresultempty, /mapview.
## Ожидаемо
- В файле есть строка `Disallow:` для каждого из 20 путей: /admin, /api/, /qa/, /auth-test, /payment/, /auth, /complete-profile, /userprofile, /changepassword, /usernotifications, /userpackages, /messages, /favoritesandconversations, /savedsearches, /mybusinesses, /addbusiness, /postbuyerrequest, /publishconfirmation, /businessresultempty, /mapview.
- Каждый путь из шага 2 (с подпутями и параметрами) запрещён для каждого бота.
(источник: AC3 #d777c9 «חוסם אזורים פרטיים או לא רלוונטיים»; решение пользователя 2026-11-01 — AC3 буквально, noindex вместо Disallow не принимаем; фича — «חוסם מסלולי ניהול ואזור אישי»)
## История
- 2026-11-01 · ❌ · #d777c9 — Disallow был только у 5 технических путей (реджект rej_0effd95e)
- 2026-11-02 · ✅ · עבר QA #d777c9 — 20 Disallow, одна группа на всех ботов
