# OB-01: Зарегистрированный пользователь не попадает в onboarding по URL
- Фича/экран: S-04…S-14, S-30
- Тикеты: #6aa7f009 · 7a08d26aeddc «משתמש רשום יכול לגשת לעמודי ה-Onboarding באמצעות שינוי ה-URL»
- Роль/аккаунт: user1
- Устройство: 390, 1440
- Тип: негатив · навигация · @prod-safe
## Предусловия
- Вход user1 (.qa/auth/user1.json).
## Шаги
1. По очереди открыть /level, /summary, /birth-date, /dates, /location, /reminders, /motivation, /nusach, /register, /welcome.
## Ожидаемо
- Каждый маршрут перенаправляет на /home (needed_behavior 0817c762; список маршрутов — комментарий программиста, commit 9363470).
## История
- 2026-10-03 · ✅ · backfill — все 10 маршрутов → /home (390); /level → /home (1440).
