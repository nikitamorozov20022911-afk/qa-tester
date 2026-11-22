<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# FLG-002: Отчёт без отметок: баннера в шапке нет
- Фича/экран: S-19 «דוח המועמד» — шапка
- Тикеты: #ece93f (6a993d6d5fdc2434e9ece93f) (AC5)
- Роль/аккаунт: bizt (business testim)
- Устройство: desktop 1440×900
- Тип: негатив
- Предусловия: кандидат с готовым отчётом и пустым content_flags (подбирается по API; сначала QA-…1432 / HUM-1310)
## Шаги
1. Подобрать кандидата с готовым отчётом без отметок по ответам API.
2. Открыть отчёт.
## Ожидаемо
- Блока report-content-flags нет, текста «סומנה אמירה» в шапке нет (источник: AC5 — отметка только там, где событие было).
## История
- 2026-11-17 · ✅ · .qa/screenshots/2026-11-17/ece93f-* (ece93f-t-noflag-phoneA-desktop.png, ece93f-3-report-noflag-*) · עבר QA (пользователь)
- 2026-11-17 · автотест e2e/tests/report-analysis/content-flags-banner-ece93f.spec.ts (не запускался)
