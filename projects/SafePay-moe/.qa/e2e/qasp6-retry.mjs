import { newBrowser, ctx, go, txt, shot, sleep } from './qasp6-lib.mjs';
const W='/wallet/shared/3bf0fc53-2b78-46d2-9f53-f824c57ceb39', K='/wallet/kids/2e7de39a-13d7-4d7d-a22d-d982a9b95971';
const b = await newBrowser(); const RUN=process.env.RUN||'r1';
const T=(p)=>txt(p).then(t=>t.replace(/\n/g,' | ').slice(0,250));
for (const [path,dir,name] of [['/wallet/shared','6a86f7b2','shared-list'],['/wallet/kids','6a86f7b2fbf9','kids-list'],[W,'6a86f7c7','wallet-mgr'],[K+'/limits','6a86f7c8','limits']]) {
  const { c, p } = await ctx(b, 'client', 375);
  await go(p, '/profile', 3000);
  const h = r=>r.abort();
  await p.route('**/rest/v1/**', h);
  await go(p, path, 1000);
  await p.getByText('נסו שוב').first().waitFor({timeout:60000}).catch(()=>{});
  const t0=Date.now();
  await p.unrouteAll({behavior:'ignoreErrors'});
  await p.getByText('נסו שוב',{exact:true}).first().click(); 
  let ok=false; for(let i=0;i<30;i++){ await sleep(1000); if(!(await txt(p)).includes('לא הצלחנו')){ok=true;break;} }
  console.log(path, 'recovered:', ok, 'in', Math.round((Date.now()-t0)/1000),'s', await T(p));
  await shot(p, `${dir}/${RUN}-err-${name}-retry`);
  await c.close();
}
await b.close();
