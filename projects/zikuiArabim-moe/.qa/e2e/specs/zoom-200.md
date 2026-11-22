<!-- Plan: zoom-200 (WEB). Source cases: .qa/tests/zoom-200/Z2-01 … Z2-08. Tickets #63e34a, #db5c46 (עבר QA 08.11), #d73fd4, #ebcfa6, #67d710, #43ca04, #3be8ad, #a4899f (עבר QA 09.11). -->
<!-- WEB-эквивалент «зума 200%»: viewport 195×422 (390×844 / 2) — как наша проверка 08.11 на https://zichui-harabim.expo.app; у разработчика ещё 178 pt (нами не проверялось — в план не входит). -->
<!-- Основной регресс этих тикетов — НА ТЕЛЕФОНЕ: .qa/app-e2e/specs/qa-0911/ (Android, wm density 840 → reset), см. .qa/app-e2e/COVERAGE-0911.md. Эти web-тесты — дополнительные, помечены @web. -->
<!-- Все тесты @prod-safe (только чтение DOM), @android (проект Chrome Pixel 7) с переопределением viewport: test.use({ viewport: ZOOM200_VIEWPORT }). -->
<!-- Замеры — из tests/_helpers/text-layout.ts: textLayout() → lines / brokenWords / ellipsized / рамка; insideViewportX(); boxesOverlap(); placeholderFits(); noHorizontalScroll(). -->
<!-- Внимание генератору: #63e34a и #db5c46 проверены на вебе 195 px 08.11. Остальные 6 тикетов (#d73fd4 активная «תפילות», #ebcfa6 … #a4899f) были найдены и проверены на Android; на вебе 195 они не проверялись. Если в живом браузере факт расходится с «Expected» — НЕ подгонять ожидание, остановиться и сообщить. -->
<!-- Сессия user1 (.qa/auth/user1.json): refresh token Supabase одноразовый — после использования пересохранить состояние. -->

### 1. Зум 200% (web 195 px) — читаемость текста
**Seed:** `tests/seed.user1.spec.ts`

