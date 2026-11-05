const {test,expect}=require('@playwright/test');
const {readFileSync}=require('node:fs');
const boards=require('../../public/data/boards.json');
const errors=new WeakMap();
const storageKey='pin-atlas:plans:v1';

test.beforeEach(async({page,baseURL})=>{
  const collected=[];errors.set(page,collected);
  page.on('pageerror',error=>collected.push(error.message));
  page.context().on('page',tab=>tab.on('pageerror',error=>collected.push(error.message)));
  // Exercise the app without depending on third-party analytics or suite services.
  await page.context().route('**/*',route=>new URL(route.request().url()).origin===new URL(baseURL).origin
    ? route.continue() : route.abort());
});
test.afterEach(async({page})=>expect(errors.get(page)).toEqual([]));

async function ready(page,hash='') {
  await page.goto('./?lang=en'+hash);
  await expect(page.locator('#app-status')).toBeHidden();
}
async function openPlan(page) {
  if (await page.locator('#open-plan').isVisible()) await page.locator('#open-plan').click();
  else await page.locator('#plan-tab').click();
}

for(const board of boards.filter(b=>['nucleo32Scope','nucleo144SourceScope','blackPillScope'].includes(b.scopeKey))) {
 test(`${board.id} opens its exact reference and verified package`,async({page})=>{
  await ready(page);await page.locator('#home-search').fill(board.name);
  await page.locator(`#home-catalog-container [data-profile="${board.id}"]`).first().click();
  await expect(page.locator('#function-reference')).toHaveValue(board.id);
  const pin=board.pins.find(p=>p.type==='GPIO' && p.mcuPin);
  await page.locator(`#diagram [data-pin="${pin.number}"]`).click();
  await expect(page.locator(`#diagram [data-mcu-pin="${pin.mcuPin}"]`)).toHaveAttribute('aria-current','true');
  await ready(page,'#board='+board.mcuProfile);
  const chip=boards.find(b=>b.id===board.mcuProfile);
  await expect(page.locator('#diagram [data-pin]')).toHaveCount(chip.packagePins);
  if(chip.exposedPad===false)await expect(page.locator('#diagram')).not.toContainText('EP · GND');
  await page.locator(`#package-boards [data-package-board="${board.id}"]`).click();
  await expect(page.locator('#function-reference')).toHaveValue(board.id);
 });
}

test('home loads only the small catalog and a model loads its own pins and MCU',async({page})=>{
 const requested=[];page.on('request',request=>{if(request.url().includes('/data/'))requested.push(new URL(request.url()).pathname);});
 await ready(page);
 expect(requested.map(path=>path.split('/').pop())).toEqual(['catalog.json']);
 await page.locator('#home-search').fill('Pico W');
 await page.locator('#home-catalog-container [data-profile="picow"]').first().click();
 await expect(page.locator('#app-status')).toBeHidden();
 expect(requested.filter(path=>path.includes('/profiles/')).length).toBe(2);
 expect(requested.every(path=>!path.endsWith('/boards.json') && !path.endsWith('/evidence.json'))).toBe(true);
});

test('a failed lazy profile retries the selected model and retains browser plans',async({page})=>{
 const saved={picow:{1:{function:'GPIO',label:'kept'}}};
 await page.addInitScript(({key,saved})=>localStorage.setItem(key,JSON.stringify(saved)),{key:storageKey,saved});
 let attempts=0;
 await page.route('**/data/profiles/picow.*.json',route=>++attempts===1?route.fulfill({status:503,body:'unavailable'}):route.continue());
 await ready(page);await page.locator('#home-search').fill('Pico W');
 await page.locator('#home-catalog-container [data-profile="picow"]').first().click();
 await expect(page.locator('#app-status[role="alert"]')).toBeVisible();
 await page.locator('#retry-data').click();await expect(page.locator('#app-status')).toBeHidden();
 await expect(page.locator('#function-reference')).toHaveValue('picow');
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey)).toEqual(saved);
});

