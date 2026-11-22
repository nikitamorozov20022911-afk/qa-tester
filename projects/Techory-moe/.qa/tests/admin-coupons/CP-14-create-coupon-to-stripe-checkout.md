# CP-14 (вручную): Создание купона → Check → Stripe Checkout (без оплаты) → Disable
- Фича/экран: Admin Panel → Coupons; Billing & Subscription; Stripe Checkout
- Тикеты: #a10206, #b93722
- Роль/аккаунт: admin + wojeg27104@blobapps.com
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: ТОЛЬКО ВРУЧНУЮ — живой Stripe, купоны не удаляются, нужен «да» пользователя. Код QA-…-<дата>, привязка к wojeg.
## Шаги
1. New coupon: Percent 20, 3 months, Only for this account = wojeg → Save → строка Active (тост «Coupon saved»).
2. Тот же код ещё раз → отказ «код существует».
3. Купон «Only for» другого аккаунта (активный) → под wojeg Check → «This coupon belongs to another account.»
4. Купон с датой окончания сегодня → на следующий день Expired; под wojeg Check → «This coupon has expired.»
5. Под wojeg: Check своего купона → «Continue to payment» → Stripe Checkout со скидкой (НЕ платить).
6. Admin: Redemptions → «At checkout»; Audit log — coupon.create / coupon.disable.
7. Все созданные купоны → Disable, записать в тестовые данные.
## Ожидаемо
- Как в шагах; в Stripe Checkout цена со скидкой ($49 → $39.20 для 20%), поля Promotion code нет.
- Не проверено: Used up (нужна реальная оплата), Not in Stripe / Retry sync (сбой не вызвать).
(источник: AC1–AC5 #a10206; описание #b93722 п.1–4; комментарий программиста 12.10)
## История
- 2026-10-19 · ✅ · #a10206 #b93722 (r1-s1-*, r1-s2-*, r1-s3-stripe-checkout*, r1-s0-exp2-*)
