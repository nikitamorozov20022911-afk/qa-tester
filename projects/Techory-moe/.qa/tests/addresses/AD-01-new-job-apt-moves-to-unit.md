# AD-01: New Job — «Apt 5B» из адреса переходит в Unit/Apt, в Address остаётся только улица
- Фича/экран: адреса — New Job (/JobForm?action=new), Service Location
- Тикеты: #8ffd6e26 («מספר דירה (Unit/Apt) שהוקלד בכתובת לא עובר לשדה "Unit/Apt"»)
- Роль/аккаунт: admin, компания «test», .qa/auth/admin.json
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: зависит от подсказок Google Places (внешний сервис). Форму не сохранять.
## Шаги
1. Открыть /JobForm?action=new, нажать «Edit address details».
2. В Address ввести «2221 NW Federal Hwy Apt 5B».
3. Выбрать подсказку «2221 NW Federal Hwy apt 5b · Stuart, FL, USA».
## Ожидаемо
- Unit/Apt = «Apt 5B».
- Address = «2221 NW Federal Hwy, Stuart, FL 34994, USA» — без «apt 5b» (ни в каком регистре).
- City = Stuart, Region/State = Florida, ZIP Code = 34994 (ZIP приходит ~1 с после выбора — ждать значение).
(источник: «מה רצוי» — מספר הדירה עובר לשדה "Unit/Apt", ובשורת הכתובת נשאר רק הרחוב; комментарий программиста: City/State/ZIP как раньше)
## Связанные
- City из подсказки (город, не район) в формах лида — AD-11…AD-13 (#dad444); для New Job/New Client 12.11 вручную City = Seattle.
## История
- 2026-10-14 · ✅ · #8ffd6e26
