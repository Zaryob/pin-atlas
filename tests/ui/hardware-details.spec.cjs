const {test,expect}=require('@playwright/test');

test('technical reference follows profile selection and keeps exact memory variants separate',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('./?lang=en#board=pico-family&profile=pico');
  const details=page.locator('#hardware-details');
  await expect(details.locator('h2')).toContainText('Raspberry Pi Pico — technical details');
  await expect(details.locator('.research-facts')).toContainText('2 MB on-board QSPI Flash');
  await page.evaluate(()=>{location.hash='board=pico-family&profile=pico2';});
  await expect(details.locator('h2')).toContainText('Raspberry Pi Pico 2 — technical details');
  await expect(details.locator('.research-facts')).toContainText('4 MB on-board QSPI Flash');
  await expect(details.locator('.research-facts')).toContainText('520 KB SRAM');
  await expect(details.locator('.research-facts')).not.toContainText('264 KB SRAM');
  expect(errors).toEqual([]);
});

test('connection tables show contacts, MCU pads and working source links without page overflow',async({page})=>{
  await page.goto('./?lang=en#board=pico-family&profile=pico');
  const details=page.locator('#hardware-details');
  const uart=details.locator('.research-pin-group').filter({has:page.locator('summary',{hasText:'UART'})});
  await uart.locator('summary').click();
  const row=uart.locator('tbody tr').filter({hasText:'UART0 TX'}).first();
  await expect(row.locator('th')).toHaveText('1');
  await expect(row.locator('td').nth(1)).toHaveText('2');
  await expect(row.locator('a').first()).toHaveAttribute('href',/^https:\/\//);
  await expect(details.locator('.research-document-links a').first()).toHaveAttribute('href',/pico-datasheet/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const width=await uart.locator('.research-table-scroll').evaluate(el=>({client:el.clientWidth,scroll:el.scrollWidth}));
  expect(width.client).toBeLessThanOrEqual(await page.evaluate(()=>innerWidth));
});

test('Turkish research distinguishes unknown board dates from known MCU document dates',async({page})=>{
  await page.goto('./?lang=tr#board=nucleo-64&profile=nucleo-f401re');
  const details=page.locator('#hardware-details');
  await expect(details.locator('h2')).toContainText('teknik bilgiler');
  await expect(details.locator('.research-facts')).toContainText('Kesin model/revizyon için doğrulanamadı');
  await expect(details.locator('.research-facts')).toContainText('2014-01-16');
  await expect(details.locator('.research-facts')).toContainText('96 KB');
  await expect(details.locator('.research-facts')).toContainText('512 KB Flash');
});
