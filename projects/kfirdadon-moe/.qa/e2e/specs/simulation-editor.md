<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: редактор симуляции (S-08) — шаг 1 «פרטים כלליים» и шаг 2 «לקוח וחשיפה»

> Записан autotest-writer вручную: проверки ответа RPC (save_simulation, submit_simulation_for_approval, get_candidate_view),
> тело запроса, REST-чтение и подмена генерации AI — генератор такое не записывает.
> Файлы: tests/simulation-editor/general-details-step.spec.ts, tests/simulation-editor/customer-disclosure-step.spec.ts (оба serial).
> Помощники: tests/support/simulation-editor.ts (поля по id `simulation-<поле>`).
> @data: черновики «QA-AUTO-0d5e8a-<stamp>», «QA-AUTO-df30ff-<stamp>», «QA-AUTO-df30ff-<stamp>-ריק» — без удаления (правило проекта 13.10).
> Не утверждается и не активируется ничего (число активных симуляций не меняется); генерация AI на /draft подменена 422;
> /admin/providers и квоты не трогаются. Тесты НЕ запускались (решение пользователя 21.10).

### 1. Редактор симуляции — шаг 1 «פרטים כלליים» (#6a993d77a00f8f2a4a0d5e8a)
**Seed:** `tests/seed.business.spec.ts`

#### 1.1 шаг 1: 10 полей с подсказкой под каждым пустым, 7 мин по умолчанию (5…20), язык заблокирован на иврите @desktop @prod-safe (#6a993d77a00f8f2a4a0d5e8a)
**Device:** desktop
**Users:** business
**Steps:**
1. /simulations/new?start=scratch.
**Expected:**
- У 10 полей (שם הסימולציה … התוצאה הרצויה) — подсказка через aria-describedby (S-08 пустое состояние).
- «משך הסימולציה» = 7, «7 דקות», опции 5…20; подсказка «בין 5 ל-20 דקות. ברירת המחדל היא 7 דקות — המשך המומלץ לפיילוט.» (AC3).
- «שפת הסימולציה» disabled, одна опция he, «נעולה על שפת ברירת המחדל של העסק.» (AC5).

#### 1.2 пустые обязательные поля: переход на шаг 2 закрыт, поля помечены, введённое сохраняется @desktop @prod-safe (#6a993d77a00f8f2a4a0d5e8a)
**Device:** desktop
**Users:** business
**Steps:**
1. Заполнить только «שם הסימולציה», «שם התפקיד» → «הבא: לקוח וחשיפה».
**Expected:**
- «אי אפשר לעבור לשלב 2 — 6 דברים חסרים»; 6 полей aria-invalid + «יש למלא: <поле>»; значения на месте; save_simulation не вызван (AC2).

#### 1.3 «הבא» сохраняет черновик (draft, v1, he, 7 мин) и открывает шаг 2 @desktop @data (#6a993d77a00f8f2a4a0d5e8a)
**Device:** desktop
**Users:** business
**Steps:**
1. Заполнить шаг 1 «QA-AUTO-0d5e8a-<stamp>» → «הבא».
2. Вернуться на шаг 1.
**Expected:**
- save_simulation 200 {status: draft, version: 1}; шаг «לקוח וחשיפה» текущий (AC1); в БД language he, duration 7; значения на месте.

#### 1.4 сервер не принимает язык «en» → 400 language_not_enabled @desktop @data (#6a993d77a00f8f2a4a0d5e8a)
**Device:** desktop
**Users:** business
**Steps:**
1. RPC save_simulation(черновик 1.3, {language: "en"}).
**Expected:**
- 400 language_not_enabled; язык в БД he (AC5).

#### 1.5 правка активной версии: предупреждение и новая черновая версия, активная не меняется @desktop @data (#6a993d77a00f8f2a4a0d5e8a)
**Device:** desktop
**Users:** business
**Steps:**
1. REST: последняя активная симуляция testim с именем «QA…» (нет — skip).
2. Открыть в редакторе; «תנאי סיום» + « QA-AUTO-0d5e8a-<stamp>» → «הבא». Утверждение НЕ выполнять.
**Expected:**
- «עריכה של גרסה פעילה» + «שינוי יישמר כגרסה חדשה בטיוטה…».
- 200: новая версия N+1 draft того же lineage, «נוצרה גרסה N+1 כטיוטה»; или newer_version_exists → «העריכה ממשיכה בטיוטה הקיימת».
- Активная: status active, номер и end_conditions прежние (AC4, треб.6).

#### 1.6 прежняя версия в списке: «הדוחות נשארים משויכים לגרסה N» @desktop @prod-safe (#6a993d77a00f8f2a4a0d5e8a)
**Device:** desktop
**Users:** business
**Steps:**
1. REST: версия previous_version (нет — skip); /simulations.
**Expected:**
- Подпись «הדוחות נשארים משויכים לגרסה N» (AC4).

### 2. Редактор симуляции — шаг 2 «לקוח וחשיפה» (#6a993d767a46a91b6fdf30ff)
**Seed:** `tests/seed.business.spec.ts`

