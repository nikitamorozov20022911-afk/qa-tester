# TS-04: HE (RTL), телефон 360 — тост «נשלח ל-1 מתוך 2» целиком в экране
- Фича/экран: Technicians (/technicians) → отметить техников → «Text selected» → текст → Send → тост результата (F-5)
- Тикеты: #de116e (0feb95d7337a398d84de116e)
- Роль/аккаунт: admin (владелец), компания «test» (selected-company-id 4432bd2f-3f47-43cf-8ef2-b0c16436f025)
- Устройство: Android 360×800 (HE)
- Тип: визуал
- Предусловия: только QA-техники «QA-F5 tech» (согласие ON, вымышленный номер) и «QA-Tech Gamma» (без согласия). Реальных техников не отмечать. SMS не уходит: service worker отключён, `functions/v1/message-technicians` перехвачен page.route ДО Send (фейковый ответ 200: QA-F5 tech — sent, QA-Tech Gamma — skipped no_consent), `send-sms` и `assignment-notices` обрываются; запросов в сеть = 0 (перехвачено == числу Send).
## Шаги
1. /technicians, язык HE (dir=rtl). Отметить QA-F5 tech и QA-Tech Gamma → «הודעה לנבחרים» → текст → «שליחה».
## Ожидаемо
- Тост «נשלח ל-1 מתוך 2 …» на ширину экрана: left = 16, right = ширина − 16; не уезжает за левый/правый край, в т.ч. при появлении.
(источник: «מה רצוי» — מוצגת במלואה בתוך המסך)
## История
- 2026-11-12 · ✅ · #de116e (скрины de116e-prod-android-360-he.png, de116e-C2-he-*.png)
