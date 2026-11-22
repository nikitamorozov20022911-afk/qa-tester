<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: квота симуляций и учёт потребления (F-53, S-06 + drawer «מועמד חדש» + дашборд)

> Записано autotest-writer 17.11 после «עבר QA» по #bdd327 (+ футер — тот же что в #ea1aa0). Тесты написаны вручную (не через generator): подмена ответа `get_business_usage`
> через `route.fulfill` и сверка с API той же сессии генератор не делает. Проверен только разбор (`npx playwright test --project tests --list tests/quota-usage`), прогона не было.
> Только чтение: квота testim не меняется, кандидаты не создаются (`create_candidate` в моках обрывается и считается = 0), «אישור והמשך» не нажимается.
> Роли: менеджер аккаунта testim — `.qa/auth/bizt.json`; מנהל/ת מגייס/ת testim — `.qa/auth/user-2.json`. Только десктоп (L-20261014-5).
> Кейсы: `.qa/tests/quota-usage/QUOTA-001…010`. Общие помощники: `tests/quota-usage/support.ts`.

### 1. Квота — живые данные, сверка с get_business_usage (#bdd327)
**Seed:** — (storageState `.qa/auth/bizt.json` / `.qa/auth/user-2.json`)
**File:** tests/quota-usage/quota-live-bdd327.spec.ts

#### 1.1 QUOTA-001: «פרטי העסק והמכסה»: карточка квоты = get_business_usage, полей изменения нет @desktop @prod-safe (#bdd327 · #6a993d6887e898ed58bdd327)
**Device:** desktop · **Users:** менеджер аккаунта (bizt)
**Steps:** 1. /settings/business. 2. rpc get_business_usage той же сессии.
**Expected:** `quota-used` = used; с квотой «נוצלו מתוך M», «נותרו R», порог N%; без квоты «לא הוגדרה מכסה לחשבון, ולכן אין חסימה…»; spinbutton/textbox в карточке нет (AC1, AC5, AC6, треб. 4, 6).

#### 1.2 QUOTA-002: дашборд: «נוצלו N מתוך M» и «נותרה/נותרו R» = get_business_usage @desktop @prod-safe (#bdd327 · #6a993d6887e898ed58bdd327)
**Device:** desktop · **Users:** менеджер аккаунта (bizt)
**Steps:** 1. /. 2. rpc get_business_usage.
**Expected:** строка «מכסת סימולציות · נוצלו used מתוך quota · נותרה/נותרו remaining» (треб. 4, факт 17.11); без квоты строки нет.

