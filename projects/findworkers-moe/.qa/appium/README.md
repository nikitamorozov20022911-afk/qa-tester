# Регресс Find Workers — Appium + WebdriverIO (реальные телефоны)

Решение 2026-10-07: регресс на реальных iPhone и Android через Appium (Maestro/Playwright к нативному iPhone не подходят).

## Подготовка (один раз)
- Appium 3 + драйверы `xcuitest`, `uiautomator2` (см. скилл `qa-device`), `npm i` в этой папке (Node 22).
- Данные устройств НЕ хранятся в проекте. Тесты читают их из `~/.qa-tester/devices.json` или переменных окружения:
  `IOS_UDID, IOS_WDA_BUNDLE, IOS_TEAM, IOS_WDA_DERIVED, ANDROID_UDID`.
- Тестовые аккаунты (переписка/действия только между ними):
  iPhone — `QA_IOS_USER_NAME` (по умолч. «נקיה מורוזוב», id 140), Android — `QA_ANDROID_USER_NAME` (по умолч. «Alina Alina», id 146).
  Оба залогинены в приложении заранее (OTP вводит пользователь). Тесты НЕ логинятся и не сбрасывают данные (noReset).

## Запуск
1. `appium --port 4723` (с ANDROID_HOME/JAVA_HOME в окружении).
2. `npm run test:android` / `npm run test:ios` / `npm test` (обе платформы по очереди, PLATFORM=ios|android).
Теги в названиях: `@ios`, `@android`, `@prod-safe` (ничего не создаёт), `@data` (создаёт и сразу удаляет данные).

## Покрытие
| Файл | Тикет | Кейсы |
|---|---|---|
| tests/chat-keyboard.test.js | #6a8560fb | TC-CHAT-01, TC-CHAT-02 |
| tests/qr-deeplink.test.js | #6a61f2a5 | TC-QR-01, TC-QR-02 (п.1) |
| tests/job-ad-page.test.js | #7c30a0f9 | TC-AD-01, TC-AD-02 |
| tests/api-user-public.test.js | #afb7da | TC-API-01, TC-API-02 (API гостем, без устройства) |
| tests/job-ad-city-required.test.js | #5a3976 | TC-AD-04 |
| tests/availability-multiselect.test.js | #732f80 | TC-AV-01, TC-AV-02 (@data, исходный статус возвращается) |
| tests/profile-video.test.js | #5055f4 | TC-VID-01 (@data, видео удаляется в конце; env QA_VIDEO_DURATION) |
| tests/distance.test.js | #ad36ca | TC-DIST-01…05 (поиск he работников/работ, профиль партнёра 84–88 KM, свой профиль без KM, сортировка מרחק; перед своим профилем перезапуск приложения) |
| tests/push-android.test.js (+ lib/android-notifications.js) | #aaeb71 | TC-PUSH-01…04 — только приход push на Android (Alina): открыто не в чате / фон / выгружено (`am kill`, не force-stop) / заблокировано; проверка через `adb shell dumpsys notification --noredact` (pkg com.yb.findworkers, title = имя отправителя, text = текст). Отправка — с iPhone (PARTNER, נקיה) **вручную**: запуск с `QA_PUSH_SENDER=manual`, тест печатает точный текст `QA-AUTO push <state> <ЧЧММСС>` и ждёт `QA_PUSH_WAIT_MS` (по умолч. 180 с). Без `QA_PUSH_SENDER` выполняется только предусловие (POST_NOTIFICATIONS выдан). Два драйвера в одном процессе не поддерживаются (lib/session.js — одна платформа на процесс). Сообщения остаются в чате — список печатается в конце |
Вручную: TC-QR-02 п.2 (удаление приложения), TC-AD-03 (публикация — публичные данные), TC-VID-02 (режим полёта), TC-PUSH-05…08 (получатель iPhone — шторку/экран блокировки iOS не читаем), TC-PUSH-09/10 (свежая установка + «Allow» + вход по OTP); в TC-PUSH-01…04 вручную только отправка с iPhone.
