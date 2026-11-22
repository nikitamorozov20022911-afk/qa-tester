# MT-01: «Allow Multiple Techs» выключена — выбор техника одиночный (второй заменяет первого)
- Фича/экран: Account Settings → Toggle Settings; New Job → Job Info / Dispatch → Assign Technician
- Тикеты: #80550f
- Роль/аккаунт: admin, компания «test» (никогда не «Onsite Locksmith»)
- Устройство: desktop 1440×900, EN и HE
- Тип: позитив (обратная совместимость)
- Предусловия: настройка «Allow Multiple Techs» = OFF (по умолчанию). Только QA-Tech Alpha/Beta/Gamma (вымышленные номера, без согласия на SMS). Работу не сохранять, «Send SMS» не нажимать.
## Шаги
1. /JobForm?action=new → Job Info → Assign Technician → QA-Tech Alpha, затем QA-Tech Beta.
2. Вкладка Dispatch → в Assign Technician выбран один техник.
## Ожидаемо
- В поле только QA-Tech Beta (Alpha заменён), нет пометки LEAD и подсказки «The first technician is the lead…».
- В Dispatch в строке получателей только QA-Tech Beta.
(источник: «מה קיים» — בחירת טכנאי נוסף מחליפה את הקודם; комментарий программиста — при выключенной настройке как раньше)
## История
- 2026-10-18 · ✅ · #80550f
- 2026-11-12 · связано: снятие техника кнопкой X при OFF — `tests/job-assignment/JA-02` (#04d33a)
