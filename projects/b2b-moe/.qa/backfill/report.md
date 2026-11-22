# Backfill · b2b-moe · 2026-10-03

Диапазон: вся колонка «הושלם» — 154 тикета (151–154 добраны позже: 4 мокапа, manual-only)

Классы: automatable 104 · manual-only 40 · superseded 4 · duplicate 2

| Фича | Кейсы | Файлы тестов | Тесты |
|---|---|---|---|
| auth-security | 13 | 3 | 34 |
| client-ordering | 14 | 4 | 15 |
| orders | 14 | 4 | 16 |
| catalog | 13 | 3 | 20 |
| customers-pricing | 10 | 4 | 28 |
| inventory | 6 | 2 | 12 |
| picking | 10 | 2 | 12 |
| warehouse-map | 12 | 4 | 17 |
| delivery | 5 | 3 | 8 |
| ui-general | 10 | 5 | 29 |
| **Итого** | **107** | **34** | **191** |

Не автоматизируется: мокапы/структура (27), AI-фичи (7), приглашения/создание аккаунтов и email (4), камера/штрих-код, PDF-зум, редизайн карты.
Перекрыто: #12, #40 → #31 (единицы продажи удалены); #37, #69 → #13 (каталог+склад объединены). Дубли: #1 = #0, #87 = #82.

## Находки — сданное сейчас не работает / расходится (на доску не заведены)
- **n45 #6a749714** (auth-security, minor): В режиме «כניסה כעובד» на странице 403 пропадают баннер «כניסה כעובד פעילה» и кнопка «חזרה לחשבון הניהול» — `.qa/screenshots/backfill/auth-impersonate-rep-403-no-banner-desktop.png`
- **n105 #6a38cf5f** (client-ordering, medium): Офлайн при отправке заказа: кнопка «שולח…» висит >50 сек без ошибки; при возврате сети заказ создаётся сам (#437). Проверено эмуляцией offline — перепроверить на реальном обрыве — `.qa/screenshots/backfill/client-ordering-offline-submit.png`
- **n109 #6a38cf5e** (catalog, medium): В навигации каталога покупателя нет подкатегории — только чип родительской категории, товары подкатегории показаны под ним (AC: иерархия в навигации) — `.qa/screenshots/backfill/6a38cf5e-catalog-subcategory-not-in-buyer-nav-desktop.png`
- **n32 #6a858d3f** (catalog, minor): На «מוצר חדש» подсказка «ניסוח מהשם, היחידה והאריזה» всё ещё упоминает единицу (логика единиц удалена) — `.qa/screenshots/backfill/6a858d3f-catalog-new-product-unit-hint-desktop.png`
- **n84 #6a6755e0** (customers-pricing, medium): Карточка клиента зеркальна Figma 71:644: карточки контакта слева, таблица справа, плитки в обратном порядке — дословно «Current behavior» тикета, хотя он в הושלם — `.qa/screenshots/backfill/6a6755e0-card-mirrored-desktop.png`
- **n97 #6a5cb979** (inventory, minor): После «הסרה מהמקום» удаление товара проходит, но пункт меню всё ещё подписан «מחיקה · יש מלאי במחסן» (мелкий UX) — `.qa/screenshots/backfill/inventory-delete-label-stock-unlocated-desktop.png`
- **n3 #6a8f3153** (warehouse-map, medium): «קומה 2»: плитка «משטח 1» в сайдбаре «0 · משטח · ריק», а в панели паллеты «ארגז 1 (C1-01)» с 24–25 ед. 2 товаров (вероятно, старые данные; пользователь видит «ריק») — `.qa/screenshots/backfill/warehouse-map-n3-pallet-empty-while-box-has-stock.png`
- **n62 #6a71f1cb** (picking, question): Переключателя Map / Items List нет (десктоп и мобильный) — список и карта показаны одновременно; вероятно заменено n61 — уточнить — `.qa/screenshots/backfill/picking-n62-no-map-items-toggle-mobile.png`
- **n96 #6a5cb979** (picking, medium): Нет экрана выбора стратегии маршрута (סריאלי/אזורי/גלי, по складу и на заказ) — стратегия выбирается автоматически (1 заказ — обычный, несколько — «גל · N הזמנות»)
- **n1 #6a8aaae3** (picking, minor): После вкладки «קומה 2» у одного заказа → «כל ההזמנות» → выбор нескольких заказов карта остаётся на этаже 2, а не 1 (по свежей ссылке — верно) — `.qa/screenshots/backfill/picking-n1-floor2-kept-after-reselect.png`
- **n121 #6a38cf5a** (ui-general, minor): «ההזמנות שלי» у клиента (мобильный): вкладки 33 px, «הכל» 24×33 — меньше 44 px для касания — `.qa/screenshots/backfill/6a38cf5a-buyer-orders-tabs-small-touch-mobile.png`
- **n83 #6a677c6b** (ui-general, minor): Текст ошибки в каталоге «נסו שוב» (мн.ч.), на остальных экранах «נסה שוב»

