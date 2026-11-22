<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: отчёт в режиме поддержки Super Admin — боковая колонка и прокрутка

> Записан autotest-writer вручную: computed style, геометрия колонки и колесо мыши (mouse.wheel) — генератор так не умеет.
> Файл: tests/layout/report-aside-support-799398.spec.ts. Кейсы RPTASIDE-001, RPTASIDE-002. Только чтение — @prod-safe.

### 1. Отчёт кандидата с ?reason=support — колонка и колесо (#7e5e16903a1b3d1d88799398)
**Seed:** `tests/seed.admin.spec.ts` (в файле: storageState auth/admin.json)

#### 1.1 минимум транскрипта 160px, колонка целиком в экране при скролле 0 @desktop @prod-safe (#799398)
**Device:** desktop (1440×900, 1440×1024; 390×844 — только min-height)
**Users:** admin
**Steps:**
1. `/admin/support/candidates/71c9d469-5992-466f-a592-67e7a1c0f50e/report?reason=support` (QA-C2-2110-D2), дождаться `[data-testid=transcript]`.
2. Для каждого окна: computed `min-height` у `<ol>` внутри транскрипта; на 1440 — низ `main aside` при scrollY=0.
**Expected:**
- `min-height` = 160px на всех окнах (источник: AC5, ответ программиста 17.11: calc(8 * --line-height-cell)).
- Низ колонки ≤ innerHeight при скролле 0 (источник: AC1).

#### 1.2 колесо над транскриптом: сначала транскрипт до конца, затем страница @desktop @prod-safe (#799398)
**Device:** desktop (1440×900)
**Users:** admin
**Steps:**
1. Открыть тот же отчёт, навести мышь на транскрипт.
2. Колесо вниз по 300 px: страница стоит, транскрипт листается до конца; затем ещё колесо.
**Expected:**
- Пока транскрипт не в конце, scrollY страницы = 0; после конца колесо над ним листает страницу (scrollY > 0) (источник: AC2).

**Не автоматизировано:** AC3 (скролл к заметке только по Tab — требует фокус-логики, проверено вручную 21.10), AC4/AC6 и отсутствие токена `--transcript-min-height` (только код, доказательства программиста).
