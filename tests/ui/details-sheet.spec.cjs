const {test,expect}=require('@playwright/test');

test.beforeEach(async({page,baseURL})=>{
  await page.context().route('**/*',route=>new URL(route.request().url()).origin===new URL(baseURL).origin
    ? route.continue() : route.abort());
});
const phone=page=>page.viewportSize().width<=970;
const gnd='#board=pico-family&profile=pico2w&pin=3';
async function open(page,{width,height,scale=100,lang='en',hash=gnd}={}){
  if(width)await page.setViewportSize({width,height});
  if(scale!==100)await page.addInitScript(scale=>document.addEventListener('DOMContentLoaded',()=>{
    const style=document.createElement('style');style.textContent=`html{font-size:${scale}% !important}`;document.head.append(style);
  }),scale);
  await page.goto(`./?lang=${lang}${hash}`);
  await expect(page.locator('#app-status')).toBeHidden();
}
// The focused element's outline box, and whether any clipping ancestor or the next sibling cuts it.
const ring=page=>page.evaluate(()=>{
  const el=document.activeElement,cs=getComputedStyle(el),r=el.getBoundingClientRect();
  const width=parseFloat(cs.outlineWidth)||0,ext=(parseFloat(cs.outlineOffset)||0)+width;
  const box={left:r.left-ext,top:r.top-ext,right:r.right+ext,bottom:r.bottom+ext};
  let clipped=false;
  for(let a=el.parentElement;a;a=a.parentElement){
    const s=getComputedStyle(a);if(s.overflowX==='visible'&&s.overflowY==='visible')continue;
    const b=a.getBoundingClientRect(),left=b.left+a.clientLeft,top=b.top+a.clientTop;
    if(box.left<left-0.5||box.top<top-0.5||box.right>left+a.clientWidth+0.5||box.bottom>top+a.clientHeight+0.5)clipped=true;
  }
  const next=el.nextElementSibling?.getBoundingClientRect();
  if(next&&box.right>next.left+0.5&&box.top<next.bottom&&box.bottom>next.top)clipped=true;
  return {id:el.id,focusVisible:el.matches(':focus-visible'),style:cs.outlineStyle,width,clipped};
});

test.describe('details sheet focus',()=>{
  test.beforeEach(async({page})=>test.skip(!phone(page),'the sheet is the compact layout'));

  for(const how of ['tap','tap without focusing the button']){
    test(`opening the sheet by ${how} shows no focus ring on a tab`,async({page})=>{
      await open(page);
      // Safari never focuses a tapped button, so script focus has no earlier focus to follow.
      if(how==='tap')await page.locator('#open-pin').tap();
      else await page.evaluate(()=>{document.activeElement?.blur?.();document.getElementById('open-pin').click();});
      await expect(page.locator('#details-dialog')).toBeVisible();
      await expect(page.locator('#details-dialog')).toBeFocused();
      expect(await page.evaluate(()=>[...document.querySelectorAll('#details-dialog :focus-visible')].length)).toBe(0);
      await expect(page.locator('#details-dialog')).toHaveCSS('outline-style','none');
      // Tab still reaches the tabs, then the close button, each with a ring inside the sheet.
      await page.keyboard.press('Tab');
      await expect(page.locator('#detail-tab')).toBeFocused();
      const tab=await ring(page);
      expect(tab).toMatchObject({focusVisible:true,style:'solid',clipped:false});
      await page.keyboard.press('Tab');
      await expect(page.locator('#close-details')).toBeFocused();
      expect(await ring(page)).toMatchObject({focusVisible:true,style:'solid',clipped:false});
    });
  }

  for(const [width,height,scale] of [[390,844,100],[320,568,200]]){
    test(`${width}×${height} at ${scale}% text: opening by keyboard focuses the tab with an unclipped ring`,async({page})=>{
      await open(page,{width,height,scale});
      await page.locator('#open-pin').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#detail-tab')).toBeFocused();
      const tab=await ring(page);
      expect(tab).toMatchObject({focusVisible:true,style:'solid',clipped:false});
      expect(tab.width).toBeGreaterThanOrEqual(2);
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('#plan-tab')).toBeFocused();
      expect(await ring(page)).toMatchObject({focusVisible:true,style:'solid',clipped:false});
    });
  }

  for(const [width,height,scale] of [[390,844,100],[390,844,200],[320,568,200]])for(const lang of ['en','tr']){
    test(`${lang} ${width}×${height} at ${scale}% text: the plan tab keeps its count whole and beside or centred under the label`,async({page})=>{
      await open(page,{width,height,scale,lang});
      await page.locator('#open-pin').tap();
      await page.locator('#plan-tab-count').evaluate(el=>{el.textContent='7';});
      const g=await page.evaluate(()=>{
        const tab=document.getElementById('plan-tab').getBoundingClientRect(),label=document.querySelector('#plan-tab > span').getBoundingClientRect(),count=document.getElementById('plan-tab-count');
        const c=count.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(count);
        return {beside:c.top<label.bottom&&c.bottom>label.top,under:c.top>=label.bottom-1,offCentre:Math.abs((c.left+c.right)/2-(tab.left+tab.right)/2),
          countLines:new Set([...range.getClientRects()].map(r=>Math.round(r.top))).size,within:c.right<=tab.right+0.5&&c.left>=tab.left-0.5};
      });
      expect(g.countLines).toBe(1);
      expect(g.within).toBe(true);
      expect(g.beside||g.under).toBe(true);
      if(g.under)expect(g.offCentre).toBeLessThan(2);
      if(width===390&&scale===100)expect(g.beside).toBe(true);
    });
  }
});

