  const bell = async (shot) => {
    const b = page.locator('button[aria-label*="התראות"]').first();
    const label = await b.getAttribute('aria-label');
    await b.click();
    const panel = page.locator('[role=dialog],[role=menu],[data-radix-popper-content-wrapper]').last();
    await panel.waitFor({timeout:8000}).catch(()=>{});
    await panel.getByText('טוען…').waitFor({state:'detached',timeout:10000}).catch(()=>{});
    if (shot) await page.screenshot({path:'screenshots/run-1020/E1/'+shot});
    const t = await panel.innerText().catch(e=>'ERR '+e.message);
    return {label, t, panel}; };
