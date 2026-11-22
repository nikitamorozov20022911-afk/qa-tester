<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REC-015: доступ к записи только с правом — anon 401, business 200
- Фича/экран: functions/v1/get-recording-url
- Тикеты: #e0da25 (6a993d6e89df7f29e9e0da25) (то же для #8d9668 — REC-011)
- Роль/аккаунт: guest (anon key) / business
- Устройство: desktop
- Тип: негатив/доступ (только чтение)
- Предусловия: QA-C4-2110-D2 (запись 0b8d3dfc).
## Шаги
1. POST get-recording-url {recording_id} с anon-ключом; затем с сессией business.
## Ожидаемо
- anon → 401; business → 200 (источник: AC4, דרישה 4).
## История
- 2026-10-21 · ✅ · #e0da25
- 2026-10-21 · עבר QA · автотест e2e/tests/recording/recording-storage-e0da25.spec.ts (не запускался)
