# Мועדי תזכורות תשלום (ניהול מערכת) — тест-кейсы
Тикет: #58be43 · роль: admin · стенд: qa-stand · десктоп, EN + HE · 2026-11-05

| # | Кейс | Ожидание |
|---|---|---|
| 1 | /settings → «Payment Reminder Dates» по умолчанию | 1 month, 7 days, on the day — все включены |
| 2 | 7→10, Add a date 14, выключить 1 month, Save | тост «Changes saved successfully»; после reload: 1 month(off), 14, 10, on the day (дальняя дата первой) |
| 3 | /profile → Payment reminders (EN / HE) | «14 days before, 10 days before, and on the day» / «14 ימים לפני, 10 ימים לפני וביום התשלום», RTL |
| 4 | Audit Trail → верхняя запись → צפה בפרטים | «Payment reminder dates», jleprog54, Dates до/после |
| 5 | 400 дней / 13 месяцев / 0 / 2.5 | «מספר שלם בין 1 ל-365» / «בין 1 ל-12»; Save disabled |
| 6 | Две даты «10 дней» | «המועד הזה כבר ברשימה» на обеих; Save disabled |
| 7 | 5 дат (с днём платежа) | «Add a date» disabled |
| 8 | «On the day» | только переключатель, без числа и удаления |
| 9 | Всё выключить + Save | в блоке «אין מועד פעיל, ולכן לא יישלחו מיילי תזכורת»; /profile: «No reminder date is on… no emails go out» (EN/HE) |
| 10 | Вернуть по умолчанию | 1 month, 7 days, on the day — все ON; /profile «one month before, one week before, and on the day» |

Не через UI: письма по новому списку (стенд перенаправляет почту — dry-run разработчика), запрет для не-админа (нет обычного аккаунта).
