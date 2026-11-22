<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: Изоляция семей и журнал отказов (#25b101)

Источник: `.qa/tests/authz-isolation.md` (AZ-01…AZ-07), бриф `.qa/research/25b101.md` (повторная проверка 05.11), доказательства `.qa/research/25b101/r5-*.json`. Пользователь провёл `עבר QA` 05.11 (staging https://benjico.expo.app).
AC тикета: «1. אימות מוצלח לבדו אינו מעניק גישה לנתונים; 2. דחיית הרשאה אינה חושפת מידע מהמשאב המוגן; 3. ילד אינו יכול לעבור לאזור הורה או מפעיל ללא פעולה מאשרת; 4. שינוי הרשאה חל על בקשות חדשות…». Комментарий программиста 04.11 (миграция 0037): «отказ start_child_session (ребёнок другой семьи …) пишется в authz_audit: action=authz_denied, operation=start_child_session, target_id, allowed=false, без содержимого ребёнка; ответ 403».
Роли и данные:
- `parent` (`.qa/auth/parent.json`) — семья A, **оператор** (читает `authz_audit`), PIN не задан; ребёнок **QA-R2-1** `b9ef1552-4cc7-4d72-a9c3-d02d66d19af1` (НЕ удалять).
- `parent-b` (`.qa/auth/parent-b.json`) — семья B, uid `d5be95c9-d860-4cf4-8c77-c128013ed47c`, ребёнок **QA-B1** `d956324c-5d7c-4837-b9da-324f69570be2`, PIN задан.
- гость (только публичный apikey).

**API.** Заголовки Supabase (apikey, authorization) снимаются с запроса самого приложения (`captureSupabase` из `tests/session-auth/session-auth.helpers.ts`), паролей и ключей в коде нет. `p_device_id` для start_child_session — из собственного запроса приложения при передаче своего ребёнка. Без `waitForTimeout`/`networkidle`; появление строки журнала — `expect.poll`.
**Безопасность данных.** Чужие записи только читаются; PATCH — тем же значением имени («QA-B1»); INSERT — с именем `QA-AUTO-<6 букв>` (если вдруг пройдёт — тест падает и пишет `cleanup` в annotations). DELETE не выполняется. **Режим ребёнка (с 08.11, #8ca267):** `parent.json` / `parent-b.json` в режим ребёнка не переводятся никогда (режим на сервере «запирает» файл входа; удаление `benjico\child-context` больше не выводит).
**Кто пишет.** 1.1 и 1.2 — две роли одновременно → тесты записал `autotest-writer` (`tests/authz-isolation/*.spec.ts`, `asUser` из `fixtures.ts`), генератору не передаются. 2.1 и 2.2 — одна роль → официальный `playwright-test-generator`. Раздел 3 — только вручную.
Пометки: без `@prod-safe` (передача ребёнка / попытка INSERT), без `@data` (данные общего аккаунта не меняются; строки журнала — побочный след).

---

### 1. Изоляция семей — две роли (autotest-writer)

#### 1.1 Чужой ребёнок в start_child_session → 403 как у несуществующего; оператор видит authz_denied без данных ребёнка; родитель B журнал не читает @desktop #25b101
**Device:** desktop
**Users:** parent-b, parent
**File:** `tests/authz-isolation/start-child-session-denied-audit.spec.ts` (AZ-01)
**Steps:**
1. Окно parent-b: `/children`, снять заголовки; `/children/<QA-B1>/handover` → «QA-B1, בואו נתחיל!», но запрос приложения `rpc/start_child_session` **перехватить и оборвать** (`page.route` → `route.abort()`): `p_device_id` взять из его тела, на сервер он не уходит → `parent-b.json` не входит в режим ребёнка. Отказы 403 (чужой / несуществующий ребёнок) детскую сессию не открывают.
2. Токеном parent-b: POST `rpc/start_child_session` {p_child_id: QA-R2-1, p_device_id}; затем то же с несуществующим id `00000000-dead-4bee-8000-<12 hex>`. Запомнить время сервера (заголовок Date) минус 5 с.
3. Токеном parent-b: GET `authz_audit?target_id=eq.<QA-R2-1>`.
4. Окно parent (оператор): GET `authz_audit?action=eq.authz_denied&operation=eq.start_child_session&target_id=eq.<QA-R2-1>&user_id=eq.<uid parent-b>&created_at=gte.<время>` — опрашивать, пока не появится строка.
**Expected:**
- Шаг 2: оба ответа `403`, код и тело для чужого id **совпадают** с несуществующим; в теле нет «QA-R2-1», `nickname`, `birth_year` (AC2; комментарий 04.11 «ответ 403»).
- Шаг 3: строк журнала нет (`200 []` или 401/403) — журнал читает только оператор.
- Шаг 4: ≥1 строка; `allowed=false`, `target_type=child`; в строке нет «QA-R2-1», `nickname`, `birth_year` (комментарий 04.11: «без содержимого ребёнка»; תיאור «רישום החלטות הרשאה רגישות»).

#### 1.2 REST к чужим детям в обе стороны = пусто/403 как у несуществующего; запись в чужую семью отклонена @desktop #25b101
**Device:** desktop
**Users:** parent, parent-b
**File:** `tests/authz-isolation/cross-family-rest.spec.ts` (AZ-02, AZ-03)
**Steps:**
1. Снять заголовки в обоих окнах. Контроль: parent-b видит QA-B1 (`children?id=eq.<QA-B1>`, 1 строка, + `family_id`), parent видит QA-R2-1.
2. Токеном parent для QA-B1 и для `00000000-0000-4000-8000-0000deadbeef`: GET `children`, `reading_attempts`, `writing_attempts`, `skill_levels` (фильтр по id / child_id), POST `rpc/child_profile`, `rpc/current_levels` (`p_child_id`). GET `children` без фильтра.
3. Токеном parent-b для QA-R2-1 и несуществующего: GET `reading_attempts`, `skill_levels` (в SA-04 этих таблиц нет).
4. Токеном parent: PATCH `children?id=eq.<QA-B1>` {nickname: "QA-B1"} (`Prefer: return=representation`); POST `children` {nickname: `QA-AUTO-…`, birth_year: 2018, family_id: <семья B>}.
**Expected:**
- Шаг 1: владельцы видят своих детей (иначе проверка пустая — тест падает).
- Шаги 2–3: для чужого id код и тело совпадают с несуществующим; ответ `200 []` или `403`; имени чужого ребёнка в теле нет (AC1, AC2). `children` без фильтра у parent не содержит id QA-B1.
- Шаг 4: PATCH → `200 []` (0 строк) или 401/403/404; INSERT → `403` (AC2 + F-09 «כל פעולה רגישה בודקת…»; регресс 02.11: «PATCH/DELETE чужого 0 строк, INSERT 403»).

### 2. Без входа и режим ребёнка — одна роль (playwright-test-generator)

#### 2.1 Без входа (только apikey): start_child_session, authz_audit, children → 401 @desktop @prod-safe #25b101
**Seed:** `tests/seed.parent-b.spec.ts` (только чтобы взять публичный apikey из запроса приложения)
**Device:** desktop
**Users:** anon
**Steps:**
1. Открыть `/children`, взять заголовок `apikey` из запроса приложения к `/rest/v1/` (authorization не брать).
2. Только с `apikey` (без `authorization`): POST `/rest/v1/rpc/start_child_session` {p_child_id: QA-B1, p_device_id: любой UUID}; GET `/rest/v1/authz_audit?select=*&limit=1`; GET `/rest/v1/children?select=id,nickname`.
**Expected:**
- Каждый ответ `401` и без строк данных (в теле нет «QA-B1», `nickname`, `target_id`) (AC1 «אימות מוצלח לבדו אינו מעניק גישה» — тем более без входа; комментарий программиста: «все RPC закрыты для неавторизованного»). Дополняет SA-06 (другие RPC).

#### 2.2 Режим ребёнка в семье без PIN: «הורים» → «אימות זהות», зона родителя закрыта @desktop #25b101
**⚠ С 08.11 (#8ca267):** вход в режим ребёнка с `parent.json` запрещён. Если записывать — только на слоте `parent-r21-auto` (QA-R2-1, seed `tests/seed.parent-r21-auto.spec.ts`, `goChildHome`/`saveSlot`, `@data`); шаг «Очистка `benjico\child-context`» не делается. Тест пока не записан.
**Seed:** `tests/seed.parent.spec.ts`
**Device:** desktop
**Users:** parent
**Steps:**
1. Предусловие: POST `rpc/has_gate_pin` токеном parent из запроса приложения → `false`. Если `true` — тест падает с сообщением «у семьи A появился PIN — данные изменились, тест про семью без PIN».
2. `/children/b9ef1552-4cc7-4d72-a9c3-d02d66d19af1/handover` → «QA-R2-1, בואו נתחיל!» → `/b9ef1552-…/home`.
3. Нажать «הורים».
4. Очистка: удалить `benjico\child-context` из localStorage, проверить, что ключа нет. Пароль не вводить.
**Expected:**
- После 3: видно окно «אימות זהות» с полем пароля (`input[type=password]`); клавиатуры PIN нет («הזינו את קוד ההורים בן 4 הספרות» отсутствует) (AC3 «ללא פעולה מאשרת»; бриф 05.11 П4: «семья без PIN → пароль аккаунта»).
- Зона родителя не видна: «יציאה מהחשבון», «קוד הורים (PIN)», «מחיקת כל נתוני המשפחה», «אמצעי תשלום», «מי מתרגל היום?» отсутствуют.

### 3. Только вручную (manual) — кода нет

#### 3.1 AZ-06 Снятие и возврат роли оператора тем же токеном — manual, только с программистом #25b101
Причина: роль снимает/возвращает программист SQL-запросом в облаке Supabase (комментарий 04.11: «сделаем вместе с QA … согласуйте время»); у автотестов нет и не должно быть прав менять роли. Проводить только при программисте.
Шаги/ожидаемо: держим один access_token `parent` → до: `authz_audit` строки, `export_gate` 200 → программист снимает роль → тем же токеном `authz_audit` `[]`, `export_gate` 403 → программист возвращает роль → строки снова; в журнале `operator_revoked` и `operator_granted` (05.11: строки 347, 348) (AC4 «שינוי הרשאה חל על בקשות חדשות»).

#### 3.2 AZ-07 Бан тестового аккаунта — manual, только с программистом #25b101
Причина: бан делает программист в Supabase; повторный вход — пароль пользователя. 05.11 пропущено по решению пользователя. Бан — только `parent-b` (не `parent`). Ожидаемо: тем же токеном 401 сразу; после снятия бана — новый вход 200.
