<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: запись звонка кандидата — загрузка частей (F-36)

> Записан autotest-writer вручную: нужен отдельный Chrome с фальшивым микрофоном
> (--use-fake-device-for-media-stream --use-file-for-fake-audio-capture=.qa/audio/g4/A.wav) и наблюдение сети —
> генератор этого не умеет. Файл: tests/recording/upload-ticket-in-header.spec.ts.
> МЕДЛЕННЫЙ (@slow, ~3–5 мин), @data, НЕ prod-safe: создаёт кандидата «QA-AUTO-REC-<stamp>» (канал link_only —
> без письма/SMS), тратит официальный звонок и AI. Без очистки (правило проекта). Пропуск: `--grep-invert @slow`.
> Окружение: QA_CALL_SIMULATION (по умолчанию «מערכות סולאריות»), QA_CALL_CHANNEL (по умолчанию chrome).

### 1. Запись звонка — билет загрузки части
**Seed:** `tests/seed.business.spec.ts` (кандидат — гость в отдельном браузере)

#### 1.1 recording-upload-url без query и с upload_headers.x-upload-ticket; каждый PUT части без «ticket=» в URL, с заголовком, 2xx @desktop @data @slow (#ecc64c3ab613e945688cddaf)
**Device:** Chrome 390×844 (mobile-эмуляция, как звонки G4) с fake mic
**Users:** business, candidate (guest)
**Steps:**
1. business: /candidates/new → «QA-AUTO-REC-…», симуляция «מערכות סולאריות», канал link_only → «יצירת קישור» → ссылка /c/…
2. Кандидат: «בוא נתחיל» → «לראות פרטי לקוח» → «להמשיך» → согласие → «להתחיל» → «להתחיל בדיקה» → «כן, שומעים טוב» → «להמשיך לתרגול» → «לדלג ישר לשיחה הרשמית» → «הבנתי שזה ניסיון חד-פעמי» → «מוכן, מתחילים».
3. Дождаться ≥6 успешных PUT частей → «לסיים שיחה» → «לאשר סיום שיחה» → «הסימולציה הושלמה»; дождаться PUT на все выданные билеты.
**Expected:**
- Каждый POST recording-upload-url: upload_url без «?» и без «ticket=»; upload_headers.x-upload-ticket есть.
- Каждый PUT: нет «ticket=» в URL; заголовок x-upload-ticket есть; ответ 2xx; PUT ≥ числа билетов (источник: AC — «כרטיס העלאת חלק הקלטה אינו מופיע בכתובת הבקשה, וההעלאה עובדת כמו קודם»). Значения билета в отчёт не выводятся.

### 2. Запись звонка — склейка частей и транскрипт после звонка (#3257d0efcc42561f5bc1ef6c)
> Записаны autotest-writer вручную (fake mic в отдельном Chrome + наблюдение сети + две роли — генератор этого не умеет).
> Общий код: `tests/recording/support.ts` (+ `createCandidateLink(page, name, simulation)` из `tests/candidate-call/support.ts`).
> Кейсы: `.qa/tests/recording/REC-002…003`. Оба @data, НЕ prod-safe: создают кандидата (link_only), тратят официальный звонок и AI.
> Без очистки (кандидатов удаляем только с «да»). Окружение: QA_LONG_SIMULATION (по умолчанию «QA-20MIN-1619»), QA_CALL_SIMULATION, QA_CALL_CHANNEL.

**Seed:** `tests/seed.business.spec.ts` (кандидат — гость в отдельном Chrome)

