---
name: qa-device
description: Тесты на НАСТОЯЩЕМ телефоне по кабелю — iPhone (Safari и приложения, через Appium + WebDriverAgent) и Android (adb/Appium, эмулятор Android Studio). Как проверить, готов ли компьютер, простая установка с нуля на новом компьютере, запуск сессии, скриншоты, пересборка раз в 7 дней. Используй, когда нужен реальный телефон (камера, клавиатура, системные окна, нативное приложение) или пользователь говорит «подключил телефон», «через кабель», «на моём iPhone/Android».
---
<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->

# Настоящий телефон по кабелю

Эмуляция Playwright (`qa-browser-cli`, профили iPhone/Android) — основной путь для сайтов. Настоящий телефон — когда эмуляции мало: камера, клавиатура, системные окна и разрешения, нативное приложение, баг «только на телефоне». Предлагай устройство, запускай только после «да».

## 0. Личные данные — только локально
- Всё про устройства этого компьютера (UDID, Team ID, bundle id, Apple ID, команды пересборки) хранится **только** в `~/.qa-tester/devices.md`.
- **Никогда** не писать эти данные в `.qa/` проектов, отчёты, тикеты, скиллы плагина, архив kit или git. В проекте можно написать только «проверено на реальном iPhone/Android».

## 1. Компьютер уже готов?
Есть `~/.qa-tester/devices.md` → прочитай его и работай по нему (раздел 3). Нет файла → проверь, что уже стоит, и предложи установку (раздел 2):
```bash
uname -m; sw_vers -productVersion; xcode-select -p; xcodebuild -version
node -v; appium -v; appium driver list --installed
xcrun devicectl list devices      # iPhone по кабелю
adb devices                        # Android по кабелю / эмулятор
```

## 2. Установка с нуля (Mac)
Шаги с паролями и Apple ID делает **пользователь** — агент только объясняет и проверяет. Остальное ставит агент.

**Общее (агент):**
1. Node 22 (`nvm install 22 && nvm alias default 22`).
2. `npm i -g appium` → `appium driver install xcuitest` → `appium driver install uiautomator2`.

**iPhone:**
1. Пользователь: **Xcode** из App Store на Mac (не в Safari и не на iPhone; разработчик — Apple). Прямая ссылка в App Store: `open "macappstore://apps.apple.com/app/id497799835"`. Надпись «not compatible» может появиться и на рабочем Mac — дождаться окончания установки. Если не ставится — более старая версия `.xip` с developer.apple.com/download/all.
2. Пользователь: первый запуск Xcode → отметить только **iOS** → Install. Потом в терминале `sudo xcode-select -s /Applications/Xcode.app`.
3. Пользователь: Xcode → Settings (⌘,) → **Accounts** → «+» → Apple Account. Бесплатного Apple ID достаточно, он может отличаться от Apple ID телефона. → **Manage Certificates…** → «+» → **Apple Development**.
4. Агент проверяет `security find-identity -v -p codesigning`. «0 valid identities» при существующем сертификате → не хватает промежуточного сертификата: пользователь скачивает **Worldwide Developer Relations - G3** с apple.com/certificateauthority и добавляет в связку «Вход».
5. Пользователь (чтобы не было 7 окон пароля при подписи): `security set-key-partition-list -S apple-tool:,apple:,codesign: -s ~/Library/Keychains/login.keychain-db` (пароль = пароль Mac).
6. Пользователь: iPhone по кабелю → «Доверять» → Настройки → Конфиденциальность и безопасность → **Режим разработчика** (перезагрузка). Проверка: `xcrun devicectl device info details --device <id>` → `developerModeStatus: enabled`.
7. Агент: Team ID берётся из сертификата (`security find-certificate -c "Apple Development" -p | openssl x509 -noout -subject` → поле `OU`). Собрать WebDriverAgent со **своим уникальным** bundle id:
   ```bash
   cd ~/.appium/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent && xcodebuild build-for-testing -project WebDriverAgent.xcodeproj -scheme WebDriverAgentRunner -destination 'id=<UDID>' -derivedDataPath ~/.appium/wda-build -allowProvisioningUpdates -allowProvisioningDeviceRegistration DEVELOPMENT_TEAM=<TEAM_ID> CODE_SIGN_STYLE=Automatic PRODUCT_BUNDLE_IDENTIFIER=<уникальный>.WebDriverAgentRunner
   ```
   UDID — из `xcrun xctrace list devices`.
