<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# cat-13: לקוח עסקי — אין גישה לניהול הקטלוג
- Фича/экран: F-01 / S-01, S-02 (R-02 / R-08 негатив)
- Тикеты: 6a38cf5d21ef8df2464230b4 #6a38cf5d; 6a38cf5e524a187d2c244c49 #6a38cf5e
- Роль/аккаунт: buyer
- Устройство: desktop
- Тип: безопасность / негатив
- Предусловия: сессия buyer.
## Шаги
1. Открыть `/catalog`, `/catalog/new`, `/catalog/categories`.
## Ожидаемо
1. Редирект в `/shop`; заголовка «קטלוג וניהול» / формы товара нет (AC «הגישה נדחית»).
## История
- 2026-10-03 · backfill · ✅ сверено /catalog и /catalog/new → /shop.