#### 2.1 звонок 20 мин до конца по таймеру: части 0…N без пропусков, end-candidate-attempt < 30 с, транскрипт ≤ 300 с, отчёт ready, файл ≈ звонку, клик по последней реплике @desktop @data @slow (#3257d0efcc42561f5bc1ef6c)
Файл: `tests/recording/long-call-20min-stitch-transcript.spec.ts` (~25–30 мин; в обычном регрессе `--grep-invert @slow`)
**Device:** кандидат — Chrome 390×844 с fake mic (.qa/audio/g4/A.wav по кругу); business — desktop
**Users:** business, candidate (guest)
**Steps:**
1. business: /candidates/new → «QA-AUTO-REC20-…», 20-минутная симуляция, link_only → ссылка /c/…
2. Кандидат: путь до «מוכן, מתחילים» (пропуск практики); звонок не завершать — ждать «הסימולציה הושלמה» по таймеру.
3. business: опрос get_candidate_report (3 с) до transcription_status=completed, затем (5 с) до report.status=ready.
4. business: /candidates/<id>/report → шапка, плеер, декодирование файла записи, клик по последней реплике.
**Expected:**
- end-candidate-attempt 200, `end_reason=duration_elapsed`, `is_partial=false`, время < 30 с (факт 8.2 с; до исправления 60–68 с) — AC «איחוד חלקי ההקלטה אינו מוריד את החלקים בזה אחר זה».
- Части 0…N-1 (≥ 200) без пропусков, у каждого билета успешный PUT — F-36 AC1 «הקלטת השיחה במלואה».
- duration_seconds ≥ 1190; транскрипт completed ≤ 300 с от ended_at (факт +85–86 с) — AC «התמלול מוכן בתוך 300 שניות מסוף השיחה».
- Отчёт ready ≤ 600 с (факт +94.5 с) — decisions «סך הזמן עד דוח מוכן אינו עולה על 10 דקות».
- «משך MM:SS» = длительность; файл ±10 с от звонка (факт 1205.46 / 1209); кнопок реплик = сегментов; клик по последней → currentTime ∈ [start−1; end+2], плеер «MM:SS / MM:SS» — F-37 AC8.

#### 2.2 короткий звонок ~2.5 мин, конец кандидатом: части без пропусков, end-candidate-attempt < 30 с, транскрипт ≤ 300 с, отчёт ready, файл ≈ звонку, клик по последней реплике @desktop @data (#3257d0efcc42561f5bc1ef6c)
Файл: `tests/recording/short-call-stitch-transcript.spec.ts` (~6–8 мин; для регулярного регресса)
**Device:** как 2.1
**Users:** business, candidate (guest)
**Steps:**
1. business: /candidates/new → «QA-AUTO-REC-…», симуляция QA_CALL_SIMULATION, link_only → ссылка.
2. Кандидат: путь до «מוכן, מתחילים»; дождаться ≥ 30 успешных PUT частей → «לסיים שיחה» → «לאשר סיום שיחה» → «הסימולציה הושלמה».
3–4. Как 2.1.
**Expected:**
- Как 2.1, кроме: end_reason не проверяется, duration_seconds ≥ 120, частей ≥ 30. Параллельность склейки этот тест не доказывает.

**Не автоматизировано (вручную):** «дыр» в файле нет (самая длинная тишина ≤ ~5 с — эвристика по RMS); прямое доказательство параллельного скачивания (≤ 16) — только серверный лог.

### 3. Транскрипт длинного звонка — только иврит, границы частей по 150 с, флаг качества (#30024c6427c460c2480e9f9a)
> Записан autotest-writer вручную: проверка инвариантов по данным API (get_candidate_report) готовой длинной попытки —
> генератору нечего проходить в браузере, а новый 20-мин звонок для регресса не делаем (AI, ~25 мин).
> Файл: `tests/recording/long-transcript-hebrew-boundaries.spec.ts`. Кейсы: `.qa/tests/recording/REC-004…006`.
> Только чтение → @prod-safe, без @data, без очистки. Данные: кандидат «QA-0e9f9a-2110» (testim; попытка bc0fc9a2, 1250 с,
> отчёт 67e41d12, транскрипт 2d3d4a95, 115 сегментов) — НЕ удалять. Окружение: QA_LONG_TRANSCRIPT_CANDIDATE (другая длинная
> попытка), QA_REPORT_SLOT (слот входа, по умолчанию business).

**Seed:** `tests/seed.business.spec.ts`

#### 3.1 REC-004: ни одного сегмента в латинском транслите, в каждом есть иврит @desktop @prod-safe (#0e9f9a)
**Device:** desktop
**Users:** business
**Steps:**
1. /candidates → list_candidates → id «QA-0e9f9a-2110» → get_candidate_report (p_reason null).
**Expected:**
- transcription_status=completed, duration_seconds ≥ 900, transcript.language=he.
- 0 сегментов с [A-Za-z]; 0 сегментов без буквы иврита (источник: описание бага «חלק מהקטעים יוצאים בתעתיק לטיני»).

