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
  if (await page.locator('#details-dialog').isVisible()) await page.locator('#plan-tab').click();
  else if (await page.locator('#open-plan').isVisible()) await page.locator('#open-plan').click();
  else await page.locator('#plan-tab').click();
}

async function chooseCompatibleModel(page,id) {
  const index=page.locator('#compatible-boards');
  if(!await index.evaluate(el=>el.open))await index.locator('summary').click();
  await page.locator(`#compatibility-list [data-compatible-model="${id}"]`).click();
}

test('occupied aliases name the saved contact in both the peripheral picker and pin details',async({page})=>{
 const raw=boards.find(b=>b.id==='nucleo-f446re');
 const saved=raw.pins.find(p=>p.physicalLabel==='CN5.9'),alias=raw.pins.find(p=>p.physicalLabel==='CN10.5');
 await page.addInitScript(({key,id,number})=>localStorage.setItem(key,JSON.stringify({[id]:{[number]:{function:'I2C1_SDA',label:'sensor'}}})),{key:storageKey,id:raw.id,number:saved.number});
 await ready(page,'#board=nucleo-64&profile=nucleo-f446re');await openPlan(page);
 await page.locator('#peripheral-builder summary').click();await page.locator('#peripheral-bus').selectOption('CAN1');
 const option=page.locator('[data-peripheral-role="TX"] option').filter({hasText:'CN10.5 · PB9'});
 await expect(option).toHaveJSProperty('disabled',true);await expect(option).toContainText('CN5.9 for I2C1_SDA');
 if(await page.locator('#details-dialog').isVisible())await page.locator('#close-details').click();
 else await page.locator('#detail-tab').click();
 await page.locator(`#diagram [data-pin="${alias.number}"]`).click();
 await expect(page.locator('.pin-occupancy')).toContainText('PB9 is already used on CN5.9 for I2C1_SDA');
 await expect(page.locator('#add-plan')).toBeDisabled();
 await page.locator('[data-open-assignment]').click();
 await expect(page.locator('#pin-detail .physical-pin strong')).toHaveText('CN5.9');
 await expect(page.locator('#add-plan')).toBeEnabled();
});

test('plans expand on desktop and comparison highlights only real route differences',async({page})=>{
 await ready(page,'#board=pico-family&profile=picow');await openPlan(page);
 if(page.viewportSize().width>970){
  await expect(page.locator('.workspace')).toHaveClass(/plan-workspace/);
  expect((await page.locator('#plan-panel').boundingBox()).width).toBeGreaterThan(1000);
  await page.locator('#plan-layout-toggle').click();await expect(page.locator('.map-panel')).toBeVisible();
  await page.locator('#plan-layout-toggle').click();
 }
 await page.locator('#pin-suggestions summary').click();await page.locator('#suggest-run').click();
 await expect(page.locator('.suggestion')).toHaveCount(3);
 if(page.viewportSize().width>970)expect((await page.locator('.suggestion').first().boundingBox()).width).toBeGreaterThan(400);
 await expect(page.locator('.suggestion').first().locator('.changed-signal')).toHaveCount(0);
 const other=page.locator('.suggestion').nth(1);
 expect(await other.locator('.changed-signal').count()).toBeGreaterThan(0);
 await page.locator('#suggest-only-differences').check();
 for(const row of await other.locator('.unchanged-signal').all())await expect(row).toBeHidden();
 await page.locator('[data-apply-suggestion="0"]').click();
 await expect(page.locator('#plan-list .plan-group')).toHaveCount(3);
 await expect(page.locator('#plan-count')).toHaveText('8');
});

