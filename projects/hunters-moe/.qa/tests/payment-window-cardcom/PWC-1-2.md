<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# PWC-1-2: Ресайз окна 1440→800→1440→375→1440 — iframe Cardcom по ширине контейнера, без переполнения и красной рамки
- Фича/экран: payment-window-cardcom / popup «תשלום»
- Тикеты: #43c7ff
- Роль/аккаунт: hunter_free_2 (demo-hunter-3, FREE)
- Предусловия: staging https://hunters-sooty.vercel.app; Cardcom отвечает (не 500). Окно «תשלום» открывается без списания: /profile?tab=subscription → «בחירת חבילה» → PLUS → «המשך עם החבילה שנבחרה». Если у аккаунта есть сохранённая карта — выбрать «כרטיס אשראי» (#bc3456). Никогда не вводить данные карты и не нажимать «אישור תשלום»; закрыть окно Escape.
- Устройство: desktop, старт 1440×900
- Тип: граница/визуал, read-only
## Шаги
1. Открыть окно «תשלום» (PLUS), дождаться полей Cardcom.
2. Последовательно менять размер окна: 1440×900 → 800×900 → 1440×900 → 375×812 → 1440×900.
3. После каждого шага измерить iframe #CardComCardNumber и #CardComCvv и их контейнеры.
## Ожидаемо
- На каждом шаге ширина каждого iframe = ширине его контейнера (±1px), оба видимы. (источник: «מה רצוי» — «the iframe size follows its container»)
- Нет горизонтальной прокрутки страницы: scrollWidth ≤ clientWidth документа. (там же — вёрстка сохраняется)
- Пустые поля без красной рамки (нет aria-invalid=true / красного цвета рамки). (источник: «No red error frame appears unless the entered number is really invalid»)
- Также проверено вручную: zoom страницы 0.8/1/1.25/1.5 — то же (`43c7ff-zoom*-desktop.png`); в автотест не входит.
- Автотест (план): `.qa/e2e/specs/payment-window-cardcom.md 1.2`
- Скрины: `.qa/screenshots/43c7ff-step1-800x900-desktop.png`, `43c7ff-step2-1440x900-desktop.png`, `43c7ff-step3-375x812-desktop.png`, `43c7ff-step4-1440x900-desktop.png`
## История
- 2026-10-28 · ✅ прошёл QA (подтверждено пользователем: «עבר QA» 28.10) · #43c7ff
