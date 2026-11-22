# AP-09: Назначение / смена и продление / отмена с обязательной причиной (запись на проде)
- Фича/экран: Plans → «Assign plan», «Change / extend», «Revoke»
- Тикеты: #ca557707, #2ae9da4d, #6eed7c73
- Роль/аккаунт: admin; цель — ТОЛЬКО «בדיקה» (wojeg27104@blobapps.com)
- Устройство: desktop 1440×900
- Тип: позитив (пишет данные — @writes, не @prod-safe)
- Предусловия: у «בדיקה» нет ручного назначения (исходно Starter Tech / Trial)
## Шаги
1. «Assign plan» у «בדיקה»: Plan = Pro Tech, Until = сегодня + 30 дней; поле Reason пустое → Save неактивна.
2. Reason = «QA-AUTO assign #ca557707» → Save.
3. «Change / extend»: Until = сегодня + 35 дней, Reason = «QA-AUTO extend» → Save.
4. «Revoke»: пустая причина → кнопка Revoke неактивна; Reason = «QA-AUTO revoke» → Revoke.
## Ожидаемо
- После 2: тост «Plan updated» / «בדיקה is now on Pro Tech.»; строка: Plan «Pro Tech», Source «Assigned» + причина, Until = выбранная дата, кнопки «Change / extend» и «Revoke».
- После 3: Until = новая дата.
- После 4: «Assign plan» снова, Source не «Assigned» (возврат к собственному тарифу).
- Очистка: в любом случае назначение отменено.
(источник: «תיאור» — הקצאה, שינוי, הארכה, ביטול; #2ae9da4d — обязательная причина)
## История
- 2026-10-04 · ✅ · #ca557707 / #6eed7c73 (2 прогона EN/HE, назначения отменены)
