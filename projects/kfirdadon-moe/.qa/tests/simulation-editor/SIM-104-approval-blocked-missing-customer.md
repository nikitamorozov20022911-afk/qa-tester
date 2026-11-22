<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# SIM-104: передача на утверждение без «מצב הלקוח» и «הצורך» — 400 missing_required_fields и ссылки на поля
- Фича/экран: редактор симуляции S-08, «סקירת הטיוטה» /draft
- Тикеты: #6a993d767a46a91b6fdf30ff
- Роль/аккаунт: business (testim)
- Устройство: desktop 1440×900
- Тип: негатив
- Предусловия: черновик «QA-AUTO-df30ff-<stamp>-ריק» только с шагом 1 (через save_simulation)
## Шаги
1. /simulations/<id>/draft → «העברה לאישור».
## Ожидаемо
- submit_simulation_for_approval 400 missing_required_fields.
- «האישור נחסם: חסרים שדות חובה»; ссылки «מצב הלקוח בתחילת השיחה», «הצורך או הבעיה של הלקוח» → ?step=customer&field=…; «קשר קודם» в списке нет (AC3, AC5).
- Статус остаётся draft.
## История
- 2026-10-21 · ✅ · #6a993d767a46a91b6fdf30ff (сборка index-BT4tmDRk.js; доказательства .qa/screenshots/2026-10-21/df30ff-*.png)
- 2026-10-21 · עבר QA · автотест tests/simulation-editor/customer-disclosure-step.spec.ts (записан autotest-writer, не запускался — решение пользователя)
