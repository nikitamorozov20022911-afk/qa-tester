<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# CAND-009: рекрутёр по ЧУЖОМУ кандидату — решение и заметка блокируются, данные не меняются
- Фича/экран: /candidates/<id>/report, PATCH /rest/v1/candidates, POST /rest/v1/rpc/add_internal_note
- Тикеты: #6a993d6ab2e4b167537ea9a3
- Роль/аккаунт: user (מגייס «апвпп») + business (контроль)
- Устройство: desktop 1440×900
- Тип: негатив (права)
- Предусловия: чужой для рекрутёра кандидат — по умолчанию QA-N16-6e5ece-kbd-1436 (QA_FOREIGN_CANDIDATE; назначен другому). Записи блокируются сервером → данные не меняются.
## Шаги
1. business: get_candidate_report → исходные hiring и notes.
2. user: в /candidates (list_candidates) этого кандидата нет; /candidates/<id>/report → «המועמד לא נמצא».
3. user: PATCH candidates?id=eq.<id>&select=id {recruiting_status: другое значение}.
4. user: rpc add_internal_note {p_candidate_id, p_body «QA-AUTO-AC5-PROBE…», p_report_id}.
5. business: get_candidate_report → hiring и notes.
## Ожидаемо
- Шаг 2: кандидата в списке нет; экран «המועמד לא נמצא» и нет панели решения.
- Шаг 3: 200 с телом [] — 0 строк обновлено (RLS; UI трактует как отказ «אין לכם הרשאה…»).
- Шаг 4: 403, code 42501, message forbidden.
- Шаг 5: hiring и notes совпадают с исходными, текста пробы нет (источник: AC5 «בהינתן משתמש ללא הרשאה לרשומה … הפעולה נחסמת», треб.5).
## История
- 2026-10-14 · ✅ · #7ea9a3 (проба API: PATCH 200 [], rpc 403 42501; у менеджера без изменений)
- 2026-10-14 · עבר QA · автотест tests/candidates/hiring-decision-foreign-recruiter.spec.ts
