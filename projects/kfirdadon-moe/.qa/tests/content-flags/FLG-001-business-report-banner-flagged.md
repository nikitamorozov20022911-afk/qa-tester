<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# FLG-001: Отчёт у менеджера: баннер «בשיחה סומנה אמירה פוגענית של המועמד · mm:ss» совпадает с content_flags API
- Фича/экран: S-19 «דוח המועמד» — шапка (report-meta, report-content-flags)
- Тикеты: #ece93f (6a993d6d5fdc2434e9ece93f) (AC5)
- Роль/аккаунт: bizt (business testim)
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: QA-CALL1-0411 (01:13) и QA-C10-2110-D3 (00:35) — записанные события в attempt.content_flags
## Шаги
1. Найти кандидата по имени, получить get_candidate_report (p_reason null).
2. Открыть /candidates/<id>/report.
## Ожидаемо
- В шапке баннер report-content-flags: «בשיחה סומנה אמירה פוגענית של המועמד · 01:13» / «· 00:35»; число пунктов и время = content_flags в API (источник: AC5; ответ программиста 05.11 — тип и время, без слов кандидата).
## История
- 2026-11-17 · ✅ · .qa/screenshots/2026-11-17/ece93f-* (ece93f-t-call1-desktop.png, ece93f-t-c10-desktop.png) · עבר QA (пользователь)
- 2026-11-17 · автотест e2e/tests/report-analysis/content-flags-banner-ece93f.spec.ts (не запускался)
