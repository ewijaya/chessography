import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
// Reach the Philidor story: 1.e4 e5 2.Nf3 d6
for (const [f, t] of [['e2','e4'],['e7','e5'],['g1','f3'],['d7','d6']]) {
  await page.click(`[data-square="${f}"]`); await page.waitForTimeout(120);
  await page.click(`[data-square="${t}"]`); await page.waitForTimeout(250);
}
const btn = await page.textContent('.play-famous');
console.log('button:', btn?.trim().slice(0, 60));
await page.click('.play-famous');
await page.waitForTimeout(500);
const status = await page.textContent('.game-status');
const sans = await page.$$eval('.scoresheet button.san', (els) => els.length);
console.log('status:', status?.trim().slice(0, 60));
console.log('plies loaded:', sans);
// step two moves in
await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
await page.waitForTimeout(300);
await page.screenshot({ path: '/home/ubuntu/screenshots/verify-famous.png' });
if (sans === 33 && status?.includes('starting position')) console.log('FAMOUS GAME OK');
await browser.close();