#### 1.1 Z2-01 Заголовки /prayers, /zmanim, /tehilim/3, /profile целиком в 195 px #63e34a @web @android @prod-safe
**Device:** android (viewport 195×422)
**Users:** user1
**Steps:**
1. `test.use({ viewport: ZOOM200_VIEWPORT })`.
2. По очереди открыть `/prayers`, `/zmanim`, `/tehilim/3`, `/profile`.
3. На каждом взять `getByRole('heading', { level: 1 })` (ожидаемые тексты: «תפילות», «זמני תפילות», «תהילים ג׳», «פרופיל אישי») и вызвать `textLayout()`.
**Expected:**
- Текст заголовка равен ожидаемому; `ellipsized === false` (нет «…»); `brokenWords` пуст; `insideViewportX` true; `lines` ≤ числа слов (источник: AC #63e34a «הכותרת של /prayers, /zmanim, /tehilim/[chapter] ו-/profile מוצגת במלואה ואינה נחתכת לשלוש נקודות»).
- `noHorizontalScroll(page)` true.

#### 1.2 Z2-01 Заголовки /lessons и экрана урока переносятся между словами в 195 px #63e34a @web @android @prod-safe
**Device:** android (viewport 195×422)
**Users:** user1
**Steps:**
1. Открыть `/lessons`; заголовок h1 «שיעורי תורה» → `textLayout()`.
2. Нажать первую строку урока в списке → экран `/lessons/<item>`; заголовок h1 → `textLayout()`.
**Expected:**
- Оба заголовка: `ellipsized === false`, `brokenWords` пуст, `insideViewportX` true («שיעורי / תורה» — допустимо 2 строки) (источник: описание #63e34a «הוסרה מגבלת השורה כך שהכותרת נשברת לשתי שורות» для /lessons и /lessons/[item]).

#### 1.3 Z2-02 Строки списков /lessons и /tehilim — широкая колонка заголовка, без разрыва по 2–3 буквы #db5c46 @web @android @prod-safe
**Device:** android (viewport 195×422)
**Users:** user1
**Steps:**
1. Открыть `/lessons`; взять текст заголовка первой строки урока (кнопка строки → её текст названия) → `textLayout()` и ширину рамки.
2. Открыть `/tehilim`; для первых 5 строк глав — текст строки (название/описание главы) → `textLayout()` и ширину рамки.
**Expected:**
- Ширина колонки заголовка ≥ 70 px (было ~27 pt) (источник: AC #db5c46 «מציגה את כותרתה ברוחב שמאפשר קריאה רציפה»).
- `brokenWords` пуст — текст не рвётся каждые 2–3 буквы (источник: AC #db5c46 «ולא נשברת כל שתיים-שלוש אותיות»).

#### 1.4 Z2-03 Подписи нижней навигации не рвутся внутри слова — каждая вкладка активная по очереди #d73fd4 @web @android @prod-safe
**Device:** android (viewport 195×422)
**Users:** user1
**Steps:**
1. Открыть `/home`.
2. По очереди нажать в нижней навигации «תהילים», «תפילות», «בית», «המסע שלי», «ברכות» (активная — жирная).
3. После каждого нажатия для всех 5 подписей вызвать `textLayout()`.
**Expected:**
- У всех 5 подписей при любой активной вкладке `brokenWords` пуст, `ellipsized === false`, `insideViewportX` true; однословные — `lines === 1` (источник: AC #d73fd4 «תוויות הלשוניות בסרגל הניווט התחתון אינן נשברות באמצע מילה»).
- Соседние подписи не пересекаются (`boxesOverlap` false).

#### 1.5 Z2-04 Заголовок «היסטוריית התפילות שלי» переносится только между словами #ebcfa6 @web @android @prod-safe
**Device:** android (viewport 195×422)
**Users:** user1
**Steps:**
1. Открыть `/journey/history`.
2. Заголовок h1 «היסטוריית התפילות שלי» → `textLayout()`.
**Expected:**
- `brokenWords` пуст (нет «היסטו / ריית», «ה / תפילות»), `ellipsized === false`, `lines` ≤ 3, `insideViewportX` true (источник: «מה רצוי» #ebcfa6 «הכותרת נשברת לשורות רק בין מילים … בלי לפצל מילה»).

#### 1.6 Z2-05 «המסע שלי»: «דרגה N מתוך 10» и шапка внутри экрана #67d710 @web @android @prod-safe
**Device:** android (viewport 195×422)
**Users:** user1 (уровень зависит от аккаунта — у user1 на 08.11 «דרגה 10 מתוך 10»; окно «עלית דרגה» подавить как в jr-01: `suppressMilestoneWindow`)
**Steps:**
1. Открыть `/journey`.
2. Найти `getByText(/דרגה \d+ מתוך 10/)` → `textLayout()`.
3. Кнопка шапки «מעבר לפרטים שלי» и все её потомки-иконки → рамки.
**Expected:**
- Текст «דרגה N מתוך 10» целиком: `insideViewportX` true, `brokenWords` пуст, `ellipsized === false` (источник: «מה רצוי» #67d710 «כל הטקסט נשאר בתוך המסך … ו«דרגה 1 מתוך 10» נקרא במלואו»).
- Рамки элементов шапки внутри окна по ширине; `noHorizontalScroll` true (источник: «מה קיים» #67d710 — «הסמל השמאלי בכותרת העליונה נחתך בקצה»).

#### 1.7 Z2-06 «פרופיל אישי»: у каждой строки виден и заголовок, и значение #43ca04 @web @android @prod-safe
**Device:** android (viewport 195×422)
**Users:** user1
**Steps:**
1. Открыть `/profile`.
2. Для «נוסח תפילה», «תאריך לידה», «מיקום», «היעד שלי», «רמת התחזקות»: кнопка `getByRole('button', { name: /^<поле>: (.+)\. מעבר לשלב כדי לשנות$/ })` → значение из имени; внутри кнопки `getByText(<значение>)` → `textLayout()`.
**Expected:**
- Значение видно (`toBeVisible`), `ellipsized === false` (не «..»), `insideViewportX` true, `brokenWords` пуст; заголовок поля тоже видим (источник: «מה רצוי» #43ca04 «בכל שורה מוצגים גם הכותרת וגם הערך … בלי שהערך ייעלם או יקוצר לנקודות»).

#### 1.8 Z2-07 Список ברכות и поиск: «נטילת ידים והמוציא», «חיפוש ברכה», «חיפוש לפי מספר פרק או מילים» целиком #3be8ad @web @android @prod-safe
**Device:** android (viewport 195×422)
**Users:** user1
**Steps:**
1. Открыть `/blessings`; строка «נטילת ידים והמוציא» → `textLayout()`; поле поиска с placeholder «חיפוש ברכה» → `placeholderFits()`.
2. Открыть `/tehilim`; поле поиска с placeholder «חיפוש לפי מספר פרק או מילים» → `placeholderFits()`.
**Expected:**
- «נטילת ידים והמוציא»: `ellipsized === false`, `brokenWords` пуст (перенос только между словами) (источник: «מה רצוי» #3be8ad «שם הברכה ברשימה מוצג במלואו (נשבר לשורות בין מילים…)»).
- Оба placeholder: `fits === true` (источник: «מה רצוי» #3be8ad «ה-placeholder של החיפוש נקרא במלואו»).

#### 1.9 Z2-08 תהילים ג׳: «פרק ב׳», «ג׳», «פרק ד׳» в навигации глав не налезают друг на друга #a4899f @web @android @prod-safe
**Device:** android (viewport 195×422)
**Users:** user1
**Steps:**
1. Открыть `/tehilim/3`.
2. В полосе навигации глав внизу взять «פרק ב׳», текущую «ג׳» (на одной высоте с соседями, не заголовок «תהילים ג׳»), «פרק ד׳».
**Expected:**
- Попарно `boxesOverlap` false; у «פרק ב׳» и «פרק ד׳» `ellipsized === false` и `insideViewportX` true (источник: «מה רצוי» #a4899f «הכפתורים «פרק קודם», הפרק הנוכחי ו«פרק הבא» לא עולים זה על זה, והטקסטים נקראים במלואם»).

<!-- Не входит: шрифт устройства 1.15 (только Android), iPhone (зум не управляется из теста), ширина 178 pt (нами не проверялась). -->
