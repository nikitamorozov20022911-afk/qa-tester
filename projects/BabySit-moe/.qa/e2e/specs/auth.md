<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Auth — אימות והרשאות

План автотестов для официального `playwright-test-generator`. Источник: тикет #7e1f76 (TASK, AC пустые — ожидаемое из «תיאור» + `privacy_security`/`roles.md`) и бриф `.qa/research/7e1f76.md`.
Сайт: https://babysit-qa.expo.app · he-IL (RTL). Сессии ролей — `.qa/auth/<role>.json`.
Все проверки, кроме API-негатива, — только чтение/навигация → `@prod-safe`.
Примечание по URL с id: для гостя/чужой роли гард срабатывает ДО загрузки данных, поэтому `/bookings/<id>`, `/children/<id>` проверяем с заведомо несуществующим id (`qa-nonexistent`) — записи не создаём и не читаем.

### 1. Auth — доступ по ролям (#7e1f76)
**Seed:** `tests/seed.spec.ts` (гость); для ролей — соответствующий `tests/seed.<role>.spec.ts` по полю **Users**.

#### 1.1 Гость: закрытые URL → редирект на `/` (#7e1f76)
**Device:** all (без пометки)
**Users:** guest
**Seed:** `tests/seed.spec.ts`
**Steps:**
1. Без входа открыть напрямую `/home`.
2. Проверить адрес и содержимое, затем так же открыть по очереди: `/profile`, `/dashboard`, `/requests/new`, `/bookings/qa-nonexistent`, `/children/qa-nonexistent`.
**Expected:**
- После каждого перехода адрес становится `/` (экран welcome/вход), а не запрошенный путь — дождаться `waitForURL('/')`. (источник: тикет «הגנה על נתיבי API»; гарды `RouteGuard`, группа `(app)` audience `signed-in` → `Redirect "/"`.)
- Защищённого контента нет: на странице виден вход/приветствие, нет данных профиля/дашборда/списка детей/заказов.

#### 1.2 Родитель: чужая зона → свой стартовый экран (#7e1f76)
**Device:** all (без пометки)
**Users:** parent-verified
**Seed:** `tests/seed.parent-verified.spec.ts`
**Steps:**
1. Под сессией родителя открыть `/dashboard` (зона admin).
2. Затем открыть `/requests/new` (зона sitter) и `/sitter-home`.
**Expected:**
- Каждый раз пользователя уводит на родительский стартовый экран `/home` (`waitForURL('/home')`), админку/зону ситтера он не видит. (источник: тикет «ניהול גישה מותאמת תפקיד»; группы `(admin)`/`(sitter)` → роль не совпала → `Redirect "/"` → `/` → index-редирект parent → `/home`.)

#### 1.3 Ситтер: родительская зона и создание запроса → свой стартовый экран (#7e1f76)
**Device:** all (без пометки)
**Users:** sitter-experienced
**Seed:** `tests/seed.sitter-experienced.spec.ts`
**Steps:**
1. Под сессией ситтера открыть `/requests/new` (создание запроса — действие родителя).
2. Затем открыть `/home` и `/children/qa-nonexistent` (родительские экраны).
**Expected:**
- Каждый раз уводит на стартовый экран ситтера `/sitter-home` (`waitForURL('/sitter-home')`); форма создания запроса и родительские экраны недоступны. (источник: тикет «ניהול גישה מותאמת תפקיד»; группа `(parent)` → роль не совпала → редирект.)

#### 1.4 Админ: родительские экраны → `/dashboard` (#7e1f76)
**Device:** all (без пометки)
**Users:** admin
**Seed:** `tests/seed.admin.spec.ts`
**Steps:**
1. Под сессией админа открыть `/home`.
2. Затем открыть `/sitter-home`.
**Expected:**
- Каждый раз уводит на экран админа `/dashboard` (`waitForURL('/dashboard')`); родительские/ситтер-экраны не показываются. (источник: тикет «ניהול גישה מותאמת תפקיד»; index-редирект: иная роль → `/dashboard`.)

#### 1.5 Вошедший на `/sign-in`, `/sign-up` → свой экран (#7e1f76)
**Device:** all (без пометки)
**Users:** parent-verified
**Seed:** `tests/seed.parent-verified.spec.ts`
**Steps:**
1. Под сессией родителя открыть `/sign-in`.
2. Затем открыть `/sign-up`.
**Expected:**
- Оба раза уводит с экрана входа на стартовый экран родителя `/home` (`waitForURL('/home')`); поля входа/регистрации не показываются. (источник: группа `(auth)` audience `signed-out` → вошедшего редиректит.)

#### 1.6 API: самоповышение роли/статуса клиентом → отклонено (#7e1f76)
**Device:** all (без пометки) — тест на уровне API, устройство не влияет
**Users:** parent-verified
**Seed:** `tests/seed.parent-verified.spec.ts`
**Внимание:** это попытка ЗАПИСИ, поэтому НЕ `@prod-safe`. Запрос идёт на СВОЙ профиль и ДОЛЖЕН быть отклонён — данные не меняются, аккаунты/записи не создаём. Если запрос неожиданно прошёл — тест обязан это зафиксировать как падение (роль изменилась) и откатить обратно (`role:'parent'`, `verification_status` — исходное).
**Steps:**
1. В авторизованной сессии взять access-token родителя (ключ Supabase-auth в `localStorage`) и его `id`.
2. Отправить `PATCH {baseURL Supabase}/rest/v1/profiles?id=eq.<self-id>` с заголовками `Authorization: Bearer <token>`, `apikey: <anon>`, `Prefer: return=representation`, тело `{"role":"admin"}`.
3. Повторить с телом `{"verification_status":"approved"}`.
4. Перечитать свой профиль: `GET /rest/v1/profiles?id=eq.<self-id>&select=role,verification_status`.
**Expected:**
- Оба PATCH отклонены: ответ 401/403 (или 200 с пустым массивом = 0 изменённых строк). (источник: тикет «ניהול גישה מותאמת תפקיד»; ключ ошибки `auth.errors.privilegedColumn`, серверный запрет привилегированных колонок + RLS.)
- Перечитанный профиль без изменений: `role` = `parent`, `verification_status` = исходное значение (не `approved`).
