# MT-04: Сохранённая работа с 3 техниками — все видны на странице работы и в списке
- Фича/экран: New Job → Create Job → Job Details; Jobs → вкладка Assigned → колонка Technician
- Тикеты: #80550f
- Роль/аккаунт: admin, компания «test»
- Устройство: desktop 1440×900, EN
- Тип: позитив, создаёт данные (@writes)
- Предусловия: «Allow Multiple Techs» = ON на время теста. Клиент «QA-quota client». Описание работы «QA-AUTO multi-tech #80550f …». Только QA-Tech Alpha/Beta/Gamma (без согласия на SMS — SMS не уходят, «No SMS»).
## Шаги
1. New Job: клиент QA-quota client, тип Repair, описание QA-AUTO…, Assign Technician → Alpha, Beta, Gamma → Create Job.
2. Перезагрузить страницу работы.
3. Jobs → вкладка Assigned → строка работы.
4. Очистка: статус работы → Cancelled.
## Ожидаемо
- После перезагрузки в Assign Technician все 3 техника, Alpha — LEAD.
- Работа во вкладке Assigned, в колонке Technician — QA-Tech Alpha, QA-Tech Beta, QA-Tech Gamma.
(источник: «מה רצוי» — ולהציג את כולם ברשימת העבודות; Д1 — назначение → статус Assigned)
## История
- 2026-10-18 · ✅ · #80550f (JOB-0094, JOB-0096; скрины 80550f-v-jobdetail-3techs-after-reload-desktop.png, 80550f-v-joblist-3techs-desktop.png)
