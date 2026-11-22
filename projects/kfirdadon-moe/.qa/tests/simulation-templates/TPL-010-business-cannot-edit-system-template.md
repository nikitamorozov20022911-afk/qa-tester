<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# TPL-010: business не может править шаблон платформы — 403 в UI и в API
- Фича/экран: /admin/templates под business; REST/RPC
- Тикеты: #6a993d791a95398b11e1fb6e
- Роль/аккаунт: business (+ admin — контроль)
- Устройство: desktop 1440×900
- Тип: негатив / доступ
- Предусловия: шаблон QA-AUTO.
## Шаги
1. business: /admin/templates.
2. business: RPC admin_save_template (переименовать), PATCH simulation_templates.
3. Контроль имени (business GET, admin GET).
## Ожидаемо
- «קוד 403», «אין לכם גישה לעמוד הזה», текст «המסך הזה מנוהל ברמת הפלטפורמה…», «חזרה לדשבורד», «פנייה לתמיכה»; кнопки «תבנית חדשה» нет (FL-02 ш.2 — «נחסם עם הסבר שהתבנית מנוהלת ברמת הפלטפורמה»).
- RPC и PATCH → 403 (42501); имя не изменилось; чтение 200 (AC5 — «הפעולה נחסמת והוא רשאי רק לצרוך אותה»).
## История
- 2026-10-14 · ✅ · #6a993d791a95398b11e1fb6e (API-проба 12:27: 403/42501 ×2)
- 2026-10-14 · עבר QA · автотест tests/simulation-templates/template-library-assist.spec.ts
