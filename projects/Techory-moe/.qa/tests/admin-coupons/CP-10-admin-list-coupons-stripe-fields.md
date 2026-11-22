# CP-10: Ответ admin_list_coupons — у каждого купона stripe_coupon_id и sync_error
- Фича/экран: Admin Panel → Coupons (сеть: rpc admin_list_coupons)
- Тикеты: #a10206
- Роль/аккаунт: admin
- Устройство: desktop 1440×900
- Тип: позитив (API)
- Предусловия: —
## Шаги
1. /adminpanel → Coupons, смотреть ответ rpc/admin_list_coupons.
## Ожидаемо
- У каждого купона есть поля stripe_coupon_id и sync_error.
- У QA-купонов stripe_coupon_id заполнен, sync_error = null (синхронизация со Stripe прошла).
(источник: AC2 #a10206 — купон создаётся и в Stripe, сбой синхронизации фиксируется)
## История
- 2026-10-18 · ✅ · #a10206
