<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: общий вид — фон страниц бизнеса

> Записан autotest-writer вручную: замер computed style и цветов пикселей снимка (evaluate + canvas) — генератор так не умеет.
> Файл: tests/layout/business-background-gradient.spec.ts. Только чтение — @prod-safe. Кейсы BG-001, BG-002.

### 1. Фон страниц бизнеса = синий градиент кадров 693:3144, 678:652, 812:448, 816:1183
**Seed:** `tests/seed.business.spec.ts` (в файле: storageState auth/business.json, окно 1440×1024)

#### 1.1 /, /candidates, /simulations, /settings: градиент, точки фона = Figma @desktop @prod-safe (#dbea28b76137e3b7198da386)
**Device:** desktop (1440×1024)
**Users:** business
**Steps:**
1. Открыть страницу, дождаться h1.
2. Computed style body/html; снимок окна, цвета в (10,10), (1432,10), (1432,512), (10,1012).
**Expected:**
- radial-gradient, background-attachment fixed; нет background-vector и rgb(65,74,87) (#414a57) (источник: «מצב נוכחי» тикета).
- Точки ≈ Figma ±12: 52,78,191 · 40,62,152 · 22,24,29 · 31,46,103 (источник: AC).

#### 1.2 длинный отчёт: внизу после прокрутки тот же градиент @desktop @prod-safe (#dbea28b76137e3b7198da386)
**Device:** desktop (1440×1024)
**Users:** business
**Steps:**
1. `/candidates/7ade4110-48a9-4f1d-9835-b3ecb102cbcc/report`, scrollHeight > 1024, прокрутка до низа.
2. Снимок окна, точки (1432,512), (10,1012).
**Expected:**
- Те же значения, что в 1.1 (±12) — без обрыва и серой полосы (источник: AC).

### 2. Админка — десктоп полностью, мобильная ширина читаема (#6a993d666cd36172db6e5ece)
**Seed:** `tests/seed.user.spec.ts` (в файле: storageState auth/user.json)

> Записан autotest-writer вручную. Файл: tests/layout/admin-responsive.spec.ts. Только чтение — @prod-safe. Кейс ADM-001.
> Только @desktop (урок L-20261014-5: телефон только у кандидата); 768/390 — тем же Chrome.

#### 2.1 /, /candidates, /candidates/new, /simulations, отчёт 7ade4110…: 1440 без горизонтальной прокрутки; 768 и 390 — без прокрутки страницы, h1 в окне, RTL @desktop @prod-safe (#6a993d666cd36172db6e5ece)
**Device:** desktop (1440×900 → 768×900 → 390×844)
**Users:** user
**Steps:**
1. Открыть страницу на 1440; дождаться h1; замер.
2. Сузить до 768 и 390; замер.
**Expected:**
- html/body scrollWidth ≤ окна, h1 целиком в окне, dir=rtl (источник: AC3 «ממשק הניהול נתמך במלואו בדסקטופ ובמובייל במצב קריא»).

### 3. Боковое меню Super Admin — «בקשות מידע» и значок выхода (#59e715)
**Seed:** `tests/seed.admin.spec.ts`

> Записан autotest-writer вручную (замеры значков 20×20 и сравнение src иконок): tests/layout/admin-sidebar-data-requests.spec.ts.
> Только чтение → @prod-safe.

#### 3.1 меню на 6 разделах: порядок пунктов, «בקשות מידע» 4-й со своим значком, «התנתקות» со значком icon/logout @desktop @prod-safe (#59e715 · #193a63d7d3f3e0502e59e715)
**Device:** desktop
**Users:** admin
**Steps:**
1. Открыть /admin/businesses, /admin/access-log, /admin/support, /admin/data-requests, /admin/providers, /admin/templates.
2. На каждом — навигация «ניווט ראשי» в app-sidebar и кнопка logout-button.
**Expected:**
- Ссылки: בתי עסק, רישום גישה, תמיכה ותפעול, בקשות מידע, ספקי AI ותמלול, תבניות סימולציה; 4-я ведёт на /admin/data-requests (AC1, Figma 812:448/816:1183).
- У каждой ссылки видимый значок 20×20; значок «בקשות מידע» отличается от остальных (F1).
- «התנתקות» со значком 20×20 icon/logout (AC2).

#### 3.2 клик «בקשות מידע» → /admin/data-requests, h1 «בקשות עיון ומחיקת מידע», пункт активен; после reload так же @desktop @prod-safe (#59e715 · #193a63d7d3f3e0502e59e715)
**Device:** desktop
**Users:** admin
**Steps:**
1. /admin/businesses → «בקשות מידע».
2. Перезагрузить страницу.
**Expected:**
- URL /admin/data-requests, h1 «בקשות עיון ומחיקת מידע» (AC1 «פותח את בקשות המידע»; S-22).
- aria-current=page только у «בקשות מידע» (Figma 822:2114).
**File:** tests/layout/admin-sidebar-data-requests.spec.ts · кейс ADM-002

### 4. Отчёт кандидата на ширине 390 — «מעבר לדוח» (#7e3811)
**Seed:** `tests/seed.business.spec.ts` (в файле: storageState auth/business.json, окно задаётся в тесте)

> Записан autotest-writer вручную: подмена ответа get_candidate_report (route.fetch + fulfill → generation_error) и замеры
> getBoundingClientRect/activeElement — генератор так не умеет. Файл: tests/layout/report-390-skip-link.spec.ts.
> Окно 390×844 в десктопном Chromium без эмуляции телефона (L-20261014-5). Только чтение → @prod-safe. Кейсы RPT390-001…003.

#### 4.1 390×844, готовый отчёт: «מעבר לדוח» в первом экране; клик и Enter → фокус на #report-column @desktop @prod-safe (#7e3811 · #c99eb276d2d9317f787e3811)
**Device:** desktop (390×844)
**Users:** business (testim)
**Steps:**
1. Отчёт QA-4b397a-DISC-2110, scrollY 0.
2. Клик «מעבר לדוח»; вверх, фокус на ссылку, Enter.
**Expected:**
- skip-to-report «מעבר לדוח», href #report-column, bottom ≤ 844 (AC1).
- activeElement.id = report-column; колонка и report-summary в окне (AC1).

#### 4.2 390×844, «שגיאה בהפקת דוח» (подмена): после перехода в окне блок ошибки и «פנייה לתמיכה» @desktop @prod-safe (#7e3811 · #c99eb276d2d9317f787e3811)
**Device:** desktop (390×844)
**Users:** business (testim)
**Steps:**
1. route get_candidate_report → report.status = generation_error; открыть отчёт.
2. Клик / Enter по «מעבר לדוח».
**Expected:**
- report-error «שגיאה בהפקת דוח» со ссылкой «פנייה לתמיכה»; ссылка «מעבר לדוח» в первом экране; после перехода фокус на #report-column, ошибка и «פנייה לתמיכה» в окне (AC2; было 1593 px).

#### 4.3 1440×900: «מעבר לדוח» скрыта, отчёт и ошибка на месте @desktop @prod-safe (#7e3811 · #c99eb276d2d9317f787e3811)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. Готовый отчёт; затем с подменой generation_error.
**Expected:**
- skip-to-report скрыта; report-summary виден; в ошибке видны «שגיאה בהפקת דוח» и «פנייה לתמיכה» (С1).
**File:** tests/layout/report-390-skip-link.spec.ts · кейсы RPT390-001, RPT390-002, RPT390-003

### 5. Меню действий строки закрывается при сужении окна 1440 → 250 (#f0f6e2) (записано autotest-writer вручную)
**Seed:** `tests/seed.business.spec.ts` / `tests/seed.admin.spec.ts` (в файле: asUser('business') / asUser('admin'))

> Вручную: смена размера окна при открытом меню — генератор так не умеет. Только чтение (меню открывается, пункты не нажимаются) → @prod-safe.
> Админка и экраны бизнеса — только десктоп (L-20261014-5). Связаны #a9a3cd (BIZ-INV-009) и SUP-002.

#### 5.1–5.3 строка приглашения /settings/users, строка пользователя /settings/users, строка /admin/support: после 1440→250 меню закрыто, aria-expanded="true" не осталось @desktop @prod-safe (#f0f6e2 · #aeb6b4a4d630df5aa3f0f6e2)
**Device:** desktop (1440×700 → 250×700)
**Users:** business (testim) — 5.1, 5.2; admin — 5.3
**Steps:**
1. Окно 1440×700, открыть страницу.
2. Нажать «פעולות עבור ההזמנה של …» (5.1) / «פעולות עבור <имя>» (5.2) / первую «פעולות…» (5.3): меню видно, кнопка aria-expanded="true".
3. Окно 250×700.
**Expected:**
- [role=menu]:not([hidden]) не видно; button[aria-expanded="true"] — 0 (מה רצוי #f0f6e2: меню не остаётся за экраном).
**File:** tests/layout/row-menu-closes-on-narrow-resize.spec.ts · кейсы ROWMENU-001, ROWMENU-002, ROWMENU-003

### 6. Список симуляций — ширины 1280–1920 (#30dabb) (записано autotest-writer вручную 04.11, тесты не запускались)
**Seed:** `tests/seed.business.spec.ts` (в файле: fixture `asUser('business')`, окно 1280/1366/1440/1920 × 900)
Файл: tests/layout/simulations-wide-30dabb.spec.ts. Только чтение → @prod-safe. Нужен ≥1 черновик в testim (QA-ED-0411 и др.) для «המשך עריכה».

#### 6.1 /simulations @1280/@1366/@1440/@1920: нет горизонтальной прокрутки, таблица в панели, «המשך עריכה» целиком, контент в 40px от края и от меню @desktop @prod-safe (#30dabb · #9f3336dd127bdb2d7530dabb)
**Device:** desktop (4 теста, по ширине)
**Users:** business
**Steps:**
1. Окно нужной ширины → /simulations, h1 «סימולציות», строки таблицы.
2. Замер: scrollWidth документа и обёрток таблицы, панель таблицы, боковое меню, кнопки «המשך עריכה».
**Expected:**
- Нет прокрутки страницы и таблицы, таблица внутри панели (источник: AC3 «אין גלילה אופקית ואין שבירת טבלאות ברוחבים 1280–1920»; реджект 21.10).
- Контент: левый край 40, зазор до меню 40 (±1); 1440 — правый край 1144, меню 240 (Figma 761:1998); 1920 — шире 1104 (AC1).
- Каждая «המשך עריכה» целиком в панели, текст не обрезан.
