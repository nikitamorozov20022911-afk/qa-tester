async page => {
  const b = page.getByRole('button',{name:'Enhance accessibility support'});
  await b.focus(); await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelectorAll('[role=treeitem],[role=listitem],li').length>20,{timeout:20000}).catch(()=>{});
  const body = await page.locator('body').innerText();
  return body;
}
