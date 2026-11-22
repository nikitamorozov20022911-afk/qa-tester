# Mobile copy/layout audit (emulation) — headhunter PLUS (claude-test) · 2026-10-13
Screens: .qa/screenshots/copym3-hunter-<ios|android>-<n>.png

| # | Device | Page | Text | Problem | Fix | Sev | Status | Shot |
|---|---|---|---|---|---|---|---|---|
|1|both|submit-candidate dialog, NDA block|«לחייב NDA(₪35)», «אין צורך ב-NDA(ללא עלות)»|bidi break: «לחייב (₪35 NDA»; «ב-» / «NDA» split; 24px title in 155/204px|price as separate line/badge, <bdi>, non-breaking «ב-NDA», 18–20px|medium|NEW|ios-6, android-4|
|2|both|/profile agreements, invoices; candidate «פעילות אחרונה»|table headers|880/560/640px tables in 303/340px, no hint; names cut, actions/dates hidden|cards / fade hint|medium|NEW (same pattern as mobile-2 #8)|ios-4, ios-9, ios-10, android-2, android-3|
|3|both (EN worse)|/talents-bank, /hunters cards|title «מנהלת מוצר עם 10 שנות ניסיון ב-SaaS»; «תחום» list|single-line truncate mid-word; only first area visible|line-clamp 2; first area + «+N»|medium|NEW|ios-7, ios-8, android-1|
|4|iPhone|/my-candidates, submit dialog list|«QA copy test מועמד גלוי / אנונימי»|names truncated, distinguishing part lost|line-clamp 2 / full width|low|NEW|ios-3, ios-5|
|5|both|header & burger|«+ פרסום», «PLUS» badge|hidden on mobile, not in burger/avatar menu|add to burger|medium|«+ פרסום» NEW (same as mobile-2 #4), badge SAME|ios-2, android-5|
|6|iPhone|job dialog|«60,000 - 80,000»|overlaps «0» → «80,0000»|—|medium|SAME AS mobile-1 #5|ios-1|
|7-11|both|various|«משרה חמה», chips, tender descriptions, profile tabs, EN footer|—|—|—|SAME AS mobile-1 #4,#8,#9,#6,#2|—|
|12|both|dialog titles with Latin|«הסכם סודיות (NDA): QA test», «הגשת QA copy test מועמד גלוי»|short Latin phrase split across lines|<bdi>, nowrap short LTR|low|NEW|ios-11|

Off-topic: /messages chat options «⋯» opacity-0 (hover-only) → invisible on touch.
