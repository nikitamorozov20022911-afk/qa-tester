async page => {
  const RUN = (globalThis.__f4run = (globalThis.__f4run||0)+1);
  const shot = RUN===1;
  const out=['RUN '+RUN+' '+new Date().toISOString()]; const B='https://hunters-sooty.vercel.app';
  const wait = async()=>{ await page.waitForLoadState('networkidle').catch(()=>{}); await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{}); };
  const MK=/QA-AUTO 1020 E1 (Alpha|Bravo|Charlie|Delta)|QA-AUTO 1020 E1 (V )?משרה|J-8[134]\b|8d25a157|29bd04ad|95e1d65a|152d3162/g;
  const hits = t => [...new Set((t.match(MK)||[]))].join(',')||'-';
  const mark = async (loc) => { await loc.evaluate(e=>{e.style.outline='4px solid red'; e.style.outlineOffset='2px';}).catch(()=>{}); };
  const txt = async()=> await page.evaluate(()=>{const d=document.querySelector('[role=dialog]'); return (d||document.querySelector('main')||document.body).innerText;});
  // comparison: active job J-49
  await page.goto(B+'/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584'); await wait();
  let d = page.locator('[role=dialog]').first(); await d.waitFor({timeout:15000}).catch(()=>{});
  const row = d.getByRole('button').filter({hasText:'QA-AUTO 1020 C2 אנונימי-1'}).first();
  const rowT = (await row.innerText().catch(()=>'NONE')).replace(/\n/g,' ');
  out.push('J-49 active: row C2 אנונימי-1 = '+rowT);
  if (shot){ await row.scrollIntoViewIfNeeded().catch(()=>{}); await mark(row); await page.screenshot({path:'screenshots/run-1020/E1/verify-F4-compare-active-J49-sender-sees-status-desktop.png'}); }
  // archived jobs
  for (const [n,id] of [['J-81','d7220429-9b52-4224-92a7-59df07b34af1'],['J-83','fcf90cb5-d691-490a-b6e2-65a135c0e35e'],['J-84','f7c2a15f-ebaf-495e-a15f-8bbad2157c64']]) {
    await page.goto(B+'/collaborations/'+id); await wait();
    const t = await txt(); out.push(n+' job: '+t.replace(/\n+/g,' / ').slice(0,90));
    if (shot && n==='J-81'){ const h=page.getByText('אופס, הדף לא נמצא').first(); await mark(h); await page.screenshot({path:'screenshots/run-1020/E1/verify-F4-J81-archived-404-sender-desktop.png'}); }
  }
  // applications
  for (const [n,id] of [['Alpha','8d25a157-dc89-4202-8993-fd1d003f6a16'],['Bravo','29bd04ad-e749-45d0-a3a8-8941f8d069a8'],['Charlie','95e1d65a-fc57-411d-95f8-52bab39c7c84'],['Delta','152d3162-b809-4970-b2bb-6ef41de34bee']]) {
    await page.goto(B+'/applications/'+id); await wait();
    const t = await txt(); out.push('/applications '+n+': '+t.replace(/\n+/g,' / ').slice(0,90));
    if (shot && n==='Alpha'){ const h=page.getByText('אופס, הדף לא נמצא').first(); await mark(h); await page.screenshot({path:'screenshots/run-1020/E1/verify-F4-applications-Alpha-404-sender-desktop.png'}); }
  }
  // candidate cards
  for (const [n,id] of [['Alpha','51b1cf64-9202-484d-b666-a9e1bec2a915'],['Bravo','060763f9-f3db-4310-937c-ad991eee3e68'],['Charlie','caa83508-9039-4a66-873f-e9da48b485d8'],['Delta','2508b9ba-5352-4c4d-985d-9dd6133509dc']]) {
    await page.goto(B+'/my-candidates/'+id); await wait();
    const t = await txt(); const i=t.indexOf('פעילות אחרונה');
    out.push('card '+n+': '+(i>=0?t.slice(i):'NO ACTIVITY BLOCK').replace(/\s+/g,' ').slice(0,160)+' | job/status mentions: '+(/J-8|משרה אנונימית|משרה NDA|התקבל|נדחה|נצפה|נשלח/.test(t)?'YES':'none'));
    if (shot && n==='Alpha'){ const h=page.getByText('פעילות אחרונה').first(); const blk=h.locator('xpath=..'); await mark(blk); await page.screenshot({path:'screenshots/run-1020/E1/verify-F4-card-Alpha-no-submissions-desktop.png', fullPage:true}); }
  }
  // lists
  for (const p of ['/my-candidates','/my-candidates?page=2','/my-jobs','/my-jobs?archived=1','/collaborations?mine=1','/profile']) {
    await page.goto(B+p); await wait(); await page.waitForTimeout(300);
    const t = await page.evaluate(()=>document.body.innerText);
    out.push(p+': hits '+hits(t)+' | status words: '+((t.match(/התקבל\/ה לעבודה|נדחה/g)||[]).length));
  }
  // ממתינים popup
  await page.goto(B+'/my-jobs'); await wait();
  await page.getByText('עוד',{exact:true}).first().click();
  await page.getByText(/^ממתינים/).first().click();
  const pop = page.locator('[role=dialog]').last(); await pop.waitFor({timeout:8000}).catch(()=>{});
  await pop.getByText('טוען…').first().waitFor({state:'detached',timeout:10000}).catch(()=>{});
  await page.waitForTimeout(500);
  let pt = await pop.innerText().catch(()=>'ERR');
  out.push('ממתינים tab1: '+pt.replace(/\n+/g,' / ').slice(0,500)+' | hits '+hits(pt));
  if (shot) await page.screenshot({path:'screenshots/run-1020/E1/verify-F4-pending-tab1-desktop.png'});
  const tabs = pop.getByRole('tab'); const tc = await tabs.count();
  for (let k=1;k<tc;k++){ await tabs.nth(k).click(); await page.waitForTimeout(800); const t2=await pop.innerText(); out.push('ממתינים tab'+(k+1)+': '+t2.replace(/\n+/g,' / ').slice(0,500)+' | hits '+hits(t2)); if (shot) await page.screenshot({path:'screenshots/run-1020/E1/verify-F4-pending-tab'+(k+1)+'-desktop.png'}); }
  return out.join('\n');
}
