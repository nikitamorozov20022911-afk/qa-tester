<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# BIZ-LC-008: нет самостоятельной регистрации бизнеса
- Фича/экран: /login, /signup, /register, /join, /admin/businesses/new (F-01 AC5, треб.3)
- Тикеты: #6a993d795019333734edc22d (#edc22d)
- Роль/аккаунт: guest
- Устройство: desktop 1440×900
- Тип: негатив (только чтение)
## Шаги
1. Гость открывает /signup, /register, /join, /admin/businesses/new.
2. На /login осмотреть ссылки.
## Ожидаемо
- Каждый адрес → /login «כניסה לחשבון»; формы создания бизнеса нет.
- На /login нет ссылки/кнопки регистрации; текст «הכניסה בהזמנה בלבד. אין לכם חשבון? בקשו הזמנה ממנהל החשבון בעסק.» (AC5).
- (API) admin-create-business без входа → 401.
## История
- 2026-10-13 · ✅ · #edc22d
- 2026-10-14 · עבר QA · в плане specs/business-lifecycle.md 5.1 (для playwright-test-generator)
