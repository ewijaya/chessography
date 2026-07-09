// E2E verification of the five new features: named-tactic recognition,
// shareable game links, the game importer UI, the opening trainer, and the
// static story atlas. Run: node scripts/verify-new-features.mjs
// (needs `vite preview --port 4173` up, serving a fresh dist)
import { chromium } from 'playwright-core';

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

// --- share links: a game rides in the URL fragment ---
// Ruy Lopez mainline, encoded exactly as share.ts does.
const payload = Buffer.from('e4 e5 Nf3 Nc6 Bb5').toString('base64url');
await page.goto(`http://localhost:4173/#g=${payload}`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.querySelector('.footer')?.textContent?.includes('3,732'), { timeout: 10000 });
(await page.textContent('.scoresheet'))?.includes('Bb5')
  ? ok('share link decoded onto the scoresheet')
  : fail('share link: Bb5 missing from scoresheet');
// Rewound to the start for stepping through.
(await page.textContent('.game-status'))?.includes('starting position')
  ? ok('shared game arrives rewound to the start')
  : fail('shared game did not arrive rewound');
// Step to the end: the story should be the Ruy Lopez.
await page.keyboard.press('End');
await page.waitForTimeout(300);
(await page.textContent('.page'))?.includes('Ruy Lopez')
  ? ok('shared game resolves its story (Ruy Lopez)')
  : fail('shared game story missing');

// --- share button exists and is enabled with moves on the board ---
const shareBtn = page.locator('button:has-text("Share")');
(await shareBtn.isEnabled()) ? ok('Share button enabled for a live game') : fail('Share button disabled');

// --- named tactics: preset mate positions resolve to their stories ---
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.querySelector('.footer')?.textContent?.includes('3,732'), { timeout: 10000 });
await page.click('summary:has-text("Visit a famous position")');
await page.click('button.preset:has-text("Smothered mate")');
await page.waitForTimeout(400);
const smothered = await page.textContent('.page');
smothered?.includes('Smothered Mate') && smothered?.includes('TACTIC')
  ? ok('smothered mate preset → TACTIC story page')
  : fail('smothered mate story missing');
smothered?.includes('Lucena') === false || ok('(story text sanity)');

await page.click('button.preset:has-text("Boden")');
await page.waitForTimeout(400);
(await page.textContent('.page'))?.includes('Boden')
  ? ok('Boden’s mate preset → story page')
  : fail('Boden story missing');

// Greek gift arrives via moves, so the tactic needs the last move.
await page.click('button.preset:has-text("Greek Gift")');
await page.waitForTimeout(400);
(await page.textContent('.page'))?.includes('Greek Gift')
  ? ok('Greek Gift preset → story page')
  : fail('Greek Gift story missing');

// --- postmortem journey shows the tactic milestone after a real mate ---
await page.click('text=Two players');
for (const sq of [
  ['e2', 'e4'], ['e7', 'e5'], ['d1', 'h5'], ['b8', 'c6'], ['f1', 'c4'], ['g8', 'f6'], ['h5', 'f7'],
]) {
  await page.click(`[data-square="${sq[0]}"]`);
  await page.waitForTimeout(120);
  await page.click(`[data-square="${sq[1]}"]`);
  await page.waitForTimeout(120);
}
const pm = await page.textContent('.postmortem').catch(() => null);
pm?.includes('Checkmate') ? ok('scholar’s mate reaches the postmortem') : fail('postmortem missing after mate');

// --- opening trainer: deck lists storied lines, drill starts ---
await page.click('.trainer summary');
await page.waitForTimeout(200);
const trainerText = await page.textContent('.trainer');
trainerText?.includes('Ruy Lopez') ? ok('trainer deck lists storied lines') : fail('trainer deck empty');
await page.click('.trainer-next');
await page.waitForTimeout(300);
(await page.textContent('.drill-card'))?.includes('Move 1 of')
  ? ok('drill card active, awaiting recitation')
  : fail('drill card missing');
// A wrong move is rejected and counted.
await page.click('[data-square="a2"]');
await page.waitForTimeout(120);
await page.click('[data-square="a4"]');
await page.waitForTimeout(200);
(await page.textContent('.drill-card'))?.includes('slip')
  ? ok('wrong recitation move rejected and counted as a slip')
  : fail('wrong move not counted');
(await page.textContent('.scoresheet'))?.includes('a4')
  ? fail('wrong move leaked onto the board')
  : ok('wrong move never touched the board');

// --- game importer UI present ---
await page.click('.importer summary');
(await page.isVisible('.importer-user')) ? ok('game importer form renders') : fail('importer form missing');

// --- help sheet ---
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.querySelector('.footer')?.textContent?.includes('3,732'), { timeout: 10000 });
await page.click('.help-toggle');
await page.waitForSelector('.help-sheet');
(await page.textContent('.help-sheet'))?.includes('What gets recognized')
  ? ok('help sheet opens with content')
  : fail('help sheet content missing');
await page.keyboard.press('Escape');
await page.waitForTimeout(200);
!(await page.$('.help-sheet')) ? ok('Escape closes the help sheet') : fail('help sheet did not close');

// --- about page ---
const aboutRes = await page.goto('http://localhost:4173/about/', { waitUntil: 'domcontentloaded' });
aboutRes?.ok() ? ok('about page serves') : fail(`about page HTTP ${aboutRes?.status()}`);
(await page.textContent('main'))?.includes('Credits') ? ok('about page carries content') : fail('about content missing');

// --- static story atlas pages ---
const atlas = await page.goto('http://localhost:4173/atlas/', { waitUntil: 'domcontentloaded' });
atlas?.ok() ? ok('atlas index serves') : fail(`atlas index HTTP ${atlas?.status()}`);
(await page.textContent('main'))?.includes('Ruy Lopez') ? ok('atlas index lists stories') : fail('atlas index empty');
const ruy = await page.goto('http://localhost:4173/atlas/ruy-lopez/', { waitUntil: 'domcontentloaded' });
ruy?.ok() ? ok('story page serves') : fail(`story page HTTP ${ruy?.status()}`);
const ruyText = await page.textContent('main');
ruyText?.includes('1561') ? ok('story page carries the authored story') : fail('story page content missing');
// The CTA puts the line on the board.
await page.click('.cta');
await page.waitForFunction(() => document.querySelector('.footer')?.textContent?.includes('3,732'), { timeout: 10000 });
await page.keyboard.press('End');
await page.waitForTimeout(300);
(await page.textContent('.page'))?.includes('Ruy Lopez')
  ? ok('atlas CTA opens the line on the board with its story')
  : fail('atlas CTA did not load the line');

await browser.close();
console.log(failures === 0 ? '\nALL NEW-FEATURE CHECKS PASSED' : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
