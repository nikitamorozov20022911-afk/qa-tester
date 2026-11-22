# MATCH-02: без входа сервер отказывает — swipe, my_matches, messages, matches → 401
- Фича/экран: API Supabase (rpc/swipe, rpc/my_matches, /rest/v1/messages, /rest/v1/matches)
- Тикеты: #b76c3b
- Роль/аккаунт: guest (публичный apikey берётся из запроса приложения под free — только чтение)
- Устройство: mobile — iPhone 390×844
- Тип: негатив (доступ)
- Предусловия: нет.
## Шаги
1. Из окна free взять адрес API и apikey из любого запроса приложения.
2. Из окна гостя (только apikey, без Authorization): POST rpc/swipe, POST rpc/my_matches, GET messages, GET matches.
## Ожидаемо
- Каждый ответ 401 (допустимо 403); данных нет.
(источник: «מה רצוי» #b76c3b AC 8; Р1 п.2; факт 28.10 — 401)
## История
- 2026-10-28 · ✅ · #b76c3b
- 2026-10-29 · ✅ · #b76c3b
