<!-- qa-tester © 2026 Nikita Morozov (ניקיטה מורוזוב / Никита Морозов). All rights reserved. See LICENSE. ID: QAT-NM-2026-344086DC45B0 -->
# CALL-032: провайдер отвечает 429 insufficient_quota на connect_url (сценарий 14.10) → то же сообщение «תקלה בצד שלנו», technical_failure
- Фича/экран: звонок кандидата /c/<token>, S-16 · список кандидатов business
- Тикеты: #da072b
- Роль/аккаунт: business + кандидат (гость)
- Устройство: кандидат Chrome 390×844, business — desktop 1440×900
- Тип: негатив; НЕ prod-safe, @data
- Предусловия: свой новый кандидат «QA-AUTO-da072b-<stamp>» (business testim, link_only, активная симуляция «מערכות סולאריות»); Chrome кандидата с фальшивым микрофоном (mic-check.wav, флаги --use-fake-*); кандидат прошёл «בוא נתחיל» → согласие → тех. проверку → «לדלג ישר לשיחה הרשמית», галочка «הבנתי שזה ניסיון חד-פעמי». Старт попытки (candidate_start_attempt) НАСТОЯЩИЙ — официальная попытка кандидата тратится (@data); настоящей голосовой сессии нет: ответ подменён route-mock, api.openai.com перехвачен.
## Шаги
1. route start-voice-session (POST) → 200 {attempt_id: <из запроса>, max_duration_seconds: 540, session:{protocol:'webrtc_sdp', client_secret:'ek_qa_mock_not_real', connect_url:'https://api.openai.com/v1/realtime/calls', data_channel:'oai-events'}, bookkeeping_tools:[]}; route https://api.openai.com/** → 429 {"error":{"type":"insufficient_quota","code":"insufficient_quota","message":"You exceeded your current quota"}}.
2. «מוכן, מתחילים».
3. business: /candidates.
## Ожидаемо
- Через ≈1 с (вручную 913 мс): data-reason="server", «לא הצלחנו להתחיל את השיחה בגלל תקלה בצד שלנו, לא אצלכם. זה לא נחשב לחובתכם, וצוות הגיוס יחזור אליכם לגבי ההמשך.», только «לפנות לצוות לעזרה» (источник: AC; «מה קיים» 14.10 — 429 insufficient_quota показывался как интернет).
- Попытка technical_failure; в списке «תקלה טכנית».
## История
- 2026-10-21 · ✅ · #da072b (M2, QA-da072b-2110-C e236e330, попытка c4e2b900; da072b-m2-*.png)
- 2026-10-22 · עבר QA · автотест e2e/tests/candidate-call/provider-refusal-da072b.spec.ts
