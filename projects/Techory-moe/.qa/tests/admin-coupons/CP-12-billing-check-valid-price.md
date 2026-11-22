# CP-12: Billing → Check действующего купона — цена до/после, «Continue to payment»
- Фича/экран: Billing & Subscription → Coupon
- Тикеты: #a10206, #b93722
- Роль/аккаунт: wojeg27104@blobapps.com
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: действующий (Active) купон для wojeg или «Anyone with the code»; на 19.10 таких нет — автотест ждёт код в QA_COUPON_VALID, иначе пропускается.
## Шаги
1. Ввести код → Check. «Continue to payment» НЕ нажимать.
## Ожидаемо
- Блок: код · N% off · план; старая цена зачёркнута (например $49), новая ниже ($39.20) /month · срок; «The discount is applied at checkout.»; кнопка «Continue to payment».
(источник: #291f7a9d п.1; ручная проверка 19.10, r1-s3-pct-check-desktop.png)
## История
- 2026-10-19 · ✅ · #a10206 #b93722 (QA-R1-PCT-1910, $49 → $39.20)
