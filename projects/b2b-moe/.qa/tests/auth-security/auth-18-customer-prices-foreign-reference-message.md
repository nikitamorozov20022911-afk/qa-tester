# auth-18: customer_prices — сообщение FOREIGN_REFERENCE называет реальное поле (customer_id / product_id)
- Фича/экран: F-21 изоляция данных / цена пер-клиент (API)
- Тикеты: #6aae65 (связан: #3c03f6)
- Роль/аккаунт: dist2 (.qa/auth/dist2.json); id клиента «test» и товара — под admin
- Устройство: API (desktop)
- Тип: негатив (безопасность)
- Предусловия: у dist2 есть свои (архивные) QA-AUTO-6aae65-C (cb15460a-a222-42bf-97d8-462b752a89ac) и QA-AUTO-6aae65-P (e51273eb-7704-407d-b7aa-54544afd3033); DELETE для dist2 запрещён.
## Шаги
1. Под dist2: POST /rest/v1/customer_prices {customer_id: «test» admin, product_id: свой QA-AUTO-6aae65-P, price: 1}.
2. Под dist2: POST /rest/v1/customer_prices {customer_id: свой QA-AUTO-6aae65-C, product_id: товар admin, price: 1}.
3. Проверить, что строк нет.
## Ожидаемо
- Шаг 1: 403 / 42501, сообщение содержит «customer_prices.customer_id points into another business», не содержит product_id.
- Шаг 2: 403 / 42501, сообщение содержит «customer_prices.product_id points into another business», не содержит customer_id.
- Строки не созданы (источник: מה רצוי #6aae65; блок 403 сохранён — #3c03f6).
## История
- 2026-11-19 · ✅ · #6aae65
