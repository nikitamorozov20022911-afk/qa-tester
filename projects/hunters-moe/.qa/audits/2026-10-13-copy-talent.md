# Copy audit — talent (FREE, demo-talent-2) · 2026-10-13 · desktop 1440×900 · HE (+EN spot)
Screens: .qa/screenshots/copy-talent-<n>.png. Apply dialog not checked (monthly limit reached on this account).

| # | Where | Current text | Problem | Suggested (HE) | Type | Sev | Status | Shot |
|---|---|---|---|---|---|---|---|---|
|1|Header «ממתינים» modal|«מועמדים ממתינים לאישור» / «קיבלת תשובות» / «אין כאן משהו שממתין»; EN «Waiting»|Headhunter wording for talent; vague empty state|«מועמדויות שממתינות לתשובה» / «תשובות שקיבלת»; EN «Pending»|bug-text|medium|NEW (near ec60cb6f)|1|
|2|Job card, HH profile, limit|«לשידרוג», «בשידרוג ל-PRO»|Spelling|«לשדרוג», «בשדרוג»|bug-text|medium|NEW|2,8|
|3|Job card after applying|«מעוניין במשרה הזאת?» + «הגשת מועמדות למשרה הזו.»|Masculine only; reads as CTA after applying|«כבר הגשת מועמדות למשרה זו»|bug-text|medium|NEW|3|
|4|Job card|«הוספה למועדפים» vs «משרות שאהבתי»; «האנטרס»/Hunters/HUNTERS|Inconsistent terms/brand|one term; «Hunters»|copy-improvement|low|NEW|4|
|5|«i» on «טווח שכר»|«טווח התקציב שהלקוח הגדיר למשרה»|Client budget shown to talent|«טווח השכר המוצע למשרה»|bug-text|medium|NEW (rel. 6a900c7d)|5|
|6|«צפייה במועמדות שלי»|«הגשת מועמד: יוסי פרידמן»; AI summary in English, 3rd person, RTL period|Headhunter screen + untranslated AI text shown to candidate|«המועמדות שלי – …»; summary in UI language|translation/bug-text|high|NEW (rel. ec60cb6f)|6|
|7|Same modal|«כמה שנות ניסיון יש למועמד/ת…» «לא נענתה»; status «חדש» vs «בתהליך»|3rd person; status mismatch|«שאלות סינון ששאלו אותך» / «לא ענית»; one status|bug-text|medium|NEW|7|
|8|Limit reached|«…המועמדות הבאה תיפתח ב-23.10.2026…»|Unclear; לשלוח/להגיש mix|«אפשר יהיה להגיש שוב ב-23.10.2026. ב-PRO – ללא הגבלה.»|copy-improvement|medium|NEW|8|
|9|/recommendations|«איתרנו 9 משרות בול בשבילך» + 1 card; «הסוכן החכם»|Slang; 9 promised, 1 shown, unexplained|«מצאנו 9 משרות שמתאימות לך. ב-FREE מוצגת משרה אחת…»|copy-improvement|medium|NEW|9|
|10|/hunters|«אימייל —», «טלפון —»; «test test», «דב האנטר»|Unexplained dashes; test users|«זמין למנויי PRO»|copy-improvement|medium|NEW|10|
|11|HH profile|«בקש ייצוג»; «שת”פים מוצלחים», «הצלחת שת”פ»|Imperative button; internal term for talent|«בקשת ייצוג»; «השמות מוצלחות», «אחוז הצלחה»|bug-text|medium|NEW (rel. ec60cb6f)|11|
|12|HH reviews|«לפני חודשיים (2)»|Stray counter|«לפני חודשיים»|bug-text|low|NEW|12|
|13|«בחירת חבילה» modal|«ב-50% ממחיר מחירון»; «צפייה מוגבלת בכל המשרות»; «עד 10% חיסכון»|Grammar, contradiction, imprecise; no context after «בקש ייצוג»|«בהנחה של 50% ממחיר המחירון»; «חיסכון של 10%»; subtitle «בקשת ייצוג זמינה למנויי PRO»|bug-text/copy|medium|NEW (near 9c00ea55)|13|
|14|«עריכת הדירוג שלך»|«איכות המועמדים»|Talent rates "candidate quality"|talent-specific criteria|bug-text|medium|NEW|14|
|15|/messages ⋯|«לסמן כלא נקרא»|Infinitive among nouns|«סימון כלא נקרא»|bug-text|low|NEW|15|
|16|/messages delete|native confirm() «למחוק את השיחה?…»|Browser dialog, OK/Cancel in browser language|branded dialog|copy-improvement|low|NEW|—|
|17|Bell|«אין לך התראות עדיין :(»|Mirrored smiley, unprofessional|«אין התראות חדשות. נעדכן אותך…»|copy-improvement|low|NEW|16|
|18|/profile|«25,000 - 35,000», «0531235678»; empty blocks|No labels/format/CTA|«ציפיות שכר: ₪25,000–35,000»; «053-123-5678»|copy-improvement|low|NEW|17|
|19|/profile agreements|«לא נמצאו הסכמים» vs «אין חשבוניות עדיין»|Inconsistent empty states|«אין לך הסכמים עדיין…»|copy-improvement|low|NEW|18|
|20|Edit profile|«…למשתמשים אשר תבחר לחשוף את פרטיך בשבילם…»; «להסתנכרן עם לינקדין»; «(אופציונלי)» vs «(לא חובה)»; aria «Country code»|Heavy, masculine, inconsistent|«…יוצגו רק למשתמשים שתאשר/י, לאחר שיחתמו על NDA»; «סנכרון עם LinkedIn»|bug-text|medium|NEW (near d993df78)|19|
|21|/faq (talent)|«האנטרים», «אירגונים»; empty answer to «איך מגישים מועמדות?»; contradicts NDA wording|Spelling; empty answer; gaps (PRO, limit, ייצוג)|fill talent FAQ|bug-text/copy|medium|NEW|20|
|22|EN job card|«Job scope: משרה מלאה», cities in Hebrew|Dictionary values untranslated|«Full-time»|translation|low|NEW|21|
|23|/collaborations filters|«חפש תפקיד/איזור/תחום», «איזור משרה», «סינונים», «תקציב», «מינ'/מקס'» mirrored|Spelling, wording, RTL|«חיפוש…», «אזור המשרה», «סינונים נוספים», «שכר»|bug-text|medium|NEW (תקציב STILL 6a900c7d)|22|
|24|Global|«ספרו לנו», «בחרו» vs «שדרג/י», «תבחר», «מעוניין»|Addressing inconsistent|one rule|copy-improvement|low|NEW|—|

Still present (existing tickets): ec60cb6f, e6e0fa11, 6a900c7d, 6a71ce31..10, 6a719ec6..ab, lorem footer/home, 788be999/d1ffaa17 typos on home.
Test data: lorem in job «מנהל רכש בכיר», «QA company post test», «QA promo test», chat «!!!», HH «test test».
