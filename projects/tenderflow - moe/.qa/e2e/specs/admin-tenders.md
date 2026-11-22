<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Admin: ניהול מכרזים שנקלטו (#662546)
Среда: staging https://tenderflow-web-staging.vercel.app. Fallback-путь (официальных агентов нет): тесты написаны напрямую в `tests/admin-tenders/`. Кейсы: `.qa/tests/admin-tenders/ADT-01..09`.
Платформенные тесты (platform admin) — serial, одно окно на файл, запуск только с `--workers=1`, не параллелить с другими platform-тестами.
Без `waitForTimeout`; данные не создаются и не меняются; «ניסיון חוזר» не нажимается; QA-T2/QA-T3 не в сбое — сбойные строки не требуются.

### 1. Admin tenders — מסך ניהול מכרזים שנקלטו (platform)
**Seed:** `tests/seed.spec.ts` (сессия `auth/platform.json` через storageState)

#### 1.1 רשימת המכרזים נטענת עם העמודות מכרז, חברה, מקור, מצב, פירוט #662546 @desktop @prod-safe
**Device:** desktop  **Users:** platform  **File:** `tests/admin-tenders/admin-tenders-view.spec.ts`
**Steps:** 1. /admin/tenders. 2. Прочитать колонки и ссылки в строках.
**Expected:** h1, 5 колонок, ≥1 строка, «פרטי מכרז» в каждой (דרישות 1, 4).

#### 1.2 סינון לפי מצב קליטה … #662546 @desktop @prod-safe
**Steps:** выбрать «תקין», «ממתין לניתוח», «כל המצבים». **Expected:** 5 опций; строки только выбранного состояния; QA-T6 в «תקין»; возврат числа (דרישה 8).

#### 1.3 חיפוש לפי שם מכרז או חברה … #662546 @desktop @prod-safe
**Steps:** ввести «QA-T6 upload», очистить, «QA-Co-B». **Expected:** сужение и возврат (поиск).

#### 1.4 «פרטי מכרז» בשורה פותח /admin/tenders/<id> … #662546 @desktop @prod-safe
**Steps:** клик → F5 → «חזרה למכרזים שנקלטו». **Expected:** URL /admin/tenders/<id> (не /admin); «פרטי מכרז שנקלט», חברה, מקור, נקלט בתאריך, מצב קליטה, מצב ניתוח; F5 остаётся (דרישה 10).

#### 1.5 כניסה ישירה ל-/tenders/<id>/analysis … #662546 @desktop @prod-safe
**Expected:** редирект на админ-страницу деталей.

#### 1.6 «לטיפול» → «מעבר לפרטי המכרז» … #662546 @desktop @prod-safe
**Expected:** модалка и переход на /admin/tenders/<id>; нет строки «לטיפול» → test.skip с сообщением (דרישות 9, 10).

#### 1.7 המסך לא שינה שום נתון בשרת #662546 @desktop @prod-safe
**Expected:** нет не-GET запросов к supabase (кроме auth).

### 2. Admin tenders — הרשאות
**Seed:** `tests/seed.admin.spec.ts` / `tests/seed.user.spec.ts` / `tests/seed.spec.ts` (гость)  **File:** `tests/admin-tenders/admin-tenders-access.spec.ts`

#### 2.1 מנהל חשבון / משתמש רגיל ב-/admin/tenders וב-/admin/tenders/<id> … #662546 @desktop @prod-safe
**Expected:** «אין לך הרשאה למסך זה», «המסך זמין למנהלי מערכת בלבד.», нет данных тендера (4 теста).

#### 2.2 אורח … מועבר ל-/login #662546 @desktop @prod-safe
**Expected:** /login (2 теста).

### 3. Admin tenders — מובייל
**Seed:** `tests/seed.spec.ts`  **File:** `tests/admin-tenders/admin-tenders-mobile.spec.ts`

#### 3.1 במובייל 390px: מעבר מ«פרטי מכרז» לדף הפרטים … #662546 @mobile @prod-safe
**Device:** mobile (390×844 в контексте)  **Users:** platform  **Expected:** детали открыты, страница без горизонтального скролла.
