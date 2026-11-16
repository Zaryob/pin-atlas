const {test,expect}=require('@playwright/test');

test.beforeEach(async({page,baseURL})=>{
  await page.context().route('**/*',route=>new URL(route.request().url()).origin===new URL(baseURL).origin
    ? route.continue() : route.abort());
});
const phone=page=>page.viewportSize().width<=970;
const pico='#board=pico-family&profile=pico&pin=20';
async function open(page,{width,height,large=false,lang='en',hash=pico}={}){
  if(width)await page.setViewportSize({width,height});
  if(large)await page.addInitScript(()=>document.addEventListener('DOMContentLoaded',()=>{
    const style=document.createElement('style');style.textContent='html{font-size:200% !important}';document.head.append(style);
  }));
  await page.goto(`./?lang=${lang}${hash}`);
  await expect(page.locator('#app-status')).toBeHidden();
}
const overlap=(a,b)=>a.x<b.x+b.width-0.5&&b.x<a.x+a.width-0.5&&a.y<b.y+b.height-0.5&&b.y<a.y+a.height-0.5;

test.describe('pin search row',()=>{
  for(const [width,height] of [[390,844],[320,568]])for(const lang of ['en','tr']){
    test(`${lang} ${width}×${height} with 200% text: the scope prefix and field never run under Filters`,async({page})=>{
      test.skip(!phone(page),'phone sizes');
      await open(page,{width,height,large:true,lang});
      const [prefix,input,filters,options]=await Promise.all(['.pin-search .scope-prefix','#pin-search','#filter-options > summary','#view-options > summary']
        .map(selector=>page.locator(selector).boundingBox()));
      for(const control of [filters,options]){expect(overlap(prefix,control)).toBe(false);expect(overlap(input,control)).toBe(false);}
      expect(input.width).toBeGreaterThan(80);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    });
  }
});

test.describe('pin table on phones',()=>{
  for(const [width,height,large] of [[390,844,false],[320,568,true]]){
    test(`${width}×${height}${large?' with 200% text':''}: the page scrolls the table and every Details button is in view`,async({page})=>{
      test.skip(!phone(page),'phone sizes');
      await open(page,{width,height,large});
      await page.locator('#table-view').click();
      const box=page.locator('#table-content');
      await expect(box).toBeVisible();
      const geometry=await box.evaluate(el=>({maxHeight:getComputedStyle(el).maxHeight,vertical:el.scrollHeight>el.clientHeight+1,horizontal:el.scrollWidth>el.clientWidth+1}));
      expect(geometry).toEqual({maxHeight:'none',vertical:false,horizontal:false});
      const cut=await box.evaluate(el=>{const edge=el.getBoundingClientRect();return [...el.querySelectorAll('.table-details')]
        .filter(button=>{const r=button.getBoundingClientRect();return r.left<edge.left-0.5||r.right>edge.right+0.5||r.height<44;}).length;});
      expect(cut).toBe(0);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await page.locator('.table-details[data-pin="5"]').click();
      await expect(page.locator('#details-dialog')).toBeVisible();
    });
  }
});

test.describe('diagram options',()=>{
  test('mirror and rotate keep the options open; on touch the buttons are named and at least 44px',async({page})=>{
    await open(page,{});
    await page.locator('#view-options > summary').click();
    const options=page.locator('#view-options');
    await page.locator('#flip-button').click();
    await expect(options).toHaveJSProperty('open',true);
    await expect(page.locator('#flip-button')).toHaveAttribute('aria-pressed','true');
    await page.locator('#rotate-button').click();
    await expect(options).toHaveJSProperty('open',true);
    await expect(page.locator('#rotate-button')).toHaveAttribute('aria-pressed','true');
    if(phone(page)){
      for(const id of ['flip-button','rotate-button','reset-view']){
        const button=page.locator(`#${id}`),box=await button.boundingBox();
        expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
        await expect(button.locator('.tool-label')).toBeVisible();
      }
      await expect(page.locator('#flip-button .tool-label')).toHaveText('Mirror horizontally');
    } else await expect(page.locator('#flip-button .tool-label')).toBeHidden();
    await page.locator('#reset-view').click();
    await expect(options).toHaveJSProperty('open',false);
    await expect(page.locator('#flip-button')).toHaveAttribute('aria-pressed','false');
  });
});