#### 2.1 шаг 2 без пунктов «מוצג מראש»: предупреждение «המועמד יגיע לשיחה בלי שום הקשר» @desktop @data (#6a993d767a46a91b6fdf30ff)
**Device:** desktop
**Users:** business
**Steps:**
1. Шаг 1 «QA-AUTO-df30ff-<stamp>» → «הבא».
**Expected:**
- «עדיין לא נוספו פריטי מידע.»; no-upfront-warning: «…ולכן המועמד יגיע לשיחה בלי שום הקשר.» + «כדאי לסמן לפחות פריט אחד כ«מוצג מראש»…» (реджект R2).

#### 2.2 3 уровня раскрытия; «רק בשאלה» без условия закрывает переход; у «לגלות בשיחה» поля условия нет; предпросмотр — только «מוצג מראש» @desktop @data (#6a993d767a46a91b6fdf30ff)
**Device:** desktop
**Users:** business
**Steps:**
1. /simulations/<id>?step=customer; «מצב הלקוח…», «הצורך…»; «קשר קודם» пусто.
2. 3 пункта: מוצג מראש / לגלות בשיחה / רק בשאלה → «הבא: התנגדות» без условия.
3. Условие «כשהמועמד שואל על תקציב או מסגרת מחיר» → «הבא: התנגדות».
**Expected:**
- 3 радио на пункт; поле условия только у «רק בשאלה» (AC1, AC2).
- Предпросмотр: только пункт 1, «2 פריטים מוסתרים — ייחשפו רק בשיחה» (AC4).
- Без условия: «אי אפשר לעבור לשלב 3 — …», «חסר תנאי: איזו שאלה חושפת את המידע?», запросов нет (AC2).
- С условием: 200, info_items [{shown_upfront, null}, {discover_in_call, null}, {on_question, условие}] в запросе и БД; prior_relationship пуст (AC5); шаг 3.

#### 2.3 «סקירת הטיוטה»: в «מה המועמד יראה» и в get_candidate_view нет скрытых пунктов @desktop @data (#6a993d767a46a91b6fdf30ff)
**Device:** desktop
**Users:** business
**Steps:**
1. Подменить generate-scenario-draft → 422; /simulations/<id>/draft.
**Expected:**
- get_candidate_view и панель «מה המועמד יראה» — с пунктом 1, без пунктов 2/3 и условия (треб.5, AC4).

#### 2.4 передача на утверждение без «מצב הלקוח» и «הצורך»: 400 missing_required_fields и список полей-ссылок @desktop @data (#6a993d767a46a91b6fdf30ff)
**Device:** desktop
**Users:** business
**Steps:**
1. RPC save_simulation(null, шаг 1 «QA-AUTO-df30ff-<stamp>-ריק»).
2. Генерация → 422; /simulations/<id>/draft → «העברה לאישור».
**Expected:**
- 400 missing_required_fields; «האישור נחסם: חסרים שדות חובה»; ссылки «מצב הלקוח בתחילת השיחה» / «הצורך או הבעיה של הלקוח» → ?step=customer&field=…; «קשר קודם» в списке нет; статус draft (AC3, AC5).

> Не автоматизировано: экраны кандидата и ответ candidate_open_link без скрытых пунктов (нужны активация и кандидат —
> активация запрещена); Figma-сверка шага 2. Проверено вручную 21.10 (.qa/screenshots/2026-10-21/df30ff-req5-*.png).

### 3. Редактор симуляции — шаг 1: высота трёх полей и разделители групп (#561052) (записано autotest-writer вручную 04.11, тесты не запускались)
**Seed:** `tests/seed.business.spec.ts` (в файле: fixture `asUser('business')`, окно 1440×900)
Файл: tests/simulation-editor/step1-fields-and-dividers-561052.spec.ts. Черновик не сохраняется (без «הבא») → @prod-safe. 390 не автоматизирован (только десктоп).

#### 3.1 AC1: «מטרת השיחה», «תנאי סיום שהוגדר מראש», «התוצאה הרצויה» — 52px пустые и с коротким текстом; длинный текст растёт без обрезки @desktop @prod-safe (#561052 · #c36332c5df5b97b7e9561052)
**Device:** desktop
**Users:** business
**Steps:**
1. /simulations/new?start=scratch.
2. Замер высоты #simulation-call_goal, -end_conditions, -desired_outcome (и «שם הסימולציה» как эталон) пустыми → с текстом в одну строку → с длинным текстом.
**Expected:**
- Эталон 52; три поля 52 пустые и с коротким текстом (источник: AC1, Figma 866:9930).
- Длинный текст: высота > 52, scrollHeight ≤ clientHeight (отклонение программиста, принято 04.11).

#### 3.2 AC2: линия 1px rgba(255,255,255,.08) перед «משך ותנאי סיום» и «היעד של השיחה» @desktop @prod-safe (#561052 · #c36332c5df5b97b7e9561052)
**Device:** desktop
**Users:** business
**Steps:**
1. /simulations/new?start=scratch; computed style legend/fieldset групп (border и ::before/::after).
**Expected:**
- У групп 2 и 3 есть линия 1px rgba(255, 255, 255, 0.08); у «המשרה והמכירה» её нет (источник: AC2, Figma 866:9930 / 866:10273).