## Заметки
- У מחסן кнопка на 403 называется «חזרה לתנועות», а ведёт на «מפת המחסן» (замечание)
- orders/order-lifecycle.spec.ts и client-ordering/cart-checkout.spec.ts нельзя гонять параллельно (общая корзина buyer) — регресс с --workers=1 для этих файлов
- D-10 наблюдение: цена пер-клиент (95) побеждает скидку группы (90), даже если дороже; правила не суммируются
- Метка «מחירון אישי» одинакова для цены пер-клиент и скидки группы
- delivery: на доске #439 «1 פריטים» (строки), в תעודה «סה"כ פריטים: 2» (единицы)
- warehouse-map: коды ячеек повторяются на разных этажах (C-01, B-01, A-02)
- warehouse-map: фильтр журнала «ליקוט» показывает старые «מכירה»
- warehouse-map: полей холодной зоны/температуры/вместимости (TC-066, n93) нет в UI
- picking: admin может довести утверждённый, но не собранный заказ до «סופק» без комплектации (#441)
- «שולם חלקית» при полной сумме (orders) не воспроизвелось в ui-general (#442: остаток 0 → «שולם») — перепроверить

## Открытые вопросы
- delivery: добавить клиенту «test» адрес доставки (или QA-клиент с адресом), чтобы проверить сохранение назначения водителя/даты (n50, n71, n72)
- warehouse-map n27 п.4: отдельной статистики «ארונות/מדפים/משטחים/ארגזים» нет — требование ещё актуально? (решение владельца)

## Тестовые данные (staging)
- заказ #435 QA-AUTO-orders-backfill-1 (אושרה · בהכנה)
- #436 — утверждён, סופק, שולם חלקית ₪5 (QA-AUTO)
- #437 — отклонён (QA-AUTO cleanup)
- #438 — QA-AUTO inventory n48, סופק, לא שולם; товар QA-AUTO-inventory-manual1 удалён
- #439 — QA-AUTO-delivery, סופק, לא שולם
- #440, #441 — QA-AUTO-picking, סופק; товары удалены
- #442 — QA-AUTO-ui-general-payments, סופק, שולם

## Ограничения регресса
- Тесты, создающие заказы через buyer (общая корзина), не гонять параллельно: client-ordering/cart-checkout, orders/order-lifecycle, inventory/inventory-lifecycle, picking/picking-flow, delivery/delivery-lifecycle, ui-general/payments-dashboard, customers-pricing/pricing-lifecycle.
- skip: buyer2 (изоляция двух клиентов), נציג с закреплёнными клиентами, адрес доставки у «test», создание элементов карты склада.

Следующий шаг: /qa-tester:qa-regress · /qa-tester:qa-backfill следующие 150 (осталось 4 тикета)
---

# Backfill «новые» · 2026-10-25

Колонка «הושלם»: 204 тикета, не в журнале — 8 (все прошли ручную QA 18.10, автотестов к ним не было). Журнал: 204/204.

Классы: automatable 5 (#6c161c, #6afef6, #599f82, #8103a9, #aef12a) · has-tests 3 (#8cd9e9 → product-form-1024-align, дополнен #94fef5; #ad4f1b → delivery-note-print-no-delivered-at, дополнен #539c2f; #279e07 → dashboard-period-url, дополнен #6f3c9b/#26c50b + 1 новый тест).

| Фича | Тикеты | Файлы | Тесты |
|---|---|---|---|
| client-ordering | #8103a9, #aef12a | recent-products.spec.ts (7, 1 skip), reorder.spec.ts (4), _cart-snapshot.ts | 11 |
| delivery | #599f82 | order-time-and-target-hour.spec.ts | 8 |
| picking | #6c161c | picking-pick-all.spec.ts | 2 |
| catalog | #6afef6 | product-photo-capture.spec.ts (1) + catalog-list.spec.ts (обновлена подсказка камеры) | 1 + 1 обновлён |
| ui-general | #279e07 | dashboard-period-url.spec.ts | +1 |
| **Итого** | 6 тикетов | 5 новых spec + 2 изменённых | **23 новых + 1 обновлён** |

Кейсы: client-ordering co-24…co-30, delivery dlv-07…dlv-10, picking pick-17/18, catalog cat-25 (+cat-06 обновлён), ui-general ui-13. Планы: specs/client-ordering.md §8–9, delivery.md §5–6, picking.md §8, catalog.md §14, ui-general.md §7.6.
Тесты не прогонялись; `npx playwright test --list` — компилируются.

## Только вручную
- #8103a9: новый клиент без заказов не видит категорию; раздельная история (нет второго клиента)
- #aef12a: кол-во > остатка / < минимума после «הזמן שוב»; латиница/цифры в сообщении (визуально)
- #6afef6: реальная камера iPad/Safari (fake camera только Chromium)
- #6c161c: маршрут «גל» на несколько заказов; мобильная 390
- #599f82: 390 (клиент, водитель); браузер в UTC
- #279e07: «לעומת אתמול כולו» при ненулевой выручке вчера (25.10 вчера 0 → «אין תקופה קודמת להשוואה»); граница полуночи

## Находки — сданное сейчас не работает
Нет. Сверка 25.10 (только просмотр) совпала с тикетами.

## Замечания
- Тексты статусов теперь в ж.р. («סופקה», «יצאה למשלוח», «סמן כיצאה למשלוח»), у клиента «פריט אחד» — старые тесты могут упасть: delivery/driver.spec.ts:50, delivery/delivery-lifecycle.spec.ts, client-ordering/order-history.spec.ts. Новые тесты принимают оба варианта.
- Новые @data тесты меняют корзину buyer — не гонять параллельно с другими тестами корзины (README.md дополнить).
- picking-pick-all: экран רשימת ליקוט вживую не открывался (запуск сборки запрещён) — селекторы из соседних тестов и кода; product-photo-capture: миниатюра/storage вживую не проверены.

Следующий шаг: /qa-regress (прогон новых тестов по одному воркеру).
