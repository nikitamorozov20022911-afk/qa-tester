# Снимок ДО фикса — итог (2026-10-05 ~13:20, prod https://www.elionvc.com, ILS)

Файлы: 01-dashboard · 02-cashflow · 03-cashflow-payments · 04-real-estate · 05-financial-projects · 06-audit-trail

## Ключевые цифры, которые НЕ должны измениться
| Где | Показатель | ДО |
|---|---|---|
| Cash Flow | TOTAL CASH | ₪ 15,292,266.63 |
| Cash Flow | Runway Nov/Dec 2026, Jan 2027 | 15,130,250.27 / 15,182,176.23 / 25,670,387.46 |
| Cash Flow | Anchor | ₪ 15,292,266.64 |
| Cash Flow | Строки ledger Oct 2026 и дальше | см. 02-cashflow.md |
| Dashboard | LIQUIDITY | ₪ 15,292,267 |
| Dashboard | 12-month forecast (3M/6M/12M) | 42,810,786 (25,670,389 / 20,407,351 / 42,810,786) |
| Dashboard | Future Outlook Oct 2026 | Liquidity 15,292,266.63 · Cash flow 51,925.97 |

## Что ДОЛЖНО измениться
- Статусы: все неоплаченные платежи 11/2023–09/2026 → оплачены. Фактически неоплаченные сейчас есть только в
  **Aug 2026 (21)** и **Sep 2026 (16)** = **37 платежей**. 11/2023–07/2026 уже все помечены оплаченными.
- Со слов пользователя: после фикса платежи 11/2023–09/2026 перестанут показываться в самом Cash Flow
  → строки ledger Nov 2023…Sep 2026 должны пропасть / обнулиться, при этом Total Cash и Liquidity — без изменений.
- Недвижимость: Paid / Remaining / % Disbursed у Playa Viva (7 юнитов, кроме T2-1002), Oceanz 4109/4111, все Samana (10 юнитов), Ellington 3009.
- Проекты: возможно Return to date у Bravo #1/#2, Gabi BPT, Enbd-209.

## Под вопросом (смотреть, но не обязательно баг)
- Dashboard NET WORTH ₪ 86,244,208, GROSS ASSETS ₪ 111,840,769, EARNED NOT RECEIVED ₪ 3,155,699, ANNUAL RETURN +18.6%, ON INVESTED ₪ 36,193,913,
  Asset allocation 53.22 / 33.11 / 13.67 — зависят от «unpaid instalments» (blue line = assets minus unpaid instalments) → Net Worth может измениться.
- 90-Day Commitments (36 шт.) — Oct'26+ не трогаются, должны остаться.

## Наблюдения уже сейчас (до фикса)
1. В ledger нет месяцев Dec 2023 и Feb 2024.
2. Прошлые месяцы 11/2023–09/2026 помечены FORECAST, closing balance уходит до -35,512,750.53, затем Oct 2026 открывается с +16,110,681.29 (разрыв из-за якоря).
3. Большие цифры анимируются и в фоновой вкладке «замирают» — снимать только после стабилизации.
4. Клиент сам редактирует данные сегодня (Audit Trail) → сверять с журналом.

## Как сравнивать после фикса
Снять те же страницы тем же способом (ILS, All records, вкладка активна) в snapshot-after, сравнить по таблицам выше.