test('returning home during a pin download prevents a late navigation',async({page})=>{
 let release;
 const waiting=new Promise(resolve=>release=resolve);
 await page.route('**/data/profiles/picow.*.json',async route=>{await waiting;await route.continue();});
 await ready(page);await page.locator('#home-search').fill('Pico W');
 await page.locator('#home-catalog-container [data-profile="picow"]').first().click();
 await expect(page.locator('#app-status')).toBeVisible();
 await page.evaluate(()=>location.hash='#home');
 await expect(page.locator('#home-view')).toBeVisible();
 const loaded=page.waitForResponse(response=>response.url().includes('/profiles/picow.'));
 release();await loaded;
 await expect(page.locator('#home-view')).toBeVisible();
 await expect(page).toHaveURL(/#home$/);
});

test('guided peripheral connections save exact bus signals and survive refresh',async({page})=>{
 await ready(page,'#board=pico-family&profile=picow');await openPlan(page);
 await page.locator('#peripheral-builder summary').click();
 await page.locator('#peripheral-bus').selectOption('I2C0');
 await page.locator('[data-peripheral-role="SDA"]').selectOption(JSON.stringify([1,'I2C0 SDA']));
 await page.locator('[data-peripheral-role="SCL"]').selectOption(JSON.stringify([2,'I2C0 SCL']));
 await expect(page.locator('#peripheral-notes a')).toHaveCount(2);
 await page.locator('#peripheral-form button[type="submit"]').click();
 await expect(page.locator('#plan-feedback')).toContainText('Peripheral connection added');
 const saved={1:{function:'I2C0 SDA',label:''},2:{function:'I2C0 SCL',label:''}};
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).picow,storageKey)).toEqual(saved);
 await page.reload();await expect(page.locator('#app-status')).toBeHidden();await openPlan(page);
 await expect(page.locator('#plan-list')).toContainText('I2C0 SDA');
 await expect(page.locator('#plan-list')).toContainText('I2C0 SCL');
});

test('Feather analog header highlights the verified RP2040 package pad',async({page})=>{
 await ready(page,'#board=adafruit-feather-rp2040');
 await page.locator('#diagram [data-pin="5"]').click();
 await expect(page.locator('#diagram [data-mcu-pin="38"]')).toHaveAttribute('aria-current','true');
});

test('imports reject duplicate USART routes and incompatible remaps without changing saved plans',async({page})=>{
 const saved={stm32f405rgt6:{42:{function:'USART1_TX',label:'console'}}};
 await page.addInitScript(({key,saved})=>localStorage.setItem(key,JSON.stringify(saved)),{key:storageKey,saved});
 await ready(page,'#board=stm32f405rgt6');await openPlan(page);
 const invalid=[
  {version:1,board:'stm32f405rgt6',pins:{42:{function:'USART1_TX',label:''},58:{function:'USART1_TX',label:''}}},
  {version:1,board:'stm32f103c8t6',pins:{30:{function:'USART1_TX',label:''},43:{function:'USART1_RX',label:''}}}
 ];
 for(const payload of invalid){
  await page.locator('#import-file').setInputFiles({name:'plan.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(payload))});
  await expect(page.locator('#plan-feedback')).not.toBeEmpty();
  await expect(page.locator('#incoming-plan-dialog')).toBeHidden();
  expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey)).toEqual(saved);
 }
});

test('legacy remap conflicts stay visible and retain all stored assignments',async({page})=>{
 const saved={stm32f103c8t6:{30:{function:'USART1_TX',label:'old TX'},43:{function:'USART1_RX',label:'old RX'}}};
 await page.addInitScript(({key,saved})=>localStorage.setItem(key,JSON.stringify(saved)),{key:storageKey,saved});
 await ready(page,'#board=stm32f103c8t6');await openPlan(page);
 await expect(page.locator('#plan-validation')).toContainText('Your saved plan is preserved');
 await expect(page.locator('#plan-list')).toContainText('old TX');
 await expect(page.locator('#plan-list')).toContainText('old RX');
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey)).toEqual(saved);
});

test('SVG and printable PDF retain model, labels, full board geometry and source provenance',async({page})=>{
 const board=boards.find(b=>b.id==='nucleo-f446re'),pin=board.pins.find(p=>p.physicalLabel==='CN8.1');
 const saved={[board.id]:{[pin.number]:{function:'ADC1_IN0',label:'sensor <&> Türkçe'}}};
 await page.addInitScript(({key,saved})=>localStorage.setItem(key,JSON.stringify(saved)),{key:storageKey,saved});
 await ready(page,'#board='+board.id);await page.locator('#connector-zoom').selectOption('CN7');
 await openPlan(page);
 const event=page.waitForEvent('download');await page.locator('#export-svg').click();
 const svg=readFileSync(await(await event).path(),'utf8');
 expect(svg).toContain('NUCLEO-F446RE');expect(svg).toContain('sensor &lt;&amp;&gt; Türkçe');
 expect(svg).not.toContain('var(--');
 const parsed=await page.evaluate(svg=>{
  const xml=new DOMParser().parseFromString(svg,'image/svg+xml');
  return {errors:xml.querySelectorAll('parsererror').length,pins:xml.querySelectorAll('[data-pin]').length,
   images:[...xml.querySelectorAll('image')].map(img=>img.getAttribute('href'))};
 },svg);
 expect(parsed.errors).toBe(0);expect(parsed.pins).toBe(108);
 expect(parsed.images.length).toBeGreaterThan(0);expect(parsed.images.every(href=>href.startsWith('data:'))).toBe(true);
 await expect(page.locator('#connector-zoom')).toHaveValue('CN7');
 await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
 await expect(page.locator('#print-plan')).toContainText('sensor <&> Türkçe');
 await expect(page.locator('#print-plan')).toContainText('NUCLEO-F446RE');
 const pdf=await page.pdf({format:'A4'});expect(pdf.subarray(0,4).toString()).toBe('%PDF');
});

