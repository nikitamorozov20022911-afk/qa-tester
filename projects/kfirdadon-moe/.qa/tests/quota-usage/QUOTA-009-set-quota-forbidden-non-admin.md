<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# QUOTA-009: admin_set_business_quota от менеджера/рекрутёра → 403
- Фича/экран: API rpc admin_set_business_quota
- Тикеты: #bdd327 (6a993d6887e898ed58bdd327) (+ #ea1aa0 — тот же футер)
- Роль/аккаунт: менеджер аккаунта (bizt.json), מנהל/ת מגייס/ת (user-2.json)
- Устройство: desktop 1440×900
- Тип: негатив (права API)
- Предусловия: Цель вызова — несуществующий бизнес 00000000-…: ничего не меняется даже при сломанной проверке роли.
## Шаги
1. Прочитать get_business_usage.
2. Вызвать admin_set_business_quota (p_business_id=00000000-…, 2026-11-01…2026-11-30, p_quota=1, p_warning_percent=80).
3. Снова get_business_usage.
## Ожидаемо
- 403, code 42501, message forbidden (AC6, треб. 6; факт 17.11).
- quota/remaining/порог/период не изменились.
## История
- 2026-11-17 · ✅ · #bdd327 (проверено вручную, подтверждено пользователем)
- 2026-11-17 · עבר QA · автотест e2e/tests/quota-usage/quota-live-bdd327.spec.ts (не запускался)
