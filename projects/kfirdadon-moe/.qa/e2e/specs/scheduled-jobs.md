<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# План автотестов: плановые задачи (pg_cron) — здоровье через admin_scheduled_jobs_health

> Записано autotest-writer вручную: проверка RPC тем же токеном сессии Super Admin (`tests/support/api.ts`), без UI
> (отображения здоровья задач в /admin нет — не требуется). Только чтение → @prod-safe.
> Не автоматизируется: фактическое удаление записи старше 90 дней, документация секретов (репозиторий), закрытие
> брошенной попытки по таймеру (одноразово, ~40 мин ожидания).

### 1. Плановые задачи — purge-expired-recordings и close-abandoned-attempts
**Seed:** `tests/seed.admin.spec.ts`

#### 1.1 admin_scheduled_jobs_health — purge-expired-recordings «15 * * * *», active, secrets_configured; close-abandoned-attempts active, secrets_configured @desktop @prod-safe (#8f268d · #6edba0ceef980e18a08f268d)
**Device:** desktop
**Users:** admin
**Steps:**
1. admin: открыть /admin/support (взять токен сессии).
2. POST rpc/admin_scheduled_jobs_health без аргументов.
**Expected:**
- HTTP 200; в ответе есть purge-expired-recordings и close-abandoned-attempts (AC: «רצות בהצלחה בכל סביבה»).
- purge-expired-recordings: schedule «15 * * * *» (каждый час в :15, миграция 20261101130400), active=true, secrets_configured=true; мягко — vault_secrets содержит project_url и purge_recordings_service_key («הסודות מוגדרים כחלק מההקמה»).
- close-abandoned-attempts: active=true, secrets_configured=true; мягко — schedule «*/10 * * * *».
- Мягко (не жёстко): last_run_succeeded=true и last_http_status=200 у обеих; last_run_at purge не старше 2 ч, close-abandoned — 40 мин («בדיקה מוודאת שהריצה המתוזמנת האחרונה הצליחה»; проверка 04.11 на проде: 12:15 и 12:20 true/200).
**File:** tests/scheduled-jobs/jobs-health-8f268d.spec.ts