test('exact model search shares results with the library and opens the right reference',async({page})=>{
  for (const [query,profile,mcu] of [
    ['Pico W','picow','RP2040'],['Pico 2 W','pico2w','RP2350A'],
    ['Nano Every','arduino-nano-every','ATmega4809'],
    ['N8R8','esp32-s3-devkitc-1-octal','ESP32-S3'],
    ['Raspberry Pi 5','raspberry-pi-5','RP1']
  ]) {
    await ready(page);
    await page.locator('#home-search').fill(query);
    await expect(page.locator('#featured-section')).toBeHidden();
    const card=page.locator(`#home-catalog-container .catalog-card[data-profile="${profile}"]`);
    await expect(card).toHaveCount(1);
    const names=await page.locator('#home-catalog-container .catalog-card-title').allTextContents();
    const y=await page.locator('#home-catalog-container').evaluate(el=>el.getBoundingClientRect().top);
    expect(y).toBeLessThan(page.viewportSize().height);
    await page.locator('#menu-button').click();
    await page.locator('#catalog-search').fill(query);
    expect(await page.locator('#catalog-grid .catalog-card-title').allTextContents()).toEqual(names);
    await page.locator('#library-dialog [data-close]').click();
    await card.click();
    expect(new URLSearchParams(new URL(page.url()).hash.slice(1)).get('profile')).toBe(profile);
    await expect(page.locator('#board-reference')).toContainText(mcu);
    await expect(page.locator('#board-title')).toBeFocused();
    expect(await page.locator('#compatible-boards').evaluate(el=>el.getBoundingClientRect().top))
      .toBeLessThan(await page.locator('.workspace').evaluate(el=>el.getBoundingClientRect().top));
  }
});

test('empty searches recover and every featured card uses its verified profile',async({page})=>{
  await ready(page);
  await expect(page.locator('.mobile-workbar')).toBeHidden();
  const viewport=page.viewportSize();
  await page.setViewportSize({width:320,height:844});
  const library=await page.locator('#menu-button').boundingBox(), help=await page.locator('#help-button').boundingBox();
  expect(library.x+library.width).toBeLessThanOrEqual(help.x);
  await page.setViewportSize(viewport);
  for (const card of await page.locator('#featured-grid .featured-card').all()) {
    const id=await card.getAttribute('data-profile');
    const profile=boards.find(board=>board.id===id);
    expect(profile).toBeDefined();
    await expect(card.locator('.featured-title')).toHaveText(profile.name);
    await expect(card.locator('.featured-specs')).toContainText(profile.voltage);
    await expect(card.locator('.featured-specs')).toContainText(`${profile.uniqueGPIOCount ?? profile.gpioCount} GPIO`);
  }
  await expect(page.locator('script[src="https://cloud.umami.is/script.js"]')).toHaveCount(1);
  await expect(page.locator('.home-features-section')).toContainText('Umami');
  await page.locator('#home-search').fill('no-matching-model-9876');
  await expect(page.locator('#home-search-status')).toContainText('0 results');
  await expect(page.locator('#home-catalog-container .catalog-card')).toHaveCount(0);
  await page.locator('#home-search').fill('');
  await expect(page.locator('#featured-section')).toBeVisible();
  await page.locator('[data-home-filter="teensy"]').click();
  await expect(page.locator('#home-catalog-container .catalog-card')).toHaveCount(1);
});

