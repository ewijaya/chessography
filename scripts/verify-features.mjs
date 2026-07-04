// E2E verification of: click-to-move hints, Stockfish opponent, theme toggle.
// Run: node scripts/verify-features.mjs   (needs `vite preview --port 4173` up)
import { chromium } from 'playwright-core';

const shot = (name) => `/home/ubuntu/screenshots/${name}.png`;
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium-browser',
  args: ['--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const fail = (msg) => {
  console.error('FAIL:', msg);
  process.exitCode = 1;
};

await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

// --- 1. click-to-move hints (two-player mode) ---
await page.click('[data-square="e2"]');
await page.waitForTimeout(200);
const hintCount = await page.evaluate(() => {
  return [...document.querySelectorAll('[data-square], [data-square] *')].filter((el) =>
    el instanceof HTMLElement && el.style.backgroundImage.includes('radial-gradient')
  ).length;
});
hintCount === 2 ? console.log('OK: e2 pawn shows 2 hint dots (e3, e4)') : fail(`expected 2 hint dots, got ${hintCount}`);
await page.screenshot({ path: shot('verify-hints') });

await page.click('[data-square="e4"]');
await page.waitForTimeout(300);
const san1 = await page.textContent('.scoresheet');
san1?.includes('e4') ? console.log('OK: click-to-move played 1. e4') : fail(`scoresheet after click-move: ${san1}`);

// --- 2. Stockfish opponent ---
await page.click('text=Play White vs');
await page.waitForTimeout(300);
await page.click('[data-square="e2"]');
await page.waitForTimeout(150);
await page.click('[data-square="e4"]');
// engine should reply as black within a few seconds
await page.waitForFunction(
  () => {
    const sans = [...document.querySelectorAll('.scoresheet .san')];
    return sans.length >= 2;
  },
  { timeout: 15000 }
);
const sheet = await page.textContent('.scoresheet');
console.log('OK: engine replied — scoresheet:', sheet?.trim());
await page.screenshot({ path: shot('verify-engine') });

// --- 3. theme toggle ---
const before = await page.evaluate(() => document.documentElement.dataset.theme);
await page.click('.theme-toggle');
await page.waitForTimeout(200);
const after = await page.evaluate(() => document.documentElement.dataset.theme);
const stored = await page.evaluate(() => localStorage.getItem('chessography-theme'));
before !== after && stored === after
  ? console.log(`OK: theme toggled ${before} → ${after}, persisted`)
  : fail(`theme toggle: before=${before} after=${after} stored=${stored}`);
await page.screenshot({ path: shot('verify-theme') });

await browser.close();
console.log(process.exitCode ? 'VERIFICATION FAILED' : 'ALL FEATURES VERIFIED');
