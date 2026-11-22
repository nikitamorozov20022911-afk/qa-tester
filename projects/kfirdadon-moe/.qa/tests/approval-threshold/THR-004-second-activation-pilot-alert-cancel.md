<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# THR-004: утверждение второй активной симуляции — 400 pilot_scope_exceeded, диалог «חריגה מהיקף הפיילוט המומלץ», «ביטול» оставляет неактивной
- Фича/экран: F-19 · S-09 · rpc approve_simulation
- Тикеты: #6a993d73690eb2387da2c2d9 (#a2c2d9)
- Роль/аккаунт: business (testim — в бизнесе уже есть активная симуляция)
- Устройство: desktop 1440×900
- Тип: негатив
- Предусловия: своя симуляция «QA-AUTO-a2c2d9-…» в «ממתינה לאישור»; в бизнесе ≥1 активная симуляция (иначе утверждение активирует — тест не запускать).
## Шаги
1. Отметить все 7 пунктов → «אישור והפעלה».
2. В диалоге нажать «ביטול».
## Ожидаемо
- approve_simulation с p_confirm_pilot_overrun=false → 400, message «pilot_scope_exceeded», hint «confirm_with_p_confirm_pilot_overrun» (AC5, треб.4).
- Диалог «חריגה מהיקף הפיילוט המומלץ»: «לעסק כבר יש סימולציה פעילה. בפיילוט מומלץ תרחיש אחד לעסק אחד ולתפקיד אחד. ההפעלה תתבצע רק לאחר אישור מפורש.», кнопки «הפעלה בכל זאת» и «ביטול».
- После «ביטול»: диалог закрыт, повторного approve_simulation нет, статус pending_approval (не активна), threshold_checklist пуст.
- Без UI: «הפעלה בכל זאת» (p_confirm_pilot_overrun=true) активирует — проверено 21.10 вручную, в автотесте не нажимается.
## История
- 2026-10-21 · ✅ · #a2c2d9 (скриншот a2c2d9-AC5-pilot-alert-desktop.png; log.jsonl 15:28:28)
- 2026-10-22 · עבר QA · автотест e2e/tests/approval-threshold/threshold-checklist-a2c2d9.spec.ts (только «ביטול», не запускался)
