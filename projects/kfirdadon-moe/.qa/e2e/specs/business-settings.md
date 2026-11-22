<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: настройки бизнеса — מנהל חשבון (F-10, S-06 /settings/business)

> Записано autotest-writer вручную 22.10 (решение пользователя: браузер не открывать, тесты не запускать) — селекторы по ролям/подписям,
> сверены с текущей сборкой сайта (index-BT4tmDRk.js), прогона не было. Только десктоп (L-20261014-5).
> Кейсы: `.qa/tests/business-settings/BSET-001…006`.

### 1. Настройки бизнеса — מנהל חשבון (#ebdb2f)
**Seed:** `tests/seed.business.spec.ts`

#### 1.1 BSET-001: поля с текущими значениями, язык he=עברית / en=אנגלית, блок квоты @desktop @prod-safe (#ebdb2f · #6a993d7890d7492f45ebdb2f)
**Device:** desktop · **Users:** business
**Steps:** 1. /settings/business. 2. Сверить с businesses (своя строка) и rpc get_business_usage.
**Expected:**
- «שם העסק», «תפקיד איש הקשר» = значения бизнеса; «שפת ברירת מחדל» доступен, опции [he עברית, en אנגלית] (AC2, факт 22.10).
- quota-used = used; без квоты — «נוצלו» и «לא הוגדרה מכסה לחשבון, ולכן אין חסימה. הצריכה נספרת…»; с квотой — «נוצלו מתוך N» (AC3, S-06); полей квоты нет (R-02).

#### 1.2 BSET-002: пустое «שם העסק» / «תפקיד איש הקשר» → сохранение заблокировано, ошибка у поля, остальные значения на месте @desktop @prod-safe (#ebdb2f · #6a993d7890d7492f45ebdb2f)
**Device:** desktop · **Users:** business
**Steps:** 1. /settings/business (PATCH businesses перехвачен и обрывается). 2. Очистить поле → «שמירת שינויים». (Два теста: по одному на поле.)
**Expected:** алерт «השינויים לא נשמרו» + «חסרים פרטים בטופס. השדות המסומנים דורשים תיקון.»; у поля aria-invalid и «יש להזין את שם העסק» / «יש להזין את תפקיד איש הקשר», фокус; один invalid; остальные значения без изменений; PATCH 0; URL тот же (AC5; решение 14.10).

#### 1.3 BSET-003: изоляция — чужой бизнес: GET → [], PATCH → 200 [] @desktop (#ebdb2f · #6a993d7890d7492f45ebdb2f)
**Device:** desktop · **Users:** business
**Steps:** 1. GET businesses (без фильтра) → 1 своя строка. 2. GET businesses?id=eq.b0d2a797… (QA-PILOT-1410). 3. PATCH того же id телом {name: «QA-PILOT-1410»} (его же имя).
**Expected:** 200 [] и 200 [] — 0 строк (F-10 «רק העסק שלו», факт 22.10). Окружение: QA_EBDB2F_FOREIGN_ID / QA_EBDB2F_FOREIGN_NAME.

#### 1.4 BSET-004: he → en → «פרטי העסק נשמרו»; новая симуляция на английском; активные без изменений @desktop @data (#ebdb2f · #6a993d7890d7492f45ebdb2f)
**Device:** desktop · **Users:** business
**Steps:** 1. Запомнить активные симуляции. 2. «שפת ברירת מחדל» = אנגלית → «שמירת שינויים». 3. Дашборд. 4. /simulations/new?start=scratch (без сохранения). 5. Активные симуляции. 6. finally — вернуть исходный язык (PATCH своего бизнеса).
**Expected:** PATCH default_language=en; «/» + «פרטי העסק נשמרו» с именем бизнеса (S-06 выход); «שפת הסימולציה» = אנגלית, disabled, «נעולה על שפת ברירת המחדל של העסק.»; языки активных симуляций прежние (AC2).
**Данные:** язык общего бизнеса testim на время теста = en → не параллелить с simulation-editor / созданием кандидатов. Исходный язык обязан быть he (иначе тест падает с просьбой вернуть вручную).

**File:** tests/business-settings/settings-business-ebdb2f.spec.ts · кейсы BSET-001…004

### 2. Настройки бизнеса — пилот (#ebdb2f)
**Seed:** — (storageState `.qa/auth/pilotmgr.json`, слот ручной)

