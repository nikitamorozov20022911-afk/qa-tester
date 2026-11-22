<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REP-010: Менеджер: отчёт в ошибке — «שגיאה בהפקת דוח», «פנייה לתמיכה» (mailto), без перезапуска
- Фича/экран: S-19 «דוח המועמד», состояние «שגיאה בהפקת דוח» (report-error)
- Тикеты: #bf7c47 (6a993d6cdaed11dfc1bf7c47) (AC4, ד4)
- Роль/аккаунт: bizt (business testim)
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: отчёты в ошибке QA-CALL1-0411 и QA-C10-2110-D3 (в «לטיפול ידני»); статус сверяется с API (get_candidate_report → report.status = generation_error)
## Шаги
1. Найти кандидата по имени (list_candidates), открыть /candidates/<id>/report.
2. Осмотреть блок report-error и страницу.
## Ожидаемо
- Блок с «שגיאה בהפקת דוח» и ссылкой «פנייה לתמיכה» (href mailto:).
- Нет кнопки/пункта меню/ссылки «перезапуск обработки» (источник: AC4, ד4).
## История
- 2026-11-17 · ✅ · .qa/screenshots/2026-11-17/bf7c47-t-call1-desktop.png, bf7c47-t-c10-desktop.png, bf7c47-b-report-techfail-desktop.png · עבר QA (пользователь)
- 2026-11-17 · автотест e2e/tests/report-analysis/generation-error-manager-bf7c47.spec.ts (не запускался)
