// E2E verification of the full feature set: click-to-move hints, Stockfish
// opponent, theme toggle, promotion picker, move navigation, eval bar,
// last-move highlight, PGN import, atlas explorer, sound toggle, lazy book.
// Run: node scripts/verify-features.mjs   (needs `vite preview --port 4173` up)
import { chromium } from 'playwright-core';

const shot = (name) => `/home/ubuntu/screenshots/${name}.png`;
const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium-browser',
  args: ['--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });
let failures = 0;
const fail = (msg) => {
  console.error('FAIL:', msg);
  failures++;
};
const ok = (msg) => console.log('OK:', msg);

await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

// --- lazy opening book loads ---
await page.waitForFunction(() => document.querySelector('.footer')?.textContent?.includes('3,732'), { timeout: 10000 });
ok('lazy book loaded (footer shows 3,732 named positions)');

// --- click-to-move hints ---
await page.click('[data-square="e2"]');
await page.waitForTimeout(200);
const hintCount = await page.evaluate(
  () =>
    [...document.querySelectorAll('[data-square], [data-square] *')].filter(
      (el) => el instanceof HTMLElement && el.style.backgroundImage.includes('radial-gradient'),
    ).length,
);
hintCount === 2 ? ok('e2 pawn shows 2 hint dots (e3, e4)') : fail(`expected 2 hint dots, got ${hintCount}`);

await page.click('[data-square="e4"]');
await page.waitForTimeout(300);
(await page.textContent('.scoresheet'))?.includes('e4') ? ok('click-to-move played 1. e4') : fail('1. e4 missing from scoresheet');

// --- last-move highlight ---
const litSquares = await page.evaluate(
  () =>
    [...document.querySelectorAll('[data-square], [data-square] *')].filter(
      (el) => el instanceof HTMLElement && el.style.backgroundColor.includes('212, 172, 60'),
    ).length,
);
litSquares >= 2 ? ok('last move (e2→e4) is highlighted') : fail(`expected 2 highlighted squares, got ${litSquares}`);

// --- eval bar present and produces a number ---
await page.waitForFunction(
  () => {
    const l = document.querySelector('.eval-label')?.textContent ?? '';
    return l !== '' && l !== '·';
  },
  { timeout: 20000 },
);
ok(`eval bar live (reads ${await page.textContent('.eval-label')})`);

// --- move navigation: play 1...e5, then step back ---
await page.click('[data-square="e7"]');
await page.waitForTimeout(150);
await page.click('[data-square="e5"]');
await page.waitForTimeout(300);
await page.keyboard.press('ArrowLeft');
await page.waitForTimeout(200);
(await page.textContent('.game-status'))?.includes('Viewing') ? ok('ArrowLeft enters viewing mode') : fail('no Viewing status after ArrowLeft');
// board must show the position after 1.e4 only: e5 empty again
const e5HasPiece = await page.evaluate(() => Boolean(document.querySelector('[data-square="e5"] [draggable], [data-square="e5"] svg')));
!e5HasPiece ? ok('board rewound (e5 empty at ply 1)') : fail('board did not rewind');
await page.keyboard.press('End');
await page.waitForTimeout(200);
// click the first scoresheet move
await page.click('.scoresheet button.san');
await page.waitForTimeout(200);
(await page.textContent('.game-status'))?.includes('Viewing') ? ok('clicking a scoresheet move navigates') : fail('scoresheet click did not navigate');
await page.keyboard.press('End');
await page.waitForTimeout(200);

// --- sound toggle ---
await page.click('button[aria-label="mute sounds"]');
(await page.$('button[aria-label="unmute sounds"]')) ? ok('sound toggle mutes/persists label') : fail('sound toggle broken');

// --- PGN import + promotion picker (underpromotion!) ---
await page.click('text=Import PGN');
await page.fill('.pgn-import textarea', '1. e4 d5 2. exd5 c6 3. dxc6 Qd7 4. cxb7 Qd8');
await page.click('text=Load game');
await page.waitForTimeout(400);
(await page.textContent('.scoresheet'))?.includes('cxb7') ? ok('PGN imported (pawn poised on b7)') : fail('PGN import failed');
await page.click('[data-square="b7"]');
await page.waitForTimeout(150);
await page.click('[data-square="a8"]');
await page.waitForTimeout(300);
(await page.$('.promo-picker')) ? ok('promotion picker opened') : fail('no promotion picker');
await page.screenshot({ path: shot('verify-promo') });
await page.click('button[aria-label="promote to n"]');
await page.waitForTimeout(300);
(await page.textContent('.scoresheet'))?.includes('bxa8=N') ? ok('underpromotion to knight recorded (bxa8=N)') : fail('bxa8=N missing');

// --- atlas explorer ---
await page.click('summary:has-text("Browse the opening atlas")');
await page.fill('.atlas-search', 'najdorf');
await page.waitForTimeout(300);
await page.click('.atlas-row');
await page.waitForTimeout(500);
const panel = await page.textContent('.page');
panel?.toLowerCase().includes('najdorf') ? ok('atlas line loaded — story panel shows Najdorf') : fail(`atlas load: panel says ${panel?.slice(0, 80)}`);
await page.screenshot({ path: shot('verify-atlas') });

// --- French chain structure ---
await page.click('text=Import PGN');
await page.fill('.pgn-import textarea', '1. e4 e6 2. d4 d5 3. e5');
await page.click('text=Load game');
await page.waitForTimeout(400);
await page.click('.tabs button:has-text("structure")');
await page.waitForTimeout(200);
(await page.textContent('.page'))?.includes('French Pawn Chain') ? ok('French chain recognized with story') : fail('French chain missing');

// --- Stockfish opponent ---
await page.click('text=Play White vs');
await page.waitForTimeout(300);
await page.click('[data-square="e2"]');
await page.waitForTimeout(150);
await page.click('[data-square="e4"]');
await page.waitForFunction(() => document.querySelectorAll('.scoresheet button.san').length >= 2, { timeout: 20000 });
ok(`engine replied — ${(await page.textContent('.scoresheet'))?.trim()}`);

// --- theme toggle ---
const before = await page.evaluate(() => document.documentElement.dataset.theme);
await page.click('.theme-toggle');
await page.waitForTimeout(200);
const after = await page.evaluate(() => document.documentElement.dataset.theme);
const stored = await page.evaluate(() => localStorage.getItem('chessography-theme'));
before !== after && stored === after ? ok(`theme toggled ${before} → ${after}, persisted`) : fail('theme toggle broken');
await page.screenshot({ path: shot('verify-all-features') });

await browser.close();
if (failures) {
  console.error(`VERIFICATION FAILED (${failures})`);
  process.exit(1);
}
console.log('ALL FEATURES VERIFIED');