test('desktop: Tab onto the details tabs draws the ring inside the tab',async({page})=>{
  test.skip(phone(page),'desktop panel');
  await open(page);
  await page.locator('#detail-tab').evaluate(tab=>{const b=document.createElement('button');b.id='probe';b.textContent='probe';tab.parentElement.before(b);b.focus();});
  await page.keyboard.press('Tab');
  await expect(page.locator('#detail-tab')).toBeFocused();
  expect(await ring(page)).toMatchObject({focusVisible:true,style:'solid',clipped:false});
});

// A separator only stands between two non-empty parts.
const badJoin=text=>{const s=text.replace(/\s+/g,' ').trim();return /^·|·$|· ·/.test(s);};
for(const lang of ['en','tr'])test(`${lang}: pin type, bar and plan lines have no dangling separators`,async({page})=>{
  for(const pin of [3,36,40,1,31]){
    await open(page,{lang,hash:`#board=pico-family&profile=pico2w&pin=${pin}`});
    const type=await page.locator('#pin-detail .pin-type').textContent();
    expect(type.trim().length,`pin ${pin}`).toBeGreaterThan(0);
    expect(badJoin(type),`pin ${pin}: "${type}"`).toBe(false);
    for(const selector of ['#pin-detail .physical-pin','#mobile-mcu-label']){
      const text=await page.locator(selector).textContent();
      expect(badJoin(text),`${selector} pin ${pin}: "${text}"`).toBe(false);
    }
  }
  const gnd=page.locator('#pin-detail .pin-type');
  await open(page,{lang,hash:'#board=pico-family&profile=pico2w&pin=3'});
  await expect(gnd).toHaveText(lang==='tr'?'Toprak':'Ground');
});

// The references disclosure keeps a visible marker like the guidance one beside it, and a full-size summary target.
for(const [width,height,scale] of [[390,844,100],[320,568,200]])for(const lang of ['en','tr'])test(`${lang} ${width}×${height} at ${scale}% text: pin references open from a marked summary and list their links`,async({page})=>{
  test.skip(!phone(page),'the sheet is the compact layout');
  await open(page,{width,height,scale,lang,hash:'#board=pico-family&profile=pico2w&pin=4'});
  await page.locator('#open-pin').tap();
  await expect(page.locator('#details-dialog')).toBeVisible();
  const evidence=page.locator('#pin-detail details.pin-evidence'),summary=evidence.locator('> summary');
  await expect(summary).toHaveText(lang==='tr'?'Bu pinin kaynakları':'References for this pin');
  const look=()=>summary.evaluate(s=>{const guide=document.querySelector('#pin-detail .pin-guidance > summary');
    return {display:getComputedStyle(s).display,guide:getComputedStyle(guide).display,list:getComputedStyle(s).listStyleType,height:s.getBoundingClientRect().height};});
  const closed=await look();
  expect(closed.display).toBe('list-item');
  expect(closed.display).toBe(closed.guide);
  expect(closed.list).toBe('disclosure-closed');
  expect(closed.height).toBeGreaterThanOrEqual(44);
  await summary.scrollIntoViewIfNeeded();
  await summary.tap();
  await expect(evidence).toHaveJSProperty('open',true);
  expect((await look()).list).toBe('disclosure-open');
  const links=evidence.locator('ul li a');
  expect(await links.count()).toBeGreaterThan(0);
  await expect(links.first()).toBeVisible();
  await expect(links.first()).toHaveAttribute('href',/^https:\/\//);
});
