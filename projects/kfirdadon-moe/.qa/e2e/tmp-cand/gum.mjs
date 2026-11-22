import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true, args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream'] });
const c = await b.newContext({ permissions:['microphone'] }); const p = await c.newPage();
await p.goto('https://kfir-dadon.vercel.app/c/abc');
console.log(await p.evaluate(async () => { try { const s=await Promise.race([navigator.mediaDevices.getUserMedia({audio:true}), new Promise((_,r)=>setTimeout(()=>r(new Error('timeout')),5000))]); return 'ok '+s.getAudioTracks()[0].label } catch(e){ return 'err '+e.message } }));
await b.close();
