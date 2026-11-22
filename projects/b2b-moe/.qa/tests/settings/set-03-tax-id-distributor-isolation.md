<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# set-03: ח.פ. у каждого מפיץ свой — второй מפיץ не видит и не меняет
- Фича/экран: /settings; REST distributors
- Тикеты: #61c0f4
- Роль/аккаунт: admin (jleprog34, «באנגו דלי»), dist2 (aviel@, второй מפיץ, auth/dist2.json)
- Устройство: desktop
- Тип: негатив / безопасность
- Предусловия: у admin сохранён ח.פ. (QA значение); исходное вернуть.
## Шаги
1. dist2 → /settings → поле «ח.פ. / עוסק מורשה».
2. dist2: GET distributors; PATCH distributors?id=eq.<admin> с {tax_id}.
3. admin: прочитать значение.
## Ожидаемо
1. У dist2 поле не содержит значение admin.
2. Бизнес admin dist2 не виден; PATCH меняет 0 строк (מה רצוי: «מפיץ אחר לא רואה ולא משנה אותו»).
3. Значение admin не изменилось.
## История
- 2026-11-19 · ✅ · #61c0f4 (dist2: настройки, PATCH → 0 строк). Скрин: screenshots/61c0f4-dist2-settings-desktop.png.
