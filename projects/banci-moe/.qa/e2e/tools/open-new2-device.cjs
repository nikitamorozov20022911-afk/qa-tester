// Открыть «устройство» new2 в видимом браузере (постоянный профиль) для ручных шагов с паролем.
// usage (из .qa/e2e, Node 22): node tools/open-new2-device.cjs B   |  node tools/open-new2-device.cjs C
// A = Macintosh (главное, installation 64bbf03b), B = iPhone (d96e0bf0, installation 5ec62a6f), C = Android (не подключён, installation 83bf1203)
const {chromium}=require('playwright');const fs=require('fs');
const ROOT='/Users/avielshnaider/banci-moe/.qa', AUTH=ROOT+'/auth/new2.json', KEY='sb-jxkxjddzcjjddlafzijn-auth-token';
const P={A:['new2-A','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',1440,900],
B:['new2-B','Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',390,844],
C:['new2-C','Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',390,844]};
(async()=>{const [dir,ua,w,h]=P[process.argv[2]||'B'];
 const ctx=await chromium.launchPersistentContext(ROOT+'/auth/profiles/'+dir,{headless:false,viewport:{width:w,height:h},userAgent:ua,locale:'he-IL'});
 const page=ctx.pages()[0]||await ctx.newPage();
 const saved=Object.fromEntries(JSON.parse(fs.readFileSync(AUTH)).origins[0].localStorage.map(x=>[x.name,x.value]));
 await page.route('https://banci.expo.app/__qa_blank',r=>r.fulfill({status:200,contentType:'text/html',body:'<html></html>'}));
 await page.goto('https://banci.expo.app/__qa_blank');
 const exp=v=>{try{return JSON.parse(v).expires_at||0}catch(e){return 0}};
 const cur=await page.evaluate(k=>localStorage.getItem(k),KEY);
 if(!cur||exp(saved[KEY])>exp(cur)) await page.evaluate(([k,v])=>localStorage.setItem(k,v),[KEY,saved[KEY]]);
 await page.goto('https://banci.expo.app/account/devices');
 console.log('Окно открыто. Закройте окно браузера, когда закончите.');
 const iv=setInterval(async()=>{try{const t=await page.evaluate(k=>localStorage.getItem(k),KEY); const a=JSON.parse(fs.readFileSync(AUTH)); const it=a.origins[0].localStorage.find(x=>x.name===KEY); if(t&&exp(t)>exp(it.value)){it.value=t; fs.writeFileSync(AUTH,JSON.stringify(a,null,2)); console.log('токен обновлён в new2.json');}}catch(e){}},10000);
 await new Promise(r=>ctx.on('close',r)); clearInterval(iv);
})();
