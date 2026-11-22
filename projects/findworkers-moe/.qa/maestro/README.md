# Регресс Find Workers на Maestro

Нативное Android-приложение → автотесты на Maestro (Playwright к нативному UI неприменим).

- `flows/<feature>/*.yaml` — тест-кейсы по фичам (теги: фича F-xx, `smoke`, `payments` — исключены).
- `subflows/login-otp.yaml` — вход по телефону + OTP (код даёт пользователь).
- Запуск всего: `.qa/maestro/run.sh test .qa/maestro` (из корня проекта; эмулятор Pixel_7 должен быть запущен).
- Отчёт: `.qa/maestro/run.sh test .qa/maestro --format junit --output .qa/maestro/results/report.xml`.

Сессия после OTP живёт в данных приложения на эмуляторе — не использовать `clearState`, иначе нужен новый код.

Установка (Intel Mac, macOS 26): Java 17 — `brew install openjdk@17`; Maestro — релиз с GitHub в `~/.maestro` (brew-формула не ставится без Xcode). Всегда запускать через `run.sh`.
