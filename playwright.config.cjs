const {defineConfig}=require('@playwright/test');

module.exports=defineConfig({
  testDir:'./tests/ui',
  fullyParallel:true,
  workers:2,
  timeout:45000,
  expect:{timeout:7000},
  forbidOnly:Boolean(process.env.CI),
  retries:0,
  reporter:[['list'],['html',{open:'never'}]],
  outputDir:'.cache/playwright-results',
  use:{
    baseURL:'http://127.0.0.1:4185/pin-atlas/',
    trace:'retain-on-failure',
    screenshot:'only-on-failure',
    launchOptions:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox']} : {}
  },
  projects:[
    {name:'desktop',use:{viewport:{width:1440,height:1000}}},
    {name:'mobile-dark',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true,colorScheme:'dark'}}
  ],
  webServer:{
    command:'python3 scripts/serve-built.py --port 4185 --base-path /pin-atlas',
    url:'http://127.0.0.1:4185/pin-atlas/',
    reuseExistingServer:!process.env.CI,
    timeout:15000
  }
});
