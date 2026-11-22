<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# ATT-003: практика не ждёт транскрипции — transcription_status not_applicable
- Фича/экран: /admin/support (admin_list_support_status)
- Тикеты: #c9d61e (d7d5078e6b85ee996fc9d61e)
- Роль/аккаунт: admin
- Устройство: desktop
- Тип: позитив (только чтение)
- Предусловия: в QA-данных есть практики (21.10 — 42 строки).
## Шаги
1. Прочитать admin_list_support_status, выбрать attempt_type=practice.
## Ожидаемо
- У каждой практики transcription_status = not_applicable (в UI «לא נדרש») (источник: AC «ניסיון תרגול אינו ממתין לתמלול»).
## История
- 2026-10-13 · ✅ · #c9d61e (r100, практика RS 33 с)
- 2026-10-21 · ✅ · #c9d61e
- 2026-10-21 · עבר QA · автотест e2e/tests/attempt-states/reset-practice-abandoned.spec.ts (не запускался)
