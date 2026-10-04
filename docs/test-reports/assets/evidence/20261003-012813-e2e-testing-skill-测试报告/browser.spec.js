const { test, expect } = require('@playwright/test');
test('saved note remains visible after reload',async({page})=>{
 await page.goto(process.env.BASE_URL);
 await page.getByLabel('Title').fill('Acceptance note');
 const saved=page.waitForResponse(r=>r.url().endsWith('/notes')&&r.request().method()==='POST');
 await page.getByRole('button',{name:'Save',exact:true}).click();
 expect((await saved).status()).toBe(201);
 await page.reload();
 try {await expect(page.getByRole('listitem')).toHaveText('Acceptance note',{timeout:2000});}
 finally {await page.screenshot({path:process.env.CAPTURE_PATH});}
});
