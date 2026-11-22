<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# PWC-2-2: Кнопка ✕ «סגירה» доступна с клавиатуры (Tab → Enter / Space)
- Фича/экран: payment-window-cardcom / popup «תשלום»
- Тикеты: #cca841
- Роль/аккаунт: hunter_free_2 (demo-hunter-3)
- Предусловия: staging https://hunters-sooty.vercel.app. Окно «תשלום»: /profile?tab=subscription → «בחירת חבילה» → PLUS → «המשך עם החבילה שנבחרה» (если предложена сохранённая карта — «כרטיס אשראי», #bc3456). Не вводить данные карты, не нажимать «אישור תשלום» (терминал Cardcom боевой).
- Устройство: desktop 1440×900
- Тип: позитив (доступность), read-only
## Шаги
1. Открыть окно «תשלום»; Tab до кнопки «סגירה» (фокус на ней); Enter.
2. Открыть окно снова; Tab до «סגירה»; Space.
## Ожидаемо
- Кнопка «סגירה» получает фокус с клавиатуры; Enter закрывает окно; Space закрывает окно (0 диалогов). (источник: #cca841 «מה רצוי» п.1, тег accessibility)
- Находка (не реджект): рамка фокуса на ✕ — стандартная синяя браузера, не бирюзовая (#730ae5) — не проверяется.
- Автотест (план): `.qa/e2e/specs/payment-window-cardcom.md 2.2`
- Скрины: `.qa/screenshots/cca841-close-focus-desktop.png`, `cca841-verify-close-focus-desktop.png`
## История
- 2026-11-07 · ✅ · #cca841
