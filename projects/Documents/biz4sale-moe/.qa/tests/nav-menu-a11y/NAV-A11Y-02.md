# NAV-A11Y-02: Кнопка «תפריט» открывает меню, aria-expanded false → true
- Фича/экран: шапка сайта, мобильное меню (Radix Sheet, dialog с заголовком «תפריט»)
- Тикеты: #2f6eef (регресс #7f42b5, #aeae17)
- Роль/аккаунт: guest
- Устройство: mobile 375×812 / Pixel 7 (iPhone + Android)
- Тип: позитив
- Предусловия: как NAV-A11Y-01. После открытия Radix прячет фон (`aria-hidden`), кнопку читать с `includeHidden: true`.
## Шаги
1. На каждой странице NAV-A11Y-01 нажать кнопку «תפריט».
2. Проверить dialog и `aria-expanded` кнопки.
## Ожидаемо
- Открыт dialog с заголовком «תפריט» (источник: #7f42b5, #aeae17 — меню открывается, пункты на месте: 4-й «מחשבון רכישת עסק»).
- `aria-expanded` кнопки = "true" (регресс С3 брифа: Radix-состояние не сломано фиксом).
- Автотест: `.qa/e2e/tests/nav-menu-a11y/menu-button-accessible-name.spec.ts` (тот же тест, вторая часть); пункты меню — `calculator/nav-calculator-label.spec.ts`.
## История
- 2026-11-05 · ✅ · עבר QA #2f6eef (провёл пользователь), скрины `.qa/screenshots/2026-11-05/2f6eef-C1-menu-open-mobile.png`, `2f6eef-C2-accessibility-open-mobile.png`
