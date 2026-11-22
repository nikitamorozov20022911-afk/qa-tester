# INV-07: /accept без token — «קישור ההזמנה אינו זמין»
- Фича/экран: invitations — /accept
- Тикеты: #83bf5b
- Роль/аккаунт: guest (без входа)
- Устройство: desktop 1440×900
- Тип: негатив
- Предусловия: нет; данных не создаёт (`@prod-safe`).
- Автотест: `.qa/e2e/tests/invitations/accept-from-server.spec.ts`
## Шаги
1. Открыть `/accept`.
2. Открыть `/accept?email=qa-auto-inv-spoof-…@example.com&name=QA-AUTO+Spoof&company=QA-AUTO+Other+Co&inviter=QA-AUTO+Inviter` (без token).
## Ожидаемо
- Заголовок «קישור ההזמנה אינו זמין», текст «קישור ההזמנה חסר או שגוי.»; нет «סיסמה חדשה» и «קבע סיסמה והיכנס»; параметры из адреса не показаны; запроса `auth/v1/signup` нет (источник: «מה רצוי» — данные только по токену; без токена приглашения нет).
- Скриншоты: `.qa/screenshots/2026-11-14/83bf5b-T4-no-token-desktop.png`, `83bf5b-T4-params-only-desktop.png`.
## История
- 2026-11-14 · ✅ · #83bf5b (Т4; пользователь провёл עבר QA 15.11)
