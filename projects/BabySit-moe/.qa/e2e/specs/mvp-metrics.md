<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# MVP measurement — מדידה (admin_mvp_metrics RPC)

План автотестов для `playwright-test-generator` (тесты API-уровня внутри браузера). Источник: тикет #a89273 «מדידה — MVP measurement» (фича F-13, AC=1 DoD: 5 групп §30, **18 метрик**; D-01, D-33), бриф `.qa/research/a89273.md` и снимок реального ответа `.qa/screenshots/a89273-rpc-admin-mvp-metrics.json`.
Сайт: https://babysit-qa.expo.app · Supabase project `zfiwjkrsabqwolxblnux` (REST: `https://zfiwjkrsabqwolxblnux.supabase.co/rest/v1/rpc/admin_mvp_metrics`).
**У фичи нет UI.** Проверка — вызов RPC `admin_mvp_metrics` через `fetch` из страницы (`page.evaluate` / `browser_evaluate`), метод `POST`, тело `{}`.
Токен: из сессии — `localStorage['sb-zfiwjkrsabqwolxblnux-auth-token']` (JSON, поле `access_token`; для сессий `.qa/auth/<role>.json` он подтягивается через storageState). Заголовки: `Authorization: Bearer <access_token>`, `apikey: <публичный anon key>` (взять из запроса самого приложения к `*.supabase.co`, например через `page.waitForRequest`, либо из env `SUPABASE_ANON_KEY`; в план не вписывать). Для анонима — только `apikey` (anon key как Bearer), без пользовательского токена.
Хелпер для всех тестов: открыть `/` с нужной сессией (для origin с `localStorage`), затем `page.evaluate` с `fetch` и вернуть `{status, body}`.
Все проверки — **только чтение** (RPC не меняет данные) → `@prod-safe`. Устройство значения не имеет (нет UI) → `@desktop` один прогон (ответ не зависит от viewport).
Числовые значения метрик **не проверяем** (D-01: цели не критерий; данные меняются от активности) — только структуру, число, группы, статусы и доступ.
Имена 18 метрик в документации не заданы (открытый пункт Д2), поэтому на конкретные `metric_key` опираемся только там, где это нужно: `gross_booking_value` (зафиксирован программистом).
Имена полей в снимке — сокращённые (`g/k/num/den/awaits`); реальные колонки RPC — `metric_group`, `metric_key`, `unit`, `value`, `numerator`, `denominator`, `status` (так в тикете/задании); тест сверяет реальный ответ, при расхождении имён — остановиться и сообщить, не подгонять ожидание.

### 1. MVP measurement — RPC admin_mvp_metrics (#a89273)
**Seed:** `tests/seed.admin.spec.ts` (admin@); для негатива — `tests/seed.parent-verified.spec.ts`, `tests/seed.sitter-experienced.spec.ts`, `tests/seed.spec.ts` (гость).

#### 1.1 Админ: RPC возвращает 18 метрик в 5 группах 4/4/4/3/3 (#a89273) `@desktop` `@prod-safe`
**Device:** desktop
**Users:** admin
**Seed:** `tests/seed.admin.spec.ts`
**Steps:**
1. Под сессией admin открыть `/` (чтобы появился токен в `localStorage`).
2. Из страницы выполнить `POST /rest/v1/rpc/admin_mvp_metrics` с телом `{}`, заголовки `Authorization: Bearer <access_token>`, `apikey`, `Content-Type: application/json`.
3. Разобрать JSON-ответ (массив строк), сгруппировать по `metric_group`.
**Expected:**
- HTTP 200, тело — массив из **ровно 18** строк. (источник: AC1/DoD «18 מדדים»; Т2.)
- Присутствуют ровно 5 групп: `acquisition`, `marketplace`, `booking`, `quality`, `retention`; других групп нет. (источник: AC1 — §30 пять групп; Т1.)
- Размеры групп: acquisition = 4, marketplace = 4, booking = 4, quality = 3, retention = 3. (источник: коммент программиста; DoD.)
- Все пары `(metric_group, metric_key)` уникальны (нет дублей метрик). (источник: Т2 — 18 различных метрик.)

