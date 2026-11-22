<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# ATT-001: после сброса попытки отчёт не ждёт обработки — у всех сброшенных попыток report_status null или cancelled
- Фича/экран: /admin/support (admin_list_support_status)
- Тикеты: #c9d61e (d7d5078e6b85ee996fc9d61e)
- Роль/аккаунт: admin
- Устройство: desktop
- Тип: позитив (только чтение, по существующим сбросам)
- Предусловия: в QA-данных есть исключительные сбросы: QA-r100b-K3-1645 (21.10), QA-G4b-K1-1357 (отчёт был готов), QA-r100a-RS-1642, QA-G7-R3-1502 и сбросы после тех. сбоя.
## Шаги
1. Прочитать admin_list_support_status (p_since 2026-09-01).
## Ожидаемо
- Для каждой попытки attempt_status=reset: report_status ∈ {null, cancelled} (источник: AC «הדוח של הניסיון המאופס אינו ממתין לעיבוד»).
- QA-r100b-K3-1645 и QA-G4b-K1-1357: официальная попытка reset + report_status cancelled, не ready (источник: F-39 треб.7, решение пользователя 14.10).
## История
- 2026-10-14 · ❌ · #c9d61e (сброс при готовом отчёте оставлял «מוכן», реджект rej_8ea7da455c3f0ea93783d4ec)
- 2026-10-21 · ✅ · #c9d61e (новый исключительный сброс QA-r100b-K3-1645)
- 2026-10-21 · עבר QA · автотест e2e/tests/attempt-states/reset-practice-abandoned.spec.ts (не запускался)
