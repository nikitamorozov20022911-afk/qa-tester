# План автотестов: design-system

Источник: `.qa/tests/design-system/DS-001..003.md`. Гость, только просмотр — безопасно для прода.

### 1. Дизайн-система — типографика, касания, цвета
**Seed:** `tests/seed.spec.ts`

#### 1.1 Line-height текстовых стилей совпадает с Figma #22865e77 @iphone @prod-safe
**Device:** iphone
**Users:** guest
**Steps:**
1. Открыть `/design`.
2. Для образца каждого текстового стиля (Display, Heading, Title, Numeric, Button, Label, Body, Meta, Badge) снять computed `fontSize` и `lineHeight` через `evaluate(getComputedStyle)`.
**Expected:** (источник: AC #22865e77 / Figma)
- Display 36px / 37px; Heading 28/34; Title 20/20; Numeric 20/20; Button 18/24; Label 16/20; Body 16/22; Meta 14/18; Badge 12/16.

#### 1.2 Зоны касания на гостевых экранах не меньше 44×44 #22865e77 @iphone @prod-safe
**Device:** iphone
**Users:** guest
**Steps:**
1. По очереди открыть `/welcome`, `/sign-in`, `/sign-up`, `/design`.
2. На каждом экране собрать все видимые кнопки и ссылки (`getByRole('button')`, `getByRole('link')`) и снять их `boundingBox()`.
3. Отдельно проверить: «שכחתי סיסמה?», «הרשמה», «כניסה», кнопку показа пароля (глаз), «הכל»; в знакомстве (`/welcome`) — «דילוג».
**Expected:** (источник: AC #22865e77 — минимальная зона касания 44×44)
- Нет видимых кнопок/ссылок с шириной или высотой < 44px.
- «שכחתי סיסמה?», «הרשמה», «כניסה», глаз, «הכל» — ≥44×44; «דילוג» — высота ≥44.

#### 1.3 Красный только из палитры Figma, нет #D92D20 #22865e77 @iphone @prod-safe
**Device:** iphone
**Users:** guest
**Steps:**
1. По очереди открыть `/welcome`, `/sign-in`, `/sign-up`, `/design`.
2. На каждом экране собрать computed `color`, `backgroundColor`, `borderColor` всех видимых элементов.
**Expected:** (источник: AC #22865e77 / Figma)
- Значение `rgb(217, 45, 32)` (#D92D20) не встречается ни на одном экране.
- Все красные оттенки — только `rgb(232, 76, 71)` (#E84C47) или `rgb(253, 99, 94)` (#FD635E).
