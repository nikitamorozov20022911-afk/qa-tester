<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Изоляция семей и журнал отказов (#25b101)
Источник: бриф `.qa/research/25b101.md` (раунды 28.10–05.11, миграция 0037), доказательства `.qa/research/25b101/r5-*.json`, отчёт 05.11: «П1 журнал ✅, П3 Gate ✅, П4 изоляция ✅, П2 снятие/возврат оператора на том же токене ✅ (operator_revoked 347, operator_granted 348)». Пользователь провёл `עבר QA` 05.11.
AC: «1. אימות מוצלח לבדו אינו מעניק גישה לנתונים; 2. דחיית הרשאה אינה חושפת מידע מהמשאב המוגן; 3. ילד אינו יכול לעבור לאזור הורה או מפעיל ללא פעולה מאשרת; 4. שינוי הרשאה חל על בקשות חדשות ומבטל גישה שאינה תקפה». תיאור: «רישום החלטות הרשאה רגישות».
Роли: `parent` — семья A, **оператор** (читает `authz_audit`), дети QA-R2-1 `b9ef1552-…`; `parent-b` — семья B (uid `d5be95c9-d860-4cf4-8c77-c128013ed47c`), ребёнок QA-B1 `d956324c-…`, PIN задан; гость.

| ID | Кейс | Шаги | Ожидаемо |
|---|---|---|---|
| AZ-01 | Чужой ребёнок в start_child_session → 403 и запись в журнале | parent-b: POST rpc/start_child_session {p_child_id: QA-R2-1, свой p_device_id}; то же с несуществующим id; parent (оператор): GET authz_audit | 403 без данных ребёнка, ответ = ответу на несуществующий; у оператора строка action=authz_denied, operation=start_child_session, target_id=QA-R2-1, allowed=false, user_id=parent-b, без имени ребёнка; parent-b журнал не читает |
| AZ-02 | Чтение чужих детей по REST = пусто/403 | parent → QA-B1: children, reading_attempts, writing_attempts, skill_levels, rpc child_profile/current_levels; parent-b → QA-R2-1: reading_attempts, skill_levels; контроль — владелец видит своего | ответы как на несуществующий id ([] или 403), имени нет; владелец видит строку |
| AZ-03 | Запись в чужую семью | parent: PATCH children QA-B1 (то же имя), INSERT children с family_id семьи B (`QA-AUTO-…`) | PATCH → 0 строк; INSERT → 403 |
| AZ-04 | Без входа → 401 | только apikey: rpc/start_child_session, authz_audit, children | 401 на каждый, без строк |
| AZ-05 | Режим ребёнка, семья без PIN: «הורים» → «אימות זהות» | parent: has_gate_pin=false; режим QA-R2-1 → «הורים» (пароль не вводить) | окно «אימות זהות» с полем пароля, клавиатуры нет, зона родителя скрыта |
| AZ-06 | Снятие/возврат роли оператора тем же токеном — **вручную, только с программистом** | программист: delete/insert operators (SQL в облаке); QA: тот же access_token → authz_audit, export_gate | после снятия authz_audit [] и export_gate 403; после возврата — строки; в журнале operator_revoked и operator_granted |
| AZ-07 | Бан тестового аккаунта — **вручную, с программистом** | бан parent-b тем же токеном → разбан | 401 → после разбана новый вход 200 (05.11 пропущено по решению пользователя) |

Регресс уже в `session-auth.md`: SA-04 (parent-b → дети семьи A: children, writing_attempts, current_levels, child_profile, next_activity), SA-06 (anon: current_levels, child_profile, has_gate_pin, children), SA-07 (режим ребёнка → гейт). AZ-02/AZ-04 дополняют их другими таблицами/RPC и обратным направлением.
Известное ограничение (принято 05.11): отказы, кроме start_child_session, пишутся только в лог Postgres; PATCH чужого ребёнка фильтруется RLS (0 строк) без события — в автотестах не проверяется.
