# AD-02: New Job — распознаются Unit, Suite, Ste, #
- Фича/экран: адреса — New Job (/JobForm?action=new)
- Тикеты: #8ffd6e26 («מספר דירה (Unit/Apt) שהוקלד בכתובת לא עובר לשדה "Unit/Apt"»)
- Роль/аккаунт: admin, компания «test», .qa/auth/admin.json
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: зависит от подсказок Google Places. Форму не сохранять.
## Шаги
1. Открыть /JobForm?action=new, «Edit address details».
2. Для каждого ввода — ввести в Address и выбрать подсказку:
   - «100 Main St Unit 12 Boston» → подсказка «100 Main St unit 12 · Boston, MA, USA»
   - «350 5th Ave Suite 3300 New York» → «350 5th Ave suite 3300 · New York, NY, USA»
   - «1 Infinite Loop Ste 200 Cupertino» → «1 Infinite Loop ste 200 · Cupertino, CA, USA»
   - «2221 NW Federal Hwy #5B» → «2221 NW Federal Hwy #5b · Stuart, FL, USA»
## Ожидаемо
- Unit/Apt: «Unit 12» / «Suite 3300» / «Suite 200» (Ste нормализуется в Suite) / «#5B»; ZIP 02129 / 10118 / 95014 / 34994.
- В Address нет номера квартиры (нет «unit 12», «suite 3300», «ste 200», «#5b»).
(источник: комментарий программиста — поддерживаются Unit, Suite, Ste, #)
## История
- 2026-10-14 · ✅ · #8ffd6e26
