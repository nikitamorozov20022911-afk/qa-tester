<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# SIM-103: скрытые пункты не попадают в «מה המועמד יראה» и get_candidate_view
- Фича/экран: редактор симуляции S-08, «סקירת הטיוטה» /draft
- Тикеты: #6a993d767a46a91b6fdf30ff
- Роль/аккаунт: business (testim)
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: черновик из SIM-102; генерация AI подменена 422
## Шаги
1. Открыть /simulations/<id>/draft.
## Ожидаемо
- Ответ get_candidate_view и панель «מה המועמד יראה» содержат пункт «מוצג מראש», не содержат «לגלות בשיחה»/«רק בשאלה» и условие (треб.5, AC4).
- Экраны кандидата и candidate_open_link — проверены вручную 21.10, в автотест не вошли (нужна активация).
## История
- 2026-10-21 · ✅ · #6a993d767a46a91b6fdf30ff (сборка index-BT4tmDRk.js; доказательства .qa/screenshots/2026-10-21/df30ff-*.png)
- 2026-10-21 · עבר QA · автотест tests/simulation-editor/customer-disclosure-step.spec.ts (записан autotest-writer, не запускался — решение пользователя)
