<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — NDA between headhunters: blocked chat, refusal shown to the initiator (2026-11-07)

STATUS: READY — #d0bc44 and #fb0f43 passed QA; user moved both to «הושלם» 2026-11-07. Not generated yet. Environment: staging.
UPDATE 2026-11-08: #0224f4 «Automatic pre-signed standard NDA» and #1d9069 «"Send message" to job manager opens chat with auto-signed NDA» passed QA (retest after rej_0ca2901b / rej_831cd552), user moved both to «הושלם». Added §3 (read-only, for the generator) and §4 (OPT-IN, pair-consuming, written by autotest-writer). Cases: `.qa/tests/hunter-nda/HN-3-1..5, HN-4-1..2`. Evidence: `.qa/screenshots/0224f4-r2-*.png`, `1d9069-A-J150-*.png`.
Sources: #d0bc44 «מה רצוי» "After B refuses, A sees the refusal where A works … 1. In the chat with B: a clear message instead of the first-contact popup … with a button to send the request again; 2. On A's submission that waited for B's signature: status «בוטל» (or «ה-NDA נדחה») with the reason; 3. The bell text matches the trigger: for a chat — «…ולכן הפנייה לא נשלחה», for a submission — «…ולכן ההגשה לא נשלחה»"; #fb0f43 «מה רצוי» "writing in a first chat between two headhunters is possible only after BOTH have [approved] … 3. The server also rejects sending a message in such a chat until the pair NDA is signed"; developer notes 05.11 (commit 6574d5f, model after #0224f4: A's side is automatic, B approves/refuses, NDA 3 months). Evidence: `.qa/screenshots/d0bc44-*.png`, `.qa/screenshots/fb0f43-*.png`. Cases: `.qa/tests/hunter-nda/HN-1-1, HN-1-2, HN-2-1, HN-2-2, HN-2-3`.

**Texts (he, verified 07.11):**
- A, waiting: «ממתינים לאישור של <B> ל-NDA. אפשר לכתוב אחרי האישור.» + link «צפייה ב-NDA».
- B, request: «<A> פנו אליכם, וה-NDA הסטנדרטי ביניכם כבר חתום מצדם…» + «אישור ה-NDA», «סירוב», «צפייה ב-NDA».
- A, after refusal: «<B> סירבו לאשר את ה-NDA, ולכן הפנייה לא נשלחה. אפשר לבקש שוב.» + «שליחת בקשה חוזרת».
- B, after refusal: «סירבתם לאשר את ה-NDA עם <A>. כדי לכתוב, יש לאשר את ה-NDA.» + «אישור ה-NDA».
- A bell: chat — «…ולכן הפנייה לא נשלחה»; submission — «…ולכן ההגשה לא נשלחה».
- A's held submission after refusal: «בוטל • ה-NDA נדחה» (separator `·` or `•` → regex `/בוטל\s*[·•]\s*ה-NDA נדחה/`) + reason «<B> סירבו לאשר את ה-NDA…».
- Composer in any blocked state: textbox «כתיבת הודעה» disabled, button «שליחה» disabled.

