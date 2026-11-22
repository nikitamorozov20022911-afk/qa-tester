<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REC-006: при ухудшенном звуке качество транскрипта не «מספקת» — в отчёте «איכות התמלול: חלקית»
- Фича/экран: отчёт /candidates/<id>/report, блок «תמלול» (F-37); данные get_candidate_report
- Тикеты: #0e9f9a (30024c6427c460c2480e9f9a)
- Роль/аккаунт: business (testim), только чтение
- Устройство: desktop 1440×900
- Тип: позитив / регресс бага (только чтение)
- Предусловия: как REC-004; у отчёта report.technical_status = degraded_audio.
## Шаги
1. get_candidate_report → report.technical_status, transcript.quality_status.
2. Открыть /candidates/<id>/report, блок «תמלול».
## Ожидаемо (источник: описание бага #0e9f9a «והאיכות עדיין נמדדת כמספקת»)
- transcript.quality_status задан и ≠ sufficient при technical_status = degraded_audio (факт: partial).
- В блоке «תמלול» видно «איכות התמלול: חלקית» и подсказка «חלקים מהשיחה לא תומללו או תומללו בוודאות נמוכה».
## История
- 2026-10-21 · ✅ · #0e9f9a
- 2026-10-21 · עבר QA · автотест e2e/tests/recording/long-transcript-hebrew-boundaries.spec.ts
