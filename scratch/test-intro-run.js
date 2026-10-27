const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to MatematicasDeFedor_1.html...');
  await page.goto('http://localhost:3000/primero/MatematicasDeFedor_1.html', { waitUntil: 'domcontentloaded' });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1000);

  // Simulate user taking 14 seconds on the setup screen (which previously triggered autoSkipIntro bug)
  console.log('Simulating user waiting 14 seconds on setup screen to fill form...');
  await sleep(14000);

  // Check setup screen visible
  const isSetupVisible = await page.evaluate(() => {
    const s = document.getElementById('screen-setup');
    return s && s.classList.contains('active');
  });
  console.log('Setup screen visible:', isSetupVisible);

  // Type name and school
  await page.type('#f-name', 'Mateo');
  await page.type('#f-school', 'Colegio Espacial');

  console.log('Clicking "🚀 ¡Comenzar aventura!" button...');
  await page.click('.btn-launch');

  // Wait 1.2s for transition to begin and animation to show
  await sleep(1200);

  // Check if #fedor1IntroBG is shown
  const introStatus = await page.evaluate(() => {
    const bg = document.getElementById('fedor1IntroBG');
    const cap = document.getElementById('f1IntroCap');
    const stage = document.getElementById('f1IntroStage');
    return {
      bgExists: !!bg,
      bgHasOnClass: bg ? bg.classList.contains('on') : false,
      bgDisplay: bg ? window.getComputedStyle(bg).display : null,
      bgOpacity: bg ? window.getComputedStyle(bg).opacity : null,
      bgZIndex: bg ? window.getComputedStyle(bg).zIndex : null,
      capText: cap ? cap.textContent : null,
      stageHtmlSample: stage ? stage.innerHTML.slice(0, 300) : null,
      activeScreen: document.querySelector('.screen.active')?.id,
    };
  });
  console.log('Intro status after enterBook:', introStatus);

  const screenshotPath = path.join(__dirname, 'screenshots', 'animacion_primero_verificada.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  // Also test clicking "⏭ Saltar"
  console.log('Testing "⏭ Saltar" button...');
  await page.click('#f1IntroSkip');
  await sleep(1000);

  const afterSkipStatus = await page.evaluate(() => {
    const bg = document.getElementById('fedor1IntroBG');
    return {
      bgDisplay: bg ? window.getComputedStyle(bg).display : null,
      activeScreen: document.querySelector('.screen.active')?.id,
      heroName: document.getElementById('heroName')?.textContent
    };
  });
  console.log('Status after clicking Saltar:', afterSkipStatus);

  await browser.close();
  console.log('All tests passed successfully!');
})();
