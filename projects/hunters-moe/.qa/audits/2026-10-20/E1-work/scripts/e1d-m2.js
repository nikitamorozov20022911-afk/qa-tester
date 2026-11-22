async page => {
  const b = page.getByRole('button',{name:'Enhance accessibility support'});
  await b.click({force:true}).catch(e=>'x');
  await page.waitForFunction(()=>document.body.innerText.length>3000,{timeout:15000}).catch(()=>{});
  const txt = await page.evaluate(()=>{
    // collect aria-labels and text of all elements in order
    const out=[]; const w=document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT); let n;
    while(n=w.nextNode()){ const a=n.getAttribute('aria-label'); const r=n.getAttribute('role');
      if(a && a.length>1) out.push((r?'['+r+'] ':'')+a.replace(/\s+/g,' ')); }
    return out.join('\n');
  });
  const body = await page.locator('body').innerText();
  return '<<ARIA>>\n'+txt+'\n<<BODY>>\n'+body;
}
