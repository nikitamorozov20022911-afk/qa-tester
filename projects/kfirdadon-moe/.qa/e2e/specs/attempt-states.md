<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: состояния попытки и отчёта (сброс, практика, брошенная попытка)

> Записан autotest-writer вручную: проверки по УЖЕ существующим QA-данным через RPC от имени сохранённых сессий
> (admin_list_support_status — admin, list_candidates — business). Новых сбросов и звонков тест не делает → @prod-safe.

### 1. Попытка и отчёт после сброса, практики и закрытия брошенной попытки (#c9d61e)
**Seed:** `tests/seed.admin.spec.ts` (1.1, 1.2), `tests/seed.business.spec.ts` (1.3, 1.4)

#### 1.1 у всех сброшенных попыток report_status null или cancelled; QA-r100b-K3-1645 и QA-G4b-K1-1357 — reset/cancelled @desktop @prod-safe (#c9d61e · #d7d5078e6b85ee996fc9d61e)
**Device:** desktop
**Users:** admin
**Steps:**
1. /admin/support → rpc admin_list_support_status (p_since 2026-09-01).
**Expected:**
- attempt_status=reset → report_status ∈ {null, cancelled} (AC «אינו ממתין לעיבוד»; F-39 треб.7).
- K3 (сброс 21.10) и K1 (отчёт был готов до сброса): reset + cancelled, нет reset + ready (решение пользователя 14.10).

#### 1.2 у всех практик transcription_status = not_applicable @desktop @prod-safe (#c9d61e · #d7d5078e6b85ee996fc9d61e)
**Device:** desktop
**Users:** admin
**Expected:** attempt_type=practice → not_applicable (AC «ניסיון תרגול אינו ממתין לתמלול»).

#### 1.3 QA-r100b-K3-1645: отчёт «הניסיון הקודם אופס… ולכן הדוח שלו בוטל», строка «נדרש ניסיון חדש» @desktop @prod-safe (#c9d61e · #d7d5078e6b85ee996fc9d61e)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. list_candidates → кандидат, attempt = null.
2. /candidates/<id>/report; /candidates?q=<имя>.
**Expected:**
- Текст /הניסיון הקודם אופס.*ולכן הדוח שלו בוטל/, report-summary нет.
- td[data-label=ביצוע] — «נדרש ניסיון חדש» (после 23.10.2026 ссылка истекает → «פג תוקף»).

#### 1.4 QA-r100a-AB-1642: duration_seconds брошенной попытки ≤ 120 при закрытии через ~47 мин @desktop @prod-safe (#c9d61e · #d7d5078e6b85ee996fc9d61e)
**Device:** desktop
**Users:** business (testim)
**Expected:** status technical_failure; ended_at − created_at > 600 с; 0 < duration_seconds ≤ 120 (было бы ≈2800) (AC «משך ניסיון נטוש…»).
**File:** tests/attempt-states/reset-practice-abandoned.spec.ts · кейсы ATT-001, ATT-002, ATT-003, ATT-004

### 2. Сброс без права у מנהל מגייס — к кому обращаться (#b97be8)
> Записан autotest-writer вручную (запасной путь) 04.11.2026 по проверке 04.11 (скрины 031940-reset-icon-tooltip-user,
> 031940-reset-click-msg-user, b97be8-card-contact-user). Только чтение: reset_attempt перехватывается и обрывается → @prod-safe.
**Seed:** `tests/seed.user.spec.ts` (2.1, 2.2), `tests/seed.business.spec.ts` (2.3)

#### 2.1 user: карточка кандидата в «תקלה טכנית» — «לאיפוס הניסיון יש לפנות למנהל/ת החשבון העסקי», без «מרשימת המועמדים», без кнопки сброса @desktop @prod-safe (#b97be8 · #fd1450c92289332773b97be8)
**Device:** desktop
**Users:** user
**Steps:**
1. list_candidates (сессия user) → QA-кандидат с попыткой technical_failure (QA_TECHFAIL_CANDIDATE, по умолчанию QA-da072b-2110-D).
2. /candidates/<id>/report.
**Expected:**
- «לא הופק דוח לשיחה הזו. לאיפוס הניסיון יש לפנות למנהל/ת החשבון העסקי» (источник: «מה רצוי» — «מוצג למי לפנות»).
- Нет «מרשימת המועמדים», нет кнопки «איפוס ניסיון» (источник: «מה רצוי» — фраза про список только с правом сброса).

