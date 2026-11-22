<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# FLG-003: Super Admin: «מסלול ביקורת» → «אמירות שסומנו בשיחה» совпадает с API трассы
- Фича/экран: S-02 /admin/support — панель «מסלול ביקורת»
- Тикеты: #ece93f (6a993d6d5fdc2434e9ece93f) (AC5)
- Роль/аккаунт: admin
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: QA-CALL1-0411, QA-C10-2110-D3; данные сверяются с get_attempt_audit_trail
## Шаги
1. /admin/support (все даты) → «פעולות תמיכה עבור <имя>» → «מסלול ביקורת».
2. Раздел «אמירות שסומנו בשיחה».
## Ожидаемо
- Пункты audit-content-flag: тип, «ניסיון N», время mm:ss — как в attempts[].content_flags API; их число равно числу в API (источник: AC5).
## История
- 2026-11-17 · ✅ · .qa/screenshots/2026-11-17/ece93f-* (ece93f-1-audit-drawer-*) · עבר QA (пользователь)
- 2026-11-17 · автотест e2e/tests/admin-support/content-flags-ece93f.spec.ts (не запускался)
