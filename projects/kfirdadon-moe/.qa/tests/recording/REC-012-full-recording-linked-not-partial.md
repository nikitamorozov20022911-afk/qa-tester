<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REC-012: запись полной попытки привязана к ней и не помечена частичной
- Фича/экран: get_candidate_report → recording; отчёт /candidates/<id>/report
- Тикеты: #e0da25 (6a993d6e89df7f29e9e0da25)
- Роль/аккаунт: business (testim)
- Устройство: desktop
- Тип: позитив (только чтение)
- Предусловия: QA-C4-2110-D2 (попытка 045d7b08, 315 с, duration_elapsed, запись 0b8d3dfc). Не удалять.
## Шаги
1. get_candidate_report; открыть отчёт.
## Ожидаемо
- recording есть, is_partial=false, duration_seconds записи = попытки (315) ±2 с; в отчёте нет «ההקלטה חלקית» (источник: AC1, реджект 13.10).
## История
- 2026-10-21 · ✅ · #e0da25
- 2026-10-21 · עבר QA · автотест e2e/tests/recording/recording-storage-e0da25.spec.ts (не запускался)
