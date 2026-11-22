# JA-03: Работа без техника — на Jobs во вкладке Submitted, Technician «Unassigned»
- Фича/экран: страница работы (JobDetail) → Schedule & Assignment → Assign Technician; Assignment history; Jobs
- Тикеты: #04d33a ([F-3]; реджект 2 — снятие техника при Allow Multiple Techs OFF)
- Роль/аккаунт: admin (`auth/admin.json`), компания «test» (никогда не «Onsite Locksmith»)
- Устройство: desktop 1440×900, EN
- Тип: позитив
- Предусловия: Account Settings «Allow Multiple Techs» = OFF (если ON — тест пропускается, настройку не переключать). Работа «QA-AUTO 04d33a job» (клиент QA-quota client) в статусе Submitted без техника. Техники только QA-Tech Alpha/Beta (вымышленные номера, без согласия на SMS → «No SMS»). Техник снят (JA-02).
## Шаги
1. Jobs → вкладка Submitted → строка работы.
2. Вкладка Assigned.
## Ожидаемо
- В Submitted строка работы есть, Technician — «Unassigned».
- В Assigned этой работы нет.
(источник: «מצב רצוי» реджекта 2 — העבודה בלי טכנאי ("Unassigned"), הסטטוס חוזר ל-Submitted; F-07 AC5 — неназначенная работа помечена)
## История
- 2026-11-12 · ✅ · #04d33a
