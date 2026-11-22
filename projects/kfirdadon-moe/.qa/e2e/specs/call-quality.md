<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: качество соединения в звонке кандидата — плашка «החיבור חלש» и статус записи (#51da2a)

> Записан autotest-writer вручную (запасной путь): отдельный Chrome с фальшивым микрофоном, подмена RTCPeerConnection
> и ответов бэкенда звонка, две роли — генератор этого не умеет.
> Кейсы: `.qa/tests/call-quality/CQ-001…CQ-004`. Общий код: `tests/call-quality/support.ts`
> (+ `createCandidateLink`, `launchCandidate`, `goToPractice`, `goToOfficialConfirm` из `tests/candidate-call/support.ts`,
> `candidateId`, `getReport` из `tests/recording/support.ts`).
> Проект Playwright — только `tests` (десктоп): iphone/android смотрят в `tests/candidate-call`. Кандидат — свой Chrome 390×844.
> Логика клиента (бандл 14.10): замер getStats раз в 2 с; delay_ms = RTT/2 + средний jitterBufferDelay; «плохой» замер —
> потери > 20 % или delay_ms > 400; окно 10 с, ≥ 3 замера; плашка при ≥ 60 % плохих, снимается при ≤ 20 %.
> Все тесты @data (создают кандидата «QA-AUTO-CQ-…», link_only, без удаления — правило проекта), НЕ @prod-safe.

### 1. Звонок — плашка слабого соединения, логика без звонка (#b28a22ed6a85bb764151da2a)
**Seed:** `tests/seed.business.spec.ts` (кандидат — гость в отдельном Chrome)
Файл: `tests/call-quality/warning-logic-mocked.spec.ts`. Подмены: candidate_start_attempt, start-voice-session, обмен SDP
(фальшивый хост), recording-upload-url + PUT, candidate_record_event, end-candidate-attempt; RTCPeerConnection — подделка
с управляемым getStats; api.openai.com — обрыв + счётчик = 0. OpenAI и официальная попытка не тратятся.

#### 1.1 RTT 450 мс, буфер 100 мс, потерь 0 (delay_ms 325): ≥ 8 замеров — плашки нет, connection_warning не отправлялся, звонок «live» @desktop @data (#b28a22ed6a85bb764151da2a)
**Device:** desktop (кандидат — Chrome 390×844 с fake mic)
**Users:** business, candidate (guest)
**Steps:**
1. business: /candidates/new → «QA-AUTO-CQ-MOCK-RTT450-…», link_only → ссылка /c/…
2. Кандидат (с подменами): вступление → согласие → тех. проверка → «לדלג ישר לשיחה הרשמית» → флажок → «מוכן, מתחילים».
3. Экран звонка live; дождаться ≥ 8 новых замеров getStats.
**Expected:**
- Плашка «החיבור חלש כרגע. השיחה ממשיכה, אבל ייתכן שהקול ייקטע.» не появлялась ни разу; connection_warning не отправлялся (источник: «מצב נוכחי» — «מסלול של כ-450 מ״ש … הוא רגיל»; AC «…ובלי התרעת חיבור קבועה»).
- Таймер, «מחובר · הלקוח מקשיב», «לסיים שיחה»; end-candidate-attempt нет; запросов к OpenAI 0.

#### 1.2 потери 25 % → плашка, звонок продолжается; потери 0 → плашка снята; RTT 800 мс (delay_ms 440) → плашка снова @desktop @data (#b28a22ed6a85bb764151da2a)
**Device:** desktop (кандидат — Chrome 390×844 с fake mic)
**Users:** business, candidate (guest)
**Steps:**
1–2. Как 1.1 («QA-AUTO-CQ-MOCK-LOSS-…»), старт: RTT 150, буфер 40, потерь 0; ≥ 5 замеров — плашки нет.
3. Потери 25 % → дождаться плашки; проверить, что звонок идёт.
4. Потери 0 → дождаться исчезновения плашки.
5. RTT 800, буфер 40 → дождаться плашки.
**Expected:**
- Плашка role=alert с точным текстом при потерях 25 %; connection_warning с packet_loss > 0,2 (источник: «מצב נדרש» — «אובדן מנות מעל 20 אחוז»; Figma 866:10417).
- Звонок продолжается: таймер уменьшается, статус «מחובר…», «לסיים שיחה» активна, data-phase=live, конца попытки нет (источник: F-32 AC «…והשיחה ממשיכה כל עוד ניתן»; FL-32 ш.1).
- После потерь 0 плашка скрыта (источник: «התרעת החיבור מופיעה רק כשאיכות הקול באמת יורדת»).
- При delay_ms 440 плашка снова, второй connection_warning с delay_ms > 400 (источник: «…או השהיה מעל 400 מ״ש»).

### 2. Звонок — качество при обычной сети, настоящий звонок (#b28a22ed6a85bb764151da2a)
**Seed:** `tests/seed.business.spec.ts` (кандидат — гость в отдельном Chrome)
Файл: `tests/call-quality/normal-call-no-warning-sufficient.spec.ts`. **@call — тратит OpenAI** (~1,5–2 мин голоса),
retries 0 (один звонок — L-20261014-1). Без звонков: `npm test -- --grep-invert @call`.
Вариант «RTT ~450 мс» тикета: `QA_CALL_FORCE_RTT_MS=450` (подмена RTT в getStats настоящего соединения).

#### 2.1 официальный звонок ~90 с при нормальной сети: плашки «החיבור חלש» нет ни разу, connection_warning не отправлялся; recording.quality_status = sufficient @desktop @data @call (#b28a22ed6a85bb764151da2a)
**Device:** desktop (кандидат — Chrome 390×844, fake mic .qa/audio/seller-dialog.wav)
**Users:** business, candidate (guest)
**Steps:**
1. business: кандидат «QA-AUTO-CQ-CALL-…», link_only → ссылка.
2. Кандидат: путь до «מוכן, מתחילים» → звонок live.
3. Дождаться, пока таймер пройдёт 90 с.
4. «לסיים שיחה» → «לאשר סיום שיחה» → «הסימולציה הושלמה».
5. business: get_candidate_report до появления recording.quality_status.
**Expected:**
- Плашка не появлялась ни разу; connection_warning не отправлялся (источник: AC «…ובלי התרעת חיבור קבועה»; Figma 633:987).
- end-candidate-attempt 2xx, в теле recording_quality, packet_loss ≤ 0,2 (источник: «איכות ההקלטה נמדדת לפי מה שנלכד בפועל»).
- recording.quality_status = «sufficient» (источник: AC «…נשמרת עם איכות הקלטה מספקת»; F-36 треб.7).

**Не автоматизировано (вручную, CQ-004):** реальная плохая сеть (потери UDP > 20 %, RTT ≥ 400 мс в мобильной сети) и
серверный quality_status при latency_ms ≈ 450 (клиент отправляет max RTT, не delay_ms) — не проверено; вопрос владельцу
«השהיה מעל 400» — RTT или delay_ms.
