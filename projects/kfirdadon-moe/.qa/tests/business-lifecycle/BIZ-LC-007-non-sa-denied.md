<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# BIZ-LC-007: не Super Admin — экраны управления бизнесами закрыты (403), данных нет
- Фича/экран: /admin/businesses, /admin/businesses/new, /admin/businesses/:id (F-01 AC4)
- Тикеты: #6a993d795019333734edc22d (#edc22d)
- Роль/аккаунт: business (מנהל/ת חשבון), user (מנהל/ת מגייס/ת)
- Устройство: desktop 1440×900
- Тип: негатив (только чтение)
- Предусловия: id чужого бизнеса берётся из admin_list_businesses под admin.
## Шаги
1. Под каждой ролью открыть три адреса.
2. От той же сессии вызвать admin_list_businesses, admin_get_business(<чужой id>), admin-create-business.
## Ожидаемо
- Экран «קוד 403», h1 «אין לכם גישה לעמוד הזה»; нет таблицы «רשימת בתי העסק», нет формы, нет имени чужого бизнеса (AC4 «הגישה נדחית ולא מוצג לו מידע על עסק כלשהו»).
- RPC → 403 {code 42501, forbidden}; admin-create-business → 403.
## История
- 2026-10-13 · ✅ · #edc22d
- 2026-10-14 · עבר QA · автотест tests/business-lifecycle/non-sa-denied.spec.ts
