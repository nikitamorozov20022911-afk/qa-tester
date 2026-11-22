<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REC-026: кусок записи больше 1 МиБ — 413 part_too_large {max_bytes:1048576} и при выдаче ссылки, и при PUT (ВРУЧНУЮ)
- Фича/экран: functions/v1/recording-upload-url → PUT в Storage (bucket recordings)
- Тикеты: #5f7c10 (74207659c68b798b1a5f7c10)
- Роль/аккаунт: кандидат (гость, токен приглашения)
- Устройство: desktop Chrome 1440×900
- Тип: негатив / граница — **только вручную** (решение пользователя 22.10: без звонков в автотестах; без активной попытки отказ не доказывает лимит)
- Предусловия: АКТИВНАЯ официальная попытка (идёт звонок) у своего кандидата «QA-<hash>-…» (business testim, link_only); Chrome кандидата с --use-fake-ui-for-media-stream --use-fake-device-for-media-stream --use-file-for-fake-audio-capture=.qa/audio/seller-dialog.wav; ОДИН звонок на проверку (L-20261014-1). Токен приглашения — из ссылки /c/<token>, attempt_id — из тела POST functions/v1/start-voice-session; заголовки apikey/Authorization — anon key (как у страницы кандидата). Запросы делать из окна кандидата (fetch в его странице), не с токеном сотрудника.
## Шаги
1. Во время звонка: POST functions/v1/recording-upload-url {token, attempt_id, part: 250, bytes: 1500000}.
2. То же с bytes: 60000000.
3. POST {part: 251, bytes: 20000} → получить upload_url и upload_headers (x-upload-ticket); PUT на upload_url тело 1 500 000 байт (content-type audio/webm, x-upsert true + upload_headers).
4. Обычный кусок ≤ 1 МиБ (п.3 без подмены тела) — для контроля.
## Ожидаемо
- П.1, п.2: 413, тело {"error":"part_too_large","max_bytes":1048576}, ответ < 1 с.
- П.3 выдача: 200, max_bytes 1048576, expires_in 300, заголовок x-upload-ticket; PUT 1,5 МБ → 413 part_too_large {max_bytes:1048576} < 1 с.
- Источник: AC «העלאת חלק הקלטה גדול מהמגבלה … נדחים».
## История
- 2026-10-21 · ✅ · #5f7c10 (attempt ff4e016b; screenshots/2026-10-21/5f7c10-probe-result.json: 627/366/416 мс)
- 2026-10-22 · עבר QA · не автоматизировано (нужна активная попытка = звонок)
