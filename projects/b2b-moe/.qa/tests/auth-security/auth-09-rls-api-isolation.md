# auth-09: RLS — לקוח מקבל מה-API רק את הנתונים שלו
- Фича/экран: F-21 / S-27 (D-07)
- Тикеты: 6a38cf5af24b67a589bd7efc #6a38cf5a
- Роль/аккаунт: buyer
- Устройство: desktop
- Тип: негатив (безопасность)
- Предусловия: сессия buyer; anon key из бандла приложения; access_token из localStorage.
## Шаги
1. GET /rest/v1/orders?select=id,customer_id — все заказы.
2. GET /rest/v1/orders?id=eq.<id чужого заказа>.
3. GET /rest/v1/customers?select=id,name.
## Ожидаемо
1. Все строки с одним customer_id (своим).
2. 200 и пустой массив `[]` (AC «לקוח א' מבקש נתון של לקוח ב' → נדחה ברמת השרת»; «קריאה לנתוני לקוח מסוננת ב-RLS»).
3. Только собственный клиент.
## История
- 2026-10-03 · backfill · ✅ сверено (own=1 заказ, чужой → [], customers → 1)
