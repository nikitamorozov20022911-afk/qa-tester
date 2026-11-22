# RG-02: /register: чекбокс согласия с клавиатуры и aria прогресса
- Фича/экран: S-12
- Тикеты: #6a8edf78 · 0316c09cd8c4 «The consent checkbox is not operable by keyboard and never exposes aria-checked»; #6a98690c · a85a885383f1 «OnboardingProgress accessibilityValue never reaches the web DOM»
- Роль/аккаунт: гость
- Устройство: 390, 1440
- Тип: a11y · @prod-safe
## Предусловия
- Гость на /register.
## Шаги
1. Фокус на [role=checkbox] «אני מאשר את תנאי השימוש ואת מדיניות הפרטיות», прочитать aria-checked.
2. Space → aria-checked; Space ещё раз → aria-checked.
3. Прочитать aria-valuemin/max/now у [role=progressbar].
## Ожидаемо
- aria-checked: false → true → false (AC 0316c09cd8c4).
- progressbar: aria-valuemin=1, aria-valuemax=2, aria-valuenow=1 (AC1 a85a885383f1; 2 шага — комментарий в 83c659facb10).
- «שלח» неактивна, пока чекбокс не отмечен.
## История
- 2026-10-03 · ✅ · backfill (390 и 1440: false→true→false; progressbar 1/2/1; «שלח» aria-disabled=true).
