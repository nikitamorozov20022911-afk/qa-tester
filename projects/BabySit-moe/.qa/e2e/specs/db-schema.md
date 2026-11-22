<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# DB schema smoke — עיצוב סכמת בסיס הנתונים ומידול הישויות

План автотестов для `playwright-test-generator` (тесты API-уровня внутри браузера). Источник: тикет #83cd0c «עיצוב סכמת בסיס הנתונים ומידול הישויות» (task, planning, AC пустые; Т1–Т3 по описанию: ERD-таблицы и связи между הורים / בייביסיטרים / ילדים / בקשות / הזמנות), бриф `.qa/research/83cd0c.md`, модель данных «מפרט» (14 сущностей).
Сайт: https://babysit-qa.expo.app · Supabase project `zfiwjkrsabqwolxblnux` (REST: `https://zfiwjkrsabqwolxblnux.supabase.co/rest/v1/<table>`).

**Это схема-смоук (наличие таблиц и связей), а НЕ проверка бизнес-логики.** Не проверяем: значения и статусы, типы колонок, NOT NULL, enum/check, ON DELETE, индексы, уникальности, RLS-политики (RLS и права по ролям — #7e1f76, см. `.qa/research/7e1f76.md`), содержимое строк. Проверяем только: таблица существует и отвечает 200/206 (не 404 / PGRST205), и ключевые FK разрешаются через embedding.

**У фичи нет UI.** Проверка — GET через `fetch` из страницы (`page.evaluate` / `browser_evaluate`) к `/rest/v1/<table>`. Только метод `GET`, ничего не пишем → все тесты `@prod-safe`. Устройство значения не имеет → `@desktop`, один прогон.
Сессия: **admin** (`.qa/auth/admin.json`). Токен — из `localStorage['sb-zfiwjkrsabqwolxblnux-auth-token']` (JSON, поле `access_token`; подтягивается через storageState). Заголовки: `Authorization: Bearer <access_token>`, `apikey: <публичный anon key>` (взять из запроса самого приложения к `*.supabase.co` через `page.waitForRequest` либо из env `SUPABASE_ANON_KEY`; в план не вписывать).
Хелпер: открыть `/` под сессией admin (чтобы появился origin с `localStorage`), затем `page.evaluate` с `fetch` и вернуть `{status, contentRange, body}`.
Admin-токен выбран, чтобы `chat_messages` и `referral_codes` (для anon — `401 permission denied`) тоже были доступны; при RLS допустим пустой массив `[]` — для смоука важен статус, не число строк.

**Таблиц 15, сущностей «מפרט» 14:** `request_children` (M:N запрос↔дети) — расширение схемы, в документе отдельной сущности нет (бриф 83cd0c, п. 3). Включена, т.к. входит в ключевую связку ребёнка с запросом.
**Расхождение формы хранения (не проверяем, не реджект):** у ChildProfile вместо `age` хранится `year_of_birth` (бриф 83cd0c, конфликт 2) — решает пользователь.

### 1. DB schema smoke — наличие таблиц и связей (#83cd0c)
**Seed:** `tests/seed.admin.spec.ts` (admin@).

#### 1.1 Все 15 таблиц схемы отвечают 200/206 на GET, не 404 (#83cd0c) `@desktop` `@prod-safe`
**Device:** desktop
**Users:** admin
**Seed:** `tests/seed.admin.spec.ts`
**Steps:**
1. Под сессией admin открыть `/` (чтобы появился токен в `localStorage`).
2. Для каждой таблицы из списка выполнить `GET /rest/v1/<table>?select=*&limit=1` с заголовками `Authorization: Bearer <access_token>`, `apikey`. (Допустимая замена: `limit=0` + `Prefer: count=exact` и чтение `Content-Range`.)
   Список (15): `profiles`, `child_profiles`, `requests`, `request_interests`, `request_children`, `bookings`, `reviews`, `problem_reports`, `location_events`, `chat_messages`, `packages`, `pricing`, `referral_codes`, `availability`, `external_references`.
3. По каждой записать HTTP-статус и (если JSON) тело.
**Expected:**
- Для каждой из 15 таблиц статус **200 или 206**; ни одна не отвечает 404 / код PostgREST `PGRST205` «Could not find the table». (источник: Т1 — таблицы ERD существуют; 14 сущностей «מפרט» + `request_children`.)
- Тело — JSON-массив (`[]` допустим: строки могут быть скрыты RLS или данных нет). Тест не сверяет число и содержимое строк. (источник: Т1/Т3 — проверяем наличие, не данные.)
- Нет ответов 401/403 `permission denied` под admin для `chat_messages` и `referral_codes`. (источник: бриф 83cd0c — для anon они закрыты; под admin-токеном таблица должна быть видна. Если всё же 401/403 — остановиться и сообщить, не подгонять ожидание: это вопрос прав #7e1f76, а не наличия таблицы.)
- Каждый вызов оформлен отдельным `expect` с именем таблицы в сообщении, чтобы падение показывало, какой именно таблицы нет. (качество теста.)

#### 1.2 Ключевые FK через embedding: child_profiles → profiles, bookings → requests (#83cd0c) `@desktop` `@prod-safe`
**Device:** desktop
**Users:** admin
**Seed:** `tests/seed.admin.spec.ts`
**Steps:**
1. Под сессией admin открыть `/`.
2. Выполнить `GET /rest/v1/child_profiles?select=id,profiles(id)&limit=1`.
3. Выполнить `GET /rest/v1/bookings?select=id,requests(id)&limit=1`.
4. Для каждого ответа прочитать статус и (при ошибке) поле `code` тела.
**Expected:**
- Оба запроса — статус **200** (или 206), тело — JSON-массив. (источник: Т2 — связи между הורים/ילדים и בקשות/הזמנות; бриф 83cd0c, E2 — FK `child_profiles→profiles` (parent_id) и `bookings→requests` подтверждены embedding.)
- Нет `PGRST200` («Could not find a relationship») и нет `PGRST201` (неоднозначная связь >1 FK). (источник: бриф — отсутствие FK даёт PGRST200; для этих двух пар FK единственный.)
- Если строк нет (`[]`) — тест всё равно проходит: embedding проверяет, что связь определена в схеме, а не наличие данных. (источник: бриф E2 — связи проверяются по схеме; #54bd25 ещё в работе, реальных bookings может не быть.)

#### 1.3 Остальные связи цепочки ERD разрешаются через embedding (#83cd0c) `@desktop` `@prod-safe`
**Device:** desktop
**Users:** admin
**Seed:** `tests/seed.admin.spec.ts`
**Steps:**
1. Под сессией admin открыть `/`.
2. Выполнить GET с embedding (`&limit=1`), по одному на связь:
   - `request_interests?select=id,requests(id)` (interest → request);
   - `request_children?select=request_id,child_profiles(id)` (запрос ↔ ребёнок);
   - `requests?select=id,profiles!requests_parent_id_fkey(id)` (request → parent; к `profiles` у `requests` больше одного FK — поэтому явный hint `requests_parent_id_fkey`);
   - `reviews?select=id,bookings(id)`, `location_events?select=id,bookings(id)`, `problem_reports?select=id,bookings(id)` (→ booking);
   - `availability?select=id,profiles(id)`, `pricing?select=id,profiles(id)`, `external_references?select=id,profiles(id)` (→ profile).
3. По каждому запросу прочитать статус и `code` ошибки.
**Expected:**
- Каждый запрос — статус 200/206 и массив в теле; ни `PGRST200`, ни `PGRST201`. (источник: Т2 — связи заданы; бриф 83cd0c, таблица связей «FK, проверено embedding».)
- Связи `bookings` и `request_interests` с `profiles` (`parent_id`/`sitter_id`) и прямая связь `bookings→request_interests` здесь **не проверяются**: у `bookings→request_interests` FK нет (PGRST200 — норма, бриф), а sitter_id-FK подлежат отдельной проверке с явным именем FK, которое в брифе не зафиксировано. (граница смоука.)
- Если какое-либо имя FK/связи в живой схеме отличается от брифа (PGRST200/PGRST201 на запросе, где бриф ожидал успех) — остановиться и сообщить, не подгонять запрос или ожидание. (правило «поведение расходится с кейсом».)

### Не включено в план
- Значения и enum статусов Request (`open|last_minute|confirmed|closed`) и Booking (`confirmed|completed|cancelled`) — это бизнес-данные (бриф E4, нужны реальные записи), не наличие схемы.
- Таблицы за пределами 14 сущностей: `booking_cancellation_reasons`, `notifications`, `expo_push_tokens`, view `public_sitter_profiles` / `sitter_open_requests` — расширение, в документе нет (бриф, конфликт 3).
- Доступ по ролям, RLS, раскрытие phone/чувствительных полей ребёнка (D-13, D-24, D-25) — #7e1f76 и #83472d.
- OpenAPI `GET /rest/v1/` — закрыт для не-service_role, полной схемы снаружи не получить (бриф).
- Типы колонок, NOT NULL, ON DELETE, индексы, уникальность «один Booking на Request» — только в коде/миграциях; вопрос программисту (ERD/ссылка на миграции).
