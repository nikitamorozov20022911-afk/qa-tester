<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# ACL-009: бизнес открывает отчёт своего кандидата без причины; user — только назначенных ему
- Фича/экран: /candidates/<id>/report (S-19, контур бизнеса) (F-04)
- Тикеты: #6a993d78df85add81c766e3c
- Роль/аккаунт: business (account_manager, testim), user (recruiting_manager, testim)
- Устройство: desktop 1440×900
- Тип: позитив + негатив (только чтение, prod-safe)
- Предусловия: в testim есть кандидат с готовым отчётом (report_status ready), который не назначен user; у user есть назначенные кандидаты.
## Шаги
1. business → rpc list_candidates; кандидат с готовым отчётом, не входящий в список user.
2. business → /candidates/<id>/report.
3. user → /candidates/<свой назначенный id>/report.
4. user → /candidates/<id из шага 1>/report.
## Ожидаемо
- Шаги 2–3: сразу data-testid="attempt-view", нет «נדרשת סיבת גישה» и диалога причины; шапка «דוח תצפית על השיחה הרשמית»; rpc/get_candidate_report уходит с p_reason=null (источник: AC4 «הגישה מותרת ללא סיבת גישה»).
- Шаг 4: «המועמד לא נמצא», «ייתכן שהמועמד אינו בטיפולכם או שהקישור שגוי.», ссылка «חזרה למועמדים»; контента нет (AC4 «נותרת מוגבלת לגבולות ההרשאה שלו»).
## История
- 2026-10-13 · ✅ · #6a993d78df85 (Т4); עבר QA
