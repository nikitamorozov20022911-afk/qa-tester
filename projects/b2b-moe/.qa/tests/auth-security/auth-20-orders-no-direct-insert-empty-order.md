# auth-20: пустой заказ нельзя создать — прямой POST в orders закрыт, RPC блокируют пустой список
- Фича/экран: «אישור / דחיית הזמנה» (#f0beea, д7), F-21 / API
- Тикеты: #834c8e (связаны: #255bc0, #3c03f6)
- Роль/аккаунт: admin, buyer («test»), rep (.qa/auth/*.json)
- Устройство: API (desktop)
- Тип: негатив (безопасность)
- Предусловия: заказ #693 (distributor_id/customer_id — источник); число заказов запомнить.
## Шаги
1. Под admin, buyer, rep: POST /rest/v1/orders {distributor_id, customer_id, note} без позиций.
2. Под buyer: rpc/place_order {p_items: []}.
3. Под admin: rpc/create_customer_order и rpc/create_walkin_order с p_items: [].
4. Сравнить число заказов (count=exact).
## Ожидаемо
- Шаг 1: 403, код 42501 («permission denied for table orders») для всех трёх ролей (מה רצוי #834c8e).
- Шаг 2: 400 / 22023 / EMPTY_CART. Шаг 3: 400 / 22023 / EMPTY_ORDER.
- Число заказов не изменилось.
- UI-регресс (walk-in, «הזמנה מהודעה» создают заказы через RPC) — только вручную.
## История
- 2026-11-19 · ✅ · #834c8e
