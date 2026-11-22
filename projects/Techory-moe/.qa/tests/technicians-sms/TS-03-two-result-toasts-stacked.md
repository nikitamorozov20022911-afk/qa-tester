# TS-03: Две отправки подряд — два тоста результата стопкой, без наложения, оба в экране
- Фича/экран: Technicians (/technicians) → отметить техников → «Text selected» → текст → Send → тост результата (F-5)
- Тикеты: #de116e (0feb95d7337a398d84de116e)
- Роль/аккаунт: admin (владелец), компания «test» (selected-company-id 4432bd2f-3f47-43cf-8ef2-b0c16436f025)
- Устройство: desktop 1440 и телефон (Android 360)
- Тип: визуал (регресс общего контейнера тостов, связан с JS-01 / #8ae966)
- Предусловия: только QA-техники «QA-F5 tech» (согласие ON, вымышленный номер) и «QA-Tech Gamma» (без согласия). Реальных техников не отмечать. SMS не уходит: service worker отключён, `functions/v1/message-technicians` перехвачен page.route ДО Send (фейковый ответ 200: QA-F5 tech — sent, QA-Tech Gamma — skipped no_consent), `send-sms` и `assignment-notices` обрываются; запросов в сеть = 0 (перехвачено == числу Send).
## Шаги
1. /technicians (EN). Отметить QA-F5 tech и QA-Tech Gamma → Text selected → текст → Send.
2. Пока первый тост на экране: снова отметить обоих → Text selected → текст → Send.
## Ожидаемо
- Два тоста «Sent to 1 of 2» одновременно, один под другим, прямоугольники не пересекаются.
- Оба целиком в экране (left ≥ 0, right ≤ ширины окна).
- Перехвачено ровно 2 запроса message-technicians, в сеть — 0.
(источник: «מה רצוי» — מוצגת במלואה בתוך המסך (כמו שאר ההודעות במערכת); #8ae966 — אחת מתחת לשנייה)
## История
- 2026-11-12 · ✅ · #de116e (скрины de116e-prod-desktop-stack-stack.png, de116e-prod-android-stack-stack.png)
