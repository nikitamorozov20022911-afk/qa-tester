<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# BSET-003: менеджер не видит и не меняет чужой бизнес (RLS)
- Фича/экран: API businesses (Supabase REST) из сессии business
- Тикеты: #ebdb2f (6a993d7890d7492f45ebdb2f)
- Роль/аккаунт: business (testim)
- Устройство: desktop 1440×900
- Тип: негатив / безопасность
- Предусловия: чужой бизнес QA-PILOT-1410, id b0d2a797-4d78-4a74-83d1-c0c1bfc8a6a9.
## Шаги
1. GET businesses?select=id (без фильтра) → одна своя строка.
2. GET businesses?id=eq.<чужой>.
3. PATCH businesses?id=eq.<чужой>&select=id с телом {name: «QA-PILOT-1410»} (его же имя — даже при утечке данные не меняются).
## Ожидаемо
- Шаг 2: 200 []. Шаг 3: 200 [] — 0 строк (источник: треб. F-10 «רק העסק שלו», факт 22.10).
## История
- 2026-10-22 · ✅ · #ebdb2f
- 2026-10-22 · עבר QA · автотест e2e/tests/business-settings/settings-business-ebdb2f.spec.ts (не запускался)
