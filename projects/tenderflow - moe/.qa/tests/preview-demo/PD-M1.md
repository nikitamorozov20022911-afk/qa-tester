<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# PD-M1: 390: нет горизонтальной прокрутки на Preview
- Фича/экран: preview-demo — Preview демо-среда (вход, фид, тендер, профиль)
- Тикеты: #343d8d
- Роль/аккаунт: guest → демо-вход «כניסה לסביבת ההדגמה» (без пароля)
- Устройство: mobile
- Тип: позитив, только чтение (@prod-safe)
- Предусловия: Preview https://tenderflow-web-staging-obpygl1k7-aviels-projects.vercel.app (env PREVIEW_URL); основной staging https://tenderflow-web-staging.vercel.app
- Автотест: .qa/e2e/tests/preview-demo/preview-demo.spec.ts
## Шаги
1. Ширина 390. Открыть /login, войти демо-кнопкой, фид, тендер, /onboarding.
## Ожидаемо
- На каждом экране scrollWidth ≤ clientWidth (нет горизонтальной прокрутки страницы).
## История
- 2026-11-18 · ✅ · #343d8d (Preview commit 6bc30e3; пользователь провёл עבר QA 18.11.2026)
