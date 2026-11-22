async page => {
  const html = await page.content();
  const out=[];
  for (const k of ['nda_requested','nda_signed','nda_declined','ndaBadge','ndaDeclinedBadge','ndaSignature','nda_required']) {
    const re = new RegExp('.{0,80}'+k+'.{0,120}','g'); const m = html.match(re)||[]; out.push(k+' x'+m.length+': '+m.slice(0,2).join(' ### '));
  }
  return out.join('\n');
}
