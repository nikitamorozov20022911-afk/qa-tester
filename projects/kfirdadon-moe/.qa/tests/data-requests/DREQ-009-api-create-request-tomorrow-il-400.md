<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# DREQ-009: API: admin_create_data_request с завтрашней датой IL → 400
- Фича/экран: «בקשות עיון ומחיקת מידע» /admin/data-requests, панель «קליטת בקשה»
- Тикеты: #597ccf (bda08b8d4fb6c3dcfb597ccf)
- Роль/аккаунт: admin (Super Admin)
- Устройство: desktop 1440×900
- Тип: негатив, API
- Предусловия: сессия admin; запись невозможна (id и тип пустые), @prod-safe
## Шаги
1. С заголовками сессии admin вызвать RPC admin_create_data_request с p_received_at = завтра IL (id/тип пустые).
## Ожидаемо
- HTTP 400, в теле validation_failed и поле received_at (источник: AC2; комментарий программиста 19.10; проверено вручную 18.11 — API 400).
## История
- 2026-11-18 · ✅ · #597ccf (ночь 00:30 IST, скрины 597ccf-*) · עבר QA (пользователь)
- 2026-11-18 · автотест e2e/tests/data-requests/intake-date-il-597ccf.spec.ts (записан, не запускался)
