# AA-06: Обычный пользователь на /adminpanel сразу попадает на /dashboard (HE)
- Фича/экран: Admin Panel (/adminpanel) — доступ
- Тикеты: #12126fac, #fc4fa4
- Роль/аккаунт: user «בדיקה», .qa/auth/user.json
- Устройство: desktop 1440×900
- Тип: негатив (доступ)
- Предусловия: язык HE. EN-вариант — AP-07 (`.qa/tests/admin-plans/`).
## Шаги
1. Открыть /adminpanel напрямую.
## Ожидаемо
- URL → /dashboard; нет «אין גישה» и «Access Denied»; нет вкладок «חבילות» / Users / Plans / Funnel.
- Крошки на пути редиректа (#26087e6e, исправлен 14.10) — проверяются в AA-11.
(источник: реджект #12126fac 07.10 и решение владельца 07.10 — админ-панели для обычного пользователя «нет», редирект на /dashboard)
## История
- 2026-10-08 · ✅ · #12126fac (.qa/screenshots/12126fac/2026-10-08/2-user-he-adminpanel-desktop.png)
- 2026-11-12 · ✅ · #fc4fa4 — user на /adminpanel → /dashboard (повторно; .qa/screenshots/fc4fa4-v2-user-adminpanel-redirect-desktop.png). Admin-dispatcher — кейс .qa/tests/audit-log/AL-04.
