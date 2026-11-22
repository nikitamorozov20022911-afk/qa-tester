<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: сбой отчёта и перезапуск обработки (#bf7c47)

> Записан autotest-writer вручную (замеры getBoundingClientRect, поиск строк по имени/атрибутам, API-проверки) — генератор так не умеет. Ничего не запускалось (только `--list`).
> Только чтение: перезапуск обработки не нажимается и не вызывается; RPC-проверка — с нулевым UUID. Админка и экраны бизнеса — только десктоп.

### 1. Super Admin — окно «לוג טכני אחרון» (S-02, Figma 842:3057)
**Seed:** `tests/seed.admin.spec.ts`

#### 1.1 окно открывается без формы и без запуска обработки @desktop @prod-safe (#bf7c47)
Файл: tests/admin-support/rerun-log-dialog-bf7c47.spec.ts
**Device:** desktop (1440×900)
**Users:** admin
**Steps:**
1. /admin/support, «כל התאריכים».
2. Строка «לטיפול ידני» (QA-PHONE-17fdd9-0411-A / QA-C10-2110-D3 / QA-CALL1-0411) → ⋮ → «הפעלה מחדש של עיבוד».
**Expected:**
- Окно с баннером «כשל חוזר…», «לוג טכני אחרון», «סגירה», «העתקת הלוג»; нет поля «סיבת הפעולה»; rpc admin_rerun_report_processing не вызывался (источник: AC3).

#### 1.2 строка лога 500×20, LTR, формат «HH:MM:SS report-processing failed (attempt N of 2): …» @desktop @prod-safe (#bf7c47)
Файл: tests/admin-support/rerun-log-dialog-bf7c47.spec.ts
**Device:** desktop
**Users:** admin
**Steps:**
1. Открыть окно лога.
2. Замерить каждую support-log-line.
**Expected:**
- 500×20, dir=ltr, text-align left/start, формат со временем и «of 2» (источник: реджект rej_59813d3f п.1).

#### 1.3 кнопки «סגירה» 160×52, «העתקת הלוג» высота 52, зазор 16 @desktop @prod-safe (#bf7c47)
Файл: tests/admin-support/rerun-log-dialog-bf7c47.spec.ts
**Device:** desktop
**Users:** admin
**Steps:**
1. Открыть окно лога.
2. Замерить кнопки подвала.
**Expected:**
- 160×52; высота 52; зазор 16 (источник: реджект п.2–3).

#### 1.4 крестик 40×40, иконка 20×20 в (10,10), закрывает окно @desktop @prod-safe (#bf7c47)
Файл: tests/admin-support/rerun-log-dialog-bf7c47.spec.ts
**Device:** desktop
**Users:** admin
**Steps:**
1. Открыть окно лога.
2. Замерить dialog-close и иконку; нажать.
**Expected:**
- 40×40; иконка 20×20 со смещением 10,10; окно закрыто (источник: реджект п.4).

### 2. Права на перезапуск — сервер
**Seed:** `tests/seed.spec.ts`

#### 2.1 rpc admin_rerun_report_processing от recruiter и менеджера → 403 @desktop @prod-safe (#bf7c47)
Файл: tests/admin-support/rerun-permissions-bf7c47.spec.ts
**Device:** desktop (API)
**Users:** user-2 (recruiter), bizt
**Steps:**
1. Токен сессии из /candidates.
2. rpc с нулевым UUID.
**Expected:**
- 403 (источник: ד4).

### 3. Менеджер — отчёт в ошибке и список
**Seed:** `tests/seed.business.spec.ts`

#### 3.1 отчёт QA-CALL1-0411 / QA-C10-2110-D3 в ошибке: «שגיאה בהפקת דוח» + «פנייה לתמיכה», без перезапуска @desktop @prod-safe (#bf7c47)
Файл: tests/report-analysis/generation-error-manager-bf7c47.spec.ts
**Device:** desktop
**Users:** bizt
**Steps:**
1. Кандидат по имени, статус по API = generation_error.
2. /candidates/<id>/report.
**Expected:**
- report-error: «שגיאה בהפקת דוח», ссылка «פנייה לתמיכה» (mailto); нет управления перезапуском (источник: AC4, ד4).

#### 3.2 список ?status=generation_error: у строк «לדוח» и mailto, без перезапуска @desktop @prod-safe (#bf7c47)
Файл: tests/report-analysis/generation-error-manager-bf7c47.spec.ts
**Device:** desktop
**Users:** bizt
**Steps:**
1. /candidates?status=generation_error.
2. Действия в строках.
**Expected:**
- Нет кнопки перезапуска; у двух QA-строк ровно два действия: open-candidate-report и request-reprocessing (mailto) (источник: AC4).

**Не автоматизировано:** иконка «!» в круге (визуально); регресс × у других окон/ящиков; копирование лога (права буфера); AC5/ד5 «время отчёта в аудите после успешного перезапуска» и «attempt 2 of 2» на свежем сбое — требуют реального перезапуска обработки (запрещено в read-only тестах, проверено вручную 14.10/21.10/17.11); ד6 (метрика 85%) — только по доказательствам.