test('physical warnings precede pin choices and generic guidance is deduplicated in suggestions',async({page})=>{
 const raw=boards.find(b=>b.id==='nucleo-f446re'),clock=raw.pins.find(p=>p.physicalLabel==='CN5.6');
 await page.addInitScript(({key,id,number})=>localStorage.setItem(key,JSON.stringify({[id]:{[number]:{function:'SPI1_SCK',label:'FLASH_SCK'}}})),{key:storageKey,id:raw.id,number:clock.number});
 await ready(page,`#board=nucleo-64&profile=nucleo-f446re&pin=${clock.number}`);
 if(page.viewportSize().width<=970)await page.locator('#open-pin').click();
 await expect(page.locator('#pin-detail .circuit-notes')).toContainText('SB21');
 expect(await page.locator('#pin-detail').evaluate(el=>Boolean(el.querySelector('.circuit-notes').compareDocumentPosition(el.querySelector('.function-section'))&Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
 await openPlan(page);await page.locator('#pin-suggestions summary').click();
 await page.locator('[data-suggest-count="I2C"]').fill('1');await page.locator('[data-suggest-count="UART"]').fill('1');
 await page.locator('#suggest-run').click();await expect(page.locator('.suggestion')).toHaveCount(3);
 const first=page.locator('.suggestion').first();
 await expect(first).toContainText('1 distinct hardware notes');
 await expect(first.locator('.circuit-notes li')).toHaveCount(1);
 await expect(first.locator('.circuit-notes')).toContainText('SB21');
 await expect(first.locator('.circuit-notes')).not.toContainText('GPIO pad in this package');
 await first.locator('.suggestion-evidence summary').click();
 await expect(first.locator('.suggestion-evidence p').filter({hasText:'GPIO pad in this package'})).toHaveCount(1);
});

test('readable JSON round trips with source hashes and warns when the dataset revision changes',async({page})=>{
 await ready(page,'#board=pico-family&profile=picow&pin=1');
 if(page.viewportSize().width<=970)await page.locator('#open-pin').click();
 await page.locator('#custom-label').fill('sensor');await page.locator('#add-plan').click();await openPlan(page);
 const download=page.waitForEvent('download');await page.locator('#export-button').click();
 const payload=JSON.parse(readFileSync(await (await download).path(),'utf8'));
 expect(payload.version).toBe(3);expect(payload.pins[0]).toMatchObject({physical:'01',signal:'GP0',label:'sensor'});
 expect(payload.provenance.profile.revision).toMatch(/^[a-f0-9]{16}$/);
 expect(payload.provenance.documents.length).toBeGreaterThan(0);
 expect(payload.provenance.documents.every(document=>/^[a-f0-9]{64}$/.test(document.sha256))).toBe(true);
 const upload=()=>page.locator('#import-file').setInputFiles({name:'plan.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(payload))});
 await upload();await expect(page.locator('#incoming-plan-revision')).toBeHidden();
 await page.locator('#save-incoming-plan').click();await expect(page.locator('#plan-list')).toContainText('sensor');
 payload.provenance.profile.file='profiles/picow.0000000000000000.json';
 await upload();await expect(page.locator('#incoming-plan-revision')).toBeVisible();
 await expect(page.locator('#incoming-plan-revision')).toContainText('different board data revision');
 await page.locator('#incoming-plan-dialog [data-close]').last().click();
 payload.pins[0].signal='WRONG';await upload();
 await expect(page.locator('#incoming-plan-dialog')).toBeHidden();
 await expect(page.locator('#plan-feedback')).toContainText('does not match the current board data');
 await expect(page.locator('#plan-list')).toContainText('sensor');
});

test('catalog types fit a narrow screen with enlarged Turkish and English text',async({page})=>{
  await page.setViewportSize({width:320,height:960});
  for(const language of ['tr','en'])for(const scale of [1,2]) {
    await page.goto('about:blank');
    await page.goto('./?lang='+language);
    await expect(page.locator('#app-status')).toBeHidden();
    await page.addStyleTag({content:`html { font-size: ${100*scale}% !important; }`});
    await page.evaluate(()=>document.fonts.ready);
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    const buttons=page.locator('#home-catalog-types .catalog-type-button');
    await expect(buttons).toHaveCount(4);
    for(const button of await buttons.all()) {
      expect(await button.evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
      await expect(button.locator('small')).toBeVisible();
    }
  }
});

test('suggestion text and library fields grow with the reader text setting',async({page})=>{
  for(const scale of [1,2]) {
    await page.goto('about:blank');
    await ready(page,'#board=pico-family&profile=picow');
    await page.addStyleTag({content:`html { font-size: ${100*scale}% !important; }`});
    await openPlan(page);
    await page.locator('#pin-suggestions summary').click();
    const sizes=await page.locator('#pin-suggestions').evaluate(el=>({
      description:parseFloat(getComputedStyle(el.querySelector('p')).fontSize),
      labels:[...el.querySelectorAll('.suggest-counts label,.suggest-cs-label')].map(node=>parseFloat(getComputedStyle(node).fontSize)),
      inputs:[...el.querySelectorAll('.suggest-counts input')].map(node=>parseFloat(getComputedStyle(node).fontSize)),
    }));
    expect(sizes.description).toBeGreaterThanOrEqual(14*scale);
    expect(sizes.labels.every(size=>size>=14*scale)).toBe(true);
    expect(sizes.inputs.every(size=>size>=16*scale)).toBe(true);
    await page.locator('#suggest-run').click();
    await expect(page.locator('.suggestion')).toHaveCount(3);
    const resultSizes=await page.locator('.suggestion').first().evaluate(el=>({
      rows:[...el.querySelectorAll('li')].map(node=>parseFloat(getComputedStyle(node).fontSize)),
      metadata:[...el.querySelectorAll('small,a,.suggestion-evidence,.suggestion-evidence p')].map(node=>parseFloat(getComputedStyle(node).fontSize)),
    }));
    expect(resultSizes.rows.length).toBeGreaterThan(0);
    expect(resultSizes.rows.every(size=>size>=14*scale)).toBe(true);
    expect(resultSizes.metadata.every(size=>size>=13*scale)).toBe(true);
    if(await page.locator('#details-dialog').isVisible())await page.locator('#close-details').click();
    await page.locator('#menu-button').click();
    await expect(page.locator('#library-dialog')).toBeVisible();
    const filters=await page.locator('.library-filter-row select').evaluateAll(nodes=>nodes.filter(node=>node.checkVisibility()).map(node=>parseFloat(getComputedStyle(node).fontSize)));
    expect(filters.length).toBeGreaterThan(0);
    expect(filters.every(size=>size>=16*scale)).toBe(true);
  }
});

test('Nucleo bridge changes preserve old plans, reroute functions and persist with configuration',async({page})=>{
 const raw=boards.find(b=>b.id==='nucleo-l432kc'),a5=raw.pins.find(p=>p.physicalLabel==='CN4.7');
 const analog=a5.functions.find(f=>f.group==='ADC').name;
 const saved={[raw.id]:{[a5.number]:{function:analog,label:'keep analog'}}};
 await page.addInitScript(({key,saved})=>localStorage.setItem(key,JSON.stringify(saved)),{key:storageKey,saved});
 await ready(page,'#board=nucleo-l432kc');await openPlan(page);
 await page.locator('#hardware-config summary').first().click();
 await page.locator('[data-hardware="SB16"]').selectOption('on');
 await page.locator('#pin-suggestions summary').click();await page.locator('#suggest-run').click();
 await expect(page.locator('#suggest-feedback')).toContainText('pending board configuration');
 await page.locator('#apply-hardware').click();
 await expect(page.locator('#plan-validation')).toContainText('unavailable on the applied board route');
 await expect(page.locator('#plan-list')).toContainText('keep analog');
 await page.reload();await expect(page.locator('#app-status')).toBeHidden();await openPlan(page);
 await expect(page.locator('[data-hardware="SB16"]')).toHaveValue('on');
 await page.locator('#hardware-config summary').first().click();
 await page.locator('[data-hardware="SB16"]').selectOption('off');await page.locator('#apply-hardware').click();
 await expect(page.locator('#plan-validation')).toBeEmpty();
 const event=page.waitForEvent('download');await page.locator('#export-button').click();
 const exported=JSON.parse(readFileSync(await (await event).path(),'utf8'));
 expect(exported.version).toBe(3);expect(exported.hardware.SB16).toBe('off');
 expect(exported.pins).toEqual([expect.objectContaining({physical:'CN4.7',signal:'PA6',function:analog,label:'keep analog'})]);
 expect(exported.provenance.profile.revision).toMatch(/^[a-f0-9]{16}$/);
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey)).toEqual(saved);
});

test('hardware import and share preview keep pins and settings together until saved',async({page})=>{
 const raw=boards.find(b=>b.id==='nucleo-l432kc'),a5=raw.pins.find(p=>p.physicalLabel==='CN4.7');
 const payload={version:2,board:raw.id,pins:{[a5.number]:{function:'GPIO',label:'routed'}},hardware:{SB16:'on',SB18:'off'}};
 await ready(page,'#board=nucleo-l432kc');await openPlan(page);
 const importFile=()=>page.locator('#import-file').setInputFiles({name:'configured.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(payload))});
 await importFile();await expect(page.locator('#incoming-plan-configuration')).toContainText('SB16');
 await page.locator('#incoming-plan-dialog [data-close]').last().click();
 expect(await page.evaluate(()=>localStorage.getItem('pin-atlas:plans:v2'))).toBeNull();
 await expect(page.locator('[data-hardware="SB16"]')).toHaveValue('unknown');
 await importFile();await page.locator('#save-incoming-plan').click();
 await expect(page.locator('#incoming-plan-dialog')).toBeHidden();
 await expect(page.locator('#plan-list')).toContainText('routed');
 await expect(page.locator('[data-hardware="SB16"]')).toHaveValue('on');
 await page.locator('#share-button').click();const url=await page.locator('#share-url').inputValue();
 await page.locator('#share-dialog [data-close]').click();
 const tab=await page.context().newPage();await tab.goto(url);
 await expect(tab.locator('#incoming-plan-configuration')).toContainText('ON · connected');
 await tab.locator('#incoming-plan-dialog [data-close]').last().click();await tab.close();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('pin-atlas:plans:v2'))['nucleo-l432kc'].hardware.SB16)).toBe('on');
});

test('worker suggests and compares one SPI plus two UARTs without replacing a locked signal',async({page})=>{
 const saved={picow:{1:{function:'UART0 TX',label:'console'}}};
 await page.addInitScript(({key,saved})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(saved));},{key:storageKey,saved});
 await ready(page,'#board=pico-family&profile=picow');await openPlan(page);
 await page.locator('#pin-suggestions summary').click();await page.locator('#suggest-run').click();
 await expect(page.locator('.suggestion')).toHaveCount(3);
 await expect(page.locator('.suggestion').first()).toContainText('UART0');
 await expect(page.locator('.suggestion').first()).toContainText('UART1');
 await expect(page.locator('.suggestion').first()).toContainText('7 new pins · 1 assignments kept');
 await page.locator('[data-apply-suggestion="0"]').click();
 await expect(page.locator('#plan-count')).toHaveText('8');
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).picow[1],storageKey)).toEqual(saved.picow[1]);
 await page.reload();await expect(page.locator('#app-status')).toBeHidden();await openPlan(page);
 await expect(page.locator('#plan-count')).toHaveText('8');
 await page.locator('#pin-suggestions summary').click();await page.locator('#suggest-run').click();
 await expect(page.locator('.suggestion').first()).toContainText('0 new pins · 8 assignments kept');
});

