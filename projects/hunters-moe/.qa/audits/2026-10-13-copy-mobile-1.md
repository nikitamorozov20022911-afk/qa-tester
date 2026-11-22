# Mobile copy/layout audit (emulation) — guest, talent (demo-talent-2), HR (demo-company-6) · 2026-10-13
Devices: iPhone 13 Mini (WebKit), Pixel 7 (Chrome). Screens: .qa/screenshots/copym-<role>-<ios|android>-<n>.png

| # | Role | Device | Page | Text | Problem | Fix | Sev | Shot |
|---|---|---|---|---|---|---|---|---|
|1|guest|both|footer, /ru/*|«© 2025 Hunters / Условия использования / Конфиденциальность / Доступность»|row 561px, no wrap: iOS page scrolls sideways 93px, «© 2025 Hunters» cut; Android page 486px > 412px, «Доступность» cut; HE fine|flex-wrap + 16px gutters|high (RU)|guest-ios-1, guest-android-1|
|2|guest|iPhone|footer /en/*|«© 2025 Hunters · Terms of use · Privacy · Accessibility»|378px in 375px, edge-to-edge, 1px h-scroll|same|low|guest-ios-2|
|3|guest|both|/headhunters «שירותי קידום והפצה» card|«שת”פ חדש במיוחד בשבילך באתר HUNTERS!»|campaign.svg icon covers first word (~51px)|icon above text / padding|medium|guest-ios-3, guest-android-2|
|4|talent|both|job dialog|badge «משרה חמה»|wraps into 2 lines (71/82px)|nowrap|low|talent-ios-1, talent-android-1|
|5|talent|iPhone|job dialog|«25,000 - 30,000» (טווח שכר)|142px text in 117px column, overflows card by 25px|allow wrap / wider column|medium|talent-ios-1|
|6|talent|both|/profile tabs|«החשבון שלי · השת”פים שלי · המנוי שלי · הסכמים · חשבוניות»|591px row in 343/380px, no scroll hint; iOS «המנוי ש», last tabs invisible; active tab not scrolled into view|scrollIntoView active + fade/arrow or 2 rows|medium|talent-ios-2, talent-ios-4, talent-android-2|
|7|talent|both|edit profile tabs|«ניסיון מקצועי»|377px in 299px; iOS shows only «ניסיון»|same / shorter label|low|talent-ios-3, talent-android-3|
|8|HR|iPhone (Android less)|tender dialog|chip «טכנולוגיה, מוצר, דאטה ומערכות מידע»|3 lines in fixed h-[29px] chip, overflows 15px up/down|min-h instead of h / truncate+title|medium|hr-ios-2, hr-android-2|
|9|HR|both|/tenders cards|«גיוס 4 מפתחי Full Stack לסניף הניו יורקי, כולל ליווי רילוקיישן.»|single-line truncate hides 25–57%|line-clamp 2 on mobile|low|hr-ios-1, hr-android-1|
|10|HR|both|/tenders?mine=1|link «כל המכרזים»|wraps «כל / המכרזים»|nowrap|low|hr-ios-3|

Note: plan badge «FREE ♛» missing on mobile (desktop header only). COVERED: 177d6270, 6a719ec6..ab, 83984efe, d1ffaa17, ec60cb6f, eb3cf227, 90273950, 9ba4bd44, 9efe48d7, 5398ef59.
