<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: AI-провайдеры (/admin/providers)

> Тесты записаны autotest-writer вручную (не генератором): нужен уникальный код языка на каждый прогон
> (конфигурации неудаляемы), генератор записал бы фиксированный код. Файлы: tests/ai-providers/*.spec.ts.

### 1. AI-провайдеры — версии конфигурации
**Seed:** `tests/seed.admin.spec.ts`

#### 1.1 первая конфигурация для языка без конфигураций — без «הגרסה הקודמת נשמרה» @desktop @data (#c937f5ca1b172513b5ce1e2d)
**Device:** desktop
**Users:** admin
**Steps:**
1. Открыть /admin/providers; из ответа admin_list_provider_configs выбрать код q[a-t][a-z], которого нет ни в одной конфигурации (he/en/ar/ru запрещены).
2. «הגדרת ספק»: יכולת «תמלול», שפה = код, מזהה הספק soniox, מזהה המודל stt-async-v5, הגדרות {"qa":"QA-AUTO-<stamp>-v1"}.
3. «שמירת גרסה חדשה».
**Expected:**
- admin_set_provider_config 200; «נשמרה גרסה חדשה» + «תמלול ב<код>: soniox · stt-async-v5.» без «הגרסה הקודמת נשמרה» (источник: «מה רצוי»).
- История: 1 строка «תמלול · <код>» פעילה.

#### 1.2 повторное сохранение той же יכולת+שפה — с «הגרסה הקודמת נשמרה» @desktop @data (#c937f5ca1b172513b5ce1e2d)
**Device:** desktop
**Users:** admin
**Steps:**
1. «עריכה של תמלול ב<код>» (тот же код из 1.1, serial).
2. הגדרות {"qa":"QA-AUTO-<stamp>-v2"} → «שמירת גרסה חדשה».
**Expected:**
- «… הגרסה הקודמת נשמרה בהיסטוריה.» (источник: «מה רצוי»).
- История «תמלול · <код>»: פעילה + הוחלפה, admin@admin.com (AC F-38).

### 2. AI-провайдеры — доступ
**Seed:** `tests/seed.business.spec.ts` / `tests/seed.user.spec.ts`

#### 2.1 business / user: «אין לך הרשאה למסך הזה», RPC 403 @desktop @prod-safe (#c937f5ca1b172513b5ce1e2d)
**Device:** desktop
**Users:** business; user (отдельные тесты)
**Steps:**
1. Открыть /admin/providers.
2. RPC admin_list_provider_configs с токеном роли.
**Expected:**
- h1 «אין לך הרשאה למסך הזה», нет формы «הגדרת ספק»; RPC 403 forbidden.

### 3. AI-провайдеры — исполнитель версии и неизвестная модель (#e8e2be) (записано autotest-writer вручную 04.11, тесты не запускались)
**Seed:** `tests/seed.admin.spec.ts` (в файле: storageState auth/admin.json)
Файл: tests/ai-providers/executor-and-unknown-model-e8e2be.spec.ts. Версии НЕ сохраняются; на случай регресса — свободный код языка q?? (he/en/ar/ru запрещены).
Ручная часть 04.11 «сохранить валидную версию → исполнитель admin@admin.com» уже покрыта 1.2 (first-config-message.spec.ts) — не дублируется.

#### 3.1 AC5: в «היסטוריית גרסאות» у каждой версии есть исполнитель, «—» нет @desktop @prod-safe (#e8e2be · #6a993d6db539691958e8e2be)
**Device:** desktop
**Users:** admin
**Steps:**
1. /admin/providers, 1440.
2. Пройти все строки «היסטוריית גרסאות»; колонка «נשמרה».
**Expected:**
- Ни одной ячейки «—»; в «נשמרה» email или «שירות המערכת (מפתח שירות)» / «SQL ישיר · <role>» / «לא נרשם (נשמרה לפני תיעוד המבצע)»; версии 18.10.2026 — с email (источник: AC5 F-38 «נשמרים מבצע השינוי ומועדו»; реджект rej_58fb12fb).
- В «ספקים פעילים» «—» нет.

#### 3.2 FL-39: неизвестная модель в форме → ошибка у «מזהה המודל», запрос сохранения не уходит @desktop (#e8e2be · #6a993d6db539691958e8e2be)
**Device:** desktop
**Users:** admin
**Steps:**
1. «הגדרת ספק»: יכולת «תמלול», שפה q??, ספק openai, модель «qa-auto-e8e2be-<stamp>-nonexistent» → «שמירת גרסה חדשה».
**Expected:**
- Под полем «המודל «…» אינו מוכר בשרת עבור הספק «openai»… מודלים זמינים: …» (источник: FL-39 «שינוי תצורה שאינו תקין נחסם לפני השמירה»).
- Нет POST admin_set_provider_config / save-provider-config; нет «נשמרה גרסה חדשה»; конфигураций для q?? нет.

#### 3.3 FL-39 сервер: admin_set_provider_config с неизвестной моделью → 400 unknown_model @desktop (#e8e2be · #6a993d6db539691958e8e2be)
**Device:** desktop
**Users:** admin
**Steps:**
1. RPC admin_set_provider_config(transcription, q??, soniox, qa-auto-…-nonexistent, {}) токеном сессии.
**Expected:**
- 400, тело содержит unknown_model; версия для q?? не появилась (источник: ответ программиста 02.11 / факт 04.11).
