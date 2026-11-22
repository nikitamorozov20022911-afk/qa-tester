<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# CAND-005: решение о найме — три варианта, сразу в списке и фильтре, кто и когда, ось выполнения не меняется
- Фича/экран: החלטת גיוס — PATCH /rest/v1/candidates {recruiting_status}, /candidates (колонка «החלטת גיוס», фильтр ?status=<hiring>), get_candidate_report.hiring
- Тикеты: #6a993d6ab2e4b167537ea9a3
- Роль/аккаунт: business (מנהל חשבון, testim)
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: свой кандидат «QA-AUTO-HD-…», созданный тестом (link_only, без писем). Панель решения в отчёте появляется только при наличии попытки (звонка) — звонки не запускаем, поэтому решение ставится тем же запросом, что и UI (candidates.update({recruiting_status}).eq('id')). Кандидат и решение не удаляются (правило проекта).
## Шаги
1. Создать «QA-AUTO-HD-<stamp>» (link_only).
2. По очереди: advanced_to_next_stage → further_clarification_needed → process_ended (PATCH ?id=eq.<id>&select=id, Prefer return=representation).
3. После каждого — /candidates?q=<имя>: ячейка «החלטת גיוס»; /candidates?status=<значение>&q=<имя> — 1 строка.
4. get_candidate_report (business, p_reason null): hiring.status / changed_by / changed_at.
## Ожидаемо
- PATCH 200, тело [{id}] (UI считает успехом только непустой ответ).
- Ячейка: «הועבר לשלב הבא» / «נדרש בירור נוסף» / «התהליך הסתיים»; фильтр по значению находит кандидата (источник: AC2 «הסטטוס מתעדכן מיד ברשימה», треб.6 колонка + фильтр).
- hiring.changed_by = текущий пользователь, changed_at заполнен (треб.3 «החלטה אנושית מזוהה»).
- Статус выполнения в строке остаётся «קישור נוצר» (треб.4 — отдельная ось).
## История
- 2026-10-14 · ✅ · #7ea9a3 (ручная проверка на QA-G4-A-1321: «נדרש בירור נוסף», pill + фильтр → 1, «עודכן על ידי fdfdf»)
- 2026-10-14 · עבר QA · автотест tests/candidates/hiring-decision-notes.spec.ts
