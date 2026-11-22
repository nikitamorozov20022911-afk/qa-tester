# AL-05: Admin-dispatcher в Team & Roles → Change history видит только события своей команды
- Фича/экран: /Team (Team & Roles) → блок «Change history»
- Тикеты: #fc4fa4, #04d338
- Роль/аккаунт: dispatcher (gesaday533@bwingmedia.com), бизнес test
- Устройство: desktop 1440×900
- Тип: позитив + изоляция
- Предусловия: язык EN; в компании test есть события команды (Invited / Joined / Role changed у gesaday533 от 11.11). Только просмотр.
## Шаги
1. Открыть /Team, дождаться блока «Change history».
## Ожидаемо
- В «Change history» есть события команды test (например, «Role changed» / «Joined» по gesaday533@bwingmedia.com).
- Нет купонных и тарифных событий: «Coupon created/changed/disabled/attached/detached», «Plan granted/changed/revoked» — их видит только супер-админ в Admin Panel → Audit log.
(источник: комментарий программиста №4 — Change history через team_change_history, только события команды своей компании; реджект 2, R2.3)
## История
- 2026-11-12 · ✅ · #fc4fa4 (dc0451ee552ed1b25afc4fa4), повторная проверка после реджекта 2 (.qa/screenshots/fc4fa4-v2-disp-team-change-history-desktop.png)
