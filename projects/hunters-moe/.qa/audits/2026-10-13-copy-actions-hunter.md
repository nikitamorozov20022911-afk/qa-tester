# Action messages & validation texts — headhunter PLUS (claude-test) · 2026-10-13 · desktop
Screens: .qa/screenshots/copya-hunter-<n>.png. Not checked: edit own job (no "עריכה" item), NDA signing, card payment (gateway down — toast text OK).

| # | Screen | Action | Exact text | Problem | Suggested (HE) | Type | Sev | Status | Shot |
|---|---|---|---|---|---|---|---|---|---|
|1|Anonymous talent profile → «שליחת הודעה»|open chat|header «עמית לוי», phone, demo-talent-5 email; list «צרו קשר עם עמית לוי»|Anonymous identity revealed via second path|«טאלנט אנונימי», no contacts|BUG privacy|critical|NEW (related 80c43786)|6|
|2|NDA payment on candidate submission|anonymous + «לחייב NDA(₪35)» → «המשך לתשלום»|product name `checkout.products.application_nda`|Raw i18n key, overflows card|«חתימת NDA על הגשת מועמד»|raw key|high|NEW|4|
|3|/my-candidates/new|name/about too long|`onboarding.errors.Too big` (EN same)|Raw key; edit profile shows «ארוך מדי (עד 100 תווים)»|«ארוך מדי (עד X תווים)»|raw key|high|COVERED 0d3f4774 (new screen)|2|
|4|Submit candidate to job|empty summary, unanswered screening Q, salary «abc»|accepted; card shows «—», «לא נענתה», «abc»|No validation|«יש להזין שכר במספרים», «יש לענות על שאלת הסינון»|validation|high|NEW|5|
|5|Submit candidate|«סיום והגשה»|no toast|No feedback|«המועמד/ת הוגש/ה בהצלחה»|feedback|medium|NEW|—|
|6|Anonymous submission card|after submit|red banner «הגשת מועמד באופן דיסקרטי!»|Info styled as error|neutral «הגשה דיסקרטית»|UX/tone|low|NEW|5|
|7|/my-candidates/new step 2, open profile|«המשך»|«בפרופיל אנונימי יוצגו רק הכותרת והתקציר»|Anonymous text on open profile|hide / «כותרת ותקציר המועמד»|context|medium|NEW|3|
|8|/my-candidates/new step 2 anonymous|empty title+summary|accepted «המועמד נוסף בהצלחה»|Anonymous candidate with nothing to show|«יש למלא כותרת ותקציר לפרופיל אנונימי»|validation|medium|NEW|—|
|9|Candidate add/edit; edit profile|«טלפון נוסף» = abc|no error|Second phone not validated|«יש להכניס מספר טלפון תקין»|validation|medium|NEW|2|
|10|Payment (promotion)|empty / wrong coupon|nothing happens; «אישור» disabled at ₪0 without hint|No coupon feedback (company side shows «קוד הקופון אינו בתוקף»)|«קוד הקופון אינו תקף»|feedback|medium|NEW|1|
|11|Payment|—|«שמירת פרטי כרטיס להזמנות עתידות»|Typo|«…עתידיות»|typo|medium|NEW (same as company #4)|1|
|12|Upgrade after publish|free promotion → «לרכישה» → «אישור תשלום ₪0.00»|closes without toast (promotion applied «קידום עד 27.10.2026»)|No confirmation; purchase wording for free|«הפעלה» / «הקידום הופעל עד …»|feedback|medium|NEW|—|
|13|Publish step 2 screening Qs|1200 chars / spaces|published|No limit/empty check|«השאלה ארוכה מדי…»|validation|low|NEW|—|
|14|Publish step 1|title 300 chars|silently cut to 200|No counter|«0/200»|feedback|low|NEW|—|
|15|Tender offer|amount 0|«יש להזין סכום»|Misleading|«יש להזין סכום גדול מ-0»|copy|low|NEW|—|
|16|Tender offer checkbox|—|«…לייצוג משרה זו באופן מקצועי והולם.» (EN «represent this role»)|Wrong term|«…לביצוע פרויקט זה»|copy|low|COVERED eb3cf227 (HR same text)|—|
|17|Tender offer success|submit|«ההצעה הוגשה בהצלחה / נעדכן אותך בסטטוס הפנייה…» button «איזה כיף!»|«פנייה» vs «הצעה»; odd close button|«…בסטטוס ההצעה», «סגירה»|copy|low|NEW|—|
|18|Bell|company requested full profile|«מנהל/ת המשרה QA company post test ביקש/ה את הפרופיל המלא»|No candidate name; job title without quotes reads as name|«סופר פארם ביקשה את הפרופיל המלא של <מועמד> למשרה "…"»|copy|medium|NEW|—|
|19|Bell|—|«QA low salary test הסתיים ולא מוצג יותר», 5× «הסטטוס של ההגשה שלך לשת״פ … עודכן»|No "המשרה", no new status|«המשרה "X" הסתיימה», «הסטטוס עודכן ל"…"»|copy|low|NEW (HR variant in eb3cf227)|—|
|21|Report job/tender|reasons list|«פרופיל מזויף»|Profile reason on job/tender|«משרה/מכרז מזויף»|context|low|NEW|—|
|22|«📣 עידכון שותפים»|3000 chars|silently cut at 300|No counter|«0/300»|feedback|low|NEW|—|
|23|Chat|5013 chars|only red counter «5013/4000», Enter does nothing (company sees text error)|No message|«ההודעה ארוכה מדי (עד 4,000 תווים)»|copy|low|NEW|—|
|24|Archive dialog|—|«העברת משרה לארכיון!»; archived job keeps «משרה חמה», «תאריך סיום»|"!"; stale labels|—|copy|low|NEW (same as company #19)|—|
|25|AI candidate summary|auto|«…המועמד מציין יכולת לעבוד בצוות…» for candidate without such data|AI invents facts; masculine|use only given data|content|medium|NEW|—|

Covered: native confirm() 90273950; aria «Country code» ff5d40b7; typos 9efe48d7; glossary 47533803; phones 177d6270; offers limit 5398ef59.