test('Nucleo connector zoom and table scope agree and SVG bounds stay finite',async({page})=>{
  for (const id of ['nucleo-f103rb','nucleo-h723zg']) {
    const board=boards.find(board=>board.id===id);
    await ready(page,'#board='+id);
    const options=await page.locator('#connector-zoom option').evaluateAll(items=>items.map(item=>item.value));
    expect(options).toEqual(['',...board.diagram.connectorGroups.map(group=>group.id)]);
    for (const group of board.diagram.connectorGroups) {
      await page.locator('#connector-zoom').selectOption(group.id);
      const count=board.pins.filter(pin=>group.contacts.includes(pin.connector)).length;
      await expect(page.locator('#diagram [data-pin]')).toHaveCount(count);
      const boxes=await page.locator('#diagram svg').evaluateAll(items=>items.map(item=>item.getAttribute('viewBox').split(/\s+/).map(Number)));
      for (const box of boxes) {
        expect(box.every(Number.isFinite)).toBe(true);expect(box[2]).toBeGreaterThan(0);expect(box[3]).toBeGreaterThan(0);
      }
      await page.locator('#table-view').click();
      await expect(page.locator('#table-content tbody tr')).toHaveCount(count);
      await expect(page.locator('#table-content caption')).toContainText(group.label);
      await page.locator('#map-view').click();
    }
  }
});

test('keyboard filters retain focus and pin maps have one tab stop with arrow navigation',async({page})=>{
  await ready(page);
  await expect(page.locator('#home-search')).toHaveAccessibleName('Search the board library');
  const filter=page.locator('[data-home-filter="arduino"]');
  await filter.focus();await filter.press('Space');
  await expect(filter).toBeFocused();await expect(filter).toHaveAttribute('aria-pressed','true');
  await page.locator('[data-home-filter="all"]').click();
  await page.locator('#home-search').fill('Pico W');
  await page.locator('#home-catalog-container .catalog-card[data-profile="picow"]').press('Enter');
  await expect(page.locator('#board-title')).toBeFocused();
  await expect(page.locator('#diagram [data-pin][tabindex="0"]')).toHaveCount(1);
  await page.locator('#diagram [data-pin="1"]').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#diagram [data-pin="2"]')).toBeFocused();
  await page.keyboard.press('End');await expect(page.locator('#diagram [data-pin="40"]')).toBeFocused();
  await page.keyboard.press('Home');await expect(page.locator('#diagram [data-pin="1"]')).toBeFocused();
});

test('new Nucleo models share one catalog entry and link to their exact MCU package',async({page})=>{
  await ready(page);
  await expect(page.locator('#home-catalog-container .catalog-card[data-layout="nucleo-64"]')).toHaveCount(1);
  const additions=boards.filter(board=>(!process.env.NUCLEO_TEST_MODEL || board.id===process.env.NUCLEO_TEST_MODEL) && board.layoutFamily==='nucleo-64' &&
    boards.find(chip=>chip.id===board.mcuProfile)?.scopeKey==='stm32CubeScope');
  expect(additions.length).toBeGreaterThan(0);
  for(const board of additions){
    await ready(page);
    await page.locator('#home-search').fill(board.name);
    await page.locator(`#home-catalog-container .catalog-card[data-profile="${board.id}"]`).click();
    await expect(page.locator('#function-reference')).toHaveValue(board.id);
    await expect(page.locator('#board-reference')).toContainText(board.mcu);
    const pin=board.pins.find(pin=>pin.physicalLabel==='CN5.6');
    await page.locator(`#diagram [data-pin="${pin.number}"]`).click();
    await expect(page.locator(`#diagram [data-mcu-pin="${pin.mcuPin}"]`)).toHaveAttribute('aria-current','true');
    await ready(page,'#board='+board.mcuProfile);
    await expect(page.locator('#diagram [data-pin]')).toHaveCount(boards.find(chip=>chip.id===board.mcuProfile).packagePins);
    await page.locator(`#package-boards [data-package-board="${board.id}"]`).click();
    await expect(page.locator('#function-reference')).toHaveValue(board.id);
  }
});

test('standalone STM32 packages render all pads and retain searchable hardware selectors',async({page})=>{
  const packages=boards.filter(chip=>chip.scopeKey==='stm32CubeScope' &&
    !boards.some(board=>board.mcuProfile===chip.id) &&
    (!process.env.STM32_TEST_PACKAGE || chip.id===process.env.STM32_TEST_PACKAGE));
  expect(packages.length).toBeGreaterThan(0);
  for(const chip of packages){
    await ready(page,'#board='+chip.id);
    await expect(page.locator('#board-title')).toHaveText(chip.name);
    await expect(page.locator('#diagram [data-pin]')).toHaveCount(chip.packagePins);
    const extent=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth}));
    expect(extent.width).toBeLessThanOrEqual(extent.viewport+1);
    await page.locator('#pin-search').fill('USART1_TX');
    await page.locator('#table-view').click();
    const matches=chip.pins.filter(pin=>pin.functions.some(fn=>fn.name==='USART1_TX'));
    expect(matches.length).toBeGreaterThan(0);
    await expect(page.locator('#table-content tbody tr')).toHaveCount(matches.length);
    await expect(page.locator('#table-content')).toContainText('USART1_TX · AF7');
  }
});