test('changed requirements discard suggestions and stale external plans cannot be overwritten',async({page})=>{
 await ready(page,'#board=pico-family&profile=picow');await openPlan(page);
 await page.locator('#pin-suggestions summary').click();await page.locator('#suggest-run').click();
 await expect(page.locator('.suggestion')).toHaveCount(3);
 await page.locator('[data-suggest-count="UART"]').fill('1');
 await expect(page.locator('.suggestion')).toHaveCount(0);
 await page.locator('#suggest-run').click();await expect(page.locator('.suggestion')).toHaveCount(3);
 const other={1:{function:'GPIO',label:'other tab'}};
 await page.evaluate(({key,other})=>localStorage.setItem(key,JSON.stringify({picow:other})),{key:storageKey,other});
 await page.locator('[data-apply-suggestion="0"]').click();
 await expect(page.locator('#suggest-feedback')).toContainText('changed');
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).picow,storageKey)).toEqual(other);
});

test('suggestions keep working in memory after browser storage reaches its quota',async({page})=>{
 await ready(page,'#board=pico-family&profile=picow');await openPlan(page);
 await page.evaluate(()=>{
  const original=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){if(key.startsWith('pin-atlas:plans:'))throw new DOMException('Quota exceeded','QuotaExceededError');return original.call(this,key,value);};
 });
 await page.locator('#pin-suggestions summary').click();await page.locator('#suggest-run').click();
 await expect(page.locator('.suggestion')).toHaveCount(3);await page.locator('[data-apply-suggestion="0"]').click();
 await expect(page.locator('#plan-count')).toHaveText('8');
 await expect(page.locator('#plan-feedback')).toContainText('Browser storage is unavailable');
 await page.locator('#suggest-run').click();await expect(page.locator('.suggestion')).toHaveCount(1);
 await page.locator('[data-apply-suggestion="0"]').click();
 await expect(page.locator('#plan-count')).toHaveText('8');
 await expect(page.locator('#suggest-feedback')).toBeEmpty();
});

