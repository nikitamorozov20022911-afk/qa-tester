<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: отчёт кандидата — причины «אין מספיק מידע» и домен возражения

> Записан autotest-writer вручную: проверки идут по ГОТОВЫМ отчётам QA-кандидатов (новых звонков нет, OpenAI не
> тратится), состояния читаются по data-testid/data-state. Только чтение → @prod-safe.

### 1. Отчёт — короткий звонок и молчание кандидата (#83178a)
**Seed:** `tests/seed.business.spec.ts`

#### 1.1 звонок 26 с (QA-57977a-27s-2110): «השיחה נקטעה בשניות הראשונות» в итоге, 4 доменах, 22 точках; «כמעט לא דיבר» нет @desktop @prod-safe (#83178a · #5e9c55c71c45aaa00f83178a)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. /candidates/<id>/report кандидата QA-57977a-27s-2110.
**Expected:**
- report-summary, 4 × domain-explanation, 22 × checkpoint-explanation содержат «השיחה נקטעה בשניות הראשונות»; «כמעט לא דיבר» нигде (AC1).

#### 1.2 звонок 45 с без речи (QA-83178a-silent-2110): «המועמד כמעט לא דיבר» везде, «נקטעה» нет @desktop @prod-safe (#83178a · #5e9c55c71c45aaa00f83178a)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. /candidates/<id>/report кандидата QA-83178a-silent-2110.
**Expected:**
- report-summary, 4 × domain-explanation, 22 × checkpoint-explanation содержат «המועמד כמעט לא דיבר»; «נקטעה» нигде (AC2).
**File:** tests/report-analysis/short-and-silent-call-reasons.spec.ts · кейсы REP-001, REP-002

### 2. Отчёт — домен «התמודדות עם ההתנגדות» (#4b397a)
**Seed:** `tests/seed.business.spec.ts`

#### 2.1 QA-4b397a-DISC-2110: одно состояние домена, 6 точек, точка скидки «לא הודגם בשיחה» с цитатой «רק תסגור איתי היום»; нет «פסילה», балла, «ציון» @desktop @prod-safe (#4b397a · #6a993d6b51347e00464b397a)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. Отчёт кандидата → section report-domain[data-domain=objection].
**Expected:**
- Один domain-state, непустое domain-explanation (AC1).
- 6 checkpoint с ключами identifying_objection … no_automatic_response_or_discount, у каждого состояние и объяснение (AC2).
- no_automatic_response_or_discount: data-state=not_demonstrated, «לא הודגם בשיחה», evidence-quote содержит «רק תסגור איתי היום» (AC3).
- Нет «פסיל/נפסל/ציון», нет «N/M» и процентов (AC3, FL-42).

#### 2.2 отчёт без возражения («QA-AUTO-REC-…-gipo»): домен «אין מספיק מידע להערכה», причина «ההתנגדות שהוגדרה בתרחיש לא עלתה בשיחה» @desktop @prod-safe (#4b397a · #6a993d6b51347e00464b397a)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. Отчёт кандидата (QA_NO_OBJECTION_CANDIDATE или имя …-gipo) → домен objection.
**Expected:**
- domain-state data-state=insufficient_information, текст «אין מספיק מידע להערכה»; domain-explanation содержит причину (AC4, треб. 5).
**File:** tests/report-analysis/objection-domain.spec.ts · кейсы REP-003, REP-004

### 3. Отчёт — текст «שגיאה בהפקת דוח» по состоянию транскрипта и записи (#0eafd1)
**Seed:** `tests/seed.business.spec.ts` (в файле: storageState auth/business.json)

> Записан autotest-writer вручную: состояние ошибки — подмена настоящего ответа get_candidate_report (route.fetch + fulfill),
> генератор так не умеет. Отчёт QA-N16-51da2a-2049 (env QA_0EAFD1_CANDIDATE). Только чтение → @prod-safe. Кейс REP-005.

