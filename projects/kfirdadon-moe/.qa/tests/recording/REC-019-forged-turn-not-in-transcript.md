<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REC-019: поддельное событие «turn» от браузера кандидата не попало в транскрипт; роли верны
- Фича/экран: транскрипт попытки (get_candidate_report) и отчёт /candidates/<id>/report
- Тикеты: #16dea8 (fe219494b9b5f50edd16dea8)
- Роль/аккаунт: business (testim), только чтение
- Устройство: desktop 1440×900
- Тип: негатив / безопасность (по готовой попытке, без звонка)
- Предусловия: попытка «QA-5f7c10-2110» (80d7ad3b…, попытка cd0c1a09, 116 с, транскрипт 4a12bcfa, 14 сегментов). Во время звонка 21.10 браузер кандидата отправил candidate_record_event {p_kind:'turn', payload.speaker:'candidate', text:'QA-FORGED …'}, payload 1 МБ и 200 событий «burst<i>» — все 400 invalid_event (доказательство: tmp/calls-2110b/S4/abuse.json). НЕ удалять.
## Шаги
1. get_candidate_report кандидата.
2. Открыть отчёт.
## Ожидаемо
- Ни в одном сегменте нет «QA-FORGED», «אני הלקוח המדומה», «burst<число>», строк «AAAA…» (AC: «דובר של קטע נקבע ממקור שהמועמד אינו יכול לשנות»).
- Порядок говорящих (14 сегментов): customer, candidate, customer, candidate, customer, customer, candidate, customer, candidate, customer, candidate, customer, candidate, customer; 0 null.
- «שלום יוסי, מדבר אלון…» — candidate, «הלו. כן, מדבר יוסי.» — customer.
- На странице отчёта текста «QA-FORGED» нет.
## История
- 2026-10-21 · ✅ · #16dea8 (attempt cd0c1a09)
- 2026-10-21 · עבר QA · автотест e2e/tests/recording/speaker-trust-16dea8.spec.ts (не запускался)
