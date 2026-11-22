# CALC-SCREEN-02: Структура экрана — 3 зоны ввода, «תוצאות», иврит и RTL
- Фича/экран: מחשבון כדאיות רכישת עסק · /calculator
- Тикеты: #3e4835
- Роль/аккаунт: гость
- Устройство: desktop, Android Pixel 7
- Тип: позитив
- Предусловия: прод https://www.biz4sale.co.il/calculator, гость, только чтение (калькулятор клиентский; не-GET запросы обрываются, баннер cookie закрыт заранее «только необходимые»). Поля по id: `#calc-purchasePrice`, `#calc-setupCosts`, `#calc-inventory`, `#calc-reserve`, `#calc-loanAmount`, `#calc-monthlyProfit`, `#calc-ownerSalary`, `#calc-monthlyLoanPayment`. Значения на экране содержат RLM/nbsp — сравнивать после нормализации.
## Шаги
1. Открыть /calculator.
## Ожидаемо
- H1 «מחשבון כדאיות רכישת עסק»; H2 «השקעה ראשונית», «רווחיות», «מימון» (зоны 1/2/3) и H2 «תוצאות». (источник: #3e4835 «מה רצוי»)
- `<html lang="he">`, направление main — rtl. (источник: #3e4835 AC — иврит, RTL)
- 8 полей ввода по id присутствуют, ползунок налога (role=slider) aria-valuemin 0, aria-valuemax 50, по умолчанию 23. (источник: #3e4835 / #80ff63)
## История
- 2026-11-01 · ✅ · עבר QA (PR #181), desktop 1440×900 + Android Pixel 7
