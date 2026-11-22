<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# SIM-004: сервер отклоняет язык «en» — 400 language_not_enabled
- Фича/экран: редактор симуляции S-08, шаг 1, API
- Тикеты: #6a993d77a00f8f2a4a0d5e8a
- Роль/аккаунт: business (testim)
- Устройство: desktop 1440×900
- Тип: негатив
- Предусловия: черновик из SIM-003
## Шаги
1. RPC save_simulation(p_fields {language: "en"}) от сессии business.
## Ожидаемо
- 400 language_not_enabled; язык в БД he (AC5, реджект rej_1791198797112 п.1).
## История
- 2026-10-21 · ✅ · #6a993d77a00f8f2a4a0d5e8a (сборка index-BT4tmDRk.js; доказательства .qa/screenshots/2026-10-21/0d5e8a-*.png)
- 2026-10-21 · עבר QA · автотест tests/simulation-editor/general-details-step.spec.ts (записан autotest-writer, не запускался — решение пользователя)
