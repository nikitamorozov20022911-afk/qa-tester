# CP-11: Billing → Coupon → Check: ошибки кода
- Фича/экран: Billing & Subscription → Coupons & referrals → Coupon
- Тикеты: #a10206, #b93722
- Роль/аккаунт: wojeg27104@blobapps.com («בדיקה», auth/user.json)
- Устройство: desktop 1440×900
- Тип: негатив
- Предусловия: QA-PCT10-1410 (wojeg, Disabled), QA-EXP2-1810 (wojeg, истёк 18.10 → Disabled 19.10), QA-R1-ONLY-1910 (только iamdejar, Disabled).
## Шаги
1. Ввести несуществующий код → Check.
2. QA-PCT10-1410 → Check.
3. QA-R1-ONLY-1910 → Check.
4. QA-EXP2-1810 → Check.
## Ожидаемо
1. «This coupon code does not exist.»
2. «This coupon is no longer active.»
3. Сейчас (отключён) — «This coupon is no longer active.»; пока был активным — «This coupon belongs to another account.» (19.10).
4. Пока был только истёкшим — «This coupon has expired.» (19.10); после Disable — «expired» или «no longer active» (порядок не сверен).
Во всех случаях нет цены и «Continue to payment».
(источник: #a10206 AC5 / F-18 «проверка при погашении»; тексты — ручная проверка 19.10, r1-s5-*.png)
## История
- 2026-10-19 · ✅ · #a10206 #b93722
