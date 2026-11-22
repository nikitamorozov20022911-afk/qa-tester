<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REC-027: номер куска записи > 300 — 400 validation_failed (ВРУЧНУЮ)
- Фича/экран: functions/v1/recording-upload-url
- Тикеты: #5f7c10
- Роль/аккаунт: кандидат (гость)
- Устройство: desktop Chrome 1440×900
- Тип: граница — **только вручную**
- Предусловия: АКТИВНАЯ официальная попытка (идёт звонок) у своего кандидата «QA-<hash>-…» (business testim, link_only); Chrome кандидата с --use-fake-ui-for-media-stream --use-fake-device-for-media-stream --use-file-for-fake-audio-capture=.qa/audio/seller-dialog.wav; ОДИН звонок на проверку (L-20261014-1). Токен приглашения — из ссылки /c/<token>, attempt_id — из тела POST functions/v1/start-voice-session; заголовки apikey/Authorization — anon key (как у страницы кандидата). Запросы делать из окна кандидата (fetch в его странице), не с токеном сотрудника.
## Шаги
1. Во время звонка: POST recording-upload-url {token, attempt_id, part: 301, bytes: 20000}.
2. (Граница 300 включительно на 21.10 отдельно не замерялась — при ручной проверке записать ответ для part: 300.)
## Ожидаемо
- П.1: 400, error «validation_failed» (источник: «מה רצוי» — «מגבלות גודל וקצב סבירות שנגזרות ממשך הסימולציה, וחריגה נדחית»; было — до 9999 кусков).
## История
- 2026-10-21 · ✅ · #5f7c10 (данные .qa/tmp/calls-2110e/)
- 2026-10-22 · עבר QA · не автоматизировано (нужна активная попытка)
