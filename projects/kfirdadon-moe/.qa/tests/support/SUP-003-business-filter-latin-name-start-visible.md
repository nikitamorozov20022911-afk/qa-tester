<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# SUP-003: /admin/support, фильтр «בית עסק» — длинное латинское имя видно с начала, обрезка в конце
- Фича/экран: «תמיכה ותפעול» /admin/support — фильтр «בית עסק» (select name=business)
- Тикеты: #9fd7c0e365af109a3e7787c2 (#7787c2)
- Роль/аккаунт: admin
- Устройство: desktop 1440×900
- Тип: визуал (только чтение, prod-safe; выбор фильтра данные не меняет)
- Предусловия: есть бизнес с длинным латинским именем «QA-N14 International Holdings Limited Group» и короткий латинский «QA Test Business A».
## Шаги
1. admin → /admin/support при 1440×900.
2. В «בית עסק» выбрать «QA-N14 International Holdings Limited Group».
3. Замерить: computed direction, text-overflow, ширину текста (canvas measureText шрифтом поля) и доступную ширину (clientWidth − padding).
4. Выбрать «QA Test Business A» — то же.
## Ожидаемо
- Длинное латинское: direction ltr (текст начинается слева — начало имени видно), ширина текста > доступной, text-overflow: ellipsis — «…» в конце (видно «QA-N14 International Holdings Limited …») (источник: AC «תחילת שם העסק נראית תמיד, גם בשם לטיני ארוך; אם צריך לקצר, החיתוך בסוף השם»).
- Короткое латинское: ltr, помещается целиком (ширина текста ≤ доступной).
## История
- 2026-10-14 · ✅ · #7787c2 (1440: ltr, 327 px > 306–308 px, ellipsis; 375 — то же, но автотест только десктоп по L-20261014-5)
- 2026-10-14 · עבר QA · автотест e2e/tests/admin-support/business-filter-latin-name.spec.ts
