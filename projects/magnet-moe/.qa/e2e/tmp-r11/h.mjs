import { chromium, devices } from 'playwright';
export const Q='/Users/avielshnaider/magnet-moe/.qa';
export const SS=Q+'/e2e/tmp-r11/';
export async function admin(){
  const b=await chromium.launch({headless:true});
  const ctx=await b.newContext({storageState:Q+'/auth/admin-r11.json',viewport:{width:1440,height:900},locale:'he-IL'});
  const p=await ctx.newPage();
  return {b,ctx,p,async close(){await ctx.storageState({path:Q+'/auth/admin-r11.json'}); await b.close();}};
}
