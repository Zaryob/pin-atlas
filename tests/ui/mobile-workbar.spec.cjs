const {test,expect}=require('@playwright/test');

test.beforeEach(async({page,baseURL})=>{
  await page.context().route('**/*',route=>new URL(route.request().url()).origin===new URL(baseURL).origin
    ? route.continue() : route.abort());
});
const phone=page=>page.viewportSize().width<=970;
const boards={pico:'#board=pico-family&profile=pico&pin=20',h743:'#board=lqfp&profile=stm32h743zit6&pin=20'};

async function open(page,{board,width,height,large,lang='en'}) {
  await page.setViewportSize({width,height});
  if(large)await page.addInitScript(()=>document.addEventListener('DOMContentLoaded',()=>{
    const style=document.createElement('style');style.textContent='html{font-size:200% !important}';document.head.append(style);
  }));
  await page.goto(`./?lang=${lang}${boards[board]}`);
  await expect(page.locator('#app-status')).toBeHidden();
  await expect(page.locator('.mobile-workbar')).toBeVisible();
  await expect(page.locator('#mobile-mcu-label')).not.toBeEmpty();
}
// Geometry of the bar and of one control, with the control's centre hit-tested.
const measure=(page,id)=>page.evaluate(id=>{
  const bar=document.querySelector('.mobile-workbar'),box=bar.getBoundingClientRect();
  const out={height:box.height,top:box.top,right:box.right,width:box.width,innerHeight,innerWidth,
    pageWidth:document.documentElement.scrollWidth,barScrollWidth:bar.scrollWidth,clientWidth:bar.clientWidth,
    variable:parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--workbar-height'))};
  if(id){
    const el=document.getElementById(id),r=el.getBoundingClientRect(),visibleTop=box.top+bar.clientTop,visibleBottom=visibleTop+bar.clientHeight;
    const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
    Object.assign(out,{inside:r.top>=visibleTop-1&&r.bottom<=visibleBottom+1&&r.left>=-1&&r.right<=innerWidth+1,hit:Boolean(hit&&el.contains(hit))});
  }
  return out;
},id);

test.describe('compact bottom bar',()=>{
  test.beforeEach(async({page})=>test.skip(!phone(page),'the bottom bar is the compact layout'));

  for(const board of Object.keys(boards))for(const [width,height] of [[390,844],[320,568]])for(const large of [false,true]){
    test(`${board} ${width}×${height}${large?' with 200% text':''}: the bar stays within 30% of the screen and the viewport width`,async({page})=>{
      await open(page,{board,width,height,large});
      await expect.poll(async()=>{const m=await measure(page);return Math.abs(m.variable-Math.ceil(m.height))<=1;}).toBe(true);
      const m=await measure(page);
      expect(m.height).toBeLessThanOrEqual(m.innerHeight*0.3+1);
      expect(m.right).toBeLessThanOrEqual(m.innerWidth+0.5);
      expect(m.pageWidth).toBeLessThanOrEqual(m.innerWidth);
      expect(m.barScrollWidth).toBeLessThanOrEqual(m.clientWidth);
      // The pin steps, the selected pin and Details show without scrolling inside the bar.
      for(const id of ['peek-prev','mobile-mcu-label','peek-next','open-pin'])expect((await measure(page,id)).inside,id).toBe(true);
    });
  }

  test('with large text on a small phone the rest of the bar scrolls inside it and Tab reaches every control',async({page})=>{
    await open(page,{board:'pico',width:320,height:568,large:true,lang:'tr'});
    const bar=page.locator('.mobile-workbar');
    await expect(bar).toHaveCSS('overflow-y','auto');
    await expect(bar).toHaveCSS('overscroll-behavior-y','contain');
    expect(await bar.evaluate(el=>el.scrollHeight>el.clientHeight)).toBe(true);
    await page.locator('#peek-prev').focus();
    const reached=[];
    for(let step=0;step<8;step++){
      const id=await page.evaluate(()=>document.activeElement.closest('.mobile-workbar')?document.activeElement.id:null);
      if(!id)break;
      const m=await measure(page,id);
      expect(m.inside,`${id} is inside the visible part of the bar`).toBe(true);
      expect(m.hit,`${id} is the element at its centre`).toBe(true);
      reached.push(id);
      await page.keyboard.press('Tab');
    }
    expect(reached.sort()).toEqual(['open-mcu','open-pin','open-plan','peek-next','peek-prev']);
    // A control scrolled into view in the bar still works.
    await page.locator('#open-plan').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#details-dialog')).toBeVisible();
  });

  for(const [width,height,large,lang] of [[390,844,false,'en'],[320,568,true,'tr']]){
    test(`${lang} ${width}×${height}${large?' with 200% text':''}: Tab moves through the bar in the order it is shown`,async({page})=>{
      await open(page,{board:'pico',width,height,large,lang});
      // Reading order: top to bottom by row, then left to right.
      const visual=await page.evaluate(()=>[...document.querySelectorAll('.mobile-workbar button')].filter(el=>el.getClientRects().length)
        .map(el=>({id:el.id,...el.getBoundingClientRect().toJSON()})).sort((a,b)=>Math.abs(a.y-b.y)>4?a.y-b.y:a.x-b.x).map(el=>el.id));
      expect(visual).toEqual(['peek-prev','peek-next','open-pin','open-mcu','open-plan']);
      await page.locator('#peek-prev').focus();
      const reached=[];
      for(const _ of visual){
        reached.push(await page.evaluate(()=>document.activeElement.id));
        await page.keyboard.press('Tab');
      }
      expect(reached).toEqual(visual);
      expect(await page.locator('.mobile-workbar').evaluate(bar=>[...bar.querySelectorAll('*')].some(el=>getComputedStyle(el).order!=='0'))).toBe(false);
    });
  }

  test('the cap leaves the bar unchanged when it already fits',async({page})=>{
    await open(page,{board:'pico',width:390,height:844,large:false});
    const bar=page.locator('.mobile-workbar');
    expect(await bar.evaluate(el=>el.scrollHeight<=el.clientHeight)).toBe(true);
    const [details,mcu,plan]=await Promise.all(['#open-pin','#open-mcu','#open-plan'].map(id=>page.locator(id).boundingBox()));
    expect(Math.abs(details.y-mcu.y)).toBeLessThan(1);
    expect(Math.abs(mcu.y-plan.y)).toBeLessThan(1);
  });
});
