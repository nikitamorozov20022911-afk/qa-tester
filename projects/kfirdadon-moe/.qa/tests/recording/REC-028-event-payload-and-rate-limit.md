<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REC-028: candidate_record_event — payload > 16 KiB → 400 event_payload_too_large; серия > ~30 событий за 10 с → 400 event_rate_limited (ВРУЧНУЮ)
- Фича/экран: rest/v1/rpc/candidate_record_event
- Тикеты: #5f7c10 (связан #16dea8 — REC-021)
- Роль/аккаунт: кандидат (гость)
- Устройство: desktop Chrome 1440×900
- Тип: негатив / граница — **только вручную**
- Предусловия: АКТИВНАЯ официальная попытка (идёт звонок) у своего кандидата «QA-<hash>-…» (business testim, link_only); Chrome кандидата с --use-fake-ui-for-media-stream --use-fake-device-for-media-stream --use-file-for-fake-audio-capture=.qa/audio/seller-dialog.wav; ОДИН звонок на проверку (L-20261014-1). Токен приглашения — из ссылки /c/<token>, attempt_id — из тела POST functions/v1/start-voice-session; заголовки apikey/Authorization — anon key (как у страницы кандидата). Запросы делать из окна кандидата (fetch в его странице), не с токеном сотрудника.
## Шаги
1. Во время звонка: POST rpc/candidate_record_event {p_token, p_attempt_id, p_kind:'connection_warning', p_payload:{qa:'QA-5f7c10 big', pad:'x'×≈20000}, p_offset_ms:null}.
2. Сразу 40 запросов подряд {p_kind:'connection_warning', p_payload:{packet_loss:0, rtt_ms:1, qa:'QA-5f7c10 rate N'}} без пауз.
## Ожидаемо
- П.1 (≈20 062 байта): 400, message «event_payload_too_large», details «p_payload».
- П.2: первые ≈28 → 200 {id}, далее (29…40, всё за ≈3,7 с) → 400 message «event_rate_limited».
- Звонок при этом не обрывается (REC-029). Источник: AC «קצב חריג של אירועים מצד המועמד נדחה».
## История
- 2026-10-21 · ✅ · #5f7c10 (attempt ff4e016b: 98 мс event_payload_too_large; 28×200, 29–40 → 400 event_rate_limited)
- 2026-10-22 · עבר QA · не автоматизировано (нужна активная попытка)
