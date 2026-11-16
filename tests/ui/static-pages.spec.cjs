const {test,expect}=require('@playwright/test');
const searchIndex=require('../../public/search.json');
const {profiles}=require('../../public/data/catalog.json');
const boards=require('../../public/data/boards.json');
const errors=new WeakMap();

test.beforeEach(async({page,baseURL})=>{
  const collected=[];errors.set(page,collected);
  page.on('pageerror',error=>collected.push(error.message));
  await page.context().route('**/*',route=>new URL(route.request().url()).origin===new URL(baseURL).origin
    ? route.continue() : route.abort());
});
test.afterEach(async({page})=>expect(errors.get(page)).toEqual([]));

const profileNamed=name=>profiles.find(profile=>profile.name===name);
async function expectBoard(page,profile) {
  await expect(page.locator('#app-status')).toBeHidden();
  await expect(page.locator('#workspace-view')).toBeVisible();
  await expect(page.locator('#board-title')).toHaveText(profile.name);
  await expect(page).toHaveURL(new RegExp(`#board=${profile.physicalLayout}&profile=${profile.id}(&|$)`));
  // No stray pin filter: the search box is empty and every pin still matches.
  await expect(page.locator('#pin-search')).toHaveValue('');
  await expect(page.locator('#no-matches')).toBeHidden();
  await expect(page.locator('#diagram .pin-group.dimmed')).toHaveCount(0);
  await expect(page.locator('#link-notice')).toBeHidden();
}

for(const name of ['BBC micro:bit V2','BeagleBone Black','Raspberry Pi 4 Model B']) {
  test(`the search index link for ${name} opens that board without a pin filter`,async({page})=>{
    const profile=profileNamed(name),entry=searchIndex.find(item=>item.title===name && item.lang==='en');
    expect(entry.url).not.toContain('?');
    // Suite search results are opened with the reader's language attached.
    const address=new URL(entry.url,'http://127.0.0.1:4185');address.searchParams.set('lang','en');
    await page.goto(address.pathname+address.search+address.hash);
    await expectBoard(page,profile);
    await expect(page.locator('#diagram [data-pin]')).toHaveCount(boards.find(board=>board.id===profile.id).pins.length);
  });
}

test('older search links that named the renderer type and repeated the board name still open the board',async({page})=>{
  const profile=profileNamed('BBC micro:bit V2');
  await page.goto(`./?q=${encodeURIComponent(profile.name)}&highlight=${encodeURIComponent(profile.name)}&lang=en#board=custom&profile=microbit-v2`);
  await expectBoard(page,profile);
  expect(new URL(page.url()).searchParams.has('q')).toBe(false);
  expect(new URL(page.url()).searchParams.has('highlight')).toBe(false);
});

test('a link that names only a profile opens it',async({page})=>{
  await page.goto('./?lang=en#profile=beaglebone-black');
  await expectBoard(page,profileNamed('BeagleBone Black'));
});

test('a real pin query on a board link still filters the pins',async({page})=>{
  await page.goto('./?q=SDA&lang=en#board=raspberry-pi-40&profile=raspberry-pi-4');
  await expect(page.locator('#board-title')).toHaveText('Raspberry Pi 4 Model B');
  await expect(page.locator('#pin-search')).toHaveValue('SDA');
});

test('a link naming an unknown board says so instead of opening the default board',async({page})=>{
  await page.goto('./?lang=en#board=custom&profile=no-such-board');
  await expect(page.locator('#app-status')).toBeHidden();
  await expect(page.locator('#home-view')).toBeVisible();
  await expect(page.locator('#workspace-view')).toBeHidden();
  await expect(page.locator('#link-notice')).toBeVisible();
  await expect(page.locator('#link-notice-text')).toContainText('“no-such-board”');
  await page.locator('#dismiss-link-notice').click();
  await expect(page.locator('#link-notice')).toBeHidden();

  await page.goto('./?lang=tr#board=no-such-layout');
  await expect(page.locator('#link-notice-text')).toContainText('“no-such-layout” Pin Atlas kataloğunda yok');
});

test('an unknown profile inside a known layout opens the layout and names what was missing',async({page})=>{
  await page.goto('./?lang=en#board=pico-family&profile=pico9');
  await expect(page.locator('#board-title')).toHaveText('Raspberry Pi Pico 2 W');
  await expect(page.locator('#link-notice-text')).toContainText('“pico9”');
  await expect(page.locator('#link-notice-text')).toContainText('Raspberry Pi Pico 2 W is shown instead');
  // Choosing another model is a new navigation; the notice does not follow it.
  await page.goto('./?lang=en#board=pico-family&profile=pico');
  await expect(page.locator('#board-title')).toHaveText('Raspberry Pi Pico');
  await expect(page.locator('#link-notice')).toBeHidden();
});

