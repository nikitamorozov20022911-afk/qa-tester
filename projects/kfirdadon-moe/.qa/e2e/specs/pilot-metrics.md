<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: метрики пилота — вне системы (F-54, «отрицательная» фича)

> Записан autotest-writer вручную: проверка ОТСУТСТВИЯ (подписи элементов, меню, прямые адреса, «%») под тремя ролями,
> каждая в своём окне (asUser). Файл: tests/pilot-metrics/no-pilot-metrics-in-system.spec.ts. Только чтение → @prod-safe
> (admin открывает отчёт с причиной quality_assurance — строка в רישום גישה, как в ручной проверке). Кейсы PIL-001…003.
> Организационная часть (сбор метрик в разговорах, итог пилота, менеджер продаж — AC1/4/5) вне системы, не автоматизируется.

### 1. Нет отзыва на отчёт, экрана метрик и процентов против целей (#8951bb)
**Seed:** `tests/seed.business.spec.ts` / `tests/seed.user.spec.ts` / `tests/seed.admin.spec.ts`

#### 1.1 business: отчёт без поля отзыва; меню без экрана метрик, /metrics /feedback /pilot → «המסך לא נמצא»; дашборд без «%» @desktop @prod-safe (#8951bb · #6a993d67948609c2b98951bb)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. Дашборд «/».
2. Отчёт QA-4b397a-DISC-2110.
3. Меню; /metrics, /feedback, /pilot.
**Expected:**
- Дашборд: нет «%»/«אחוז» (AC3, D-03).
- Отчёт: нет подписей «משוב/שימושי/טעות מהותית/דירוג/…», шкал и звёзд (AC2, треб. 4, FL-54).
- Меню без пунктов метрик/отзыва/пилота/BI; прямые адреса → h1 «המסך לא נמצא» (AC1, треб. 4).

#### 1.2 user (משתמש בית העסק): то же — отчёт (тот же кандидат или первый свой готовый), меню, прямые адреса, дашборд @desktop @prod-safe (#8951bb · #6a993d67948609c2b98951bb)
**Device:** desktop
**Users:** user
**Steps / Expected:** как 1.1.

#### 1.3 admin: отчёт через /admin/support/candidates/<id>/report?reason=quality_assurance без поля отзыва; меню; прямые адреса; «בתי העסק», карточки QA-PILOT-1410 и testim без «%» @desktop @prod-safe (#8951bb · #6a993d67948609c2b98951bb)
**Device:** desktop
**Users:** admin (Super Admin)
**Steps:**
1. Отчёт QA-4b397a-DISC-2110 из «תמיכה ותפעול».
2. /admin/businesses, карточки QA-PILOT-1410 и testim.
3. Меню; /metrics, /feedback, /pilot.
**Expected:**
- Как 1.1; в админке нет «%» (треб. 3 по смыслу, D-03); «N סימולציות» и квота допустимы (D-04/D-05).
**File:** tests/pilot-metrics/no-pilot-metrics-in-system.spec.ts · кейсы PIL-001, PIL-002, PIL-003
