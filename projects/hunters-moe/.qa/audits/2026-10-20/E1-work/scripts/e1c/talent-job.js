async page => {
  const JOB='77f6896c-9f7c-4cbe-b9e6-1b30ff48344a', T='QA-AUTO 1020 E1 משרה לטאלנט';
  const tag = globalThis.__r || 'talent';
  const SH = n => `/Users/avielshnaider/hunters-moe/.qa/screenshots/run-1020/E1/E1C-${n}-${tag}-desktop.png`;
  const out=[];
  // 1) bell
  await page.goto('https://hunters-sooty.vercel.app/collaborations');
  const b = page.getByRole('button', { name: /התראות/ }).first();
  await b.waitFor({ timeout: 15000 });
  out.push('BELL LABEL: ' + await b.getAttribute('aria-label') + ' / badge: ' + (await b.innerText()).trim());
  await b.click();
  const panel = page.getByRole('dialog').or(page.locator('[data-radix-popper-content-wrapper]')).first();
  await panel.waitFor({ timeout: 10000 });
  await panel.getByText('טוען…').waitFor({ state: 'detached', timeout: 15000 }).catch(()=>{});
  const n = panel.locator('a', { hasText: T });
  const cnt = await n.count();
  out.push('BELL notif count for job: ' + cnt);
  if (cnt) { out.push('BELL notif: ' + (await n.first().innerText()).replace(/\n/g,' | ') + ' => ' + await n.first().getAttribute('href')); 
    await n.first().evaluate(e => e.style.outline='3px solid red');
  } else out.push('BELL top: ' + (await panel.innerText()).slice(0,400).replace(/\n/g,' | '));
  await page.screenshot({ path: SH('73-AC05-bell') });
  if (cnt) {
    await n.first().click();
    await page.waitForURL(/collaborations\//, { timeout: 15000 }).catch(()=>{});
    out.push('AFTER CLICK URL: ' + page.url());
  } else await page.keyboard.press('Escape');
  // 2) list
  await page.goto('https://hunters-sooty.vercel.app/collaborations?sort=newest');
  await page.waitForLoadState('networkidle').catch(()=>{});
  const card = page.locator(`a[href="/collaborations/${JOB}"]`);
  out.push('LIST page1 card count: ' + await card.count());
  if (await card.count()) { const c = card.first(); await c.evaluate(e => e.style.outline='3px solid red'); out.push('CARD: ' + (await c.innerText()).replace(/\n/g,' | ')); const r = await c.boundingBox(); out.push('CARD box: '+JSON.stringify(r)); await c.scrollIntoViewIfNeeded(); }
  await page.screenshot({ path: SH('52-AC01-list') });
  // 3) details
  await page.goto(`https://hunters-sooty.vercel.app/collaborations/${JOB}`);
  await page.getByText(T).first().waitFor({ timeout: 15000 });
  await page.waitForLoadState('networkidle').catch(()=>{});
  const dlg = page.getByRole('dialog').first();
  const root = (await dlg.count()) ? dlg : page.locator('main');
  out.push('DETAILS: ' + (await root.innerText()).slice(0, 3000));
  await page.screenshot({ path: SH('52-AC03-details') });
  const btns = await root.locator('button,a').evaluateAll(as=>as.map(a=>(a.innerText||a.getAttribute('aria-label')||'').trim().replace(/\n/g,' ').slice(0,60)+' => '+(a.getAttribute('href')||'')));
  out.push('BTNS: ' + btns.join(' ;; '));
  return out.join('\n');
}