test('a board page is readable without the application and links into the atlas',async({page})=>{
  const profile=profileNamed('BBC micro:bit V2'),board=boards.find(item=>item.id===profile.id);
  await page.goto('./boards/microbit-v2/');
  await expect(page).toHaveTitle('BBC micro:bit V2 pinout — Pin Atlas');
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('BBC micro:bit V2 pinout');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://zaryob.github.io/pin-atlas/boards/microbit-v2/');
  await expect(page.locator('link[rel="alternate"][hreflang="tr"]')).toHaveAttribute('href','https://zaryob.github.io/pin-atlas/tr/boards/microbit-v2/');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content','https://zaryob.github.io/pin-atlas/boards/microbit-v2/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/BBC micro:bit V2 pinout: .*25 pins/);
  const data=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(data['@graph'].map(item=>item['@type'])).toEqual(['BreadcrumbList','TechArticle']);
  await expect(page.locator('.console-header')).toBeVisible();
  await expect(page.locator('table.static-pins tbody tr')).toHaveCount(board.pins.length);
  await expect(page.locator('#pin-1')).toContainText('RING.0');
  await expect(page.locator('#pin-1')).toContainText('AIN0');
  await expect(page.locator('.board-cautions li')).toHaveCount(board.cautions.length);
  await expect(page.locator('.board-cautions .note-sources a').first()).toHaveAttribute('href',/^https:\/\//);
  // The page never scrolls sideways, including the 390 px phone project.
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.getByRole('link',{name:/Open in the interactive atlas/}).click();
  await expectBoard(page,profile);
});

test('the Turkish edition is a separate page paired with the English one',async({page})=>{
  await page.goto('./tr/boards/raspberry-pi-4/');
  await expect(page.locator('html')).toHaveAttribute('lang','tr');
  await expect(page).toHaveTitle('Raspberry Pi 4 Model B pin haritası (pinout) — Pin Atlas');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://zaryob.github.io/pin-atlas/tr/boards/raspberry-pi-4/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href','https://zaryob.github.io/pin-atlas/boards/raspberry-pi-4/');
  await expect(page.locator('table.static-pins tbody tr')).toHaveCount(40);
  await page.locator('a.static-language').click();
  await expect(page).toHaveURL(/\/pin-atlas\/boards\/raspberry-pi-4\/$/);
  await expect(page.locator('h1')).toHaveText('Raspberry Pi 4 Model B pinout');
});

test('the index lists every profile and the application links to the static pages',async({page})=>{
  await page.goto('./boards/');
  await expect(page).toHaveTitle('Board and chip pinouts — Pin Atlas');
  await expect(page.locator('.static-index a')).toHaveCount(profiles.length);
  await page.locator('.static-index a',{hasText:/^BeagleBone Black$/}).click();
  await expect(page.locator('h1')).toHaveText('BeagleBone Black pinout');

  await page.goto('./?lang=en');
  await expect(page.locator('#app-status')).toBeHidden();
  await expect(page).toHaveTitle('Pin Atlas — Source-verified pinout guide');
  await expect(page.locator('#static-index-link')).toHaveAttribute('href',/\/pin-atlas\/boards\/$/);
  await page.goto('./?lang=en#board=beaglebone-black');
  await expect(page.locator('#board-title')).toHaveText('BeagleBone Black');
  await expect(page.locator('#static-page')).toHaveAttribute('href',/\/pin-atlas\/boards\/beaglebone-black\/$/);
  if(!await page.locator('#static-page').isVisible()) await page.locator('#board-documents > summary').click();
  await page.locator('#static-page').click();
  await expect(page.locator('h1')).toHaveText('BeagleBone Black pinout');
});

// Long words in the generated pages (Turkish compounds, chip lists, source file paths) must never push the page wider
// than a phone screen, at normal and at 200% text.
for(const lang of ['en','tr'])for(const width of [320,390])for(const large of [false,true]){
  test(`${lang} ${width}px${large?' with 200% text':''}: no static board page scrolls sideways`,async({page})=>{
    test.skip(page.viewportSize().width>640,'phone widths only');
    test.setTimeout(120000);
    await page.setViewportSize({width,height:844});
    const wide=[];
    for(const path of [...profiles.map(profile=>`boards/${profile.id}/`),'boards/']){
      await page.goto(`./${lang==='tr'?'tr/':''}${path}`);
      if(large)await page.addStyleTag({content:'html{font-size:200% !important}'});
      const size=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
      if(size.scroll>size.client)wide.push(`${path} ${size.scroll}>${size.client}`);
    }
    expect(wide).toEqual([]);
  });
}