**DATA PROBLEM — why §1 and 2.2 are OPT-IN:** the refusal flow needs a pair of headhunters WITHOUT an NDA in force. On 07.11.2026 the only pair used for QA (claude-test ↔ demo-hunter-3, chat `c=9339566b-8799-41ce-b222-8c586a4afcce`) was APPROVED (in force until 07.02.2027); claude-test ↔ demo-hunter-2 is in force until 02.02.2027. There is no free pair. B must never APPROVE in a test (approval makes the pair unusable for 3 months).
- §1 tests are multi-role (`asUser`) and written by autotest-writer, not by the generator. They are skipped unless `QA_PAIR_NDA=1`. Configuration (env): `QA_PAIR_NDA_A` (role file in `.qa/auth`, default `hunter_plus`), `QA_PAIR_NDA_B` (default `hunter_free_2`), `QA_PAIR_NDA_A_NAME` (A's display name, default «נועם כהן»), `QA_PAIR_NDA_B_NAME` (default «הד האנטר דמו 3»), `QA_PAIR_NDA_CHAT` (conversation id of the A↔B chat, default `9339566b-8799-41ce-b222-8c586a4afcce`); 1.2 also `QA_PAIR_NDA_JOB` (path of an active job owned by B, e.g. `/collaborations/<id>`) and `QA_PAIR_NDA_CANDIDATE` (name of A's candidate, must start with «QA-AUTO», not yet submitted to that job).
- Needed data: two headhunter accounts with saved sessions, no NDA between them (state «waiting» or «refused» — both work, the test re-requests), an existing chat between them; for 1.2 an active job of B.
- Inside the tests: if A's composer is enabled and no NDA bar is shown → `test.skip(true, 'pair NDA is in force — need a pair without NDA (see hunter-nda.md)')`.
- Run alone, one window per role: `QA_PAIR_NDA=1 npx playwright test tests/hunter-nda/pair-refusal --project=tests --workers=1`.
- Leaves: a new NDA request + refusal + bell notices (cannot be deleted); 1.2 also a cancelled submission of the QA-AUTO candidate (status «בוטל», written to `test-data-journal.log`). Final state of the pair = refused (re-usable by the next run). Tag `@data`.

---

### 1. Refusal flow (two roles, OPT-IN) — written by autotest-writer
**Users:** A + B (`asUser`), seed not used

