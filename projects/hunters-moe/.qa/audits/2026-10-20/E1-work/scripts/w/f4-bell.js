async page => {
  const out=[]; const B='https://hunters-sooty.vercel.app';
  const wait = async()=>{ await page.waitForLoadState('networkidle').catch(()=>{}); await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{}); };
  // any /applications links anywhere in sender UI
  const found={};
  for (const p of ['/my-candidates','/my-candidates/51b1cf64-9202-484d-b666-a9e1bec2a915','/my-jobs','/my-jobs?archived=1','/collaborations?mine=1','/profile','/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584']) {
    await page.goto(B+p); await wait();
    found[p]=(await page.content()).match(/\/applications\/[0-9a-f-]{8}/g)||[];
  }
  out.push('APP LINKS IN HTML: '+JSON.stringify(found));
  await page.goto(B+'/my-jobs'); await wait();
  const b = page.locator('button[aria-label*="התראות"]').first(); await b.click();
  const panel = page.locator('[role=dialog],[role=menu],[data-radix-popper-content-wrapper]').last();
  await panel.waitFor({timeout:8000}).catch(()=>{}); await panel.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
  const items = await panel.evaluate(p=>[...p.querySelectorAll('a')].map(a=>a.getAttribute('href')+' = '+a.innerText.replace(/\n/g,' ').slice(0,120)));
  out.push('BELL: '+items.filter(s=>/E1|Alpha|Bravo|Charlie|Delta|עודכן|התקבל|נדחה/.test(s)).join('\n  ')+'\n(total '+items.length+')');
  return out.join('\n');
}
