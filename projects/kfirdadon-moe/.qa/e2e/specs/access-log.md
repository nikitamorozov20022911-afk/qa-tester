<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: журнал доступа Super Admin (/admin/access-log)

> Записано autotest-writer вручную: две роли одновременно (business действует, admin смотрит журнал) — `asUser`.
> Файл: tests/access-log/member-actions-log.spec.ts. Не prod-safe: удаление участника необратимо.
> Предусловие на КАЖДЫЙ прогон: новый расходный участник бизнеса (вступил, активен), email — в .qa/accounts.env
> `QA_SPARE_MEMBER_EMAIL`. Без него тест пропускается с сообщением.

### 1. Журнал доступа — действия над участниками бизнеса
**Seed:** `tests/seed.business.spec.ts` + `tests/seed.admin.spec.ts` (через `asUser`)

#### 1.1 смена прав → блок → разблок → удаление: change_permission, block_user, unblock_user, remove_user @desktop @data (#b0a2952d03da5f3e0446c91a)
**Device:** desktop
**Users:** business, admin
**Steps:**
1. business: /settings/users → строка расходного участника (статус «פעיל»).
2. «הפיכה ל…» (смена прав; кнопка меняется на противоположную).
3. «חסימה» (появляется «ביטול חסימה») → «ביטול חסימה» (снова «חסימה») → «הסרה» (статус «הוסר»). Подтверждение, если появится диалог.
4. admin: /admin/access-log → «משתמש» = исполнитель business, «מתאריך» = сегодня → «סינון».
**Expected:**
- /settings/users: участник «הוסר», кнопок нет, «—» (FL-07).
- rpc/admin_list_access_log (p_actor_id = исполнитель): по target_id участника за прогон — ровно change_permission → block_user → unblock_user → remove_user; бизнес testim (источник: «מה רצוי» — «פעולות נפרדות remove_user ו-unblock_user»).
- В таблице метки «שינוי הרשאה של משתמש», «חסימה של משתמש», «ביטול חסימה של משתמש», «הסרה של משתמש»; сырых ключей нет.
- Очистка: не требуется (участник расходный, удаляется самим тестом).

### 2. Журнал доступа — метки действий на иврите
**Seed:** `tests/seed.admin.spec.ts`

> Записан autotest-writer вручную: проход журнала диапазонами дат со сверкой ответа rpc/admin_list_access_log
> и ячеек «פעולה». Файл: tests/access-log/no-raw-action-keys.spec.ts. Только чтение — @prod-safe.

