# CP-09 (вручную): «Only for this account» с несуществующим e-mail — отказ
- Фича/экран: Admin Panel → Coupons → New coupon → Save
- Тикеты: #b93722
- Роль/аккаунт: admin
- Устройство: desktop 1440×900
- Тип: негатив
- Предусловия: ТОЛЬКО ВРУЧНУЮ — нужен Save; при ошибке проверки купон создастся в живом Stripe и не удалится. Код QA-…-<дата>.
## Шаги
1. New coupon: Code QA-…, Percent 10, One invoice, Only for this account = qa-nobody@example.test → Save.
## Ожидаемо
- Сообщение «No account uses the e-mail qa-nobody@example.test» (тост «The change wasn't saved»), купон не появился в списке.
(источник: комментарий программиста п.7 — привязка к несуществующему email → отказ с сообщением)
## История
- 2026-10-19 · ✅ · #b93722 (r1-s2-only-nobody-rejected-desktop.png)
