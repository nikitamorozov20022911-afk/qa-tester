# План автотестов: אבטחה — הרשאות כתיבה ב-DB (REVOKE)

Источник: кейсы `.qa/tests/security/SEC-001…003`, тикет #6a9e9592f020cfee7fb9cb5e (проверен 08.10.2026; логика — revoke-check.mjs / revoke-check2.mjs).
**Тест написан вручную** (API, не браузерный сценарий — официальному генератору не передаётся): `tests/security/revoke.spec.ts`.
Без UI: страница `/wallet` открывается только чтобы взять `apikey` и `authorization` из первого запроса к `/rest/v1/`. Ничего не создаётся и не меняется: PATCH пишет текущие значения, INSERT — с несуществующими FK, UPDATE/DELETE — по несуществующему id → `@desktop @prod-safe`.

### 1. הרשאות כתיבה ב-PostgREST
**Seed:** `tests/seed.client.spec.ts`

#### 1.1 client: עמודות מוגנות ב-wallets/deals/users — PATCH → 403 @desktop @prod-safe (#6a9e9592)
**Device:** desktop
**Users:** client
**Steps:** GET свой кошелёк/сделку/users; PATCH текущими значениями `wallets.available_balance/escrow_balance/awaiting_release_balance`, `deals.money_state/cancellation_requested_by/payer_id/payee_id`, `users.kyc_status/phone`; повторный GET кошелька.
**Expected:** каждый ответ 403 + код 42501; баланс без изменений (AC 1, 2, 3, 4).

#### 1.2 client: INSERT deals עם money_state / cancellation_requested_by → 403 @desktop @prod-safe (#6a9e9592)
**Device:** desktop
**Users:** client
**Steps:** POST `deals` с `money_state` и отдельно с `cancellation_requested_by`, payer_id/payee_id — несуществующий uuid.
**Expected:** 403 + 42501 (AC 2).

#### 1.3 client: deal_events / money_movements append-only — INSERT/UPDATE/DELETE → 403 @desktop @prod-safe (#6a9e9592)
**Device:** desktop
**Users:** client
**Steps:** POST/PATCH/DELETE с несуществующим id в обе таблицы.
**Expected:** 6 × 403 + 42501 (AC 6).

#### 1.4 anon: PATCH/INSERT ב-public → 401 @desktop @prod-safe (#6a9e9592)
**Device:** desktop
**Users:** guest (только apikey)
**Steps:** PATCH `wallets`, `deals`, `users` по несуществующему id; POST `deal_events`, `chat_messages`.
**Expected:** 401 + 42501 (AC 5).
