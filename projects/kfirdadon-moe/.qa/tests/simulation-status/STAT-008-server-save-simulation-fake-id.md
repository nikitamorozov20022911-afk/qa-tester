<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# STAT-008: сервер: save_simulation на несуществующий id
- Фича/экран: API save_simulation
- Тикеты: #94c3ab (6a993d738eac0db9d694c3ab)
- Роль/аккаунт: менеджер аккаунта
- Устройство: API
- Тип: негатив
- Предусловия: p_simulation_id = 00000000-0000-0000-0000-000000000094 (не существует, не null — новый черновик не создаётся).
## Шаги
1. rpc save_simulation с этим id.
2. GET simulations?id=eq.<id>.
## Ожидаемо
- 400.
- Симуляция с таким id не появилась.
## История
- 2026-11-17 · ✅ · #94c3ab (проверено вручную на живом сайте, подтверждено пользователем)
- 2026-11-17 · עבר QA · автотест e2e/tests/simulation-status/statuses-live-94c3ab.spec.ts (не запускался, только --list)
