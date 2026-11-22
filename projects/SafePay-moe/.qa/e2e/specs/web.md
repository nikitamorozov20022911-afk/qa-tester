<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: веб-оболочка (web)

Источник: кейсы `.qa/tests/web/WEB-001…005`, тикеты #6aab..36f, #6aab..370, #094049fc, #6aac..85c0, #25cd5bd0 (QA 12.10.2026, Chrome, client 0500000004; все подтверждены bug-verifier, «עבר QA» — пользователь 12.10).
Аккаунт: client (`tests/seed.client.spec.ts`, сессия `auth/client.json`).
Только просмотр: формы не отправляются, ничего не удаляется и не сохраняется → все тесты `@prod-safe`, без `@data`.
Устройство: кейсы проверены на 375 и 1440 → без пометки устройства (прогоны desktop 1440, iPhone 13 Mini, Pixel 7).
Неустойчивые данные не хардкодить: «первая сделка клиента» — id из первой строки `/deals` (URL после клика `/deals/<uuid>`); «поставщик из списка» — id первой карточки на `/providers` (из URL его страницы).
Ожидания — без фиксированных пауз: `expect(...)`, `waitForURL`.

### 1. Веб-оболочка
**Seed:** `tests/seed.client.spec.ts`

#### 1.1 מעטפת: lang="he" dir="rtl" ו-title SafePay בכל מסלול, 404 ו-/_sitemap → ארנק @prod-safe (#6aab..36f)
**Device:** all
**Users:** client
**Steps:**
1. Через `page.request.get()` получить исходный HTML (до JS) маршрутов `/`, `/wallet`, `/notifications`, `/deals/edit?id=<первая сделка клиента>`.
2. `page.goto('/wallet')`, дождаться отрисовки экрана кошелька.
3. Client-side навигация: вкладка «עסקאות» → вкладка «פרופיל» → вкладка «ארנק» → колокольчик (`getByTestId('notifications-button')`) → URL `/notifications`. После каждого перехода прочитать `document.documentElement.lang`, `.dir`, `document.title`.
4. `page.goto('/no-such-page')`.
5. `page.goto('/_sitemap')`.
**Expected:**
- в исходном HTML каждого маршрута: тег `<html` с `lang="he"` и `dir="rtl"`; `<title …>SafePay</title>` (тикет T2: «lang="he" dir="rtl" ושם המוצר בכותרת (SafePay)»)
- в DOM после гидрации и после каждой client-side навигации: `lang === "he"`, `dir === "rtl"`, `document.title === "SafePay"` (T2; комментарий программиста 07.10)
- `/no-such-page` → `waitForURL(/\/wallet$/)`; `/_sitemap` → `waitForURL(/\/wallet$/)` (комментарий 07.10: «כתובת לא קיימת ו-/_sitemap מובילות למסך הבית»)

#### 1.2 חץ החזרה בכניסה ישירה מ-URL חוזר למסך האב @prod-safe (#6aab..370)
**Device:** all
**Users:** client
**Steps:**
1. Для каждой пары открыть **новую страницу** (`context.newPage()`, пустая история) и `goto` на маршрут, затем нажать «חזרה» (`getByTestId('back-button')`):
   - `/notifications` → ждать `/wallet`
   - `/wallet/load` → ждать `/wallet`
   - `/wallet/transfer` → ждать `/wallet`
   - `/profile/edit` → ждать `/profile`
   - `/deals/new` → ждать `/deals`
2. Из приложения: `/wallet` → колокольчик → `/notifications` → «חזרה».
**Expected:**
- на `/notifications` видны фильтры «הכל», «ממתין לפעולה», «עסקאות», «ארנק» (S-12 AC1)
- после «חזרה» URL соответствует паре из шага 1 (T2: «router.replace('/(tabs)/wallet') כ-fallback כאשר אין היסטוריה»; комментарий 07.10 «בכל המסכים»)
- при навигации из приложения «חזרה» → `/wallet` (предыдущий экран)
- не открывать «יצירת פרופיל» — стрелка там выходит из аккаунта и ломает общую сессию

