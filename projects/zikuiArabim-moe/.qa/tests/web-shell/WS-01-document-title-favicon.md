# WS-01: На каждом маршруте document.title не пустой и есть favicon
- Фича/экран: web-оболочка
- Тикеты: 6a8edf78d6400316c09cd8ca (The web target has no document title and no favicon) — AC: «Every route has a document title, and a favicon is served.»
- Роль/аккаунт: user1; гость — отдельный чистый контекст
- Устройство: mobile 390
- Тип: позитив · @prod-safe
## Шаги
1. user1: /home, /journey, /journey/history, /profile, /zmanim, /prayers, /lessons, /tehilim, /tehilim/72, /prayer/mincha_ashkenaz, /blessings — после загрузки прочитать document.title и link[rel*=icon].
2. Гость: /, /phone, /register.
## Ожидаемо
- title не пустой и содержит «אור הגאולה»; на экранах — «<экран> · אור הגאולה» (напр. «בית · אור הגאולה», «תהילים ע״ב · אור הגאולה», «כניסה דרך מספר נייד · אור הגאולה»). На / и /tehilim (список) сейчас просто «אור הגאולה» — допустимо по AC.
- link[rel*=icon] → /favicon.ico на каждом маршруте.
## История
- 2026-10-03 · ✅ · backfill
