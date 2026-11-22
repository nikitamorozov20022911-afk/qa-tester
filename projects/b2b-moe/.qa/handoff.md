# Handoff · b2b-moe (באנגו דלי — B2B) · 2026-11-19

Статус: завершено — открытых дел нет

## Где мы
- /qa «בבדיקות»: 11 → 0. Все 11 прошли и проведены пользователем: #787114 #35cb11 #adfbdf #a597e8 #de732f #b75d3b #61c0f4 #255bc0 #6aae65 #c3fdb1 #834c8e.
- Журнал: session.json. Брифы research/<hash>.md, скриншоты screenshots/<hash>-*.
- Новый аккаунт dist2 (второй מפיץ, бизнес «test») — auth/dist2.json, accounts.json.

## Автотесты (записаны, НЕ прогонялись — /qa-regress)
- 11 тикетов сессии: 54 теста; backfill новые: #5e97b8 (orders/receipt-on-approve, 6), #3c03f6 (auth-security/multi-distributor-isolation, 5), #746c35 (ui-general/ai-balance-error +1).
- Непроверенные допущения: имена аргументов RPC (create_customer_order p_customer), колонки tax_id/order_notes/order_receipts, селекторы печати. Конфиг без проекта data — сделать шаг 0 /qa-regress.
- ledger.json: все 35 тикетов записаны (279).

## Находки (не заведены)
- create_walkin_order с чужим клиентом и пустым p_items → 400 EMPTY_ORDER (create_customer_order → 403).
- Поле ח.פ.: буквы вводятся, ошибка только при сохранении.
- «רישום ההזמנה · 0 שורות» во время проверки — не подтверждено (пользователь: не открывать).

## Тестовые данные — см. context.md «Тестовые данные для чистки» (2026-11-19).

## Следующий шаг
- /qa-regress — по команде пользователя (19.11: «не сейчас»). Сначала шаг 0 (проект data в playwright.config.ts).