for (const deepLink of [false,true]) test(`load failure remains visible and retry restores ${deepLink?'a model link':'the catalog'}`,async({page})=>{
  const saved={picow:{1:{function:'GPIO',label:'preserved'}}};
  await page.addInitScript(({key,saved})=>localStorage.setItem(key,JSON.stringify(saved)),{key:storageKey,saved});
  let attempts=0;
  await page.route('**/data/catalog.json',route=>++attempts===1
    ? route.fulfill({status:503,body:'unavailable'}) : route.continue());
  await page.goto('./?lang=en'+(deepLink?'#board=pico-family&profile=picow&pin=4':''));
  await expect(page.locator('#app-status[role="alert"]')).toBeVisible();
  await expect(page.locator('#menu-button')).toBeDisabled();await expect(page.locator('#home-view')).toBeHidden();
  await expect(page.locator('.mobile-workbar')).toBeHidden();
  await page.clock.install();await page.clock.fastForward(4000);
  await expect(page.locator('#retry-data')).toBeVisible();
  await page.locator('#retry-data').click();
  await expect(page.locator('#app-status')).toBeHidden();
  await expect(page.locator('#main')).toHaveAttribute('aria-busy','false');
  expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey)).toEqual(saved);
  if (deepLink) {
    await expect(page.locator('#function-reference')).toHaveValue('picow');
    expect(new URLSearchParams(new URL(page.url()).hash.slice(1)).get('pin')).toBe('4');
    await expect(page.locator('#board-title')).toBeFocused();
  } else await expect(page.locator('#home-search')).toBeFocused();
});

test('saved plans survive refresh, import previews, share previews and language changes',async({page})=>{
  await ready(page,'#board=pico-family&profile=picow&pin=1');
  if (await page.locator('#open-pin').isVisible()) await page.locator('#open-pin').click();
  await page.locator('#pin-detail input[value="I2C0 SDA"]').check();
  await page.locator('#custom-label').fill('sensor');
  await page.locator('#add-plan').click();
  const saved={1:{function:'I2C0 SDA',label:'sensor'}};
  await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key))?.picow,storageKey)).toEqual(saved);
  await page.reload();await expect(page.locator('#app-status')).toBeHidden();await openPlan(page);
  await expect(page.locator('#plan-list')).toContainText('sensor');
  await expect(page.locator('#plan-list')).toContainText('I2C0 SDA');
  const downloadEvent=page.waitForEvent('download');await page.locator('#export-button').click();
  const exported=JSON.parse(readFileSync(await (await downloadEvent).path(),'utf8'));
  expect(exported).toEqual({version:1,board:'picow',pins:saved});
  const incoming={...exported,pins:{1:{function:'I2C0 SDA',label:'incoming'}}};
  await page.locator('#import-file').setInputFiles({name:'plan.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(incoming))});
  await expect(page.locator('#incoming-plan-dialog')).toBeVisible();
  await page.locator('#incoming-plan-dialog [data-close]').last().click();
  expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).picow,storageKey)).toEqual(saved);
  await page.locator('#share-button').click();const url=await page.locator('#share-url').inputValue();
  await page.locator('#share-dialog [data-close]').click();
  const shared=await page.context().newPage();await shared.goto(url);
  await expect(shared.locator('#incoming-plan-dialog')).toBeVisible();
  await expect(shared.locator('#incoming-plan-reference')).toContainText('Pico W');
  await shared.locator('#incoming-plan-dialog [data-close]').last().click();await shared.close();
  if (await page.locator('#details-dialog').isVisible()) await page.locator('#close-details').click();
  if (!await page.locator('#console-language-select').isVisible()) await page.locator('[data-console-menu]').click();
  await page.locator('#console-language-select').selectOption('tr');
  expect(new URL(page.url()).searchParams.get('lang')).toBe('tr');
  await expect(page.locator('#board-reference')).toContainText('RP2040');
  expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).picow,storageKey)).toEqual(saved);
});
