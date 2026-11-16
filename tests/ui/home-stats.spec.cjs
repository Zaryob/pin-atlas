const {test,expect}=require('@playwright/test');

test.beforeEach(async({page,baseURL})=>{
  await page.context().route('**/*',route=>new URL(route.request().url()).origin===new URL(baseURL).origin
    ? route.continue() : route.abort());
});
const phone=page=>page.viewportSize().width<=970;
async function open(page,{width,height,scale=100,lang='en'}={}){
  if(width)await page.setViewportSize({width,height});
  if(scale!==100)await page.addInitScript(scale=>document.addEventListener('DOMContentLoaded',()=>{
    const style=document.createElement('style');style.textContent=`html{font-size:${scale}% !important}`;document.head.append(style);
  }),scale);
  await page.goto(`./?lang=${lang}`);
  await expect(page.locator('.home-stats .stat-number').first()).toBeVisible();
}
// Per statistic: line boxes of the number, and where its label sits.
const layout=page=>page.locator('.home-stats').evaluate(box=>{
  const lines=el=>{const range=document.createRange();range.selectNodeContents(el);return new Set([...range.getClientRects()].filter(r=>r.width>0).map(r=>Math.round(r.top))).size;};
  const b=box.getBoundingClientRect();
  return {overflow:box.scrollWidth>box.clientWidth||document.documentElement.scrollWidth>innerWidth,
    items:[...box.querySelectorAll('.home-stat-item')].map(item=>{
      const n=item.querySelector('.stat-number'),l=item.querySelector('.stat-label'),nr=n.getBoundingClientRect(),lr=l.getBoundingClientRect();
      return {text:n.textContent,numberLines:lines(n),beside:lr.left>=nr.right-0.5&&lr.top<nr.bottom,under:lr.top>=nr.bottom-1,
        inside:nr.left>=b.left&&nr.right<=b.right&&lr.left>=b.left&&lr.right<=b.right+0.5};
    })};
});

test.describe('home statistics on phones',()=>{
  test.beforeEach(async({page})=>test.skip(!phone(page),'phone sizes'));
  for(const [width,height] of [[390,844],[320,568]])for(const scale of [100,150,200])for(const lang of ['en','tr']){
    test(`${lang} ${width}×${height} at ${scale}% text: numbers stay on one line with the label beside or under them`,async({page})=>{
      await open(page,{width,height,scale,lang});
      const m=await layout(page);
      expect(m.overflow).toBe(false);
      for(const item of m.items){
        expect(item.numberLines,item.text).toBe(1);
        expect(item.inside,item.text).toBe(true);
        expect(item.beside||item.under,item.text).toBe(true);
      }
      // One arrangement for the whole block.
      expect(new Set(m.items.map(item=>item.beside)).size).toBe(1);
      if(scale===100)expect(m.items.every(item=>item.beside)).toBe(true);
    });
  }
});

test('desktop statistics keep one row of centred columns',async({page})=>{
  test.skip(phone(page),'desktop');
  await open(page);
  const m=await layout(page);
  expect(m.overflow).toBe(false);
  for(const item of m.items){expect(item.numberLines).toBe(1);expect(item.under).toBe(true);}
  const tops=await page.locator('.home-stats .stat-number').evaluateAll(els=>new Set(els.map(el=>Math.round(el.getBoundingClientRect().top))).size);
  expect(tops).toBe(1);
});
