# CALC-CHECK-01: Чек-лист «בדיקות לפני רכישה» — 8 пунктов и счётчик
- Фича/экран: מחשבון כדאיות · чек-лист
- Тикеты: #d4f37b
- Роль/аккаунт: гость (чистый localStorage)
- Устройство: desktop, Android Pixel 7
- Тип: позитив
- Предусловия: прод https://www.biz4sale.co.il/calculator, гость, только чтение (калькулятор клиентский; не-GET запросы обрываются, баннер cookie закрыт заранее «только необходимые»). Поля по id: `#calc-purchasePrice`, `#calc-setupCosts`, `#calc-inventory`, `#calc-reserve`, `#calc-loanAmount`, `#calc-monthlyProfit`, `#calc-ownerSalary`, `#calc-monthlyLoanPayment`. Значения на экране содержат RLM/nbsp — сравнивать после нормализации. Пункты — button role=checkbox (id check-revenue, check-profit, check-rent, check-employees, check-inventory, check-debts, check-investments, check-extraCosts).
## Шаги
1. Открыть /calculator в чистом контексте.
2. Отметить 3 пункта (אימות מחזור, שכירות, חובות).
## Ожидаемо (источник: #d4f37b)
- H2 «בדיקות לפני רכישה», 8 пунктов: אימות מחזור, אימות רווחיות, שכירות, עובדים, מלאי, חובות, השקעות נדרשות, הוצאות נוספות.
- Сначала «0 מתוך 8 הושלמו», после отметки — «3 מתוך 8»; отмеченные aria-checked=true.
- В localStorage появляется ключ purchase-calculator-checklist.
## Не проверяется здесь
- Восстановление отметок после перезагрузки (в фактах прогона не зафиксировано).
## История
- 2026-11-01 · ✅ · עבר QA (PR #181), desktop 1440×900 + Android Pixel 7
