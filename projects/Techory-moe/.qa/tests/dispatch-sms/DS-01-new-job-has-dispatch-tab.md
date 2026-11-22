# DS-01: New Job — вкладки «Job Info» и «Dispatch»
- Фича/экран: New Job (/JobForm?action=new) → вкладки
- Тикеты: #5fbb66 («להוסיף טאב Dispatch בתהליך יצירת עבודה עם SMS Preview ושליחת הודעה לטכנאי»)
- Роль/аккаунт: admin, компания «test» (selected-company-id 4432bd2f-3f47-43cf-8ef2-b0c16436f025; не «Onsite Locksmith»)
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: форму не сохранять (Create Job не нажимать).
## Шаги
1. Открыть /JobForm?action=new (EN, затем HE).
2. Нажать вкладку Dispatch.
## Ожидаемо
- Две вкладки: «Job Info» (HE «פרטי עבודה») выбрана по умолчанию и «Dispatch».
- После нажатия Dispatch открыта панель с «Assign Technician» (HE «הקצה לטכנאי») и «SMS Preview» (HE «תצוגה מקדימה של SMS»).
(источник: «מה רצוי» — להוסיף טאב Dispatch במסך יצירת העבודה; להציג באזור SMS Preview)
- Замечание вне тикета: в HE сама вкладка «Dispatch» не переведена (записано в session.json) — тест на этом не завязан.
## История
- 2026-10-18 · ✅ · #5fbb66
