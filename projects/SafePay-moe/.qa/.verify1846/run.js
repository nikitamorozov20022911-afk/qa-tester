const { chromium } = require('../e2e/node_modules/playwright');
const [mode, width, tag] = [process.argv[2], +process.argv[3], process.argv[4]];
const pad = n => String(n).padStart(2,'0');
(async () => {
  const b = await chromium.launch({channel:'chrome'});
  const mobile = width < 768;
  const ctx = await b.newContext({ storageState: '../auth/client.json', viewport: {width, height: mobile?812:900}, deviceScaleFactor:2, isMobile:mobile, hasTouch:mobile, locale:'he-IL' });
  const p = await ctx.newPage();
  const posts = [];
  p.on('request', r => { if (r.method()!=='GET' && /supabase|rest\/v1|functions|rpc/.test(r.url())) posts.push({t:Date.now(), m:r.method(), u:r.url().split('?')[0]}); });
  p.on('response', async r => { if (r.request().method()==='POST' && /\/rest\/v1\/deals/.test(r.url())) { let body=''; try{body=(await r.text()).slice(0,300)}catch(e){}; posts.push({t:Date.now(), resp:r.status(), u:r.url().split('?')[0], body}); }});
  const errs=[]; p.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,200)); });
  const shot = async n => p.screenshot({path:`${tag}-${n}.png`});
  // start: home -> tab providers
  await p.goto('https://safepay.expo.app/', {waitUntil:'networkidle'}); await p.waitForTimeout(1500);
  const sw = await p.evaluate(async()=> (navigator.serviceWorker? (await navigator.serviceWorker.getRegistrations()).length : -1));
  console.log('SW registrations', sw);
  await p.getByText('נותני שירות',{exact:true}).filter({visible:true}).first().click(); await p.waitForTimeout(2500);
  console.log('1 providers URL', p.url());
  await p.getByText('שירה כהן — שיפוצים וניקיון').filter({visible:true}).first().click(); await p.waitForTimeout(2500);
  const providerUrl = p.url(); console.log('2 provider URL', providerUrl); await shot('A1-provider');
  await p.getByText('פתיחת עסקה בטוחה').filter({visible:true}).last().click(); await p.waitForTimeout(2500);
  console.log('3 form URL', p.url());
  const d = new Date(); const hhmm = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const title = mode==='dbl' ? `QA verify 1846 dbl ${hhmm}` : `QA verify 1846 ${hhmm}`;
  const boxes = p.getByRole('textbox',{name:'הקלד/י'}).filter({visible:true});
  await boxes.nth(0).fill(title);
  await p.getByRole('button',{name:/סוג העסקה/}).click(); await p.waitForTimeout(600);
  await p.getByRole('button',{name:'שיפוץ ובנייה'}).click(); await p.waitForTimeout(600);
  await boxes.nth(1).fill('בדיקת QA אימות 1846 — תנאים לבדיקה בלבד');
  await boxes.nth(2).fill('100');
  const dates = p.getByRole('textbox',{name:'00/00/0000'}).filter({visible:true});
  await dates.nth(0).click(); await p.keyboard.type('03102026'); await p.waitForTimeout(400);
  await dates.nth(1).click(); await p.keyboard.type('10102026'); await p.waitForTimeout(400);
  await p.keyboard.press('Escape').catch(()=>{});
  await p.waitForTimeout(800);
  const submit = p.getByRole('button',{name:'פתיחת עסקה בטוחה'}).filter({visible:true}).last();
  console.log('date values', await dates.nth(0).inputValue(), await dates.nth(1).inputValue(), 'submit disabled?', await submit.isDisabled());
  await shot('A2-form-filled');
  const t0 = Date.now();
  if (mode==='dbl') await submit.dblclick(); else await submit.click();
  await p.waitForURL(/\/deals\/(?!new)[^/?]+/, {timeout:20000}).catch(e=>console.log('no deal URL', e.message.slice(0,80)));
  await p.waitForTimeout(3000);
  const dealUrl = p.url(); console.log('4 after submit URL', dealUrl, 'ms', Date.now()-t0);
  await shot('A3-details');
  const vis = await p.evaluate(()=>{ const out=[]; document.querySelectorAll('div,span').forEach(e=>{ if(e.childElementCount===0){ const r=e.getBoundingClientRect(); if(r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0&&r.left<innerWidth&&r.right>0){ const s=getComputedStyle(e); if(s.visibility!=='hidden'&&s.opacity!=='0') out.push(e.innerText.trim()); } } }); return [...new Set(out.filter(Boolean))].slice(0,60); });
  console.log('visible texts:', JSON.stringify(vis));
  if (mode==='back') {
    const back = p.getByRole('button',{name:'חזרה'}).filter({visible:true});
    console.log('back buttons visible', await back.count());
    // highlight and click the in-app back on details screen (last visible = top-most screen)
    const bb = back.last();
    const box = await bb.boundingBox(); console.log('back box', JSON.stringify(box));
    await bb.evaluate(el=>{el.style.outline='3px solid red'; el.style.outlineOffset='2px'});
    await shot('A3c-back-btn'); await bb.evaluate(el=>{el.style.outline=''});
    await bb.click(); await p.waitForTimeout(3000);
    console.log('5 after חזרה URL', p.url());
    await shot('A4-after-chazara');
    const vis2 = await p.evaluate(()=>{ const out=[]; document.querySelectorAll('div,span').forEach(e=>{ if(e.childElementCount===0){ const r=e.getBoundingClientRect(); if(r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0&&r.left<innerWidth&&r.right>0){ out.push(e.innerText.trim()); } } }); return [...new Set(out.filter(Boolean))].slice(0,40); });
    console.log('visible after back:', JSON.stringify(vis2));
    // second press
    const back2 = p.getByRole('button',{name:'חזרה'}).filter({visible:true});
    if (await back2.count()) { await back2.last().click(); await p.waitForTimeout(2500); console.log('6 after 2nd חזרה URL', p.url()); await shot('A5-after-2nd-chazara'); }
  }
  await p.waitForTimeout(2000);
  // go to deals list
  await p.goto('https://safepay.expo.app/deals', {waitUntil:'networkidle'}); await p.waitForTimeout(3000);
  console.log('deals URL', p.url());
  const rows = p.getByText(title, {exact:false}).filter({visible:true});
  console.log('TITLE', title, 'rows in list:', await rows.count());
  for (let i=0;i<await rows.count();i++){ await rows.nth(i).evaluate(el=>{el.scrollIntoView({block:'center'}); el.style.outline='3px solid red'}); }
  await shot('A6-deals-list');
  console.log('NETWORK', JSON.stringify(posts.filter(x=>/deals/.test(x.u)||x.resp), null, 0));
  console.log('POST deals count', posts.filter(x=>x.m==='POST' && /\/rest\/v1\/deals$/.test(x.u)).length);
  console.log('all non-GET', JSON.stringify(posts.map(x=>(x.m||x.resp)+' '+x.u)));
  console.log('console errors', JSON.stringify(errs.slice(0,10)));
  await b.close();
})();
