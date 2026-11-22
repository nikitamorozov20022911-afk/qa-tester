<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Landing pages on phones: no horizontal scroll, titles/CTAs fit (2026-10-22)

STATUS: READY — #f15f60 (6eb28d099f84d82fc6f15f60), #5200a6 (6d9b8a0d625d7783775200a6), #851043 (015b31d30c9959750d851043) passed QA 22.10, user moved them to «הושלם» 2026-10-22. Not generated yet.
Sources: #f15f60 «needed» + reject rej_4bbf60a4 (all 4 «מה Hunters מציעה» card titles fully visible, card ≤ column width, no horizontal scroll at 320/375/412 in he/en/ru/ar); #5200a6 «needed» + reject rej_0da5c29e («nothing is wider than the screen … Done when /ru/headhunters, /ru/about and /ru/privacy at 375 and 412 px have no cut text and no sideways scroll»; /ru/about H1 «Приятно познакомиться!» fully visible with «!» at 320/375/412); #851043 «needed» («No horizontal page scroll at 320px in all languages: the testimonials title wraps and the arrows fit …; the job cards carousel scrolls inside its own container»). Evidence: `.qa/screenshots/f15f60-*.png`, `5200a6-*.png`, `851043-*.png` (22.10: 320/375/412 he/en/ru/ar scrollWidth = innerWidth).
Rules: guest only; read-only `@prod-safe`; no fixed waits / `networkidle` (wait for the section heading, then `scrollIntoViewIfNeeded` to trigger lazy content); language URLs: he `/…`, en `/en/…`, ru `/ru/…`, ar `/ar/…`.
Measurements: page overflow = `document.documentElement.scrollWidth - window.innerWidth` must be ≤ 0; element fits = boundingBox `x ≥ 0` and `x + width ≤ innerWidth` (+1px tolerance); text not cut = `el.scrollWidth ≤ el.clientWidth + 1`.
320px: done in the `android` project with `page.setViewportSize({ width: 320, height: 640 })` at test start (tagged `@android`).
Out of scope (separate findings 22.10): card 3 mock «+ Новый» overlaps «Предложить кандидата» at 320; /talents job card empty space; FAQ button ru 320.

---

### 1. /headhunters feature cards «מה Hunters מציעה» (#f15f60)
**Seed:** `tests/seed.spec.ts`

#### 1.1 Card titles fully visible, page not wider than the screen (375/412, 4 languages) @mobile @prod-safe #f15f60
**Status:** READY · **File:** `tests/landing-mobile/headhunters-feature-cards-fit.spec.ts`
**Device:** mobile (iphone 375 + android 412) · **Users:** guest
**Steps:**
1. For he, en, ru, ar open `/headhunters` (`/en/headhunters`, …).
2. Scroll to the dark cards section («מה Hunters מציעה» / «Что вам предлагает Hunters?» / en / ar heading); read the 4 cards and their H3 titles.
**Expected:**
- Page overflow ≤ 0. (reject rej_4bbf60a4 «no horizontal scroll … page width = screen width»)
- Each card fits the viewport; each H3 lies inside its card (h3 box within card box) and is not cut (scrollWidth ≤ clientWidth + 1); long titles wrap (height > one line allowed). (source: «needed» #f15f60 «all 4 card titles … fully visible in all languages»)
- Worst cases present and fully visible: ru «Сотрудничество с другими хедхантерами», he «צ’אטים עם הד האנטרים, חברות וטאלנטים», en «Promotion and distribution».

#### 1.2 Same at 320 px @android @prod-safe #f15f60
**Status:** READY · **File:** `tests/landing-mobile/headhunters-feature-cards-fit-320.spec.ts`
**Device:** android (viewport 320×640) · **Users:** guest
**Steps / Expected:** as 1.1 at 320 px; additionally each card width ≤ 288 px (column at 320 = 320 − 2×16). (reject rej_4bbf60a4 «card ≤ column (288 at 320)»)

---

### 2. Russian CTAs and headings (#5200a6)
**Seed:** `tests/seed.spec.ts`

#### 2.1 /ru/headhunters, /ru/about, /ru/privacy: no cut text, no sideways scroll (375/412) @mobile @prod-safe #5200a6
**Status:** READY · **File:** `tests/landing-mobile/ru-cta-headings-fit.spec.ts`
**Device:** mobile · **Users:** guest
**Steps:**
1. Open /ru/headhunters, /ru/about, /ru/privacy; on each scroll top → bottom.
2. Measure: all buttons/links with text «Начать бесплатный пробный период»; /ru/about H1 «Приятно познакомиться!» and H2 «30 дней бесплатно и без обязательств»; /ru/privacy H1 «Политика конфиденциальности».
**Expected:**
- Page overflow ≤ 0 on each page. (source: «needed» #5200a6)
- Each CTA width ≤ innerWidth − 32 and fits the viewport. («buttons … never exceed the viewport minus the 16px side padding»)
- H1/H2 fit the viewport and are not cut (scrollWidth ≤ clientWidth + 1); the H1 text content still ends with «!». (reject rej_0da5c29e)

#### 2.2 Same three pages at 320 px + control languages @android @prod-safe #5200a6
**Status:** READY · **File:** `tests/landing-mobile/ru-cta-headings-fit-320.spec.ts`
**Device:** android (320×640) · **Users:** guest
**Steps:**
1. As 2.1 at 320 px.
2. Control: /headhunters, /about, /privacy in he, en, ar at 320 px — page overflow only.
**Expected:**
- As 2.1 (CTA ≤ 288 px). (reject rej_0da5c29e «three pages @320/375/412 without cut text and scroll»)
- Control pages: overflow ≤ 0. («in every language»)

---

### 3. Home testimonials arrows and /talents job carousel at 320 px (#851043)
**Seed:** `tests/seed.spec.ts`

#### 3.1 Home and /talents at 320 px in 4 languages: no sideways scroll, arrows on screen @android @prod-safe #851043
**Status:** READY · **File:** `tests/landing-mobile/home-talents-320-no-overflow.spec.ts`
**Device:** android (320×640) · **Users:** guest
**Steps:**
1. For he, en, ru, ar open the home page; scroll to the testimonials block («Пользователи Hunters делятся опытом» in ru); read the two carousel arrow buttons.
2. Click the «next» arrow once, then «previous» once.
3. For he, en, ru, ar open `/talents`; scroll through the job cards carousel.
**Expected:**
- Page overflow ≤ 0 on every page. (source: «needed» #851043 «No horizontal page scroll at 320px in all languages»)
- Both arrows fully inside the viewport (x ≥ 0, right ≤ 320). («the arrows fit»)
- Step 2: the visible testimonial card changes after «next» and returns after «previous» (regression #39a438).
- /talents: the carousel container may have its own `scrollWidth > clientWidth`, but the page itself does not. («the job cards carousel scrolls inside its own container»)

#### 3.2 Control at 375/412 @mobile @prod-safe #851043
**Status:** READY · **File:** `tests/landing-mobile/home-talents-no-overflow.spec.ts`
**Device:** mobile · **Users:** guest
**Steps / Expected:** home and /talents in ru and he: page overflow ≤ 0; testimonial arrows inside the viewport.