#### 1.3 QUOTA-003 / QUOTA-004: футер drawer «נותרו N מתוך M · סימולציות במכסה» = get_business_usage — менеджер аккаунта и מגייס @desktop @prod-safe (#bdd327 · #6a993d6887e898ed58bdd327)
**Device:** desktop · **Users:** менеджер аккаунта (bizt); מנהל/ת מגייס/ת (user-2) — два теста
**Steps:** 1. /candidates (rpc get_business_usage). 2. «הזמנת מועמד» → drawer «מועמד חדש» (не заполнять).
**Expected:** «נותרו remaining מתוך quota» + «סימולציות במכסה», рядом «ביטול» и «יצירת קישור», до исчерпания квоты (реджект #bdd327, Figma 752:1533/753:1749; решение владельца 01.11 — и рекрутёру); без квоты строки нет (AC5).

#### 1.4 QUOTA-009: admin_set_business_quota от менеджера и מגייס → 403 forbidden, квота не изменилась @desktop @prod-safe (#bdd327 · #6a993d6887e898ed58bdd327)
**Device:** desktop · **Users:** менеджер аккаунта (bizt); מנהל/ת מגייס/ת (user-2) — два теста
**Steps:** 1. get_business_usage. 2. admin_set_business_quota {p_business_id: 00000000-0000-0000-0000-000000000000, p_period_start: 2026-11-01, p_period_end: 2026-11-30, p_quota: 1, p_warning_percent: 80} (несуществующий бизнес — безвреден при любом исходе). 3. get_business_usage.
**Expected:** 403, `{code: "42501", message: "forbidden"}`; quota/remaining/warning_percent/period прежние (AC6, треб. 6; факт 17.11).

#### 1.5 QUOTA-010: get_business_usage чужого бизнеса → 403 forbidden; свой id = пустой вызов @desktop @prod-safe (#bdd327 · #6a993d6887e898ed58bdd327)
**Device:** desktop · **Users:** менеджер аккаунта (bizt); מנהל/ת מגייס/ת (user-2) — два теста
**Steps:** 1. get_business_usage {}. 2. {p_business_id: b0d2a797-4d78-4a74-83d1-c0c1bfc8a6a9} (QA-PILOT-1410; QA_EBDB2F_FOREIGN_ID). 3. {p_business_id: свой}.
**Expected:** чужой — 403 `42501 forbidden`; свой id и {} дают одинаковые used/quota/remaining (миграция 20261104100000, факт 17.11).

### 2. Квота — состояния через подмену get_business_usage (#bdd327)
**Seed:** — (storageState `.qa/auth/bizt.json` / `.qa/auth/user-2.json`)
**File:** tests/quota-usage/quota-mocked-bdd327.spec.ts
**Данные:** сервер не меняется; `route.fulfill` на `**/rest/v1/rpc/get_business_usage*`; `create_candidate` обрывается, счётчик обязан быть 0.

#### 2.1 QUOTA-005: 4 из 5 (порог 80%) → «מתקרבים למכסה: נותרה סימולציה אחת מתוך 5» @desktop @prod-safe (#bdd327 · #6a993d6887e898ed58bdd327)
**Device:** desktop · **Users:** менеджер аккаунта (bizt)
**Steps:** 1. Подмена {used 4, quota 5, remaining 1, warning_percent 80, период 2026-11-01…30}. 2. /.
**Expected:** «מתקרבים למכסה: נותרה סימולציה אחת מתוך 5»; «אפשר להמשיך להזמין גם אחרי 5 — כל הזמנה מעבר למכסה תדרוש אישור מפורש ותירשם לחיוב.»; «נוצלו 4 מתוך 5», «נותרה 1» (AC3, треб. 2; факт 17.11).

#### 2.2 QUOTA-006: 1 из 5 (ниже порога) → предупреждения нет @desktop @prod-safe (#bdd327 · #6a993d6887e898ed58bdd327)
**Device:** desktop · **Users:** менеджер аккаунта (bizt)
**Steps:** 1. Подмена {used 1, quota 5, remaining 4}. 2. /.
**Expected:** «נוצלו 1 מתוך 5» есть; «מתקרבים למכסה» нет (AC3).

#### 2.3 QUOTA-007 / QUOTA-008: квота исчерпана → «נותרו 0 מתוך 4» и окно «המכסה של התקופה נוצלה», без отправки — менеджер аккаунта и מגייס @desktop @prod-safe (#bdd327 · #6a993d6887e898ed58bdd327)
**Device:** desktop · **Users:** менеджер аккаунта (bizt); מנהל/ת מגייס/ת (user-2) — два теста
**Steps:** 1. Подмена {used 4, quota 4, remaining 0}; create_candidate обрывается. 2. /candidates → «הזמנת מועמד». 3. Отметить «אני מאשר/ת חריגה מהמכסה עבור ההזמנה הזו». 4. «חזרה בלי להזמין» (**«אישור והמשך» не нажимать**).
**Expected:** окно: «המכסה של התקופה נוצלה», «מכסה לתקופה», «הושלמו», «אחרי ההזמנה הזו» → «חריגה של 1», «האישור נרשם לחיוב עם שמך ומועד האישור»; чекбокс не отмечен по умолчанию, затем отмечается; кнопки «אישור והמשך» и «חזרה בלי להזמין»; футер «נותרו 0 מתוך 4»; после «חזרה…» окно закрыто, create_candidate не вызван (AC4, треб. 2; решение реализатора 05.11 — окно у обеих ролей).

**Не включено (нельзя на живом сайте без изменения данных):** задание квоты/порога Super Admin (AC1 — часть админа), подсчёт только завершённых попыток (AC2 — нужны звонки), реальное подтверждение превышения и запись для биллинга (`create_candidate` с подтверждением), сценарий «квота не задана» как отдельный мок (в живых тестах — ветка `quota === null`).
