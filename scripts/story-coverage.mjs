// Story coverage report: which named lines lack an authored story, weighted
// by how many deeper lines would inherit from them. The output is the
// priority queue for story authoring.
// Run: node scripts/story-coverage.mjs [maxPly] [topN]
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const maxPly = Number(process.argv[2] ?? 8);
const topN = Number(process.argv[3] ?? 60);

// Authored story ids: regex the `id: '...'` lines out of the story files
// (they are TS modules; the id format is stable and single-quoted).
const storyDir = join(root, 'src', 'stories');
const authored = new Set();
for (const f of readdirSync(storyDir).filter((f) => f.startsWith('openings-'))) {
  const src = readFileSync(join(storyDir, f), 'utf8');
  for (const m of src.matchAll(/^\s+id: '((?:[^'\\]|\\.)*)'/gm)) {
    authored.add(m[1].replace(/\\'/g, "'"));
  }
}

// The book: name -> {eco, ply (shortest), descendants}
const book = JSON.parse(readFileSync(join(root, 'src', 'data', 'openings.json'), 'utf8'));
const byName = new Map();
for (const e of Object.values(book)) {
  const prev = byName.get(e.name);
  if (!prev || e.ply < prev.ply) byName.set(e.name, e);
}
const names = [...byName.values()];

// Weight: how many other names would inherit this one's story via the
// ancestor-prefix fallback ("A: B, C" inherits from "A: B" then "A").
const weight = new Map();
for (const n of names) {
  let rest = n.name;
  const ancestors = [];
  while (true) {
    const cut = Math.max(rest.lastIndexOf(','), rest.lastIndexOf(':'));
    if (cut === -1) break;
    rest = rest.slice(0, cut).trim();
    ancestors.push(rest);
  }
  // A name's story benefits itself plus every line inheriting from it —
  // but only until a more specific authored ancestor intercepts.
  for (const a of ancestors) {
    if (authored.has(n.name)) break; // already storied lines inherit nothing
    weight.set(a, (weight.get(a) ?? 0) + 1);
    if (authored.has(a)) break; // deeper inheritance stops at first storied ancestor
  }
}

const gaps = names
  .filter((n) => n.ply <= maxPly && !authored.has(n.name))
  .map((n) => ({ ...n, inheritors: weight.get(n.name) ?? 0 }))
  .sort((a, b) => b.inheritors - a.inheritors || a.ply - b.ply);

const covered = names.filter((n) => authored.has(n.name)).length;
console.log(`book: ${names.length} unique names · authored: ${authored.size} stories (${covered} names matched)`);
console.log(`gaps at ply<=${maxPly}: ${gaps.length} — top ${topN} by inheritance weight:\n`);
for (const g of gaps.slice(0, topN)) {
  console.log(
    `${String(g.inheritors).padStart(4)} inheritors  ply ${String(g.ply).padStart(2)}  ${g.eco}  ${g.name}`,
  );
}
