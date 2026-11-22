# Mobile copy/layout audit (emulation) — company (demo-company-1), admin · 2026-10-13
Screens: .qa/screenshots/copym2-<role>-<ios|android>-<n>.png

| # | Role | Device | Page | Text | Problem | Fix | Sev | Status | Shot |
|---|---|---|---|---|---|---|---|---|---|
|1|admin|both|admin burger menu, any /admin/*|menu items «משתמשים … יומן פעולות»|Menu opens as empty 71px white strip; overlay fixed inside sticky header with backdrop-filter → links hidden under content; can't navigate admin on mobile|portal overlay to body / remove backdrop-filter|high|NEW|admin-ios-3, admin-android-1|
|2|admin|both|users, jobs, tenders, applications, lists, log, messages, pricing|table headers|Tables 760–1329px in 341px, no scroll hint; only 1–2 columns visible, «סטטוס», «פעולות» off-screen; «הד האנטר» wraps, «שינוי סטטוס משרה» 3 lines|cards on mobile / sticky first+actions column + scroll shadow|high|NEW|admin-ios-1, admin-ios-4|
|3|admin|both|/admin/messages, /admin/pricing empty|«עוד לא נשלחו הודעות מערכת», «עוד אין קופונים»|Centered on 760px table, only «עוד לא נ» visible|center outside scroll area|medium|NEW|admin-ios-2, admin-android-2|
|4|company|both|header & burger|«+ פרסום» → «פרסום משרה / פרסום מכרז»|Button hidden <640px, absent from burger/avatar menu → company can't start publishing on phone; plan badge missing too|add to burger|high|NEW|company-ios-5|
|5|company|iPhone|own job dialog|«25,000 - 30,000» next to «הצעות שהוגשו 2»|Overflows and merges: «25,000 - 30,0002»|wrap/min-width/gap|medium|SAME AS mobile-1 #5|company-ios-2|
|6|company|both|own job dialog|badge «משרה חמה», chip «טכנולוגיה, מוצר, דאטה ומערכות מידע»|2 lines inside 29px chip|min-h / nowrap|low|SAME AS mobile-1 #4,#8|company-android-1|
|7|company|both|own job dialog «מנהל/ת המשרה»|«demo-company-1@hunters.dev»|Email broken at hyphen into 2 lines|dir=ltr, break-all or truncate|low|NEW|company-android-1|
|8|company|both|/profile «הסכמים»|«שם · סוג ההסכם · תאריך חתימה · תוקף · פעולות»|880px table in 303/340px, no hint; «פעולות» hidden|cards / hint|medium|NEW|company-ios-4, company-android-2|
|9|company|both|own job dialog candidates|«QA-AUTO flow candidate Close-test»|Names truncated despite space; RTL truncation of Latin name cuts start|dir=auto / 2 lines|low|NEW|company-ios-3|
|10|company|both|job cards with «משרה חמה»|«טכנולוגיה, מוצר, דאט…»|Category chip truncated next to badge|wrap / badge on own row|low|NEW|company-ios-1|
|11|company|both|/publish/tender step 1|«מכרז מקודם (₪1,500 למכרז לשבועיים)»|24px title in 183px → 3 lines, price bracket split|price as subtitle / smaller font|low|NEW|company-ios-6|

COVERED: 90273950 (payment terms placeholder), 5398ef59, 69169058, 6a719ec6..ab/83984efe, ff5d40b7; tender description truncation = mobile-1 #9.
