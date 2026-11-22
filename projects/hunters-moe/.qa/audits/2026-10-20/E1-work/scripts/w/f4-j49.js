async page => {
  const out=[]; const B='https://hunters-sooty.vercel.app';
  const wait = async()=>{ await page.waitForLoadState('networkidle').catch(()=>{}); await page.getByText('טוען…').first().waitFor({state:'detached',timeout:15000}).catch(()=>{}); };
  await page.goto(B+'/collaborations/7e4ad713-60a0-4e68-9926-56e0ee667584'); await wait();
  const d = page.locator('[role=dialog]').first();
  out.push('J49 '+((await d.count())? (await d.innerText()): await page.evaluate(()=>document.body.innerText.slice(0,500))).replace(/\n+/g,' / ').slice(0,3000));
  out.push('APPLINKS '+(await page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')).filter(h=>/applic/.test(h)).join(' ; '))));
  out.push('BTNS '+(await page.evaluate(()=>[...document.querySelectorAll('[role=dialog] button,[role=dialog] [role=tab]')].map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\n/g,' ')).join(' | '))));
  return out.join('\n');
}
