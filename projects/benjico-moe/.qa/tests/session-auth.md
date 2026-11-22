# Сессия, выход и права (#a337fd)
Источник: #a337fd «Sprint 6 — זהות, הרשאות והתאוששות session», проверено 02.11 (Chrome 1280, iPhone webkit 390), роль parent-b, гость.

| ID | Кейс | Шаги | Ожидаемо |
|---|---|---|---|
| SA-01 | Выход отзывает токен | сохранить access/refresh → меню «חשבון» → «יציאה מהחשבון» → подтвердить → запросы старым токеном (children, writing_attempts, rpc/current_levels) сразу/1/5 мин | 401 session_revoked без данных; refresh → 400 refresh_token_not_found; /sign-in |
| SA-02 | Вторая вкладка после выхода | вкладка B той же сессии → действие | 401 → /sign-in с «החיבור לחשבון הסתיים. היכנסו שוב כדי להמשיך.» |
| SA-03 | Истечение во время работы | валидный access + неверный refresh, часы +2 ч, действие | /sign-in с тем же сообщением |
| SA-04 | Чужой ребёнок = несуществующий | токен семьи B → children/writing_attempts/current_levels/child_profile/next_activity по id семьи A и по 0000…deadbeef | одинаковые ответы ([] или 403 not_authorized), без данных |
| SA-05 | SSO выключен | GET /auth/v1/settings; /sign-in | все external false; кнопок SSO нет |
| SA-06 | anon | только apikey → rpc/current_levels, child_profile, has_gate_pin, children | 401 permission denied |
| SA-07 | Ребёнок не попадает к родителю | режим ребёнка → «הורים» / прямой /settings | PIN-клавиатура (или «אימות זהות» без PIN), зона родителя скрыта |
| SA-08 | Формат email без запроса к серверу (#f8756c) | гость: /sign-in, /sign-up, /recover → email «abc», «abc@» → уход из поля и кнопка отправки; затем «a+b@c.co» | текст «כתובת האימייל אינה תקינה…» у поля; ни одного запроса к /auth/v1/; поле email dir=ltr; для валидного адреса ошибки нет |
| SA-09 | /reset-password без токена (#f8756c) | гость → /reset-password | «הקישור כבר לא בתוקף…», формы нового пароля нет |
| SA-10 | Гость → вход (#f8756c) | гость → /children, /children/new, /settings, /privacy/data-request | редирект на /sign-in, «כניסה» видна, зоны родителя нет |

Источник SA-08…SA-10: бриф `.qa/research/f8756c.md` (повторная проверка 05.11, п.7 «регресс гостем»), тикет #f8756c прошёл 05.11. Без паролей и без отправки валидной формы. Не автоматизировано: «לפחות 8 תווים» и нейтральная ошибка входа (нужен ввод пароля).
