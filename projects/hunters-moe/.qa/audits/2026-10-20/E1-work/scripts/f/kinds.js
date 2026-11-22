async page => {
  const html = await page.content(); const i=html.indexOf('\\"kinds\\"'); 
  const j=html.indexOf('offer_accepted'); const k=html.indexOf('tender_');
  return html.slice(i,i+3500).replace(/\\\\u003c\/?b\\\\u003e/g,'');
}
