<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# TPL-003: user (מנהל/ת מגייס/ת) не создаёт симуляции из шаблона
- Фича/экран: /simulations/new
- Тикеты: #d1389638e94bd1fb2467199d
- Роль/аккаунт: user (nelit32958@…)
- Устройство: desktop 1440×900
- Тип: негатив
- Предусловия: активный шаблон QA-AT.
## Шаги
1. user → /simulations/new.
2. user → RPC create_simulation_from_template.
## Ожидаемо
- h1 «אין לך הרשאה למסך הזה», блока шаблонов нет; RPC → 403.
## История
- 2026-10-04 · ✅ · #d1389638
- 2026-10-05 · עבר QA · автотест tests/simulation-templates/template-for-any-new-simulation.spec.ts
