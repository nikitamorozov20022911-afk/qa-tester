# LSI-3-2: РУЧНОЙ: Ctrl+V, drag-and-drop, 4 языка, 375px
- Фича/экран: Edit Profile → «פרטים אישיים» (/profile?edit=personal), блок «ייבוא מצילום מסך של LinkedIn»
- Тикеты: #8fc7be
- Роль/аккаунт: talent (demo-talent-1, .qa/auth/talent.json); проверено 15.11 на demo-talent-2 / demo-talent-1
- Устройство: desktop 1440×900
- Тип: визуал
- Предусловия: сессия talent. Ничего не сохранять — закрыть окно без «שמירה». Файлы: .qa/research/8fc7be/ (li-mock-1.png — «Dana Levi QA0711», neg-1.gif, neg-big-6mb.png)
## Шаги
1. Вставить скрин через Ctrl+V; перетащить файл в зону.
2. Переключить сайт на en / ru / ar; посмотреть блок.
3. Ширина 375: блок, «בחירת תמונה».
## Ожидаемо
- Ctrl+V и drag-and-drop запускают импорт как «בחירת תמונה». (AC1)
- Тексты блока и ошибок переведены, RTL/LTR корректны; на 375 блок помещается. (правило проекта: 4 языка)
- Скриншоты: .qa/screenshots/8fc7be-paste-desktop.png, 8fc7be-drop-desktop.png, 8fc7be-block-mobile.png, 2026-11-15/8fc7be-reg-block-{en,ru,ar}-desktop.png
## История
- 2026-11-15 · ✅ · #8fc7be (прошёл, проведён пользователем; автотест: .qa/e2e/specs/linkedin-screenshot-import.md §3.2, ручной)
