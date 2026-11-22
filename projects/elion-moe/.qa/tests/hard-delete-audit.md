# Hard delete + Audit Trail (qa-stand) · #f54c1e, #0cd999, #38f51d · 2026-11-15

Роль: admin (AAL2), десктоп EN, qa-stand. Тестовые сущности — только «QA …» (постоянное разрешение).

## TC-HD-1 Hard delete счёта с переводом (#f54c1e)
1. Dashboard: записать Net worth / Gross / Liquidity.
2. Создать Bank Account «QA HD Account <ddmm>» 9,300 USD и «QA HD Peer <ddmm>» 2,700 USD.
3. Internal transfer 700 USD Account → Peer, Paid. Ожидание: Account 8,600 USD, Peer 3,400 USD, строка на обеих сторонах.
4. Account → Delete permanently: окно «Administrators only», список что удаляется, кнопка неактивна при неполном имени, активна при точном.
5. Ожидание: переход на /financial-projects, счёта нет; Peer вернулся к 2,700 USD, перевод исчез; записи CREATE счёта/перевода исчезли из Audit Trail.
6. После удаления обоих тестовых счетов Dashboard = значения шага 1.
Факт 15.11: всё ✓ (330,371,860 / 360,355,054 / 83,437,096 до и после).

## TC-HD-2 Запись hard delete в Audit Trail (#0cd999)
1. После TC-HD-1: верхняя запись DELETE / имя счёта / пользователь / SUCCESS.
2. Меню: только View Details, User Information (нет Restore, Go to Object).
3. View Details: operation hard_delete, projectId, projectType, ledger_inflows/outflows, payment_entries_hidden, audit_trail, deleted_project_snapshots, project_metrics, баланс второго счёта до→после.
4. Второй hard delete (Peer) — первая запись остаётся.
Факт 15.11: всё ✓ (Peer 12,486.5 → 9,915.75 AED).

## TC-HD-3 Restore у удалений строк Cash Flow (#38f51d)
1. Audit Trail → All Time → Advanced filters: Action type = Delete.
2. Delete строк Cash Flow (ledger_id в View Details) до 24/09/2026 → меню без Restore, статус Soft Deleted, View Details показывает поля строки.
3. Delete строки Cash Flow после 24/09 → Restore есть.
4. Своя строка: + Add на тестовом счёте → Delete → Audit Trail Restore → Confirm → строка вернулась, запись EDIT/RESTORED, DELETE → RESTORED.
Факт 15.11: 5 записей 03/08–23/08 без Restore ✓; 01/10 с Restore ✓; своя строка восстановлена ✓. 14 записей до 24/09 с Restore — не строки Cash Flow (платежи, проекты, документы, бенефициары) — вне тикета.
