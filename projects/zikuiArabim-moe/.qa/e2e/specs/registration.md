<!-- Plan: registration. Source cases: .qa/tests/registration/RG-01, RG-02. Tickets #6a967a00, #6a8edf78, #6a98690c. -->
<!-- РУЧНОЙ: RG-03 (.qa/tests/registration/RG-03-existing-number-blocked.md, #6a9fcde7) — ⚠️ не проверено: проверка срабатывает только по «שלח», а отправка формы регистрации — ручная. -->
<!-- Все тесты @prod-safe: гость, форма не отправляется («שלח» не нажимать). -->

### 5. Регистрация
**Seed:** `tests/seed.spec.ts`

#### 5.1 RG-01 «הצטרפו אלינו» на /phone открывает регистрацию #6a967a00 @prod-safe
**Device:** all (390 и 1440 — без пометки)
**Users:** guest
**Steps:**
1. Открыть `/` → «בואו נתחיל» → `/phone`.
2. Нажать «הצטרפו אלינו».
**Expected:**
- URL `/register`; заголовок «יצירת חשבון»; поля «שם מלא *», «אימייל *», «מספר טלפון *»; чекбокс согласия; кнопка «שלח» — экран регистрации, а не входа (источник: needed_behavior rej_1788681178061).

#### 5.2 RG-02 /register: чекбокс согласия с клавиатуры и aria прогресса #6a8edf78 #6a98690c @prod-safe
**Device:** all (390 и 1440 — без пометки)
**Users:** guest
**Steps:**
1. Открыть `/register`.
2. Фокус на `[role=checkbox]` «אני מאשר את תנאי השימוש ואת מדיניות הפרטיות», прочитать `aria-checked`.
3. Space → прочитать `aria-checked`; Space ещё раз → прочитать `aria-checked`.
4. Прочитать `aria-valuemin`/`aria-valuemax`/`aria-valuenow` у `[role=progressbar]`.
**Expected:**
- `aria-checked`: false → true → false (источник: AC 0316c09cd8c4).
- progressbar: `aria-valuemin=1`, `aria-valuemax=2`, `aria-valuenow=1` (источник: AC1 a85a885383f1; 2 шага — комментарий в 83c659facb10).
- «שלח» неактивна (`aria-disabled=true`), пока чекбокс не отмечен (источник: RG-02 «Ожидаемо»).
