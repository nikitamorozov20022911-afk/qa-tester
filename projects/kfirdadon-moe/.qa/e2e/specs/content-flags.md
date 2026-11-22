<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: отметка оскорбительного контента в записи попытки (#ece93f)

> Записан autotest-writer вручную: проверки против ответов API (get_candidate_report, get_attempt_audit_trail). Не запускалось (только `--list`). Только чтение; допустимая причина доступа SA не отправляется. Новых звонков нет. Только десктоп.

### 1. Менеджер — шапка отчёта
**Seed:** `tests/seed.business.spec.ts`

#### 1.1 QA-CALL1-0411 / QA-C10-2110-D3: баннер «בשיחה סומנה אמירה פוגענית של המועמד · 01:13 / 00:35» = content_flags API @desktop @prod-safe (#ece93f)
Файл: tests/report-analysis/content-flags-banner-ece93f.spec.ts
**Device:** desktop
**Users:** bizt
**Steps:**
1. Кандидат по имени, get_candidate_report.
2. /candidates/<id>/report.
**Expected:**
- report-content-flags: тип и время как в API (источник: AC5).

#### 1.2 у кандидата без отметок баннера нет @desktop @prod-safe (#ece93f)
Файл: tests/report-analysis/content-flags-banner-ece93f.spec.ts
**Device:** desktop
**Users:** bizt
**Steps:**
1. Подобрать кандидата с готовым отчётом и пустым content_flags по API.
2. Открыть отчёт.
**Expected:**
- Нет report-content-flags (источник: AC5).

### 2. Super Admin — панель и доступ
**Seed:** `tests/seed.admin.spec.ts`

#### 2.1 «מסלול ביקורת» → «אמירות שסומנו בשיחה» = API (QA-CALL1-0411, QA-C10-2110-D3) @desktop @prod-safe (#ece93f)
Файл: tests/admin-support/content-flags-ece93f.spec.ts
**Device:** desktop
**Users:** admin
**Steps:**
1. «מסלול ביקורת» кандидата.
**Expected:**
- Пункты audit-content-flag: тип, «ניסיון N», mm:ss как в API (источник: AC5).

#### 2.2 QA-PHONE-17fdd9-0411-C без отметок: «לא סומנו אמירות פוגעניות בשיחות.» @desktop @prod-safe (#ece93f)
Файл: tests/admin-support/content-flags-ece93f.spec.ts
**Device:** desktop
**Users:** admin
**Steps:**
1. «מסלול ביקורת».
**Expected:**
- Нет audit-content-flag, есть текст пустого состояния.

#### 2.3 get_candidate_report у SA без причины → 400 reason_required; неверная → 400 invalid_reason @desktop @prod-safe (#ece93f)
Файл: tests/admin-support/content-flags-ece93f.spec.ts
**Device:** desktop (API)
**Users:** admin
**Steps:**
1. rpc без p_reason.
2. rpc с p_reason = qa-not-a-reason.
**Expected:**
- 400 reason_required; 400 invalid_reason (источник: D-25).

#### 2.4 диалог «צפייה בתוכן» без причины: «יש לבחור את סיבת הגישה לתוכן» @desktop @prod-safe (#ece93f)
Файл: tests/admin-support/content-flags-ece93f.spec.ts
**Device:** desktop
**Users:** admin
**Steps:**
1. Меню строки → «צפייה בתוכן».
2. Подтвердить без причины; «ביטול».
**Expected:**
- Ошибка; адрес без ?reason=; окно закрывается.

**Не автоматизировано:** AC1–AC4 и R7 (поведение голосового клиента — только живой звонок, проверено 13.10/21.10); R13 (условия сценария — решение пользователя «не реджект»); просмотр контента с допустимой причиной (пишет запись в журнал доступа).
