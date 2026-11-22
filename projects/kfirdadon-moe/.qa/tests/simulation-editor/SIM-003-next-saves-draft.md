<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# SIM-003: «הבא» сохраняет черновик и открывает шаг 2
- Фича/экран: редактор симуляции S-08, шаг 1
- Тикеты: #6a993d77a00f8f2a4a0d5e8a
- Роль/аккаунт: business (testim)
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: нет; создаётся «QA-AUTO-0d5e8a-<stamp>»
## Шаги
1. Заполнить все обязательные поля.
2. «הבא: לקוח וחשיפה»; вернуться на шаг 1.
## Ожидаемо
- save_simulation 200: status draft, version 1; открыт шаг «לקוח וחשיפה» (AC1).
- В БД language he, duration 7; значения шага 1 на месте.
## История
- 2026-10-21 · ✅ · #6a993d77a00f8f2a4a0d5e8a (сборка index-BT4tmDRk.js; доказательства .qa/screenshots/2026-10-21/0d5e8a-*.png)
- 2026-10-21 · עבר QA · автотест tests/simulation-editor/general-details-step.spec.ts (записан autotest-writer, не запускался — решение пользователя)
