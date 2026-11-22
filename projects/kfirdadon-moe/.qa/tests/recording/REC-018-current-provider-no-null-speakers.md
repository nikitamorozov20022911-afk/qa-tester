<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REC-018: транскрипты текущего провайдера (soniox) — все сегменты с говорящим, без null
- Фича/экран: транскрипт попытки (get_candidate_report), F-37
- Тикеты: #6204cf (6a993d6e55d3513b306204cf)
- Роль/аккаунт: business (testim), только чтение
- Устройство: desktop (данные API)
- Тип: позитив (AC5 — структура не зависит от провайдера; без смены провайдера)
- Предусловия: готовые попытки 21.10 с активным soniox: «QA-C4-2110-D2» (045d7b08, 315 с), «QA-DIAG-2110» (f3db56cc, 67 с, 11 сегментов). НЕ удалять.
## Шаги
1. Для каждого кандидата — get_candidate_report.
## Ожидаемо
- transcription_status = completed; у каждого сегмента start/end числа и start ≤ end; speaker ∈ {candidate, customer}; 0 null; оба говорящих есть (AC1, AC5; решение 14.10).
## История
- 2026-10-21 · ✅ · #6204cf
- 2026-10-21 · עבר QA · автотест e2e/tests/recording/transcript-speakers-6204cf.spec.ts (не запускался)
