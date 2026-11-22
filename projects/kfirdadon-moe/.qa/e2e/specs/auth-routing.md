<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: вход и маршрутизация — возврат после входа, 404

> Группы 1–2 — для официального `playwright-test-generator` (одна роль, seed).
> Группа 3 записана autotest-writer вручную: вход формой в собственном окне (данные из .qa/accounts.env,
> генератор пароли не вводит) и несколько ролей через `asUser`. Файл: tests/auth-routing/login-return.spec.ts.

### 1. Гость на защищённой странице
**Seed:** `tests/seed.spec.ts`

#### 1.1 гость на защищённых страницах → /login, from = путь + query, без #hash @desktop @prod-safe (#01649c9c8c436e2d1a46f007)
**Device:** desktop
**Users:** guest
**Steps:**
1. Открыть /settings/users.
2. Дождаться /login; прочитать `history.state.usr.from`.
3. Повторить для /admin/businesses, /admin/providers, /simulations, /candidates?x=1#h.
**Expected:**
- Каждый раз путь /login, h1 «התחברות», поля «כתובת מייל» и «סיסמה», кнопка «התחברות».
- `history.state.usr.from` = '/settings/users', '/admin/businesses', '/admin/providers', '/simulations', '/candidates?x=1' (hash отброшен) (источник: «מה רצוי» — «המשתמש מוחזר לדף שביקש»).

#### 1.2 гость на несуществующем пути → /login, from = /no-such-page @desktop @prod-safe (#01649c9c8c436e2d1a46f007)
**Device:** desktop
**Users:** guest
**Steps:**
1. Открыть /no-such-page.
**Expected:**
- Путь /login, h1 «התחברות»; «המסך לא נמצא» нет; `history.state.usr.from` = '/no-such-page'.

### 2. Страница 404 под ролью
**Seed:** `tests/seed.admin.spec.ts` / `tests/seed.business.spec.ts` / `tests/seed.user.spec.ts`

#### 2.1 admin: 404 — один h1 «המסך לא נמצא», RTL, «חזרה למסך הבית» → /admin/businesses @desktop @prod-safe (#01649c9c8c436e2d1a46f007)
**Device:** desktop
**Users:** admin
**Steps:**
1. Открыть /no-such-page.
**Expected:**
- Ровно один h1, текст «המסך לא נמצא»; computed direction h1 = rtl (источник: «מה רצוי» — «לדף 404 יש כותרת ראשית»).
- Ссылка «חזרה למסך הבית» с href /admin/businesses; клик → /admin/businesses, h1 «בתי העסק».

#### 2.2 business: 404 — один h1 «המסך לא נמצא», RTL, «חזרה למסך הבית» → / @desktop @prod-safe (#01649c9c8c436e2d1a46f007)
**Device:** desktop
**Users:** business
**Steps:**
1. Открыть /no-such-page.
**Expected:**
- Ровно один h1 «המסך לא נמצא», direction rtl.
- Ссылка «חזרה למסך הבית» с href /; клик → «/», h1 начинается с «שלום,».

#### 2.3 user: 404 — один h1 «המסך לא נמצא», RTL, «חזרה למסך הבית» → / @desktop @prod-safe (#01649c9c8c436e2d1a46f007)
**Device:** desktop
**Users:** user
**Steps:**
1. Открыть /no-such-page.
**Expected:**
- Ровно один h1 «המסך לא נמצא», direction rtl.
- Ссылка «חזרה למסך הבית» с href /; клик → «/», h1 начинается с «שלום,».

### 3. Вход — возврат на запрошенную страницу (записано вручную)
**Seed:** `tests/seed.spec.ts` (окно гостя `asUser('guest')`, вход формой; данные входа — .qa/accounts.env)

#### 3.1 business: /settings/users → после входа /settings/users @desktop @prod-safe (#01649c9c8c436e2d1a46f007)
**Device:** desktop
**Users:** guest → business
**Steps:**
1. Гость: /settings/users → /login (from = '/settings/users').
2. «כתובת מייל», «סיסמה» → «התחברות».
**Expected:**
- /settings/users, h1 «משתמשים והזמנות» («מה רצוי»).

#### 3.2 admin: /admin/providers → после входа /admin/providers @desktop @prod-safe (#01649c9c8c436e2d1a46f007)
**Device:** desktop
**Users:** guest → admin
**Steps:**
1. Гость: /admin/providers → /login → вход admin.
**Expected:**
- /admin/providers, нет «המסך לא נמצא».

#### 3.3 business: /admin/businesses (не разрешено) → главная @desktop @prod-safe (#01649c9c8c436e2d1a46f007)
**Device:** desktop
**Users:** guest → business
**Steps:**
1. Гость: /admin/businesses → /login → вход business.
**Expected:**
- «/» того же домена, h1 «שלום, …»; нет «אין לך הרשאה למסך הזה» («…אם מותר לו»; AC F-05).

#### 3.4 user: /settings/users (не разрешено) → главная @desktop @prod-safe (#01649c9c8c436e2d1a46f007)
**Device:** desktop
**Users:** guest → user
**Steps:**
1. Гость: /settings/users → /login → вход user.
**Expected:**
- «/», h1 «שלום, …».

#### 3.5 business: from = 'https://evil.example' и '//evil.example' → главная своего домена @desktop @prod-safe (#01649c9c8c436e2d1a46f007)
**Device:** desktop
**Users:** guest → business
**Steps:**
1. /login; `history.replaceState({usr:{from}}, '', '/login')`; перезагрузить.
2. Вход business.
**Expected:**
- origin сайта, путь «/», h1 «שלום, …» (нет открытого редиректа).

#### 3.6 /login под вошедшим → дашборд роли @desktop @prod-safe (#01649c9c8c436e2d1a46f007)
**Device:** desktop
**Users:** business; user; admin (сохранённые сессии, отдельные тесты)
**Steps:**
1. Открыть /login.
**Expected:**
- business, user → «/», h1 «שלום, …»; admin → /admin/businesses, h1 «בתי העסק» (AC F-05).
