<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: шаблоны симуляций — шаблон для любой новой симуляции

> Записан autotest-writer вручную: 3 роли в одном сценарии (admin готовит шаблон, business применяет, user — отказ) —
> asUser из fixtures.ts. Файл: tests/simulation-templates/template-for-any-new-simulation.spec.ts (serial).

### 1. Шаблоны симуляций — /simulations/new
**Seed:** `tests/seed.admin.spec.ts`, `tests/seed.business.spec.ts`, `tests/seed.user.spec.ts`

#### 1.1 бизнес с симуляциями: блок «להתחיל מתבנית מוכחת», каждое применение — отдельный черновик @desktop @data (#d1389638e94bd1fb2467199d)
**Device:** desktop
**Users:** admin, business
**Steps:**
1. admin (API): admin_save_template(null, «QA-AT QA-AUTO-<stamp>», поля первого существующего шаблона) → admin_set_template_status active.
2. business: убедиться, что симуляций ≥1; /simulations/new → «שימוש בתבנית» у QA-AT.
3. Повторить.
**Expected:**
- Шаблон виден в блоке (источник: «מה רצוי»).
- Два разных /simulations/<id>, оба status draft, количество +2.

#### 1.2 user: «אין לך הרשאה למסך הזה», RPC 403 @desktop @data (#d1389638e94bd1fb2467199d)
**Device:** desktop
**Users:** user
**Steps:**
1. /simulations/new; RPC create_simulation_from_template(QA-AT).
**Expected:**
- h1 «אין לך הרשאה למסך הזה», блока нет; RPC 403.

#### 1.3 отключённый шаблон не предлагается, RPC 400 template_disabled @desktop @data (#d1389638e94bd1fb2467199d)
**Device:** desktop
**Users:** admin, business
**Steps:**
1. admin: admin_set_template_status disabled.
2. business: /simulations/new; RPC create_simulation_from_template(QA-AT).
**Expected:**
- Имени QA-AT на странице нет; RPC 400 template_disabled.
- Очистка (afterAll): шаблон отключён. Черновики остаются (удаления нет).

### 2. Шаблоны симуляций — библиотека и «סיוע בהקמת התרחיש הראשון»
**Seed:** `tests/seed.admin.spec.ts`, `tests/seed.business.spec.ts`

> Записан autotest-writer вручную: 2 роли (admin → business) + API-пробы (RPC/REST, обрыв запроса через route).
> Файл: tests/simulation-templates/template-library-assist.spec.ts (serial). Кейсы TPL-004…TPL-008, TPL-010.
> Данные: шаблон «QA-AUTO-TPL-<stamp>» + копия — отключаются в afterAll; черновики у testim (имя = имя шаблона) неудаляемы.
> Генерация AI-сценария не запускается.

#### 2.1 admin: шаблон сохраняется как шаблон («פעילה»), а не как симуляция @desktop @data (#6a993d791a95398b11e1fb6e)
**Device:** desktop
**Users:** admin, business
**Steps:**
1. admin (API): admin_save_template(null, «QA-AUTO-TPL-<stamp>», поля первого шаблона с целью v1) → active.
2. /admin/templates — строка шаблона; business: simulations с этим именем.
**Expected:**
- Строка «פעילה»; симуляций 0 (источник: AC1 — «נשמרת כתבנית ולא כסימולציה פעילה»).

#### 2.2 admin «סיוע»: сбой — сообщение с повтором без черновика; успех — черновик у бизнеса @desktop @data (#6a993d791a95398b11e1fb6e)
**Device:** desktop
**Users:** admin, business
**Steps:**
1. admin: /admin/businesses/d8be531e-92f5-4668-9de5-7f784e1e9014 → «סיוע בהקמת התרחיש הראשון» → «תבנית סימולציה» = шаблон; запрос create_simulation_from_template обрывается → «יצירת טיוטה לעסק».
2. Сеть вернуть → «יצירת טיוטה לעסק».
3. business: /simulations, REST.
**Expected:**
- Сбой: «לא בוצע» + «יצירת הטיוטה נכשלה. אפשר לנסות שוב.», кнопка активна, черновиков 0 (FL-02 ш.1).
- Успех: «נוצרה טיוטה מהתבנית», «…נוספה לסימולציות של העסק»; у business 1 черновик draft, template_id, цель v1 (דרישה 2).

