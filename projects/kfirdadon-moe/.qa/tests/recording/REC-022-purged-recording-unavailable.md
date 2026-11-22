<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REC-022: после «ניקוי 90 יום» запись недоступна — отчёт сообщает об удалении, get-recording-url → 404
- Фича/экран: отчёт кандидата /candidates/<id>/report, functions/v1/get-recording-url
- Тикеты: #8eb9d8 (b086024193665fbc0b8eb9d8) · связан 57c30030
- Роль/аккаунт: business (testim)
- Устройство: desktop
- Тип: позитив/удаление (только чтение готового результата)
- Предусловия: QA-8eb9d8-2110 (кандидат 5dc4bdba-df4f-4dcd-859b-2333c98578c1, попытка f23f1072, запись 230865a0-3a45-4e4a-a643-fae9e90da958) очищен «ניקוי 90 יום» 21.10 18:15. НЕ удалять кандидата.
## Шаги
1. get_candidate_report (p_reason null) для QA-8eb9d8-2110.
2. POST get-recording-url {recording_id: 230865a0…} с сессией business.
3. Открыть /candidates/5dc4bdba…/report.
## Ожидаемо
- attempt.content_erased_at задан; recording = null; transcript = null; report = null (F-56 AC8 «לאחר המחיקה כל קישור או כתובת חתומה שהפנו לתוכן מפסיקים לפעול»).
- get-recording-url → 404 {"error":"not_found"} (AC тикета).
- В отчёте: «ההקלטה של השיחה נמחקה.», «התמלול נמחק יחד עם ההקלטה.», «התוכן של השיחה נמחק»; плеера и <audio> нет.
## История
- 2026-10-21 · ✅ · #8eb9d8 (скриншоты .qa/screenshots/2026-10-21/8eb9d8-PURGE-06-report-after.png)
- 2026-10-21 · עבר QA · автотест e2e/tests/recording/purged-recording-8eb9d8.spec.ts (не запускался)
