<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# PWC-1-4: Пустые поля Cardcom получают фокус после ресайза
- Фича/экран: payment-window-cardcom / popup «תשלום»
- Тикеты: #43c7ff
- Роль/аккаунт: hunter_free_2 (demo-hunter-3, FREE)
- Предусловия: staging https://hunters-sooty.vercel.app; Cardcom отвечает (не 500). Окно «תשלום» открывается без списания: /profile?tab=subscription → «בחירת חבילה» → PLUS → «המשך עם החבילה שנבחרה». Если у аккаунта есть сохранённая карта — выбрать «כרטיס אשראי» (#bc3456). Никогда не вводить данные карты и не нажимать «אישור תשלום»; закрыть окно Escape.
- Устройство: desktop 1440×900 (вручную также mobile 375×812)
- Тип: позитив, read-only (без ввода)
## Шаги
1. Открыть окно «תשלום» (PLUS); изменить размер 1440→800→1440.
2. Кликнуть в «מספר כרטיס», затем Tab/клик в «CVV»; затем клик вне поля (blur).
## Ожидаемо
- Поле ввода внутри iframe получает фокус (document.activeElement внутри фрейма = поле). (источник: Done when — «the field … accepts input»)
- После blur пустого поля нет красной рамки. (источник: «No red error frame appears unless the entered number is really invalid»)
- Ничего не вводить.
- Автотест (план): `.qa/e2e/specs/payment-window-cardcom.md 1.4`
- Скрины: `.qa/screenshots/43c7ff-focus-num-desktop.png`, `43c7ff-focus-cvv-desktop.png`, `43c7ff-blur-*-desktop.png` (+ `*-mobile.png`)
## История
- 2026-10-28 · ✅ прошёл QA (подтверждено пользователем «עבר QA» 28.10) · #43c7ff
