<!-- Plan: onboarding. Source case: .qa/tests/onboarding/OB-01. Ticket #6aa7f009. -->
<!-- @prod-safe: только переходы по URL, данные не меняются. Ручных кейсов в фиче нет. -->

### 6. Onboarding — недоступен зарегистрированному
**Seed:** `tests/seed.user1.spec.ts`

#### 6.1 OB-01 Зарегистрированный пользователь не попадает в onboarding по URL #6aa7f009 @prod-safe
**Device:** all (390 и 1440 — без пометки)
**Users:** user1
**Steps:**
1. По очереди открыть `/level`, `/summary`, `/birth-date`, `/dates`, `/location`, `/reminders`, `/motivation`, `/nusach`, `/register`, `/welcome`.
**Expected:**
- Каждый маршрут перенаправляет на `/home` (источник: needed_behavior 0817c762; список маршрутов — комментарий программиста, commit 9363470).
