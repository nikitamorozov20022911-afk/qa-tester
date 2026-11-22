# Hard delete + Audit Trail — план автотестов

Тикеты: #f54c1e (hard delete счёта с переводом), #0cd999 (запись hard delete в Audit Trail), #38f51d (Restore у удалений строк Cash Flow).
Кейсы: `.qa/tests/hard-delete-audit.md` (TC-HD-1/2/3), проверены вручную на qa-stand, «прошли» подтверждено пользователем 2026-11-15.

## Окружение — только qa-stand
- Все тесты этого плана идут **только** на qa-stand `https://elion-git-qa-stand-aviels-projects.vercel.app`. Фиксы #0cd999 и #38f51d на prod ещё нет; на prod удалять нельзя (реальные данные клиента). Ни один тест не `@prod-safe`.
- `baseUrl` проекта (`e2e/qa.config.json` = prod) **не меняется**. Стенд задаётся в seed и в каждом файле теста:
  - seed: `tests/seed.admin-stand.spec.ts` — `test.use({ baseURL: 'https://elion-git-qa-stand-aviels-projects.vercel.app', storageState: '../auth/admin-stand.json' })`, `page.goto('/dashboard')`.
  - каждый сгенерированный файл обязан повторить тот же `test.use({ baseURL: <qa-stand>, storageState: '../auth/admin-stand.json' })` — иначе тест уйдёт на prod с `baseURL` из конфига. Переходы — относительными путями (`/dashboard`, `/financial-projects`, `/audit-trail`).
  - страховка в каждом файле: `test.beforeEach` — если хост страницы не `elion-git-qa-stand-…vercel.app`, тест останавливается с ошибкой «только qa-stand», ничего не нажимая.
  - `QA_BASE_URL` для этих тестов не использовать: он переключает весь прогон, а сессия `admin.json` — от prod.
- Сессия: `.qa/auth/admin-stand.json` (слот `admin-stand` в `e2e/accounts.json`). Вход — Cloudflare Turnstile + SMS 2FA, сохраняется только вручную: `cd .qa/e2e && ../bin/with-node22 npm run qa-login:manual -- admin-stand`. Admin должен быть AAL2 (MFA) — иначе «Delete permanently» недоступен. Без файла сессии генерация и прогон невозможны.

## Тестовые данные и очистка
- Имена с префиксом `QA-AUTO` и меткой прогона `<run>` (например, `Date.now().toString(36)`), чтобы остатки упавшего прогона не мешали следующему:
  - счёт «QA-AUTO HD Account <run>» — Bank Account, USD, баланс 9,300;
  - счёт «QA-AUTO HD Peer <run>» — Bank Account, USD, баланс 2,700;
  - строка Cash Flow «QA-AUTO restore row <run>».
- Разрешение на создание/удаление (в т.ч. Delete permanently) своих тестовых сущностей на qa-stand — `context.md`, «Постоянные разрешения». Чужие данные стенда не трогать, чужие записи Audit Trail не восстанавливать.
- Очистка — `test.afterAll` в каждом файле с `@data`: открыть `/financial-projects`, для каждого счёта, имя которого начинается с «QA-AUTO HD» и содержит `<run>` этого файла, — Delete permanently (ввести точное имя → подтвердить). Если счёт уже удалён шагами теста — пропустить. Счета без `QA-AUTO` не трогать никогда.
- Все тесты с `@data` — в файле `test.describe.configure({ mode: 'serial' })`, проект `data` (один поток). Каждый тест **самодостаточен** (сам создаёт свои счета и сам их удаляет): генератор пишет один тест на файл, поэтому общее состояние между файлами не передаётся.

## Правило сверки чисел
- Балансы и Dashboard сверяются **относительно** (снимок до → после), а не с абсолютными числами стенда.
- Большие числа на Dashboard — count-up анимация: читать значение через `expect.poll`, пока два чтения подряд не совпадут (без `waitForTimeout`).
- Стенд общий: если между снимками кто-то другой меняет данные, сверка Dashboard может упасть — при падении сначала смотреть Audit Trail (чужие действия), потом считать багом.

---

### 1. Hard delete + Audit Trail (qa-stand)
**Seed:** `tests/seed.admin-stand.spec.ts`

