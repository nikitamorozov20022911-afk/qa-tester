<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# ACL-010: business и user не видят журнал доступа SA и журнал другого бизнеса
- Фича/экран: /admin/access-log; rpc admin_list_access_log; REST audit_log (F-04)
- Тикеты: #6a993d78df85add81c766e3c
- Роль/аккаунт: business (account_manager, testim), user (recruiting_manager, testim); admin — только чтобы узнать id другого бизнеса
- Устройство: desktop 1440×900
- Тип: негатив / безопасность (только чтение, prod-safe)
- Предусловия: есть второй бизнес «QA Test Business A» с записями журнала.
## Шаги
1. admin → rpc admin_list_businesses: id «QA Test Business A».
2. business, затем user → /admin/access-log.
3. Той же сессией: rpc admin_list_access_log {}.
4. user: GET /rest/v1/audit_log?select=id&limit=50.
5. business: GET /rest/v1/audit_log?select=id&business_id=eq.<id бизнеса A>.
## Ожидаемо
- Шаг 2: h1 «אין לך הרשאה למסך הזה», нет h1 «רישום גישה», нет таблицы журнала.
- Шаг 3: 403, «forbidden».
- Шаг 4: 200, [] (0 строк). Шаг 5: 200, [] (источник: req. «משתמש עסקי אינו רואה את רישום הגישה של עסק אחר»; api-1310 п.5–9).
- Не проверяется (вопрос владельцу, session.json deferred_questions): business читает через REST журнал СВОЕГО бизнеса (117 строк, 86 — доступы SA).
## История
- 2026-10-13 · ✅ · #6a993d78df85 (Т6 UI + API); עבר QA
