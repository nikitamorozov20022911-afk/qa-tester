<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# SIM-006: прежняя версия в списке — «הדוחות נשארים משויכים לגרסה N»
- Фича/экран: редактор симуляции S-08, /simulations
- Тикеты: #6a993d77a00f8f2a4a0d5e8a
- Роль/аккаунт: business (testim)
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: есть симуляция в статусе previous_version (создана при ручной проверке 21.10)
## Шаги
1. Открыть /simulations.
## Ожидаемо
- У прежней версии подпись «הדוחות נשארים משויכים לגרסה N» (AC4: «הגרסה הקודמת נשמרת כגרסה קודמת»).
## История
- 2026-10-21 · ✅ · #6a993d77a00f8f2a4a0d5e8a (сборка index-BT4tmDRk.js; доказательства .qa/screenshots/2026-10-21/0d5e8a-*.png)
- 2026-10-21 · עבר QA · автотест tests/simulation-editor/general-details-step.spec.ts (записан autotest-writer, не запускался — решение пользователя)