#### 3.2 REC-005: на границах частей по 150 с слова не теряются и не дублируются; порядок и время сегментов целы @desktop @prod-safe (#0e9f9a)
**Device:** desktop
**Users:** business
**Steps:**
1. Как 3.1; сравнить соседние сегменты и окно ±20 с вокруг каждой границы 150·k с.
**Expected:** (источник: описание бага «מילה בגבול מקטע נעלמת»)
- start ≤ end; start не убывает; нет перекрытий (допуск 0,05 с); нет одинаковых сегментов подряд;
- нет повтора слова подряд внутри сегмента и на стыке сегментов одного говорящего; нет пауз > 15 с;
- у каждой границы 150·k < длительности есть сегмент в окне ±20 с.

#### 3.3 REC-006: при ухудшенном звуке качество транскрипта не «מספקת» — «איכות התמלול: חלקית» в отчёте @desktop @prod-safe (#0e9f9a)
**Device:** desktop
**Users:** business
**Steps:**
1. Как 3.1 → report.technical_status, transcript.quality_status.
2. /candidates/<id>/report → блок «תמלול».
**Expected:** (источник: описание бага «והאיכות עדיין נמדדת כמספקת»)
- quality_status задан; при degraded_audio ≠ sufficient (эталон: degraded_audio → partial).
- Видно «איכות התמלול: חלקית» и «חלקים מהשיחה לא תומללו או תומללו בוודאות נמוכה».

**Не автоматизировано (вручную 21.10):** сверка со звуком — слова через границы 300/900/1050 с ровно один раз (выравнивание 989 слов).

### 4. Отчёт — плеер записи, синхронный с транскриптом (#8d9668) (записано autotest-writer вручную)
**Seed:** `tests/seed.business.spec.ts`

> Вручную: перемотки ловятся событием `seeked` у `<audio>`, сбой — подменой POST functions/v1/get-recording-url → 500.
> Готовый отчёт QA-bf7c47-2110 (39 с, 7 сегментов, 3 фрагмента). Звук ставится на паузу; только чтение → @prod-safe.

#### 4.1 время mm:ss; говорящие «QA-bf7c47-2110 · מועמד/ת» и «<персона> · לקוח»/«לקוח» @desktop @prod-safe (#8d9668 · #6a993d6ab96217a9f48d9668)
**Expected:** segment-time, evidence-time, bdi плеера — ^\d{2}:\d{2}$; подпись говорящего — «<имя> · מועמד/ת», клиент — «… · לקוח» или «לקוח» (симуляция без имени персоны) (Figma 678:654).

#### 4.2 клик по цитате 00:05, по «00:05 ▶», по сегменту 00:22 — перемотка к началу ±0.5 с и звук; подсветка aria-current синхронна @desktop @prod-safe (#8d9668 · #6a993d6ab96217a9f48d9668)
**Expected:** seeked ≈ data-start (±0.5), audio не на паузе; активный сегмент один (aria-current=true), при воспроизведении переходит с 00:22 на 00:29, currentTime внутри активного сегмента (AC).

#### 4.3 каждый из 3 рекомендованных фрагментов играет со своего начала @desktop @prod-safe (#8d9668 · #6a993d6ab96217a9f48d9668)
**Expected:** «השמעת הקטע mm:ss–mm:ss» → seeked ≈ clip data-start (±0.5), звук (AC).

#### 4.4 get-recording-url 500 → «לא הצלחנו לטעון את ההקלטה.» + «טעינה מחדש»; повтор загружает запись @desktop @prod-safe (#8d9668 · #6a993d6ab96217a9f48d9668)
**Expected:** role=alert с текстом и кнопкой, транскрипт виден, audio нет; после снятия подмены и «טעינה מחדש» — POST 200, readyState ≥ 1, alert нет (AC).

#### 4.5 get-recording-url с anon-ключом → 401; с сессией business → 200 @desktop @prod-safe (#8d9668 · #6a993d6ab96217a9f48d9668)
**Users:** guest (anon key), business (testim)
**File:** tests/recording/report-player-sync.spec.ts · кейсы REC-007, REC-008, REC-009, REC-010, REC-011

### 5. Запись звонка и её защищённое хранение (#e0da25) (записано autotest-writer вручную)
**Seed:** `tests/seed.business.spec.ts`

