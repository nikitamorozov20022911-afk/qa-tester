<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Task day — יום המשימה (Task day execution)

План автотестов для официального `playwright-test-generator`. Источник: тикет #72fe76 (фича F-04 «יום המשימה», экраны S-20 Live booking / S-21 סיכום / S-14 פרטי הזמנה, флоу FL-07, AC=1 DoD, решения D-34/D-29/D-15/D-07) и бриф `.qa/research/72fe76.md`.
Сайт: https://babysit-qa.expo.app · he-IL (RTL), мобильный вид. Сессии ролей — `.qa/auth/<role>.json`.
Роли: **sitter-experienced** = maya@ (бейбиситтер), **parent-verified** = dana@ (родитель).

**Данные и важное ограничение.** Реальная бронь **3874a1f1-bd2f-dfac-e98a-dbc35935eac3** (dana×maya) переведена полным циклом в **completed** (необратимо через UI, см. `.qa/session.json` → test_data). По ней можно только ЧИТАТЬ завершённое состояние (таймлайн, статус «הושלמה», CTA рейтинга) → `@prod-safe`.
Любой прогон самого флоу (בדרך → Check-in → подтверждение старта → Check-out → подтверждение конца) **меняет статус брони** → `@mutating`, и **требует СВЕЖУЮ confirmed-бронь с наступившим сроком** (dana×maya). Такого seed сейчас нет (seed `...663` на babysit-qa отсутствует; 3874a1f1 уже израсходована). `@mutating`-тесты ниже помечены как блокированные до появления нового seed — запускать их на 3874a1f1 нельзя. Фиксировать это ограничение при `/qa-regress`.
Завершение и события пишет **только сервер** (edge-функция booking-day); приложение само не отмечает completed (Т6) — автотест проверяет наблюдаемый результат в UI, не пишет события напрямую.
Вне DoD и **не тестируется**: списание/оплата, строка заработка, навигация/ETA, push (D-07, провайдеры не построены).
Мультиролевые тесты (sitter + parent одновременно) пишет сам `autotest-writer` через `asUser` (см. `fixtures.ts`), поле **Users** = несколько ролей.

### 1. Task day — יום המשימה (#72fe76)
**Seed:** `tests/seed.sitter-experienced.spec.ts` (maya); для родителя — `tests/seed.parent-verified.spec.ts` (dana) по полю **Users**.

#### 1.1 Бейбиситтер: live-экран завершённой брони — таймлайн 3 этапов + статус «הושלמה» (#72fe76) `@prod-safe`
**Device:** all (без пометки)
**Users:** sitter-experienced
**Seed:** `tests/seed.sitter-experienced.spec.ts`
**Steps:**
1. Под сессией maya открыть `/bookings/3874a1f1-bd2f-dfac-e98a-dbc35935eac3/live`.
2. Дождаться загрузки live-экрана (не состояние loading; экран рефрешится ~каждые 20с — дождаться первой отрисовки статуса).
3. Прочитать таймлайн задачи и текущий статус брони.
**Expected:**
- Экран live загружается под бейбиситтером (не пустой placeholder, нет ошибки). (источник: коммент — S15 sitter states; примечание брифа — проверить, не заглушка ли экран.)
- В таймлайне присутствуют три вехи дня: «יציאה לדרך / בדרך», «צ׳ק-אין» (Check-in), «צ׳ק-אאוט» (Check-out). (источник: Т1/Т5, AC1/DoD; Figma S15 145:934–1274.)
- Для завершённой брони виден статус «הושלמה» (задача отмечена завершённой). (источник: Т4/DoD — после Check-out + подтверждения родителя бронь «מסומנת כהושלמה»; session.json — 3874a1f1 completed.)
- CTA активного действия (בדרך/Check-in/Check-out) на завершённой броне нет — все этапы пройдены. (источник: DoD — конечное состояние; завершённая бронь.)

