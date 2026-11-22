# Copy audit — headhunter PLUS features (claude-test) · 2026-10-13 · desktop 1440×900
Smart agent = /recommendations («מומלץ עבורך») — no link to it anywhere in the UI. Screens: .qa/screenshots/copy-hunterplus-<n>.png
Side effect: clicking «ייצג את הטאלנט הזה» opened chat /messages?c=0fdc7c00-f494-455a-8133-ec0b6201da7b with demo-talent-4 (no message sent).

| # | Where | Current text | Problem | Suggested (HE) | Type | Sev | Status | Shot |
|---|---|---|---|---|---|---|---|---|
|1|Anonymous talent profile → «ייצג את הטאלנט הזה»|profile «(אנונימי)» → chat shows «רונית אלון», phone, email|Anonymity revealed in one click, no warning/confirm (other anonymous chat shows «טאלנט אנונימי»)|confirm dialog «ייצוג הטאלנט יחשוף את פרטי הקשר שלו… להמשיך?»|BUG privacy|high|NEW|1a,1b|
|2|/recommendations|«100% התאמה» on all cards, one reason|Misleading|real % or «מתאים לתחום שלך»|text/logic|medium|NEW|7|
|3|/recommendations tenders «למה זה מתאים לך (AI)»|«משרה רבע משרה בתל אביב…» / «…בשכר גבוה»|Repeated word; city/salary seem invented; changes on reload; only 1 of 3 cards|generate from object fields, cache|text (AI)|medium|NEW|8|
|4|same|heading «לך», text «לכם/שלכם»|Mixed addressing in AI prompt|align prompt|text|low|NEW|—|
|5|/recommendations header|«איתרנו 4 שת"פים בול בשבילך»; «מדרג עבורך לפי…»; «כשיתפרסם»|Slang; missing object|«מצאנו 4 שת״פים שמתאימים לך»; «…כשיפורסם…»|text|low|NEW|7|
|6|navigation|no link to /recommendations; «מומלץ עבורך» vs feature «סוכן חכם»|PLUS feature undiscoverable|menu item «הסוכן החכם»|UX/text|medium|NEW|—|
|7|«הגדרות התאמה» dialog|«ריק: התחומים שבפרופיל שלך»; salary placeholder «הכול»; «כל הארץ» + «הכול»; toggle no label|Dev-like hint; wrong placeholder; duplicate|«אם לא תבחר/י – נשתמש בתחומים מהפרופיל»; «ללא מינימום»|text/a11y|low|NEW|9|
|8|same, «אזורים»|«Remote»|Untranslated|—|translation|low|DUP 9bc698d6|—|
|9|/profile subscription PLUS|only «חבילה נוכחית»; FREE «בחירת חבילה»|No renewal date/manage/cancel; downgrade labelled as choose|«מתחדשת ב-… · ניהול/ביטול»; «מעבר לחבילה זו»|text|medium|NEW|5|
|10|plans|PLUS list lacks «מאגר טאלנטים», «סוכן חכם»|—|—|text|medium|COVERED 9c00ea55 / pricing task|6|
|11|«בחירת חבילה»|«SECURE SSL ENCRYPTION»; close icon «>»|English; looks like "back"|«תשלום מאובטח (SSL)»; ✕|translation/UX|low|NEW|6|
|12|/talents-bank card|«כתובת» (city), date «20.09.2026» unlabeled, «שכר ₪» vs filter «ציפיות שכר»|Labels|«מיקום», «נוסף ב-…», «ציפיות שכר (₪ לחודש)»|text|low|NEW|3|
|13|talent profile|«30,000 - 75,000 ₪» no label|Unclear|«ציפיות שכר: … לחודש»|text|low|NEW|2,4|
|14|talent profile|button «דירוג»|Unclear who rates whom|«דירוג הטאלנט»|text|low|NEW|4|
|15|anonymous profile|female title vs male description, «(אנונימי)» inside title|Seed data; badge|badge «פרופיל אנונימי»|test data/text|low|NEW|2|
|16|/recommendations|«BRIAN MUTUKU», 3 identical cards|Test data|clean seed|test data|low|NEW|7|
|17|recommendations/header/talent bank|”, ", ״ in abbreviations|Punctuation|«״»|punctuation|low|COVERED glossary task|10|
|18-23|various|«לא נמצאו טאלנטים», «איזור», «יתווספו בקרוב», phones, «תקציב», «פירסום», MentMe footer|—|—|—|—|COVERED / DUP|—|

EN: talent bank UI translated; cities/roles Hebrew, dates «09.20.2026», «Address» → «Location» (covered by translation task). Non-text: language resets to Hebrew after navigating to another page.
