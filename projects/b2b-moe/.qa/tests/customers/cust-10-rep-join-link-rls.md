<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# cust-10: RLS ссылок — נציג создаёт и видит ссылки только своих клиентов
- Фича/экран: D-07, F-44 (migration 20261029120000_a_rep_mints_a_join_link)
- Тикеты: 70e6681158ee149582a6af81 #a6af81
- Роль/аккаунт: rep «testtest» (REST от его сессии); admin — найти чужого клиента
- Устройство: desktop
- Тип: негатив / безопасность
- Предусловия: есть клиент, не закреплённый за testtest.
## Шаги
1. admin: id клиента, у которого `sales_rep_id` пуст или ≠ testtest.
2. rep: `POST /rest/v1/customer_invites` { distributor_id, customer_id: чужой, token: uuid, email: null, expires_at: +7 дней }.
3. rep: `GET customer_invites?select=customer_id` и `GET customers?select=id`.
## Ожидаемо
2. HTTP 403, `code` 42501 (комментарий программиста: «נציג יכול ליצור… קישורים רק ללקוחות שלו»).
3. Все customer_id из ответа — среди своих клиентов.
- Отзыв ссылки у נציג не проверяется (в UI его нет; «ביטול» — только у מפיץ).
## История
- 2026-10-29 · ✅ · #a6af81 (C2: REST 403); автотест `rep-join-link.spec.ts` — прогон 29.10 ✅.
