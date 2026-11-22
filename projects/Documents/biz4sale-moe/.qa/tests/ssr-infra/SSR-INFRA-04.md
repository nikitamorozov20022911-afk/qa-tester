# SSR-INFRA-04: В браузере SSR-блок скрыт к DOMContentLoaded, удалён после React; 0 ошибок консоли
- Фича/экран: SSR/SSG — гидратация/подмена
- Тикеты: #be4863
- Роль/аккаунт: гость
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: прод https://www.biz4sale.co.il, гость, только GET. Карточка — первая ссылка `/businessdetail?id=` из сырого HTML /search; категория — первая `/search?category=` из /sitemap.xml (не выдумывать значение: неизвестная категория отдаёт noindex и пустой #root). Браузер с JS, SW выключен, не-GET запросы обрываются, cookie «только необходимые».
## Шаги
1. Открыть каждую публичную страницу из SSR-INFRA-01.
2. Зафиксировать состояние `[data-seo-body]` в момент DOMContentLoaded.
3. Дождаться приложения React.
## Ожидаемо (источник: #be4863 — בלי הבהוב תוכן כפול, בלי שגיאות)
- На DOMContentLoaded блок `display:none` (CSS `@media (scripting: enabled)`) или уже удалён — не виден.
- После React `[data-seo-body]` в DOM нет (0 элементов), React-разметка видна.
- 0 `console.error` и 0 `pageerror`.
## История
- 2026-11-01 · ✅ · עבר QA #be4863 (провёл пользователь); на проде desktop и Pixel 7 ошибок 0
