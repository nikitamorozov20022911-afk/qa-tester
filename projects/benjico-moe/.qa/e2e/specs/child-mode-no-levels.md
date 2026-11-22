<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: Режим ребёнка без уровней и заметок родителя (#eb3106)

**⚠ Режим ребёнка — только на слотах (решение пользователя 08.11, #8ca267).** Режим ребёнка хранится на сервере и «запирает» файл входа до пароля/PIN; удаление `benjico\child-context` из него **не выводит** и как очистка/выход **не используется** (шаги «Очистка/Очистить `benjico\child-context`» ниже зачёркнуты). `parent.json` в режим ребёнка не переводить никогда. Экраны ребёнка — на слоте этого ребёнка: QA-R2-V → `parent-auto`, QA-R2-1 → `parent-r21-auto` (`goChildHome` + `saveSlot` из `tests/child-slot.helpers.ts`, `@data`); действия родителя — отдельное окно `parent` (две роли — пишет autotest-writer). Для других детей (QA-R2-2 и т.п.) слотов пока нет — сначала завести слот (accounts.json + seed) и попросить пользователя выдать его. Тесты с новым ребёнком QA-AUTO + передачей или с переходом ребёнок → зона родителя в одной сессии — не записывать (пропущено по решению 08.11). Подробно — `specs/child-handover.md`.

Источник: `.qa/tests/child-mode-no-levels.md` (CM-01…CM-06), бриф `.qa/research/eb3106.md` (перепроверка 3), доказательства `.qa/research/eb3106/r3-handover-run1.json`, `r3-handover-QA-Base.json`, `r3-direct-child-session.json`, `r3-parent-mode.json`. Пользователь провёл `עבר QA` 05.11 (staging https://benjico.expo.app).
«מה רצוי»: «לילד לא נחשף מספר רמה; במצב ילד לא להחזיר רמות מספריות והערות הורה». Фикс 05.11 (комментарий программиста): «`rpc/current_levels` теперь отправляется после `start_child_session` и с `x-child-session` → `level: null, scale_max: null`».
Роли и данные:
- `parent` (`.qa/auth/parent.json`) — семья A, PIN не задан. **QA-R2-1** `b9ef1552-4cc7-4d72-a9c3-d02d66d19af1` (уровни есть: чтение 5/10, письмо 2/4), **QA-R2-2** `091cdbdc-551d-4f0a-b817-49f6170310af` (сибс). Постоянные — только передача и просмотр, **не редактировать**, отрывки/задания на них не открывать (создают попытки).
- Новый ребёнок (1.3) — `QA-AUTO-<6 латинских букв>` (`qaChildName()` из `tests/placement-results/placement.helpers.ts`), удаление — пользователь: имя/id в `testInfo.annotations` `cleanup` (`annotateCleanup`).

**Как смотреть сеть.** `page.on('request'/'response')` до нажатия «בואו נתחיל!»; заголовок `x-child-session` — `request.headers()['x-child-session']`; session — тело ответа `rpc/start_child_session` (строка-UUID в кавычках). Прямые запросы (1.4): `apikey`/`authorization` — с запроса самого приложения (`captureSupabase` из `tests/session-auth/session-auth.helpers.ts`), `x-child-session` — из ответа `start_child_session` приложения; паролей и ключей в коде нет.
**Маркеры утечки** (для 1.3, по всем JSON-ответам на запросы с `x-child-session`): регулярки `/"level"\s*:\s*\d/`, `/"scale_max"\s*:\s*\d/`, подстроки `estimated_`, `target_level`, `parent_note`, `speech_notes`, `known_difficulties`, и метка заметки ребёнка `QA-AUTO-NOTE-<те же 6 букв>`. `"level":null` — допустимо.
**Очистка режима ребёнка:** ~~удалить `benjico\child-context` (`clearChildContext`)~~ — с 08.11 не выводит, `clearChildContext` удалён из helpers; не делается (см. блок вверху). Пароль/PIN не вводить.
Без `waitForTimeout`/`networkidle` — только `expect`, `expect.poll`, `waitForResponse`, `waitForURL`.
Пометки: передача открывает детскую сессию на сервере → без `@prod-safe` (кроме 1.5 — только просмотр); 1.3 создаёт ребёнка → `@data`. Устройство — десктоп (тикет про сеть; iPhone в R3 не проверен — не автоматизируем).
**Кто пишет:** официальный `playwright-test-generator` (все тесты — одна роль).

---

### 1. Режим ребёнка: сеть без чисел уровня и заметок
**Seed:** `tests/seed.parent.spec.ts`

#### 1.1 Передача QA-R2-1: current_levels только после start_child_session, с x-child-session и без чисел (3 раза) @desktop #eb3106
**Device:** desktop
**Users:** parent
**Steps:**
1. Повторить 3 раза: открыть `/children/b9ef1552-4cc7-4d72-a9c3-d02d66d19af1/handover`; начать запись запросов; нажать «QA-R2-1, בואו נתחיל!»; дождаться адреса `/b9ef1552-4cc7-4d72-a9c3-d02d66d19af1/home` и хотя бы одного ответа `rpc/current_levels`; ~~очистить `benjico\child-context`~~ (с 08.11 не делается; на слоте `parent-r21-auto` повтор — через `goChildHome`, без новой передачи).
**Expected:**
- Каждый раз: ответ `POST /rest/v1/rpc/start_child_session` — 200, тело — UUID session (r3-handover-run1: `"356d3d02-…"`).
- Каждый `POST /rest/v1/rpc/current_levels` после нажатия: заголовок `x-child-session` = этой session; запрос начат **после** ответа start_child_session; в ответе у каждой области `level === null` и `scale_max === null` (реджект 2 «מצב רצוי»; комментарий 05.11). Нет ни одного `current_levels` без заголовка после нажатия.
- Адрес `/b9ef1552-…/home`, виден текст «צהריים טובים, QA-R2-1!» или иное приветствие с «QA-R2-1» (шаблон `/QA-R2-1!/`) — маршрут в дом не сломан (Р2-3: обе области определены → дом).

#### 1.2 Обновление страницы в режиме ребёнка: current_levels по-прежнему с x-child-session и null @desktop #eb3106
**Device:** desktop
**Users:** parent
**Steps:**
1. Передача QA-R2-1 как в 1.1 → `/b9ef1552-…/home`.
2. Начать запись запросов; `page.reload()`; дождаться видимого «QA-R2-1» в приветствии.
3. ~~Очистка `benjico\child-context`~~ — не делается с 08.11.
**Expected:**
- После reload каждый `rpc/current_levels` — с заголовком `x-child-session`, в ответе `level`/`scale_max` = null (Р2-2 «холодная загрузка/обновление»).
- Остаёмся на `/b9ef1552-…/home`.

#### 1.3 Новый ребёнок: маршрут в стартовый тест; путь ребёнка (дом → המסלול שלי → ספרייה → отрывок → письмо) без чисел и заметок @desktop @data #eb3106
**Device:** desktop
**Users:** parent
**Steps:**
1. Создать ребёнка на `/children/new`: «שם או כינוי» = `QA-AUTO-<6 букв>`, «שנת לידה» = текущий год − 9, «רמת קריאה משוערת» не заполнять, «רמת כתיבה להתחלה» = «רמה 2 · אותיות ומילים קצרות», «מאפייני דיבור והגייה» = `QA-AUTO-NOTE-<6 букв>`, «קשיים ידועים» = `QA-AUTO-NOTE-<6 букв>`, «הערה חופשית» = `QA-AUTO-NOTE-<6 букв>` → «המשך». Id — из ответа `POST /rest/v1/children` или адреса; записать `cleanup`.
2. Начать запись всех ответов. `/children/<id>/handover` → «<имя>, בואו נתחיל!».
3. На `/<id>/assessment/intro` нажать «אחר כך» → `/<id>/home`.
4. Нажать «המסלול שלי» → дождаться экрана; «ספרייה» → дождаться списка отрывков → открыть первый отрывок → дождаться экрана чтения.
5. «בית» → «תרגול כתיבה» → `/<id>/writing/pick` → открыть первое задание → дождаться поля письма / «הקלדה».
6. ~~Очистка `benjico\child-context`~~ — не делается с 08.11.
**Expected:**
- После 2: адрес `/<id>/assessment/intro` (чтение не определено → стартовый тест; Р2-3), `current_levels` с `x-child-session`, у всех областей `level`/`scale_max` null.
- По всем JSON-ответам на запросы с `x-child-session` за шаги 2–5: нет ни одного маркера утечки (см. выше; «מה רצוי», D-02; R3 «58 ответов без чисел/заметок»). Ответ `children` в режиме ребёнка — `[]`.
- Экраны работают: в библиотеке ≥1 отрывок, у карточек есть одна из меток «קל» / «בינוני» / «מאתגר»; на `/writing/pick` ≥1 задание с меткой сложности (С1 — 403 на `level` не ломает экраны).

#### 1.4 Прямые запросы с x-child-session: уровни — 403, таблицы — пусто, сибс — закрыт @desktop #eb3106
**Device:** desktop
**Users:** parent
**Steps:**
1. `captureSupabase(page, '/children')` → apikey, authorization.
2. Передача QA-R2-1 (1.1) и взять session из ответа `start_child_session` приложения.
3. С `apikey`, `authorization`, `x-child-session: <session>` (через `page.request`), `BASE=<origin из captureSupabase>/rest/v1`:
   - GET `reading_passages?select=id,level&limit=3`, `reading_passages?select=*&limit=2`, `reading_passages?select=id&level=eq.5&limit=3`, `reading_passages?select=id,title&order=level.desc&limit=3`;
   - GET `reading_passages?select=id,title,duration_sec,topic&status=eq.published&limit=3`;
   - GET `writing_tasks?select=id,title,level&limit=3`, `writing_tasks?select=*&limit=2`, `writing_tasks?select=id,title,topic&limit=3`;
   - GET `recommendations?select=*&limit=5`, `placement_attempts?select=*&limit=5`, `children?select=*`, `children?select=*&id=eq.091cdbdc-551d-4f0a-b817-49f6170310af`, `skill_levels?select=*`;
   - POST `rpc/current_levels` `{p_child_id: QA-R2-1}` и `{p_child_id: QA-R2-2}`; POST `rpc/child_profile` с QA-R2-1 и QA-R2-2; POST `rpc/next_activity` `{p_child_id: QA-R2-2}`;
   - GET `learning_events?select=*&child_id=eq.b9ef1552-…&limit=3`.
4. ~~Очистка `benjico\child-context`~~ — не делается с 08.11.
**Expected** (r3-direct-child-session.json; комментарий 04.11 и реджект 1):
- Все запросы `reading_passages` / `writing_tasks`, где есть `level` (в select, фильтре, order или `*`) → **403** (`42501`). Без `level` → 200, массив, в элементах нет ключа `level`.
- `recommendations`, `placement_attempts`, `children` (оба), `skill_levels` → 200 `[]`.
- `current_levels` QA-R2-1 → у всех областей `level`/`scale_max` null; QA-R2-2 → `[]`.
- `child_profile` QA-R2-1 → только ключи `id`, `nickname`, `birth_year`, `companion` (nickname «QA-R2-1»); QA-R2-2 → 403 `not_authorized`. `next_activity` QA-R2-2 → 403.
- `learning_events select=*` → 403.

#### 1.5 Режим родителя не задет: уровни QA-R2-1 видны родителю @desktop @prod-safe #eb3106
**Device:** desktop
**Users:** parent
**Steps:**
1. Убедиться, что `benjico\child-context` нет (удалить, если есть).
2. Открыть `/children/b9ef1552-4cc7-4d72-a9c3-d02d66d19af1`, записывая ответ `rpc/current_levels`.
**Expected:**
- Видны «עריכת פרופיל» и «רמות נוכחיות (להורה בלבד)»; строки по шаблонам `/קריאה:\s*[⁦-⁩]?\d+ \/ 10/` и `/כתיבה:\s*[⁦-⁩]?\d+ \/ 4/` (r3-parent-mode: «קריאה: 5 / 10», «כתיבה: 2 / 4»).
- `current_levels` без `x-child-session`, в ответе `level` — числа (D-02: «נחשפת להורה»).

---

## Обновление 12.11 (после проверки на iPad, build 6; пользователь провёл `עבר QA` 12.11)

**Статус тестов 05.11:**
- 1.1, 1.2, 1.4 — **не генерировать**: передача QA-R2-1 из `parent` переводит основной вход в режим ребёнка (решение 08.11: `parent` — никогда; слот `parent-r21-auto` не выдан; указание 12.11 — только `parent-auto`). Заменены 3.1–3.2 на слоте `parent-auto` (QA-R2-V). Порядок «current_levels только после ответа start_child_session» на слоте не проверить: слот уже в режиме ребёнка, передачи при прогоне нет — остаётся в истории ручных проверок 05.11.
- 1.3 — **не генерировать** (новый ребёнок QA-AUTO + передача; решения 08.11 и 12.11). Заменён 3.1 (путь ребёнка) и 3.3 (метки заметок родителя на QA-R2-V с восстановлением).
- 1.5 — **генерировать** (только просмотр в `parent`, режим родителя, ничего не меняет).
**Уже покрыто** `tests/child-handover/child-mode-consents-family-members-empty.spec.ts` (6.1): в слоте `parent-auto` токеном родителя `children?select=*` → 200 `[]`. Здесь не повторяется.
Слот: `goChildHome` + `saveSlot` (`tests/child-slot.helpers.ts`), пароль/PIN не вводить. Свой ребёнок слота — QA-R2-V `26592b73-eaa6-439f-ab3f-d98a0bd1871b`; сибсы той же семьи — QA-R2-1 `b9ef1552-4cc7-4d72-a9c3-d02d66d19af1`, QA-R2-2 `091cdbdc-551d-4f0a-b817-49f6170310af`.
**Маркеры утечки** — как в разделе выше: `/"level"\s*:\s*\d/`, `/"scale_max"\s*:\s*\d/`, `estimated_`, `target_level`, `parent_note`, `speech_notes`, `known_difficulties` (`"level":null` допустимо).

### 3. Режим ребёнка на слоте parent-auto (QA-R2-V)
**Seed:** `tests/seed.parent-auto.spec.ts`

#### 3.1 Дом (с обновлением) → «המסלול שלי» → список отрывков → список заданий письма: current_levels с x-child-session и null, child_profile без лишних полей, ни одного маркера и ни одного числа уровня на экране @desktop @data #eb3106
**Device:** desktop
**Users:** parent-auto
**Steps:**
1. Записывать все ответы, у запроса которых есть заголовок `x-child-session`, и все запросы `rpc/current_levels` (с заголовками).
2. `goChildHome(page, CHILD_SLOTS['QA-R2-V'])`; затем `page.reload()`; дождаться ответа `rpc/current_levels` и видимой вкладки «בית».
3. Нажать вкладку «המסלול שלי» → дождаться экрана; снять видимый текст страницы.
4. `/26592b73-…/reading/pick` → дождаться списка «סיפורים לקריאה» (отрывок не открывать); снять видимый текст.
5. `/26592b73-…/writing/pick` → дождаться списка заданий (задание не открывать); снять видимый текст.
6. `saveSlot` в `afterEach`.
**Expected:**
- Каждый `POST rpc/current_levels` — с заголовком `x-child-session`; в ответе у каждой области `level === null` и `scale_max === null` (реджект 2 «מצב רצוי»; комментарий 05.11; Р2-2 «обновление»). Ни одного `current_levels` без заголовка.
- Каждый ответ `rpc/child_profile` — только ключи `id`, `nickname`, `birth_year`, `companion` (r3-direct-child-session; «מה רצוי»: без заметок родителя).
- Во всех JSON-ответах шагов 2–5 нет ни одного маркера утечки («מה רצוי»: «במצב ילד לא להחזיר רמות מספריות והערות הורה»; D-02).
- Видимый текст экранов «בית», «המסלול שלי», списков чтения и письма не содержит `/רמה\s*[⁦-⁩]?\d/` и `/\d+\s*\/\s*(10|4)\b/` (D-02 «לילד לא נחשף מספר רמה»; проверка 12.11 на iPad — чисел уровня нет). В списках ≥1 карточка, у карточек есть одна из меток «קל» / «בינוני» / «מאתגר» (экраны работают).

#### 3.2 Прямые запросы с x-child-session слота: уровни — 403, таблицы — пусто, сибсы закрыты @desktop @data #eb3106
**Device:** desktop
**Users:** parent-auto
**Steps:**
1. `goChildHome`; затем `page.reload()` и взять из первого запроса приложения с заголовком `x-child-session` значения `apikey`, `authorization`, `x-child-session` и `BASE = <origin>/rest/v1`.
2. С этими тремя заголовками (`page.request`):
   - GET `reading_passages?select=id,level&limit=3`, `reading_passages?select=*&limit=2`, `reading_passages?select=id&level=eq.5&limit=3`, `reading_passages?select=id,title&order=level.desc&limit=3`;
   - GET `reading_passages?select=id,title,duration_sec,topic&status=eq.published&limit=3`;
   - GET `writing_tasks?select=id,title,level&limit=3`, `writing_tasks?select=*&limit=2`, `writing_tasks?select=id,title,topic&limit=3`;
   - GET `recommendations?select=*&limit=5`, `placement_attempts?select=*&limit=5`, `skill_levels?select=*`, `children?select=*&id=eq.b9ef1552-4cc7-4d72-a9c3-d02d66d19af1`;
   - POST `rpc/current_levels` `{p_child_id: QA-R2-V}`, `{p_child_id: QA-R2-1}`; POST `rpc/child_profile` с QA-R2-V и QA-R2-1; POST `rpc/next_activity` `{p_child_id: QA-R2-2}`;
   - GET `learning_events?select=*&child_id=eq.26592b73-…&limit=3`.
3. `saveSlot` в `afterEach`. Ничего не записывается (только GET и RPC чтения).
**Expected** (r3-direct-child-session.json; реджект 1; комментарий 04.11):
- `reading_passages` / `writing_tasks` с `level` (в select, фильтре, order или `*`) → 403; без `level` → 200, массив, у элементов нет ключа `level`.
- `recommendations`, `placement_attempts`, `skill_levels`, `children` (сибс) → 200 `[]`.
- `current_levels` QA-R2-V → у всех областей `level`/`scale_max` null; QA-R2-1 → `[]`.
- `child_profile` QA-R2-V → только `id`, `nickname`, `birth_year`, `companion` (`nickname` «QA-R2-V»); QA-R2-1 → 403 `not_authorized`. `next_activity` QA-R2-2 → 403.
- `learning_events select=*` → 403.

### 4. Две роли: родитель пишет заметки → ребёнок их не получает; заметки сохраняются (#eb3106 + #f23704)
**Seed:** — (пишет autotest-writer сам: окно `parent` через `asUser('parent')` + окно слота `parent-auto` через `openSlotPage` / `saveSlot`)

#### 4.1 Родитель сохраняет в профиле QA-R2-V метки QA-AUTO в «מאפייני דיבור», «קשיים ידועים», «הערה חופשית», «תחומי עניין», «מטרות» → после перезагрузки они на месте → в режиме ребёнка ни один ответ и ни один экран их не содержит → исходные значения возвращены @desktop @data #eb3106 #f23704
**Device:** desktop
**Users:** parent, parent-auto
**Steps:**
1. Окно `parent` (режим родителя): `/children/26592b73-…` → «עריכת פרופיל»; запомнить исходные значения пяти полей.
2. Заполнить: «מאפייני דיבור והגייה», «קשיים ידועים», «הערה חופשית» = `QA-AUTO-NOTE-<6 букв>-<поле>`; «תחומי עניין», «מטרות» = `QA-AUTO-<6 букв>-<поле>`. «המשך» → дождаться `PATCH /rest/v1/children` 2xx.
3. Окно `parent`: снова `/children/26592b73-…`, `reload` → значения полей.
4. Окно слота `parent-auto`: записывать ответы на запросы с `x-child-session`; `goChildHome` → `reload` → «המסלול שלי» → `/reading/pick` → `/writing/pick` (как 3.1); снять видимый текст каждого экрана.
5. Окно `parent` (в `finally`): вернуть исходные значения пяти полей → «המשך» → `PATCH` 2xx → `reload` → значения = исходные. `saveSlot` окна слота.
**Expected:**
- Шаг 3: все пять полей содержат метки шага 2 (#f23704 AC «שינוי … נשמר בצורה עקיבה»; F-16 AC1–3).
- Шаг 4: ни один JSON-ответ с `x-child-session` и ни один видимый текст экранов ребёнка не содержит `QA-AUTO-NOTE-<6 букв>` и маркеров утечки (#eb3106 «מה רצוי»: «לא להחזיר … הערות הורה»). Метки «תחומי עניין»/«מטרות» в проверке утечки не участвуют (не заметки родителя по «מה רצוי»).
- Шаг 5: значения полей = исходные (данные QA-R2-V не испорчены).
