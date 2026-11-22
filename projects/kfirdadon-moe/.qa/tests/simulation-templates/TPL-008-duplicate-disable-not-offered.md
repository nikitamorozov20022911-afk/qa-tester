<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# TPL-008: שכפול и השבתה шаблона; отключённая копия не предлагается ни admin в «סיוע», ни business в модалке
- Фича/экран: /admin/templates, /admin/businesses/<id>, /simulations/new
- Тикеты: #6a993d791a95398b11e1fb6e
- Роль/аккаунт: admin + business
- Устройство: desktop 1440×900
- Тип: позитив + негатив
- Предусловия: шаблон QA-AUTO.
## Шаги
1. admin: дублировать шаблон → копия «(עותק)»; отключить копию.
2. /admin/templates — строка копии; «סיוע» — список шаблонов.
3. business: /simulations/new → «תבניות זמינות».
## Ожидаемо
- Копия есть; после отключения — «מושבתת» и кнопка «הפעלה» (דרישה 1 — «יצירה, עריכה, שכפול והשבתה»).
- Копии нет ни в «סיוע», ни в модалке; оригинал — есть.
## История
- 2026-10-14 · ✅ · #6a993d791a95398b11e1fb6e (a16a64fc)
- 2026-10-14 · עבר QA · автотест tests/simulation-templates/template-library-assist.spec.ts