> БЕЗ звонков: по готовым попыткам 21.10 через get_candidate_report и отчёт (только чтение, звук на паузу) → @prod-safe.
> Данные (НЕ удалять): QA-C4-2110-D2 (попытка 045d7b08, 315 с, запись 0b8d3dfc). Частичная запись QA-C6-2110-D2 (69bd634e, 102 с)
> после сброса недоступна в отчёте — 5.2 ищет любого кандидата с текущей попыткой technical_failure и is_partial=true
> (QA_E0DA25_PARTIAL_CANDIDATE), иначе падение «нет данных». Не автоматизировано: AC5 (90 дней), AC6 (AES-256/TLS). Дозагрузка частей при коротком разрыве HTTP — 5.5 (со звонком, 22.10).

#### 5.1 QA-C4-2110-D2: запись привязана к попытке, is_partial=false, длительность = звонку, без «ההקלטה חלקית» @desktop @prod-safe (#e0da25 · #6a993d6e89df7f29e9e0da25)
**Expected:** attempt official/completed ≥ 300 с; recording есть, is_partial=false, |dur записи − dur попытки| ≤ 2 (AC1, реджект 13.10).

#### 5.2 после сбоя частичная запись сохранена: > 0 с, is_partial=true, «ההקלטה חלקית: חלק מהשיחה לא נקלט…» @desktop @prod-safe (#e0da25 · #6a993d6e89df7f29e9e0da25)
**Expected:** AC3, דרישה 3, реджект 13.10.

#### 5.3 клик по реплике 01:41 → перемотка к ~102 с @desktop @prod-safe (#e0da25 · #6a993d6e89df7f29e9e0da25)
**Expected:** seeked ≈ data-start ±0.5, 101 ≤ start < 102 (דרישה 2).

#### 5.4 get-recording-url anon → 401, business → 200 @desktop @prod-safe (#e0da25 · #6a993d6e89df7f29e9e0da25)
**Expected:** AC4, דרישה 4.
**File:** tests/recording/recording-storage-e0da25.spec.ts · кейсы REC-012, REC-013, REC-014, REC-015

#### 5.5 обрыв HTTP 20 с на ~20-й с официального звонка → куски догружены, failed:[], is_partial=false, без «ההקלטה חלקית», файл ≈ звонку, клик по реплике после обрыва @desktop @data (#e0da25 · #6a993d6e89df7f29e9e0da25)
> Добавлено 22.10 (autotest-writer вручную): пункт реджекта 13.10 (HB) — сам сценарий, а не только итог C4 (5.1).
> ЗВОНОК (@call в названии группы): создаёт кандидата «QA-AUTO-HB-<stamp>» (link_only), тратит официальный звонок и AI (~6–9 мин). Не prod-safe.
**Device:** кандидат — Chrome 390×844 с фальшивым микрофоном (tests/recording/support.ts → launchGuest); отчёт — desktop
**Users:** business, candidate (guest)
**Steps:**
1. business: /candidates/new → «QA-AUTO-HB-…», link_only → ссылка.
2. Кандидат: путь до «מוכן, מתחילים» (startOfficialCall).
3. После ≥4 успешных PUT частей — context.setOffline(true) на 20 с, затем online.
4. Ещё ≥12 частей → «לסיים שיחה» → «לאשר סיום שיחה» → «הסימולציה הושלמה».
5. business: get_candidate_report, отчёт (checkReportPage).
**Expected:**
- во время обрыва запросы recording-upload-url падают (обрыв реально был);
- все билеты получили успешный PUT, индексы 0…N без пропусков (треб.1, реджект п.1);
- end-candidate-attempt: technical_log.recording.failed=[], complete=true; ответ и отчёт is_partial=false (реджект п.2, AC1);
- файл ≈ длительности звонка (±10 с), нет «ההקלטה חלקית», клик по последней реплике → её начало (реджект п.3–4, треб.2).
**File:** tests/recording/http-drop-reupload-e0da25.spec.ts · кейс REC-030

**Вручную:** REC-031 — полный обрыв (WebRTC + сеть, drop.js) → is_partial=true и «ההקלטה חלקית» (звонок C6 из .qa/tmp/call-plan-2110.md); итог по готовым данным — 5.2. AC5 (90 дней), AC6 (AES-256/TLS) — не автоматизируются.

### 6. Транскрипт — время и говорящий у каждого сегмента (#6204cf) (записано autotest-writer вручную)
**Seed:** `tests/seed.business.spec.ts`

