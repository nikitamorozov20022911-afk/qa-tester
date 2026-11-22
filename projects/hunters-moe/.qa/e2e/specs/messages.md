<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# Autotest plan — Messages: the chat list loads for every role (2026-10-21)

STATUS: READY — #0b18b0 (70baab818db48b6ff00b18b0, critical) passed QA, user moved it to «הושלם» 2026-10-21. Not generated yet. Environment: staging https://hunters-sooty.vercel.app.
Source of expectations: rejection d3f0a32d «needed behavior» (#0b18b0); evidence `.qa/screenshots/2026-10-21/0b18b0-*.png`.
Rules: login only via saved sessions (seed per role); no fixed waits, no `networkidle` — wait with `page.waitForResponse('**/rest/v1/my_conversations*')` and `expect(...)`; read-only (do not send messages); `@prod-safe`.
Not automated: live send/receive between two roles (every run would leave chat messages that cannot be deleted); the error state when the list fails to load (could not be reproduced on staging — the list was served without the request).

---

### 1. Messages list
**Seed:** `tests/seed.hunter_free.spec.ts`, `tests/seed.company_2.spec.ts`, `tests/seed.talent_2.spec.ts`

#### 1.1 Headhunter: /messages lists conversations, my_conversations = 200 @desktop @prod-safe #0b18b0
**Status:** READY · **Case:** `.qa/tests/messages/MS-1-1.md` · **File:** `tests/messages/list-loads-headhunter.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free (demo-hunter-2; has chats with demo-company-2, 21.10.2026)
**Steps:**
1. Start waiting for the response `/rest/v1/my_conversations`; open /messages.
2. Look at the conversation list on the side panel (under «חיפוש שם/הודעה»).
**Expected:**
- The response status is 200 (not 403 «permission denied for function conversation_nda_job»). (needed behavior: «my_conversations returns 200 for every role»)
- At least 1 conversation item with a name and a date; the text «עדיין אין שיחות» is not shown. (needed behavior: «/messages lists the user's existing conversations with the right names»)

#### 1.2 Company: /messages lists conversations, my_conversations = 200 @desktop @prod-safe #0b18b0
**Status:** READY · **Case:** `.qa/tests/messages/MS-1-2.md` · **File:** `tests/messages/list-loads-company.spec.ts`
**Seed:** `tests/seed.company_2.spec.ts`
**Device:** desktop
**Users:** company_2 (demo-company-2; chat with demo-hunter-2)
**Steps:** as in 1.1.
**Expected:** as in 1.1 (response 200; ≥ 1 conversation item; no «עדיין אין שיחות»).

#### 1.3 Talent: /messages lists conversations, my_conversations = 200 @desktop @prod-safe #0b18b0
**Status:** READY · **Case:** `.qa/tests/messages/MS-1-3.md` · **File:** `tests/messages/list-loads-talent.spec.ts`
**Seed:** `tests/seed.talent_2.spec.ts`
**Device:** desktop
**Users:** talent_2 (demo-talent-2; chat «BRIAN MUTUKU», 05.10.2026)
**Steps:** as in 1.1.
**Expected:** as in 1.1 (response 200; ≥ 1 conversation item; no «עדיין אין שיחות»).

#### 1.4 Opening a conversation shows its messages @desktop @prod-safe #0b18b0
**Status:** READY · **Case:** `.qa/tests/messages/MS-1-4.md` · **File:** `tests/messages/open-conversation-shows-thread.spec.ts`
**Seed:** `tests/seed.hunter_free.spec.ts`
**Device:** desktop
**Users:** hunter_free
**Steps:**
1. Open /messages; wait for the list.
2. Click the first conversation item; read the right panel.
3. Do not type or send anything.
**Expected:**
- The placeholder «בחרו שיחה מהרשימה» disappears; the panel shows the other side's name (same as in the list item) and at least 1 message bubble, and a message input. (needed behavior: «All users see their conversations and can open … messages»)
