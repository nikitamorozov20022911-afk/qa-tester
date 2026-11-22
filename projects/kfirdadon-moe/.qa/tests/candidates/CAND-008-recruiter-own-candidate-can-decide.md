<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# CAND-008: рекрутёр по СВОЕМУ кандидату может поставить решение и заметку, менеджер это видит
- Фича/экран: PATCH candidates {recruiting_status}, rpc add_internal_note; /candidates (рекрутёр и менеджер)
- Тикеты: #6a993d6ab2e4b167537ea9a3
- Роль/аккаунт: business (создаёт и назначает) + user (משתמש בית העסק / מגייס «апвпп»)
- Устройство: desktop 1440×900
- Тип: позитив (права)
- Предусловия: менеджер создаёт «QA-AUTO-HDU-<stamp>» (link_only) с назначением на рекрутёра. Не удаляется.
## Шаги
1. business: /candidates/new, «מנהל אחראי» = рекрутёр → «יצירת קישור».
2. user: /candidates — кандидат в списке; PATCH recruiting_status=further_clarification_needed; add_internal_note «QA-AUTO-NOTE-U-…».
3. business: /candidates?q=<имя> — «החלטת גיוס»; get_candidate_report — hiring.changed_by, notes.
## Ожидаемо
- Рекрутёр видит своего кандидата; PATCH 200 [{id}]; заметка 200 (источник: треб.5 «עדכון הסטטוס אפשרי רק למשתמש שהרשומה משויכת אליו או למנהל חשבון העסק»).
- Менеджер видит «נדרש בירור נוסף»; changed_by = рекрутёр; заметка рекрутёра с его авторством (AC2/AC3).
## История
- 2026-10-14 · ✅ · #7ea9a3 (QA-G4b-U-1432, «עודכן על ידי апвпп»)
- 2026-10-14 · עבר QA · автотест tests/candidates/hiring-decision-notes.spec.ts
