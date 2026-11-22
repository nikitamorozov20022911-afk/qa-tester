# MT-03: Настройка ON — в Dispatch несколько техников, получатели SMS — все
- Фича/экран: New Job → Dispatch → Assign Technician, SMS Preview
- Тикеты: #80550f (вместе с #5fbb66)
- Роль/аккаунт: admin, компания «test»
- Устройство: desktop 1440×900, EN и HE
- Тип: позитив
- Предусловия: «Allow Multiple Techs» = ON на время теста. Только QA-Tech Alpha/Beta/Gamma. «Send SMS» НЕ нажимать, работу не сохранять.
## Шаги
1. /JobForm?action=new → Dispatch → Assign Technician → Alpha, Beta, Gamma.
## Ожидаемо
- 3 тега, Alpha — LEAD.
- «Recipients:» (HE «נמענים:») — QA-Tech Alpha +13055550181, QA-Tech Beta +13055550182, QA-Tech Gamma +13055550183.
- «Send SMS» активна (не нажимается).
(источник: «מה רצוי» — לשלוח SMS לכל הטכנאים המשובצים)
## История
- 2026-10-18 · ✅ · #80550f (скрин screenshots/5fbb66-v-dispatch-preview-3techs-desktop.png)
