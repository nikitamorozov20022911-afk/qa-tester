<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# CAND-006: внутренняя заметка видна команде с автором и временем и не видна кандидату
- Фича/экран: הערה פנימית — rpc add_internal_note{p_candidate_id,p_body,p_report_id}, get_candidate_report.notes, ссылка кандидата /c/…
- Тикеты: #6a993d6ab2e4b167537ea9a3
- Роль/аккаунт: business + гость (ссылка кандидата)
- Устройство: desktop 1440×900
- Тип: позитив + негатив (утечка)
- Предусловия: кандидат «QA-AUTO-HD-…» из CAND-005 (отчёта нет → p_report_id null, как шлёт UI при попытке без отчёта). Заметки не удаляются.
## Шаги
1. business: add_internal_note «QA-AUTO-NOTE-<stamp> …».
2. business: get_candidate_report → notes.
3. Гость открывает ссылку кандидата /c/…, собирает тела ответов сети.
## Ожидаемо
- add_internal_note 200; в notes есть заметка с этим текстом, автор = текущий пользователь, created_at заполнен (источник: AC3, треб.2 «הערה פנימית גלויה רק לצוות»).
- У гостя ни на странице, ни в ответах сети нет текста заметки (источник: AC3).
## История
- 2026-10-14 · ✅ · #7ea9a3 (QA-G4-A-1321: заметка QA-N14 · fdfdf; гость по ссылке — 0 совпадений в ответах)
- 2026-10-14 · עבר QA · автотест tests/candidates/hiring-decision-notes.spec.ts