#### 2.3 business: «סימולציה חדשה» → «מתבנית» → «המשך לעורך» — поля шаблона, редактируемы @desktop @data (#6a993d791a95398b11e1fb6e)
**Device:** desktop
**Users:** business
**Steps:**
1. /simulations/new → модалка: выбрать шаблон в «תבניות זמינות» → «המשך לעורך».
**Expected:**
- «מתבנית» выбрано, есть «מאפס» (FL-11 ш.1; Figma 774:2522).
- «שם הסימולציה», «מטרת השיחה» = из шаблона и редактируемы; в БД draft + template_id (AC2).

#### 2.4 изменение шаблона не меняет созданные черновики, действует на новые @desktop @data (#6a993d791a95398b11e1fb6e)
**Device:** desktop
**Users:** admin, business
**Steps:**
1. admin (API): цель шаблона → v2.
2. business: прежние 2 черновика; create_simulation_from_template → новый.
**Expected:**
- Прежние — v1, новый — v2 (AC4 / דרישה 6).

#### 2.5 שכפול и השבתה: копия «מושבתת» не предлагается @desktop @data (#6a993d791a95398b11e1fb6e)
**Device:** desktop
**Users:** admin, business
**Steps:**
1. admin (API): admin_duplicate_template → копия «…(עותק)»; отключить копию.
2. /admin/templates; «סיוע» у testim; business /simulations/new.
**Expected:**
- Строка копии «מושבתת» + «הפעלה» (דרישה 1).
- Копии нет в «סיוע» и в модалке; оригинал есть.

#### 2.6 business не может править шаблон платформы — 403 в UI и API @desktop @data (#6a993d791a95398b11e1fb6e)
**Device:** desktop
**Users:** business, admin
**Steps:**
1. business: /admin/templates.
2. business (API): admin_save_template (переименование), PATCH simulation_templates.
3. Чтение имени под business и admin.
**Expected:**
- «קוד 403», «אין לכם גישה לעמוד הזה», «המסך הזה מנוהל ברמת הפלטפורמה…», ссылки «חזרה לדשבורד», «פנייה לתמיכה»; нет «תבנית חדשה» (FL-02 ш.2).
- RPC и PATCH → 403 / 42501; имя прежнее; чтение 200 (AC5).

### 3. Шаблоны симуляций — шаг «התנגדות» в черновике
**Seed:** `tests/seed.business.spec.ts`

> Для официального playwright-test-generator. Кейс TPL-009.

#### 3.1 шаг «התנגדות»: «מהספרייה» (6 типовых) или «נוסח חופשי» @desktop @data (#6a993d791a95398b11e1fb6e)
**Device:** desktop
**Users:** business
**Steps:**
1. Открыть черновик `/simulations/871160e4-193a-4393-af44-8b62a2934c09` («QA-N15 טיוטה מתבנית (biz)», QA-данные).
2. Перейти на шаг «התנגדות» (третий из «פרטים כלליים / לקוח וחשיפה / התנגדות / גבולות ההצעה»).
3. Проверить радио и выпадающий список библиотеки.
4. Выбрать «נוסח חופשי».
5. Вернуть «מהספרייה». НЕ нажимать сохранение/одобрение/генерацию сценария (AI).
**Expected:**
- Радио «מהספרייה» выбрано, есть «נוסח חופשי» (источник: AC3 — «בוחר פריט מהספרייה או מזין התנגדות חופשית»).
- В списке ровно 6 вариантов (кроме «בחירת התנגדות…»): אין לי זמן לזה עכשיו · אנחנו כבר עובדים עם ספק אחר · המחיר גבוה מדי · זה לא רלוונטי לנו כרגע · צריך לחשוב על זה ולהתייעץ · תשלחו לי חומר במייל (FL-13).
- После «נוסח חופשי» — редактируемое текстовое поле возражения.
