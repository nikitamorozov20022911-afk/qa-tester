<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# END-001: Отчёт у менеджера: «סיבת סיום» и «משך» в шапке для пяти причин окончания
- Фича/экран: S-19 «דוח המועמד» — шапка (report-meta)
- Тикеты: #d65b5b (6a993d6fbd1469e36cd65b5b) (AC5)
- Роль/аккаунт: bizt (business testim)
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: QA-C2-2110-D2 (predefined_condition, 2:17), QA-PHONE-17fdd9-2210 (candidate_ended, 5:36), QA-C7-2110-D3 (customer_refused, 0:52), QA-C4-2110-D2 (duration_elapsed, 5:15), QA-G4-A-1321 (next_step_achieved, 2:53)
## Шаги
1. Найти кандидата по имени, get_candidate_report (end_reason, duration_seconds).
2. Открыть /candidates/<id>/report, осмотреть report-meta.
## Ожидаемо
- «סיבת סיום» = текст причины по коду из API (התקיים תנאי סיום שהוגדר בתרחיש / המועמד סיים את השיחה / הלקוח המדומה סירב להמשיך / הזמן שהוקצב לשיחה הסתיים / נקבע צעד הבא).
- «משך» = «m:ss דק׳» из duration_seconds API (источник: AC5; решение 17.11 — customer_refused показывается как причина, не как сбой).
## История
- 2026-11-17 · ✅ · .qa/screenshots/2026-11-17/d65b5b-* (d65b5b-report-*, d65b5b-t-*) · עבר QA (пользователь)
- 2026-11-17 · автотест e2e/tests/report-analysis/end-reason-duration-d65b5b.spec.ts (не запускался)
