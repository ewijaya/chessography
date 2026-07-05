// Independent re-verification of collected famousGame PGNs before integration.
// Reads a JSON array of {id,label,pgn} from the path in argv[2] and checks
// each against chess.js + the opening book — legality, length, and that the
// game actually walks through its own named line. Never trust the authoring
// agent's self-report; re-check here.
// Run: node scripts/verify-famous-batch.mjs games.json
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Chess } from 'chess.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const games = JSON.parse(readFileSync(process.argv[2], 'utf8'));

// Book: positionKey -> entry.name, matching src/lib/openings.ts positionKey.
const book = JSON.parse(readFileSync(join(root, 'src', 'data', 'openings.json'), 'utf8'));
const positionKey = (fen) => fen.split(' ').slice(0, 3).join(' ');
const nameAt = (fen) => book[positionKey(fen)]?.name;

// Authored opening story ids, regexed from the story files (same id format the
// files use). This is the set getOpeningStory can resolve to.
const authoredIds = new Set();
for (const f of ['openings-e4.ts', 'openings-d4.ts', 'openings-flank.ts']) {
  const src = readFileSync(join(root, 'src', 'stories', f), 'utf8');
  for (const m of src.matchAll(/^\s+id: '((?:[^'\\]|\\.)*)',/gm)) authoredIds.add(m[1].replace(/\\'/g, "'"));
}

// "A: B, C" -> ["A: B", "A"] — name prefixes, most to least specific.
// Mirrors ancestorNames() in src/stories/index.ts.
function ancestorNames(name) {
  const out = [];
  let rest = name;
  for (;;) {
    const cut = Math.max(rest.lastIndexOf(','), rest.lastIndexOf(':'));
    if (cut === -1) break;
    rest = rest.slice(0, cut).trim();
    out.push(rest);
  }
  return out;
}

// Faithful port of getOpeningStory: walk lineage deepest-first, and for each
// entry try its name then its ancestor-prefixes; first authored hit wins.
function resolveStory(lineageNames) {
  for (let i = lineageNames.length - 1; i >= 0; i--) {
    for (const n of [lineageNames[i], ...ancestorNames(lineageNames[i])]) {
      if (authoredIds.has(n)) return n;
    }
  }
  return null;
}

let ok = 0;
const fails = [];
for (const g of games) {
  const problems = [];
  const chess = new Chess();
  try {
    chess.loadPgn(g.pgn);
  } catch (e) {
    fails.push({ id: g.id, why: `loadPgn threw: ${e.message}` });
    continue;
  }
  const sans = chess.history();
  if (sans.length < 20) problems.push(`only ${sans.length} plies`);

  // Replay and build the ordered, deduped lineage (as matchOpening does):
  // every named book position in order, collapsing consecutive repeats.
  const replay = new Chess();
  const lineageNames = [];
  for (const san of sans) {
    replay.move(san);
    const n = nameAt(replay.fen());
    if (n && lineageNames[lineageNames.length - 1] !== n) lineageNames.push(n);
  }
  // Resolve the story exactly as the app's getOpeningStory does: deepest-first,
  // longest storied prefix wins. The game must RESOLVE to g.id — merely
  // touching it early then transposing into a sibling line is NOT enough
  // (the Giuoco Piano trap: sibling "Classical Variation" outranks it).
  const resolved = resolveStory(lineageNames);
  if (resolved !== g.id) {
    problems.push(`resolves to "${resolved ?? 'no story'}" not "${g.id}" (deepest: ${lineageNames.slice(-2).join(' | ') || 'none'})`);
  }

  if (problems.length) fails.push({ id: g.id, why: problems.join('; ') });
  else {
    ok++;
    console.log(`OK   ${g.id}  ·  ${sans.length} plies  ·  mate=${chess.isCheckmate()}  ·  ${g.label}`);
  }
}

console.log(`\n${ok}/${games.length} verified.`);
if (fails.length) {
  console.log('\nFAILURES:');
  for (const f of fails) console.log(`  ✗ ${f.id}: ${f.why}`);
  process.exit(1);
}
