# UT-02: Admin-dispatcher видит Activity & usage своей компании
- Фича/экран: Reports → «Activity & usage» (/reports/usage)
- Тикеты: #04d347
- Роль/аккаунт: dispatcher — «tetet», Admin-dispatcher только в компании «test» (.qa/auth/dispatcher.json)
- Устройство: desktop 1440×900, EN
- Тип: доступ, только просмотр
- Предусловия: компания «test».
## Шаги
1. Войти диспетчером, открыть /reports/usage напрямую (и через Reports).
## Ожидаемо
- Экран открывается (нет «אין לך גישה» / «no access»), в шапке компания «test», роль «Admin-dispatcher».
- Те же 7 счётчиков с числами, «By person» с email владельца; rpc usage_summary — 200.
(источник: комментарий программиста — доступ владелец, אדמין-מוקדן, מנהל-תפעול; DoD «גישה למנהל/בעלים, מסוננת לעסק». Расширение доступа на אדמין-מוקדן принято при сдаче 18.10)
## История
- 2026-10-18 · ✅ · #04d347 (скрин 04d347-usage-direct-dispatcher-desktop.png)
