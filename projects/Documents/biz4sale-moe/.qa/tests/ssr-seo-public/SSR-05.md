# SSR-05: Hydration — SSR-блок скрыт к DOMContentLoaded и удалён после React; Googlebot = обычный UA
- Фича/экран: SSR · /, /search, объявление
- Тикеты: #b3dc2e
- Роль/аккаунт: guest
- Тип: позитив (технический), прод, только чтение (@prod-safe)
- Устройство: desktop (браузер; все не-GET запросы заблокированы)
## Шаги
1. Сырой HTML /, /search, категория, объявление — с обычным UA и UA Googlebot.
2. В браузере открыть те же страницы: на DOMContentLoaded посмотреть [data-seo-body]; дождаться React.
## Ожидаемо
- SSR-блок одинаков для обычного UA и Googlebot (нет клоакинга).
- На DOMContentLoaded SSR-блок не виден; после React [data-seo-body] удалён из DOM; на объявлении h1 с названием один, title = title сырого HTML.
(источник: «מה רצוי» #b3dc2e — без дублей контента для пользователя)
## История
- 2026-11-01 · ✅ · #b3dc2e
