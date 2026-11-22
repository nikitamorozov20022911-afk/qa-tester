<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# CALL-020: candidate_start_attempt под нагрузкой (5 стартов практики одновременно + 10 записей событий): все 200, нет 500/57014, прогретые старты < 1500 мс
- Фича/экран: звонок кандидата, старт попытки (RPC `candidate_start_attempt`), F-32 AC10 (VOICE-AC10)
- Тикеты: #146331 (dfdd3c0c15aba4564b146331)
- Роль/аккаунт: business-2 (создаёт кандидатов, `.qa/auth/business-2.json`) + кандидаты-гости (только anon-ключ, без входа)
- Устройство: нет UI — только API (в автотесте `@desktop`, один прогон)
- Тип: нагрузка (позитив); `@load` — вне обычного регресса; НЕ prod-safe (создаёт кандидатов и попытки)
- Предусловия: окружение `kfir-dadon.vercel.app` / Supabase `wrqtmeohvmxzkgygkwul` (пользователь: «не прод, можно нагрузку»); у бизнеса business-2 активна симуляция `3218d624-6b97-4dd9-a6e9-7d30948ac5a3`; есть квота на 6 кандидатов. Голосовые сессии (start-voice-session) и AI НЕ вызываются.
## Шаги
1. business-2: `create_candidate` ×6 (`QA-AUTO-146331-<stamp>-W`, `…-L1…L5`; только ссылка, симуляция 3218d624, менеджер — сам business-2).
2. Гость, для каждого: `candidate_open_link` → `candidate_give_consent` (p_shown_text = `candidate_legal_text` из open_link) → `candidate_tech_check` started → passed.
3. Прогрев: `candidate_start_attempt` (practice) для W — одиночный; 15 параллельных `get_current_legal_documents`.
4. Одновременно: 5 × `candidate_start_attempt` (practice, `p_confirm_single_attempt: false`) для L1…L5 + 10 × `candidate_record_event` (`connection_warning`, payload `{qa:'QA-AUTO-146331', k}`) по попытке W.
## Ожидаемо
- Шаги 1–2: все ответы 200; после tech_check passed — 200 (источник: подготовка, как в ручной проверке).
- Шаг 4: все 15 ответов 200; ни один ответ не 5xx и не содержит `57014` / «statement timeout» (источник: AC1 «אינה מחזירה 500 «statement timeout» (57014)»).
- Каждый старт возвращает `attempt_id`, `status: in_progress`, `attempt_type: practice`; все 5 `attempt_id` разные.
- Время каждого старта < 1500 мс после прогрева (источник: AC2 «אין … שאילתה איטית … והממצא מתועד … מדידת זמן»; ручной замер: прогретые 175–289 мс, холодные до 1,8 с — сеть).
## Тестовые данные
6 кандидатов `QA-AUTO-146331-…` + 6 попыток practice в статусе in_progress + 10 событий connection_warning. Кандидатов не удаляем (правило проекта — только с «да»); попытки не завершаем (end-candidate-attempt запускает пайплайн отчёта/AI).
## История
- 2026-10-21 · ✅ · #146331 (ручная нагрузка: 4 серии ×5 стартов + 10 событий, 20/20 200, 0×500/57014; прогретые 175–289 мс; данные QA-146331-L1…L22)
- 2026-10-21 · עבר QA · автотест e2e/tests/candidate-call/start-attempt-under-load.spec.ts (@load)
