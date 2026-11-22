# RTL-DIR-01: Живой DOM — <html lang="he" dir="rtl">, body direction rtl на 9 страницах
- Фича/экран: документ сайта (глобально) · /, /search, /search?category=…, /businessdetail?id=…, /guides, /auth, /calculator, неизвестный путь, /addbusiness (user)
- Тикеты: #9c4736
- Роль/аккаунт: guest; /addbusiness — user (`.qa/auth/user.json`); /guides — admin (`.qa/auth/admin.json`, с #359741 гайды видит только админ)
- Устройство: desktop 1440×900 (вручную также android 375)
- Тип: позитив
- Предусловия: прод, только чтение (не-GET обрываются, SW выключен, cookie «только необходимые»); окно PWA — «אולי מאוחר יותר». Категория — первая `/search?category=` из sitemap.xml, объявление — первая `/businessdetail?id=` из сырого /search. Неизвестный путь — `/qa-test-404-xyz` (soft 404, тот же shell). /addbusiness — только открыть шаг 1, ничего не вводить.
## Шаги
1. Открыть страницу, дождаться отрисовки приложением (после гидратации).
2. Консоль: `document.documentElement.dir`, `.lang`, `getComputedStyle(document.body).direction`.
## Ожидаемо
- dir = "rtl", lang = "he", body direction = "rtl" на каждой странице (источник: #9c4736 «מה רצוי» «בתגית html יהיה dir="rtl" (יחד עם lang="he"), כך שכיוון הדף כולו יהיה RTL»; шаг 3 тикета).
- Автотесты: `.qa/e2e/tests/html-rtl-dir/dom-dir-rtl.spec.ts`, `dom-dir-rtl-addbusiness-user.spec.ts`.
## История
- 2026-11-05 · ✅ · עבר QA #9c4736 (провёл пользователь), desktop 1440 + android 375, скрины `.qa/screenshots/2026-11-05/9c4736-T1-*.png`
- 2026-11-10 · ✍️ · #359741 — /guides проверяется под админом (гость уходит на /)
