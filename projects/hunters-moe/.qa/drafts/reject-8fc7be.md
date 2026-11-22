Title: Screenshot import does not fill or suggest «כותרת התפקיד» (the LinkedIn headline)

What exists:
Edit Profile → «פרטים אישיים» → «ייבוא מצילום מסך של LinkedIn» works: «בחירת תמונה», Ctrl+V and drag & drop; «כמה מילים עליכם», LinkedIn link, expertise, desired roles and languages are filled; first name, last name and address get «להשתמש בזה»; Wix, Check Point and Tel Aviv University are added to «ניסיון מקצועי»; nothing is saved before saving; wrong file type / >5MB / 5 images show clear errors; 375px is OK.
But the headline on the screenshot («Senior Backend Developer at Wix | Node.js · Go · Cloud») is not used at all (3/3): the required field «כותרת התפקיד» on the «ניסיון מקצועי» tab keeps «מנהל פרויקטים בנייה», there is no «להשתמש בזה» next to it, and the import summary does not mention it.

What is needed:
Per the ticket («extracts all the required details and automatically fills in the fields») and the import logic already used for the other fields:
1. If «כותרת התפקיד» is empty — it is filled with the headline from the screenshot (the role part, e.g. «Senior Backend Developer at Wix»; the skills part after «|» may be dropped).
2. If «כותרת התפקיד» is already filled — it stays as it is, and the headline from the screenshot is shown next to it with «להשתמש בזה», like first name / last name / address.
3. The import summary lists «כותרת התפקיד» among the filled fields or among the fields where the screenshot says something else.
Same in Registration (talent details step).
Done when: demo-talent-2 imports the screenshot and «כותרת התפקיד» shows «Senior Backend Developer at Wix» with «להשתמש בזה» (or it is filled when the field is empty).

Steps to reproduce:
1. Log in as demo-talent-2@hunters.dev → «עריכת פרופיל» → «פרטים אישיים».
2. «ייבוא מצילום מסך של LinkedIn» → «בחירת תמונה» → a LinkedIn profile screenshot with a headline (attached li-mock-1.png).
3. After the summary appears, open the «ניסיון מקצועי» tab: «כותרת התפקיד» = «מנהל פרויקטים בנייה», no suggestion (see screenshot).

Attachments: screenshots/8fc7be-v-headline-desktop.png, research/8fc7be/li-mock-1.png
