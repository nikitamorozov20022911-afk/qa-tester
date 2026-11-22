# UT-01: Владелец открывает Activity & usage — 7 счётчиков, график, By person
- Фича/экран: Reports → «Activity & usage» (/reports/usage)
- Тикеты: #04d347 «[F-16] מעקב שימוש ואירועים (usage tracking)»
- Роль/аккаунт: admin (владелец, iamdejar@gmail.com), компания «test»
- Устройство: desktop 1440×900, EN
- Тип: позитив, только просмотр
- Предусловия: выбрана компания «test» (selected-company-id 4432bd2f-3f47-43cf-8ef2-b0c16436f025).
## Шаги
1. Войти владельцем, открыть Reports → «Activity & usage».
2. Посмотреть период и блоки экрана.
## Ожидаемо
- Заголовок «Activity & usage»; Date Range — «This month», диапазон «<месяц> 1 – <сегодня>».
- Счётчики с числами: Jobs created, Jobs assigned, Leads created, Estimates created, Invoices created, Texts sent, Calls started.
- Блок «Per day» (график по дням), блок «By person» (Person / Events): строка с email владельца и строка «Earlier records».
- Запрос rpc usage_summary — 200.
- Сумма счётчиков = сумма Events в By person (на 3 скриншотах 14.10/18.10: 123=92+31, 144=113+31, 173=142+31).
(источник: DoD «צבירה למונים מוצגת במסך אנליטיקס»; комментарий программиста — счётчики по типам, график по дням, разбивка по людям)
## История
- 2026-10-14 · ✅ · #04d347 (By person показывает email, не имя)
- 2026-10-18 · ✅ · #04d347