#### 1.1 B refuses the pair NDA → A's chat shows the refusal bar and «שליחת בקשה חוזרת», bell «…ולכן הפנייה לא נשלחה»; both composers blocked @desktop @data #d0bc44 #fb0f43
**Cases:** HN-1-1, HN-2-2 · **File:** `tests/hunter-nda/pair-refusal-chat.spec.ts` (written)
**Steps:**
1. A: `/messages?c=<chat>`. If the refusal bar is shown → click «שליחת בקשה חוזרת». Expect A's waiting bar; composer disabled.
2. B: `/messages?c=<chat>`. Expect B's request bar with «אישור ה-NDA», «סירוב», «צפייה ב-NDA»; composer disabled. Click «סירוב» (confirm in a dialog if one appears). NEVER «אישור ה-NDA».
3. B: reload → B's refusal bar, composer disabled.
4. A: reload → refusal bar + «שליחת בקשה חוזרת»; no «זו הפנייה הראשונה שלכם»; composer disabled. Open the bell → a notice with B's name containing «ולכן הפנייה לא נשלחה».
**Expected:** texts as listed above. (#d0bc44 п.1, п.3; #fb0f43 п.1–2)

#### 1.2 A's submission held for B's approval → B refuses → «בוטל • ה-NDA נדחה» on A's panel, bell «…ולכן ההגשה לא נשלחה» @desktop @data #d0bc44
**Case:** HN-1-2 · **File:** `tests/hunter-nda/pair-refusal-submission.spec.ts` (written)
**Steps:**
1. A: `QA_PAIR_NDA_JOB` → panel «הגשת מועמד/ת» → search `QA_PAIR_NDA_CANDIDATE` → «הגשת <name> למשרה» → banner «הגשה ראשונה להד האנטר הזה…» → «פרופיל אנונימי», «אין צורך ב-NDA» → «המשך» → «סיום והגשה» (anonymous, no NDA charge).
2. B: chat with A → «סירוב».
3. A: open the job again → panel row of the candidate; open the bell.
**Expected:** panel row has `/בוטל\s*[·•]\s*ה-NDA נדחה/` and «סירבו לאשר את ה-NDA»; not «נשלח/ה» in that row. Bell: notice with B's name containing «ולכן ההגשה לא נשלחה». (#d0bc44 п.2, п.3)
**Not asserted (QA findings 07.11):** A's list may show «נשלח/ה» while the card shows «ממתין/ה ל-NDA»; B's «מועמדים שהוגשו» counter 1 with an empty list; B's bell keeps active «אישור ה-NDA» on old requests.

### 2. Blocked chat while the NDA waits (read-only) + server guard
**Seed:** `tests/seed.hunter_plus.spec.ts`

#### 2.1 Pending NDA chat: composer and «שליחה» disabled, waiting bar shown, also after reload @desktop @prod-safe #fb0f43
**Case:** HN-2-1 · **File:** `tests/hunter-nda/pending-chat-composer-blocked.spec.ts` — FOR THE GENERATOR
**Device:** desktop · **Users:** hunter_plus (claude-test)
**Steps:**
1. Go to `/messages?c=daf8b54a-2dbe-4447-b596-89834a33472e` (chat with «הד האנטר דמו 1»; NDA request claude-test → demo-hunter-1 pending since 07.11).
2. Wait for the chat header «הד האנטר דמו 1». If the textbox «כתיבת הודעה» is enabled and the waiting bar is absent → `test.skip(true, 'fb0f43 data changed: NDA with demo-hunter-1 is no longer pending')`.
3. Reload; read again.
**Expected (before and after reload):**
- Text «ממתינים לאישור של הד האנטר דמו 1 ל-NDA. אפשר לכתוב אחרי האישור.» visible. (#fb0f43 «מה רצוי» п.1; dev note)
- `getByRole('textbox', { name: 'כתיבת הודעה' })` (or placeholder «כתיבת הודעה») is disabled; button «שליחה» is disabled. (#fb0f43 п.1 — "A's message box and «שליחה» are disabled"; "also after reload")
- Never type or send anything.

#### 2.2 Server rejects a message in a chat without NDA: 400 «hunter nda required», nothing saved @desktop @data #fb0f43
**Case:** HN-2-3 · **File:** `tests/hunter-nda/server-rejects-message-without-nda.spec.ts` (written, OPT-IN `QA_NDA_SERVER=1`)
**Users:** hunter_plus · same chat as 2.1.
**Steps:** open the chat; take `apikey` + `authorization` headers from the page's own `/rest/v1/` request; `POST <supabase>/rest/v1/messages` with body `{ conversation_id: <chat>, content: 'QA-AUTO fb0f43 server check <ts>' }` (column names overridable by `QA_NDA_SERVER_BODY` JSON with `{{chat}}` / `{{text}}` placeholders); reload the chat.
**Expected:** HTTP 400 and the response text contains «hunter nda required» (a different 400 — e.g. unknown column — FAILS the test: fix only the body, never the expectation); after reload the text is not in the chat. (#fb0f43 «מה רצוי» п.3; QA 07.11: 3/3 → 400 «hunter nda required»)
Why opt-in: a direct API write attempt; if the guard ever breaks, the test would post a real message to a demo account.

**Not automated:** en/ru/ar of the bars (screenshots `d0bc44-*-en-desktop.png`, `fb0f43-B-composer-blocked-refused-en-desktop.png` — reference only; translations are part of the opt-in flow, kept out to limit the run); approval path (makes the pair unusable for 3 months).

---

## Auto-signed standard NDA (#0224f4, #1d9069) — added 2026-11-08

Sources: #0224f4 AC2 "the system automatically generates the NDA already filled with the relevant details — job, company, candidate and both parties — already signed"; AC5 "headhunter ↔ another headhunter, headhunter ↔ company, headhunter ↔ candidate"; AC6 "Once the other party … approves the NDA, it is valid for 3 months"; #1d9069 AC2 "the user opens a job (משרה) → at the job manager (מנהל המשרה) clicks "שליחת הודעה" → a chat with the job manager opens immediately", "auto-filled with the job, company and both parties' details". Rejections 07.11 (filled «פרטי ההסכם», NDA for company/talent) fixed 08.11.

**Texts (he, verified 08.11):**
- Initiator waiting bar: «ממתינים לאישור של <owner> ל-NDA. אפשר לכתוב אחרי האישור.» + link «צפייה ב-NDA»; for a talent `<owner>` = «טאלנט אנונימי».
- Receiver bar: «<initiator> פנו אליכם, וה-NDA הסטנדרטי ביניכם כבר חתום מצדם. כדי לכתוב זה לזה, אשרו אותו (בתוקף ל-3 חודשים).» + «אישור ה-NDA», «סירוב», «צפייה ב-NDA».
- NDA view: dialog heading «NDA סטנדרטי»; block «פרטי ההסכם» with label/value pairs «שמכם:», «הצד השני:», «בנושא:» (job title, only when started from a job), «חברה / מפרסם/ת המשרה:», «תאריך:», «תוקף:». Before approval «תוקף: 3 חודשים מיום האישור של הצד השני», footer «נחתם אוטומטית בשמכם ב-<date>.» / «ממתין לאישור של <other>.»; after approval «תוקף: בתוקף מ-<start> עד <end>», «נחתם על ידכם בתאריך …», «נחתם על ידי <other> בתאריך …». Match label+value with regex `/<label>\s*<value>/` on the dialog's innerText (RTL — do not rely on element order).
- «הסכמים» (`/profile?tab=agreements`): columns «שם», «סוג ההסכם», «תאריך חתימה», «תוקף», «פעולות» («צפייה»). Type of the auto NDA: «NDA בין הד האנטרים» (also for a company — shown as is, not asserted as a requirement).
- 3 months: `end = start + 3 calendar months, same day` (08.11.2026 → 08.02.2027). Compute in the test from the parsed start date (`dd.mm.yyyy`), do not hardcode end dates except where the case names them.

**Data on the stand (08.11.2026):** claude-test «נועם כהן» ↔ «סופר פארם» (demo-company-1, J-148 «QA 0711 משרה חברה» `/collaborations/fedc4b3d-3de6-414e-9821-af96a34469ae`) approved 08.11.2026–08.02.2027, chat `c=dc263bb1…`; claude-test ↔ «הד האנטר דמו 3» (J-150 «QA 0711 משרה האנטר 3» `/collaborations/192164e9-2c24-4a35-8572-023ec2dc1b39`) approved 07.11.2026–07.02.2027; claude-test → anonymous talent U-50 pending since 08.11 (chat `c=24ae1314…`). Read-only tests skip with a clear message if this data changes (job gone / NDA not in force / talent approved).

**PAIRS ARE CONSUMED IRREVERSIBLY** — approving an NDA makes the pair unusable for 3 months; even the first request leaves a pending NDA. Therefore §4 is OPT-IN, multi-role/data-changing, written by autotest-writer (the generator would consume a pair while recording); §3 is read-only and runs by default.

### 3. Auto NDA — read-only checks (default)
**Seed:** `tests/seed.hunter_plus.spec.ts` (3.3 — `tests/seed.company.spec.ts`)

#### 3.1 «הסכמים»: every «NDA בין הד האנטרים» row ends exactly 3 months after signing; «סופר פארם» row 08.11.2026 → 08.02.2027 @desktop @prod-safe #0224f4 #1d9069
**Case:** HN-3-1 · **File:** `tests/hunter-nda/agreements-auto-nda-3-months.spec.ts` — FOR THE GENERATOR
**Device:** desktop · **Users:** hunter_plus (claude-test)
**Steps:**
1. Go to `/profile?tab=agreements`; wait for the table header «תאריך חתימה».
2. Read all rows whose «סוג ההסכם» is «NDA בין הד האנטרים».
**Expected:**
- At least one such row; a row with «שם» «סופר פארם», «תאריך חתימה» 08.11.2026, «תוקף» 08.02.2027. (#0224f4 AC5–6)
- For every such row: «תוקף» parsed as a date equals «תאריך חתימה» + 3 months. (#0224f4 AC6; #1d9069 AC4)
- Rows of other types (e.g. «הסכם סודיות – הד האנטרים», «שנתיים מתום התהליך») are ignored.

#### 3.2 Signed NDA from «הסכמים» is filled: parties, job, company, validity (סופר פארם / הד האנטר דמו 3) @desktop @prod-safe #0224f4 #1d9069
**Case:** HN-3-2 · **File:** `tests/hunter-nda/agreements-auto-nda-filled.spec.ts` — FOR THE GENERATOR
**Device:** desktop · **Users:** hunter_plus (claude-test)
**Steps:**
1. `/profile?tab=agreements` → row «סופר פארם» + «NDA בין הד האנטרים» → «צפייה».
2. Read the dialog «NDA סטנדרטי» (scroll to «פרטי ההסכם»); close (back arrow / `Escape`).
3. Row «הד האנטר דמו 3» + «NDA בין הד האנטרים» + «תאריך חתימה» 07.11.2026 → «צפייה»; read; close.
**Expected:**
- סופר פארם: «פרטי ההסכם»; `/שמכם:\s*נועם כהן/`, `/הצד השני:\s*סופר פארם/`, `/בנושא:\s*QA 0711 משרה חברה/`, `/חברה \/ מפרסם\/ת המשרה:\s*סופר פארם/`, `/תאריך:\s*08\.11\.2026/`, `/בתוקף מ-08\.11\.2026 עד 08\.02\.2027/`; «נחתם על ידכם בתאריך 08.11.2026», «נחתם על ידי סופר פארם בתאריך 08.11.2026». (#0224f4 AC2–3; #1d9069 "auto-filled with the job, company and both parties' details")
- הד האנטר דמו 3: `/הצד השני:\s*הד האנטר דמו 3/`, `/בנושא:\s*QA 0711 משרה האנטר 3/`, `/חברה \/ מפרסם\/ת המשרה:\s*הד האנטר דמו 3/`, `/בתוקף מ-07\.11\.2026 עד 07\.02\.2027/`.
- No signature field / input in the dialog (AC3 "nothing manual").

#### 3.3 Company «הסכמים»: NDA with «נועם כהן» 08.11.2026 → 08.02.2027, filled details @desktop @prod-safe #0224f4
**Case:** HN-3-3 · **File:** `tests/hunter-nda/company-agreements-auto-nda.spec.ts` — FOR THE GENERATOR
**Seed:** `tests/seed.company.spec.ts` · **Device:** desktop · **Users:** company (demo-company-1 «סופר פארם»)
**Steps:**
1. `/profile?tab=agreements` → row «נועם כהן» with «תאריך חתימה» 08.11.2026 and «סוג ההסכם» «NDA בין הד האנטרים».
2. «צפייה»; read; close.
**Expected:**
- Row «תוקף» 08.02.2027 (= start + 3 months). (#0224f4 AC5 headhunter ↔ company, AC6)
- Dialog «NDA סטנדרטי»: `/שמכם:\s*סופר פארם/`, `/הצד השני:\s*נועם כהן/`, `/בנושא:\s*QA 0711 משרה חברה/`, `/בתוקף מ-08\.11\.2026 עד 08\.02\.2027/`. (AC2)

#### 3.4 Job page → «מנהל/ת המשרה» → «שליחת הודעה» opens the chat at once; NDA in force → writable (J-148 company, J-150 headhunter) @desktop @prod-safe #1d9069 #0224f4
**Case:** HN-3-4 · **File:** `tests/hunter-nda/job-send-message-opens-chat.spec.ts` — FOR THE GENERATOR
**Device:** desktop · **Users:** hunter_plus (claude-test)
**Steps:**
1. Go to `/collaborations/fedc4b3d-3de6-414e-9821-af96a34469ae`; wait for the dialog/page «פרטי המשרה» with «QA 0711 משרה חברה». If the job is not found → `test.skip(true, 'J-148 removed — update job id in specs/hunter-nda.md 3.4')`.
2. In the «מנהל/ת המשרה» block (manager «סופר פארם») click «שליחת הודעה».
3. `waitForURL(/\/messages\?c=/)`; wait for the chat header «סופר פארם».
4. Repeat 1–3 for `/collaborations/192164e9-2c24-4a35-8572-023ec2dc1b39` («QA 0711 משרה האנטר 3», manager «הד האנטר דמו 3»).
**Expected (each job):**
- The chat opens directly — no intermediate dialog with an NDA signature/approval step (no dialog containing «NDA» between the click and the chat). (#1d9069 AC1–2)
- NDA in force → textbox «כתיבת הודעה» enabled, no text «ממתינים לאישור». (developer 05.11: "NDA with this headhunter already in force → can write at once")
- Never type or send.

#### 3.5 Pending NDA with an anonymous talent: «ממתינים לאישור של טאלנט אנונימי ל-NDA», composer blocked, NDA view filled @desktop @prod-safe #0224f4
**Case:** HN-3-5 · **File:** `tests/hunter-nda/talent-pending-nda-chat.spec.ts` — FOR THE GENERATOR
**Device:** desktop · **Users:** hunter_plus (claude-test)
**Steps:**
1. Go to `/messages`; open the conversation «טאלנט אנונימי» whose id starts with `24ae1314` (preview «צרו קשר עם טאלנט אנונימי…»). At generation time resolve the full id and hardcode `/messages?c=<full id>`.
2. If the textbox «כתיבת הודעה» is enabled and the waiting bar is absent → `test.skip(true, '#0224f4 data changed: NDA with U-50 is no longer pending')`.
3. Click «צפייה ב-NDA»; read the dialog; close.
**Expected:**
- «ממתינים לאישור של טאלנט אנונימי ל-NDA. אפשר לכתוב אחרי האישור.» visible; textbox «כתיבת הודעה» and button «שליחה» disabled. (#0224f4 AC5 headhunter ↔ candidate)
- Dialog «NDA סטנדרטי»: `/שמכם:\s*נועם כהן/`, `/הצד השני:\s*טאלנט אנונימי/`, `/תאריך:\s*\d{2}\.\d{2}\.\d{4}/`, `/תוקף:\s*3 חודשים מיום האישור של הצד השני/`, «נחתם אוטומטית בשמכם», «ממתין לאישור של טאלנט אנונימי». (AC2–3, AC6)

### 4. Auto NDA — first contact (OPT-IN, consumes pairs) — written by autotest-writer
**Users:** `asUser`, seed not used. Tag `@data`. Run alone: `npx playwright test tests/hunter-nda/auto-nda- --project=tests --workers=1` with the env below.

#### 4.1 Hunter without NDA → job → «שליחת הודעה»: chat at once, waiting bar, filled NDA before approval; owner bar «אישור ה-NDA»/«סירוב»; [approve → both write, «הסכמים» +3 months] @desktop @data #0224f4 #1d9069
**Cases:** HN-4-1 · **File:** `tests/hunter-nda/auto-nda-job-owner.spec.ts` (written 2026-11-08, NOT run)
**Env:** `QA_AUTO_NDA=1` (enable); `QA_AUTO_NDA_HUNTER` (role, default `hunter_free`) + `_HUNTER_NAME` (default «הד האנטר דמו 2»); `QA_AUTO_NDA_OWNER` (role of the job owner, default `company`) + `_OWNER_NAME` (default «סופר פארם»); `QA_AUTO_NDA_JOB` (default `/collaborations/fedc4b3d-3de6-414e-9821-af96a34469ae`) + `_JOB_TITLE` (default «QA 0711 משרה חברה»); `QA_AUTO_NDA_APPROVE=1` — owner approves (CONSUMES the pair for 3 months; without it the pair stays pending and the test is repeatable).
**Steps / Expected:** HN-4-1. Skips if the hunter's composer is enabled without a waiting bar (NDA already in force).
**Leaves:** a pending NDA (or, with APPROVE, an NDA in force for 3 months). No messages are sent.

#### 4.2 Hunter → anonymous talent profile → «שליחת הודעה» → «פתיחת שיחה»: waiting bar «ממתינים לאישור של טאלנט אנונימי ל-NDA», composer blocked @desktop @data #0224f4
**Case:** HN-4-2 · **File:** `tests/hunter-nda/auto-nda-talent.spec.ts` (written 2026-11-08, NOT run)
**Env:** `QA_AUTO_NDA_TALENT=1`; `QA_AUTO_NDA_TALENT_HUNTER` (default `hunter_plus`); `QA_AUTO_NDA_TALENT_PROFILE` (default `/profile/af9b38c2-6897-43d3-8cb2-340fbf43312c` — U-50, already pending with claude-test, so the default run is idempotent; for a true first contact pass another anonymous talent).
**Leaves:** a pending NDA with the talent (if it did not exist), possibly a new empty conversation.

**Not automated (#0224f4/#1d9069):** 3-day reminder, renewal «חידוש ל-3 חודשים», expiry/red date (need a DB date shift), e-mail reminder (not deployed), en/ru/ar of the bars (screenshot `0224f4-r2-hunter-nda-details-en-desktop.png` — reference only), hunter ↔ hunter first contact from a job (no free pair; 4.1 covers it when `QA_AUTO_NDA_OWNER` is a headhunter).
