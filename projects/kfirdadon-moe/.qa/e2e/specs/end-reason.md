<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: причина окончания и фактическая длительность в отчёте (#d65b5b)

> Записан autotest-writer вручную: ожидаемые значения берутся из ответов API (get_candidate_report, get_attempt_audit_trail); коды причин и длительности из записанных звонков проверяются как «данные не менялись». Не запускалось (только `--list`). Только чтение, десктоп.

### 1. Менеджер — шапка отчёта
**Seed:** `tests/seed.business.spec.ts`

#### 1.1 «סיבת סיום» и «משך» для QA-C2-2110-D2 (2:17), QA-PHONE-17fdd9-2210 (5:36), QA-C7-2110-D3 (0:52), QA-C4-2110-D2 (5:15), QA-G4-A-1321 (2:53) @desktop @prod-safe (#d65b5b)
Файл: tests/report-analysis/end-reason-duration-d65b5b.spec.ts
**Device:** desktop
**Users:** bizt
**Steps:**
1. Кандидат по имени, get_candidate_report.
2. Открыть отчёт, report-meta.
**Expected:**
- «סיבת סיום» = текст по end_reason; «משך» = «m:ss דק׳» из duration_seconds (источник: AC5). Пять тестов — по одному на причину.

### 2. Super Admin — «מסלול ביקורת»
**Seed:** `tests/seed.admin.spec.ts`

#### 2.1 «סיבת סיום» / «משך בפועל» в панели = данным попытки (те же 5 кандидатов) @desktop @prod-safe (#d65b5b)
Файл: tests/admin-support/end-reason-audit-d65b5b.spec.ts
**Device:** desktop
**Users:** admin
**Steps:**
1. «מסלול ביקורת» кандидата.
2. Строки audit-end reason/duration в колонке текущего приглашения.
**Expected:**
- Значения равны данным официальной завершённой попытки из API (источник: AC5).

#### 2.2 QA-534912-2110-AC2 (ссылка без попытки): «—» в обеих строках @desktop @prod-safe (#d65b5b)
Файл: tests/admin-support/end-reason-audit-d65b5b.spec.ts
**Device:** desktop
**Users:** admin
**Steps:**
1. «מסלול ביקורת».
**Expected:**
- «—» в «סיבת סיום» и «משך בפועל».

**Не автоматизировано:** AC1–AC4 (поведение клиента в звонке — только живой звонок, проверено 21.10/04.11); сами причины technical_failure/scenario_natural_end (нет подходящего кандидата в данных на 17.11).
