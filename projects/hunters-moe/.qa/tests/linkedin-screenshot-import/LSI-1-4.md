# LSI-1-4: Сводка импорта содержит «כותרת התפקיד»
- Фича/экран: Edit Profile → «פרטים אישיים» (/profile?edit=personal), блок «ייבוא מצילום מסך של LinkedIn»
- Тикеты: #8fc7be
- Роль/аккаунт: talent (demo-talent-1, .qa/auth/talent.json); проверено 15.11 на demo-talent-2 / demo-talent-1
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: сессия talent. Ничего не сохранять — закрыть окно без «שמירה». Файлы: .qa/research/8fc7be/ (li-mock-1.png — «Dana Levi QA0711», neg-1.gif, neg-big-6mb.png)
## Шаги
1. Импорт li-mock-1.png.
2. Прокрутить сводку вниз.
## Ожидаемо
- Строка «כותרת התפקיד:» = Senior Backend Developer at Wix (часть после «|» может отсутствовать) с «להשתמש בזה». (реджект rej_609567e7, п.3)
## История
- 2026-11-15 · ✅ · #8fc7be (прошёл, проведён пользователем; автотест: .qa/e2e/specs/linkedin-screenshot-import.md §1.4)
