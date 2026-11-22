async page => {
  await page.goto('https://hunters-sooty.vercel.app/tenders/37fb9213-5e5e-4b84-9c84-a7330da7b302?from=mine'); await page.waitForLoadState('networkidle');
  const h = (await page.content()).replace(/\\"/g,'"');
  const i=h.indexOf("\"received\":{"); return h.slice(i,i+1500);
  return out.join('\n----\n');
}
