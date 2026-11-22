# MATCH-04: сообщение без мэтча — в несуществующий и в чужой мэтч → 403
- Фича/экран: POST /rest/v1/messages
- Тикеты: #b76c3b
- Роль/аккаунт: free (отправитель); reg1 — только чтобы узнать id чужого мэтча reg1↔reg2 (83f63177…)
- Устройство: mobile — iPhone 390×844
- Тип: негатив (доступ)
- Предусловия: free не участник мэтча reg1↔reg2.
## Шаги
1. free: POST messages {match_id: случайный uuid, sender_id: id free, текст «QA-AUTO no-match …»}.
2. free: POST messages в мэтч reg1↔reg2 с тем же телом.
## Ожидаемо
- Оба ответа 403; сообщение не создано.
(источник: «מה רצוי» #b76c3b AC 7; Р1 п.1; факт 28.10 — 403)
## История
- 2026-10-28 · ✅ · #b76c3b (b76c3b-chat-foreign-iphone.png, b76c3b-chat-random-free-mobile.png)
- 2026-10-29 · ✅ · #b76c3b (b76c3b-nomatch-chat-free-iphone-v.png)
