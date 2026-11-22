# JA-02: Снятие техника кнопкой X при Allow Multiple Techs OFF → поле пустое, Submitted, «… taken off the job», после перезагрузки не вернулся
- Фича/экран: страница работы (JobDetail) → Schedule & Assignment → Assign Technician; Assignment history; Jobs
- Тикеты: #04d33a ([F-3]; реджект 2 — снятие техника при Allow Multiple Techs OFF)
- Роль/аккаунт: admin (`auth/admin.json`), компания «test» (никогда не «Onsite Locksmith»)
- Устройство: desktop 1440×900, EN
- Тип: позитив (реджект 2)
- Предусловия: Account Settings «Allow Multiple Techs» = OFF (если ON — тест пропускается, настройку не переключать). Работа «QA-AUTO 04d33a job» (клиент QA-quota client) в статусе Submitted без техника. Техники только QA-Tech Alpha/Beta (вымышленные номера, без согласия на SMS → «No SMS»). На работе назначен QA-Tech Alpha (JA-01).
## Шаги
1. Нажать X рядом с Assign Technician («Take QA-Tech Alpha off the job»).
2. Дождаться автосохранения (~4 с), перезагрузить страницу.
## Ожидаемо
- Поле Assign Technician — «Select technician» (пусто), статус — Submitted.
- Верхняя строка истории — «QA-Tech Alpha taken off the job».
- После перезагрузки техник не вернулся, статус Submitted, кнопки X нет (без техника X не показывается).
(источник: «מצב רצוי» реджекта 2 — כפתור נפרד להסרת הטכנאי … הסטטוס חוזר ל-Submitted, ובהיסטוריית השיבוצים נרשמת שורה על ההסרה; DoD «ניתן לבטל/לשבץ מחדש»)
## История
- 2026-11-12 · ✅ · #04d33a (автосохранение ~3.9 с)
