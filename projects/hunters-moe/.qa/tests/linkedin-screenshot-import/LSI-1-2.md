# LSI-1-2: Импорт через «בחירת תמונה» заполняет «כמה מילים עליכם» и ссылку LinkedIn, показывает сводку
- Фича/экран: Edit Profile → «פרטים אישיים» (/profile?edit=personal), блок «ייבוא מצילום מסך של LinkedIn»
- Тикеты: #8fc7be
- Роль/аккаунт: talent (demo-talent-1, .qa/auth/talent.json); проверено 15.11 на demo-talent-2 / demo-talent-1
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: сессия talent. Ничего не сохранять — закрыть окно без «שמירה». Файлы: .qa/research/8fc7be/ (li-mock-1.png — «Dana Levi QA0711», neg-1.gif, neg-big-6mb.png)
## Шаги
1. Запомнить «כמה מילים עליכם» и поле LinkedIn.
2. «בחירת תמונה» → li-mock-1.png.
3. Дождаться сводки «יובא מצילום המסך של LinkedIn».
## Ожидаемо
- Сводка появилась; кнопка стала «בחירת תמונה נוספת».
- Пустое поле заполнено из скрина (About: «Backend developer with 8 years…», LinkedIn: linkedin.com/in/dana-levi-qa0711); заполненное — не тронуто, а значение со скрина в сводке с «להשתמש בזה». (AC3, AC4)
- Поля редактируемы. (AC5)
## История
- 2026-11-15 · ✅ · #8fc7be (прошёл, проведён пользователем; автотест: .qa/e2e/specs/linkedin-screenshot-import.md §1.2)
