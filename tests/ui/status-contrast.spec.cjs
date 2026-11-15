const {test,expect}=require('@playwright/test');

test('conditional input and analog warnings keep readable text in either theme',async({page})=>{
  for(const pin of [1,31]) {
    await page.goto(`./?lang=en#board=pico-family&profile=pico2&pin=${pin}`);
    const badge=page.locator('#pin-detail .pin-badge');
    await expect(badge).toBeAttached();
    if(page.viewportSize().width<=970) await page.locator('#open-pin').click();
    await expect(badge).toBeVisible();
    const ratio=await badge.evaluate(element=>{
      const style=getComputedStyle(element),ctx=document.createElement('canvas').getContext('2d');
      const luminance=color=>{ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);};
      const a=luminance(style.color),b=luminance(style.backgroundColor);
      return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    });
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    if(await page.locator('#details-dialog').isVisible()) await page.locator('#close-details').click();
  }
});
