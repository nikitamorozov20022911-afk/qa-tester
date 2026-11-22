# CP-05: Список купонов — колонки, состояния, у Disabled только Redemptions
- Фича/экран: Admin Panel → Coupons (список)
- Тикеты: #b93722, #a10206
- Роль/аккаунт: admin
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: в списке есть купоны (QA-PCT10-1410 и др., все Disabled на 19.10).
## Шаги
1. /adminpanel → Coupons.
## Ожидаемо
- Колонки: Code, Discount, For, Used, Expires, State + кнопки действий (без заголовка).
- State каждой строки — одно из Active / Not in Stripe / Expired / Used up / Disabled.
- У Disabled — только «Redemptions» (нет Edit / Disable); у Active — Edit, Redemptions, Disable.
(источник: описание #b93722 п.3, комментарий программиста 12.10 п.3–4)
## История
- 2026-10-19 · ✅ · #b93722 #a10206 (b93722-list-desktop.png, r1-s6-disabled-desktop.png)
