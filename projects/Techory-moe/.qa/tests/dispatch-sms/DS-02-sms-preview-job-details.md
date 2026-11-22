# DS-02: SMS Preview — содержит данные работы
- Фича/экран: New Job → Dispatch → SMS Preview
- Тикеты: #5fbb66, связанный #5686fa (строка Powered by Techory.AI)
- Роль/аккаунт: admin, компания «test»
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: форму не сохранять; SMS не отправлять.
## Шаги
1. /JobForm?action=new (EN / HE).
2. Job Info: Client Name «QA-AUTO Dispatch Client», Phone 3055550199, Address «QA-AUTO 1 Test Street» (без выбора подсказки), Job Type «Repair», Job Description «QA-AUTO note 5fbb66».
3. Вкладка Dispatch.
## Ожидаемо
Превью (моноширинный блок) построчно:
- Powered by Techory.AI
- test (имя компании)
- Job Id: N/A (HE «מספר עבודה: לא זמין»)
- Name: QA-AUTO Dispatch Client (HE «שם:»)
- Phone: +13055550199 (HE «טלפון:»)
- Address: QA-AUTO 1 Test Street (HE «כתובת:»)
- Date: <дата и время работы> (HE «תאריך:»)
- Type: Repair (HE «סוג:») — только если тип выбран
- Note: QA-AUTO note 5fbb66 (HE «הערה:»)
- Reply STOP to opt out.
(источник: «מה רצוי» — ההודעה תכלול … שם הלקוח, מספר טלפון, כתובת, תאריך ושעת העבודה, סוג העבודה, הערות; #5686fa; комментарий программиста — STOP-строка)
## История
- 2026-10-18 · ✅ · #5fbb66
