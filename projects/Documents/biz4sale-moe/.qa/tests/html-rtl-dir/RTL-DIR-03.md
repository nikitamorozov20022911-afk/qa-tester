# RTL-DIR-03: После SPA-навигации dir=rtl сохраняется
- Фича/экран: клиентские переходы / → /search → /businessdetail → /calculator → «назад»
- Тикеты: #9c4736
- Роль/аккаунт: guest
- Устройство: desktop 1440×900 (вручную также android 375)
- Тип: позитив
- Предусловия: прод, только чтение (не-GET обрываются, SW выключен, cookie «только необходимые»); окно PWA — «אולי מאוחר יותר». Категория — первая `/search?category=` из sitemap.xml, объявление — первая `/businessdetail?id=` из сырого /search. Неизвестный путь — `/qa-test-404-xyz` (soft 404, тот же shell).
## Шаги
1. Открыть /; «צפה בכל העסקים» → /search; первая карточка → /businessdetail; в шапке «מחשבון רכישת עסק» → /calculator; «назад».
2. После каждого перехода проверить dir/lang/body direction; страница не перезагружалась (метка window жива).
## Ожидаемо
- На каждом шаге dir="rtl", lang="he", body rtl (источник: #9c4736 «כיוון הדף כולו יהיה RTL»).
- Автотест: `.qa/e2e/tests/html-rtl-dir/spa-navigation-keeps-rtl.spec.ts`.
## История
- 2026-11-05 · ✅ · עבר QA #9c4736 (провёл пользователь), скрины `.qa/screenshots/2026-11-05/9c4736-T4-spa-nav-*.png`
