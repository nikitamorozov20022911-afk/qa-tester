# TC-API-01: GET /user/:id гостем — только публичные поля
- Фича/экран: API профиля пользователя (`GET /user/:id`)
- Тикеты: #afb7da (a8206c81)
- Роль/аккаунт: гость (без Authorization); id только 140 и 146 (наши тестовые)
- Устройство: не нужно (API)
- Тип: безопасность / позитив, @prod-safe
## Шаги
1. `GET BASE/user/140` без заголовка Authorization
2. То же для `/user/146`
## Ожидаемо
HTTP 200. В ответе нет `birthDate`, `street`, `email`, `favorites`, `exponentPushToken`, `verificationCodeDev`. `fcmToken` — только alias `["user:<id>"]`, реального push-токена нет. Есть заголовок `x-ratelimit-limit-profile-ip` (на 26.10 — 300/мин; превышение → 429). Источник — «מה רצוי» тикета.
Не делать: перебор id, POST /auth/login (шлёт SMS).
## История
- 2026-10-26 · ✅ · #afb7da (17 публичных полей; телефон — по contactMethods)
