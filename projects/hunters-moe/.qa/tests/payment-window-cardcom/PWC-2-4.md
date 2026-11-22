<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# PWC-2-4: «חזרה» на шаге «תשלום» возвращает к выбору тарифа
- Фича/экран: payment-window-cardcom / popup «תשלום»
- Тикеты: #cca841
- Роль/аккаунт: hunter_free_2 (demo-hunter-3)
- Предусловия: staging https://hunters-sooty.vercel.app. Окно «תשלום»: /profile?tab=subscription → «בחירת חבילה» → PLUS → «המשך עם החבילה שנבחרה» (если предложена сохранённая карта — «כרטיס אשראי», #bc3456). Не вводить данные карты, не нажимать «אישור תשלום» (терминал Cardcom боевой).
- Устройство: desktop 1440×900
- Тип: позитив (регресс), read-only
## Шаги
1. Открыть окно «תשלום»; нажать стрелку «חזרה».
## Ожидаемо
- Окно не закрылось: показан шаг «בחירת חבילה» с карточками тарифов и кнопкой «המשך עם החבילה שנבחרה». (источник: #cca841 «מה קיים» — «back arrow «חזרה» to plan selection»)
- Автотест (план): `.qa/e2e/specs/payment-window-cardcom.md 2.4`
- Скрины: `.qa/screenshots/cca841-back-to-plans-desktop.png`
## История
- 2026-11-07 · ✅ · #cca841