> БЕЗ звонков и БЕЗ переключения провайдера транскрипции (решение пользователя 21.10): проверка по готовым попыткам через
> get_candidate_report и отчёт, только чтение → @prod-safe, без @data. Данные (НЕ удалять): QA-6204cf-2110 (7b97ca55…, попытка 973667ea,
> whisper-1, 12 сегментов), QA-C4-2110-D2 и QA-DIAG-2110 (текущий soniox). Окружение: QA_6204CF_CANDIDATE, QA_6204CF_CURRENT, QA_REPORT_SLOT.
> Не автоматизировано: смена провайдера (AC5 — только по готовым данным обоих провайдеров), сбой транскрипции (AC4), p95 (AC6 — пилот).

#### 6.1 REC-016: QA-6204cf-2110 (whisper-1): у всех сегментов start/end и говорящий מועמד/לקוח, 0 «דובר לא מזוהה», транскрипт ≤ 5 мин @desktop @prod-safe (#6204cf · #6a993d6e55d3513b306204cf)
**Device:** desktop · **Users:** business
**Steps:** list_candidates → id → get_candidate_report (p_reason null).
**Expected:** completed, he; 12/12 сегментов: 0 ≤ start ≤ end, по возрастанию; speaker ∈ {candidate, customer}, оба есть, 0 null (AC1; решение 14.10); «שלום יוסי, מדבר אלון…» — candidate, «מדבר יוסי» — customer; transcript_ready_at − ended_at ≤ 300 с (AC6, факт 8.5 с).

#### 6.2 REC-017: блок «תמלול» в RTL, подписи «QA-6204cf-2110 · מועמד/ת» и «לקוח», время mm:ss, без «דובר לא מזוהה» @desktop @prod-safe (#6204cf · #6a993d6e55d3513b306204cf)
**Device:** desktop · **Users:** business
**Steps:** /candidates/<id>/report.
**Expected:** сегментов на экране = в API; html dir=rtl, direction сегментов rtl (треб. 6); data-speaker candidate/customer, подписи по Figma 678:654; время ^\d{2}:\d{2}$; «דובר לא מזוהה» нет.

#### 6.3 REC-018: QA-C4-2110-D2 / QA-DIAG-2110 (текущий провайдер): у всех сегментов start/end и говорящий, 0 null @desktop @prod-safe (#6204cf · #6a993d6e55d3513b306204cf)
**Device:** desktop · **Users:** business
**Expected:** как 6.1 без эталонного числа сегментов (AC5 — структура одинакова при любом провайдере).
**File:** tests/recording/transcript-speakers-6204cf.spec.ts · кейсы REC-016, REC-017, REC-018

### 7. Говорящий не из событий браузера кандидата (#16dea8) (записано autotest-writer вручную)
**Seed:** `tests/seed.business.spec.ts`

> По готовой попытке QA-5f7c10-2110 (80d7ad3b…, попытка cd0c1a09, 14 сегментов), во время которой 21.10 браузер кандидата слал
> поддельные candidate_record_event 'turn' (все 400 invalid_event, tmp/calls-2110b/S4/abuse.json). Только чтение → @prod-safe.
> Окружение: QA_16DEA8_CANDIDATE, QA_REPORT_SLOT.
> **Вручную (REC-021):** сам запрос-подделка `candidate_record_event {p_kind:'turn', payload.speaker}` с токеном приглашения → 400 invalid_event —
> нужна АКТИВНАЯ попытка (звонок); без неё сервер отклоняет по другой причине и тест ничего не доказывает.

#### 7.1 REC-019: поддельного «turn» (QA-FORGED, burst, 1 МБ) нет в транскрипте и отчёте; говорящие верны @desktop @prod-safe (#16dea8 · #fe219494b9b5f50edd16dea8)
**Device:** desktop · **Users:** business
**Expected:** 0 сегментов с «QA-FORGED» / «אני הלקוח המדומה» / burst<N> / AAAA…; порядок говорящих = эталону 21.10; продавец «שלום יוסי, מדבר אלון…» — candidate, «הלו. כן, מדבר יוסי.» — customer; на странице отчёта «QA-FORGED» нет (AC тикета).

#### 7.2 REC-020: каждая цитата-доказательство оценки кандидата — из сегмента кандидата и совпадает с его текстом @desktop @prod-safe (#16dea8 · #fe219494b9b5f50edd16dea8)
**Device:** desktop · **Users:** business
**Expected:** для evidence в domains (кроме discovered_items) и strengths: сегмент segment_index есть, speaker ≠ customer, quote — подстрока текста (факт 21.10: 28/28).
**File:** tests/recording/speaker-trust-16dea8.spec.ts · кейсы REC-019, REC-020 (REC-021 — вручную)

