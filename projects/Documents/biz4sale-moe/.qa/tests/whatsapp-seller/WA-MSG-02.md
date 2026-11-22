# WA-MSG-02: Вход через biz4sale.vercel.app — ссылка в сообщении продавцу всё равно на www.biz4sale.co.il
- Фича/экран: WhatsApp למוכר · карточки бизнеса на главной и в /search домена biz4sale.vercel.app
- Тикеты: #1d84d2, #e8bbad (Т4.1)
- Роль/аккаунт: guest (сессии `.qa/auth` — для www, на vercel.app другой origin)
- Устройство: mobile — Android Pixel 7 (у клиента Android); 10-27 также десктоп
- Тип: позитив
- Предусловия: как WA-MSG-01 (только чтение, не кликать WhatsApp, читать href). Service worker выключен — свежий бандл vercel.app.
## Шаги
1. Открыть https://biz4sale.vercel.app/ — дождаться ссылок WhatsApp в карточках.
2. Раскодировать `text` каждой ссылки продавцу.
3. То же на https://biz4sale.vercel.app/search.
## Ожидаемо
- Ссылка в сообщении `https://www.biz4sale.co.il/b/<код карточки>`, ни одной на vercel.app. (источник: #1d84d2 «מה רצוי»: «הקישור בהודעה תמיד על הדומיין של הפרודקשן: https://www.biz4sale.co.il/b/<קוד>, בלי קשר לדומיין שממנו המשתמש גולש»)
- Строка перед ссылкой — `לצפייה במודעה` без эмодзи. (источник: #e8bbad)
- 10-27: главная 12/12, /search 306/306. Кнопка страницы объявления 4d62fda8 на vercel.app (гость, через попап) → `https://www.biz4sale.co.il/b/4d62fda8` 3/3 — вручную, см. WA-MAN-01.
## Не требование
- 301 biz4sale.vercel.app → www не сделан (в тикете «מומלץ», программист отложил из-за CardCom FRONTEND_URL). Сейчас / → 200, /b → 302 на vercel.app.
## История
- 2026-10-27 · ✅ · #1d84d2
