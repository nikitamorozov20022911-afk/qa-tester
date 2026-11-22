<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# AIP-003: business / user → /admin/providers недоступен
- Фича/экран: AI-провайдеры, /admin/providers
- Тикеты: #c937f5ca1b172513b5ce1e2d
- Роль/аккаунт: business (pajemem729@…), user (nelit32958@…)
- Устройство: desktop 1440×900
- Тип: негатив
- Предусловия: нет
## Шаги
1. Под ролью открыть /admin/providers.
2. RPC admin_list_provider_configs с токеном роли.
## Ожидаемо
- h1 «אין לך הרשאה למסך הזה», формы «הגדרת ספק» нет.
- RPC → 403 forbidden.
## История
- 2026-10-04 · ✅ · #c937f5ca
- 2026-10-05 · עבר QA · автотест tests/ai-providers/access-denied.spec.ts
