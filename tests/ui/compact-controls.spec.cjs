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
  for(const [width,height] of [[390,844],[320,568]])for(const large of [false,true])for(const lang of ['en','tr']){
    test(`${lang} ${width}×${height}${large?' with 200% text':''}: the scope prefix and field never run under Filters`,async({page})=>{
      test.skip(!phone(page),'phone sizes');
      await open(page,{width,height,large,lang});
      const [prefix,input,filters,options]=await Promise.all(['.pin-search .scope-prefix','#pin-search','#filter-options > summary','#view-options > summary']
        .map(selector=>page.locator(selector).boundingBox()));
      for(const control of [filters,options]){expect(overlap(prefix,control)).toBe(false);expect(overlap(input,control)).toBe(false);}
      expect(input.width).toBeGreaterThan(large||width===320?80:60);
      // Filters and the diagram options wrap together and stay side by side.
      expect(Math.abs(filters.y+filters.height/2-options.y-options.height/2)).toBeLessThan(2);
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
    const panel=await page.locator('.view-options-panel').boundingBox();
    expect(panel.x).toBeGreaterThanOrEqual(0);
    expect(panel.x+panel.width).toBeLessThanOrEqual(page.viewportSize().width);
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
    if(phone(page)){
      // A tap elsewhere, here on the pin strip, closes the panel.
      await page.locator('#diagram .strip-pin').nth(3).click();
      await expect(options).toHaveJSProperty('open',false);
      await page.locator('#view-options > summary').click();
    }
    await page.locator('#reset-view').click();
    await expect(options).toHaveJSProperty('open',false);
    await expect(page.locator('#flip-button')).toHaveAttribute('aria-pressed','false');
  });
});

test('the board library focuses its search only where there is a hover pointer',async({page})=>{
  await open(page,{hash:''});
  await page.locator('#menu-button').click();
  await expect(page.locator('#library-dialog')).toBeVisible();
  const touch=await page.evaluate(()=>matchMedia('(hover: none), (pointer: coarse)').matches);
  if(touch){
    await expect(page.locator('#catalog-search')).not.toBeFocused();
    await expect(page.locator('#library-dialog [data-close]')).toBeFocused();
  } else await expect(page.locator('#catalog-search')).toBeFocused();
});

test('the Turkish entry address opens the atlas in Turkish and keeps a board link',async({page})=>{
  const response=await page.goto('./tr/');
  expect(response.status()).toBe(200);
  await expect(page).toHaveURL(/\/pin-atlas\/\?lang=tr$/);
  await expect(page.locator('html')).toHaveAttribute('lang','tr');
  await expect(page.locator('#app-status')).toBeHidden();
  await page.goto('./tr/#board=pico-family&profile=pico&pin=20');
  await expect(page).toHaveURL(/\/pin-atlas\/\?lang=tr#board=pico-family/);
  await expect(page.locator('#board-title')).toHaveText('Raspberry Pi Pico');
});

test.describe('on-screen keyboard',()=>{
  // Emulates a 300px keyboard by shrinking the visual viewport, or, for the shared theme, by its published variable.
  // The theme re-measures the variable on every visualViewport resize, so the variable case announces the change with
  // focusin (which the page also listens to) instead of a viewport resize that would overwrite it.
  const keyboard=(page,{px,themed=false})=>page.evaluate(({px,themed})=>{
    const viewport=window.visualViewport;
    if(themed){
      document.documentElement.style.setProperty('--console-keyboard-inset',`${px}px`);
      (document.activeElement||document).dispatchEvent(new FocusEvent('focusin',{bubbles:true}));
    }else{
      Object.defineProperty(viewport,'height',{configurable:true,get:()=>innerHeight-px});
      viewport.dispatchEvent(new Event('resize'));
    }
  },{px,themed});
  for(const themed of [false,true]){
    test(`${themed?'the theme variable':'the visualViewport fallback'} keeps the label field and Add above the keyboard and hides the bar`,async({page})=>{
      test.skip(!phone(page),'the sheet and bar are the compact layout');
      await open(page,{width:390,height:844});
      await page.locator('#open-pin').click();
      await expect(page.locator('#details-dialog')).toBeVisible();
      await page.locator('#custom-label').focus();
      await keyboard(page,{px:300,themed});
      const top=844-300;
      await expect.poll(async()=>(await page.locator('#details-dialog').boundingBox()).y+(await page.locator('#details-dialog').boundingBox()).height).toBeLessThanOrEqual(top+1);
      const add=await page.locator('#add-plan').boundingBox(),field=await page.locator('#custom-label').boundingBox();
      expect(add.y+add.height).toBeLessThanOrEqual(top+1);
      expect(field.y).toBeGreaterThanOrEqual(0);expect(field.y+field.height).toBeLessThanOrEqual(add.y+1);
      await expect(page.locator('html')).toHaveClass(/keyboard-open/);
      await expect(page.locator('.mobile-workbar')).toBeHidden();
      await page.keyboard.press('Escape');
      await keyboard(page,{px:0,themed});
      await expect(page.locator('.mobile-workbar')).toBeVisible();
      // A field on the page itself: the bar steps aside while the keyboard is up.
      await page.locator('#pin-search').focus();
      await keyboard(page,{px:300,themed});
      await expect(page.locator('.mobile-workbar')).toBeHidden();
      await page.locator('#pin-search').blur();
      await expect(page.locator('.mobile-workbar')).toBeVisible();
    });
  }
});
