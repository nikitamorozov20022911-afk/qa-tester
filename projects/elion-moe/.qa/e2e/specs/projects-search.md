# /projects — высота поля поиска — план автотестов

Тикет: #6ee502 (שיפור) «/projects search field is 36px tall on phones».
Источник ожиданий: AC тикета (`.qa/research/6ee502.md`): «שדה החיפוש ב-/projects בגובה 44px לפחות ברוחב מתחת ל-sm» · «הגובה בדסקטופ אינו משתנה»; комментарий программиста — на ≥640px 36px, в линию с кнопками Country / Developer / Status. Проверено вручную на qa-stand, «прошли» подтверждено пользователем 2026-11-15. Отдельного файла кейсов в `.qa/tests/` нет — ожидания взяты из AC.

## Окружение — только qa-stand (пока)
- Фикс есть только на qa-stand `https://elion-git-qa-stand-aviels-projects.vercel.app` (на prod до мержа ещё 36px — не баг). `baseUrl` проекта (prod) не меняется.
- Seed `tests/seed.admin-stand.spec.ts`; каждый сгенерированный файл повторяет `test.use({ baseURL: 'https://elion-git-qa-stand-aviels-projects.vercel.app', storageState: '../auth/admin-stand.json' })`, переход — `page.goto('/projects')`. `/projects` — за логином (страница недвижимости, не `/financial-projects`).
- Сессия `.qa/auth/admin-stand.json` — сохраняется только вручную: `cd .qa/e2e && ../bin/with-node22 npm run qa-login:manual -- admin-stand`.
- Тесты только смотрят и измеряют (без `@data`). Не `@prod-safe`, пока фикс не на prod. После мержа в main — перевести на prod: убрать `baseURL`/`storageState` стенда (seed `tests/seed.admin.spec.ts`) и добавить `@prod-safe`.

## Как измерять
- Высота — `boundingBox()` обёртки поля поиска (элемент с рамкой вокруг `getByRole('textbox' | 'searchbox', { name: /search/i })`, не сам `<input>`), с допуском ±0.5px.
- «В линию» — у поля и кнопок Country / Developer / Status (`getByRole('button', { name: … })`) совпадают `y` и `height` (±1px).
- Ждать результат через `expect(...)` / `expect.poll`, без `waitForTimeout` и `networkidle`.

---

### 1. Поле поиска /projects
**Seed:** `tests/seed.admin-stand.spec.ts`

#### 1.1 Поле поиска на телефоне 44px @mobile (#6ee502)
**Device:** mobile (прогоны iPhone 13 Mini — 375px и Pixel 7 — 412px; обе ширины ниже sm = 640px). Если нужен ровно 375×812 — в файле `test.use({ viewport: { width: 375, height: 812 } })`.
**Users:** admin (`admin-stand`)
**Steps:**
1. Открыть `/projects`.
2. Дождаться, что поле поиска видно.
3. Измерить высоту обёртки поля поиска и её ширину относительно окна.
**Expected:**
- Высота поля поиска ≥ 44px (AC1 #6ee502 «בגובה 44px לפחות ברוחב מתחת ל-sm»).
- Поле не обрезано: правый край ≤ ширины окна, на странице нет горизонтальной прокрутки (`document.documentElement.scrollWidth <= innerWidth`) (S-06 «המסך מותאם לנייד ולדסקטופ»).

#### 1.2 Поле поиска на десктопе 36px, в линию с фильтрами @desktop (#6ee502)
**Device:** desktop (Chrome 1440×900)
**Users:** admin (`admin-stand`)
**Steps:**
1. Открыть `/projects`.
2. Дождаться, что поле поиска и кнопки Country / Developer / Status видны.
3. Измерить высоту и верхний край обёртки поля поиска и каждой из трёх кнопок.
**Expected:**
- Высота поля поиска = 36px (AC2 #6ee502 «הגובה בדסקטופ אינו משתנה»).
- Высота кнопок Country, Developer, Status равна высоте поля поиска, верхний край у всех четырёх совпадает (±1px) — в одной линии (комментарий программиста #6ee502: «36px, в линию с кнопками фильтров»).
