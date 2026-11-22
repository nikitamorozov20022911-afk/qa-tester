# Copy audit — headhunter · 2026-10-13 · desktop 1440×900 · HE (+EN spot)
NOTE: auth/hunter_plus.json actually contains demo-hunter-3 (FREE), not claude-test (PLUS) → talent bank / smart agent not seen.
Not checked: publish step 2+, chat delete dialog, NDA cancel. Screens: .qa/screenshots/copy-hunter-<n>.png

| # | Where | Current text | Problem | Suggested (HE) | Type | Sev | Status | Shot |
|---|---|---|---|---|---|---|---|---|
|1|Own job → שדרוג → 4 weeks|«קידום שת"פ — עדיין לא זמין לרכישה» vs «…לשבועיים או לארבעה שבועות»|Promised option unavailable, stays selected|«…קידום לארבעה שבועות – בקרוב»|bug-text|medium|NEW|1|
|2|Job card menu/side|«שידרוג משרה», «עידכון שותפים»|Spelling|«שדרוג», «עדכון»|bug-text|medium|NEW|2|
|3|Filters (collaborations, my-jobs, tenders, my-candidates)|«איזור משרה», «חפש תפקיד/איזור/תחום»|Spelling|«אזור», «חיפוש…»|bug-text|medium|NEW|3|
|4|Filters «סינונים»|«סינונים נוספים יתווספו בקרוב»|"Coming soon" stub in UI|remove section|copy-improvement|low|NEW|3|
|5|/my-candidates «תפקיד רצוי»|«Scrum Master / Scrum Masterית»|Hebrew suffix on English word, bidi break|«Scrum Master»|bug-text|medium|NEW|4|
|6|Add candidate form|«לינקדין» vs «לינקדאין»; «(אופציונלי)» only once; «הקלידו…» plural|Inconsistent|unify|copy-improvement|low|NEW|5,6|
|7|Global addressing|«שדרגו… לכם», «בחרו», «חפש», «קרא עוד», «תבחר»|Mixed forms|one form site-wide|copy-improvement|low|NEW|7|
|8|Tender card|«היקף מוערך: פרויקטאלי» / «משרה מלאה» / «35»|Spelling; mixed value types|«פרויקטלי»; «היקף העסקה»; units|bug-text|low|NEW|8|
|9|Tender «הגשת הצעה»|red «זיהינו כי חסר מידע בפרופיל שלך…»; «עד 2 הצעות בחודש»|Looks like error, doesn't say what's missing; unclear limit|list missing fields; «PLUS ו-PREMIUM: עד 2 הצעות למכרזים בחודש»|copy-improvement|low|NEW|9|
|10|HH profile reviews|«לפני חודשיים (2)»; «התפלגות הביקורות» over category scores; «כוכב 1»|Plural template leak; wrong heading|«לפני חודשיים»; «דירוג לפי קטגוריות»; «כוכב אחד»|bug-text|medium|NEW|10|
|11|/messages menu/header|«לסמן כלא נקרא»; phone «972721881858»|Grammar form; phone format|«סימון כלא נקראה»; «+972 72-188-1858»|copy-improvement|low|NEW|11|
|12|Bell empty|«אין לך התראות עדיין :(» → «):» in RTL|RTL smiley, tone|«אין התראות חדשות…»|bug-text (RTL)|low|NEW|12|
|13|/profile subscription|«פירסום…», «לדירוג» vs «לדרג», «פול הפצות», «עד 1 בחודש», «ממחיר מחירון», «שיתופי פעולה» vs «שת"פים»|Spelling, inconsistency, slang|«פרסום», «גישה למאגר ההפצות», «קידום אחד בחודש», «ממחיר המחירון»|bug-text|medium|NEW|13|
|14|Agreements → NDA view|«…ולמשך שנתיים מסיום תהליך הגיוס» vs «בתוקף עד 12.8.2031»; «לא נשמרה חתימה סרוקה להסכם זה»|Term mismatch (2y vs 5y); alarming tech line|align term; «ההסכם נחתם דיגיטלית»|bug-text|medium|NEW|14|
|15|/publish/job step 1|«קבצים רלוונטים»; «תעשיה»; placeholder «שוטף + ימים (למשל 30)»|Spelling; term (elsewhere «תחום»); unclear|«רלוונטיים»; «תחום»; «שוטף + מספר ימים, למשל: שוטף + 30»|bug-text|medium|NEW|15|
|16|EN /collaborations|cities «תל אביב», «הרצליה»…|Not translated|Tel Aviv, Herzliya…|translation|medium|NEW|16|
|17|/faq|«האנטרים», «אירגונים», «כחבר.ה»|Spelling/terms|«הד-האנטרים», «ארגונים», «כחבר/ה»|bug-text|medium|NEW|17|
|18|Terminology שת"פ vs משרה|«פרסום משרה» → page «פרסום שת"פ»; «כל המשרות» vs «שת"פים»; card mixes both|Same entity, two words on one screen|approve glossary|copy-improvement|medium|NEW|18|
|19|Archive dialog|«העברת משרה לארכיון!» + «…להמשיך לעוד שבועיים ב-50% הנחה?»|"!" in question; archive vs close; unclear discount|«להעביר את המשרה לארכיון?…»|copy-improvement|low|NEW|—|
|20|/my-candidates/<id>|badge «טאלנט»; phone formats differ|Wrong label; formats|«מועמד/ת»|copy-improvement|low|NEW|—|
|21|misc|«(לא חובה)» vs «(אופציונלי)»; aria «Notifications alt+T»; «רישיון ניהול לשכת כ"א»; EN «Head hunter»/«hunter»|Inconsistency|unify|copy-improvement|low|NEW|—|

Existing, still present: 6a719ec6..ab (MentMe footer); 9bc698d6 («Remote» now also in job filters/form); 6a900c7d (תקציב); d993df78; 6aa29a4a; e6e0fa11; 9c00ea55.
Check: 3fe81e11 (DONE) — «מס' ימי אחריות לגיוס» still on job card & publish form → regression or different scope?
Fixed: 6a71ce31..10 (now «מכרז חם»). Not reproduced: 6aa952e1 / 6aa9534a.
