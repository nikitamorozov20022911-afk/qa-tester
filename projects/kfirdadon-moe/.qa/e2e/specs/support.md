<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: поддержка и эксплуатация Super Admin (/admin/support, S-02)

> Записан autotest-writer вручную: проверки через Range/scrollWidth/computed style и размер меню после resize.
> Файлы — в tests/admin-support/ (не tests/support/: там общие помощники api.ts, session.ts).
> Только чтение — @prod-safe.

### 1. Поддержка — таблица статусов при 1440
**Seed:** `tests/seed.admin.spec.ts`

#### 1.1 1440: у латинского имени первая буква внутри ячейки, длинное обрезано в конце (ellipsis) @desktop @prod-safe (#8140c180a9bf2e83d1a17783)
Файл: tests/admin-support/latin-name-truncation.spec.ts
**Device:** desktop (1440×900)
**Users:** admin
**Steps:**
1. /admin/support, есть строки.
2. Колонки 1–2 (бизнес, кандидат): текст начинается с латиницы → Range на первом и последнем символе текстового элемента.
**Expected:**
- Есть ≥1 латинское имя и ≥1 обрезанное (данные: QA-G4b-K3-13…).
- Первая буква внутри элемента и ячейки; у обрезанных text-overflow: ellipsis и последний символ за пределами элемента (источник: «מה רצוי» — «שם ארוך נחתך בסופו עם שלוש נקודות, ותחילתו נשארת גלויה בכל כיוון כתב»; AC).

#### 1.2 меню строки после 700 → 1440 не залипает узким и целиком в окне @desktop @prod-safe (#8140c180a9bf2e83d1a17783)
Файл: tests/admin-support/row-menu-after-resize.spec.ts
**Device:** desktop (окно 1440 → 700 → 1440)
**Users:** admin
**Steps:**
1. 1440: «פעולות …» (⋮) первой строки → замер role=menu → Esc.
2. 700: открыть → Esc.
3. 1440: открыть → замер.
**Expected:**
- Ширина в шаге 3 = ширине в шаге 1 (±1 px); меню в пределах viewport (источник: комментарий программиста на тикете — RowMenu не должен хранить прошлую ширину).

### 2. Поддержка — фильтр «בית עסק» (направление имени и стрелка)
**Seed:** `tests/seed.admin.spec.ts`

> Записаны autotest-writer вручную (замеры computed style / canvas measureText, генератор такие не пишет). Выбор в фильтре данных не меняет — @prod-safe.
> Данные (уже есть, не удалять): «QA-N14 International Holdings Limited Group», «בית עסק לבדיקות לילה ארוך מאוד QA-N14», «QA Test Business A».

#### 2.1 длинное латинское имя в фильтре «בית עסק» видно с начала, обрезано в конце @desktop @prod-safe (#9fd7c0e365af109a3e7787c2)
Файл: tests/admin-support/business-filter-latin-name.spec.ts · Кейс: SUP-003
**Device:** desktop (1440×900)
**Users:** admin
**Steps:**
1. /admin/support; в «בית עסק» выбрать «QA-N14 International Holdings Limited Group».
2. Замер: direction, text-overflow, ширина текста vs доступная.
3. Выбрать «QA Test Business A» — замер.
**Expected:**
- Длинное: ltr, текст шире поля, text-overflow ellipsis (начало видно, «…» в конце) (источник: AC «תחילת שם העסק נראית תמיד… החיתוך בסוף השם»).
- Короткое: ltr, помещается целиком.

#### 2.2 стрелка «בית עסק» на той же стороне, что у «סטטוס תקלה», при латинском и ивритском имени @desktop @prod-safe (#c2b35c90e4261ea3fa9b3bd0)
Файл: tests/admin-support/business-filter-arrow-side.spec.ts · Кейс: SUP-004
**Device:** desktop (1440×900)
**Users:** admin
**Steps:**
1. /admin/support; по очереди выбрать в «בית עסק» три имени (лат. длинное, ивр. длинное, лат. короткое).
2. Замер у обоих фильтров: background-position, padding-left/right, direction; ширина текста ивритского и короткого латинского.
**Expected:**
- background-position и padding «בית עסק» = «סטטוס תקלה» при любом имени; стрелка слева (padding-left > padding-right) (источник: AC1; Figma 816:1183).
- Латинское — ltr, ивритское — rtl; «סטטוס תקלה» остаётся rtl (AC2).
- Ивритское и короткое латинское видны целиком (AC2 «בלי שהשם נחתך»).

### 3. Поддержка — статус ссылки после тех. проверки (записано autotest-writer вручную)
**Seed:** `tests/seed.admin.spec.ts` + `tests/seed.business.spec.ts` + кандидат (отдельный Chrome с фальшивым микрофоном)

> Три роли в одном сценарии (asUser + launchCandidate из tests/candidate-call/support.ts) — генератор не умеет.
> Звонок не начинается — OpenAI не тратится. Кандидат «QA-AUTO-60d15f-<stamp>» не удаляется (удаления кандидатов нет).

