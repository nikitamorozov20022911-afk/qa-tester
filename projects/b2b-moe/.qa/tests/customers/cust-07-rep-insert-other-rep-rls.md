<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# cust-07: RLS — נציג не может создать клиента, закреплённого за другим נציג (403, 42501)
- Фича/экран: D-07 (RLS `customers_rep_insert`)
- Тикеты: 13c85e40bcbcebaefe1c5a6c #1c5a6c; 9c9fe725ebbe7ca245ea0fde #ea0fde (комментарий программиста: «נחסם כשמנסה להוסיף לקוח שאינו שלו»)
- Роль/аккаунт: rep «testtest» (REST от его сессии); admin — только чтобы узнать id נציג משה כהן
- Устройство: desktop
- Тип: негатив / безопасность
- Предусловия: нет.
## Шаги
1. admin: id профиля נציג «משה כהן» (`profiles?role=eq.sales_rep&full_name=eq.משה כהן`).
2. rep: `POST /rest/v1/customers` { name: QA-AUTO-…-rls, distributor_id (свой), sales_rep_id: id משה כהן }.
## Ожидаемо
2. HTTP 403, `code` = `42501`; клиент не создан (D-07, комментарий программиста).
## История
- 2026-10-29 · ✅ · #1c5a6c; автотест `rep-new-customer.spec.ts` — прогон 29.10 ✅.