### 8. Удалённая запись недоступна по ссылке, выданной до удаления (#8eb9d8) (записано autotest-writer вручную)
**Seed:** `tests/seed.business.spec.ts` (журнал — `tests/seed.admin.spec.ts`)

> Без браузера и без прогона (решение пользователя 21.10): проверки API/заголовков генератору проходить нечего, тест записан вручную.
> Только чтение готовых данных → @prod-safe, без @data, без очистки. Данные (НЕ удалять): QA-8eb9d8-2110 (5dc4bdba…, попытка f23f1072,
> запись 230865a0…) — очищен «ניקוי 90 יום» 21.10 18:15; QA-C4-2110-D2 (запись 0b8d3dfc) — целая запись.
> Окружение: QA_8EB9D8_PURGED_CANDIDATE_ID, QA_8EB9D8_PURGED_RECORDING_ID, QA_8EB9D8_INTACT_CANDIDATE.
> **Вручную (REC-025):** сама очистка и опрос старой подписанной ссылки +5…+65 с — необратимо, нужен свежий кандидат со звонком и
> временный флаг «עסק בדיקה» на testim (без него 400 purge_not_allowed_real_business). Шаги — в кейсе.

#### 8.1 QA-8eb9d8-2110 после «ניקוי 90 יום»: «ההקלטה של השיחה נמחקה.», «התמלול נמחק יחד עם ההקלטה.», плеера нет; get-recording-url → 404 not_found @desktop @prod-safe (#8eb9d8 · #b086024193665fbc0b8eb9d8)
**Device:** desktop · **Users:** business
**Steps:** get_candidate_report(5dc4bdba…) → POST get-recording-url {recording_id: 230865a0…} → /candidates/5dc4bdba…/report.
**Expected:** content_erased_at задан, recording/transcript = null (F-56 AC8); 404 {"error":"not_found"} (AC тикета); тексты удаления и «התוכן של השיחה נמחק» видны, recording-player и <audio> — 0.

#### 8.2 журнал доступа: «הפעלת ניקוי 90 יום על רשומה» и «מחיקה בניקוי 90 יום» у QA-8eb9d8-2110 @desktop @prod-safe (#8eb9d8 · #b086024193665fbc0b8eb9d8)
**Device:** desktop · **Users:** admin
**Steps:** /admin/access-log → «מזהה מועמד» = 5dc4bdba… → «סינון».
**Expected:** обе строки есть (факт 21.10 21:15).

#### 8.3 QA-C4-2110-D2: подписанная ссылка — cache-control private, no-store; два GET без входа — не HIT, без age; expires_in ≤ 600 @desktop @prod-safe (#8eb9d8 · #b086024193665fbc0b8eb9d8)
**Device:** desktop · **Users:** business (выдача), без входа (GET ссылки)
**Expected:** 200/206; cache-control ⊇ no-store, private; cf-cache-status ≠ HIT (факт DYNAMIC); x-vercel-cache ≠ HIT; age 0/нет (комментарий программиста; AC тикета; F-36).
**File:** tests/recording/purged-recording-8eb9d8.spec.ts · кейсы REC-022, REC-023, REC-024 (REC-025 — вручную)

### 9. Лимиты размера и частоты на путях записи кандидата (#5f7c10) — НЕ автоматизировано

> Решение пользователя 22.10: без звонков в автотестах. Все проверки требуют АКТИВНОЙ официальной попытки (идёт звонок);
> без неё отказ сервера не доказывает лимит (попытка не активна → отказ по другой причине), поэтому «пустой» автотест без
> попытки не пишется. Только ручные кейсы:
> - REC-026 — кусок > 1 МиБ: recording-upload-url и PUT → 413 {"error":"part_too_large","max_bytes":1048576} < 1 с;
> - REC-027 — part > 300 → 400 validation_failed;
> - REC-028 — candidate_record_event: payload > 16 KiB → 400 event_payload_too_large; > ~30 событий / 10 с → 400 event_rate_limited;
> - REC-029 — обычный звонок не задет: все куски/события 200, запись и отчёт готовы.
> Тикет: #5f7c10 · #74207659c68b798b1a5f7c10.