#### 3.1 после пройденной тех. проверки «קישור» = «בדיקה טכנית עברה · בשלב התרגול», «עדכון אחרון» обновлён @desktop @data (#e4e484a00eca59f5dd60d15f)
Файл: tests/admin-support/link-after-tech-check.spec.ts · Кейс: SUP-005
**Device:** desktop (1440×900)
**Users:** business, candidate (guest), admin
**Steps:**
1. business: /candidates/new → кандидат, link_only → ссылка /c/….
2. admin: /admin/support → строка кандидата.
3. Кандидат: вступление → согласие → «להתחיל בדיקה» → «כן, שומעים טוב» → «להמשיך לתרגול».
4. admin: /admin/support снова (ожидание через перезагрузку, без пауз).
**Expected (источник: «מה רצוי» / AC #60d15f):**
- До: «קישור» без «בדיקה טכנית עברה».
- После: «בדיקה טכנית עברה», под ним «בשלב התרגול»; «בדיקה טכנית החלה» нет.
- «עדכון אחרון» (дд.мм.гг, чч:мм) не раньше начала тех. проверки.

### 4. Поддержка — «מסלול ביקורת» попытки (записано autotest-writer вручную)
**Seed:** `tests/seed.admin.spec.ts` (+ `business` через asUser для PATCH)

> Записано вручную по решению пользователя 21.10 (без браузера и без прогона). Файл: tests/admin-support/audit-trail-534912.spec.ts.
> Без звонков: готовые кандидаты 21.10 (QA-534912-2110-AC2, QA-C4-2110-D2, QA-C6-2110-D2; замена — QA_534912_UNOPENED/COMPLETED/RESET_CANDIDATE).
> Фильтр «טווח תאריכים» = «כל התאריכים» (по умолчанию 7 дней). Каждое открытие трассы пишет запись в журнал доступа SA (D-25).

#### 4.1 неоткрытая ссылка: «מסלול ביקורת» в меню, 7 этапов, заполнены только «יצירת קישור» и «תפוגה» @desktop @prod-safe (#534912)
Кейс: SUP-006 · **Device:** desktop · **Users:** admin
**Steps:** /admin/support → все даты → «פעולות תמיכה עבור QA-534912-2110-AC2» → «מסלול ביקורת».
**Expected:**
- rpc/get_attempt_audit_trail {p_reason:"support"} → 200; панель, «שלב / ניסיון 1 · נוכחי», 7 строк по порядку (AC1).
- «יצירת קישור» и «תפוגה» (+48 ч) — дата и время; остальные «—», в API null, attempts []; нет 1970 (AC2); подпись «שלב ריק עדיין לא התרחש…».

#### 4.2 ручного изменения меток нет: UI без полей, PATCH → 403 42501, без причины → 400 @desktop (#534912)
Кейс: SUP-007 · **Device:** desktop · **Users:** admin, business
**Steps:** панель QA-534912-2110-AC2; PATCH candidate_invites (link_created_at = текущее) и attempts (reset_at null, 0 строк) от business и admin; rpc без p_reason.
**Expected:** нет input/textarea/select/contenteditable и кнопок правки; PATCH 403 42501; 400 reason_required; метка не изменилась (AC5, D-25).

#### 4.3 завершённая попытка: все 7 меток по порядку, «הפקת דוח» отдельно от «סיום» @desktop @prod-safe (#534912)
Кейс: SUP-008 · **Device:** desktop · **Users:** admin
**Steps:** панель QA-C4-2110-D2.
**Expected:** все 7 заполнены, порядок жизненного цикла (AC1); report_generated_at > simulation_ended_at (требование, FL-24 ш.2).

#### 4.4 сброшенная попытка: «ניסיון 2 · נוכחי» / «ניסיון 1 · אופס», место остановки @desktop @prod-safe (#534912)
Кейс: SUP-009 · **Device:** desktop · **Users:** admin
**Steps:** панель QA-C6-2110-D2.
**Expected:** две колонки в этом порядке, плашка «הניסיון הקודם אופס», метки прежней сохранены (AC4); «הניסיון נעצר כאן» у последней метки прежней попытки (AC3).

### 5. Поддержка — фильтры и строка счёта неподвижны (#3eaa00) (записано autotest-writer вручную 04.11, тесты не запускались)
**Seed:** `tests/seed.admin.spec.ts` (в файле: fixture `asUser('admin')`, окно 1440×900)
Файл: tests/admin-support/filters-fixed-positions-3eaa00.spec.ts. Смена фильтров данных не меняет → @prod-safe. 390 не автоматизирован.
ВНИМАНИЕ: SUP-004 (business-filter-arrow-side.spec.ts) ждёт, что «בית עסק לבדיקות לילה ארוך מאוד QA-N14» помещается целиком (fits: true) — при фиксированных 240px оно обрезается «…» (вопрос 04.11 к #3eaa00 / #9b3bd0); тот тест может упасть, решение за пользователем.

#### 5.1 1440: поля 260/240/220, «טווח תאריכים» x 392–612, счёт в 16px от даты — при всех статусах, датах и бизнесах @desktop @prod-safe (#3eaa00 · #d8da91f5c6ca5f64163eaa00)
**Device:** desktop
**Users:** admin
**Steps:**
1. /admin/support.
2. Перебрать все опции «טווח תאריכים», все опции «סטטוס תקלה» (в т.ч. «שגיאה בהפקת דוח»), три бизнеса в «בית עסק».
3. После каждой смены — замер полей и строки счёта (с ожиданием, expect.poll).
**Expected:**
- Ширины 260/240/220 (±2), «סטטוס תקלה» правый край 1144, «טווח תאריכים» 392–612, зазор счёт → дата 16 (источник: реджект «זז בכל שינוי סינון»; Figma 816:1183; AC1/AC2).
- Строка «N רשומות( · N דורשות טיפול)».
