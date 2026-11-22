# auth-19: approve_order на уже утверждённом/отклонённом заказе блокируется, ничего не меняется
- Фича/экран: «אישור / דחיית הזמנה» (#f0beea, AC3, д4) — API
- Тикеты: #c3fdb1 (связаны: #5e97b8 — одна קבלה)
- Роль/аккаунт: admin («באנגו דלי», .qa/auth/admin.json)
- Устройство: API (desktop)
- Тип: негатив
- Предусловия: существующие тестовые заказы: #693 (QA-AUTO-c3fdb1, «אושרה», одна קבלה), #694 (QA-AUTO-c3fdb1-R, «נדחתה» с причиной). Новые заказы не создаются.
## Шаги
1. Запомнить строку заказа #693, его order_notes и число order_receipts.
2. POST /rest/v1/rpc/approve_order {p_order_id: #693, p_note: «QA-AUTO-c3fdb1-api»}; затем без p_note.
3. Перечитать заказ, заметки, קבלות.
4. То же для #694: approve_order; затем повторный PATCH /rest/v1/orders {status:rejected, reject_reason}; затем PATCH rejected на #693 (INVALID_STATUS_TRANSITION:approved->rejected).
## Ожидаемо
- #693: 400 / 22023 / ALREADY_APPROVED оба раза; order_notes и updated_at не изменились; קבלה одна (источник: מה רצוי #c3fdb1).
- #694: 400 / 22023 / ALREADY_REJECTED; reject_reason не затёрт.
- UI (две вкладки, «ההזמנה כבר אושרה.» + обновление карточки) — нужен новый заказ, в автотест не включено (@data, skip).
## История
- 2026-11-19 · ✅ · #c3fdb1 (API на #693/#694)