#### 1.2 Бейбиситтер: после завершения доступна кнопка/переход к рейтингу (#72fe76) `@prod-safe`
**Device:** all (без пометки)
**Users:** sitter-experienced
**Seed:** `tests/seed.sitter-experienced.spec.ts`
**Steps:**
1. Под сессией maya открыть `/bookings/3874a1f1-bd2f-dfac-e98a-dbc35935eac3/live` (или экран סיכום S-21).
2. Найти CTA/ссылку перехода к оценке брони и нажать её.
**Expected:**
- На завершённой броне присутствует CTA перехода к рейтингу (דירוג/דרג). (источник: С1 — #90d3ea: рейтинг доступен только после завершения, которое даёт эта фича.)
- Переход ведёт на форму оценки брони `/bookings/3874a1f1-bd2f-dfac-e98a-dbc35935eac3/rate` (`waitForURL(/\/bookings\/.+\/rate/)`). (источник: С1 / связь с #90d3ea; стык task-day → rating.)

#### 1.3 Родитель: видит статус задачи по броне (#72fe76) `@prod-safe`
**Device:** all (без пометки)
**Users:** parent-verified
**Seed:** `tests/seed.parent-verified.spec.ts`
**Steps:**
1. Под сессией dana открыть `/bookings/3874a1f1-bd2f-dfac-e98a-dbc35935eac3/live` (родительский вид брони).
2. Дождаться загрузки и прочитать статус/карточку хода задачи.
**Expected:**
- Родитель видит ход задачи бейбиситтера: таймлайн/карточка с этапами (בדרך / Check-in / Check-out). (источник: Т2/User Story — «כהורה, אני רוצה לראות שהבייביסיטר בדרך, ביצעה Check-in ובסוף Check-out»; Figma parent cards 376:2366 / 383:2417 / 383:2593.)
- Для завершённой брони родитель видит статус «הושלמה» (задача завершена). (источник: Т4/DoD; session.json — 3874a1f1 completed.)

#### 1.4 Полный DoD-цикл дня на СВЕЖЕЙ confirmed-броне: Check-in/out + подтверждения родителя → completed (#72fe76) `@mutating`
**Device:** all (без пометки)
**Users:** несколько ролей — sitter-experienced (maya), parent-verified (dana) — через `asUser`
**Seed:** `tests/seed.sitter-experienced.spec.ts` + `tests/seed.parent-verified.spec.ts`
**Ограничение:** требует НОВУЮ confirmed-бронь dana×maya с наступившим сроком (подставить её id вместо `<FRESH_BOOKING_ID>`). На 3874a1f1 (completed) не запускать. Пишет `autotest-writer` сам (две роли в двух окнах).
**Steps:**
1. `const sitter = await asUser('sitter-experienced')`; `const parent = await asUser('parent-verified')`.
2. sitter: открыть `/bookings/<FRESH_BOOKING_ID>/live`, выполнить Check-in по прибытии (разрешить геолокацию в контексте, чтобы Location verified).
3. parent: открыть ту же бронь, подтвердить תחילת המשימה (старт).
4. Дождаться (через `expect`, без фиксированных пауз), что у sitter статус перешёл в «משימה מתחילה»/активна.
5. sitter: выполнить Check-out в конце.
6. parent: подтвердить סיום המשימה (конец).
**Expected:**
- После Check-in + подтверждения родителя статус задачи = «משימה מתחילה»/активна (видно в окне sitter). (источник: Т3/DoD.)
- После Check-out + подтверждения родителя бронь отмечена «הושלמה» (видно в обоих окнах). (источник: Т4/DoD; запись делает сервер — Т6.)
- Действие одной роли видно другой: подтверждение родителя отражается в окне sitter (ожидание через `expect(...)`, не `waitForTimeout`). (источник: AC1 — обе стороны участвуют в одном дне.)

#### 1.5 Ветка Location-not-verified на Check-in: отказ в геолокации → ручное подтверждение, бейдж «Location not verified», день не блокируется (#72fe76) `@mutating`
**Device:** all (без пометки)
**Users:** несколько ролей — sitter-experienced, parent-verified — через `asUser`
**Seed:** `tests/seed.sitter-experienced.spec.ts` + `tests/seed.parent-verified.spec.ts`
**Ограничение:** требует новую confirmed-бронь (`<FRESH_BOOKING_ID>`); контекст sitter БЕЗ разрешения геолокации (или с несовпадающим моком). Пишет `autotest-writer` сам.
**Steps:**
1. `const sitter = await asUser('sitter-experienced')` в контексте с отказом геолокации; `const parent = await asUser('parent-verified')`.
2. sitter: открыть `/bookings/<FRESH_BOOKING_ID>/live`, инициировать Check-in; при сбое/несовпадении GPS подтвердить вручную.
3. parent: подтвердить старт.
**Expected:**
- Сбой/отказ GPS не блокирует день: Check-in проходит через ручное подтверждение. (источник: Т7 / D-29 — «כשל GPS אינו חוסם משימה; אישור ידני».)
- На броне появляется бейдж/метка «Location not verified». (источник: Т7 / D-29; Figma — бейдж Location not verified.)
- День продолжается (можно дойти до подтверждения старта) — событие сохранено сервером. (источник: D-29 — «האירוע נשמר»; Т6.)

#### 1.6 «בדרך» опционален: Check-in доступен без предварительного «בדרך» (#72fe76) `@mutating`
**Device:** all (без пометки)
**Users:** несколько ролей — sitter-experienced, parent-verified — через `asUser`
**Seed:** `tests/seed.sitter-experienced.spec.ts` + `tests/seed.parent-verified.spec.ts`
**Ограничение:** требует новую confirmed-бронь (`<FRESH_BOOKING_ID>`). Пишет `autotest-writer` сам.
**Steps:**
1. `const sitter = await asUser('sitter-experienced')` открывает `/bookings/<FRESH_BOOKING_ID>/live`.
2. sitter: НЕ нажимая «בדרך», сразу инициировать Check-in.
**Expected:**
- Check-in доступен и проходит без обязательного предшествующего «בדרך» (кнопка/действие Check-in не заблокировано отсутствием «בדרך»). (источник: Т5 / D-34, §17 — «בדרך» не обязателен как шаг перед Check-in.)
- «בדרך» присутствует как отдельное необязательное действие (а не обязательная ступень флоу). (источник: Т5/AC2.)
