<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# SUP-014: rpc admin_rerun_report_processing от recruiter и от менеджера → 403
- Фича/экран: серверная проверка ד4 (перезапуск — только Super Admin)
- Тикеты: #bf7c47 (6a993d6cdaed11dfc1bf7c47)
- Роль/аккаунт: user-2 (recruiter), bizt (מנהל חשבון)
- Устройство: desktop (API)
- Тип: негатив (API)
- Предусловия: сессии user-2 и bizt; вызов с нулевым UUID — ничего не запускается и не меняется
## Шаги
1. Войти recruiter → открыть /candidates (берём токен сессии).
2. rpc admin_rerun_report_processing {p_attempt_id: 00000000-0000-0000-0000-000000000000, p_reason}.
3. То же от менеджера (bizt).
## Ожидаемо
- Ответ 403 в обоих случаях (источник: ד4; проверено 14.10/21.10 и 17.11).
## История
- 2026-11-17 · ✅ · .qa/screenshots/2026-11-17/bf7c47-* · עבר QA (пользователь)
- 2026-11-17 · автотест e2e/tests/admin-support/rerun-permissions-bf7c47.spec.ts (не запускался)
