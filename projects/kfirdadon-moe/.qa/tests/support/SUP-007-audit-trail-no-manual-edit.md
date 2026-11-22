<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# SUP-007: «מסלול ביקורת» — ручного изменения меток нет (UI и API)
- Фича/экран: /admin/support — панель «מסלול ביקורת»; REST candidate_invites / attempts
- Тикеты: #534912
- Роль/аккаунт: admin + business (владелец кандидата)
- Устройство: desktop 1440×900
- Тип: негатив
- Предусловия: кандидат QA-534912-2110-AC2. PATCH — только на его приглашение и только значением, равным текущему (no-op).
## Шаги
1. admin: открыть «מסלול ביקורת» у QA-534912-2110-AC2 — осмотреть панель.
2. business и admin: PATCH /rest/v1/candidate_invites?id=eq.<invite> {link_created_at: <текущее>}; PATCH /rest/v1/attempts?invite_id=eq.<invite> {reset_at: null} (строк нет).
3. admin: rpc/get_attempt_audit_trail без p_reason.
## Ожидаемо
- В панели нет полей ввода и кнопок правки; подпись «…ואינן ניתנות לעריכה» (AC5).
- PATCH → 403, code 42501 для обеих ролей и обеих таблиц; метка не изменилась (AC5 «הפעולה אינה קיימת במערכת»).
- Без причины → 400 reason_required (D-25).
## История
- 2026-10-21 · ✅ · #534912 (скрин 534912-AC5-audit-panel-no-edit-desktop.png)
- 2026-10-21 · עבר QA · автотест e2e/tests/admin-support/audit-trail-534912.spec.ts (не запускался)
