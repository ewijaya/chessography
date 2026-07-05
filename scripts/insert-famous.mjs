// One-shot integration: insert famousGame fields into the story files from a
// merged JSON array of {id,label,pgn}. For each game, find its story object by
// id and insert the famousGame property just before that object's closing
// `  },`. Idempotent-ish: skips any story that already has a famousGame.
// Run: node scripts/insert-famous.mjs merged.json
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const games = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const files = ['openings-e4.ts', 'openings-d4.ts', 'openings-flank.ts'].map((f) =>
  join(root, 'src', 'stories', f),
);

// Escape a story id for embedding in a single-quoted TS string literal.
const q = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
// Same escaping the story files use for ids in `id: '...'` — match by that.
const idLiteral = (id) => `id: ${q(id)},`;

const results = [];
for (const g of games) {
  let done = false;
  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n');
    const idLine = lines.findIndex((l) => l.trim() === idLiteral(g.id));
    if (idLine === -1) continue;
    // Find this object's closing brace: the next line that is exactly `  },`.
    let close = -1;
    for (let i = idLine + 1; i < lines.length; i++) {
      if (lines[i] === '  },') { close = i; break; }
      if (lines[i].trim() === idLiteral(g.id)) break; // safety: hit next entry
    }
    if (close === -1) { results.push(`NO-CLOSE ${g.id}`); done = true; break; }
    // Already has one? (scan the object body)
    if (lines.slice(idLine, close).some((l) => l.includes('famousGame:'))) {
      results.push(`SKIP(exists) ${g.id}`); done = true; break;
    }
    const block = [
      '    famousGame: {',
      `      label: ${q(g.label)},`,
      `      pgn: ${q(g.pgn)},`,
      '    },',
    ];
    lines.splice(close, 0, ...block);
    writeFileSync(file, lines.join('\n'));
    results.push(`OK ${g.id}  ->  ${file.split('/').pop()}`);
    done = true;
    break;
  }
  if (!done) results.push(`NOT-FOUND ${g.id}`);
}
for (const r of results) console.log(r);