#### 2.1 ни в одной ячейке «פעולה» нет латиницы/snake_case; regression_probe, create_simulation_from_template, set_simulation_status — ивритские метки @desktop @prod-safe (#132e12a27c52a9d24f10208d)
**Device:** desktop
**Users:** admin
**Steps:**
1. /admin/access-log (h1 «רישום גישה»).
2. «מתאריך» (#access-log-from) / «עד תאריך» (#access-log-to) по 7 дней с 20.9.2026 до сегодня → «סינון»; если ответ упёрся в лимит — тот же отрезок по дням.
3. Для каждого фильтра: строк таблицы = entries ответа; собрать тексты колонки «פעולה».
**Expected:**
- Ни в одной ячейке «פעולה» нет [A-Za-z_] (источник: «מה רצוי» — «כל פעולה ברישום הגישה מוצגת בתווית בעברית»).
- Где в ответе есть regression_probe → в ячейках «רשומת בדיקה טכנית» (реджект rej_1791197709589 / комментарий 2026-10-08); create_simulation_from_template → «יצירת סימולציה מתבנית»; set_simulation_status → «שינוי סטטוס סימולציה» (AC тикета); все три ключа встретились за проход (журнал неизменяем).

### 3. Журнал доступа — причина доступа SA к контенту кандидата
**Seed:** `tests/seed.admin.spec.ts`

> Источник: кейсы ACL-003…ACL-007, тикет F-04 (#6a993d78df85add81c766e3c, עבר QA 13.10.2026). Для `playwright-test-generator`.
> Причины (закрытый список): support «תמיכה תפעולית», quality_assurance «בקרת איכות», authorized_handling «טיפול מורשה».
> Строка S-02: `[data-testid="support-row"]` (атрибуты data-candidate-id, data-report-status), меню строки `[data-testid="row-menu"]`.

#### 3.1 прямой адрес отчёта без причины / с причиной вне списка — «נדרשת סיבת גישה», контент не загружается @desktop @prod-safe (#6a993d78df85add81c766e3c)
**Device:** desktop
**Users:** admin
**Steps:**
1. /admin/support → data-candidate-id первой строки `support-row`, в меню которой есть «צפייה בתוכן».
2. Открыть /admin/support/candidates/<id>/report.
3. Открыть /admin/support/candidates/<id>/report?reason=foo.
**Expected:**
- Оба раза: заголовок «נדרשת סיבת גישה», текст «צפייה בתוכן של מועמד מחייבת סיבה מהרשימה הסגורה», ссылка «חזרה לתמיכה ותפעול» → /admin/support (AC1).
- Нет `[data-testid="attempt-view"]`; запроса rpc/get_candidate_report не было (FL-04 «ניסיון לפתוח תוכן ללא בחירת סיבה נחסם»).

#### 3.2 диалог «צפייה בתוכן»: ровно 3 причины, без выбора — ошибка, «ביטול» не открывает контент и не пишет в журнал @desktop @prod-safe (#6a993d78df85add81c766e3c)
**Device:** desktop
**Users:** admin
**Steps:**
1. /admin/access-log → «מזהה מועמד» = id кандидата из строки `support-row` → «סינון»; запомнить «נמצאו N רשומות».
2. /admin/support → меню этой строки → «צפייה בתוכן».
3. Список «סיבת הגישה» — прочитать варианты.
4. Не выбирая причину, «צפייה בתוכן».
5. «ביטול».
6. Повторить шаг 1.
**Expected:**
- Диалог «לפתוח את התוכן של <имя>?»; варианты ровно «בחירת סיבה», «תמיכה תפעולית», «בקרת איכות», «טיפול מורשה» (req. «רשימה סגורה», FL-04).
- Шаг 4: «יש לבחור את סיבת הגישה לתוכן», адрес /admin/support.
- Шаг 5: диалог закрыт, адрес /admin/support. Шаг 6: N не изменилось (AC2 — запись только при показе контента).

#### 3.3 причина «תמיכה תפעולית» открывает отчёт, в журнале запись: кто, кандидат, тип контента, причина, время @desktop (#6a993d78df85add81c766e3c)
**Device:** desktop
**Users:** admin
**Steps:**
1. /admin/support → строка `support-row` с data-report-status="ready" → меню → «צפייה בתוכן».
2. «סיבת הגישה» = «תמיכה תפעולית» → «צפייה בתוכן».
3. /admin/access-log → «מזהה מועמד» = id, «מתאריך» = «עד תאריך» = сегодня → «סינון».
**Expected:**
- URL /admin/support/candidates/<id>/report?reason=support; видно `[data-testid="attempt-view"]`; шапка «צפייה בתוכן לצורך תמיכה תפעולית · הצפייה נרשמת ביומן הגישה» (AC1).
- Первая строка журнала: «פעולה» = «צפייה בתוכן מועמד»; «תוכן וסיבה» содержит «דוח · תמיכה תפעולית»; «משתמש» — admin; «מועמד» = id; «מועד» — сегодня (AC2).
- Очистка: невозможна по требованию (журнал неизменяем, AC5); тест не prod-safe.

#### 3.4 технический статус на S-02 — без причины и без содержимого разговора @desktop @prod-safe (#6a993d78df85add81c766e3c)
**Device:** desktop
**Users:** admin
**Steps:**
1. /admin/support.
**Expected:**
- Столбцы «בית עסק», «מועמד/ת», «ניסיון», «תמלול», «דוח», «קישור», «עדכון אחרון»; строки `support-row` видны без диалога причины.
- Нет `[data-testid="attempt-view"]`, плеера, текста транскрипта; не вызывались rpc/get_candidate_report и functions/get-recording-url (FL-04 «ללא תוכן שיחה ואינו דורש סיבת גישה כלל»).

#### 3.5 фильтры журнала: кандидат, пользователь, даты; пустой результат; ошибки ввода @desktop @prod-safe (#6a993d78df85add81c766e3c)
**Device:** desktop
**Users:** admin
**Steps:**
1. /admin/access-log (h1 «רישום גישה»).
2. В строке с кандидатом «כל הגישות».
3. «ניקוי הסינון»; «משתמש» (#access-log-actor) = первый пользователь → «סינון».
4. «ניקוי הסינון»; «מתאריך» (#access-log-from) = «עד תאריך» (#access-log-to) = дата первой строки → «סינון».
5. Обе даты 2099-01-01 → «סינון».
6. «מתאריך» 2026-10-10, «עד תאריך» 2026-10-01 → «סינון».
7. «ניקוי הסינון»; «מזהה מועמד» (#access-log-candidate) = «abc» → «סינון».
**Expected:**
- Шаг 2: поле «מזהה מועמד» = id; все ячейки «מועמד» = id (AC3).
- Шаг 3: все entries ответа rpc/admin_list_access_log с actor_id выбранного (AC3).
- Шаг 4: все occurred_at — в выбранный день (AC3).
- Шаг 5: «לא נמצאו רשומות גישה» + «אפשר להרחיב את טווח התאריכים» (FL-04).
- Шаг 6: «תאריך הסיום חייב להיות אחרי תאריך ההתחלה». Шаг 7: «יש להזין מזהה מועמד מלא, כפי שהוא מופיע ברשומה».

### 4. Журнал доступа — неизменяемость и доступ ролей
**Seed:** `tests/seed.admin.spec.ts` / `tests/seed.business.spec.ts` / `tests/seed.user.spec.ts` (через `asUser`)

> Записаны autotest-writer вручную: проверки через REST/RPC тем же токеном сессии (`tests/support/api.ts`) и несколько ролей (`asUser`).
> Кейсы ACL-008…ACL-010. Файлы: tests/access-log/log-immutable.spec.ts, tests/access-log/business-report-without-reason.spec.ts, tests/access-log/log-hidden-from-business-user.spec.ts.

#### 4.1 журнал неизменяем: в UI нет правки/удаления, PATCH/DELETE audit_log → 403 42501, запись не изменилась @desktop (#6a993d78df85add81c766e3c)
**Device:** desktop
**Users:** admin
**Steps:**
1. /admin/access-log.
2. GET audit_log своей последней записи (снимок).
3. PATCH этой записи `{reason: <то же значение>}`; DELETE `id=eq.00000000-0000-0000-0000-000000000000` (безвредно даже при сбое защиты).
4. GET записи.
**Expected:**
- «הרישום אינו ניתן לעריכה או למחיקה»; в таблице кнопки только «כל הגישות».
- PATCH и DELETE → 403, 42501 (AC5). Запись после == до.

#### 4.2 бизнес открывает отчёт своего кандидата без причины; user — только назначенного @desktop @prod-safe (#6a993d78df85add81c766e3c)
**Device:** desktop
**Users:** business, user
**Steps:**
1. business: list_candidates → кандидат с готовым отчётом, не назначенный user (по list_candidates user).
2. business: /candidates/<id>/report. 3. user: свой назначенный /candidates/<id>/report. 4. user: /candidates/<id шага 1>/report.
**Expected:**
- Шаги 2–3: `attempt-view`, нет «נדרשת סיבת גישה», шапка «דוח תצפית על השיחה הרשמית», get_candidate_report с p_reason=null (AC4).
- Шаг 4: «המועמד לא נמצא», контента нет (AC4 — в границах прав).

#### 4.3 business и user: /admin/access-log — «אין לך הרשאה למסך הזה», RPC 403, чужой журнал — 0 строк @desktop @prod-safe (#6a993d78df85add81c766e3c)
**Device:** desktop
**Users:** admin, business, user
**Steps:**
1. admin: admin_list_businesses → id «QA Test Business A».
2. business/user: /admin/access-log; rpc admin_list_access_log.
3. user: GET audit_log. business: GET audit_log?business_id=eq.<A>.
**Expected:**
- h1 «אין לך הרשאה למסך הזה», нет «רישום גישה»; RPC 403 «forbidden».
- user: []; business по бизнесу A: [] (req. «משתמש עסקי אינו רואה את רישום הגישה של עסק אחר»).
- Не проверяется (вопрос владельцу): business читает audit_log своего бизнеса через REST.

### 5. Журнал доступа — исполнитель удаления «ניקוי 90 יום» (#79f484) (записано autotest-writer вручную)
**Seed:** `tests/seed.admin.spec.ts`

> Тикет #79f484 (045c8f36802b8c7e6179f484) — עבר QA 04.11.2026. Только чтение: сама «ניקוי 90 יום» не запускается
> (необратимое удаление попытки). Записи до фикса (напр. QA-8eb9d8-2110, 21.10 — «מערכת · ניקוי אוטומטי») — история
> (решение пользователя 04.11), не проверяются. AC1 (причина в «מסלול ביקורת» попытки) — только вручную: нужна новая чистка.
> Файл: tests/access-log/purge-actor-79f484.spec.ts.

#### 5.1 строки «מחיקה בניקוי 90 יום» с 04.11.2026 подписаны исполнителем, не «משתמש לא ידוע» @desktop @prod-safe (#79f484 · #045c8f36802b8c7e6179f484)
**Device:** desktop
**Users:** admin
**Steps:**
1. /admin/access-log (h1 «רישום גישה»).
2. По каждому дню с 2026-11-04 до сегодня: «מתאריך» = «עד תאריך» = день → «סינון».
3. Собрать строки, где «פעולה» = «מחיקה בניקוי 90 יום», и их «משתמש».
**Expected:**
- Строк таблицы = entries ответа rpc/admin_list_access_log; строк «מחיקה בניקוי 90 יום» ≥ 1 (ручная чистка QA-C7-2110-D3 04.11 16:21; журнал неизменяем).
- Ни в одной «משתמש» нет «משתמש לא ידוע» и не пусто (источник: «מה רצוי» 2 — «מיוחסת למי שהפעיל אותה (או ל"מערכת" במחיקה אוטומטית)»).
- За 04.11 есть строка с «מנהל מערכת» (Super Admin, проверка 04.11: «מנהל מערכת · מנהל/ת מערכת»).
