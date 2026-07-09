// Generate the PWA icons (public/icon-{512,192,180}.png) by rendering the
// knight-on-felt mark in headless chromium. Rerun only when the design
// changes; outputs are committed.
import { chromium } from 'playwright-core';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const html = (size) => `<!doctype html>
<html><head><style>
  * { margin: 0; padding: 0; }
  body { width: ${size}px; height: ${size}px; overflow: hidden; }
  .icon {
    width: ${size}px; height: ${size}px;
    background: radial-gradient(circle at 50% 32%, #24382c 0%, #122018 78%);
    display: flex; align-items: center; justify-content: center;
  }
  /* ~60% glyph leaves the maskable safe zone intact */
  .knight { font-size: ${Math.round(size * 0.62)}px; line-height: 1; color: #b3873e;
    font-family: Georgia, 'Times New Roman', serif;
    text-shadow: 0 ${Math.round(size * 0.02)}px ${Math.round(size * 0.05)}px rgba(0,0,0,0.55); }
</style></head>
<body><div class="icon"><span class="knight">&#9822;</span></div></body></html>`;

const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
});

for (const size of [512, 192, 180]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(html(size));
  await page.waitForTimeout(150);
  const out = join(root, 'public', `icon-${size}.png`);
  await page.screenshot({ path: out });
  console.log('wrote', out);
  await page.close();
}

await browser.close();
