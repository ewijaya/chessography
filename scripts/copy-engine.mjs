// Copy the single-threaded lite Stockfish build from node_modules into
// public/engine so Vite serves it (dev) and bundles it (build). Single-thread
// build: no SharedArrayBuffer, so no COOP/COEP headers needed on Pages.
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules', 'stockfish', 'bin');
const dest = join(root, 'public', 'engine');

mkdirSync(dest, { recursive: true });
for (const f of ['stockfish-18-lite-single.js', 'stockfish-18-lite-single.wasm']) {
  copyFileSync(join(src, f), join(dest, f));
}
console.log('engine: copied stockfish-18-lite-single to public/engine');
