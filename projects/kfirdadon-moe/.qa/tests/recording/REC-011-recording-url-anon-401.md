<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REC-011: get-recording-url без входа (anon) — 401
- Фича/экран: functions/v1/get-recording-url
- Тикеты: #8d9668 (6a993d6ab96217a9f48d9668)
- Роль/аккаунт: guest (anon key) / business
- Устройство: desktop
- Тип: негатив/доступ (только чтение)
- Предусловия: готовый отчёт QA-bf7c47-2110 (39 с, 7 сегментов, 3 рекомендованных фрагмента, запись c8fa19b8).
## Шаги
1. POST get-recording-url {recording_id} с anon-ключом вместо токена.
2. То же с сессией business.
## Ожидаемо
- anon → 401 (источник: AC доступа к записи).
- business (свой кандидат) → 200.
## История
- 2026-10-21 · ✅ · #8d9668
- 2026-10-21 · עבר QA · автотест e2e/tests/recording/report-player-sync.spec.ts (не запускался)
