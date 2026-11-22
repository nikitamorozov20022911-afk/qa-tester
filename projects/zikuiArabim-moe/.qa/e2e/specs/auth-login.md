<!-- Plan: auth-login. Source cases: .qa/tests/auth-login/AL-01..AL-03. -->
<!-- Автотестов в плане нет: ни один кейс не имеет «✅ · backfill» в Истории. Все три — РУЧНЫЕ: -->
<!-- AL-01 (.qa/tests/auth-login/AL-01-phone-login-otp.md, #6a86f7ec) — ⚠️ частично: шаги 4–6 требуют «שילחו קוד אימות» и ввода OTP (отправка кода и ввод OTP — ручные). -->
<!-- AL-02 (.qa/tests/auth-login/AL-02-no-progressbar-before-register.md, #6a9fd44e) — ⚠️ частично: экран кода (шаг 3) открывается только после отправки кода — ручной. -->
<!-- AL-03 (.qa/tests/auth-login/AL-03-relogin-after-logout.md, #6aa268eb) — ⚠️ не проверено: нужен «התנתקות» (выход) и повторный ввод OTP — ручной. -->
<!-- Части AL-01 шаги 1–3 и AL-02 шаги 1, 2, 4 покрыты тестами splash (SP-01: клик «בואו נתחיל» → /phone) и registration (RG-01, RG-02: progressbar на /register). -->
