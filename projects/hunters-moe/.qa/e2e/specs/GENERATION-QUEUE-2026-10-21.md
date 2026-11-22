# Очередь генерации автотестов (21.10)
Генератор: project "tests"/"iphone", seedFile "tests/seed.<role>.spec.ts", запись ".qa/e2e/tests/<feature>/<name>.spec.ts". По одному генератору за раз.
- [x] landing-footer (#1afa56) — 4
- [x] landing-testimonials (#c8f678) — 3 (переписаны вручную: проверка диапазона видимых карточек)
- [x] mobile-header-menu (#1604a7) — 5 (MM-1-5: URL he поправлен на / или /he)
- [x] faq-texts (#24eb58) — 3
- [x] landing-jobs-block (#d9ffaa) — 3
- [~] organizations-landing (#b55501, #33f14b) — 6 (2 гостевых проверены, 4 вслепую) + multi-role 1
- [~] tenders-list §2–3 — §2 2.1–2.4 DONE 21.10 (4 pass, 2.5 left); (#0d978b, #9a6100) — 9 (§3 #9a6100 готово: 4 теста field-chips-*, написаны вручную headless, desktop 3/3 + iphone 1/1 прошли 21.10)
- [x] promo-filter (#521d84) — 6 (написаны вручную headless 21.10, desktop 6/6 прошли дважды, retries=0)
- [~] tender-drafts (#bc890b) — 21.10: 1.1, 1.2 written manually headless & pass (desktop 2/2, retries=0; 1.2 leaves a QA-AUTO draft per run → .qa/e2e/test-data-journal.log, drafts have no delete); left: multi-role 1.3 draft-hidden-from-others (asUser company+hunter_plus)
- [~] tender-offers (#1004e9) — 1.1 offer-amount-validation.spec.ts написан вручную headless 21.10 (company_6): прогон = SKIPPED — на /tenders нет ни одного открытого тендера-«הצעות» без предложения company_6 (все 28 проверены); тест сам ищет такой тендер и пропускается с причиной; форма вслепую (тексты из i18n сайта: кнопка «הגשת הצעה», ошибка с запятой «…שלמים, גדול מ-0»). Нужен свежий QA-AUTO тендер от company. 1.2 multi-role — pending (autotest-writer, asUser)
- [ ] планы от autotest-writer: кандидаты (10 тикетов) и тексты/админка (5) — ждут
- [ ] multi-role тесты (asUser) — писать autotest-writer
- [ ] candidacy-status (#283eb6 #3973c6 #a1dd4b) — 4
- [ ] job-drawer (#158449 #fc00c7) — 4 (J-136 НЕ чистить — тесты читают)
- [x] add-candidate (#7818c8 #344b9a) — 4 — DONE 21.10: написаны вручную headless (tests/add-candidate/, общий helpers.ts), desktop 4/4 прошли (retries=0); 1.2 создаёт «QA-AUTO 7818c8 fin <ts>» при каждом прогоне (удаления в UI нет — чистка вручную)
- [ ] candidacy-submission (#4b3041) — 2 BLOCKED: нужна активная NDA-вакансия, где hunter_plus не подписывал
- [ ] multi-role: #501d04+#3973c6, #31a764 (hunter_free станет FREE после 24.10 — лимит подач)
- [ ] english-mode (#95bd33) — 3
- [ ] system-lists (#3b5661) — 4 (админ: только своя QA-строка, урок L-20261020-1; тест 4 держится на «QA-AUTO 2110 list» + R-17 — НЕ чистить)
- [ ] glossary (#cf108e) — 6
- [x] smart-agent (#1d74c2) — 2 — DONE 21.10: написаны вручную headless, desktop 2/2 прошли (retries=0), read-only
- [ ] multi-role: admin-notifications #62222f — 2 (оставляют открытые репорты QA-AUTO-<runId>)
- [ ] copywriting.md 6.1–6.2, 1.4–1.5 — пересекаются с новыми планами, решить при генерации
- [x] tender-actions (#cf6dc1) — DONE 21.10: 3 written manually headless & pass (desktop 3/3, retries=0, 2 runs); 1.2 archives its QA-AUTO tender; 1.3 uses the bell renewal note of T-26 when T-25 has none (annotated)
- [ ] messages (#0b18b0) — 4
- [x] job-upgrade (#1396b6) — 2 (J-73, J-70 — KEEP) — DONE 21.10: написаны вручную headless, desktop 2/2 прошли (retries=0), read-only (только «לא תודה»)
- [ ] english-mode §2 (#09132b) — 1 (admin, только чтение)
- [x] add-candidate §2 (#d9db64) — 2 — DONE 21.10: написаны вручную headless, desktop 2/2 прошли (retries=0); каждый прогон создаёт кандидата QA-AUTO-d9db64-<ts> (без подачи; удаления в UI нет); фразы-отрицания «…לא צוינו» исключены из проверки слова «ניסיון»
- [ ] multi-role: #805225 (свежая NDA-вакансия — тот же подход разблокирует #4b3041), #b63fa1
- [ ] organizations-landing: 4 теста залогиненных ролей написаны вслепую — перегенерировать (seed-пути исправлены на __dirname)
- [ ] планы нужны: #8f5282 (окно оплаты сверху, @mobile, без оплаты), #63a7e8 (поиск hero → /collaborations, гость/хантер, /jobs редирект), #9116cb (анонимный чат: диалог подтверждения, нет данных; multi-role), #9a60fe (навигация 5 пунктов компании, «משרות», редиректы ?page=)
- [x] talent-onboarding (#1866b6 #ca2463 #2443cb) — DONE 21.10: 2.1, 2.2 generated & pass; — 2 for generator (§2: 2.1 #1866b6, 2.2 #ca2463; talent, read-only, seed tests/seed.talent.spec.ts) + 3 MANUAL (§1: 1.1 #1866b6, 1.2 #2443cb, 1.3 #ca2463 — need a brand-new talent, not generated; #2443cb is manual only)
- [~] talent-onboarding §3 CV upload (#1866b9) — 21.10: 3.4 generated & pass, 3.5 pass; left 3.6, 3.7, 3.3 blocked; — 2 for generator: 3.4 (talent, seed tests/seed.talent.spec.ts, read-only), 3.6 (hunter_plus, seed tests/seed.hunter_plus.spec.ts, read-only — selectors not verified); 1 WRITTEN by autotest-writer: 3.5 tests/talent-onboarding/cv-bucket-not-public.spec.ts (API, not run); 1 multi-role pending: 3.7 (hunter_plus → company 404, asUser); BLOCKED 3.3 (shared talent has no CV — needs user decision on uploading QA-AUTO CV or a talent session with CV); 2 MANUAL 3.1–3.2 (new talent)
- [~] copywriting §2.7–2.8 (#7e0769) — 21.10: 2.7 generated & pass; left 2.8; — 2 for generator (talent, read-only, @desktop @prod-safe, seed tests/seed.talent.spec.ts): 2.7 talent-profile-tab-no-collaboration-term, 2.8 talent-apply-dialog-job-manager-wording (skip+annotate if apply quota used — talent until 28.10; never submit)
- [x] onboarding-publish-removed (#9a6101 #9a6103, duplicates) — DONE 21.10: 2.1 generated & pass; — 1 for generator: 2.1 hunter-header-publish-job-available (hunter_plus, seed tests/seed.hunter_plus.spec.ts, read-only @desktop @prod-safe — do not fill/submit; generate when hunter_plus session is free) + 3 MANUAL (§1.1 talent onboarding, §1.2 hunter onboarding, §1.3 pending hunter /publish/job redirect — need new/pending accounts)
- [ ] company-onboarding (#41452a #47b00b) — 0 for generator; 2 MANUAL (§1.1 CO-1-1, §1.2 CO-1-2 — need a brand-new company). Pending: confirm in a free company session which /publish/tender step has «עד מתי המכרז תקף?» (day/month/year) and no text «חתימה» → then add read-only 2.1 (company, seed tests/seed.company.spec.ts, existing draft only, @desktop @prod-safe)

## Добавлено 22.10 (18 тикетов, прошли QA 22.10, пользователь перенёс в «הושלם»)
Правила для всей партии: одна роль на файл (Supabase ротирует refresh-токены) — межролевые сценарии только ЦЕПОЧКОЙ (`chain-<name>-<N>-<role>.spec.ts`, handoff `.qa/e2e/.handoff/<name>.json`, запуск `--workers=1` по порядку; пишет autotest-writer, не генератор — см. specs/candidacy-status.md); DEMO-* не трогать (demo-2026-10-22.md); создаваемые кандидаты — QA-AUTO + УНИКАЛЬНЫЙ телефон `uniquePhone()` ('05' + 8 последних цифр Date.now()).
- [ ] ПРЕДУСЛОВИЕ: `uniquePhone()` в tests/add-candidate/helpers.ts; заменить фиксированный 0500000098 в close-step2-confirm-not-saved.spec.ts и finish-creates-candidate-once.spec.ts (сейчас падают на проверке дубля телефона) и `050990${ts.slice(-4)}` в двух ai-*.spec.ts; candidacy-status 2.1 (#b63fa1) переписать цепочкой + уникальный телефон (asUser больше не планируем)
- [ ] avatars (#d36ad4) — 4 для генератора (talent_2 / guest / hunter_free / admin; read-only)
- [ ] admin-search (#301e98) — 4 для генератора (admin, read-only)
- [ ] candidacy-status §3 (#abe526) — 3 ЦЕПОЧКА direct-link (hunter_plus → company → hunter_plus; @data, J-49 полная подача) — autotest-writer
- [ ] candidacy-status §4 (#e9ce1c #24f795) — 3 ЦЕПОЧКА decision (hunter_plus → company → hunter_plus; @data) — autotest-writer; + 3 для генератора read-only: 4.4 hunter_free (данные 22.10 «QA-AUTO recv 850649 A1–A3/R1–R2» — НЕ чистить), 4.5 company, 4.6 company
- [ ] candidacy-status §5 (#9ac514) — 3 для генератора (company, read-only; данные 22.10 «QA-AUTO recv 112956 full cv», «… anon A2», «… anon DISC» на J-49 — НЕ чистить)
- [ ] landing-footer §2 (#274d95) — 3 для генератора (guest desktop, guest iphone, company_6)
- [ ] talent-education (#4ba724) — 2 для генератора (1.1 talent @data — добавляет и удаляет QA-AUTO-EDU; 1.2 hunter_plus read-only)
- [ ] free-limit (#437b26) — 2 для генератора (hunter_free_2, read-only; ветвление по остатку N, дата сброса — по формату, не фиксированная)
- [ ] landing-mobile (#f15f60 #5200a6 #851043) — 6 для генератора (guest; 3 × @mobile 375/412, 3 × @android с setViewportSize 320)
- [ ] submit-candidate (#7178a2 #63b8d1) — 1.1 @data (создаёт кандидата + подачу на J-36) — писать вручную на tests/add-candidate/helpers.ts; 2.1, 2.2 для генератора (project iphone, hunter_plus, без подачи)
- [ ] job-upgrade §2 (#25ee63) — 2 для генератора (hunter_plus J-70, read-only; НЕ активировать — тратит месячную квоту)
- [ ] forms-mobile (#46b93c) — 4 для генератора (project iphone: guest / hunter_plus / company / admin; ничего не сохранять)
- [ ] pending-requests (#0f3888) — 2 для генератора (1.1, 1.5 hunter_plus read-only) + 3 ЦЕПОЧКА pending (hunter_plus → company → hunter_plus; @data) — autotest-writer
- [ ] form-validation (#710d8c) — 5 для генератора (hunter_plus ×2, company ×3; без сохранения/отправки); copywriting 5.5/5.6 — тот же тикет (#4c9e57c4), не дублировать
Итого 22.10: 52 теста — 42 для генератора, 9 цепочкой (3 цепочки × 3), 1 вручную (submit-candidate 1.1), + предусловие (4 старых теста add-candidate, candidacy-status 2.1).

## Добавлено 22.10 (вечер): #bebb61, #f1f804, #541d6c (прошли QA 22.10, пользователь перенёс в «הושלם»)
Те же правила партии 22.10 (одна роль на файл, цепочки через `.qa/e2e/.handoff/`, QA-AUTO, DEMO-* не трогать).
- [ ] pending-hunter (#bebb61 #f1f804) — specs/pending-hunter.md — 5 для генератора (hunter_pending, read-only, seed `tests/seed.hunter_pending.spec.ts` — СОЗДАН 22.10): 1.1, 1.2, 1.3 @desktop, 2.1 @desktop, 2.2 @iphone (project iphone). Сессия `auth/hunter_pending.json` — ТОЛЬКО ручной вход (`npm run qa-login:manual -- hunter_pending`); при генерации НИКОГДА не нажимать «התנתקות». + 1 OPT-IN пишет autotest-writer вручную: 2.3 `tests/pending-hunter/zz-logout-ends-session.spec.ts` (skip без `QA_PENDING_LOGOUT=1`, запускать последним и отдельно — убивает сессию, потом ручной вход). + 2 MANUAL (§3: выход из шапки/бургера, повторный вход). Админ НЕ одобряет licor78065.
- [ ] tender-candidacy (#541d6c) — specs/tender-candidacy.md — 5 ЦЕПОЧКА hr-tender (company → company_6 → company → company_6 → company; @data; 2 свежих QA-AUTO-541d6c-<runId> тендера через tests/_helpers/tender-wizard.ts, шаг 5 архивирует) — autotest-writer; + 1 для генератора: 2.1 hr-legacy-offers-readable (company_6, read-only; skip, если старые ₪-предложения T-53/T-58 вычищены). Не проверять известные находки: «משרה» в текстах тендера/уведомлений, двойная строка «התבקש פרופיל מלא», пустой заголовок «הגשת מועמד:», метка «טאלנט», счётчик «מס׳ הצעות».
Итого вечер 22.10: 12 тестов — 6 для генератора, 5 цепочкой, 1 opt-in вручную; + 2 MANUAL.

## Добавлено 22.10 (ночь): #df647e, #1866ba (прошли QA 22.10, пользователь перенёс в «הושלם»)
Те же правила партии 22.10 (одна роль на файл, цепочки через `.qa/e2e/.handoff/`, QA-AUTO, DEMO-* не трогать).
- [ ] tender-offers §2–3 (#df647e) — specs/tender-offers.md — 7 для генератора (§2, desktop): 2.1, 2.2, 2.5 company_2 read-only (2.1/2.2 только «חזרה»); 2.3, 2.4 company_2 @data (решение + «ביטול ההחלטה» в окне, cleanup в afterEach, строка НЕ «הד האנטר דמו 3»; `timezoneId: 'Asia/Jerusalem'`); 2.6, 2.7 hunter_free_2 read-only. Новые денежные предложения создать нельзя (legacy после #541d6c) — тесты держатся на существующих T-35 (ожидающие) / T-13 (отклонено 22.10, срок тендера 22.10) и делают `test.skip`, если нужного предложения нет. + 5 SLOW/OPT-IN ЦЕПОЧКА offer-window (hunter_free_2 → company_2 → hunter_free_2 → company_2 → hunter_free_2; ~7 мин; skip без `QA_SLOW_OFFERS=1`; без `-x`) — autotest-writer. + 1 MANUAL (3.6 окончательное решение после окна — тратит последнее ожидающее предложение demo-hunter-3).
- [ ] talent-onboarding §4 (#1866ba) — specs/talent-onboarding.md — 3 для генератора (read-only, desktop): 4.2, 4.3 talent_new (seed `tests/seed.talent_new.spec.ts` — СОЗДАН 22.10; сессия только ручным входом `npm run qa-login:manual -- talent_new`), 4.4 hunter_plus (/profile/2bd7411d-1521-4e05-9abb-ae6e4c5c3e53). + 1 MANUAL/opt-in 4.1 (разбор CV у нового таланта — онбординг одноразовый).
Итого ночь 22.10: 15 тестов — 10 для генератора, 5 цепочкой opt-in; + 2 MANUAL.

## 2026-10-28 (планы готовы, генерация ждёт свободных браузеров — лимит 4)
- #a953ab → specs/landing-footer.md раздел 3 (6 тестов, @prod-safe)
- #cea191 → specs/candidacy-timeline.md (3 теста + цепочка timeline-job 1..3; нужен uniquePhone())
- #9dc615 → specs/tender-submissions-texts.md (7 тестов) + обновлён specs/tender-candidacy.md
- #246105 → specs/work-representation-questions.md (1 тест + цепочка wr 1..4)
После генерации — записать в backfill/ledger.json (class: qa-passed, source: qa).
- #43c7ff → specs/payment-window-cardcom.md (план пишется 28.10)
- #0b7429 → specs/notification-reasons-i18n.md (план пишется 28.10)
- #68f480 → specs/application-nda-indicator.md (план готов 28.10, 10 тестов read-only @prod-safe, к генерации)
- #ae3aed → specs/job-upgrade-distribution.md (план пишется 28.10)
- [~] #daf026 → specs/add-candidate.md обновлён 28.10: 1.1/1.2/2.1 переписаны (без выбора типа профиля, uniquePhone()); §3: 3.1–3.3 для генератора (hunter_plus, read-only @prod-safe); 3.4–3.5 ЦЕПОЧКА daf026-visibility (hunter_plus → company) НАПИСАНА autotest-writer, не прогонялась; на лечение (healer): helpers.ts fillStep1 visible, close-step2-confirm-not-saved, finish-creates-candidate-once, ai-title-summary-minimal-candidate (+ телефон в ai-submit-…); uniquePhone()/ANON_INFO добавлены в helpers.ts. Устаревшие READY-планы — список в конце specs/add-candidate.md.
- #e0e6cc → specs/job-owner-questions.md (план пишется 28.10)
- #e0e6cc → specs/job-owner-questions.md ГОТОВ (5 тестов + цепочка jq 1..6)
- #a904f9 → specs/talent-onboarding.md обновлён (28.10)
