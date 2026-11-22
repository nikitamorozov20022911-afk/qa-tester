<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# BSET-006: מנהל/ת מגייס/ת — отказ в /settings/business
- Фича/экран: S-06 /settings/business
- Тикеты: #ebdb2f (6a993d7890d7492f45ebdb2f)
- Роль/аккаунт: user (מנהל/ת מגייס/ת testim, .qa/auth/user.json)
- Устройство: desktop 1440×900
- Тип: негатив / доступ
- Предусловия: нет.
## Шаги
1. Открыть /settings/business напрямую.
2. «חזרה לדשבורד».
## Ожидаемо
- «קוד 403» / «אין לכם גישה לעמוד הזה» и «…פנו למנהל החשבון בעסק שלכם.»; формы, языка, квоты нет; запроса настроек (businesses с contact_role / candidate_legal_text) нет; в меню нет «הגדרות»; кнопка ведёт на «/» (источник: AC4, FL-10 шаг 2).
## История
- 2026-10-22 · ✅ · #ebdb2f
- 2026-10-22 · עבר QA · автотест e2e/tests/business-settings/recruiter-denied-ebdb2f.spec.ts (не запускался)
