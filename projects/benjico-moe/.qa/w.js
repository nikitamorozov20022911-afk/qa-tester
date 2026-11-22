async page => { await page.getByText(/ממליצ/).filter({visible:true}).first().waitFor({timeout:15000}); return page.url(); }
