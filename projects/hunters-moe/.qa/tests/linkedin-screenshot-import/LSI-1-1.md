# LSI-1-1: Блок импорта из скриншота LinkedIn есть в Edit Profile
- Фича/экран: Edit Profile → «פרטים אישיים» (/profile?edit=personal), блок «ייבוא מצילום מסך של LinkedIn»
- Тикеты: #8fc7be
- Роль/аккаунт: talent (demo-talent-1, .qa/auth/talent.json); проверено 15.11 на demo-talent-2 / demo-talent-1
- Устройство: desktop 1440×900
- Тип: позитив
- Предусловия: сессия talent. Ничего не сохранять — закрыть окно без «שמירה». Файлы: .qa/research/8fc7be/ (li-mock-1.png — «Dana Levi QA0711», neg-1.gif, neg-big-6mb.png)
## Шаги
1. Открыть /profile?edit=personal, вкладка «פרטים אישיים».
2. Найти заголовок «ייבוא מצילום מסך של LinkedIn» под блоком PDF.
## Ожидаемо
- Заголовок виден под «ייבוא מקובץ PDF של LinkedIn»; зона «הדביקו כאן צילום מסך (Ctrl+V) או גררו תמונה לכאן», кнопка «בחירת תמונה», подсказка «PNG, JPG או WebP, עד 5MB לתמונה, עד 4 תמונות בכל פעם». (AC1)
## История
- 2026-11-15 · ✅ · #8fc7be (прошёл, проведён пользователем; автотест: .qa/e2e/specs/linkedin-screenshot-import.md §1.1)
