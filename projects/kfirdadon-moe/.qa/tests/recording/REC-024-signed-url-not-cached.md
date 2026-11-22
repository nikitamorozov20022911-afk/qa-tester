<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# REC-024: ответ подписанной ссылки на запись не кэшируется (no-store, не CDN HIT)
- Фича/экран: functions/v1/get-recording-url (POST → signed_url; GET signed_url)
- Тикеты: #8eb9d8 (b086024193665fbc0b8eb9d8)
- Роль/аккаунт: business (выдача ссылки); GET ссылки — без входа
- Устройство: desktop
- Тип: позитив/кэш (только чтение)
- Предусловия: целая запись QA-C4-2110-D2 (запись 0b8d3dfc). НЕ удалять.
## Шаги
1. POST get-recording-url {recording_id} с сессией business → signed_url, expires_in.
2. GET signed_url дважды подряд (без заголовков авторизации).
## Ожидаемо
- POST 200, signed_url есть, 0 < expires_in ≤ 600 (F-36: «כתובת חתומה מוגבלת בזמן»; факт 600).
- Оба GET 200/206; cache-control содержит «no-store» и «private»; cf-cache-status ≠ HIT (факт DYNAMIC); age нет или 0; x-vercel-cache ≠ HIT (комментарий программиста «no-store, CDN не кэширует»; AC тикета).
## История
- 2026-10-21 · ✅ · #8eb9d8 (лог .qa/tmp/8eb9d8-purge/log.jsonl)
- 2026-10-21 · עבר QA · автотест e2e/tests/recording/purged-recording-8eb9d8.spec.ts (не запускался)
