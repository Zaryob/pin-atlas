const {test,expect}=require('@playwright/test');
const boards=require('../../public/data/boards.json');

test.beforeEach(async({page,baseURL})=>{
  await page.context().route('**/*',route=>new URL(route.request().url()).origin===new URL(baseURL).origin
    ? route.continue() : route.abort());
});
async function ready(page,hash) {
  await page.goto('./?lang=en'+hash);
  await expect(page.locator('#app-status')).toBeHidden();
}
const phone=page=>page.viewportSize().width<=970;
const row=(page,number)=>page.locator(`#diagram .strip-pin[data-pin="${number}"]`);
const fits=page=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);

test.describe('compact pin strip',()=>{
  test.beforeEach(async({page})=>test.skip(!phone(page),'the strip is the compact pin map'));

  test('Pico lists facing header pins side by side with large rows',async({page})=>{
    await ready(page,'#board=pico-family&profile=pico');
    await expect(page.locator('#diagram .strip-pin')).toHaveCount(40);
    await expect(page.locator('#diagram .pin-strip')).toHaveCount(1);
    const [one,forty]=await Promise.all([row(page,1).boundingBox(),row(page,40).boundingBox()]);
    expect(Math.abs(one.y-forty.y)).toBeLessThan(1);
    expect(forty.x).toBeGreaterThan(one.x+one.width-1);
    expect(one.height).toBeGreaterThanOrEqual(44);
    await expect(row(page,1)).toContainText('GP0');
    await expect(row(page,1).locator('.strip-fns')).not.toBeEmpty();
    expect(await fits(page)).toBe(true);
    // Mirror swaps the columns.
    await page.locator('#view-options > summary').click();await page.locator('#flip-button').click();
    expect((await row(page,1).boundingBox()).x).toBeGreaterThan((await row(page,40).boundingBox()).x);
  });

  test('an LQFP-144 package is listed edge by edge with jump buttons',async({page})=>{
    await ready(page,'#board=lqfp&profile=stm32h743zit6');
    await expect(page.locator('#diagram .strip-pin')).toHaveCount(144);
    await expect(page.locator('.strip-jumps button')).toHaveText(['Left edge · 1–36','Bottom edge · 37–72','Right edge · 73–108','Top edge · 109–144']);
    await page.locator('.strip-jumps button').nth(2).click();
    await expect(page.locator('#strip-section-2')).toBeInViewport();
    expect(await fits(page)).toBe(true);
  });

  test('a Nucleo board is grouped by connector with Morpho pins in facing pairs',async({page})=>{
    const raw=boards.find(board=>board.id==='nucleo-f401re');
    await ready(page,'#board=nucleo-64&profile=nucleo-f401re');
    await expect(page.locator('#diagram .strip-pin')).toHaveCount(raw.pins.length);
    // Sections follow the board left to right, then top to bottom: Morpho CN7, the Arduino headers, Morpho CN10.
    await expect(page.locator('.strip-section')).toHaveText(['ST Morpho · CN7','Arduino · CN6','Arduino · CN8','Arduino · CN5','Arduino · CN9','ST Morpho · CN10']);
    await expect(page.locator('.strip-jumps button')).toHaveText(['ST Morpho · CN7','Arduino · CN6','Arduino · CN8','Arduino · CN5','Arduino · CN9','ST Morpho · CN10']);
    const cn7=raw.pins.filter(pin=>pin.connector==='CN7');
    const [a,b]=await Promise.all([row(page,cn7[0].number).boundingBox(),row(page,cn7[1].number).boundingBox()]);
    expect(Math.abs(a.y-b.y)).toBeLessThan(1);
    expect(b.x).toBeGreaterThan(a.x);
    expect(await fits(page)).toBe(true);
  });

  test('an Arduino board lists its headers as they sit on the board and each header in top-view order',async({page})=>{
    const raw=boards.find(board=>board.id==='arduino-uno-r3');
    await ready(page,'#board=arduino-uno&profile=arduino-uno-r3');
    await expect(page.locator('#diagram .strip-pin')).toHaveCount(raw.pins.length);
    await expect(page.locator('.strip-section')).toHaveText(['PWR','ANALOG','ICSP','DIGITAL']);
    // Within the digital header, rows run from the top of the board to the bottom.
    const digital=raw.pins.filter(pin=>pin.connector==='DIGITAL');
    const shown=await page.locator('#strip-section-3 + .pin-strip .strip-pin').evaluateAll(rows=>rows.map(row=>Number(row.dataset.pin)));
    expect(shown).toEqual([...digital].sort((a,b)=>a.position.y-b.position.y).map(pin=>pin.number));
    // Rotating the view reverses both the section order and the order down each header.
    await page.locator('#view-options > summary').click();await page.locator('#rotate-button').click();
    await expect(page.locator('.strip-section')).toHaveText(['DIGITAL','ICSP','ANALOG','PWR']);
    expect(await page.locator('#strip-section-0 + .pin-strip .strip-pin').evaluateAll(rows=>rows.map(row=>Number(row.dataset.pin))))
      .toEqual([...digital].sort((a,b)=>b.position.y-a.position.y).map(pin=>pin.number));
  });

  test('a tap selects without opening details; Details or a second tap opens them',async({page})=>{
    await ready(page,'#board=pico-family&profile=pico');
    await row(page,27).click();
    await expect(row(page,27)).toHaveAttribute('aria-current','true');
    await expect(page.locator('#details-dialog')).toBeHidden();
    await expect(page.locator('#mobile-mcu-label')).toContainText('27 · GP21');
    await page.locator('#open-pin').click();
    await expect(page.locator('#details-dialog')).toBeVisible();
    await expect(page.locator('#pin-detail h2')).toHaveText('GP21');
    await page.keyboard.press('Escape');
    await expect(page.locator('#open-pin')).toBeFocused();
    await row(page,27).click();
    await expect(page.locator('#details-dialog')).toBeVisible();
  });

  test('the bar steps to neighbouring pins',async({page})=>{
    await ready(page,'#board=pico-family&profile=pico&pin=5');
    await page.locator('#peek-next').click();
    await expect(row(page,6)).toHaveAttribute('aria-current','true');
    await page.locator('#peek-prev').click();await page.locator('#peek-prev').click();
    await expect(row(page,4)).toHaveAttribute('aria-current','true');
    await expect(page.locator('#details-dialog')).toBeHidden();
  });

  test('a pin number or name followed by Enter in the pin search goes to that pin',async({page})=>{
    await ready(page,'#board=lqfp&profile=stm32h743zit6');
    await page.locator('#pin-search').fill('77');await page.locator('#pin-search').press('Enter');
    await expect(row(page,77)).toHaveAttribute('aria-current','true');
    await expect(row(page,77)).toBeInViewport();
    await ready(page,'#board=pico-family&profile=pico');
    await page.locator('#pin-search').fill('GP21');await page.locator('#pin-search').press('Enter');
    await expect(row(page,27)).toHaveAttribute('aria-current','true');
    await expect(page.locator('#details-dialog')).toBeHidden();
  });

  test('arrow keys follow the strip and the overview is one keyboard control',async({page})=>{
    await ready(page,'#board=pico-family&profile=pico&pin=1');
    await row(page,1).focus();
    await page.keyboard.press('ArrowRight');
    await expect(row(page,40)).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(row(page,39)).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(row(page,2)).toBeFocused();
    await page.keyboard.press('End');
    await expect(row(page,40)).toHaveAttribute('aria-current','true');
    await page.keyboard.press('Home');
    await expect(row(page,1)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#details-dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(row(page,1)).toBeFocused();
    const overview=page.locator('#diagram .strip-overview');
    await expect(overview).toHaveAttribute('role','slider');
    await overview.focus();
    await page.keyboard.press('ArrowDown');
    await expect(overview).toBeFocused();
    await expect(overview).toHaveAttribute('aria-valuetext','Pin 02 · GP1');
    await expect(row(page,2)).toHaveAttribute('aria-current','true');
    await page.keyboard.press('Escape');
    await expect(row(page,2)).toBeFocused();
  });

  test('screen readers get one list of pins and the drawing is hidden from them',async({page})=>{
    await ready(page,'#board=pico-family&profile=pico');
    await expect(page.locator('#diagram .strip-overview svg')).toHaveAttribute('aria-hidden','true');
    await expect(page.locator('#diagram .strip-overview [data-pin], #diagram .strip-overview [role="button"]')).toHaveCount(0);
    await expect(page.locator('.board-pin-map [role="button"]')).toHaveCount(40);
    await expect(page.locator('.board-pin-map [tabindex="0"]')).toHaveCount(2);
  });

  test('tapping the overview selects the nearest pin in the strip',async({page})=>{
    await ready(page,'#board=pico-family&profile=pico&pin=1');
    const node=page.locator('#diagram .strip-overview [data-ov-pin="30"] .pin-node');
    const box=await node.boundingBox();
    await page.mouse.click(box.x+box.width/2,box.y+box.height/2);
    await expect(row(page,30)).toHaveAttribute('aria-current','true');
    await expect(row(page,30)).toBeInViewport();
    await expect(page.locator('#details-dialog')).toBeHidden();
  });

  test('MCU pads stay tappable and a tap selects without opening details',async({page})=>{
    await ready(page,'#board=pico-family&profile=pico&pin=1');
    const pad=page.locator('.mcu-package-map [data-mcu-pin]:not([aria-current="true"])').first();
    const number=await pad.getAttribute('data-mcu-pin');
    await pad.click();
    await expect(page.locator(`.mcu-package-map [data-mcu-pin="${number}"]`)).toHaveAttribute('aria-current','true');
    await expect(page.locator('#details-dialog')).toBeHidden();
    await page.locator(`.mcu-package-map [data-mcu-pin="${number}"]`).click();
    await expect(page.locator('#details-dialog')).toBeVisible();
  });
});

test('wide screens keep the drawing, its pin buttons and click-to-open details',async({page})=>{
  test.skip(phone(page),'wide layout only');
  await ready(page,'#board=pico-family&profile=pico');
  await expect(page.locator('#diagram .strip-pin, #diagram .strip-overview')).toHaveCount(0);
  await expect(page.locator('#peek-prev')).toBeHidden();
  await page.locator('#diagram svg [data-pin="27"] .pin-node').click();
  await expect(page.locator('#details-home .details-panel #pin-detail h2')).toHaveText('GP21');
  await expect(page.locator('#diagram-keyboard-help')).toHaveText(/physical pin order/);
});
