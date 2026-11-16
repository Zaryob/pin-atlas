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
