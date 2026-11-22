<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# SUP-011: Строка лога: одна строка 500×20, LTR, прижата к началу, формат «HH:MM:SS report-processing failed (attempt N of 2): …»
- Фича/экран: «תמיכה ותפעול» — окно «לוג טכני אחרון» (Figma 842:3057)
- Тикеты: #bf7c47 (6a993d6cdaed11dfc1bf7c47) · реджект rej_59813d3f п.1
- Роль/аккаунт: admin
- Устройство: desktop 1440×900
- Тип: замер
- Предусловия: сессия admin; в /admin/support есть строка «לטיפול ידני» (data-manual-handling=true, report generation_error): QA-PHONE-17fdd9-0411-A / QA-C10-2110-D3 / QA-CALL1-0411. Только чтение: перезапуск не нажимается
## Шаги
1. Открыть окно лога (SUP-010).
2. Для каждой `[data-testid=support-log-line]`: getBoundingClientRect, dir, computed direction/text-align, текст.
## Ожидаемо
- Ширина 500, высота 20 (одна строка, не две), dir=ltr, direction ltr, text-align left/start.
- Текст: время ЧЧ:ММ:СС (не дата), «of 2», причина через дефисы (источник: реджект rej_59813d3f п.1, Figma 842:3057, миграция 20261116100000).
## История
- 2026-11-17 · ✅ · .qa/screenshots/2026-11-17/bf7c47-* · עבר QA (пользователь)
- 2026-11-17 · автотест e2e/tests/admin-support/rerun-log-dialog-bf7c47.spec.ts (не запускался)
