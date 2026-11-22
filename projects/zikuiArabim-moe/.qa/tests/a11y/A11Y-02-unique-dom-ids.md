# A11Y-02: Все id в DOM уникальны
- Фича/экран: web/a11y
- Тикеты: 6a905cebd33cb282cef3f9ad (Figma layer names leak into the DOM as duplicate ids) — AC: «Every id in a rendered document is unique.» (/dates onboarding недоступен зарегистрированному — manual)
- Роль/аккаунт: user1; гость — отдельный чистый контекст
- Устройство: mobile 390
- Тип: a11y · @prod-safe
## Шаги
1. user1: /home, /journey, /journey/history, /profile, /zmanim, /prayers, /lessons, /tehilim, /tehilim/72, /prayer/mincha_ashkenaz, /blessings; гость: /, /phone, /register.
2. На каждом: ids = [...document.querySelectorAll('[id]')].map(e=>e.id); найти повторы.
## Ожидаемо
- Повторов 0 на каждом маршруте (нет «Vector», «Group …» и т.п. дважды).
## История
- 2026-10-03 · ✅ · backfill
