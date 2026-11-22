<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: кандидаты — привязка только к активной симуляции

> Записан autotest-writer вручную: суть бага — серверный guard (API create_candidate / PATCH candidates),
> генератор API-зонды не записывает. Файл: tests/candidates/assign-only-active-simulation.spec.ts.

### 1. Кандидаты — выбор симуляции
**Seed:** `tests/seed.business.spec.ts`

#### 1.1 /candidates/new: только активные версии «(גרסה N)» @desktop @prod-safe (#b950c1450cef01f561ab010f)
**Device:** desktop
**Users:** business
**Steps:**
1. /candidates/new; список симуляций бизнеса из REST.
**Expected:**
- Варианты селекта «סימולציה (חובה)» = ровно активные id, текст «<имя> (גרסה N)»; неактивных нет (источник: «מה רצוי»).

#### 1.2 сервер: create_candidate/PATCH только на активную @desktop @data (#b950c1450cef01f561ab010f)
**Device:** desktop
**Users:** business
**Steps:**
1. create_candidate на draft, pending_approval, previous_version, inactive (по одной симуляции каждого статуса из бизнеса).
2. create_candidate «QA-AUTO-<stamp> active» на активную (qa+at@example.com; писем нет).
3. PATCH candidates.simulation_id этого кандидата → inactive, затем → active.
**Expected:**
- 400 simulation_not_active ×4; 200 на активную; PATCH → 400 simulation_not_assignable, на активную → 200.

### 2. Кандидаты — таблица в панели при 1440/1280
**Seed:** `tests/seed.business.spec.ts`

> Записан autotest-writer вручную: замеры вёрстки (scrollWidth/clientWidth, прямоугольники, elementFromPoint
> после hover) через evaluate. Файл: tests/candidates/table-fits-panel.spec.ts. Только чтение — @prod-safe.

#### 2.1 ширина 1440: таблица внутри панели, scrollWidth == clientWidth, действия строки в viewport и кликабельны @desktop @prod-safe (#03f662e4191d3e3c2a3382fd)
**Device:** desktop (1440×900)
**Users:** business
**Steps:**
1. /candidates (h1 «מועמדים»), есть строки.
2. Замер: documentElement, таблица, её панель (ближайший предок с фоном/рамкой/скруглением), обёртки между ними.
3. Каждая строка: scrollIntoView → hover → видимые button / a[href] строки.
**Expected:**
- documentElement.scrollWidth == clientWidth; у таблицы и обёрток до main нет scrollWidth > clientWidth; таблица в границах панели (источник: AC — «מוצגת בתוך הפאנל בלי גלילה אופקית של העמוד»).
- В каждой строке после hover есть действия; каждое целиком в viewport; elementFromPoint в центре — само действие или его потомок (AC — «כל פעולות השורה גלויות»; Figma 678:652 — действия при hover).

#### 2.2 ширина 1280: то же @desktop @prod-safe (#03f662e4191d3e3c2a3382fd)
**Device:** desktop (1280×900)
**Users:** business
**Steps:** как 2.1 при 1280×900.
**Expected:** как 2.1.

### 3. Кандидаты — версия без сценария
**Seed:** `tests/seed.business.spec.ts` (+ гость в отдельном окне)

> Записан autotest-writer вручную: две роли (business и гость). Файл: tests/candidates/no-scenario-marker.spec.ts (serial).
> @data: создаёт кандидата «QA-AUTO-NS-<stamp>» (link_only, без письма/SMS); не удаляется (правило проекта). Не prod-safe.
> Окружение: QA_NO_SCENARIO_SIMULATION (по умолчанию «QA-DS r2 טיוטה וגרסאות» — активная версия без сценария). Кейс CAND-004.

#### 3.1 business: кандидат на версии без сценария — «קישור נוצר» + «אין תרחיש לגרסה» с подсказкой; у версии со сценарием метки нет @desktop @data (#d9aa30282ea83831ce4afdeb)
**Device:** desktop 1440×900
**Users:** business
**Steps:**
1. /candidates/new → «QA-AUTO-NS-…» на «QA-DS r2 טיוטה וגרסאות», link_only → «יצירת קישור».
2. /candidates → поиск по имени.
3. Контроль: строки «מערכות סולאריות» без метки.
**Expected:**
- В строке «קישור נוצר» и «אין תרחיש לגרסה»; title «המועמד/ת לא יכול/ה להתחיל את הסימולציה כי לגרסה שלה אין תרחיש…» (источник: AC «מועמד שאינו יכול להתחיל בגלל חוסר תרחיש מסומן כך ברשימת המועמדים»).
- У строк версии со сценарием «אין תרחיש לגרסה» нет.

