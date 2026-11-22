<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# FLG-005: get_candidate_report у Super Admin без причины → 400 reason_required, с неверной — 400 invalid_reason
- Фича/экран: серверная проверка доступа к контенту (D-25)
- Тикеты: #ece93f (6a993d6d5fdc2434e9ece93f) (AC5, R11)
- Роль/аккаунт: admin
- Устройство: desktop (API)
- Тип: негатив (API)
- Предусловия: candidate_id из трассы QA-CALL1-0411; допустимая причина НЕ отправляется (журнал доступа не пишется)
## Шаги
1. rpc get_candidate_report {p_candidate_id} без p_reason.
2. То же с p_reason = «qa-not-a-reason».
## Ожидаемо
- 400 и код reason_required; 400 и invalid_reason (источник: D-25, DB-тест M4, ответ 05.11).
## История
- 2026-11-17 · ✅ · .qa/screenshots/2026-11-17/ece93f-* (ece93f-r-11-*) · עבר QA (пользователь)
- 2026-11-17 · автотест e2e/tests/admin-support/content-flags-ece93f.spec.ts (не запускался)
