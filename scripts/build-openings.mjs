// Build src/data/openings.json from the lichess chess-openings TSVs (CC0).
// Each named line is replayed with chess.js; the resulting position (FEN fields
// 1-3) becomes the lookup key so transpositions resolve to the same name.
import { Chess } from 'chess.js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['a', 'b', 'c', 'd', 'e'].map((f) => join(root, 'data', `${f}.tsv`));

const byKey = {};
let rows = 0;
let skipped = 0;

for (const file of files) {
  const lines = readFileSync(file, 'utf8').trim().split('\n').slice(1); // drop header
  for (const line of lines) {
    const [eco, name, pgn] = line.split('\t');
    if (!eco || !name || !pgn) continue;
    rows++;
    const sans = pgn.split(/\s+/).filter((t) => !/^\d+\.$/.test(t));
    const chess = new Chess();
    try {
      for (const san of sans) chess.move(san);
    } catch (e) {
      skipped++;
      console.error(`SKIP ${eco} ${name}: ${e.message}`);
      continue;
    }
    const key = chess.fen().split(' ').slice(0, 3).join(' ');
    // Later rows overwrite earlier ones on key collision; the dataset orders
    // more specific lines later, so this keeps the most specific name.
    byKey[key] = { eco, name, pgn, ply: sans.length };
  }
}

mkdirSync(join(root, 'src', 'data'), { recursive: true });
const out = join(root, 'src', 'data', 'openings.json');
writeFileSync(out, JSON.stringify(byKey));
console.log(`rows=${rows} skipped=${skipped} uniquePositions=${Object.keys(byKey).length} -> ${out}`);
