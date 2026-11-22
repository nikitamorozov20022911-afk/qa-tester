<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REP-002: звонок ≥30 с без речи кандидата — «המועמד כמעט לא דיבר» везде, «נקטעה» нет
- Фича/экран: /candidates/:id/report
- Тикеты: #83178a (5e9c55c71c45aaa00f83178a)
- Роль/аккаунт: business (testim)
- Устройство: desktop 1440×900
- Тип: граница (только чтение)
- Предусловия: готовый отчёт QA-83178a-silent-2110 (официальная попытка 45 с, кандидат молчал).
## Шаги
1. Открыть отчёт кандидата.
## Ожидаемо
- report-summary, 4 domain-explanation и 22 checkpoint-explanation содержат «המועמד כמעט לא דיבר»; «נקטעה» нигде (источник: AC2).
## История
- 2026-10-21 · ✅ · #83178a (AC2, звонок 45 с)
- 2026-10-21 · עבר QA · автотест e2e/tests/report-analysis/short-and-silent-call-reasons.spec.ts
