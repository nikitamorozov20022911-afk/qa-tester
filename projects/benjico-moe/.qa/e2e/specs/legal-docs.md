<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: Юридические документы после входа и у гостя (#d7fe2c)

Источник: `.qa/tests/legal-docs.md` (кейсы LD-01…LD-07), тикет #d7fe2c «אחרי כניסה אי אפשר לקרוא את תנאי השימוש» — пользователь провёл `עבר QA` 02.11 (staging https://benjico.expo.app).
«מה רצוי»: «קישור לתנאי השימוש (ולמדיניות) זמין גם להורה מחובר (הגדרות / פרטיות)». Комментарий программиста 01.11: документы открываются под входом, «חזרה» ведёт в настройки, в /privacy добавлена ссылка «תנאי השימוש». AC тикета пустые.
Роли: `parent-b` (сессия `.qa/auth/parent-b.json`, без паролей) и гость (без сессии). Тесты **не выходят из аккаунта и не вводят пароли**.
Устройства: проверка была на Chrome 1280 и iPhone WebKit 390 → десктоп-тесты `@desktop`, iPhone-тест — `@iphone` с окном 390×844 WebKit (`test.use` на уровне файла). Все тесты — только просмотр, данных не создают → `@prod-safe`, без `@data`.

**Expo-роутер.** Скрытые экраны остаются в DOM — все локаторы только по видимым элементам (`.filter({ visible: true })` / `>> visible=true`). «חזרה» — строго `text=/^→ חזרה$/ >> visible=true` (иначе находится скрытый «→ חזרה להגדרות»).
Без фиксированных пауз и `networkidle`: только `expect(...)`, `waitForURL`.

**Кто пишет.** MCP `playwright-test` в этой сессии отключён → `playwright-test-generator` недоступен; тесты записаны запасным путём (`autotest-writer`) в `tests/legal-docs/`. Селекторы взяты из скриншотов проверки 02.11 (`.qa/screenshots/d7fe2c-*`), в браузере при записи не проходились — при первом `/qa-regress` возможна правка селекторов через `playwright-test-healer` (без изменения смысла проверок).

---

### 1. Юридические документы — родитель под входом
**Seed:** `tests/seed.parent-b.spec.ts`

#### 1.1 Условия использования открываются под входом и переживают перезагрузку @desktop @prod-safe #d7fe2c
**Device:** desktop
**Users:** parent-b
**File:** `tests/legal-docs/terms-logged-in-reload.spec.ts` (LD-01)
**Steps:**
1. Открыть `/consent?doc=terms`.
2. Перезагрузить страницу.
**Expected:**
- До и после перезагрузки адрес остаётся `/consent?doc=terms` (нет перехода на `/children`) («מה קיים» шаг 2 → «מה רצוי»).
- Видимый заголовок «תנאי השימוש», видны раздел «מה זה Benjico» (текст документа) и контакт `support@benjico.ai` (#c3aa39; F-01 «דרך לפנות לתמיכה»).

#### 1.2 Политика конфиденциальности открывается под входом и переживает перезагрузку @desktop @prod-safe #d7fe2c
**Device:** desktop
**Users:** parent-b
**File:** `tests/legal-docs/privacy-logged-in-reload.spec.ts` (LD-02)
**Steps:**
1. Открыть `/consent?doc=privacy`.
2. Перезагрузить страницу.
**Expected:**
- Адрес остаётся `/consent?doc=privacy`.
- Видимый заголовок «מדיניות הפרטיות» и раздел «אילו נתונים נשמרים» («מה רצוי» «(ולמדיניות)»).

#### 1.3 Путь к условиям из настроек: /settings → /privacy → «תנאי השימוש» @desktop @prod-safe #d7fe2c
**Device:** desktop
**Users:** parent-b
**File:** `tests/legal-docs/settings-privacy-terms-path.spec.ts` (LD-03)
**Steps:**
1. Открыть `/settings`.
2. Нажать «מדיניות פרטיות ותנאי שימוש» (блок «פרטיות ונתונים», Figma E7 178-4459).
3. На `/privacy` в карточке «מדיניות הפרטיות» нажать «תנאי השימוש».
**Expected:**
- После шага 2 адрес `/privacy`, видна ссылка «תנאי השימוש».
- После шага 3 адрес `/consent?doc=terms`, видимый заголовок «תנאי השימוש» и раздел «מה זה Benjico» («מה רצוי» «(הגדרות / פרטיות)»; комментарий 01.11).

#### 1.4 «→ חזרה» с условий, открытых из /privacy, возвращает на /privacy @desktop @prod-safe #d7fe2c
**Device:** desktop
**Users:** parent-b
**File:** `tests/legal-docs/back-button.spec.ts` (LD-04, часть 1)
**Steps:**
1. Открыть `/privacy` → «תנאי השימוש».
2. На `/consent?doc=terms` нажать «→ חזרה» (`text=/^→ חזרה$/ >> visible=true`).
**Expected:**
- Адрес `/privacy`, видна ссылка «תנאי השימוש» (кейс LD-04, проверено 02.11).

#### 1.5 «→ חזרה» с условий, открытых прямой ссылкой, ведёт в /settings @desktop @prod-safe #d7fe2c
**Device:** desktop
**Users:** parent-b
**File:** `tests/legal-docs/back-button.spec.ts` (LD-04, часть 2)
**Steps:**
1. Открыть `/consent?doc=terms` напрямую (нет истории).
2. Нажать «→ חזרה».
**Expected:**
- Адрес `/settings` (комментарий 01.11 «'חזרה' מחזיר להגדרות»), виден пункт «מדיניות פרטיות ותנאי שימוש».

#### 1.6 После документа вход не теряется: /consent?doc=terms → /children @desktop @prod-safe #d7fe2c
**Device:** desktop
**Users:** parent-b
**File:** `tests/legal-docs/session-kept-after-doc.spec.ts` (LD-07)
**Steps:**
1. Открыть `/consent?doc=terms`, дождаться заголовка «תנאי השימוש».
2. Открыть `/children`.
**Expected:**
- Адрес остаётся в зоне `/children` (у parent-b детей нет → допустимо `/children/new`), перехода на `/sign-in` нет; виден экран родителя (кейс LD-07).

### 2. Юридические документы — гость (регресс ссылок регистрации)
**Seed:** `tests/seed.spec.ts`

#### 2.1 Гость: «תנאי השימוש» из регистрации открывается, «→ חזרה» возвращает на /sign-up @desktop @prod-safe #d7fe2c
**Device:** desktop
**Users:** guest
**File:** `tests/legal-docs/guest-sign-up-docs.spec.ts` (LD-05)
**Steps:**
1. Открыть `/sign-up`, нажать «תנאי השימוש».
2. Нажать «→ חזרה».
**Expected:**
- После шага 1 адрес `/consent?doc=terms`, видимый заголовок «תנאי השימוש» (F-15 «השלמת הרשמה מחייבת אישור תנאי שימוש ומדיניות פרטיות»; #f8756c).
- После шага 2 адрес `/sign-up`.

#### 2.2 Гость: «מדיניות הפרטיות» из регистрации открывается, «→ חזרה» возвращает на /sign-up @desktop @prod-safe #d7fe2c
**Device:** desktop
**Users:** guest
**File:** `tests/legal-docs/guest-sign-up-docs.spec.ts` (LD-05)
**Steps:**
1. Открыть `/sign-up`, нажать «מדיניות הפרטיות».
2. Нажать «→ חזרה».
**Expected:**
- После шага 1 адрес `/consent?doc=privacy`, видимый заголовок «מדיניות הפרטיות».
- После шага 2 адрес `/sign-up`.

### 3. Юридические документы — iPhone 390
**Seed:** `tests/seed.parent-b.spec.ts`

#### 3.1 iPhone 390: оба документа под входом, без горизонтальной прокрутки, RTL @iphone @prod-safe #d7fe2c
**Device:** iphone (WebKit, окно 390×844 через `test.use` в файле)
**Users:** parent-b
**File:** `tests/legal-docs/iphone-390-rtl.spec.ts` (LD-06; заодно LD-01/LD-02 на iPhone — баг был и на iPhone)
**Steps:**
1. Открыть `/consent?doc=terms`.
2. Открыть `/consent?doc=privacy`.
**Expected:**
- На каждом документе адрес остаётся `/consent?doc=…`, видимый заголовок документа.
- `document.documentElement.scrollWidth` = 390 (нет горизонтальной прокрутки).
- Направление текста заголовка — `rtl` (computed `direction`).

---

Не автоматизировано: неверный `doc=` (D4) и режим ребёнка (С1) — не входят в кейсы LD-01…LD-07; содержание документов — черновик (F-01), не проверяется.
