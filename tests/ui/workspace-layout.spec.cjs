const {test,expect}=require('@playwright/test');
for(const width of [320,390]) {
  test(`the first pin is above the bottom controls at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:800});
    await page.goto('./?lang=tr#board=pico-family&profile=pico2&pin=1');
    await expect(page.locator('#board-title')).toHaveText('Raspberry Pi Pico 2');
    const pin=page.locator('#diagram [data-pin="1"]');
    await expect(pin).toBeAttached();
    expect(await page.locator('#board-documents').getAttribute('open')).toBeNull();
    expect((await pin.boundingBox()).y).toBeLessThan(650);
    await page.locator('#board-documents > summary').click();
    await expect(page.locator('#datasheet')).toBeVisible();
    await expect(page.locator('#static-page')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  });
}
