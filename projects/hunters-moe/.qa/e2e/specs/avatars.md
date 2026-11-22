<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Default avatar is a neutral placeholder, never a stock photo (2026-10-22)

STATUS: READY — #d36ad4 (005bb1b592c8f832a2d36ad4) passed QA 22.10, user moved it to «הושלם» 2026-10-22. Not generated yet. Environment: staging https://hunters-sooty.vercel.app.
Source of expectations: ticket «What is needed» — «When the user has no picture, a neutral placeholder is shown everywhere (grey silhouette icon or initials), never a photo of a person»; developer note 22.10 «stock photos were removed». Evidence: `.qa/screenshots/d36ad4-*.png` (session.json 22.10: placeholder `/icons/onboarding/anonymous-avatar.png` everywhere; own photos kept; old URL 404).
Rules: one role per test file (Supabase rotating refresh tokens); login only via saved sessions (seed per role); no fixed waits, no `networkidle`; all tests read-only (`@prod-safe`). Never open or act on DEMO-* records (demo-2026-10-22.md).
Measurable check used everywhere: no `<img>` on the page has `src` containing `/images/app/avatar-placeholder`; avatars of users without a photo are the silhouette (`src` contains `anonymous-avatar`) or an initials element.

---

### 1. Default avatar
**Seed:** per test (see below)

#### 1.1 Talent without a photo sees the silhouette on /profile and in the header @desktop @prod-safe #d36ad4
**Status:** READY · **File:** `tests/avatars/talent-no-photo-silhouette.spec.ts`
**Seed:** `tests/seed.talent_2.spec.ts`
**Device:** desktop
**Users:** talent_2 (demo-talent-2, U-14, no uploaded photo)
**Steps:**
1. Open /profile (tab «החשבון שלי»).
2. Read the big profile picture next to the name and the avatar button in the header.
**Expected:**
- The profile picture is the grey silhouette: its `src` contains `anonymous-avatar` (or it is an initials element), not `avatar-placeholder`. (source: «What is needed» #d36ad4)
- The header avatar is the same silhouette/initials.
- No `<img>` on the page has `src` containing `/images/app/avatar-placeholder`.

#### 1.2 Old stock placeholder URL is gone; guest landings show no stock avatar @desktop @prod-safe #d36ad4
**Status:** READY · **File:** `tests/avatars/old-placeholder-removed.spec.ts`
**Seed:** `tests/seed.spec.ts`
**Device:** desktop
**Users:** guest
**Steps:**
1. Request `/images/app/avatar-placeholder.png` (page.request.get).
2. Open /headhunters and /talents; scroll to the bottom (lazy images).
**Expected:**
- Step 1: HTTP status 404 (the stock photo was removed — developer note 22.10; QA 22.10 «old URL 404»).
- Step 2: no `<img>` with `src` containing `/images/app/avatar-placeholder`. (Marketing mock-up photos on /headhunters are a separate open finding — do not assert on them.)

#### 1.3 Headhunter lists and chats use the silhouette for users without a photo @desktop @prod-safe #d36ad4
**Status:** READY · **File:** `tests/avatars/hunter-lists-silhouette.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free (demo-hunter-2, no own photo)
**Steps:**
1. Open /collaborations, then «המועמדים שלי» (/my-candidates), then «מאגר טאלנטים» (/talents-bank), then /messages (open the first conversation).
2. On each page collect all avatar `<img>` elements (header + cards/rows).
**Expected:**
- On every page: zero `<img>` with `src` containing `/images/app/avatar-placeholder`. (source: «What is needed» «everywhere»)
- The header avatar of hunter_free has `src` containing `anonymous-avatar` (or initials).
- At least one card/row avatar on /my-candidates uses `anonymous-avatar` (QA-AUTO candidates have no photo).

#### 1.4 Admin users list: silhouette for users without a photo, own photo kept @desktop @prod-safe #d36ad4
**Status:** READY · **File:** `tests/avatars/admin-users-silhouette.spec.ts`
**Seed:** `tests/seed.admin.spec.ts`
**Device:** desktop
**Users:** admin
**Steps:**
1. Open /admin/users (page 1), then page 2 of the list.
2. Collect the avatar `<img>` of every row.
**Expected:**
- No row avatar has `src` containing `/images/app/avatar-placeholder`. (source: «What is needed» — admin is part of «everywhere», developer note 22.10)
- Rows without a photo use `anonymous-avatar` (or initials); if a row has another image `src` (an uploaded photo), it loads (naturalWidth > 0) — users with a photo keep it (regression).
