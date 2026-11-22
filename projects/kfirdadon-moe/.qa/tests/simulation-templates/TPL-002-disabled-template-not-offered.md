<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# TPL-002: отключённый шаблон не предлагается (UI + RPC 400 template_disabled)
- Фича/экран: /simulations/new
- Тикеты: #d1389638e94bd1fb2467199d
- Роль/аккаунт: admin + business
- Устройство: desktop 1440×900
- Тип: негатив
- Предусловия: шаблон QA-AT из TPL-001.
## Шаги
1. admin отключает шаблон (admin_set_template_status disabled).
2. business → /simulations/new.
3. business → RPC create_simulation_from_template с id отключённого шаблона.
## Ожидаемо
- Шаблона нет на странице (при 0 активных блок скрыт).
- RPC → 400 template_disabled. (Гонка «страница открыта, админ отключил» → «לא בוצע / התבנית הזו הושבתה בינתיים…» — вручную.)
## История
- 2026-10-04 · ✅ · #d1389638
- 2026-10-05 · עבר QA · автотест tests/simulation-templates/template-for-any-new-simulation.spec.ts
