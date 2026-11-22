<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Notification reasons follow the UI language (2026-10-28)

STATUS: **READY** — Ticket #0b7429 (f4cb6b9ba6e735a1060b7429) «NDA refused notification: the reason stays in Hebrew in English / Russian». Passed QA 28.10.2026 (user confirmed «עבר QA»).
Source of expectations: ticket «מה רצוי» — «The reason in the notification is shown in the user's interface language, exactly like on the application card … The same for every reason from the lists (NDA refusal reasons and candidate rejection reasons) in all notifications; a free-text «אחר» reason is shown as typed.»
Brief: `.qa/research/0b7429.md`. Evidence: `.qa/screenshots/0b7429-bell-{he,en,ru,ar}-desktop.png`, `0b7429-card-{he,en,ru,ar}-desktop.png`, `0b7429-candidate-rejected-owner-desktop.png`.
Cases: `.qa/tests/notification-reasons-i18n/NR-1-1.md` … `NR-1-3.md`.

Rules for all tests in this file:
- READ ONLY. Saved session per role (seed). Locale ONLY via URL prefix: he = no prefix, `/en`, `/ru`, `/ar` — do not use the language switcher (it saves the user's setting).
- Open the bell panel (button whose accessible name starts with «התראות» / "Notifications" / localized) only to read it. Do NOT click notification items, «Notification settings», «mark all as read» or anything inside a notification (avoid marking them read / changing data).
- The notification may be low in the scrollable bell list → locate it by text inside the panel and `scrollIntoViewIfNeeded()` before `toBeVisible()`.
- On the application card: only open and read; do NOT click «Send message», status buttons, «סימון כ„נדחה/תה"», answer/request buttons.
- No `waitForTimeout` / `networkidle`; wait via `expect(...)`.
- Data guard: if the notification for the referenced application is missing (data cleaned) → `test.skip` with annotation «0b7429 data changed», do not weaken the expectations.
- Not automated: tender-offer rejection reason (no data), e-mail language (dev note, out of ticket).

---

### 1. Notification reasons i18n
**Seed:** `tests/seed.talent_2.spec.ts` (1.1), `tests/seed.hunter_plus.spec.ts` (1.2, 1.3)

#### 1.1 NDA-refusal reason in the talent bell follows the UI language and matches the card @desktop @prod-safe #0b7429
**Status:** READY · **Case:** `.qa/tests/notification-reasons-i18n/NR-1-1.md` · **File:** `tests/notification-reasons-i18n/nda-refusal-reason-follows-ui-language.spec.ts`
**Seed:** `tests/seed.talent_2.spec.ts`
**Device:** desktop
**Users:** talent_2 (demo-talent-2)
Data: J-49 «QA company post test», anonymous application 45967f8d-0a50-4d8d-8fa2-a061c166effe with the talent's NDA; owner «סופר פארם» refused to sign with reason «מוקדם מדי בתהליך הגיוס». The company name «סופר פארם» stays Hebrew in every language (user data — not checked).
**Steps:** for each locale in [he (`/`), en (`/en`), ru (`/ru`), ar (`/ar`)]:
1. Open the locale's jobs page (`/jobs`, `/en/jobs`, `/ru/jobs`, `/ar/jobs`).
2. Open the bell panel in the header.
3. Find the NDA-refusal notification about «QA company post test» (text contains «QA company post test» and the localized "didn't sign your NDA" wording, e.g. en «didn't sign your NDA»).
4. Read its reason line.
5. Close the bell (Escape). Open the application on J-49 (job card «QA company post test» / J-49 → the talent's application card) and read the NDA-refusal reason on the card.
**Expected:**
- he: notification reason = «מוקדם מדי בתהליך הגיוס».
- en: notification contains «Reason: Too early in the hiring process».
- ru: notification contains «Причина: Слишком рано в процессе найма».
- ar: notification contains «مبكر جدًا في عملية التوظيف».
- In en/ru/ar the notification does NOT contain «מוקדם מדי בתהליך הגיוס».
- In each locale the reason on the application card is the same localized string as in the bell. (source: «מה רצוי»: «shown in the user's interface language, exactly like on the application card»; Done when: «switching the talent's language to en/ru/ar shows the reason in that language in the bell»)

#### 1.2 Candidate-rejection reason in the headhunter bell follows the UI language and matches the card @desktop @prod-safe #0b7429
**Status:** READY · **Case:** `.qa/tests/notification-reasons-i18n/NR-1-2.md` · **File:** `tests/notification-reasons-i18n/candidate-rejection-reason-follows-ui-language.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus (claude-test)
Data: J-49 «QA company post test», application 3d5257f9-f9fa-460c-8ffd-3b7960d16b4d of candidate «QA-AUTO 2810 cea191 job», rejected by the owner 28.10 with reason «ציפיות השכר גבוהות מהתקציב». KEEP — do not change.
**Steps:** for each locale in [he, en, ru, ar]:
1. Open the locale's jobs page (`/jobs`, `/en/jobs`, `/ru/jobs`, `/ar/jobs`).
2. Open the bell panel.
3. Find the status notification that contains «QA-AUTO 2810 cea191 job» and «QA company post test» and the rejected status (en «Rejected»).
4. Read its reason line.
5. Close the bell. Open «My candidates» (`/my-candidates` with the locale prefix) → the submission «QA-AUTO 2810 cea191 job» on J-49 → dialog «Submission: QA-AUTO 2810 cea191 job» (localized). Read the reason under the «Rejected» step in «Candidate status».
**Expected:**
- he: reason = «ציפיות השכר גבוהות מהתקציב».
- en: notification contains «Reason: The salary expectations are above the budget»; status «Rejected».
- ru: notification contains «Причина: Ожидания по зарплате выше бюджета».
- ar: notification contains «توقعات الراتب أعلى من الميزانية».
- In en/ru/ar the notification does NOT contain «ציפיות השכר גבוהות מהתקציב».
- In each locale the reason under «Rejected» on the card equals the bell reason. (source: «מה רצוי»: «The same for every reason from the lists (… candidate rejection reasons) in all notifications»)

#### 1.3 Free-text «אחר» rejection reason stays as typed in every language @desktop @prod-safe #0b7429
**Status:** READY · **Case:** `.qa/tests/notification-reasons-i18n/NR-1-3.md` · **File:** `tests/notification-reasons-i18n/free-text-reason-stays-as-typed.spec.ts`
**Seed:** `tests/seed.hunter_plus.spec.ts`
**Device:** desktop
**Users:** hunter_plus (claude-test)
Data: rejection with «אחר» and free text «QA-AUTO 2110 tsub — סיבת דחייה לבדיקה» (notification in claude-test's bell). KEEP.
**Steps:** for each locale in [he, en, ru, ar]:
1. Open the locale's jobs page.
2. Open the bell panel.
3. Find the rejection notification whose reason contains «סיבת דחייה לבדיקה».
**Expected:**
- In he/en/ru/ar the reason text is exactly «QA-AUTO 2110 tsub — סיבת דחייה לבדיקה» (not translated, not replaced by a list value, not empty).
- The surrounding notification text is localized (en: contains «Reason:», ru: contains «Причина:»). (source: «מה רצוי»: «a free-text «אחר» reason is shown as typed»)
