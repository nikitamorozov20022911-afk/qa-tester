<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# auth-23: admin не видит данные מפיץ שני (QA-AUTO-6aae65-P / -C)
- Фича/экран: /catalog, /customers (поиск), API products/customers по id
- Тикеты: #3c03f6 (связано #6aae65)
- Роль/аккаунт: admin
- Устройство: desktop 1440×900
- Тип: негатив / изоляция
- Предусловия: товар QA-AUTO-6aae65-P и клиент QA-AUTO-6aae65-C принадлежат dist2, архивные (в UI никому не видны — проверка и по API)
## Шаги
1. /catalog: поиск «QA-AUTO-6aae65». 2. /customers: тот же поиск. 3. API: GET products?id=eq.<P>, customers?id=eq.<C>.
## Ожидаемо
1. «לא נמצאו מוצרים התואמים לסינון». 2. «לא נמצאו לקוחות התואמים לחיפוש». 3. 200 и пустой массив.
## История
- 2026-11-19 · сверка с сайтом при записи · #3c03f6
