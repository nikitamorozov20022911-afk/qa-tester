<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# PWC-2-1: Шаг «תשלום» — кнопка ✕ «סגירה» закрывает окно одним кликом
- Фича/экран: payment-window-cardcom / popup «תשלום» (S-22, §69)
- Тикеты: #cca841
- Роль/аккаунт: hunter_free_2 (demo-hunter-3, FREE)
- Предусловия: staging https://hunters-sooty.vercel.app. Окно «תשלום»: /profile?tab=subscription → «בחירת חבילה» → PLUS → «המשך עם החבילה שנבחרה» (если предложена сохранённая карта — «כרטיס אשראי», #bc3456). Не вводить данные карты, не нажимать «אישור תשלום» (терминал Cardcom боевой).
- Устройство: desktop 1440×900
- Тип: позитив, read-only
## Шаги
1. Открыть окно «תשלום» для PLUS.
2. Найти в шапке кнопку с aria-label «סגירה»; кликнуть.
## Ожидаемо
- На шаге «תשלום» видна кнопка aria-label «סגירה», ~36×36. (источник: #cca841 «מה רצוי» п.1 — «visible close button (X, aria-label «סגירה»)»)
- После одного клика диалогов на странице 0 (окно закрыто целиком, не возврат к «בחירת חבילה»). (#cca841 «Done when» — «close the window with one click (X)»)
- Автотест (план): `.qa/e2e/specs/payment-window-cardcom.md 2.1`
- Скрины: `.qa/screenshots/cca841-close-button-desktop.png`
## История
- 2026-11-07 · ✅ прошёл QA (подтверждено пользователем, «הושלם» 07.11) · #cca841