#### 1.1 Hard delete счёта с переводом убирает перевод и возвращает балансы @desktop @data (#f54c1e)
**Device:** desktop
**Users:** admin (`admin-stand`)
**Steps:**
1. Открыть `/dashboard`, дождаться остановки анимации чисел; запомнить Net worth, Gross, Liquidity (снимок «до»).
2. `/financial-projects` → создать Bank Account «QA-AUTO HD Account <run>», валюта USD, баланс 9,300 → сохранить.
3. Создать Bank Account «QA-AUTO HD Peer <run>», валюта USD, баланс 2,700 → сохранить.
4. На странице «QA-AUTO HD Account <run>» сделать Internal transfer 700 USD → «QA-AUTO HD Peer <run>», отметить Paid → сохранить.
5. Проверить балансы обоих счетов и строки перевода на обеих сторонах.
6. На странице «QA-AUTO HD Account <run>» нажать «Delete permanently».
7. В окне: ввести имя счёта без последнего символа → проверить кнопку подтверждения; дописать имя полностью → проверить кнопку; подтвердить.
8. Открыть страницу «QA-AUTO HD Peer <run>».
9. Открыть `/audit-trail`, найти записи по «QA-AUTO HD Account <run>».
10. Delete permanently «QA-AUTO HD Peer <run>» (ввести точное имя → подтвердить).
11. Открыть `/dashboard`, дождаться остановки анимации; прочитать Net worth, Gross, Liquidity.
**Expected:**
- Шаг 5: баланс Account уменьшился ровно на 700 USD относительно 9,300 (8,600 USD), баланс Peer увеличился ровно на 700 USD относительно 2,700 (3,400 USD); строка перевода видна на обоих счетах (TC-HD-1 п.3).
- Шаг 6: открылось окно подтверждения с пометкой «Administrators only» и списком того, что будет удалено (TC-HD-1 п.4; AC #f54c1e «אישור מפורש»).
- Шаг 7: при неполном имени кнопка подтверждения неактивна (`toBeDisabled`), при точном имени — активна (`toBeEnabled`); после подтверждения тост «"QA-AUTO HD Account <run>" was deleted permanently» (TC-HD-1 п.4).
- После удаления — переход на `/financial-projects` (`waitForURL`), в списке нет «QA-AUTO HD Account <run>» (TC-HD-1 п.5).
- Шаг 8: баланс Peer вернулся к исходному 2,700 USD; строки перевода от удалённого счёта нет (TC-HD-1 п.5; AC #f54c1e — удаляются обе ноги перевода).
- Шаг 9: записей CREATE счёта и перевода по «QA-AUTO HD Account <run>» в Audit Trail нет (кроме новой записи DELETE о самом hard delete — см. 1.2) (TC-HD-1 п.5; AC #f54c1e — удаляются audit-записи проекта).
- Шаг 11: Net worth, Gross, Liquidity равны снимку шага 1 (TC-HD-1 п.6; AC #f54c1e — Total Cash выравнивается).
**Cleanup (afterAll):** Delete permanently оставшихся «QA-AUTO HD … <run>».

#### 1.2 Hard delete оставляет одну запись DELETE в Audit Trail без Restore @desktop @data (#0cd999)
**Device:** desktop
**Users:** admin (`admin-stand`)
**Steps:**
1. `/financial-projects` → создать Bank Account «QA-AUTO HD Account <run>» (USD, 9,300) и «QA-AUTO HD Peer <run>» (USD, 2,700).
2. Internal transfer 700 USD Account → Peer, Paid. Запомнить баланс Peer на его странице (значение «до»; в отображаемой валюте счёта).
3. Delete permanently «QA-AUTO HD Account <run>» (ввести точное имя → подтвердить), дождаться `/financial-projects`.
4. Открыть `/audit-trail`, посмотреть верхнюю запись.
5. Открыть меню действий верхней записи.
6. Выбрать View Details.
7. Закрыть детали. Delete permanently «QA-AUTO HD Peer <run>».
8. Открыть `/audit-trail`, посмотреть две верхние записи.
**Expected:**
- Шаг 4: верхняя запись — Action DELETE, связанный объект «QA-AUTO HD Account <run>», пользователь — текущий admin, статус SUCCESS (TC-HD-2 п.1; «מה רצוי» #0cd999 «an irreversible deletion leaves one audit entry»).
- Шаг 5: в меню есть только «View Details» и «User Information»; пунктов «Restore» и «Go to Object» нет (`toHaveCount(0)`) (TC-HD-2 п.2).
- Шаг 6: в деталях видны `operation` = `hard_delete`, `projectId`, `projectType`, счётчики `ledger_inflows`, `ledger_outflows`, `payment_entries_hidden`, `audit_trail`, `deleted_project_snapshots`, `project_metrics`; есть строка изменения баланса второго счёта (Peer) «до → после», где «до» — баланс Peer после перевода, «после» меньше «до» на сумму перевода (700 USD в валюте отображения) (TC-HD-2 п.3).
- Шаг 8: верхняя запись — DELETE / «QA-AUTO HD Peer <run>» / SUCCESS; запись DELETE «QA-AUTO HD Account <run>» по-прежнему есть ниже (TC-HD-2 п.4 — вторая hard delete не стирает первую запись).
**Cleanup (afterAll):** Delete permanently оставшихся «QA-AUTO HD … <run>».

#### 1.3 Restore своей удалённой строки Cash Flow возвращает строку @desktop @data (#38f51d)
**Device:** desktop
**Users:** admin (`admin-stand`)
**Steps:**
1. `/financial-projects` → создать Bank Account «QA-AUTO HD Account <run>» (USD, 9,300).
2. На странице счёта в Cash Flow нажать «+ Add», создать строку «QA-AUTO restore row <run>» (любая сумма, текущий месяц) → сохранить; строка видна в Cash Flow.
3. Удалить эту строку (Delete) → строки больше нет в Cash Flow.
4. `/audit-trail` → период All Time → Advanced filters → Action type = Delete; найти запись Delete строки «QA-AUTO restore row <run>».
5. Открыть меню записи → Restore → Confirm.
6. Вернуться на страницу «QA-AUTO HD Account <run>», раскрыть месяц строки в Cash Flow.
7. Вернуться в `/audit-trail`, посмотреть записи по «QA-AUTO restore row <run>».
**Expected:**
- Шаг 5: в меню записи есть «Restore» (удаление после 24/09/2026 — со snapshot) (TC-HD-3 п.3; AC #38f51d — Restore у новых удалений сохраняется).
- Шаг 6: строка «QA-AUTO restore row <run>» снова видна в Cash Flow (TC-HD-3 п.4).
- Шаг 7: появилась запись EDIT со статусом RESTORED; статус исходной записи DELETE сменился на RESTORED (TC-HD-3 п.4).
- Никаких действий с записями, не относящимися к «QA-AUTO restore row <run>».
**Cleanup (afterAll):** Delete permanently «QA-AUTO HD Account <run>» (удаляет и строку).

#### 1.4 Старые удаления строк Cash Flow (03/08–23/08/2026) без Restore @desktop (#38f51d)
**Device:** desktop
**Users:** admin (`admin-stand`)
**Только просмотр** — ничего не нажимает, кроме фильтров, меню и View Details. Без `@data`.
**Зависит от данных стенда:** записи — исторические данные qa-stand (на 15.11.2026 их 5). Если записей Delete строк Cash Flow с датой 03/08/2026–23/08/2026 не найдено (стенд пересоздан/очищен) — тест помечается `test.skip` с причиной «нет исторических записей на стенде», а не проходит молча и не падает.
**Steps:**
1. Открыть `/audit-trail` → период All Time → Advanced filters → Action type = Delete.
2. Найти записи Delete с датой с 03/08/2026 по 23/08/2026 — удаления строк Cash Flow (в View Details есть `ledger_id`).
3. Для каждой такой записи: открыть меню действий; затем View Details.
**Expected:**
- Найдена ≥ 1 такая запись (иначе — skip, см. выше).
- У каждой: в меню нет «Restore» (`toHaveCount(0)`), есть «View Details» (TC-HD-3 п.2; AC #38f51d «Restore אינו מוצע … עבור רשומות מחיקה של שורות Cashflow שנרשמו לפני 2026-09-24 ללא snapshot»).
- Статус записи — Soft Deleted (TC-HD-3 п.2).
- View Details показывает поля удалённой строки (в т.ч. `ledger_id`) (TC-HD-3 п.2).
- Записи Delete до 24/09 других типов (платежи, проекты, документы, бенефициары) в проверку не входят — вне тикета (TC-HD-3, факт 15.11).

---

## Не автоматизируем
- Восстановление чужих записей стенда, удаление чего-либо на prod.
- Решение владельца продукта (AC1 #0cd999, AC2 #38f51d) — не UI.
