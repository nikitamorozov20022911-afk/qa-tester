# JA-04: Замена техника через список → «Reassigned from A to B»; снятие B кнопкой X
- Фича/экран: страница работы (JobDetail) → Schedule & Assignment → Assign Technician; Assignment history; Jobs
- Тикеты: #04d33a ([F-3]; реджект 2 — снятие техника при Allow Multiple Techs OFF)
- Роль/аккаунт: admin (`auth/admin.json`), компания «test» (никогда не «Onsite Locksmith»)
- Устройство: desktop 1440×900, EN
- Тип: позитив
- Предусловия: Account Settings «Allow Multiple Techs» = OFF (если ON — тест пропускается, настройку не переключать). Работа «QA-AUTO 04d33a job» (клиент QA-quota client) в статусе Submitted без техника. Техники только QA-Tech Alpha/Beta (вымышленные номера, без согласия на SMS → «No SMS»).
## Шаги
1. Assign Technician → QA-Tech Alpha, дождаться «Assigned to QA-Tech Alpha».
2. В том же списке выбрать QA-Tech Beta.
3. X («Take QA-Tech Beta off the job»).
## Ожидаемо
- После шага 2: в поле QA-Tech Beta, статус Assigned, верхняя строка истории «Reassigned from QA-Tech Alpha to QA-Tech Beta».
- После шага 3: поле пустое, статус Submitted, верхняя строка «QA-Tech Beta taken off the job».
(источник: AC тикета «שיבוץ מחדש מעביר את העבודה»; DoD «ניתן לבטל/לשבץ מחדש, וההיסטוריה נשמרת»; комментарий программиста «הועבר מ-X ל-Y»)
## История
- 2026-11-12 · ✅ · #04d33a
