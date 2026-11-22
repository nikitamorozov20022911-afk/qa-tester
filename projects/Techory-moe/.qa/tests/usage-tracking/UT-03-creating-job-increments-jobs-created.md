# UT-03: Создание работы увеличивает «Jobs created» на 1
- Фича/экран: /JobForm?action=new → /reports/usage
- Тикеты: #04d347
- Роль/аккаунт: admin, компания «test»
- Устройство: desktop 1440×900, EN
- Тип: позитив, меняет данные (@writes)
- Предусловия: клиент «QA-quota client» в «test». Данные: работа «QA-AUTO usage #04d347 …» без техников, после проверки → Cancelled.
## Шаги
1. /reports/usage, «This month» — запомнить Jobs created (N).
2. New Job: клиент QA-quota client, тип Repair, описание «QA-AUTO usage #04d347 …», без техника → Create Job.
3. Вернуться в /reports/usage (или Refresh).
4. Очистка: работа → Cancelled.
## Ожидаемо
- Jobs created ≥ N+1 (ровно +1, если параллельно никто не создаёт работ); событие учитывается и после отмены работы.
(источник: AC «יצירת עבודה → אירוע נרשם; מסך אנליטיקס → מונים מצטברים»)
## История
- 2026-10-14 · ✅ · #04d347 (JOB-0085 «QA-F16 usage job» → Cancelled)
- 2026-10-18 · ✅ · #04d347 (Jobs created 78→83, при проверке F-3)