#### 1.2 Админ: структура строки — 7 полей, без target/goal (#a89273) `@desktop` `@prod-safe`
**Device:** desktop
**Users:** admin
**Seed:** `tests/seed.admin.spec.ts`
**Steps:**
1. Под сессией admin вызвать RPC `admin_mvp_metrics` как в 1.1.
2. Для каждой из 18 строк прочитать набор ключей и типы значений.
**Expected:**
- В каждой строке присутствуют поля `metric_group`, `metric_key`, `unit`, `value`, `numerator`, `denominator`, `status`. (источник: коммент — «каждая — value, numerator, denominator»; задание.)
- `metric_group`, `metric_key`, `unit`, `status` — непустые строки; `value`/`numerator`/`denominator` — число или `null` (не строка). (источник: структура ответа; снимок a89273.)
- `status` принимает только значения из набора `measured` / `awaits_source`. (источник: снимок ответа — 17 `measured`, 1 `awaits_source`.)
- **Нет** ни одного поля с именем, содержащим `target` или `goal`, ни в одной строке. (источник: D-01 / Т3 — числовые цели не включаются; «без числовых целей».)

#### 1.3 Админ: gross_booking_value — value=null и status="awaits_source", не 0 (#a89273) `@desktop` `@prod-safe`
**Device:** desktop
**Users:** admin
**Seed:** `tests/seed.admin.spec.ts`
**Steps:**
1. Под сессией admin вызвать RPC `admin_mvp_metrics`.
2. Найти строку `metric_key = "gross_booking_value"` (группа `booking`).
**Expected:**
- Такая строка ровно одна и лежит в группе `booking`. (источник: коммент; снимок ответа, p=12.)
- `value === null` (строго `null`, не `0`, не `"0"`, не `undefined`). (источник: Т5 — «НИКОГДА не показывается как 0»; коммент «Gross booking value возвращает пусто».)
- `status === "awaits_source"`. (источник: коммент — «waits for the payment provider»; снимок ответа.)
- `numerator === null` и `denominator === null`; `unit === "money"`. (источник: снимок ответа — все три пустые, unit money.)

#### 1.4 Родитель (parent-verified): RPC → 403 (#a89273) `@desktop` `@prod-safe`
**Device:** desktop
**Users:** parent-verified
**Seed:** `tests/seed.parent-verified.spec.ts`
**Steps:**
1. Под сессией parent-verified открыть `/` и взять `access_token` из `localStorage['sb-zfiwjkrsabqwolxblnux-auth-token']`.
2. Выполнить `POST /rest/v1/rpc/admin_mvp_metrics` с телом `{}` и токеном родителя.
**Expected:**
- HTTP-статус ответа **403**. (источник: Т4 — доступ только admin; коммент «Родитель … отказ».)
- Тело ответа не содержит строк метрик (нет массива из 18 элементов, нет `metric_key`). (источник: Т4 — отказ без утечки данных.)

#### 1.5 Ситтер (sitter-experienced): RPC → 403 (#a89273) `@desktop` `@prod-safe`
**Device:** desktop
**Users:** sitter-experienced
**Seed:** `tests/seed.sitter-experienced.spec.ts`
**Steps:**
1. Под сессией sitter-experienced открыть `/` и взять `access_token` из `localStorage['sb-zfiwjkrsabqwolxblnux-auth-token']`.
2. Выполнить `POST /rest/v1/rpc/admin_mvp_metrics` с телом `{}` и токеном ситтера.
**Expected:**
- HTTP-статус ответа **403**. (источник: Т4; коммент «бейбиситтер … отказ».)
- Тело ответа не содержит строк метрик. (источник: Т4.)

#### 1.6 Аноним (без входа): RPC → 401 (#a89273) `@desktop` `@prod-safe`
**Device:** desktop
**Users:** guest
**Seed:** `tests/seed.spec.ts`
**Steps:**
1. Без входа открыть `/` (гость, в `localStorage` нет токена пользователя).
2. Выполнить `POST /rest/v1/rpc/admin_mvp_metrics` с телом `{}`, только заголовок `apikey` (anon key), без пользовательского `Authorization`.
**Expected:**
- HTTP-статус ответа **401**. (источник: Т4; коммент «разлогиненный — отказ».)
- Тело ответа не содержит строк метрик. (источник: Т4.)

### Заметки для генератора
- Тесты 1.1–1.3 используют один и тот же вызов — допустимо один раз вызвать RPC в `beforeAll`/helper на файл и переиспользовать ответ (только чтение); для `serial` не нужен.
- Не использовать `waitForTimeout`/`networkidle`: ждать результат `fetch` через `await`/`expect`. Не логировать и не сохранять токен/`apikey` в отчёт и скриншоты.
- Запрет на изменение данных: тест не вызывает никаких мутирующих RPC/таблиц; префикс `QA-AUTO-` не нужен (данные не создаются).
- Среда: миграции sprint-3 должны быть применены к staging (иначе RPC → 404 «function not found» — это окружение, не баг теста; сообщить).
- В план **не включены**: проверка значений/целей метрик (D-01), конкретные имена 18 метрик (открытый пункт Д2), блок «request с отменённым booking = filled» и lifetime vs неделя/месяц (решения владельца, не AC).
