<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REP-011: Менеджер: список /candidates?status=generation_error — у строк только «לדוח» и mailto-обращение
- Фича/экран: S-?? «מועמדים» (список), фильтр по статусу
- Тикеты: #bf7c47 (6a993d6cdaed11dfc1bf7c47) (AC4, ד4)
- Роль/аккаунт: bizt (business testim)
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: в списке есть QA-CALL1-0411 и QA-C10-2110-D3
## Шаги
1. /candidates?status=generation_error.
2. Для каждой строки: действия в ячейке быстрых действий.
## Ожидаемо
- У строк нет кнопки перезапуска обработки.
- У QA-CALL1-0411 и QA-C10-2110-D3 ровно два действия: «לדוח» (open-candidate-report) и «פנייה לתמיכה…» (request-reprocessing, mailto) (источник: AC4).
## История
- 2026-11-17 · ✅ · .qa/screenshots/2026-11-17/bf7c47-t-errfilter-desktop.png · עבר QA (пользователь)
- 2026-11-17 · автотест e2e/tests/report-analysis/generation-error-manager-bf7c47.spec.ts (не запускался)
