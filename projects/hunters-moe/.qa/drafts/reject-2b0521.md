Title: Job notifications about a deleted job are still in the bell after the cleanup

What exists:
After the cleanup all jobs are gone (/collaborations, /my-jobs and /admin/jobs show 0; old job and submission addresses open the 404 page; 45 accounts and 72 tenders are in place — OK). But demo-hunter-2@hunters.dev still has 2 notifications about the deleted job «QA test» in the bell (3/3):
- «המשרה „QA test” הסתיימה ולא מוצגת יותר. אפשר לחדש את הפרסום.» (kind post_expired, id 1b6ea311-8cb5-46c3-a4a2-e3f4cd0ad480, 08.10)
- «המשרה „QA test” מסתיימת בעוד יומיים. אפשר לחדש את הפרסום כדי שתמשיך להופיע» (kind post_expiring, id 7509aae9-491d-4019-a7b7-bd828ae5f5d9, 06.10)
Both link to /my-jobs, which is empty («עדיין לא פרסמתם משרות»), so the user is invited to renew a job that no longer exists. These notifications are not linked to a job id, so the cleanup did not catch them.

What is needed:
The ticket asks to delete all jobs together with the related data that belongs to them. Job notifications are such data:
1. Delete every remaining job notification (post_expired / post_expiring and any other job kinds) whose job no longer exists — for all users, not only demo-hunter-2, including notifications that reference the job only by name/subject and not by id.
2. After the cleanup, the bell of every account has no notification about a job (no «המשרה „…”» texts) until new jobs are published; tender notifications stay as they are.
3. Going forward (if possible): job notifications store the job id, so deleting a job also deletes its notifications.
Done when: demo-hunter-2 opens the bell and there is no «המשרה „QA test”…» notification; no other account has a notification about a deleted job.

Steps to reproduce:
1. Log in as demo-hunter-2@hunters.dev.
2. Open the bell and scroll to the bottom of the list.
3. Two notifications about «QA test» (see screenshot); click → /my-jobs is empty.

Attachment: screenshots/2b0521-v-stale-job-notif-desktop.png
