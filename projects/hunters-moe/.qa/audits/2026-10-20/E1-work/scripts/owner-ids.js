async page => {
  const found = [];
  const h = async r => { try { const t = await r.text(); const re = /"id":"([0-9a-f-]{36})","jobId":"d7220429[^"]*","title":"([^"]*)","anonymous":(true|false),"status":"([^"]*)"/g; let m; while ((m = re.exec(t))) found.push(m[1]+' title='+m[2]+' status='+m[4]); } catch(e){} };
  page.on('response', h);
  await page.goto('https://hunters-sooty.vercel.app/collaborations/d7220429-9b52-4224-92a7-59df07b34af1');
  const d = page.getByRole('dialog').first(); await d.waitFor();
  await page.waitForLoadState('networkidle').catch(()=>{});
  const cards = d.getByRole('button', { name: /מועמד\/ת אנונימי\/ת/ });
  const n = await cards.count(); const res=[];
  for (let i=0;i<n;i++) { found.length=0; await cards.nth(i).click(); await page.waitForLoadState('networkidle').catch(()=>{}); await page.waitForTimeout(1500); const sum = (await page.getByRole('dialog').last().innerText()).match(/AI\n\n([^\n]*)/); res.push(i+': '+[...new Set(found)].join(' | ')+' :: '+(sum?sum[1].slice(0,80):'')); await page.keyboard.press('Escape'); await page.waitForTimeout(800); }
  page.off('response', h);
  return res.join('\n');
}
