# Action messages & validation texts — company (demo-company-1) · 2026-10-13 · desktop
Screens: .qa/screenshots/copya-company-<n>.png. Free tender stopped at payment window «אישור תשלום ₪0.00» (button blocked by permission system) → tender stays «ממתין לתשלום».

| # | Screen | Action | Exact text | Problem | Suggested (HE) | Type | Sev | Status | Shot |
|---|---|---|---|---|---|---|---|---|---|
|1|Tender step 3|end date 31.2.2027|«משהו השתבש, נסו שוב» / EN «Something went wrong, please try again»|Impossible date passes client, server generic error|«התאריך שנבחר לא קיים…»; hide 29–31 for short months|bug-text/validation|medium|NEW|3,9|
|2|Tender step 4 → payment|free tender|«תשלום», «תשלום חד פעמי · ₪0.00», «אישור תשלום ₪0.00»|Payment window for free publish|publish directly; button «פרסום המכרז»|copy|medium|NEW (near 5398ef59)|5|
|3|Own tender card / my tenders|after step 4 unpaid|«ממתין לתשלום», «להשלמת התשלום»; industry «בריאות, מדעי החיים…» not asked in wizard|Awaiting payment for free item|«טיוטה – הפרסום לא הושלם»|bug-text|medium|NEW|6|
|4|Payment window (job promotion)|«לרכישה»|«שמירת פרטי כרטיס להזמנות עתידות»; «כרטיס אשראי/דיירקט»|Typo; unclear|«…לרכישות עתידיות»; «כרטיס אשראי»|bug-text|medium|NEW|1|
|5|After publishing free job|upsell|«האם לשדרג את השת”פ שלך?», «קידום שת”פ (₪700)», «…לכל ההד האנטרים באתר Hunters»|Upsell right after free; double ה|«רוצים לקדם את המשרה?»|copy|medium|NEW (שת"פ 69169058; 4w 5398ef59)|2|
|6|Tender step 4; job step 1|submit empty then fix|«יש לאשר כדי להמשיך», «שדה חובה» stay after fixing|Stale errors|clear on change|bug UX/copy|medium|NEW|4,11|
|7|Candidate status menu|open|«הסיר מועמדות», «מועמד לא מגיב», «מוכר ונשלל»; «חדש» vs «נשלח לשת”פ»|No subject, masculine, jargon; no "hired" status; status mismatch|«המועמד/ת הסיר/ה מועמדות»…, add «התקבל/ה לעבודה»|bug-text|medium|NEW|8|
|8|Company profile edit|bad website/LinkedIn|«יש להכניס כתובת תקינה» / «Enter a valid address»|Confused with «כתובת» (address) field|«יש להזין קישור תקין, למשל https://…»|bug-text|low|NEW|10|
|9|Company profile edit|clear company name|(no error)|Empty company name accepted|«יש להזין את שם החברה»|validation|medium|NEW|7|
|10|Job step 1|salary «abc»/«-3»; guarantee 1.5|«יש להזין מספר»|Which field/what's wrong unclear|«שכר מינימלי: יש להזין מספר חיובי»; «מספר ימים שלם»|copy|low|NEW|—|
|11|Job step 1|min = max|accepted; min>max: «השכר המקסימלי צריך להיות גבוה מהמינימלי»|Text says "higher" but equal OK|«…גבוה מהמינימלי או שווה לו»|bug-text|low|NEW|—|
|12|Job step 1 / tender step 3|long title|job silently cuts at 200; tender «ארוך מדי (עד 200 תווים)»; «הטקסט ארוך מדי…» vs «ארוך מדי…»|Inconsistent|one text + counter|consistency|low|NEW|—|
|13|Job step 2 «שאלות סינון»|600 chars / spaces|accepted; no explanation|No limit/hint|subtitle + limit|copy|low|NEW|—|
|14|Tender step 3|empty «שעתי/פרויקטאלי»|«שדה חובה»|Imprecise for checkbox group|«יש לבחור לפחות מודל אחד»|copy|low|NEW|—|
|15|Reject tender offer / status «נדחה»|«דחייה»|toasts «ההצעה נדחתה ונשלח עדכון למגיש/ה», «הסטטוס עודכן»|Irreversible without confirm/reason; generic toast|confirm dialog with reason|copy|low|NEW|—|
|16|«דיווח על פרופיל»|«אחר» empty; 2100+ chars|submittable; cut at 3000 without counter|No hint to describe|«יש לפרט את הסיבה»|copy|low|NEW|—|
|17|Chat → דיווח|report chat|native confirm() «לדווח על השיחה לצוות Hunters?»|Browser dialog, no reason|branded dialog|copy|low|COVERED 90273950|—|
|18|Renew job|«חידוש הפרסום»|toast «הפרסום חודש»|No new end date|«הפרסום חודש עד 10.11.2026»|copy|low|NEW|—|
|19|Archive job|«העברה לארכיון»|«העברת משרה לארכיון!»; archived job keeps «תאריך סיום: 10.11.2026» and «📣 עידכון שותפים»|"!" in confirm; future end date on closed job|«להעביר את המשרה לארכיון?»|bug-text|low|NEW (50%: 5398ef59)|—|
|20|Request full profile|«בקשת פרופיל מלא»|ok; «שת”פ» in notification|—|—|—|—|COVERED 69169058|—|
|21|Anonymous submission dialog|open|«הגשת מועמד באופן דיסקרטי!», «תקציר המועמד – נוצר באמצעות AI – —»|"!" in info text; empty AI summary as «—»|«הגשה דיסקרטית», «התקציר עדיין לא זמין»|bug-text|low|NEW|—|
|22|Chat|5100 chars|«ההודעה ארוכה מדי (עד 4000 תווים)», counter only after error|«4000» vs «5,000» format|«עד 4,000 תווים»|consistency|low|NEW|—|

Bell: company gets no notifications for its own actions (publish/renew/archive/approve/reject).
Off-topic: headhunter candidate «שכר מבוקש» = «abc» (no validation on hunter side).
