# LSI-2-1: GIF отклоняется с понятной ошибкой
- Фича/экран: Edit Profile → «פרטים אישיים» (/profile?edit=personal), блок «ייבוא מצילום מסך של LinkedIn»
- Тикеты: #8fc7be
- Роль/аккаунт: talent (demo-talent-1, .qa/auth/talent.json); проверено 15.11 на demo-talent-2 / demo-talent-1
- Устройство: desktop 1440×900
- Тип: негатив
- Предусловия: сессия talent. Ничего не сохранять — закрыть окно без «שמירה». Файлы: .qa/research/8fc7be/ (li-mock-1.png — «Dana Levi QA0711», neg-1.gif, neg-big-6mb.png)
## Шаги
1. «בחירת תמונה» → neg-1.gif.
## Ожидаемо
- Тост «הקובץ אינו תמונה תקינה. אפשר להעלות צילום מסך מסוג PNG, JPG או WebP». Сводки нет, поля не изменились. (комментарий: PNG/JPG/WebP)
## История
- 2026-11-15 · ✅ · #8fc7be (прошёл, проведён пользователем; автотест: .qa/e2e/specs/linkedin-screenshot-import.md §2.1)
