# TS-01: Десктоп 1440 — тост «Sent to 1 of 2 / Skipped: …» целиком в экране, справа сверху
- Фича/экран: Technicians (/technicians) → отметить техников → «Text selected» → текст → Send → тост результата (F-5)
- Тикеты: #de116e (0feb95d7337a398d84de116e)
- Роль/аккаунт: admin (владелец), компания «test» (selected-company-id 4432bd2f-3f47-43cf-8ef2-b0c16436f025)
- Устройство: desktop 1440×900
- Тип: визуал (регресс бага)
- Предусловия: только QA-техники «QA-F5 tech» (согласие ON, вымышленный номер) и «QA-Tech Gamma» (без согласия). Реальных техников не отмечать. SMS не уходит: service worker отключён, `functions/v1/message-technicians` перехвачен page.route ДО Send (фейковый ответ 200: QA-F5 tech — sent, QA-Tech Gamma — skipped no_consent), `send-sms` и `assignment-notices` обрываются; запросов в сеть = 0 (перехвачено == числу Send).
## Шаги
1. /technicians (EN). Отметить QA-F5 tech и QA-Tech Gamma → кнопка «Text selected (2)».
2. Text selected → ввести текст → Send.
## Ожидаемо
- Тост «Sent to 1 of 2» с текстом «Skipped: QA-Tech Gamma (This technician hasn't agreed to receive SMS. …)» — видно, кому не отправлено и почему.
- Карточка целиком в экране: left ≥ 0, right ≤ ширины окна (факт 12.11: L1040 R1424 при 1440), справа сверху; текст без горизонтальной обрезки (scrollWidth = clientWidth).
- Во время появления (первая ~1 с анимации) карточка не выходит за край экрана.
- Фон карточки непрозрачный (#5fbb66).
(источник: «מה רצוי» — הודעת התוצאה מוצגת במלואה בתוך המסך … אפשר לקרוא לכמה טכנאים נשלח ומי דולג ולמה)
## История
- 2026-11-12 · ✅ · #de116e (prod, перехват; скрины de116e-prod-desktop.png, de116e-T1-desktop.png)
