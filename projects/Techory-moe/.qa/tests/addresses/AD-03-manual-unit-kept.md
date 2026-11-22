# AD-03: Ручной Unit/Apt не стирается при выборе адреса без квартиры
- Фича/экран: адреса — New Job (/JobForm?action=new)
- Тикеты: #8ffd6e26 («מספר דירה (Unit/Apt) שהוקלד בכתובת לא עובר לשדה "Unit/Apt"»)
- Роль/аккаунт: admin, компания «test», .qa/auth/admin.json
- Устройство: desktop 1440×900
- Тип: граница
- Предусловия: зависит от подсказок Google Places. Форму не сохранять.
## Шаги
1. Открыть /JobForm?action=new, «Edit address details».
2. В Unit/Apt вручную ввести «QA-AUTO 7».
3. В Address ввести «1600 Pennsylvania Ave NW Washington», выбрать подсказку «1600 Pennsylvania Ave NW · Washington, DC, USA».
## Ожидаемо
- Адрес заполнен (ZIP 20500, City Washington), Unit/Apt по-прежнему «QA-AUTO 7».
(источник: комментарий программиста — если в выбранном адресе нет квартиры, Unit/Apt не очищается)
## История
- 2026-10-14 · ✅ · #8ffd6e26
