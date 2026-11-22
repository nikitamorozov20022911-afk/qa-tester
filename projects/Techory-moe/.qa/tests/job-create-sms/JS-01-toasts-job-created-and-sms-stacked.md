# JS-01: Create Job с техником — toast «Job Created Successfully!» и toast SMS стопкой, оба читаются
- Фича/экран: New Job → Dispatch → Create Job → JobDetail (toast справа сверху)
- Тикеты: #8ae966, #de116e (общий контейнер тостов изменён, commit 9ca6293)
- Роль/аккаунт: admin, компания «test» (selected-company-id 4432bd2f-…, вернуть в конце)
- Устройство: desktop 1440×900
- Тип: позитив (регресс бага)
- Предусловия: техник ТОЛЬКО «QA-F5 tech» (+15555550100 вымышленный, согласие ON — Twilio отклоняет). Никогда Sofia Marin / Kirill. В автотесте send-sms перехватывается, ответ — фейковый 422 recipient_invalid.
## Шаги
1. /JobForm?action=new (EN): клиент QA-quota client, тип Repair, описание «QA-AUTO toasts #8ae966 …».
2. Dispatch → Assign Technician → QA-F5 tech.
3. Create Job.
## Ожидаемо
- Видны оба toast: «Job Created Successfully! Redirecting to the Items tab…» и «The SMS to QA-F5 tech did not go out…».
- Toast один под другим, не пересекаются (зазор ~8px), оба текста читаются полностью.
(источник: «מה רצוי» — שתי ההודעות מוצגות אחת מתחת לשנייה, ושתיהן קריאות)
## Очистка
- Работа → статус Cancelled.
## История
- 2026-10-18 · ✅ · #8ae966 (3/3, JOB-0104/0106/0107, зазор 8px; скрин 8ae966-both-toasts-run3-desktop.png)
- 2026-11-12 · ✅ · #de116e — регресс контейнера тостов после 9ca6293: стопка двух тостов без наложения (desktop + Android 360), см. technicians-sms/TS-03