#### 3.2 гость открывает ссылку: «הסימולציה עדיין לא מוכנה» + «לפנות לצוות הגיוס»; после этого метка в списке остаётся @desktop @data (#d9aa30282ea83831ce4afdeb)
**Device:** гость 390×844, business 1440×900
**Users:** guest, business — продолжение 3.1
**Steps:**
1. Гость: ссылка /c/…; перезагрузка.
2. business: /candidates → поиск.
**Expected:**
- candidate_open_link: stage unavailable, reason no_scenario; «הסימולציה עדיין לא מוכנה», «התרחיש של השיחה עוד לא הושלם», «לפנות לצוות הגיוס»; нет «בוא נתחיל»; после перезагрузки то же.
- В списке снова «אין תרחיש לגרסה».

### 4. Кандидаты — решение о найме и внутренние заметки
**Seed:** `tests/seed.business.spec.ts` (+ `tests/seed.user.spec.ts`, гость — отдельными окнами)

> Записан autotest-writer вручную (генератор не работает; несколько ролей; API-проверки прав). Только десктоп (L-20261014-5).
> Панель решения/заметки в отчёте есть только при попытке (звонке) — звонки и генерацию отчёта не запускаем: на своих
> кандидатах «QA-AUTO-HD…» решение и заметка ставятся тем же запросом, что и UI (candidates.update({recruiting_status}).eq('id'),
> rpc add_internal_note), результат — в списке /candidates и get_candidate_report. UI-панель и сбой — на QA-G4-A-1321 с моками 500
> (данные не меняются). Решения/заметки/кандидаты не удаляются. После решения менеджер остаётся в отчёте (FL-47) — норма, не проверяем как дефект.
> Хелперы: tests/candidates/hiring-support.ts.

#### 4.1 business: три решения по своему кандидату — сразу в списке и фильтре, кто и когда; статус выполнения не меняется @desktop @data (#6a993d6ab2e4b167537ea9a3)
**Device:** desktop
**Users:** business
**Steps:**
1. /candidates/new → «QA-AUTO-HD-<stamp>», link_only.
2. PATCH recruiting_status: advanced_to_next_stage → further_clarification_needed → process_ended.
3. После каждого: /candidates?q=, /candidates?status=<значение>&q=; get_candidate_report.hiring.
**Expected:**
- PATCH 200 [{id}]; ячейка «החלטת גיוס» = «הועבר לשלב הבא» / «נדרש בירור נוסף» / «התהליך הסתיים», фильтр находит (AC2, треб.6).
- changed_by = менеджер, changed_at заполнен (треб.3); в строке по-прежнему «קישור נוצר» (треб.4).
**File:** tests/candidates/hiring-decision-notes.spec.ts · кейс CAND-005

#### 4.2 business: внутренняя заметка видна команде с автором и временем; гость по ссылке её не получает @desktop @data (#6a993d6ab2e4b167537ea9a3)
**Device:** desktop
**Users:** business, guest — продолжение 4.1
**Steps:**
1. add_internal_note «QA-AUTO-NOTE-…» (p_report_id null).
2. get_candidate_report.notes.
3. Гость: ссылка /c/… кандидата; тела ответов fetch/xhr.
**Expected:**
- 200; заметка с автором и created_at (AC3, треб.2).
- У гостя текста заметки нет ни на странице, ни в ответах сети (AC3).
**File:** tests/candidates/hiring-decision-notes.spec.ts · кейс CAND-006

