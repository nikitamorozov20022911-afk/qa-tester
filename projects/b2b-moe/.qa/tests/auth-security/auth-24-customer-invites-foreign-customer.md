<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# auth-24: customer_invites — нельзя привязать приглашение к клиенту чужого מפיץ
- Фича/экран: API REST customer_invites (вставка / перепривязка)
- Тикеты: #3c03f6
- Роль/аккаунт: dist2 (+ admin для id клиента «test»)
- Устройство: desktop
- Тип: негатив / API
- Предусловия: свой клиент dist2 — архивный QA-AUTO-6aae65-C (cb15460a…); у dist2 приглашений нет
## Шаги
1. dist2: POST customer_invites {distributor_id: свой, customer_id: клиент «test» admin, token, expires_at}.
2. dist2: POST своё приглашение на своего клиента (201) → PATCH customer_id = клиент «test» admin → затем DELETE своего приглашения.
## Ожидаемо
1. 403, code 42501, «FOREIGN_REFERENCE: customer_invites.customer_id points into another business»; строка не создана.
2. PATCH → 403 тот же код; customer_id остался своим; DELETE → 200, приглашения не осталось. (источник: #3c03f6; проверено на сайте 19.11)
## История
- 2026-11-19 · сверка с сайтом при записи (POST own → 201, PATCH 403, DELETE 200, приглашение удалено) · #3c03f6