test('Nucleo144 model changes retain the physical contact and old H723 wiring plans',async({page})=>{
 const saved={'nucleo-h723zg':{21:{function:'SPI1_MOSI',label:'legacy MOSI'}}};
 await page.addInitScript(({key,saved})=>localStorage.setItem(key,JSON.stringify(saved)),{key:storageKey,saved});
 await ready(page,'#board=nucleo-h723zg&pin=21');
 await expect(page.locator('#diagram [data-pin="21"]')).toHaveAttribute('aria-current','true');
 await expect(page.locator('#function-reference-bar')).toHaveCount(0);
 await chooseCompatibleModel(page,'nucleo-f767zi');
 await expect(page.locator('#app-status')).toBeHidden();
 await expect(page.locator('#diagram [data-pin="14"]')).toHaveAttribute('aria-current','true');
 await chooseCompatibleModel(page,'nucleo-h723zg');
 await expect(page.locator('#app-status')).toBeHidden();
 await expect(page.locator('#diagram [data-pin="21"]')).toHaveAttribute('aria-current','true');
 await openPlan(page);await expect(page.locator('#plan-list')).toContainText('CN7.14');
 await expect(page.locator('#plan-list')).toContainText('legacy MOSI');
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storageKey)).toEqual(saved);
});

for(const board of boards.filter(b=>['nucleo32Scope','nucleo144SourceScope','blackPillScope'].includes(b.scopeKey))) {
 test(`${board.id} opens its exact reference and verified package`,async({page})=>{
  await ready(page);await page.locator('#home-search').fill(board.name);
  await page.locator(`#home-catalog-container [data-profile="${board.id}"]`).first().click();
  await expect(page.locator('#board-title')).toHaveText(board.name);
  const pin=board.pins.find(p=>p.type==='GPIO' && p.mcuPin);
  await page.locator(`#diagram [data-pin="${pin.number}"]`).click();
  await expect(page.locator(`#diagram [data-mcu-pin="${pin.mcuPin}"]`)).toHaveAttribute('aria-current','true');
  await ready(page,'#board='+board.mcuProfile);
  const chip=boards.find(b=>b.id===board.mcuProfile);
  await expect(page.locator('#diagram [data-pin]')).toHaveCount(chip.packagePins);
  if(chip.exposedPad===false)await expect(page.locator('#diagram')).not.toContainText('EP · GND');
  await page.locator(`#package-boards [data-package-board="${board.id}"]`).click();
  await expect(page.locator('#board-title')).toHaveText(board.name);
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
 await expect(page.locator('#board-title')).toHaveText('Raspberry Pi Pico W');
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
 await expect(page.locator('#peripheral-notes')).toContainText('RP2040');
 expect(await page.locator('#peripheral-notes a').count()).toBeGreaterThan(0);
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
 await ready(page,'#board='+board.id);
 await page.locator('#view-options > summary').click();await page.locator('#connector-zoom').selectOption('CN7');
 await page.locator('#view-options > summary').click();
 await openPlan(page);
 const event=page.waitForEvent('download');await page.locator('#export-svg').click();
 const svg=readFileSync(await(await event).path(),'utf8');
 expect(svg).toContain('NUCLEO-F446RE');expect(svg).toContain('sensor &lt;&amp;&gt; Türkçe');
 expect(svg).not.toContain('var(--');
 const parsed=await page.evaluate(svg=>{
  const xml=new DOMParser().parseFromString(svg,'image/svg+xml');
  return {errors:xml.querySelectorAll('parsererror').length,pins:xml.querySelectorAll('[data-pin]').length,
   images:[...xml.querySelectorAll('image')].map(img=>img.getAttribute('href')),
   labelFill:xml.querySelector('.connector-signal')?.getAttribute('fill')};
 },svg);
 expect(parsed.errors).toBe(0);expect(parsed.pins).toBe(108);
 expect(parsed.labelFill).toBe('rgb(23, 34, 29)');
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
  await expect(page.locator('.home-badge')).toBeVisible();
  const top=selector=>page.locator(selector).evaluate(el=>el.getBoundingClientRect().top);
  expect(await top('.home-stats')).toBeLessThan(await top('#featured-section'));
  expect(await top('#featured-section')).toBeLessThan(await top('#catalog-section'));
  await expect(page.locator('#home-catalog-container .catalog-platform[open]')).toHaveCount(0);
  const platform=page.locator('#home-catalog-container .catalog-platform').first();
  await platform.locator('summary').click();
  await expect(platform.locator('.catalog-card').first()).toBeVisible();
  await expect(page.locator('#home-view')).toBeVisible();
  await platform.locator('summary').click();
  await page.locator('#home-search').scrollIntoViewIfNeeded();

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
  await page.locator('#home-reset-catalog').click();
  await page.locator('#home-catalog-types [data-catalog-type-filter="boards"]').click();
  await page.locator('[data-home-filter="stm32"]').click();
  await expect(page.locator('#home-catalog-container [data-type-section="chips"]')).toHaveCount(0);
  await expect(page.locator('#home-catalog-container .catalog-card[data-profile="nucleo-l432kc"]')).toHaveCount(1);
  await page.locator('#home-search').fill('nucleo 32');
  await expect(page.locator('#home-catalog-container .catalog-card')).toHaveCount(2);
  await page.locator('#home-catalog-container .catalog-card[data-profile="nucleo-l432kc"]').click();
  await expect(page.locator('#board-title')).toHaveText('NUCLEO-L432KC');
  await expect(page.locator('#board-reference')).toContainText('Nucleo-32');
  await expect(page.locator('#compatibility-current')).toHaveText('NUCLEO-L432KC');
  await page.locator('#menu-button').click();
  await page.locator('#library-types [data-catalog-type-filter="chips"]').click();
  await page.locator('#library-platform').selectOption('stm32');
  await expect(page.locator('#catalog-grid .catalog-card')).toHaveCount(boards.filter(board=>board.id.startsWith('stm32')).length);
  await page.locator('#catalog-search').fill('no-such-part');
  await expect(page.locator('#library-result-count')).toHaveText('0 results');
  await page.locator('#catalog-grid [data-reset-catalog]').click();
  await expect(page.locator('#catalog-grid .catalog-card')).toHaveCount(boards.length);

});

test('shared diagram options expose connector scope and agree with the table',async({page})=>{
  const {connectorGroupsFor}=await import('../../public/connectors.mjs');
  for (const id of ['nucleo-f103rb','nucleo-h723zg','arduino-nano-33-ble-sense-rev2']) {
    const board=boards.find(board=>board.id===id);
    await ready(page,'#board='+id);
    const options=await page.locator('#connector-zoom option').evaluateAll(items=>items.map(item=>item.value));
    const groups=connectorGroupsFor(board);
    expect(options).toEqual(['',...groups.map(group=>group.id)]);
    await expect(page.locator('#map-content > #connector-tools')).toHaveCount(0);
    await expect(page.locator('#connector-zoom')).toBeHidden();
    for (const group of groups) {
      await page.locator('#view-options > summary').click();
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

test('Nucleo catalog exposes every model and links to its exact MCU package',async({page})=>{
  await ready(page);
  await expect(page.locator('#home-catalog-container .catalog-card[data-layout="nucleo-64"]')).toHaveCount(boards.filter(board=>board.layoutFamily==='nucleo-64').length);
  const additions=boards.filter(board=>(!process.env.NUCLEO_TEST_MODEL || board.id===process.env.NUCLEO_TEST_MODEL) && board.layoutFamily==='nucleo-64' &&
    boards.find(chip=>chip.id===board.mcuProfile)?.scopeKey==='stm32CubeScope');
  expect(additions.length).toBeGreaterThan(0);
  for(const board of additions){
    await ready(page);
    await page.locator('#home-search').fill(board.name);
    await page.locator(`#home-catalog-container .catalog-card[data-profile="${board.id}"]`).click();
    await expect(page.locator('#board-title')).toHaveText(board.name);
    await expect(page.locator('#board-reference')).toContainText(board.mcu);
    const pin=board.pins.find(pin=>pin.physicalLabel==='CN5.6');
    await page.locator(`#diagram [data-pin="${pin.number}"]`).click();
    await expect(page.locator(`#diagram [data-mcu-pin="${pin.mcuPin}"]`)).toHaveAttribute('aria-current','true');
    await ready(page,'#board='+board.mcuProfile);
    await expect(page.locator('#diagram [data-pin]')).toHaveCount(boards.find(chip=>chip.id===board.mcuProfile).packagePins);
    await page.locator(`#package-boards [data-package-board="${board.id}"]`).click();
    await expect(page.locator('#board-title')).toHaveText(board.name);
  }
});

// Each renderer uses the same selection, transform and detail-panel contract.
for(const id of ['picow','raspberry-pi-5','rp2040','stm32f103vbt6','atmega328p-pdip28','arduino-nano-33-ble-sense-rev2','nucleo-h723zg']){
 test(`${id} keeps pin selection consistent through mirror, rotation and table views`,async({page})=>{
  const raw=boards.find(board=>board.id===id);
  await ready(page,'#board='+id);
  await expect(page.locator('#hardware-kind')).toHaveText(['qfn','lqfp','dip'].includes(raw.layout)?'MCU packages':'Development boards');
  await expect(page.locator('#specs').getByText(raw.voltage,{exact:true})).toBeVisible();
  const pins=raw.pins.filter(pin=>pin.type==='GPIO' && !pin.reserved).slice(0,2);
  let selected;
  for(const [i,action] of [null,'flip-button','rotate-button','flip-button'].entries()){
    if(action){
      await page.locator('#view-options > summary').click();
      await page.locator('#'+action).click();
    }
    selected=pins[i%2];
    await page.locator(`#diagram [data-pin="${selected.number}"] .pin-node`).click();
    await expect(page.locator(`#diagram [data-pin="${selected.number}"]`)).toHaveAttribute('aria-current','true');
    await expect(page.locator('#pin-detail h2')).toHaveText(selected.name.replace('_ADC',' / A'));
    if(page.viewportSize().width<=970){
      await expect(page.locator('#details-dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator(`#diagram [data-pin="${selected.number}"]`)).toBeFocused();
    } else await expect(page.locator('#details-home .details-panel')).toBeVisible();
  }
  await page.locator('#table-view').click();
  await expect(page.locator(`#table-content tr.selected[data-pin="${selected.number}"]`)).toHaveCount(1);
  await page.locator('#map-view').click();
  await page.locator('#view-options > summary').click();await page.locator('#reset-view').click();
  await expect(page.locator('#flip-button')).toHaveAttribute('aria-pressed','false');
  await expect(page.locator('#rotate-button')).toHaveAttribute('aria-pressed','false');
  const visible=await page.locator(`#diagram [data-pin="${selected.number}"] .pin-node`).evaluate(node=>{
    const scroller=node.closest('.board-pin-map') || document.querySelector('#diagram');
    const pin=node.getBoundingClientRect(),map=scroller.getBoundingClientRect();
    return pin.left>=map.left-1 && pin.right<=map.right+1;
  });
  expect(visible).toBe(true);
 });
}

test('MCU preview pads use the same detail interaction and keep keyboard focus',async({page})=>{
 const raw=boards.find(board=>board.id==='nucleo-l432kc');
 const pin=raw.pins.find(pin=>pin.type==='GPIO' && pin.mcuPin);
 await ready(page,'#board='+raw.id);
 const pad=page.locator(`#diagram [data-mcu-pin="${pin.mcuPin}"]`);
 await pad.click();
 await expect(pad).toHaveAttribute('aria-current','true');
 if(page.viewportSize().width<=970){
   await expect(page.locator('#details-dialog')).toBeVisible();await page.keyboard.press('Escape');
 }
 await expect(pad).toBeFocused();
 await page.keyboard.press('ArrowRight');
 await expect(page.locator('#details-dialog')).toBeHidden();
 const active=page.locator('#diagram [data-mcu-pin][aria-current="true"]');
 await expect(active).toBeFocused();
 await page.keyboard.press('Enter');
 if(page.viewportSize().width<=970){
   await expect(page.locator('#details-dialog')).toBeVisible();await page.keyboard.press('Escape');
 }
 await expect(active).toBeFocused();
});

test('map updates retain the left edge and opening details preserves the scroll position',async({page})=>{
 for(const id of ['stm32f103vbt6','nucleo-h723zg']){
  await ready(page,'#board='+id);
  const scroller=page.locator('#diagram .board-pin-map').first();
  const map=await scroller.count()?scroller:page.locator('#diagram');
  await map.evaluate(el=>{el.scrollLeft=0;});
  await page.locator('#pin-search').fill('PA');
  expect(await map.evaluate(el=>el.scrollLeft)).toBe(0);
  await page.locator('#pin-search').fill('');
  expect(await map.evaluate(el=>el.scrollLeft)).toBe(0);
  if(page.viewportSize().width<=970){
    await page.locator('#open-pin').click();await page.keyboard.press('Escape');
    await expect(page.locator('#open-pin')).toBeFocused();
    expect(await map.evaluate(el=>el.scrollLeft)).toBe(0);
  }
 }
});

test('compact details use the full width, scroll above a fixed action and preserve edits on resize',async({page})=>{
 for(const width of [320,727]){
  await page.setViewportSize({width,height:793});
  await ready(page,'#board=stm32f103vbt6&pin=3');
  await page.locator('#open-pin').click();
  await expect(page.locator('#details-dialog')).toBeVisible();
  const dimensions=await page.locator('#details-dialog').evaluate(dialog=>{
    const body=dialog.querySelector('.pin-detail-body'),note=dialog.querySelector('.pin-description');
    return {width:dialog.clientWidth,scrollWidth:dialog.scrollWidth,body:body.clientWidth,note:note.getBoundingClientRect().width};
  });
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width+1);
  expect(dimensions.note).toBeGreaterThan(dimensions.body*.8);
  const action=page.locator('#add-plan'),before=await action.boundingBox();
  await page.locator('.pin-detail-body').evaluate(el=>{el.scrollTop=el.scrollHeight;});
  const after=await action.boundingBox();expect(Math.abs(after.y-before.y)).toBeLessThan(1);
  await expect(action).toBeInViewport();
  await page.locator('#custom-label').fill('draft survives resizing');
  await page.keyboard.press('Escape');await expect(page.locator('#open-pin')).toBeFocused();
  await page.locator('#open-pin').click();
  await expect(page.locator('#custom-label')).toHaveValue('draft survives resizing');
  await page.setViewportSize({width:1100,height:900});
  await expect(page.locator('#details-dialog')).toBeHidden();
  await expect(page.locator('#details-home .details-panel')).toBeVisible();
  await expect(page.locator('#custom-label')).toHaveValue('draft survives resizing');
 }
});

test('LQFP pin terminals select their own pin on all four package edges',async({page})=>{
  const chip=boards.find(board=>board.id==='stm32f103vbt6');
  await ready(page,'#board='+chip.id+'&pin=1');
  for(const [number,dx,dy] of [[2,8,0],[27,0,-8],[52,-8,0],[77,0,8]]){
    const terminal=page.locator(`#diagram [data-pin="${number}"] .pin-node`);
    await terminal.evaluate(el=>el.scrollIntoView({block:'center',inline:'center'}));
    const box=await terminal.boundingBox(),scale=box.width/8.8;
    await page.mouse.click(box.x+box.width/2+dx*scale,box.y+box.height/2+dy*scale);
    await expect(page.locator(`#diagram [data-pin="${number}"]`)).toHaveAttribute('aria-current','true');
    await expect(page.locator('#pin-detail h2')).toHaveText(chip.pins.find(pin=>pin.number===number).name);
    expect(new URLSearchParams(new URL(page.url()).hash.slice(1)).get('pin')).toBe(String(number));
    if(await page.locator('#details-dialog').isVisible())await page.locator('#close-details').click();
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
    await expect(page.locator('#board-title')).toHaveText('Raspberry Pi Pico W');
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
  expect(exported).toMatchObject({version:3,board:'picow',pins:[{physical:'01',signal:'GP0',function:'I2C0 SDA',label:'sensor'}]});
  const incoming={...exported,pins:exported.pins.map(pin=>({...pin,label:'incoming'}))};
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

test('CAN peripheral suggestions and electrical tolerance badges render correctly', async({page})=>{
  await ready(page, '#board=nucleo-g474re');
  await page.locator('#diagram [data-pin="28"] .pin-node').click();
  if (page.viewportSize().width <= 970) {
    await expect(page.locator('#details-dialog')).toBeVisible();
    await expect(page.locator('#details-dialog .pin-badge')).toBeVisible();
  } else {
    await expect(page.locator('#details-home .pin-badge')).toBeVisible();
  }
  await openPlan(page);
  await page.locator('#pin-suggestions summary').click();
  await page.locator('[data-suggest-count="SPI"]').fill('0');
  await page.locator('[data-suggest-count="UART"]').fill('1');
  await page.locator('[data-suggest-count="CAN"]').fill('1');
  await page.locator('#suggest-run').click();
  await expect(page.locator('.suggestion')).toHaveCount(3);
  await expect(page.locator('.suggestion').first()).toContainText('FDCAN');
});

test('PWM servo aliases require consent on both pins and export the shared signal explicitly',async({page})=>{
 const first={function:'PWM0 A',label:'servo1'};
 await page.addInitScript(({key,first})=>localStorage.setItem(key,JSON.stringify({pico:{1:first}})),{key:storageKey,first});
 await ready(page,'#board=pico-family&profile=pico&pin=21');
 if(page.viewportSize().width<=970)await page.locator('#open-pin').click();
 const pwm=page.locator('input[name="pin-function"][value="PWM0 A"]');
 if(!await pwm.isVisible())await page.locator('.more-functions summary').click();
 await pwm.check();await page.locator('#custom-label').fill('servo2');await page.locator('#add-plan').click();
 await expect(page.locator('#pin-save-status')).toContainText('two servos cannot be controlled independently');
 await page.locator('#shared-pwm').check();await page.locator('#add-plan').click();
 await expect(page.locator('#pin-save-status')).toContainText('confirm sharing on both assignments');
 expect(await page.evaluate(key=>Object.keys(JSON.parse(localStorage.getItem(key)).pico).length,storageKey)).toBe(1);
 if(await page.locator('#details-dialog').isVisible())await page.locator('#close-details').click();
 await page.locator('#diagram [data-pin="1"]').click();
 await page.locator('#shared-pwm').check();await page.locator('#add-plan').click();
 if(await page.locator('#details-dialog').isVisible())await page.locator('#close-details').click();
 await page.locator('#diagram [data-pin="21"]').click();
 if(!await pwm.isVisible())await page.locator('.more-functions summary').click();
 await pwm.check();await page.locator('#shared-pwm').check();await page.locator('#custom-label').fill('same signal');
 await page.locator('#add-plan').click();await openPlan(page);
 await expect(page.locator('#plan-count')).toHaveText('2');
 await expect(page.locator('#plan-validation')).toContainText('without independent control');
 const download=page.waitForEvent('download');await page.locator('#export-button').click();
 const exported=JSON.parse(readFileSync(await (await download).path(),'utf8'));
 expect(exported.pins.every(p=>p.sharedPWM===true)).toBe(true);
 await page.locator('#import-file').setInputFiles({name:'shared-pwm.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});
 await expect(page.locator('#incoming-plan-dialog')).toBeVisible();
});
