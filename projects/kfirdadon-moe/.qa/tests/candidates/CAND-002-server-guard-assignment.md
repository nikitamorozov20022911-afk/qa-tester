<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# CAND-002: сервер — create_candidate / PATCH candidates только на активную версию
- Фича/экран: API create_candidate, PATCH /rest/v1/candidates
- Тикеты: #b950c1450cef01f561ab010f
- Роль/аккаунт: business
- Устройство: desktop 1440×900 (API)
- Тип: негатив + позитив
- Предусловия: симуляции во всех статусах; писем не отправлять (только create_candidate → link_created, без send-candidate-invite). Позитив создаёт кандидата «QA-AUTO-…» (неудаляем, квота).
## Шаги
1. create_candidate на draft, pending_approval, previous_version, inactive.
2. create_candidate на active.
3. PATCH candidates.simulation_id этого кандидата → inactive, затем → active.
## Ожидаемо
- Шаг 1: 400 simulation_not_active для каждого статуса.
- Шаг 2: 200, кандидат привязан к активной.
- Шаг 3: 400 simulation_not_assignable; на активную — 200, simulation_id = активная.
## История
- 2026-10-04 · ✅ · #b950c145 (×2 прогона)
- 2026-10-05 · עבר QA · автотест tests/candidates/assign-only-active-simulation.spec.ts
