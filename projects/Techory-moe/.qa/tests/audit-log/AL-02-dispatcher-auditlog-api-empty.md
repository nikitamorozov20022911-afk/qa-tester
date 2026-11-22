# AL-02: Admin-dispatcher компании test читает AuditLog напрямую через API — 200 и пустой список
- Фича/экран: API Supabase REST `/rest/v1/AuditLog` (RLS)
- Тикеты: #fc4fa4
- Роль/аккаунт: dispatcher «Test Nikita» (gesaday533@bwingmedia.com, Admin-dispatcher в компании test), .qa/auth/dispatcher.json
- Устройство: desktop 1440×900
- Тип: негатив (доступ, API)
- Предусловия: как AL-01. Только чтение.
## Шаги
1. Открыть /dashboard под dispatcher, взять токен из localStorage.
2. GET `{supabase}/rest/v1/AuditLog?select=*` со своим токеном.
## Ожидаемо
- 200 и `[]` — участник команды не-супер-админ не видит журнал (ни своей компании, ни чужих).
(источник: AC2, AC3; реджект 2, п. «то же для участника команды не-супер-админа»; комментарий программиста №4 — AuditLog читает только супер-админ)
## История
- 2026-11-12 · ✅ · #fc4fa4 (dc0451ee552ed1b25afc4fa4), повторная проверка после реджекта 2
