<!-- Plan: web-shell. Source case: .qa/tests/web-shell/WS-01. Ticket #6a8edf78. -->
<!-- Все тесты @prod-safe: только чтение document.title и link[rel*=icon]. -->

### 19. Web-оболочка — вошедший пользователь
**Seed:** `tests/seed.user1.spec.ts`

#### 19.1 WS-01 На каждом маршруте user1 document.title не пустой и есть favicon #6a8edf78 @prod-safe @mobile
**Device:** mobile (390)
**Users:** user1
**Steps:**
1. По очереди открыть `/home`, `/journey`, `/journey/history`, `/profile`, `/zmanim`, `/prayers`, `/lessons`, `/tehilim`, `/tehilim/72`, `/prayer/mincha_ashkenaz`, `/blessings`; после загрузки прочитать `document.title` и `link[rel*=icon]`.
**Expected:**
- `document.title` не пустой и содержит «אור הגאולה»; на экранах — «<экран> · אור הגאולה» (напр. «בית · אור הגאולה», «תהילים ע״ב · אור הגאולה»); на `/tehilim` (список) просто «אור הגאולה» — допустимо (источник: AC тикета «Every route has a document title, and a favicon is served.»).
- `link[rel*=icon]` → `/favicon.ico` на каждом маршруте (источник: тот же AC).

### 20. Web-оболочка — гость
**Seed:** `tests/seed.spec.ts`

#### 20.1 WS-01 На каждом гостевом маршруте document.title не пустой и есть favicon #6a8edf78 @prod-safe @mobile
**Device:** mobile (390)
**Users:** guest (чистый контекст)
**Steps:**
1. По очереди открыть `/`, `/phone`, `/register`; после загрузки прочитать `document.title` и `link[rel*=icon]`.
**Expected:**
- `document.title` не пустой и содержит «אור הגאולה» (на `/phone` — «כניסה דרך מספר נייד · אור הגאולה»; на `/` просто «אור הגאולה» — допустимо) (источник: AC тикета).
- `link[rel*=icon]` → `/favicon.ico` на каждом маршруте (источник: AC тикета).
