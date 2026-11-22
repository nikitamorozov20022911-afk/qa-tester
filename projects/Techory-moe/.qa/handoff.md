<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Handoff · Techory · сессия 17.11.2026

- Статус: завершено
- Команда: /qa (Android Techory Dev + prod + Pre-Prod)
- Текущий тикет: нет — очередь «בבדיקות» (39) пройдена полностью
- Следующий шаг: новая сессия /qa по свежей колонке «בבדיקות»; после подключения live Stripe — ретест #1a7125 (память techory-payment-retest-after-stripe)

## Окружение
- prod app.techory.ai: admin (iamdejar, компания test) — живые слоты admin-4/5/6 (перелогинены 17.11 через slot-login.cjs; admin, admin-2/3/7…10 мертвы после глобального Sign out — пересоздать `node slot-login.cjs admin <n>`), gps, dispatcher (gesaday533).
- Pre-Prod: preprod-ttp (TTP Test Locks, 2 компании), preprod-a (Preprod Locks A, подписка «Cancels on Nov 3», активная доп. компания $49 sandbox).
- Android: Pixel 6, Techory Dev 1.2 (сборка 16.11), вход pp-ttp. Управление WebView: `adb forward tcp:9333 localabstract:webview_devtools_remote_<pid>` + Playwright connectOverCDP; «назад» — `adb shell input keyevent 4`.
- Журнал: .qa/session.json (2026-11-17); прошлый — session-2026-11-12.json.

## Итог по «בבדיקות» (39)
- Прошли и проведены пользователем (32): #4f4eab #4315cf #24c5b2 #809888 #0cd6c0 #a83f47 #70ca62 #ca1a27 #5e4fe6 #5315ab #b20fe6 #458056 #63ed24 #feb50f #ffde48 #8595f7 #0e73d5 #a96197 #cacd64 #c9f0f5 #4030e4 #126f07 #98c982 #621cd7 #22cfa9 #ec42a8 #2185f2 #687146 #1649c3 #04d338 #48acac #0c3606. Автотесты написаны по всем (не запускались), ledger обновлён.
- Реджект (5, в לביצוע): #2f4dd9 #1cdb04 #e9ccde #6d5396 #6f9da3.
- לא ניתן לשחזר (2, с 12.11): #1a7125 (live Stripe), #4ed2a1 (Google Play; реджект Download закрыт).
- Закрыты старые реджекты: #5315ab #5e4fe6 #ca1a27 #4030e4 #4ed2a1 #2185f2 #0c3606(×2).

## Новые баги 17.11 (17, в לביצוע)
#8340df #cf95a1 #e51205 #d1599a #2da355 #b2fe34 #135712 #6b906d #af15da #baa610 #f42def #59a153 #ac4295 #56c006 #c97bc6 #fe9d0b #0b6567
Не заведено: «JOB-0002/0003 не видны в Jobs» — не подтвердилось (вкладка Pending).

## Открытые вопросы
- нет

## Технические заметки
- Вложения mifrat: upload_path отклоняется (upload_not_complete) — прикладывать через { url } публичного файла после PUT.
- Параллельные агенты: свои скрипты в отдельных подпапках scratchpad, уникальные имена сессий (иначе сессии перемешиваются).
- В zsh URL с «?» в командах — в кавычках.

## Тестовые данные к чистке
- prod test: QA-счета INV-0059…0075, клиенты QA-Import 1711 ×9, QA-Avi Cohen / QA-Maya Levi / QA-Dan Brooks, JOB-0124; приглашение qa-invite2-1711@example.test (Invited, аккаунт создан без подтверждения).
- prod gps: JOB-0013…0023, клиенты из SMS (QA-Gil Shore, QA-Noa Field, QA-Tom Cruz, «+972537240114»), сообщения 17.11; правила Auto-assign в исходном виде.
- Pre-Prod: EST-0006, QA-687146-item(2) в JOB-0001/INV-0004, открытая Payment Link $1 JOB-0004, 1 возврат $1 (TTP), подписка доп. компании pp-a $49 (sandbox) — отменить в billing portal.
