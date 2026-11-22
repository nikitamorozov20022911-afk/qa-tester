async page => {
  const B='https://hunters-sooty.vercel.app';
  const out=[];
  const M=['E1 Alpha','E1 Bravo','E1 Charlie','1020-e1','102-0001','102-0002','102-0003','1020001','1020002','1020003','linkedin.com/in/qa-auto','Workplace','תשובה','הערת בדיקה','שאלה נוספת','8d25a157','29bd04ad','95e1d65a','51b1cf64','060763f9','caa83508'];
  for (const u of ['/admin/applications?q=QA-AUTO%201020%20E1','/admin/log','/admin/jobs/d7220429-9b52-4224-92a7-59df07b34af1']) {
    const r = await page.request.get(B+u); const h = await r.text();
    out.push(`## ${u} [${r.status()}] ${h.length}b: ` + M.map(m=>`${m}=${h.split(m).length-1}`).join(' '));
    const areas=[...new Set([...h.matchAll(/area[\\"=:]+([a-z_]+)/g)].map(x=>x[1]))]; out.push('area-ish: '+areas.join(','));
    // context for phone/email/answer
    for (const m of ['102-0001','1020-e1','תשובה','8d25a157']) { const i=h.indexOf(m); if(i>=0) out.push(`ctx ${m}: `+h.slice(Math.max(0,i-300),i+200).replace(/\s+/g,' ')); }
  }
  return out.join('\n');
}
