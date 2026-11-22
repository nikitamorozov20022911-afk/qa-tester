# JA-01: Назначение техника на странице работы → Assigned, история «Assigned to …», No SMS + Send again, кнопка X
- Фича/экран: страница работы (JobDetail) → Schedule & Assignment → Assign Technician; Assignment history; Jobs
- Тикеты: #04d33a ([F-3]; реджект 2 — снятие техника при Allow Multiple Techs OFF)
- Роль/аккаунт: admin (`auth/admin.json`), компания «test» (никогда не «Onsite Locksmith»)
- Устройство: desktop 1440×900, EN
- Тип: позитив
- Предусловия: Account Settings «Allow Multiple Techs» = OFF (если ON — тест пропускается, настройку не переключать). Работа «QA-AUTO 04d33a job» (клиент QA-quota client) в статусе Submitted без техника. Техники только QA-Tech Alpha/Beta (вымышленные номера, без согласия на SMS → «No SMS»).
## Шаги
1. Открыть страницу работы.
2. Assign Technician → QA-Tech Alpha; дождаться автосохранения (~4 с).
## Ожидаемо
- Статус работы — Assigned.
- В поле Assign Technician — QA-Tech Alpha; рядом кнопка X (aria-label «Take QA-Tech Alpha off the job»).
- Верхняя строка Assignment history — «Assigned to QA-Tech Alpha», в ней «No SMS» и кнопка «Send again».
(источник: DoD «השיבוץ … משנה סטטוס ל'שובצה'», «כשל התראה אינו מבטל שיבוץ; ניתן לשלוח שוב»; комментарий программиста)
## История
- 2026-11-12 · ✅ · #04d33a (JOB-0112, JOB-0121)
