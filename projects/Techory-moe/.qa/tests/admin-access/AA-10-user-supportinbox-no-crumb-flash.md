# AA-10: Обычный пользователь на /supportinbox — ни на миг нет «SupportInbox» в крошках (EN, HE)
- Фича/экран: Support Console (/supportinbox) — доступ, хлебные крошки
- Тикеты: #26087e6e (связаны #09773471, AA-01/AA-02)
- Роль/аккаунт: user «בדיקה», .qa/auth/user.json
- Устройство: desktop 1440×900
- Тип: негатив (доступ, мелькание)
- Предусловия: язык EN, затем HE (`localStorage['preferred-language']`); запись кадров с первого кадра (MutationObserver + requestAnimationFrame): текст крошек (контейнер со span «Workspace» / «סביבת עבודה»), document.title, body.innerText
## Шаги
1. Открыть /supportinbox напрямую.
## Ожидаемо
- URL → /dashboard.
- На всём пути ни одно записанное значение (крошки, заголовок вкладки, текст страницы) не содержит «SupportInbox», «AdminPanel», «Support Console», «Admin Panel», «ממשק תמיכה», «פאנל ניהול».
- Итоговые крошки: EN «Workspace / Home», HE «סביבת עבודה / בית».
(источник: «מה רצוי» реджекта #26087e6e — сразу после редиректа «Workspace / Home» («סביבת עבודה / בית») без названия консоли/админки даже на миг; комментарий программиста — для admin/Support ничего не изменилось)
## История
- 2026-10-14 · ✅ · #26087e6e (.qa/screenshots/26087e6e-T1-supportinbox-*-desktop-*.png, 26087e6e-v-user-*-supportinbox-*.png)
