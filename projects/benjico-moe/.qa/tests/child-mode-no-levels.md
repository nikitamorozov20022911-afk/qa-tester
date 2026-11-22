<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Режим ребёнка: в браузер не приходят уровни и заметки родителя (#eb3106)
Источник: бриф `.qa/research/eb3106.md` (раунды 01.11, 05.11 R2, 05.11 R3), доказательства `.qa/research/eb3106/r3-*.json`, итог раунда 3 в `.qa/session.json` («5/5 ✅ десктоп 3/3; допроверка активностей — 58 ответов без чисел/заметок»). Пользователь провёл `עבר QA` 05.11.
«מה רצוי»: «D-02 — לילד לא נחשף מספר רמה; במצב ילד לא להחזיר רמות מספריות והערות הורה (לפחות לא של ילדים אחרים).» AC тикета пустые. D-02: «הרמה … נחשפת להורה ולמפעיל בלבד».
Реджект 2 (rej_3680ce34…): при «<имя>, בואו נתחיל!» `rpc/current_levels` уходил без `x-child-session` с числами. Фикс 05.11: current_levels — **после** `start_child_session` и **с** `x-child-session` → `level: null, scale_max: null`.
Роли: `parent` (семья A, PIN нет). Постоянные дети QA-R2-1 `b9ef1552-…` (чтение 5/10, письмо 2/4), QA-R2-2 `091cdbdc-…` (сибс) — только просмотр/передача, не менять.

| ID | Кейс | Шаги | Ожидаемо |
|---|---|---|---|
| CM-01 | Передача QA-R2-1: current_levels только после start_child_session и с x-child-session, без чисел | `/children/<QA-R2-1>/handover` → «QA-R2-1, בואו נתחיל!» → дом; запись сети с момента нажатия; ×3 | `start_child_session` 200 → строка session; каждый `rpc/current_levels` после нажатия — с заголовком `x-child-session` = эта session и стартует после ответа start_child_session; в ответе у всех областей `level: null`, `scale_max: null`; адрес `/<id>/home` (реджект 2, коммент. 05.11) |
| CM-02 | Обновление страницы в режиме ребёнка | после CM-01 — F5 на `/<id>/home` | все `current_levels` — с `x-child-session`, `level/scale_max` null; дом открывается |
| CM-03 | Маршрут по «какие области определены», а не по числу | новый QA-AUTO ребёнок (письмо 2, чтение не определено) → передача | `/<id>/assessment/intro` (стартовый тест чтения); QA-R2-1 (обе области) → `/home` (Р2-3) |
| CM-04 | Путь ребёнка без чисел и заметок | QA-AUTO ребёнок (заметки родителя с меткой) → передача → «אחר כך» → дом → «המסלול שלי» → «ספרייה» → отрывок → «תרגול כתיבה» → задание | ни в одном JSON-ответе с `x-child-session`: `"level":<число>`, `"scale_max":<число>`, `estimated_`, `target_level`, `parent_note`, `speech_notes`, `known_difficulties`, текст заметок родителя; экраны открываются (библиотека не пустая, у отрывков/заданий קל/בינוני/מאתגר) (D-02, Т5) |
| CM-05 | Прямые запросы с x-child-session = закрыто | токен parent + `x-child-session` активного QA-R2-1 | `reading_passages`/`writing_tasks` c `level` (select, фильтр, order, `*`) → 403; без `level` → 200; `recommendations`, `placement_attempts`, `children` (`*`, свой, сибс), `skill_levels` → `[]`; `current_levels` свой — null, сибса — `[]`; `child_profile` свой — только id/nickname/birth_year/companion, сибса — 403 `not_authorized`; `next_activity` сибса — 403; `learning_events select=*` → 403 (реджект 1, Т2–Т4) |
| CM-06 | Режим родителя не задет | ~~очистить child-context~~ (с 08.11 не работает) → в отдельном окне `parent` (не в режиме ребёнка) `/children/<QA-R2-1>` | «רמות נוכחיות (להורה בלבד)», «קריאה: N / 10», «כתיבה: N / 4»; `current_levels` без x-child-session — с числами (D-02 «להורה») |

Не автоматизируется / вне объёма: iPhone webkit в раунде 3 не проверен (CM-01 на 390 — вручную при следующем прогоне); токен родителя **без** x-child-session видит уровни — признанное ограничение #25b101; экраны оператора (`ops_reading_passages`) — нет роли. Находка (не этот тикет): `rpc/start_placement` вызывается сам при открытии `/assessment/intro` до «מתחילים!».
Связанные кейсы: `child-handover.md` (CH-02 передача → дом), `session-auth.md` SA-04/SA-06 (чужая семья, anon), `authz-isolation.md`.

## История
- 2026-11-01 · ❌ · #eb3106 (children/current_levels с числами и заметками)
- 2026-11-05 · ❌ · #eb3106 R2 (current_levels без x-child-session при передаче)
- 2026-11-05 · ✅ · #eb3106 R3 (3/3, прямые запросы, режим родителя, 58 ответов пути без чисел)