#### 2.2 user: /candidates — значок сброса aria-disabled + подсказка; клик → «האיפוס אינו בהרשאתך», без диалога и запроса; попытка не сброшена @desktop @prod-safe (#b97be8 · #fd1450c92289332773b97be8)
**Device:** desktop
**Users:** user
**Steps:**
1. /candidates?q=<имя>; значок «איפוס ניסיון» в строке → наведение → клик.
**Expected:**
- aria-disabled="true"; подсказка содержит «לאיפוס הניסיון יש לפנות למנהל/ת החשבון העסקי» (источник: AC5 #031940).
- После клика — «האיפוס אינו בהרשאתך» + к кому обращаться; окна с «סיבת האיפוס» нет; reset_attempt не вызывался; попытка technical_failure (AC5 «הפעולה נחסמת»).

#### 2.3 business (контроль): кнопка «איפוס ניסיון» в карточке и активный значок в строке @desktop @prod-safe (#b97be8 · #fd1450c92289332773b97be8)
**Device:** desktop
**Users:** business
**Steps:**
1. Тот же кандидат: /candidates/<id>/report, затем строка в /candidates (ничего не нажимается).
**Expected:**
- Кнопка «איפוס ניסיון» в карточке; значок в строке без aria-disabled (источник: замечание тикета + комментарий программиста 02.11).
**File:** tests/attempt-states/reset-permission-user-b97be8.spec.ts (общий код — tests/attempt-states/reset-support.ts)

### 3. Окно «איפוס ניסיון» — этап, обязательная причина, исключительный сброс (#031940)
> Записан autotest-writer вручную 04.11.2026. Реальный сброс НЕ выполняется (только валидация и «חזרה»); reset_attempt
> перехватывается и обрывается → @prod-safe. Скрины 031940-reset-noreason-error-business, 031940-exc-reset-nocheck-business.
**Seed:** `tests/seed.business.spec.ts`

#### 3.1 тех. сбой: окно с «השלב האחרון שנרשם: …» и «ההקלטה החלקית והלוג הטכני נשמרים גם אחרי האיפוס.»; без причины — «יש לתעד את סיבת האיפוס»; «חזרה» @desktop @prod-safe (#031940 · #6a993d6e847b25e5b0031940)
**Device:** desktop
**Users:** business
**Steps:**
1. QA-кандидат technical_failure (QA_RESET_TECHFAIL_CANDIDATE, по умолчанию QA-da072b-2110-C) → строка /candidates → «איפוס ניסיון».
2. Дождаться ответа rpc get_attempt_audit_trail (блок этапа приходит с сервера).
3. «איפוס הניסיון» с пустой причиной → «חזרה».
**Expected:**
- «השלב האחרון שנרשם: <этап>» и «ההקלטה החלקית והלוג הטכני נשמרים גם אחרי האיפוס.» над полем «סיבת האיפוס» (источник: реджект 1, Figma 818:1447).
- «יש לתעד את סיבת האיפוס», окно остаётся, reset_attempt не вызывался (треб.3 «תיעוד חובה של סיבת האיפוס»).
- После «חזרה» окна нет, попытка technical_failure.

#### 3.2 завершённая официальная: причина есть, «אני מאשר/ת את האיפוס כאישור חריג» не отмечено → «איפוס ניסיון שהושלם דורש סימון כאישור חריג»; «חזרה» @desktop @prod-safe (#031940 · #6a993d6e847b25e5b0031940)
**Device:** desktop
**Users:** business
**Steps:**
1. QA-кандидат с завершённой официальной попыткой (QA_COMPLETED_CANDIDATE, по умолчанию QA-C8-2110-D3) → «איפוס ניסיון».
2. Причина «QA-AUTO-031940 …», галочку не отмечать → «איפוס הניסיון» → «חזרה».
**Expected:**
- В окне «הניסיון הרשמי הושלם…»; «איפוס ניסיון שהושלם דורש סימון כאישור חריג»; попытка completed (источник: AC4).
**File:** tests/attempt-states/reset-dialog-validation-031940.spec.ts
**Не автоматизировано:** AC1 (обрыв звонка → частичная запись/лог/статус — нужен звонок), AC3 и исключительный сброс с галочкой (необратимые), отметка «אופס כאישור חריג» в трассе SA (только после нового реального сброса).
