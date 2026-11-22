import {admin,SS,outline} from './h.mjs';
const A=await admin(); const p=A.p;
const posts=[]; p.on('request',q=>{if(q.method()==='POST') posts.push(q.postData()?.slice(0,400))});
async function dash(tag){
  await p.goto('https://magnet-admin.vercel.app/',{waitUntil:'domcontentloaded'});
  await p.locator('main').getByText(/דיווח/).first().waitFor({timeout:20000}).catch(()=>{});
  const t=(await p.locator('main').innerText()).replace(/\n+/g,' | ').slice(0,900);
  const badge=(await p.locator('nav, aside').first().innerText()).replace(/\n+/g,' ');
  console.log('DASH',tag,t,'\nSIDEBAR',badge);
  await p.screenshot({path:SS+`06e5ab-dashboard-${tag}-desktop.png`});
}
async function act(match,btn,shot,timeIdx){
  await p.goto('https://magnet-admin.vercel.app/reports',{waitUntil:'domcontentloaded'});
  await p.getByText('QA-AUTO סטורי לדיווח').waitFor({timeout:20000});
  let card=p.locator('article').filter({hasText:match});
  if(timeIdx) card=card.filter({hasText:timeIdx});
  console.log(btn,'cards matched',await card.count());
  card=card.first();
  await card.getByRole('button',{name:btn}).click();
  const dlg=p.locator('[role=dialog],dialog[open]').first();
  await dlg.waitFor({timeout:10000});
  console.log('DIALOG',btn,(await dlg.innerText()).replace(/\n+/g,' | '));
  await outline(p,dlg,shot+'-dialog-desktop.png');
  const n=posts.length;
  const resp=p.waitForResponse(r=>r.request().method()==='POST',{timeout:15000});
  await dlg.getByRole('button').last().click();
  const r=await resp; console.log('POST',r.status(),'body',posts[n]);
  await card.waitFor({state:'detached',timeout:10000}).then(()=>console.log('card left open list')).catch(()=>console.log('card STILL in list'));
  await p.screenshot({path:SS+shot+'-after-desktop.png'});
}
await dash('before');
await act('הטרדה או התנהגות פוגענית','דחייה','06e5ab-J1repeat-dismiss','15:47');
await act('פרופיל מזויף · דיווח מאת QA חופשי','הסלמה','06e5ab-J5-escalate');
await act('QA-AUTO תגובה לדיווח','הסרת התוכן','06e5ab-J3-remove');
for(const s of ['dismissed','escalated','resolved','open']){
  await p.goto('https://magnet-admin.vercel.app/reports?status='+s,{waitUntil:'domcontentloaded'});
  await p.getByRole('tablist').first().waitFor();
  await p.locator('article').first().waitFor({timeout:15000}).catch(()=>{});
  const qa=p.locator('article').filter({has:p.locator('a',{hasText:/^QA /})});
  console.log('TAB',s,(await p.getByRole('tablist').first().innerText()).replace(/\n/g,' '));
  for(const t of await qa.allInnerTexts()) console.log('  ',t.replace(/\n+/g,' | ').slice(0,300));
  for(const c of await qa.all()) await c.evaluate(e=>{e.style.outline='3px solid red'});
  await p.screenshot({path:SS+`06e5ab-tab-${s}-after-desktop.png`,fullPage:true});
}
await dash('after');
console.log(JSON.stringify(A.net));
await A.close();