8. Пользователь: Настройки → Основные → **VPN и управление устройством** → свой Apple ID → «Доверять» (без этого: «invalid code signature… not explicitly trusted»).
9. Пользователь, для Safari: Настройки → Приложения → Safari → Дополнения → **Веб-инспектор**.

**Android:**
1. Android Studio (SDK и эмулятор). Агент добавляет в `~/.zshrc`: `ANDROID_HOME=$HOME/Library/Android/sdk`, `ANDROID_SDK_ROOT`, `JAVA_HOME` = jbr из Android Studio (`/Applications/Android Studio.app/Contents/jbr/Contents/Home`), PATH с `emulator` и `platform-tools`. Проверка: `appium driver doctor uiautomator2` — 0 обязательных исправлений.
2. Телефон: О телефоне → 7 раз «Номер сборки» → Для разработчиков → **Отладка по USB** → кабель → «Разрешить». Проверка: `adb devices`.
3. Эмулятор без окна: `emulator -avd <AVD> -no-window -no-audio -gpu swiftshader_indirect`. Готовность: `adb shell getprop sys.boot_completed` = 1. На Intel Mac — образ x86_64 и запуск 2–3 минуты.

**После установки** агент записывает итог в `~/.qa-tester/devices.md` (Mac, устройства, Team ID, bundle id, параметры сессии, команда пересборки) — и только туда.

## 3. Работа
- Запустить Appium в фоне: `appium --port 4723`. Сессия — W3C `POST /session`.
  - iPhone: `platformName: iOS`, `appium:automationName: XCUITest`, `appium:udid`, `appium:usePrebuiltWDA: true`, `appium:derivedDataPath`, `appium:updatedWDABundleId`, `appium:xcodeOrgId`, `appium:xcodeSigningId: "Apple Development"`, `appium:wdaLaunchTimeout: 240000`. Сайт — `browserName: Safari` (+ `appium:webviewConnectTimeout: 20000`). Приложение — `appium:bundleId`.
  - Android: `platformName: Android`, `appium:automationName: UiAutomator2`, `appium:deviceName` = id из `adb devices`; сайт — `browserName: Chrome`, приложение — `appium:appPackage` + `appium:appActivity`. Простые действия можно делать и через adb: `adb shell input tap|text|swipe`, `adb exec-out screencap -p > shot.png`.
- Скриншоты — в `.qa/screenshots/` проекта (правила `qa-evidence`), без данных устройства в имени файла.
- Телефон во время теста **разблокирован и на кабеле**.
- После работы остановить Appium и эмулятор (слабые компьютеры тормозят).

## 4. Если не запускается
- iPhone, бесплатный Apple ID: **подпись живёт 7 дней** → пересобрать WebDriverAgent (раздел 2, шаг 7; готовая команда — в `devices.md`).
- «Developer App Certificate is not trusted» → раздел 2, шаг 8.
- «remote debugger did not return any connected web applications» → не включён Веб-инспектор (шаг 9).
- Висят окна пароля «codesign wants to access key» → раздел 2, шаг 5, потом пересобрать.
- Mac на Intel: не ставить ffmpeg через brew — он собирается из исходников часами (для тестов не нужен).

## Камера
На настоящем телефоне подменить картинку камеры нельзя — проверяются разрешения, интерфейс и поток после съёмки. Распознавание (QR, лица, люди) — через подставную камеру в Chrome (Playwright, подмена `getUserMedia`) или поставить телефон камерой к экрану компьютера с нужной картинкой.