#### 3.1 вариант A: упал только отчёт — «התמלול וההקלטה של השיחה נשמרו» @desktop @prod-safe (#0eafd1 · #db84adc6ceaedbdac00eafd1)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. route get_candidate_report → report.status = generation_error, analysis_ready_at = null; открыть отчёт.
**Expected:**
- report-error содержит «לא הצלחנו להפיק את הדוח של השיחה. התמלול וההקלטה של השיחה נשמרו, ואפשר לקרוא ולהאזין להם כאן.», нет «נכשל»/«לא הושלם»; заголовок «תמלול» виден; «פנייה לתמיכה» (מה רצוי #0eafd1).

#### 3.2 вариант B: транскрипт упал — «התמלול של השיחה נכשל, ולכן גם הדוח לא הופק» @desktop @prod-safe (#0eafd1 · #db84adc6ceaedbdac00eafd1)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. Подмена: generation_error, transcript_ready_at = null, attempt.transcription_status = failed, transcript = null.
**Expected:**
- «התמלול של השיחה נכשל, ולכן גם הדוח לא הופק. ההקלטה נשמרה ואפשר להאזין לה כאן.» (מה רצוי #0eafd1).

#### 3.3 вариант C: транскрипт не завершён — «והתמלול שלה לא הושלם» @desktop @prod-safe (#0eafd1 · #db84adc6ceaedbdac00eafd1)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. Подмена: как B, но transcription_status = null.
**Expected:**
- «לא הצלחנו להפיק את הדוח של השיחה, והתמלול שלה לא הושלם. ההקלטה נשמרה ואפשר להאזין לה כאן.» (מה רצוי #0eafd1).

#### 3.4 вариант D: нет записи — «התמלול של השיחה נשמר» @desktop @prod-safe (#0eafd1 · #db84adc6ceaedbdac00eafd1)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. Подмена: generation_error, analysis_ready_at = null, recording = null.
**Expected:**
- «לא הצלחנו להפיק את הדוח של השיחה. התמלול של השיחה נשמר, ואפשר לקרוא אותו כאן.»; заголовок «תמלול» виден (מה רצוי #0eafd1).
**File:** tests/report-analysis/generation-error-text-variants.spec.ts · кейс REP-005

### 4. Отчёт — домен «הובלת השיחה לצעד הבא» (#acbc41)
**Seed:** `tests/seed.business.spec.ts`

> По готовым отчётам QA-bf7c47-2110 и QA-4b397a-DISC-2110 (новых звонков нет). Только чтение → @prod-safe.

#### 4.1 QA-bf7c47-2110 (39 с, кандидат завершил): «אין מספיק מידע להערכה», причина «(המועמד סיים את השיחה)», «הצעד שהוגדר בסימולציה: פגישת ייעוץ» @desktop @prod-safe (#acbc41 · #6a993d6c479a31c9ebacbc41)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. Отчёт → report-domain[data-domain=next_step].
**Expected:**
- domain-state insufficient_information, «אין מספיק מידע להערכה»; domain-explanation содержит «השיחה הסתיימה לפני שהגיעה לשלב הסגירה (המועמד סיים את השיחה)» (AC5/דרישה 5).
- dl: «סיבת סיום השיחה» → «המועמד סיים את השיחה»; «הצעד שהוגדר בסימולציה» → «פגישת ייעוץ».
- 6 checkpoint — все insufficient_information.

#### 4.2 QA-4b397a-DISC-2110 (customer_refused): отказ клиента не провал кандидата; «הפעולה שהמועמד הציע», «הפער מהצעד שהוגדר» @desktop @prod-safe (#acbc41 · #6a993d6c479a31c9ebacbc41)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. Отчёт → домен next_step.
**Expected:**
- dl: «הצעד שהוגדר בסימולציה» = «פגישת ייעוץ»; «הפעולה שהמועמד הציע» и «הפער מהצעד שהוגדר» непусты (AC).
- Текст «הסירוב הוא חלק מהתרחיש, והוא אינו נחשב כישלון של המועמד» (AC).
- domain-state ≠ insufficient_information; «סיבת סיום השיחה» нет.
**File:** tests/report-analysis/next-step-domain.spec.ts · кейсы REP-006, REP-007

### 5. Отчёт — домен «פתיחת השיחה והצגת המטרה» (#0d245d)
**Seed:** `tests/seed.business.spec.ts`

> По готовым отчётам QA-bf7c47-2110 и QA-57977a-27s-2110. Только чтение → @prod-safe.

#### 5.1 QA-bf7c47-2110: статус с точкой без «пилюли», цитата «…» с линией inline-start, время «00:05 ▶», нет «אחד מארבעת…» @desktop @prod-safe (#0d245d · #6a993d6f2695665e8e0d245d)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. Отчёт → report-domain[data-domain=opening].
**Expected:** (источник: Figma 678:654 / 685:773, реджект 13.10)
- domain-state: одна img-точка, background прозрачный, border-top-width 0.
- evidence-quote домена: текст «…», border-inline-start > 0 и не none.
- evidence-time: «00:05» + img ▶.
- В main нет «אחד מארבעת».

#### 5.2 QA-57977a-27s-2110 (26 с): «השיחה נקטעה בשניות הראשונות… אין מספיק מידע» @desktop @prod-safe (#0d245d · #6a993d6f2695665e8e0d245d)
**Device:** desktop
**Users:** business (testim)
**Steps:**
1. Отчёт → домен opening.
**Expected:**
- domain-state insufficient_information; domain-explanation содержит «השיחה נקטעה בשניות הראשונות» и «אין בה מספיק מידע» (правило 21.10 «короче 30 с»).
**File:** tests/report-analysis/opening-domain.spec.ts · кейсы REP-008, REP-009

### 6. Отчёт — «סיבת סיום» рядом с «משך» в шапке (#8a2399) (записано autotest-writer вручную 04.11, тесты не запускались)
**Seed:** `tests/seed.business.spec.ts` (в файле: fixture `asUser('business')`, окно 1440×900)
Файл: tests/report-analysis/end-reason-next-to-duration-8a2399.spec.ts. Только чтение → @prod-safe. 390 не автоматизирован (экраны бизнеса — только десктоп).

#### 6.1 QA-C2-2110-D2 (predefined_condition): «משך 2:17 דק׳», сразу за ним «סיבת סיום: התקיים תנאי סיום שהוגדר בתרחיש» в той же строке @desktop @prod-safe (#8a2399 · #6a993d7271c8db743d8a2399)
**Device:** desktop
**Users:** business
**Steps:**
1. list_candidates → кандидат «QA-C2-2110-D2» → /candidates/<id>/report, дождаться «report-summary».
2. Замерить метки «תאריך», «משך», «סיבת סיום», «שפה» и значения «2:17 דק׳», «התקיים תנאי סיום שהוגדר בתרחיש».
**Expected:**
- «משך» и «סיבת סיום» в одной строке шапки; «סיבת סיום» сразу левее «משך» (RTL), между ними других полей нет; значения под метками (источник: AC4 F-17 «המשך בפועל וסיבת הסיום מוצגים בדוח»; реджект rej_bcc5d5c0 21.10).
