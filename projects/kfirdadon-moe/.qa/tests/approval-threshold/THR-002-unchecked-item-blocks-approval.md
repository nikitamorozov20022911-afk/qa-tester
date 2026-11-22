<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# THR-002: неотмеченный пункт порога блокирует утверждение — в UI назван именно он, сервер отвечает 400 threshold_incomplete
- Фича/экран: F-19 · S-09 · rpc approve_simulation
- Тикеты: #6a993d73690eb2387da2c2d9 (#a2c2d9)
- Роль/аккаунт: business (testim)
- Устройство: desktop 1440×900
- Тип: негатив
- Предусловия: как THR-001 (своя симуляция в «ממתינה לאישור»).
## Шаги
1. Для каждого из 7 пунктов: отметить все, кроме него → «אישור והפעלה».
2. Сервер (без UI): approve_simulation с p_threshold, где comparability=false (остальные true).
## Ожидаемо
- Шаг 1: алерт «האישור נחסם» с текстом «יש לסמן את הפריטים הבאים לפני האישור: <название пункта>.»; запрос approve_simulation не уходит; счётчик «6 מתוך 7»; статус — «ממתינה לאישור» (AC2: «האישור נחסם ומוצג הפריט החסר»; FL-19: обхода нет).
- Шаг 2: 400, message «threshold_incomplete: comparability», details «comparability»; статус pending_approval, threshold_checklist пуст.
## История
- 2026-10-21 · ✅ · #a2c2d9 (скриншот a2c2d9-AC2-6of7-blocked-desktop.png; сервер — .qa/tmp/B2-2110/R/log.jsonl 15:28:38)
- 2026-10-22 · עבר QA · автотест e2e/tests/approval-threshold/threshold-checklist-a2c2d9.spec.ts (не запускался)
