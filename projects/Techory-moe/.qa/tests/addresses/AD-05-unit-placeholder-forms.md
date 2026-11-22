# AD-05: Placeholder «Apt 5B / Unit 12» в Unit/Apt — New Job, New Client, New Lead
- Фича/экран: адреса — /JobForm?action=new, /CustomerForm?action=new, /CreateLead
- Тикеты: #8ffd6e26 («מספר דירה (Unit/Apt) שהוקלד בכתובת לא עובר לשדה "Unit/Apt"»)
- Роль/аккаунт: admin, компания «test», .qa/auth/admin.json
- Устройство: desktop 1440×900
- Тип: визуал
- Предусловия: только просмотр, формы не сохранять (безопасно для прода).
## Шаги
1. /JobForm?action=new → «Edit address details» → поле Unit/Apt.
2. /CustomerForm?action=new → поле Unit/Apt.
3. /CreateLead → поле Unit/Apt.
## Ожидаемо
- placeholder = «Apt 5B / Unit 12» во всех трёх формах.
(источник: «מה רצוי» — בשדה "Unit/Apt" מוצג placeholder עם הפורמט; комментарий программиста — во всех полях «Apt 5B / Unit 12»)
## Не автоматизируем
- Job Details (/JobDetail) — автосохраняет, поле адреса в тестах не трогаем.
## Связанные
- New Lead / Edit Lead: City из подсказки — AD-11…AD-13 (#dad444).
## История
- 2026-10-14 · ✅ · #8ffd6e26
