import { chromium } from 'playwright';
const step = process.argv[2];
const b = await chromium.launch();
const c = await b.newContext({ storageState: '../auth/admin.json', viewport:{width:390,height:844} });
const p = await c.newPage();
p.on('dialog', async d => { console.log('NATIVE DIALOG:', d.message()); if (step==='confirm') await d.accept(); else await d.dismiss(); });
await p.goto('https://zichui-harabim.expo.app/admin/edit?key=birkat_halevana_ashkenaz&draft=fe5eaec0-c80c-40cd-aeb3-e85ab24bf6f2', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);
const t0 = await p.locator('body').innerText();
console.log('HAS QA TITLE:', t0.includes('בדיקת QA'), '| has delete btn:', t0.includes('מחיקת הטיוטה'));
await p.getByText('מחיקת הטיוטה', { exact: true }).last().click();
await p.waitForTimeout(1500);
const t1 = await p.locator('body').innerText();
console.log('--- after click ---\n', t1.slice(-700));
if (step==='confirm') {
  const btns = p.getByRole('button');
  const names = await btns.allInnerTexts(); console.log('BUTTONS:', names.filter(Boolean).slice(-8));
}
await p.screenshot({ path: '../screenshots/a5decf4a-r2-add-6-delete-'+step+'-mobile.png' });
await b.close();
