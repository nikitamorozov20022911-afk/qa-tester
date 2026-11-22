<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# UA-003: токен менеджера заблокированного бизнеса не читает данные
- Фича/экран: блокировка бизнеса (F-09 req. 7) + Supabase REST
- Тикеты: #4cfd0ae49bece5d24e46d903
- Роль/аккаунт: blockmgr (менеджер QA-A Block 0410, b93165ca-b5cb-4292-ae5b-c0278e39fc6f), admin — для проверки статуса и apikey
- Устройство: desktop 1440×900
- Тип: негатив (безопасность)
- Предусловия: бизнес QA-A Block 0410 ЗАБЛОКИРОВАН (оставлен «לחסימה»); живая сессия .qa/auth/blockmgr.json. Приложение под blockmgr не открывать: при блокировке оно делает выход и убивает сессию — токен обновляется через /auth/v1/token и записывается обратно в blockmgr.json.
## Шаги
1. admin: карточка /admin/businesses/b93165ca… — статус «חסום».
2. Обновить токен blockmgr (refresh_token из его сессии).
3. Новым токеном GET businesses, invitations, candidates, simulations.
## Ожидаемо
- Все → 200 `[]`; до блокировки businesses отдавал запись бизнеса (источник: F-09 req. 7 «חסימת חשבון עסקי מבטלת מיידית את הגישה של כל משתמשיו»; «מה רצוי» #4cfd0ae4).
## История
- 2026-10-05 · ✅ · #4cfd0ae4 (п.7: businesses/invitations 200 [])
- 2026-10-05 · עבר QA · автотест tests/user-access/blocked-business-token.spec.ts
