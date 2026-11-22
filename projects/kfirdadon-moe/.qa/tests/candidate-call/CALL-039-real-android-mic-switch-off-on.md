<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# CALL-039 (настоящий телефон): выключатель «Доступ к микрофону» ~10 с → подсказка; включить → восстановление
- Фича/экран: S-16 официальный звонок на Android (шаг «הגדרות המהירות של Android» — только Android UA)
- Тикеты: #17fdd9 (реджект 3, T1/T2)
- Роль/аккаунт: business + кандидат
- Устройство: настоящий Pixel 6 (serial 1A151FDF6007QZ), Chrome, по кабелю
- Тип: ручной запуск (`QA_REAL_PHONE=1 … --grep @manual`), ТРАТИТ AI-кредиты и официальную попытку; @android @call @data @manual; в обычный регресс не входит
- Предусловия: см. шапку e2e/tests/candidate-call/official-call-17fdd9-realphone.spec.ts (adb, USB-отладка, разрешение микрофона у сайта «Разрешено», business-сессия жива, мик ТОЛЬКО через `adb shell cmd sensor_privacy enable|disable 0 microphone`, панель Chrome свайпом не тянуть)
## Шаги
1. Новый кандидат, на телефоне до живого звонка.
2. `sensor_privacy enable 0 microphone` (мик выкл), ~10 с.
3. `sensor_privacy disable 0 microphone`.
4. «לסיים שיחה» → «לאשר סיום שיחה».
## Ожидаемо
- Шаг 2: статус «המיקרופון לא זמין · מנסים להחזיר אותו» и карточка «אין גישה למיקרופון» (+ шаг про «הגדרות המהירות של Android»), звонок идёт (источник: реджект 3, FL-29 ш.1).
- Шаг 3: «מחובר · הלקוח מקשיב», карточка исчезла.
- Шаг 4: «הסימולציה הושלמה», без результатов.
## История
- 2026-11-17 · ✅ вручную (Pixel 6, звонок 1; адб-логи .qa/tmp/17fdd9-1711/call1-log.json)
- 2026-11-17 · עבר QA · автотест e2e/tests/candidate-call/official-call-17fdd9-realphone.spec.ts (тест 1; только --list, не запускался)