#### 4.3 рекрутёр по своему кандидату ставит решение и заметку — менеджер видит их с авторством рекрутёра @desktop @data (#6a993d6ab2e4b167537ea9a3)
**Device:** desktop
**Users:** business, user
**Steps:**
1. business: «QA-AUTO-HDU-<stamp>», «מנהל אחראי» = рекрутёр.
2. user: кандидат в list_candidates; PATCH further_clarification_needed; add_internal_note.
3. business: /candidates?q= и get_candidate_report.
**Expected:**
- 200 [{id}] и 200 (треб.5 — можно по своей записи).
- У менеджера «נדרש בירור נוסף», changed_by = рекрутёр, заметка рекрутёра с его авторством.
**File:** tests/candidates/hiring-decision-notes.spec.ts · кейс CAND-008

#### 4.4 панель в отчёте: три варианта, «עודכן על ידי»; сбой сохранения — прежнее решение и текст заметки остаются @desktop @prod-safe (#6a993d6ab2e4b167537ea9a3)
**Device:** desktop
**Users:** business
**Steps:**
1. Мок 500 на PATCH /rest/v1/candidates и rpc add_internal_note (до открытия страницы).
2. /candidates/<id QA-G4-A-1321>/report: кнопки панели «החלטת גיוס».
3. Нажать другой вариант; ввести заметку «QA-AUTO-MOCK-…» → «הוספת הערה»; перезагрузить.
**Expected:**
- Ровно три кнопки, без «טרם נקבע» (AC1, SPEC #027719 п.20); «עודכן על ידי … ב…» (треб.3).
- «לא הצלחנו לשמור את ההחלטה, וההחלטה הקודמת נשמרה…», прежний вариант aria-pressed=true; «לא הצלחנו לשמור את ההערה, והטקסט שכתבתם נשאר כאן…», текст в поле (AC4).
- После перезагрузки решение прежнее, заметки нет.
**File:** tests/candidates/hiring-decision-failure.spec.ts · кейс CAND-007

#### 4.5 рекрутёр по чужому кандидату: нет в списке, «המועמד לא נמצא», решение 200 [] и заметка 403 — данные не меняются @desktop @prod-safe (#6a993d6ab2e4b167537ea9a3)
**Device:** desktop
**Users:** user, business
**Steps:**
1. business: get_candidate_report QA-N16-6e5ece-kbd-1436 (QA_FOREIGN_CANDIDATE) — исходные hiring/notes.
2. user: list_candidates без него; /candidates/<id>/report.
3. user: PATCH recruiting_status (другое значение); rpc add_internal_note «QA-AUTO-AC5-PROBE-…».
4. business: get_candidate_report.
**Expected:**
- «המועמד לא נמצא», панелей нет; PATCH 200 тело [] (0 строк, RLS); rpc 403 {code 42501, message forbidden} (AC5, треб.5).
- hiring и notes как до пробы, пробы нет.
**File:** tests/candidates/hiring-decision-foreign-recruiter.spec.ts · кейс CAND-009

### 5. Кандидаты — длина внутренней заметки (#5f2fdf)
**Seed:** `tests/seed.business.spec.ts`

> Записан autotest-writer вручную: add_internal_note перехватывается (заметки не удаляются), ответ сервера
> note_too_long подменяется. Файл: tests/candidates/internal-note-length-limit.spec.ts. Данные не меняются → @prod-safe.

#### 5.1 вставка 4500 символов не обрезается; сообщение о превышении; сохранение блокируется; счётчик ≤400; note_too_long → сообщение, текст остаётся @desktop @prod-safe (#5f2fdf · #08ef33ad7c5ff1b2945f2fdf)
**Device:** desktop
**Users:** business
**Steps:**
1. Отчёт QA-G4-A-1321 (QA_DECISION_CANDIDATE) → «הערה פנימית»: вставить 4500 символов «QA-AUTO-NOTE-5f2fdf-…».
2. «הוספת הערה».
3. Текст 3500 / 3700 / 4000 символов.
4. 3900 символов, подмена ответа add_internal_note 400 {code P0001, message note_too_long} → «הוספת הערה».
**Expected:**
- Шаг 1: в поле 4500 символов; «ההערה ארוכה מדי: 4,500 תווים מתוך 4,000. קצרו 500 תווים כדי לשמור.»; aria-invalid=true (AC1/AC2).
- Шаг 2: запроса нет; alert «ההערה ארוכה מדי. קצרו אותה ונסו שוב.»; текст на месте («ולא מאבד טקסט בשקט»).
- Шаг 3: 3500 — счётчика нет; 3700 — «נותרו 300 תווים מתוך 4,000»; 4000 — «נותרו 0 תווים מתוך 4,000», без aria-invalid (AC1).
- Шаг 4: alert «ההערה ארוכה מדי. קצרו אותה ונסו שוב.», текст в поле, новой заметки в списке нет.
**File:** tests/candidates/internal-note-length-limit.spec.ts · кейс CAND-010

### 6. Кандидаты — решение о найме с клавиатуры (#1d2635)
**Seed:** `tests/seed.business.spec.ts`

> Записан autotest-writer вручную: проверка document.activeElement и role=status, возврат исходного решения в
> finally. Файл: tests/candidates/hiring-decision-keyboard.spec.ts. Меняет решение общего кандидата → @data.

#### 6.1 Space/Enter: фокус остаётся на выбранной кнопке, role=status «ההחלטה נשמרה: …», Tab не уходит на body; исходное решение возвращено @desktop @data (#1d2635 · #2056988a22bde8cc1b1d2635)
**Device:** desktop
**Users:** business
**Steps:**
1. Отчёт QA-G4b-U-1432 (QA_KEYBOARD_CANDIDATE); запомнить исходное решение.
2. Фокус на другом решении → Space; Tab.
3. Фокус на третьем → Space; Tab.
4. Фокус на исходном → Enter.
5. (finally) если решение не исходное — вернуть через тот же PATCH, что делает UI.
**Expected:**
- После каждого сохранения (PATCH 200) кнопка aria-pressed=true и в фокусе (AC1).
- role=status «ההחלטה נשמרה: <решение>» (AC2).
- Tab переводит фокус на следующий элемент, не на body («מצב קיים»).
**File:** tests/candidates/hiring-decision-keyboard.spec.ts · кейс CAND-011

### 7. Кандидаты — «ל-» перед латиницей/цифрой в сообщениях о ссылке (#190a63)
**Seed:** `tests/seed.business.spec.ts` (+ admin для /admin/support — через asUser)

> Записан autotest-writer вручную: 2 роли (business, admin) через asUser, подготовка данных и подмена ответов
> (list_candidates / reset_attempt) — генератор так не умеет. Кандидаты testim с постоянными именами «QA-AUTO-190a63»,
> «2110 QA-AUTO-190a63», «בדיקה QA-AUTO-190a63» (link_only) создаются один раз в beforeAll, если их нет, и переиспользуются
> (удалить кандидата нельзя; так новые записи не копятся). Меняет их ссылки → @data, файл serial. Кейс CAND-012.

#### 7.1 business: отчёт → «ניהול הקישור» → «הפקת קישור חדש» — заголовок и уведомление @desktop @data (#190a63 · #81c0182b234c10aeac190a63)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. Для каждого из трёх кандидатов: отчёт → «ניהול הקישור» → «הפקת קישור חדש» → подтвердить.
**Expected:**
- Заголовок «להפיק קישור חדש ל-QA-AUTO-190a63?» / «…ל-2110 QA-AUTO-190a63?» / «…לבדיקה QA-AUTO-190a63?»; reissue_candidate_link 200; «נוצר ל-… קישור חדש בתוקף ליומיים» (для иврита — «נוצר לבדיקה …»); нет «לQA-»/«ל2110» (מה רצוי #190a63).

#### 7.2 business: /candidates → «הארכת תוקף ב־2 ימים» → «הארכת התוקף» — уведомление @desktop @data (#190a63 · #81c0182b234c10aeac190a63)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. Поиск по имени, кнопка «הארכת תוקף ב־2 ימים: <имя>», подтвердить.
**Expected:**
- extend_candidate_link 200; «נוצר ל-QA-AUTO-190a63 / ל-2110 … / לבדיקה … קישור חדש בתוקף ליומיים» (מה רצוי #190a63).

#### 7.3 admin: /admin/support → «⋮» → «הפקת קישור חדש» @desktop @data (#190a63 · #81c0182b234c10aeac190a63)
**Device:** desktop
**Users:** admin
**Steps:**
1. Строка кандидата (латиница, цифра) → «⋮» → «הפקת קישור חדש» → причина (если есть поле) → подтвердить.
**Expected:**
- Заголовок «להפיק קישור חדש ל-…?»; reissue 200; «נוצר ל-… קישור חדש בתוקף ליומיים» (מה רצוי #190a63).

#### 7.4 business: «איפוס ניסיון» (подмена, без реального сброса) @desktop @data (#190a63 · #81c0182b234c10aeac190a63)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. route list_candidates → попытка completed; route reset_attempt → {ok:true}.
2. «איפוס ניסיון: <имя>» → «סיבת האיפוס» QA-AUTO-190a63 … → «אני מאשר/ת את האיפוס כאישור חריג» → подтвердить.
**Expected:**
- «נוצר קישור חדש ל-QA-AUTO-190a63, והסימולציה תתחיל מתחילת התרחיש» (иврит — «לבדיקה …»); reset_attempt подменён 3 раза (מה רצוי #190a63).
**File:** tests/candidates/link-messages-le-prefix.spec.ts · кейс CAND-012

### 8. Статус simulation_started = «בתהליך» в списке, фильтре и ленте дашборда (#b98032) (записано autotest-writer вручную)
**Seed:** `tests/seed.business.spec.ts` (в файле: storageState auth/business.json)

> Вручную: строка/событие simulation_started ПОДСТАВЛЯЮТСЯ в ответ list_candidates / get_business_dashboard (route.fetch → правка → fulfill),
> чтобы проверка не зависела от того, идёт ли сейчас чей-то звонок. В базе ничего не меняется → @prod-safe.

#### 8.1 /candidates: фильтр «סטטוס» содержит «בתהליך», нет «הסימולציה החלה»; колонка «ביצוע» строки simulation_started — «בתהליך»; фильтр «בתהליך» @desktop @prod-safe (#b98032 · #6a993d694473aff41cb98032)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. route list_candidates: первая строка с приглашением → full_name «QA-AUTO-b98032 בתהליך», invite.status/execution_status = simulation_started.
2. /candidates → варианты select[name=status].
3. Выбрать «בתהליך».
**Expected:**
- Вариант «בתהליך» есть, «הסימולציה החלה» нет (решение пользователя 14.10, Figma 678:652).
- Строка «QA-AUTO-b98032 בתהליך»: data-invite-status=simulation_started, td[data-label=ביצוע] — «בתהליך».
- После фильтра: URL с status=, каждая строка — «בתהליך», подменённая строка есть; «הסימולציה החלה» на странице нет.

#### 8.2 дашборд: событие simulation_started в «פעילות אחרונה» — «בתהליך» @desktop @prod-safe (#b98032 · #6a993d694473aff41cb98032)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. route get_business_dashboard: первым в recent_activity — {axis: invitation, status: simulation_started, candidate_name: «QA-AUTO-b98032 בתהליך»}.
2. Открыть /.
**Expected:**
- activity-item этого кандидата содержит «בתהליך»; в dashboard-activity и main нет «הסימולציה החלה» (решение пользователя 14.10).
**File:** tests/candidates/status-in-progress-label.spec.ts · кейсы CAND-013, DASH-003

# План автотестов: кандидаты — список /candidates: поиск, 4 фильтра, быстрые действия (#cddab4 · 6a993d6920b26e2d36cddab4)

> Принят 2026-11-17 (пользователь «עבר QA»). Записан autotest-writer вручную: ожидания берутся из list_candidates и обхода списка (не фиксированные числа);
> только чтение — кнопки копирования/продления/сброса не нажимаются. Файлы: tests/candidates/list-filters-actions-cddab4.spec.ts + list-support.ts.
> Роли: recruiter — auth/user.json («апвпп», testim), business — auth/bizt.json (testim). Кейсы CAND-014..CAND-017.

### 9. Кандидаты — список: поиск и фильтры
**Seed:** `tests/seed.user.spec.ts` (recruiter), `tests/seed.business.spec.ts` (business; сессия bizt через asUser)

#### 9.1 {recruiter, business}: 4 фильтра; опции «מנהל מגייס» из данных; выбор менеджера → его строки, счётчик «מציג x–y מתוך N» = числу отфильтрованных @desktop @prod-safe (#cddab4)
**Device:** desktop
**Users:** user, bizt
**Steps:**
1. /candidates 1440; list_candidates; обход всех страниц → менеджеры и их количество.
2. Выбрать каждого менеджера в «מנהל מגייס», затем сбросить.
**Expected:**
- Видны поиск и 4 фильтра; итог без фильтров = числу строк list_candidates (AC3, реджект 3).
- Опции «מנהל מגייס» ⊇ менеджеры списка; при выборе все строки — этого менеджера, N = числу таких строк, строк на странице = to−from+1.

#### 9.2 {recruiter, business}: фильтры комбинируются между собой и с поиском @desktop @prod-safe (#cddab4)
**Device:** desktop
**Users:** user, bizt
**Steps:**
1. Менеджер + каждый «סטטוס» по очереди; затем + поиск по имени первой строки.
**Expected:**
- Итог ≤ итога по менеджеру; строки удовлетворяют обоим условиям; 0 → «אין מועמדים שמתאימים לחיפוש ולסינון.»; хотя бы одна комбинация непустая (AC3).

#### 9.3 {recruiter, business}: поиск и фильтры в URL переживают reload @desktop @prod-safe (#cddab4)
**Device:** desktop
**Users:** user, bizt
**Steps:**
1. Выбрать менеджера; reload; ввести имя в поиск; reload.
**Expected:**
- URL содержит параметры, после reload тот же URL, значение фильтра, счётчик, строки; поиск сохраняется (AC2).

#### 9.4 {recruiter, business}: пустой результат + «ניקוי החיפוש והסינון» @desktop @prod-safe (#cddab4)
**Device:** desktop
**Users:** user, bizt
**Steps:**
1. Менеджер + поиск «QA-AUTO-NO-SUCH-…»; нажать «ניקוי החיפוש והסינון».
**Expected:**
- «אין מועמדים שמתאימים לחיפוש ולסינון.», 0 строк; после очистки поиск пуст, все 4 фильтра сброшены, счётчик как до начала, URL без параметров (AC5).

### 10. Кандидаты — список: колонки, статусы, отчёт, 390
**Seed:** `tests/seed.user.spec.ts`

#### 10.1 recruiter: 10 колонок, нет «⋮», «ביצוע» в одну строку, строка 53px @desktop @prod-safe (#cddab4)
**Device:** desktop
**Users:** user
**Steps:**
1. /candidates 1440; th; поиск «⋮»/«פעולות»; замер каждой строки и td «ביצוע».
**Expected:**
- 10 колонок (AC1); нет «⋮» (реджект 1); высота строки 53±1, «ביצוע» в 1 строку (реджект 2, Figma 678:652).

#### 10.2 recruiter: «לדוח» → отчёт этого кандидата @desktop @prod-safe (#cddab4)
**Device:** desktop
**Users:** user
**Steps:**
1. Навести на строки, найти «לדוח», нажать.
**Expected:**
- URL /candidates/<id из list_candidates>/report, имя кандидата на странице (דרישה 8).

#### 10.3 recruiter: 390 без горизонтальной прокрутки, 4 фильтра под поиском @desktop @prod-safe (#cddab4)
**Device:** desktop (viewport 390×844 внутри теста)
**Users:** user
**Steps:**
1. /candidates при 390×844.
**Expected:**
- scrollWidth ≤ clientWidth; 4 фильтра ниже поиска и в пределах экрана (комментарий 17.11).

### 11. Кандидаты — быстрые действия business
**Seed:** `tests/seed.business.spec.ts`

#### 11.1 business: значки по статусу и 44×44, без «⋮» @desktop @prod-safe (#cddab4)
**Device:** desktop
**Users:** bizt
**Steps:**
1. Обойти страницы; для «קישור נוצר», «פג תוקף», «תקלה טכנית», «הושלמה» навести на строку, перечислить значки и размеры (не нажимать).
**Expected:**
- «קישור נוצר» → copy+extend; «פג תוקף» → extend; «תקלה טכנית»/«הושלמה» → reset+report (AC4, решение 04.11); значки 44×44.
**File:** tests/candidates/list-filters-actions-cddab4.spec.ts · кейсы CAND-014..CAND-017
