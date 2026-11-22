# Copy audit — admin panel · 2026-10-13 · desktop 1440×900 · HE (+EN spot)
Screens: .qa/screenshots/copy-admin-<n>.png. No email templates in admin; system messages = admin broadcast only (0 sent).

| # | Section | Current text | Problem | Suggested (HE) | Type | Sev | Status | Shot |
|---|---|---|---|---|---|---|---|---|
|1|/admin/faq hunters Q3 (public)|«החובה לאכוף את התיקון לסעיף 13 בחוק מאגרי המידע, חל על המשתמש.»|Agreement (חובה…חל), wrong law name (Amendment 13 = חוק הגנת הפרטיות)|«האחריות לעמידה בהוראות תיקון 13 לחוק הגנת הפרטיות חלה על המשתמש.»|bug-text|high|NEW|16|
|2|faq hunters Q3 vs Q10|NDA optional (Q3) vs condition for every שת״פ (Q10)|Contradiction|«…ניתן לדרוש חתימה עליו לפני שיתוף פעולה, לפי בחירת מפרסם השת״פ.»|bug-text|medium|NEW|17|
|3|faq category|«חברות/אירגונים»|Spelling|«חברות/ארגונים»|bug-text|medium|NEW|15|
|4|faq HE vs EN|price Q inactive in HE, active in EN; HE 15 active vs EN 3|Languages out of sync|sync sets/statuses|translation|medium|NEW|18,19|
|5|faq hunters|«על ידך», «תבחר/י», «כחבר.ה» vs «כחבר/ה», «באישורכם»|Mixed addressing style|one style (plural/impersonal)|copy-improvement|low|NEW|18|
|6|faq|«בהאנטרס» vs «Hunters»|Brand inconsistent|«Hunters»|bug-text|low|NEW|18|
|7|faq hunters Q5,6,8,13,14|encryption, «מי פתח קובץ», reports, mediation|Promises features not seen in product|confirm with product / soften|copy-improvement (verify)|medium|NEW|20|
|8|faq Q6,12,15|«והינו משפיע», «מספקת בית», run-on sentence|Clunky wording|see report|copy-improvement|low|NEW|—|
|9|faq companies|«כמה עולה פרסום מכרז?» — no price; pricing says ₪0; NDA wording differs|Unhelpful/inconsistent|state current price; align NDA wording|copy-improvement|low|NEW|21|
|10|/admin/pricing (+EN)|«(PRD 58)», «(PRD 61)», «(PRD 59)»|Dev references in UI|remove|bug-text (dev)|medium|NEW|1|
|11|/admin/pricing|«0 = אף אחת, כמו בכרטיסי החבילות.», «בכרטיסי החבילות כתוב 2.»|Internal notes; reveals hardcoded plan cards|clean description|bug-text (dev)|low|NEW|2|
|12|/admin/pricing|«(דיווחים › ייצוג)»|Points to non-existent place|«(דיווחים ופניות › בקשת הד האנטר)»|bug-text|low|NEW|3|
|13|/admin/pricing|«plan_plus_monthly», «promotion_two_weeks»…|Raw keys shown|hide or label «מזהה:»|bug-text|low|STILL PRESENT? 12c683d2|4|
|14|/admin/pricing|«הד האנטר FREE: שת״פים בחודש» (= submissions) vs «פרסומי שת״פ בחודש»; שת״פ/משרה mix|Confusing labels|«הגשות לשת״פים בחודש»|copy-improvement|medium|NEW|5,6|
|15|pricing, user card|«שידרוגי/שידרוגים» vs «שדרוגים»; «שכר מינימום (₪)»=20000|Spelling; confusable with legal minimum wage|«שדרוגי טאלנט: רף ציפיות שכר (₪)»|bug-text|low|NEW|7|
|16|pricing|«טאלנט PRO חודשי» / «PRO לטאלנט, שנתי»; «דיסקרטי» vs «אנונימי»|Inconsistent naming|unified scheme, one term|copy-improvement|low|NEW|8|
|17|pricing PLUS/PREMIUM monthly|«(למשתמשי HR אין מנוי: הם משלמים לפי הצעה למכרז)» while «הצעה למכרז (HR)» is «טרם תומחר / לא פעיל»; missing on annual|Contradiction|move HR explanation to HR section|bug-text|low|related cddaabb4|9|
|18|/admin/users status filter|no «טיוטה» though table has it|Can't filter drafts|add option|bug/UX|medium|NEW|13|
|19|add-user dialog|«אדמין נכנס מיד. כל תפקיד אחר משלים…»|Heavy wording|«אדמין יכול להיכנס מיד. משתמשים בתפקידים אחרים ישלימו…»|copy-improvement|low|NEW|14|
|20|/admin/messages|«הודעת Admin…»|English word; elsewhere «אדמין»|«הודעה מצוות Hunters…»|translation|low|NEW|10|
|21|/admin/applications|«נשלח לשת”פ» (”), FAQ «השת"פ» (")|Inconsistent gershayim|«שת״פ» everywhere|bug-text|low|NEW|11|
|22|/admin/reports|«1 תוצאות»|Plural with 1|«תוצאה אחת»|bug-text|low|NEW|12|
|23|/admin/jobs/<id>|«תעשייה» = list «תחומי התמחות»|Same list, 2 names|«תחום»|copy-improvement|low|NEW|—|
|24|/admin/log filter|«תחום: תוכן ורשימות»|Naming mismatch with menu|«אזור: שאלות נפוצות ורשימות»|copy-improvement|low|NEW|—|
|25|all admin|title «Admin \| Hunters», aria «Notifications alt+T»|English in HE UI|«ניהול \| Hunters», «התראות (Alt+T)»|translation|low|NEW|—|
|26|faq category|«האנטרים»|Elsewhere «הד האנטרים»|«הד האנטרים»|copy-improvement|low|NEW|15|

Re-checked OK: 6aa26cae (users table translated); 12c683d2 (except pricing keys #13).
Off-topic: lots of test data in live tables («DEMO - לא לפרסם», «QA-AUTO-neg-job…», «QA autotest …»).
