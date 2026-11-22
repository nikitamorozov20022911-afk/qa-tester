// helper: open a context from saved session and always write the rotated session back
const { chromium } = require('/Users/avielshnaider/Techory-moe/.qa/e2e/node_modules/playwright');
const A='/Users/avielshnaider/Techory-moe/.qa/auth/';
module.exports.run=async(fn)=>{const b=await chromium.launch();const ctxs=[];
 const open=async(id,opts={})=>{const c=await b.newContext({storageState:A+id+'.json',viewport:{width:1440,height:900},...opts});await c.addInitScript(()=>{ if(!sessionStorage.getItem('qa-lang-set')){localStorage.setItem('preferred-language','en');sessionStorage.setItem('qa-lang-set','1');} });ctxs.push([id,c]);return c;};
 try{await fn(open);}finally{for(const [id,c] of ctxs){await c.storageState({path:A+id+'.json'}).catch(()=>{});}await b.close();}};
