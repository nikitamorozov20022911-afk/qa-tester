# MT-02: Настройка ON — в Job Info несколько техников, первый LEAD, Remove / Make lead
- Фича/экран: New Job → Job Info → Assign Technician
- Тикеты: #80550f
- Роль/аккаунт: admin, компания «test»
- Устройство: desktop 1440×900, EN и HE
- Тип: позитив
- Предусловия: «Allow Multiple Techs» = ON на время теста, потом вернуть как было. Только QA-Tech Alpha/Beta/Gamma. Работу не сохранять.
## Шаги
1. /JobForm?action=new → Job Info → Assign Technician → QA-Tech Alpha, QA-Tech Beta, QA-Tech Gamma.
2. У тега QA-Tech Beta — «Make lead».
3. У тега QA-Tech Gamma — «Remove».
## Ожидаемо
- Добавленные техники не заменяют друг друга: 3 тега.
- Пометка LEAD у первого (Alpha), у остальных — кнопка «Make lead»; у каждого — «Remove».
- Подсказка «The first technician is the lead: reports and commissions count the job for them.» (EN).
- После «Make lead» LEAD у Beta, у Alpha пропадает; после «Remove» тег Gamma исчезает.
(источник: «מה רצוי» — לשבץ כמה טכנאים לעבודה אחת; комментарий программиста — первый = Lead, звёздочка меняет главного)
## История
- 2026-10-18 · ✅ · #80550f
