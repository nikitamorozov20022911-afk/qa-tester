async page => {
  const out=[]; const B='https://hunters-sooty.vercel.app';
  const wait = async()=>{ await page.waitForLoadState('networkidle').catch(()=>{}); await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{}); };
  await page.goto(B+'/collaborations/1711fbc7-9a6a-4c1f-b724-2a8304adc7ec'); await wait();
  const d = page.locator('[role=dialog]').first();
  out.push('JOB1711 '+((await d.count())? (await d.innerText()): await page.evaluate(()=>document.body.innerText.slice(0,500))).replace(/\n+/g,' / ').slice(0,2500));
  out.push('APPLINKS '+(await page.evaluate(()=>[...document.querySelectorAll('a[href*="application"]')].map(a=>a.getAttribute('href')+' ='+a.innerText.trim().slice(0,40).replace(/\n/g,' ')).join(' ; '))));
  await page.keyboard.press('Escape');
  await page.goto(B+'/my-jobs'); await wait();
  const od = page.getByText('עוד',{exact:true}).first(); await od.click(); await page.waitForTimeout(700);
  out.push('OD '+(await page.evaluate(()=>[...document.querySelectorAll('a,button,[role=menuitem]')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('href')||'')+' ='+(e.innerText||'').trim().replace(/\n/g,' ')).filter(s=>/ממתינ|הסכמ|עוד/.test(s)).join(' ; '))));
  return out.join('\n');
}
