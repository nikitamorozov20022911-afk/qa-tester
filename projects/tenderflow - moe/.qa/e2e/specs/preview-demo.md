<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Preview демо-среда — план автотестов (#343d8d)

Адрес Preview — env `PREVIEW_URL` (по умолчанию https://tenderflow-web-staging-obpygl1k7-aviels-projects.vercel.app); тесты ходят по абсолютным URL, baseURL не меняется. Основной staging — `QA_BASE_URL`/baseURL. Всё только чтение, @prod-safe. Без точных чисел и дат (сид относительный). Тест-файл: `tests/preview-demo/preview-demo.spec.ts` (написан вручную, запасной путь).

### 1. Preview — демо-среда
**Seed:** `tests/seed.spec.ts` (гость)

#### 1.1 PD-01 анонимный заход остаётся на Preview, виден демо-вход (#343d8d) @desktop @prod-safe
**Device:** desktop
**Users:** guest
**Steps:**
1. Открыть Preview-URL.
**Expected:**
- Хост не меняется, видна кнопка «כניסה לסביבת ההדגמה» (реджект 1).

#### 1.2 PD-02 экран входа: TAQO, нет «Tenderflow IL» (#343d8d) @desktop @prod-safe
**Device:** desktop
**Users:** guest
**Steps:**
1. Открыть /login Preview.
**Expected:**
- title «TAQO», текст «TAQO» есть, «Tenderflow IL» нет (реджект 2).

#### 1.3 PD-03 демо-вход → фид «נתוני הדגמה», ≥1 тендер (#343d8d) @desktop @prod-safe
**Device:** desktop
**Users:** guest → демо
**Steps:**
1. Нажать «כניסה לסביבת ההדגמה».
**Expected:**
- Маркер «נתוני הדגמה», ≥1 ссылка на тендер, «Tenderflow IL» нет.

#### 1.4 PD-04 баннер на всех 5 вкладках тендера (#343d8d) @desktop @prod-safe
**Device:** desktop
**Users:** демо
**Steps:**
1. Открыть первый тендер; пройти 5 вкладок.
**Expected:**
- Баннер «נתוני הדגמה שמורים…» на каждой; «Tenderflow IL» нет.

#### 1.5 PD-05 профиль без «Tenderflow IL» (#343d8d) @desktop @prod-safe
**Device:** desktop
**Users:** демо
**Steps:**
1. Открыть /onboarding, пройти 4 вкладки.
**Expected:**
- «אופק מערכות — הדגמה»; «Tenderflow IL» нет.

#### 1.6 PD-06 сохранность: reload и выход/вход (#343d8d) @desktop @prod-safe
**Device:** desktop
**Users:** демо
**Steps:**
1. Запомнить заголовки тендеров; reload; выйти и войти снова.
**Expected:**
- Те же тендеры и маркер «נתוני הדגמה».

#### 1.7 PD-07 основной staging без демо-входа (#343d8d) @desktop @prod-safe
**Device:** desktop
**Users:** guest
**Steps:**
1. Открыть /login основного staging.
**Expected:**
- Нет «כניסה לסביבת ההדגמה»; есть «TAQO»; нет «Tenderflow IL».

#### 1.8 PD-M1 390 без горизонтальной прокрутки (#343d8d) @mobile @prod-safe
**Device:** mobile
**Users:** guest → демо
**Steps:**
1. Открыть login, фид, тендер, /onboarding.
**Expected:**
- scrollWidth ≤ clientWidth на каждом экране.
