<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# QUOTA-010: get_business_usage чужого бизнеса → 403
- Фича/экран: API rpc get_business_usage
- Тикеты: #bdd327 (6a993d6887e898ed58bdd327) (+ #ea1aa0 — тот же футер)
- Роль/аккаунт: менеджер аккаунта, מנהל/ת מגייס/ת
- Устройство: desktop 1440×900
- Тип: негатив (изоляция бизнесов)
- Предусловия: Чужой бизнес — QA-PILOT-1410 (b0d2a797-…, переопределяется QA_EBDB2F_FOREIGN_ID).
## Шаги
1. get_business_usage без id (свой).
2. get_business_usage с p_business_id = чужой.
3. get_business_usage с p_business_id = свой id.
## Ожидаемо
- Чужой: 403, code 42501, message forbidden (миграция 20261104100000, факт 17.11).
- Свой id и пустой вызов дают одинаковые used/quota/remaining.
## История
- 2026-11-17 · ✅ · #bdd327 (проверено вручную, подтверждено пользователем)
- 2026-11-17 · עבר QA · автотест e2e/tests/quota-usage/quota-live-bdd327.spec.ts (не запускался)
