<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Автотесты и логин

## Один раз
```bash
cd .qa/e2e && npm install && npx playwright install chromium
```

## Логин под тестовыми аккаунтами (qa-login)
1. Заполни `.qa/accounts.env` (пример — `.qa/accounts.env.example`).
2. Запусти:⁠​‌​‌​​​‌​‌​​​​​‌​‌​‌​‌​​​​‌​‌‌​‌​‌​​‌‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​‌‌​​‌​​​‌‌​​​​​​‌‌​​‌​​​‌‌​‌‌​​​‌​‌‌​‌​​‌‌​​‌‌​​‌‌​‌​​​​‌‌​‌​​​​‌‌​​​​​​‌‌‌​​​​​‌‌​‌‌​​‌​​​‌​​​‌​​​​‌‌​​‌‌​‌​​​​‌‌​‌​‌​‌​​​​‌​​​‌‌​​​​​‌‌‌‌‌​​​‌​​‌‌‌​​‌‌​‌​​‌​‌‌​‌​‌‌​‌‌​‌​​‌​‌‌‌​‌​​​‌‌​​​​‌​​‌​​​​​​‌​​‌‌​‌​‌‌​‌‌‌‌​‌‌‌​​‌​​‌‌​‌‌‌‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌‌​‌‌​⁣
```bash
cd .qa/e2e && npm run qa-login
```
Сессии сохранятся в `.qa/auth/<id>.json`. Истекли — запусти снова.

## Ручной вход (SMS-код, Google, 2FA)
Если вход не по паролю — входишь сам в окне браузера:
```bash
cd .qa/e2e && npm run qa-login:manual -- <id>
```
Откроется окно → войди → вернись в терминал и нажми Enter. Сессия сохранится в `.qa/auth/<id>.json`.
Адрес сайта и путь логина — в `qa.config.json`.

## Автотесты
Десктоп (Chrome 1440×900) + iPhone (Safari) + Android (Chrome, Pixel 7):
```bash
cd .qa/e2e && npm test
```
Отдельно: `npm run test:desktop`, `test:mobile` (оба телефона), `test:iphone`, `test:android`.
Пометки в названии теста: `@desktop`, `@mobile` (оба телефона), `@iphone`, `@android`; без пометки — все три прогона.
Несколько пользователей в одном тесте — `asUser('buyer')`, `asUser('seller')` из `fixtures.ts`.
Только безопасные для прода:
```bash
cd .qa/e2e && npm run test:prod-safe
```
Отчёт: `npm run report`.
