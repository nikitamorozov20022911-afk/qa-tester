<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# DASH-002: готовый отчёт с решением не попадает в набор ссылки «לכל הדוחות המוכנים»
- Фича/экран: /candidates?status=ready vs ?status=awaiting_decision
- Тикеты: #a8e7e24c31c0c182cdc6043e
- Роль/аккаунт: business (testim)
- Устройство: desktop 1440×900
- Тип: негатив
- Предусловия: QA-G4-A-1321 — готовый отчёт с решением «נדרש בירור נוסף» (QA-данные 14.10, не удалять).
## Шаги
1. /candidates?status=ready&q=QA-G4-A-1321.
2. /candidates?status=awaiting_decision&q=QA-G4-A-1321.
## Ожидаемо
- В «מוכן» строка QA-G4-A-1321 есть, «החלטת גיוס» = «נדרש בירור נוסף» (смысл ?status=ready сохранён — все готовые).
- В «ממתינים להחלטה» строки QA-G4-A-1321 нет (пустой результат) (источник: заголовок тикета — «פותח גם דוחות שכבר הוחלט עליהם» не должно быть; AC).
## История
- 2026-10-14 · ✅ · #c6043e (ready&q=QA-G4 — 9 строк, awaiting_decision&q=QA-G4 — 8)
- 2026-10-14 · עבר QA · автотест tests/dashboard/decided-report-not-in-link-set.spec.ts (генератор)
