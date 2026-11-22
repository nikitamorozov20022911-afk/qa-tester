<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: статусы и версии симуляции (#94c3ab, F-20 / FL-20)

> Записан autotest-writer вручную (подмена GET simulations через route.fetch/fulfill, проверки ответа RPC — генератор такое не записывает).
> Файлы: tests/simulation-status/statuses-mocked-94c3ab.spec.ts (STAT-001…005), tests/simulation-status/statuses-live-94c3ab.spec.ts (STAT-006…008), помощники — tests/simulation-status/support.ts.
> Безопасность: звонки не стартуют, статусы симуляций не меняются (записи обрываются и считаются), create_candidate обрывается (0 вызовов) или идёт на несуществующий id.
> Роли: менеджер аккаунта testim — auth/bizt.json, מנהל/ת מגייס/ת — auth/user-2.json. Все тесты @desktop @prod-safe; тесты НЕ запускались (только --list).
> Не автоматизировано: active→locked во время официального звонка и обратно (нужен реальный звонок), simulation_locked / simulation_not_active с hint locked на настоящем id, «נעולה» на дашборде.

### 1. Статусы симуляции (#6a993d738eac0db9d694c3ab)
**Seed:** `tests/seed.spec.ts`

#### 1.1 STAT-001: список /simulations, строка «נעולה · ניסיון אחד בתהליך — עריכה חסומה», чип «נעולות 1», без меню действий @desktop @prod-safe (#94c3ab)
**Device:** desktop
**Users:** business (manager)
**Steps:**
0. Подмена GET списка симуляций: одна активная строка → locked, in_progress 1.
1. /simulations.
**Expected:**
- «נעולה» и «ניסיון אחד בתהליך — עריכה חסומה» в строке; чип «נעולות 1»; у строки нет «פעולות…» (AC2).

#### 1.2 STAT-002: редактор запертой симуляции — без полей, пояснение, «למועמדים המשויכים» @desktop @prod-safe (#94c3ab)
**Device:** desktop
**Users:** business (manager)
**Steps:**
0. Подмена GET simulations?select=*&id=eq.<id> → locked.
1. /simulations/<id>.
2. «למועמדים המשויכים».
**Expected:**
- «הסימולציה נעולה בשל ניסיונות פעילים, ולכן לא ניתן לערוך אותה…»; нет input/textarea/select; переход на /candidates?simulation=<id> (AC3, FL-20).

#### 1.3 STAT-003: «הזמנת מועמד», единственная симуляция заперта @desktop @prod-safe (#94c3ab)
**Device:** desktop
**Users:** business (manager)
**Steps:**
0. Подмена simulations?status=in.(active,locked) → одна locked.
1. /candidates → «הזמנת מועמד».
**Expected:**
- «הסימולציה «…» נעולה בשל ניסיונות פעילים», «אפשר יהיה לשייך אליה…», «לרשימת הסימולציות» → /simulations; кандидат не создан (דרישה 6).

#### 1.4 STAT-004: рекрутер, нет активной симуляции @desktop @prod-safe (#94c3ab)
**Device:** desktop
**Users:** recruiter (user-2)
**Steps:**
0. Подмена simulations?status=in.(active,locked) → [].
1. /candidates → «הזמנת מועמד».
**Expected:**
- «אין סימולציה פעילה…», «לרשימת הסימולציות»; кандидат не создан (AC4).

#### 1.5 STAT-005: пустой список — 1104×271, кнопки 44/40, на 390 без горизонтальной прокрутки @desktop @prod-safe (#94c3ab)
**Device:** desktop
**Users:** business (manager)
**Steps:**
0. Подмена списка симуляций → [].
1. /simulations на 1440; измерить; окно 390.
**Expected:**
- Карточка 1104×271 (±2), «יצירת סימולציה» 44, «שימוש בתבנית» 40; нет горизонтальной прокрутки на 390 (Figma 864:3646, реджект 5).

#### 1.6 STAT-006: шапка готового отчёта «סימולציה «…» · גרסה N» @desktop @prod-safe (#94c3ab)
**Device:** desktop
**Users:** business (manager)
**Steps:**
0. Только чтение: кандидат с готовым отчётом из list_candidates.
1. /candidates/<id>/report.
**Expected:**
- Шапка содержит «סימולציה «<имя>» · גרסה <N>» (AC5, דרישה 4).

#### 1.7 STAT-007: create_candidate на несуществующую симуляцию → 400 @desktop @prod-safe (#94c3ab)
**Device:** desktop
**Users:** business (manager)
**Steps:**
0. API, id 00000000-0000-0000-0000-000000000094.
1. rpc create_candidate.
2. GET candidates по имени QA-AUTO-…
**Expected:**
- 400; кандидат не создан (דרישה 6).

#### 1.8 STAT-008: save_simulation на несуществующий id → 400 @desktop @prod-safe (#94c3ab)
**Device:** desktop
**Users:** business (manager)
**Steps:**
0. API, тот же id.
1. rpc save_simulation.
2. GET simulations?id=eq.<id>.
**Expected:**
- 400; симуляция не появилась.

