<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: вход — экран, ошибки, блокировка, сброс пароля, выход и истечение сессии (#6a993d794918a5e83bc3231b)

> Тикет #c3231b «פיתוח: התחברות מאובטחת, שחזור סיסמה וניהול סשן» — עבר QA 14.10.2026. Кейсы: .qa/tests/auth-login/AUTH-LG-001…009.
> Все тесты записаны autotest-writer вручную (официальный генератор в проекте падает «seed test not found»; часть сценариев — с подменой ответов Supabase Auth).
> Паролей нет: вход — только сохранёнными сессиями .qa/auth/*.json; неудачные входы — на несуществующий qa-nonexistent@example.test.
> Реальных неудачных входов за прогон — 1 (лимит Supabase 30 / 5 мин по IP общий с другими тестами); остальные — подмена ответа.
> Не дублирует: tests/auth-routing (возврат после входа, /login под вошедшим, 404), tests/business-lifecycle/no-self-registration (нет регистрации),
> tests/user-access/logout-old-token (отзыв токена на сервере после выхода).
> Только десктоп (урок: экраны бизнеса — без телефонов).

### 1. Экран входа
**Seed:** `tests/seed.spec.ts`

#### 1.1 гость: /login — dir=rtl, фокус в «מייל», видимый фокус по Tab, вход по приглашению @desktop @prod-safe (#6a993d794918a5e83bc3231b · #172fd7d688f4438bdadda900)
> #dda900 (עבר QA 21.10): фокус в «מייל» при загрузке и текст «הכניסה בהזמנה בלבד…» — те же проверки, отдельный тест не нужен.
**Device:** desktop
**Users:** guest
**Steps:**
1. Открыть /login.
2. Нажимать Tab: «סיסמה» → «הצגה» → «שכחתי סיסמה» → «כניסה».
**Expected:**
- `<html dir="rtl" lang="he">`, direction формы rtl (AC6).
- h1 «כניסה לחשבון»; фокус при загрузке в «מייל» (type=email, autocomplete=username), поле пустое (FL-05).
- Каждый элемент по Tab — `:focus-visible` и видимая обводка (outline или box-shadow) (AC6).
- Текст «הכניסה בהזמנה בלבד. אין לכם חשבון? בקשו הזמנה ממנהל החשבון בעסק.»; «שכחתי סיסמה» → /forgot-password; «פנייה לתמיכה» — mailto:; ссылок регистрации нет (FL-05, FL-08).
**File:** tests/auth-login/login-screen-rtl-focus.spec.ts

### 2. Неверные данные и защита от подбора
**Seed:** `tests/seed.spec.ts`

#### 2.1 гость: несуществующий адрес → «המייל או הסיסמה שגויים», почта в поле, 400 invalid_credentials @desktop @data (#6a993d794918a5e83bc3231b)
**Device:** desktop
**Users:** guest
**Steps:**
1. /login → «מייל» qa-nonexistent@example.test, «סיסמה» неверная → «כניסה» (одна РЕАЛЬНАЯ попытка).
**Expected:**
- Ответ /auth/v1/token 400, code `invalid_credentials` (общий код, не раскрывает существование адреса).
- Плашка `login-error`: «המייל או הסיסמה שגויים» / «בדקו את הפרטים ונסו שוב. אם שכחתם את הסיסמה, אפשר לאפס אותה.» (AC2).
- «מייל» = введённый адрес; остаёмся на /login (AC2).
- Очистка: `login-lock.v1` удалён.
**File:** tests/auth-login/wrong-credentials-uniform-error.spec.ts

#### 2.2 гость: 5 неудач → «יותר מדי ניסיונות כניסה» на 5 мин, сохраняется после перезагрузки, снимается по истечении @desktop @prod-safe (#6a993d794918a5e83bc3231b)
**Device:** desktop
**Users:** guest
**Steps:**
1. Подменить ответ входа: 400 invalid_credentials.
2. 4 попытки → 5-я → Enter в поле пароля → перезагрузка.
3. `login-lock.v1.lockedUntil` в прошлое → перезагрузка.
**Expected:**
- 1–4: «המייל או הסיסמה שגויים», кнопка «כניסה» активна, failures = 1…4.
- После 5-й: `login-rate-limited` «יותר מדי ניסיונות כניסה» / «מטעמי אבטחה הכניסה נחסמה זמנית…»; кнопка неактивна «אפשר לנסות שוב בעוד m:ss»; lockedUntil ≈ сейчас + 300 000 мс; 6-й запрос не отправлен (треб.7; решение пользователя 14.10).
- После перезагрузки — блокировка та же; после истечения — «כניסה» активна, ключа нет.
**File:** tests/auth-login/lockout-5-attempts.spec.ts

#### 2.3 гость: ответ сервера 429 (лимит по IP) → сразу «יותר מדי ניסיונות כניסה», кнопка заблокирована @desktop @prod-safe (#6a993d794918a5e83bc3231b)
**Device:** desktop
**Users:** guest
**Steps:**
1. Подменить ответ входа: 429 over_request_rate_limit; одна попытка.
**Expected:**
- Плашка блокировки, кнопка неактивна, `login-error` нет, lockedUntil ≈ сейчас + 5 мин (треб.7, лимит Supabase 30/5 мин).
- Очистка: `login-lock.v1` удалён.
**File:** tests/auth-login/lockout-5-attempts.spec.ts

### 3. Восстановление пароля
**Seed:** `tests/seed.spec.ts`

#### 3.1 гость: несуществующий адрес → «בדקו את תיבת המייל», без ошибки @desktop (#6a993d794918a5e83bc3231b)
**Device:** desktop
**Users:** guest
**Steps:**
1. /login → «שכחתי סיסמה» → /forgot-password (h1 «איפוס סיסמה»).
2. «מייל» qa-nonexistent@example.test → «שליחת קישור לאיפוס».
**Expected:**
- /auth/v1/recover 200; h1 «בדקו את תיבת המייל»; «אם המייל רשום במערכת, שלחנו אליו קישור… תקף למשך 30 דקות ולשימוש אחד בלבד.»; «המייל שהזנתם» + адрес; `recovery-failed` нет (AC3).
**File:** tests/auth-login/forgot-password-same-message.spec.ts

#### 3.2 гость: существующий и несуществующий адрес — одинаковый экран и статус ответа @desktop @data @reset-mail (#6a993d794918a5e83bc3231b)
**Device:** desktop
**Users:** guest (два окна)
**Steps:**
1. Как 3.1 для qa-nonexistent@example.test.
2. Как 3.1 для тестового существующего адреса @example.com (QA_USER_PASSPEND_EMAIL) — ОТПРАВЛЯЕТ ПИСЬМО.
**Expected:**
- Статус /auth/v1/recover и текст экрана (без адреса) совпадают (AC3 «ההודעה במסך זהה גם כאשר המייל אינו קיים»).
- Запуск только с `QA_RUN_RESET_MAIL=1`, не чаще 1 раза за прогон (лимит писем Supabase).
**File:** tests/auth-login/forgot-password-same-message.spec.ts

### 4. Заблокированный бизнес
**Seed:** `tests/seed.spec.ts` (+ сессии admin и blockmgr)

#### 4.1 blockmgr (бизнес заблокирован): «/» → /login?notice=blocked, экран «הכניסה לחשבון חסומה» без формы, ссылка «פנייה לתמיכה» @desktop (#6a993d794918a5e83bc3231b · #af074d)
**Device:** desktop
**Users:** admin (предусловие), blockmgr
**Steps:**
1. admin: карточка бизнеса QA-A Block 0410 — «סטטוס החשבון» содержит «חסום».
2. Обновить сессию blockmgr по refresh_token (запись в .qa/auth/blockmgr.json); выход подменить (204).
3. Открыть «/» с сессией blockmgr.
**Expected:**
- /login?notice=blocked; `account-blocked` (data-reason=unknown): с #af074d (04.11.2026) — отдельный экран «הכניסה לחשבון חסומה» / «החשבון שלכם או החשבון של העסק חסום כרגע, ולכן לא ניתן להיכנס.», `blocked-support` «צוות התמיכה», полей и «כניסה» нет; «פנייה לתמיכה» mailto:simulator@shnaider.pro (AC4, FL-05, Figma 721:1083).
- «התנתקות» нет; выход только scope=local; токен в окне удалён.
**File:** tests/auth-login/blocked-business-support.spec.ts

### 5. Выход и истечение сессии
**Seed:** `tests/seed.user.spec.ts`

#### 5.1 user: «התנתקות» → /login, токен удалён; «назад» и /candidates → снова вход @desktop @prod-safe (#6a993d794918a5e83bc3231b)
**Device:** desktop
**Users:** user
**Steps:**
1. Подменить /auth/v1/logout (204) — общая сессия не отзывается.
2. «/» → /candidates → «התנתקות».
3. «Назад»; затем /candidates напрямую.
**Expected:**
- Выход запрошен с scope=global; /login, h1 «כניסה לחשבון», без «פג תוקף החיבור»; `sb-*-auth-token` удалён (треб.3).
- «Назад» и /candidates → /login (from = /candidates), «התנתקות» нет (AC5).
**File:** tests/auth-login/logout-requires-login.spec.ts

#### 5.2 user: истёкшая сессия на /candidates → /login?notice=expired, «כניסה מחדש», «פג תוקף החיבור», почта подставлена @desktop @prod-safe (#6a993d794918a5e83bc3231b)
**Device:** desktop
**Users:** user
**Steps:**
1. На /favicon.svg (без кода сайта) в localStorage окна: expires_at в прошлом, refresh_token заменён; обновление токена подменено (400).
2. Открыть /candidates.
**Expected:**
- /login?notice=expired, from = /candidates; h1 «כניסה מחדש»; `session-expired` «פג תוקף החיבור» / «מטעמי אבטחה החיבור שלכם הסתיים. היכנסו שוב כדי להמשיך.»; «מייל» = почта user; фокус в «סיסמה»; нет «התנתקות» и вечной загрузки (AC5, Figma 717:1043).
**File:** tests/auth-login/session-expired.spec.ts

### 6. Сообщение по причине отказа — удалённый/заблокированный бизнес и участник (#92bd0e, #922c63) (записано autotest-writer вручную)
**Seed:** `tests/seed.spec.ts` (гость)

> Экран входа берёт причину из адреса `/login?notice=blocked&reason=<deleted|business|removed|user>` (бандл index-BT4tmDRk.js) — тот же
> компонент `account-blocked`, который показывается после выхода из сессии и после отказа на входе. Реальные блокировка/удаление с
> вступившим пользователем — вручную (AUTH-LG-011, AUTH-LG-013, пароль). Только просмотр → @prod-safe. Кейсы AUTH-LG-010, AUTH-LG-012.

#### 6.1 гость: reason=deleted → «החשבון העסקי נמחק… הגישה אליו לא תחזור», без «הגישה לחשבון חסומה» @desktop @prod-safe (#92bd0e · #3a666c3dd8f5b45f7892bd0e)
**Device:** desktop
**Users:** guest
**Steps:**
1. Открыть /login?notice=blocked&reason=deleted.
**Expected:**
- `account-blocked` data-reason=deleted; «החשבון העסקי נמחק» / «החשבון העסקי שהמשתמש שלכם שייך אליו נמחק, והגישה אליו לא תחזור. אם נראה לכם שמדובר בטעות, אפשר לפנות למנהל המערכת דרך התמיכה.»; «פנייה לתמיכה» mailto:; слов «הגישה לחשבון חסומה»/«חסום» нет; «התנתקות» нет (источник: «מה רצוי» #92bd0e).
**File:** tests/auth-login/account-notice-reasons.spec.ts

#### 6.2 гость: reason=business → «הכניסה לחשבון חסומה» (текст кадра 721:1134, с #af074d), без «נמחק» @desktop @prod-safe (#92bd0e · #3a666c3dd8f5b45f7892bd0e · #af074d)
**Device:** desktop
**Users:** guest
**Steps:**
1. Открыть /login?notice=blocked&reason=business.
**Expected:**
- data-reason=business; «הכניסה לחשבון חסומה» / «החשבון שלכם או החשבון של העסק חסום כרגע, ולכן לא ניתן להיכנס. צוות התמיכה יוכל לבדוק מה קרה ולעזור לכם להמשיך.»; «פנייה לתמיכה»; «נמחק» нет (источник: «מה רצוי» #92bd0e; текст заменён по #af074d — заблокированный бизнес и пользователь получают один текст кадра).
**File:** tests/auth-login/account-notice-reasons.spec.ts

#### 6.3 гость: reason=removed → «הגישה לעסק הוסרה… צריך הזמנה חדשה», без «חסום» @desktop @prod-safe (#922c63 · #5121408da9c3e79d47922c63)
**Device:** desktop
**Users:** guest
**Steps:**
1. Открыть /login?notice=blocked&reason=removed.
**Expected:**
- data-reason=removed; «הגישה לעסק הוסרה» / «המשתמש שלכם הוסר מהעסק, ולכן לא ניתן להיכנס. כדי לחזור לעסק צריך הזמנה חדשה ממנהל/ת החשבון בעסק. לשאלות אפשר לפנות לתמיכה.»; «חסום» нет (источник: «מה רצוי» #922c63).
**File:** tests/auth-login/account-notice-reasons.spec.ts

#### 6.4 гость: reason=user → «הכניסה לחשבון חסומה» (текст кадра 721:1134, с #af074d), без «הוסר» @desktop @prod-safe (#922c63 · #5121408da9c3e79d47922c63 · #af074d)
**Device:** desktop
**Users:** guest
**Steps:**
1. Открыть /login?notice=blocked&reason=user.
**Expected:**
- data-reason=user; «הכניסה לחשבון חסומה» / текст кадра 721:1134 (как 6.2); «הוסר» нет (источник: «מה רצוי» #922c63; текст заменён по #af074d).
**File:** tests/auth-login/account-notice-reasons.spec.ts

#### 6.5 гость: без reason → тот же «הכניסה לחשבון חסומה» (контроль, с #af074d) @desktop @prod-safe (#922c63 · #5121408da9c3e79d47922c63 · #af074d)
**Device:** desktop
**Users:** guest
**Steps:**
1. Открыть /login?notice=blocked.
**Expected:**
- data-reason=unknown; «הכניסה לחשבון חסומה» / текст кадра 721:1134 (как 4.1, 6.2).
**File:** tests/auth-login/account-notice-reasons.spec.ts

### 7. Экран «הכניסה לחשבון חסומה» без формы входа (#af074d) (записано autotest-writer вручную)
**Seed:** `tests/seed.spec.ts` (гость)

> Тикет #af074d (17b180ffa7055a7916af074d) — עבר QA 04.11.2026. Экран Figma 721:1083 вместо формы с баннером.
> Тот же экран (`account-blocked`, `data-screen=blocked`) показывается после реального отказа входа — проверено вручную 04.11
> (вход паролем в заблокированный QA-EMPTY-0411); в автотесте — через адрес /login?notice=blocked&reason=…, без паролей.
> Тексты 6.2/6.4/6.5 и 4.1 обновлены под общий текст кадра. 390 — в десктопном прогоне с шириной окна 390 (телефоны — только кандидат).
> Только просмотр → @prod-safe. Файл: tests/auth-login/blocked-screen-af074d.spec.ts.

#### 7.1 гость: reason=user / reason=business → отдельный экран без полей, «צוות התמיכה», mailto, «חזרה לכניסה» → форма @desktop @prod-safe (#af074d · #17b180ffa7055a7916af074d)
**Device:** desktop
**Users:** guest
**Steps:**
1. Открыть /login?notice=blocked&reason=user (затем то же для reason=business).
2. Нажать «חזרה לכניסה».
**Expected:**
- `account-blocked` data-reason=user|business; h1 «הכניסה לחשבון חסומה»; «החשבון שלכם או החשבון של העסק חסום כרגע, ולכן לא ניתן להיכנס. צוות התמיכה יוכל לבדוק מה קרה ולעזור לכם להמשיך.» (AC1, Figma 721:1083).
- Нет полей ввода, «כניסה», «שכחתי סיסמה», «התנתקות»; ссылка «פנייה לתמיכה» ровно одна (AC1; нижняя ссылка панели скрыта).
- `blocked-support`: «צוות התמיכה», «נבדוק את סטטוס החשבון ונחזור אליכם במייל, בדרך כלל תוך יום עסקים אחד.», simulator@shnaider.pro, «עובדים בעסק שחשבונו פעיל? אפשר לפנות גם למנהל החשבון אצלכם.»; «פנייה לתמיכה» href mailto:simulator@shnaider.pro (AC2).
- Шаг 2: экрана нет, h1 «כניסה לחשבון», поля «מייל»/«סיסמה» и «כניסה» видны (AC2); мягко — notice снят с адреса (комментарий программиста).

#### 7.2 гость: reason=removed — та же раскладка с «הגישה לעסק הוסרה», строка про менеджера есть @desktop @prod-safe (#af074d · #17b180ffa7055a7916af074d · #922c63)
**Device:** desktop
**Users:** guest
**Steps:**
1. Открыть /login?notice=blocked&reason=removed.
**Expected:**
- h1 «הגישה לעסק הוסרה», без «הכניסה לחשבון חסומה»; без формы; блок поддержки как 7.1 со строкой про менеджера (комментарий программиста — своя раскладка 721:1083 со своим текстом).

#### 7.3 гость: reason=deleted — та же раскладка с «החשבון העסקי נמחק», без строки про менеджера @desktop @prod-safe (#af074d · #17b180ffa7055a7916af074d · #92bd0e)
**Device:** desktop
**Users:** guest
**Steps:**
1. Открыть /login?notice=blocked&reason=deleted.
**Expected:**
- h1 «החשבון העסקי נמחק»; без формы; блок поддержки без «עובדים בעסק שחשבונו פעיל?…» (у удалённого бизнеса нет менеджера); mailto как 7.1.

#### 7.4 гость, ширина 390: reason=user и reason=business — экран без формы, блок и кнопки в пределах экрана, без горизонтальной прокрутки @desktop @prod-safe (#af074d · #17b180ffa7055a7916af074d)
**Device:** desktop (окно 390×844)
**Users:** guest
**Steps:**
1. Ширина окна 390; открыть /login?notice=blocked&reason=user, затем reason=business.
**Expected:**
- Как 7.1 (заголовок, без формы, блок поддержки, mailto); scrollWidth − clientWidth ≤ 1; `blocked-support`, «פנייה לתמיכה», «חזרה לכניסה» целиком в пределах 0…390 (проверка 04.11: 390 ✅).

### Ручные (в автотесты не входят)
- AUTH-LG-002 шаг 2 — неверный пароль для СУЩЕСТВУЮЩЕГО адреса (сравнение ответа) — неудачный вход на реальный аккаунт.
- AUTH-LG-005 — письмо сброса, страница «בחירת סיסמה חדשה», повтор/истечение ссылки (почта, 30 минут).
- AUTH-LG-006 — верный вход с паролем → дашборд роли (частично — tests/auth-routing/login-return.spec.ts).
- AUTH-LG-007 — ввод верного пароля менеджером заблокированного бизнеса (с #af074d — экран «הכניסה לחשבון חסומה», data-reason=business); заблокированный лично пользователь — ввод пароля (#af074d, проверено вручную 04.11 на QA-EMPTY-0411; вход после разблокировки → дашборд).
- Реальный лимит Supabase 30 / 5 мин по IP (исчерпание лимита) и реальное истечение сессии по времени.
- AUTH-LG-011 (#92bd0e) — вступивший менеджер D одноразового QA-бизнеса (temp-mail, пароль вводит пользователь): блокировка бизнеса → «החשבון העסקי אינו פעיל» в сессии и при входе; удаление → «החשבון העסקי נמחק».
- AUTH-LG-013 (#922c63) — вступивший участник R1 (temp-mail): блокировка → «הגישה לחשבון חסומה — המשתמש שלכם חסום כרגע»; удаление из бизнеса → «הגישה לעסק הוסרה» в сессии и при входе.
