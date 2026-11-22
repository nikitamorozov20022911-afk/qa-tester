Title: AI still produces masculine-only adjectives («בכיר») and gendered verbs in the candidate title/summary (intermittent)

What exists:
Role nouns are now neutral in all generations («חוקר/ת אבטחה» 7/7, «מנהל/ת מוצר» 3/3, «עורך/ת דין» every time). But adjectives and verbs about the candidate are still masculine-only or feminine-only, intermittently. Candidate «עורך דין בכיר במשרד גולדפרב», field «משפטים ורגולציה», experience: עורך דין בכיר / גולדפרב גרוס זליגמן 2019–now; מתמחה / הרצוג פוקס נאמן 2016–2018 — 7 of 16 generations had an error:
- Title «עורך/ת דין בכיר» (masculine adjective, 3 times).
- Summary «…ועורך/ת דין בכיר משנת 2016…», «ניסיון כעורך/ת דין בכיר משנת 2019…» (4 times).
- Wrong ending on the adjective: «עורך/ת דין בכיר/ת» (should be «בכיר/ה»).
- Masculine verb: «קודם לכן התמחה בשנים 2016-2018».
- Feminine-only forms: «ועורכות דין בכירה מאז 2019»; and for «Security Researcher בצ'ק פוינט» (1 of 7): «…וממשיכה בתפקיד מאז 2022».
It looks like the post-check adds «/ת» to the role noun only, and leaves the adjective after it and the verbs as they are.

What is needed:
Per this ticket («no masculine-only role nouns or adjectives») and the agreed rule (19.10): every word in the AI title and summary that refers to the candidate is neutral with «/»:
1. Adjectives: «בכיר/ה», «ותיק/ה», «מנוסה» (already neutral), «אחראי/ת» — never «בכיר» alone and never «בכיר/ת».
2. Verbs about the candidate: «התמחה/תה» → better neutral wording without a gendered verb, e.g. «התמחות בשנים 2016–2018», «ממשיך/ה בתפקיד» or «בתפקיד מאז 2022».
3. No feminine-only or plural forms about one candidate («עורכות דין», «ממשיכה»).
Applies to «הוספת מועמד/ת», editing a candidate, the talent's onboarding summary and the summary in the submit dialog. The post-check should cover the whole phrase (noun + adjective) and verbs, not only the role noun.
Done when: 10 generations in a row for the lawyer candidate above (and for «Security Researcher») give a title and summary with no masculine-only or feminine-only word about the candidate; the title reads «עורך/ת דין בכיר/ה».

Steps to reproduce:
1. Log in as claude-test@hunters.dev → «המועמדים שלי» → «+ הוספה».
2. Fill in the candidate above (any name, unique phone) → «המשך».
3. Step 2: read the title and summary. Repeat 3–5 times (new dialog each time) — the error appears in about every 2nd–3rd generation (see screenshots).

Attachments: screenshots/56ac83-v-law-summary-bakhir-masc-desktop.png, screenshots/56ac83-law-title-bakhir-masc-desktop.png, screenshots/56ac83-law-summary-masc-verb-desktop.png
