<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# ATT-004: длительность брошенной попытки — записанные секунды, без ожидания до закрытия
- Фича/экран: list_candidates (attempt.duration_seconds)
- Тикеты: #c9d61e (d7d5078e6b85ee996fc9d61e)
- Роль/аккаунт: business (testim)
- Устройство: desktop
- Тип: граница (только чтение)
- Предусловия: QA-r100a-AB-1642: официальный звонок 13.10 16:43, браузер убит на ~77 с, попытку закрыл cron через ~47 мин (technical_failure).
## Шаги
1. Прочитать list_candidates → attempt кандидата QA-r100a-AB-1642.
## Ожидаемо
- status technical_failure; ended_at − created_at > 600 с; duration_seconds > 0 и ≤ 120 (было бы ≈2800) (источник: AC «משך ניסיון נטוש אינו כולל את זמן ההמתנה עד הסגירה»).
## История
- 2026-10-13 · ✅ · #c9d61e (duration 65 с)
- 2026-10-21 · ✅ · #c9d61e
- 2026-10-21 · עבר QA · автотест e2e/tests/attempt-states/reset-practice-abandoned.spec.ts (не запускался)
