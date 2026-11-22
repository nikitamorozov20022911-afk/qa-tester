<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# DRAFT-003: после правки главного возражения в источнике профиль поведения держит одно возражение, черновик помечен «нужна перегенерация»
- Фича/экран: F-13 (одно главное возражение) · F-16 / S-09 «סקירת הטיוטה» (/simulations/<id>/draft) · rpc get_behavior_profile
- Тикеты: #8d9759413c3e03a5762b7f11 (#2b7f11)
- Роль/аккаунт: business (testim)
- Устройство: desktop 1440×900
- Тип: позитив (регресс бага)
- Предусловия: своя QA-симуляция «QA-…» в טיוטה с заполненными шагами 1–4 и черновиком сценария (при проверке 21.10 — AI-черновик + ручные правки, draft_source manually_edited). Профиль читается rpc get_behavior_profile сессией business (только чтение; сайт сам его не вызывает).
## Шаги
1. Контроль: профиль — objection.text = scenario.main_objection = X1, needs_regeneration false.
2. В источнике (шаг «התנגדות») сменить свободный текст X1 → другой свободный текст X2 (вместе с причиной и условиями) → сохранить (save_simulation).
3. get_behavior_profile.
4. Открыть /simulations/<id>/draft.
5. «העברה לאישור».
6. Сменить возражение на пункт библиотеки «אנחנו כבר עובדים עם ספק אחר» → сохранить → профиль.
7. Сменить обратно на свободный текст X3 → сохранить → профиль.
## Ожидаемо
- После каждой правки: прежний текст возражения в ответе профиля встречается 0 раз; objection.text == scenario.main_objection == новое значение; scenario.objection_reason / softening_conditions / refusal_conditions == objection.reason / softening_conditions / refusal_conditions (источник: «מה רצוי» — «פרופיל ההתנהגות… מחזיק התנגדות מרכזית אחת, זהה למקור, בכל שדותיו»; AC тикета).
- Сгенерированные по старому возражению поля (customer_persona, ai_persona_instructions, opening_state, possible_responses, advance_conditions, end_conditions, max_customer_step) очищены; needs_regeneration: true; stale_generated_keys — эти 7 ключей (реализация фикса).
- S-09: баннер «ההתנגדות המרכזית השתנתה מאז שהטיוטה נכתבה» с «…יש להפיק את הטיוטה מחדש לפני ההעברה לאישור», в разделах «ייכתב מחדש לפי ההתנגדות המעודכנת»; в разделе 04 — новое возражение.
- «העברה לאישור» → submit_simulation_for_approval 400 draft_needs_regeneration; на экране «לא בוצע» + «ההתנגדות המרכזית השתנתה אחרי שהטיוטה נכתבה. יש להפיק את הטיוטה מחדש לפני ההעברה לאישור.»
## История
- 2026-10-21 · ✅ · #2b7f11 (QA-B2-2110, 3 правки: свободный → свободный, → библиотека, → свободный; данные .qa/tmp/B2-2110/R/bp-*.json, скриншоты 2b7f11-*.png)
- 2026-10-21 · עבר QA · автотест e2e/tests/scenario-draft/objection-edit-behavior-profile-2b7f11.spec.ts (не запускался)
