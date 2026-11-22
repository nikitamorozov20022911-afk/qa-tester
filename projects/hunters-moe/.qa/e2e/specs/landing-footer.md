<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Landing footer & /about links (2026-10-21)

STATUS: **READY** — Ticket #1afa56 (beea79b59778b8d2bd1afa56) «Footer social icons and founders' LinkedIn links on /about point to "#"». Passed QA 21.10.2026 (user moved to «הושלם»). Reject 1701e421 allowed hiding links until the client sends real URLs — the tests accept "hidden" OR "real URL", never "#".
Source of expectations: reject 1701e421 «needed behavior». Evidence: `.qa/screenshots/2026-10-21/1afa56-*.png`.
Updated 2026-10-22: section 2 (#274d95 footer description instead of Lorem Ipsum, he/en/ru/ar) added — READY (passed QA 22.10, user moved to «הושלם» 2026-10-22).
Updated 2026-10-28: section 3 (#a953ab footer without template «MentMe» content, he/en/ru/ar, guest + talent cabinet, desktop + iPhone 375) added — READY (user moved to «עבר QA» 28.10). Sections 1 and 2 are NOT duplicated: «#»-links, social icons, horizontal scroll on / and /about, Lorem — stay there.
Rules: guest only (no storageState) — except 2.3 (one role per file, company_6); no fixed waits / networkidle — wait for results via expect(); read-only (no @data). Do not run — only /qa-regress runs tests.

---

### 1. Landing footer and about links
**Seed:** `tests/seed.spec.ts` (guest)

#### 1.1 No link points to "#" on public pages @desktop @prod-safe (#1afa56)
**Device:** desktop · **Users:** guest · **Case:** `.qa/tests/landing-footer/LF-1-1.md`
**Steps:**
1. Open / as guest.
2. Count links with href exactly "#" or ending with "/#" in the whole page (header, body, footer).
3. Repeat for /about, /headhunters, /talents, /organizations.
**Expected:**
- On each of the 5 pages the count of a[href="#"] (and hrefs ending "/#") is 0.
- The footer is visible on each page.
- (source: reject 1701e421 «needed behavior»)

#### 1.2 Footer social icons are real profiles or hidden @desktop @prod-safe (#1afa56)
**Device:** desktop · **Users:** guest · **Case:** `.qa/tests/landing-footer/LF-1-2.md`
**Steps:**
1. Open / as guest and scroll to the footer.
2. Collect footer links whose accessible name or href mentions YouTube / Instagram / TikTok / Facebook / LinkedIn.
3. Repeat on /about.
**Expected:**
- Every such link (if any is shown) has an https:// href to the network's domain (not "#", not empty).
- Every such link opens in a new tab: target="_blank" and rel contains "noopener".
- Zero such links is valid (icons hidden until the client sends URLs — allowed by the reject).
- (source: reject 1701e421 «needed behavior»)

#### 1.3 Founders LinkedIn links on about page are real or removed @desktop @prod-safe (#1afa56)
**Device:** desktop · **Users:** guest · **Case:** `.qa/tests/landing-footer/LF-1-3.md`
**Steps:**
1. Open /about as guest.
2. Scroll to «נעים להכיר!» (founders block).
3. Look for links «בת אל הוד ב-LinkedIn» and «חלי קרן ב-LinkedIn».
**Expected:**
- Each of the two links is either absent, or has href starting with https://www.linkedin.com/ (never "#").
- No link in the founders block has href="#".
- (source: reject 1701e421 «needed behavior»)

#### 1.4 Footer and about page have no horizontal scroll on phone @mobile @prod-safe (#1afa56)
**Device:** mobile · **Users:** guest · **Case:** `.qa/tests/landing-footer/LF-1-4.md`
**Steps:**
1. Open / as guest on a phone (iPhone 375 / Pixel 412).
2. Scroll to the footer.
3. Open /about and scroll through the founders block to the footer.
**Expected:**
- On / and /about: document.documentElement.scrollWidth <= window.innerWidth (no horizontal page scroll).
- Footer has no a[href="#"].
- (source: reject 1701e421 «needed behavior»)
**Note:** Do not extend to /headhunters on mobile: open finding d9ffaa-finding-hscroll-mobile (separate issue, not part of this ticket).

---

### 2. Footer description under the logo (#274d95)
**Seed:** `tests/seed.spec.ts` (guest); 2.3 — `tests/seed.company_6.spec.ts`

Source: ticket «What is needed» #274d95 — «A real short description of Hunters in the footer in every language (text from the client), or the paragraph removed until the text is provided.» Developer note 22.10: real description in he/en/ru/ar (client may replace it — #6bf9bb), so tests do NOT assert the exact wording. Evidence: `.qa/screenshots/274d95-*.png`.
Language URLs: he `/`, en `/en`, ru `/ru`, ar `/ar` (+ `/login`, `/en/login`, …).
Placeholder pattern P = `/lorem|ipsum|dolor sit|consectetur|לורם|איפסום|דולור|Лорем|ипсум/i`.
Out of scope (separate open findings 22.10): footer columns «קישורים / מקצועות» copied from another project; Lorem in testimonials.

#### 2.1 Footer paragraph is a real description in each language (/ and /login) @desktop @prod-safe #274d95
**Status:** READY · **File:** `tests/landing-footer/footer-description-no-lorem.spec.ts`
**Device:** desktop · **Users:** guest
**Steps:**
1. For each language (he, en, ru, ar) open the home page and the login page.
2. Scroll to the footer; read the paragraph under the Hunters logo (if any) and the whole footer text.
**Expected:**
- The whole footer text does not match P. (source: «What is needed» #274d95)
- If the paragraph exists: non-empty, contains «Hunters», and is in the page language — he: contains Hebrew letters; ar: contains Arabic letters; ru: contains Cyrillic; en: no Hebrew/Cyrillic/Arabic letters. Paragraph absent is also valid.
- Footer bottom line «© <year> Hunters» and links «תנאי שימוש» / «פרטיות» are still present (regression #bc5433/#beea79 — do not assert the year value).

#### 2.2 Footer paragraph on iPhone: no Lorem, no horizontal scroll @iphone @prod-safe #274d95
**Status:** READY · **File:** `tests/landing-footer/footer-description-iphone.spec.ts`
**Device:** iphone · **Users:** guest
**Steps:**
1. For he, en, ru, ar open the home page and the login page; scroll to the footer.
**Expected:**
- Footer text does not match P; the paragraph (if shown) follows the same language rule as 2.1. (source: «What is needed»)
- `document.documentElement.scrollWidth <= window.innerWidth` on each page.

#### 2.3 Logged-in pages show the same real footer description @desktop @prod-safe #274d95
**Status:** READY · **File:** `tests/landing-footer/footer-description-logged-in.spec.ts`
**Seed:** `tests/seed.company_6.spec.ts` · **Device:** desktop · **Users:** company_6
**Steps:**
1. Open /profile and /collaborations (Hebrew); scroll to the footer.
**Expected:**
- Footer text does not match P; the paragraph (if shown) contains «Hunters» and Hebrew letters. (source: «What is needed» «on every page … guest and logged-in»)

---

### 3. Footer without template content of another product (#a953ab)
**Seed:** `tests/seed.spec.ts` (guest); 3.6 — `tests/seed.talent.spec.ts` (talent = demo-talent-1)

Source: ticket #a953ab «מה רצוי» AC1–AC6 + developer note 26.10 («footer links only to real Hunters pages: headhunters, organizations, talents, join / log in (my account when signed in), about, contact, FAQ»). Evidence: `.qa/screenshots/a953ab-*.png`.
Language URLs: he `/`, en `/en`, ru `/ru`, ar `/ar` (+ `/<lang>/about`, `/<lang>/login` … ; if a path has no prefix route — switch via the header language switcher). Footer = `getByRole('contentinfo')` (or the `footer` element).
Public pages PUB = `/`, `/about`, `/headhunters`, `/talents`, `/organizations`, `/login` (not `/faq` — it redirects guests to /login, separate finding 28.10).
Template pattern T = `/mentme|mentors?\b|forum|blog|my orders|מנטור|פורום|בלוג|ההזמנות שלי|ментор|форум|блог|мои заказы|المرشدين|منتدى|مدونة|طلباتي/i`.
Professions pattern PR = `/professions|מקצועות|профессии|المهن/i`; template profession items: Development, Design, Information Sciences, Marketing, Product Management / פיתוח, עיצוב, מערכות מידע, שיווק, ניהול מוצר.
Out of scope (separate findings 28.10, do NOT assert): logged-in user on public pages sees guest footer «הרשמה/התחברות» instead of «my account»; footer links 21px tall on mobile; /faq redirect; /contact no confirmation.
All tests read-only → `@prod-safe`, no `@data`. No fixed waits / networkidle.

#### 3.1 No MentMe or template links in footer and page HTML in 4 languages @desktop @prod-safe #a953ab
**Status:** READY · **File:** `tests/landing-footer/footer-no-mentme-template-links.spec.ts` · **Case:** `.qa/tests/landing-footer/LF-3-1.md`
**Device:** desktop · **Users:** guest
**Steps:**
1. For each language he, en, ru, ar open every page of PUB.
2. Scroll to the footer; read the footer text and the accessible names of all footer links.
3. Read the page HTML (`page.content()`).
**Expected:**
- `page.content()` does not match `/mentme/i` on any page (source: AC1 «המילה "MentMe" אינה מופיעה בשום מקום באתר, באף שפה»).
- Footer text does not match T (source: AC2 «הוסרו הקישורים שאינם רלוונטיים: מנטורים, פורום, בלוג, ההזמנות שלי»; AC6 all four languages).
- No footer link href contains `/mentors`, `/forum`, `/blog`, `/orders`, `/my-orders`.

#### 3.2 Footer has no Professions block in 4 languages @desktop @prod-safe #a953ab
**Status:** READY · **File:** `tests/landing-footer/footer-no-professions-block.spec.ts` · **Case:** `.qa/tests/landing-footer/LF-3-2.md`
**Device:** desktop · **Users:** guest
**Steps:**
1. For he, en, ru, ar open `/` and `/login`; scroll to the footer.
2. Look in the footer for a heading/group matching PR and for links named like the template profession items.
**Expected:**
- Footer text does not match PR.
- Footer has 0 links whose name equals any template profession item (any language).
- (source: AC4 «רשימת המקצועות בפווטר — או מוסרת, או נשלפת מרשימת תחומי ההתמחות של ה-Admin»; developer 26.10: professions removed)

#### 3.3 Every footer link opens an existing page with a non-empty H1 @desktop @prod-safe #a953ab
**Status:** READY · **File:** `tests/landing-footer/footer-links-lead-to-existing-pages.spec.ts` · **Case:** `.qa/tests/landing-footer/LF-3-3.md`
**Device:** desktop · **Users:** guest
**Steps:**
1. For he, en, ru, ar open `/`; scroll to the footer.
2. Collect unique hrefs of footer links on the same origin (skip `mailto:`, `tel:` and external social links — covered by 1.2).
3. Open each href (`const resp = await page.goto(href)`).
**Expected:**
- Every footer link has a non-empty href that is not `#`.
- `resp.status()` is 200 for every href (redirect ending on a 200 page is allowed).
- The opened page has a visible `h1` with non-empty text; the `h1` and `document.title` do not match `/404|not found|לא נמצא|не найден|غير موجود/i` (no soft-404).
- (source: AC5 «הקישורים שנשארים בפווטר מובילים ליעד קיים»; AC6; developer note «Verify every footer link in he/en/ru/ar»)

#### 3.4 Footer has no duplicate links in 4 languages @desktop @prod-safe #a953ab
**Status:** READY · **File:** `tests/landing-footer/footer-no-duplicate-links.spec.ts` · **Case:** `.qa/tests/landing-footer/LF-3-4.md`
**Device:** desktop · **Users:** guest
**Steps:**
1. For he, en, ru, ar open `/` and `/about`; scroll to the footer.
2. Collect footer links with non-empty visible text: text (trimmed, lower-case) and href (without trailing `/`).
**Expected:**
- No two footer links have the same text (before the fix «כל המנטורים / All mentors» appeared twice).
- No two text links have the same href. Logo and icon-only links are excluded.
- (source: AC3 «אין כפילויות בפווטר»)

#### 3.5 Footer at 375 px has no horizontal overflow and no template content @iphone @prod-safe #a953ab
**Status:** READY · **File:** `tests/landing-footer/footer-375-no-overflow-no-template.spec.ts` · **Case:** `.qa/tests/landing-footer/LF-3-5.md`
**Device:** iphone (iPhone 13 Mini, 375 px) · **Users:** guest
**Steps:**
1. For he, en, ru, ar open `/` and `/login`; scroll to the footer.
2. Measure page width and footer width; read the footer text.
**Expected:**
- `document.documentElement.scrollWidth <= window.innerWidth` on each page.
- Footer `scrollWidth <= clientWidth`.
- Footer text does not match T and does not match PR.
- (source: AC1, AC2, AC4, AC6; ticket scenario — footer on phone 375)
- Not asserted: tap-target height of footer links (separate finding).

#### 3.6 Talent cabinet footer has no template content in 4 languages @desktop @prod-safe #a953ab
**Status:** READY · **File:** `tests/landing-footer/footer-talent-cabinet-no-template.spec.ts` · **Case:** `.qa/tests/landing-footer/LF-3-6.md`
**Seed:** `tests/seed.talent.spec.ts` · **Device:** desktop · **Users:** talent (demo-talent-1, storageState `../auth/talent.json`)
**Steps:**
1. Open the cabinet `/profile` (he); scroll to the footer.
2. Switch to en, ru, ar (header language switcher or `/<lang>/profile`) and repeat.
3. Read the footer text, footer link names/hrefs and the page HTML.
**Expected:**
- `page.content()` does not match `/mentme/i`.
- Footer text does not match T or PR.
- No two footer text links share the same text; every footer link href is non-empty and not `#`.
- (source: AC1–AC3, AC6 — «on every page», logged-in included per developer note)
- Not asserted: «my account» instead of «הרשמה/התחברות» on public pages for a logged-in user (open finding 28.10).

