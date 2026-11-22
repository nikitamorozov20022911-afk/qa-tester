<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# BG-002: на длинной странице внизу тот же градиент, без обрыва и серой полосы
- Фича/экран: отчёт кандидата /candidates/<id>/report, /simulations
- Тикеты: #dbea28b76137e3b7198da386
- Роль/аккаунт: business (testim)
- Устройство: desktop 1440×1024
- Тип: визуал
- Предусловия: отчёт 7ade4110-48a9-4f1d-9835-b3ecb102cbcc (scrollHeight > 1024).
## Шаги
1. Открыть отчёт, прокрутить до низа.
2. Снимок окна (не fullPage — у fixed-фона склейка), точки (1432,512), (10,1012).
## Ожидаемо
- background-attachment fixed; в точках те же значения, что в BG-001 (допуск 12) (источник: AC).
## История
- 2026-10-14 · ✅ · #8da386 (отчёт scrollHeight 1693, /simulations 5996)
- 2026-10-14 · עבר QA · автотест tests/layout/business-background-gradient.spec.ts