#### 1.3 טעינה ישירה ורענון של מסלולים עם search params — 0 שגיאות קונסול @prod-safe (#094049fc)
**Device:** all
**Users:** client
**Steps:**
1. Подготовка (без изменения данных): `/deals` → первая строка → запомнить `<dealId>` из URL; `/providers` → первая карточка → запомнить `<providerId>` из URL; вернуться.
2. Подписаться на `page.on('console')` (type `error`) и `page.on('pageerror')`; очищать список перед каждым маршрутом.
3. Для каждого маршрута — `page.goto(url)`, дождаться отрисовки (корень не пустой, виден текст экрана), затем `page.reload()` и снова дождаться отрисовки:
   `/deals/new?providerId=<providerId>`, `/providers/reviews?id=<providerId>`, `/providers/created?id=<providerId>`, `/providers/edit?id=<providerId>`, `/providers/profile?id=<providerId>`, `/deals/dispute?id=<dealId>&track=ai`, `/deals/proposal?id=<dealId>`, `/deals/edit?id=<dealId>`, `/deals/terms?id=<dealId>`, `/deals/chat?id=<dealId>`, `/deals/rate?id=<dealId>`, `/wallet/success`.
4. Ничего не заполнять и не нажимать кнопки отправки.
**Expected:**
- 0 console errors и 0 pageerror на каждой загрузке и после обновления (T1: «טעינה ישירה ורענון … — 0 שגיאות קונסול»)
- ни одно сообщение не содержит «#418» / «Hydration» (Current тикета)

#### 1.4 פוקוס בשדה טקסט — בלי outline של הדפדפן, מסגרת #159AED @prod-safe (#6aac..85c0)
**Device:** all
**Users:** client
**Steps:**
1. `/providers` → клик по полю поиска в пилюле (`getByRole('textbox')` / placeholder поиска).
2. `/deals/new` → клик по первому текстовому полю формы.
3. `/profile/edit` → клик по первому текстовому полю.
4. Для каждого поля через `evaluate`: `getComputedStyle(input).outlineStyle` / `outlineWidth`; ближайший предок с `borderTopWidth ≥ 1px` — его `borderTopColor`. Ничего не вводить и не сохранять.
**Expected:**
- поле в фокусе (`toBeFocused()`)
- у `input` `outlineStyle === "none"` или `outlineWidth === "0px"` — нет кольца `rgb(0, 95, 204)` (T1/T2 тикета)
- рамка родителя `rgb(21, 154, 237)` (#159AED) — проверять через `expect.poll` (рамка меняется после фокуса) (T1; комментарий 07.10)

#### 1.5 אזורי לחיצה בווב — שכבות -hit לפחות 44×44 @prod-safe (#25cd5bd0)
**Device:** all
**Users:** client
**Steps:**
Для каждого контрола — `boundingBox()` его слоя `-hit` (`[data-testid="<control>-hit"]` или `[data-testid$="-hit"]` внутри контрола — точное имя генератор уточняет в живом браузере). Ничего не нажимать, кроме открытия экранов/листов.
1. `/wallet`: `tab-wallet-hit`, `tab-deals-hit`, `tab-providers-hit`, `tab-profile-hit`, `notifications-button-hit`.
2. `/notifications`: чипы `chip-all`, `chip-action_required`, `chip-deals`, `chip-wallet` (их `-hit`).
3. `/providers`: ввести текст в поиск (без отправки) → `provider-search-submit`, `provider-search-clear`; кнопка фильтра; открыть фильтр → чипы фильтра и «נקה/י הכל» (`provider-filter-clear`); закрыть фильтр без применения.
4. Экран способов оплаты (из профиля/кошелька): значки удаления карт `payment-card-*-delete` — не нажимать.
5. `/wallet/transfer`: ввести цифры в поле телефона (без отправки) → `transfer-phone-clear`.
6. Первая сделка клиента (`/deals` → первая строка): `back-button`, `deal-menu`.
7. `/deals/rate?id=<первая сделка>`: `rate-star-1` … `rate-star-5` — не нажимать, не отправлять.
8. `/deals/new`: `clause-check-0` — не нажимать.
**Expected:**
- для каждого перечисленного слоя `width >= 44` и `height >= 44` (T2 тикета: «אזור הלחיצה של כל אחד מהפקדים שברשימה הוא 44×44 לפחות»)
- если у аккаунта нет карт — шаг 4 пропускается с `test.info().annotations` (не падать), остальное проверяется
- не проверять: строки согласия «פרטי כרטיס» (38, исключение P4 — ждёт решения дизайна); визуальный размер иконок («בלי לשנות את המראה» — сверка глазами)
