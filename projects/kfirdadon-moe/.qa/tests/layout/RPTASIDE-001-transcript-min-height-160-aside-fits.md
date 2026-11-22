<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# RPTASIDE-001: минимум транскрипта 160px, колонка целиком в экране при скролле 0
- Фича/экран: отчёт кандидата в режиме поддержки Super Admin (/admin/support/candidates/<id>/report?reason=support), боковая колонка
- Тикеты: #799398 (7e5e16903a1b3d1d88799398)
- Роль/аккаунт: admin
- Устройство: desktop 1440×900 и 1440×1024; 390×844 (только min-height)
- Тип: позитив, замер
- Предусловия: сессия admin; кандидат QA-C2-2110-D2 (71c9d469-5992-466f-a592-67e7a1c0f50e) с готовым отчётом
## Шаги
1. Открыть отчёт с ?reason=support.
2. DevTools: computed min-height у `<ol>` в `[data-testid=transcript]`.
3. Низ `main aside` при скролле 0.
## Ожидаемо
- min-height = 160px на всех окнах (источник: AC5; ответ 17.11 — calc(8 * --line-height-cell), без нового токена).
- На 1440: низ колонки ≤ высоты окна при скролле 0, с «סיבת הגישה» (источник: AC1).
## История
- 2026-11-17 · ✅ · #799398 (скрины 799398-*) · עבר QA (пользователь)
- 2026-11-17 · автотест e2e/tests/layout/report-aside-support-799398.spec.ts
