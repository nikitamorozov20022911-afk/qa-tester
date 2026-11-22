# TS-02: Телефон 360/375/390 — тост результата на ширину экрана, без обрезки, и в момент появления
- Фича/экран: Technicians (/technicians) → отметить техников → «Text selected» → текст → Send → тост результата (F-5)
- Тикеты: #de116e (0feb95d7337a398d84de116e)
- Роль/аккаунт: admin (владелец), компания «test» (selected-company-id 4432bd2f-3f47-43cf-8ef2-b0c16436f025)
- Устройство: mobile — Android 360×800 / 390, Pixel 7, iPhone 13 mini 375
- Тип: визуал (регресс бага)
- Предусловия: только QA-техники «QA-F5 tech» (согласие ON, вымышленный номер) и «QA-Tech Gamma» (без согласия). Реальных техников не отмечать. SMS не уходит: service worker отключён, `functions/v1/message-technicians` перехвачен page.route ДО Send (фейковый ответ 200: QA-F5 tech — sent, QA-Tech Gamma — skipped no_consent), `send-sms` и `assignment-notices` обрываются; запросов в сеть = 0 (перехвачено == числу Send).
## Шаги
1. /technicians (EN) на телефоне. Отметить QA-F5 tech и QA-Tech Gamma.
2. Text selected → текст → Send.
## Ожидаемо
- Тост «Sent to 1 of 2 / Skipped: QA-Tech Gamma (…)» во всю ширину: left = 16, right = ширина окна − 16 (±1px); scrollWidth = clientWidth (нет горизонтальной прокрутки текста).
- Все кадры анимации появления (~1 с): карточка не выходит за левый/правый край.
- Фон непрозрачный.
(источник: «מה רצוי» — מוצגת במלואה בתוך המסך; комментарий программиста — на телефоне тост на ширину экрана и целиком в первые секунды)
## История
- 2026-11-12 · ✅ · #de116e (360/375/390 + iPhone 13 mini; скрины de116e-prod-android-360.png, -390.png, de116e-prod-iphone.png, кадр 0 — de116e-prod-*-frame0.png)
