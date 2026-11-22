# AA-13: Admin — крошки «Support Console» и «Admin Panel» как раньше (EN, HE)
- Фича/экран: Support Console (/supportinbox), Admin Panel (/adminpanel) — хлебные крошки
- Тикеты: #26087e6e (регресс; связаны AA-05, AA-09)
- Роль/аккаунт: admin «Kirill · Admin», .qa/auth/admin.json
- Устройство: desktop 1440×900
- Тип: позитив (регресс)
- Предусловия: язык EN, затем HE
## Шаги
1. Открыть /supportinbox напрямую.
2. Открыть /adminpanel напрямую.
## Ожидаемо
- Шаг 1: URL остаётся /supportinbox (без редиректа); крошки EN «Workspace / Support Console», HE «סביבת עבודה / ממשק תמיכה».
- Шаг 2: URL остаётся /adminpanel; крошки EN «Workspace / Admin Panel», HE «סביבת עבודה / פאנל ניהול».
(источник: комментарий программиста #26087e6e — для admin и Support ничего не изменилось)
## История
- 2026-10-14 · ✅ · #26087e6e (.qa/screenshots/26087e6e-v-admin-*.png)
