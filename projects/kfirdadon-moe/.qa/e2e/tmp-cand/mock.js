async page => {
  const welcome = {"stage":"welcome","business_name":"testim","contact":{"name":"test","email":"pajemem729@aminavin.com","phone":"0531231234"},
    "welcome":{"role_title":"QA-C נציג מכירות","duration_minutes":7,"customer_info":[{"text":"QA-DS-A גלוי: ללקוח שני רכבים"}],"product_or_service":"פוליסת ביטוח מקיף","call_goal":"לקבוע פגישת ייעוץ עם הלקוח (r2 V2)","desired_next_step":{"label":"פגישת ייעוץ"}},"legal":null};
  globalThis.__qaStage = 'welcome'; globalThis.__qaCalls = [];
  await page.route('**/rest/v1/rpc/candidate_*', async route => {
    const url = route.request().url(); const body = route.request().postData();
    globalThis.__qaCalls.push(url.split('/rpc/')[1] + ' ' + body);
    if (url.includes('candidate_open_link')) {
      const p = JSON.parse(JSON.stringify(welcome)); p.stage = globalThis.__qaStage;
      return route.fulfill({status:200, contentType:'application/json', body: JSON.stringify(p)});
    }
    if (url.includes('candidate_give_consent')) { globalThis.__qaStage='tech_check'; return route.fulfill({status:200, contentType:'application/json', body: JSON.stringify({consented_at:new Date().toISOString(), legal_version:'none'})}); }
    if (url.includes('candidate_tech_check')) { return route.fulfill({status:200, contentType:'application/json', body: '{}'}); }
    return route.continue();
  });
  return 'mock installed';
}
