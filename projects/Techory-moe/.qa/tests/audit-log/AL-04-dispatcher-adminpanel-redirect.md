# AL-04: Admin-dispatcher на /adminpanel — сразу на /dashboard
- Фича/экран: Admin Panel (/adminpanel) — доступ
- Тикеты: #fc4fa4, #12126fac
- Роль/аккаунт: dispatcher (gesaday533@bwingmedia.com, Admin-dispatcher в компании test)
- Устройство: desktop 1440×900
- Тип: негатив (доступ)
- Предусловия: язык EN. Для обычного пользователя — AA-06 (HE) и AP-07 (EN).
## Шаги
1. Открыть /dashboard — посмотреть боковое меню.
2. Открыть /adminpanel напрямую.
## Ожидаемо
- Шаг 1: в меню нет «Admin Panel».
- Шаг 2: URL → /dashboard; нет «Access Denied»; нет вкладок Users / Plans / Coupons / Funnel / Audit log.
(источник: AC2 «תפקיד שאינו סופר-אדמין אינו רואה את המסכים»; решение владельца 07.10 — редирект на /dashboard без «Access Denied»)
## История
- 2026-11-12 · ✅ · #fc4fa4 (dc0451ee552ed1b25afc4fa4), повторная проверка после реджекта 2 (.qa/screenshots/fc4fa4-v2-disp-adminpanel-redirect-desktop.png)
