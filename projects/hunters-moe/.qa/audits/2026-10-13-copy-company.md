# Copy audit — company (company.json) + HR (company_6.json) · 2026-10-13 · desktop 1440×900 · HE (+EN spot)
Screens: .qa/screenshots/copy-company-<n>.png
Created drafts (step 1 "המשך" auto-saves) — CLEANUP: job f945a5db-4802-4f45-be12-6d0d3cd3a30c, tender 1f000004-c8cb-4420-a616-3271750c1c78 («QA copy audit - לא לפרסם»).

| # | Role | Where | Current text | Problem | Suggested (HE) | Type | Sev | Status | Shot |
|---|---|---|---|---|---|---|---|---|---|
|1|company|/tenders/{id} offers|«₪150», «₪175»; «אישור»/«דחייה»|No unit (hourly); vague buttons|«₪150 לשעה»; «אישור ההצעה»/«דחיית ההצעה»|copy-improvement|medium|NEW|1|
|2|company|same|«הוספה למועדפים» on own tender|Pointless for author|hide|copy-improvement|low|NEW|1|
|3|company|/publish/job step 1|«תעשיה», «קבצים רלוונטים»|Spelling|«תעשייה», «רלוונטיים»|bug-text|low|NEW|2|
|4|company|/publish/job|«פרסום שת”פ», «עמלת שת”פ (%)»|Headhunter term|«פרסום משרה», «עמלה להד-האנטר (%)»|bug-text|medium|STILL 69169058|2|
|5|company|/publish/job|«מס' ימי אחריות לגיוס»|Unchanged|—|bug-text|low|regression? 3fe81e11|2|
|6|company|/publish/job/post step 3|«חברות משלמות לפי פרסום…» + all «(חינם)»|Contradiction|real price or «בתקופת ההשקה… ללא עלות»|copy-improvement|medium|NEW|3|
|7|company|/publish/tender step 1|«₪0 למכרז לשבועיים / 50% הנחה על הרחבה»|50% of 0|drop discount line for free|copy-improvement|medium|NEW|4|
|8|company|tender step 2|«…בשביל להגיש מועמדות»|NDA contradiction (known); «מועמדות» vs «הצעה» NEW|«…כדי להגיש הצעה»|bug-text|medium|STILL 9bc698d6 + NEW|5|
|9|company|tender step 3|«איזור משרה», «לא רלוונטי לאיזור הזה», «האם תרצה…»|Spelling, wrong noun, gender|«אזור», «בחרו קודם אזור», «תרצו»|bug-text|low|NEW|6|
|10|company|tender step 4|«רק מוודאים . . .», «הפירסום», «האנטרים», sentence w/o verb, signature no label|Several|«רק מוודאים…», «הפרסום», «קראתי ואני מסכים/ה…», «חתמו כאן:»|bug-text|medium|NEW|7|
|11|both|/faq tabs|«חברות/אירגונים», «האנטרים»|Spelling/term|«ארגונים», «הד-האנטרים»|bug-text|low|NEW|8|
|12|company|/faq «כמה עולה פרסום מכרז?»|«…המחירים המעודכנים מוצגים בשלב הפרסום.»|No answer; only 3 Qs, none on jobs|state prices; add job Qs|copy-improvement|medium|NEW|8|
|13|company|/faq|«ההד האנטרים יגישו הצעות…»|Double ה|«הד-האנטרים…»|bug-text|low|NEW|9|
|14|company|/messages|phone «972521234567»; «לסמן כלא נקרא»|Format; grammar form|«+972 52-123-4567»; «סימון כלא נקרא»|bug-text|low|NEW|10|
|15|company|bell|«הוגש מועמד חדש לשת”פ QA company post test»|Headhunter term; no quotes|«…למשרה „…”»|bug-text|medium|NEW|11|
|16|company|/profile NDA|«התחייבויות מנהל/ת השת״פ»; «שנתיים מסיום תהליך הגיוס» vs «בתוקף עד 3.8.2031»|Wrong party term; 2y vs 5y|«התחייבויות החברה המגייסת»; align term|bug-text|high (legal)|NEW|12|
|17|company|/profile?edit=details|«למשל: הד האנטרית ויועצת קריירה», «תואר מקצועי», «כמה מילים עליך»|Headhunter profile fields for company|«תחום פעילות החברה», «על החברה»|bug-text|medium|NEW|13|
|18|company EN|/en/tenders|«Estimated scope: משרה מלאה»; «11.29.2027»|Untranslated; ambiguous date|«Full-time»; «Nov 29, 2027»|translation|medium|NEW|14|
|19|HR|bell|«מנהל/ת שיווק דיגיטלי הסתיים ולא מוצג יותר…»|Reads as if manager "ended"|«פרסום המשרה „…” הסתיים…»|bug-text|medium|NEW|15|
|20|HR|/tenders?mine=1|tab «המכרזים שלי» vs heading «המכרזים שהגשתי אליהם»; empty state no CTA|Inconsistent|«ההצעות שלי»; CTA|copy-improvement|low|NEW|15|
|21|HR|tender offer form|«…לייצוג משרה זו…»; «בשליחת הצעה זו הינך מאשר/ת…»|Headhunter term; legalese|«…לביצוע הפרויקט…»; simpler|bug-text|medium|NEW|16|
|22|HR|/profile|«…כשהשירות מתומחר.»|Unclear, no price|«…₪X להצעה»|copy-improvement|medium|NEW|17|
|23|HR|/messages empty|«לא נמצאו הודעות» ×2|Duplicate, no CTA|explain when chat opens|copy-improvement|low|NEW|18|
|24|HR|/faq|defaults to «האנטרים», no HR tab|Wrong audience|add «אנשי HR» tab|copy-improvement|low|NEW|19|
|25|company|/collaborations/{id} own job|«פרטי השת”פ», «הצעות שהוגשו לשת”פ», «📣 עידכון שותפים»|Terms, spelling|«פרטי המשרה», «מועמדים שהוגשו», «עדכון להד-האנטרים»|bug-text|medium|STILL 69169058 + NEW|20|

Minor (NEW, low): nav «שת”פים» for company; tooltip «טווח התקציב שהלקוח הגדיר»; «ממתינים» unclear; «+ פרסום» no explanation job vs tender; «היקף מוערך 35»; «מסננים»/«סינונים» on one panel; dates 21.09.2026 / 21.9.26; phone formats ×3; «NDA הד האנטרים» mixed language; EN «head hunters», «Great to have you publish a tender with us!»; untranslated aria labels.
Still present: e6e0fa11, MentMe/lorem footer, 9bc698d6, 69169058, 6a900c7d.
Test data visible: «DEMO - לא לפרסם», tender «test/test», chat «בלה בלה בלה», «test test», «דב האנטר».