#### 2.1 BSET-005: пилот — «אנגלית» недоступна, подсказка «חשבון פיילוט — עברית…», «מכסת סימולציות · פיילוט» @desktop @prod-safe (#ebdb2f · #6a993d7890d7492f45ebdb2f)
**Device:** desktop · **Users:** pilotmgr
**Steps:** 1. (admin вручную включает is_pilot у QA-PILOT-1410.) 2. /settings/business.
**Expected:** option en disabled; описание select — «חשבון פיילוט — עברית. שפה נוספת נפתחת רק בסימון של צוות הפלטפורמה.»; заголовок квоты «מכסת סימולציות · פיילוט» (факт 22.10).
**Запуск:** только `QA_PILOT=1`; если бизнес не пилот — skip. Иначе — ручной кейс BSET-005.
**File:** tests/business-settings/pilot-language-locked-ebdb2f.spec.ts

### 3. Настройки бизнеса — отказ מנהל/ת מגייס/ת (#ebdb2f)
**Seed:** `tests/seed.user.spec.ts`

#### 3.1 BSET-006: /settings/business → «אין לכם גישה לעמוד הזה», формы нет, данные не запрашиваются, «חזרה לדשבורד» → / @desktop @prod-safe (#ebdb2f · #6a993d7890d7492f45ebdb2f)
**Device:** desktop · **Users:** user (מנהל/ת מגייס/ת)
**Steps:** 1. /settings/business напрямую. 2. «חזרה לדשבורד».
**Expected:** access-denied, «אין לכם גישה לעמוד הזה», «…פנו למנהל החשבון בעסק שלכם.»; нет полей/квоты; нет запроса businesses с contact_role/candidate_legal_text; нет ссылки «הגדרות»; переход на «/» (AC4, FL-10 шаг 2).
**File:** tests/business-settings/recruiter-denied-ebdb2f.spec.ts

**Не автоматизировано:** AC1 (новое имя/контакт на экранах кандидата и в письме-приглашении — общие данные + почта); BSET-005 без включённого пилота — вручную.

### 4. Настройки бизнеса — נוסח משפטי: цвета предупреждения и ошибок (#358c8d) (записано autotest-writer вручную 04.11, тесты не запускались)
**Seed:** `tests/seed.business.spec.ts` / `tests/seed.user.spec.ts` (в файле: fixture `asUser`, окно 1440×900)
Файл: tests/business-settings/legal-text-alert-358c8d.spec.ts. Все записи перехватываются и обрываются → @prod-safe.
ОГРАНИЧЕНИЕ: 4.1 требует бизнес БЕЗ נוסח — такого слота нет (QA-EMPTY-0411 проверялся в Chrome пользователя, в нём уже сохранён нוסח; в testim нוסח есть) → 4.1 пропускается (test.skip), пока не задан QA_358C8D_ROLE со слотом бизнеса без נוסח. «После сохранения нוסח подсказка исчезает» не автоматизировано (нужно сохранение в пустой бизнес). Ошибка длины окрашена #FFB4AB (находка 04.11) — цвет не проверяется.

#### 4.1 без נוסח: «עדיין לא נשמר נוסח משפטי…» цветом #E9967F, значок «!» белый @desktop @prod-safe (#358c8d · #6a993d68bfba343d96358c8d)
**Device:** desktop
**Users:** business без נוסח (QA_358C8D_ROLE)
**Steps:**
1. /settings/business; если поле נוסח не пустое — skip.
**Expected:**
- Текст подсказки rgb(233, 150, 127); значок — только #FFFFFF (источник: реджект 21.10, Figma 869:10340).

#### 4.2 регресс: пустое «תפקיד איש הקשר» → ошибка коралловая #E9967F со значком #E9967F @desktop @prod-safe (#358c8d · #6a993d68bfba343d96358c8d)
**Device:** desktop
**Users:** business
**Steps:**
1. Очистить «תפקיד איש הקשר» → «שמירת שינויים».
**Expected:**
- «יש להזין את תפקיד איש הקשר» цветом rgb(233, 150, 127), значок #E9967F; записи на сервер нет (источник: ответ программиста 02.11 «ошибки полей остаются коралловыми»).

#### 4.3 регресс: נוסח 3001 знак → «הנוסח ארוך מדי», сохранение не проходит @desktop @prod-safe (#358c8d · #6a993d68bfba343d96358c8d)
**Device:** desktop
**Users:** business
**Steps:**
1. Ввести 3001 знак «QA-AUTO-358c8d …» → «שמירת שינויים» → перезагрузка.
**Expected:**
- Счётчик 3001 / 3000, «הנוסח ארוך מדי», записи нет, после перезагрузки прежний текст (источник: лимит 3000, S-06).

#### 4.4 регресс: user → /settings/business — отказ «403» @desktop @prod-safe (#358c8d · #6a993d68bfba343d96358c8d)
**Device:** desktop
**Users:** user
**Steps:**
1. /settings/business.
**Expected:**
- access-denied с «403» и «אין לכם גישה לעמוד הזה»; поля נוסח нет (источник: S-06 AC5 / D-26).
