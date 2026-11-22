<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REC-016: транскрипт whisper-1 — у каждого сегмента время и говорящий מועמד/לקוח, без «דובר לא מזוהה», готов ≤ 5 мин
- Фича/экран: транскрипт попытки (get_candidate_report → transcript.segments, report.transcript_ready_at), F-37
- Тикеты: #6204cf (6a993d6e55d3513b306204cf)
- Роль/аккаунт: business (testim), только чтение
- Устройство: desktop 1440×900 (проверка по данным API)
- Тип: позитив (только чтение, без звонка и без смены провайдера)
- Предусловия: готовая попытка, транскрибированная whisper-1 (21.10 провайдер временно переключали — в тесте НЕ переключаем): кандидат «QA-6204cf-2110» (7b97ca55…, попытка 973667ea, 86 с, транскрипт 5881c7ca, 12 сегментов). НЕ удалять.
## Шаги
1. Найти кандидата по имени (list_candidates), get_candidate_report (p_reason = null).
2. Пройти по transcript.segments.
## Ожидаемо
- attempt.transcription_status = completed, transcript.language = he.
- 12/12 сегментов: start и end — числа, 0 ≤ start ≤ end; start не убывает (AC1 «חותמת זמן לכל קטע»).
- speaker ∈ {candidate, customer} у каждого сегмента; 0 null / «דובר לא מזוהה»; оба говорящих есть (AC1 «זיהוי הדובר בין המועמד ללקוח המדומה»; решение 14.10 — диаризация при любом провайдере, AC5).
- «שלום יוסי, מדבר אלון…» — candidate; «מדבר יוסי» — customer (известный текст seller-*.wav).
- report.transcript_ready_at − attempt.ended_at ≤ 300 с (AC6; факт 8.5 с).
## История
- 2026-10-21 · ✅ · #6204cf (whisper-1, attempt 973667ea; скрин screenshots/2026-10-21/6204cf-whisper1-transcript-speakers.png)
- 2026-10-21 · עבר QA · автотест e2e/tests/recording/transcript-speakers-6204cf.spec.ts (не запускался)
