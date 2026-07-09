// Generate static, indexable story pages into dist/atlas/ after the vite
// build. Every authored story (openings, structures, endgames, tactics)
// becomes a real HTML page — the app itself is a SPA with nothing for a
// search engine to read, and these pages are what people actually search
// for ("why is it called the Ruy Lopez"). Each page links back into the
// app via a share-link fragment that puts the line on the board.
//
// The story sources are TypeScript, so they are transpiled on the fly with
// the typescript package (a devDependency) into a scratch dir and imported
// from there — no ts-node, no extra deps, works on any Node the build uses.
import ts from 'typescript';
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE = 'https://chessography.pages.dev';

if (!existsSync(dist)) {
  console.error('dist/ not found — run the vite build first');
  process.exit(1);
}

// ---------- transpile the story modules and import them ----------

const scratch = join(dist, '.stories-tmp');
mkdirSync(scratch, { recursive: true });

const MODULES = [
  'src/stories/index.ts',
  'src/stories/openings-e4.ts',
  'src/stories/openings-d4.ts',
  'src/stories/openings-flank.ts',
  'src/stories/generated.ts',
  'src/stories/patterns.ts',
  'src/stories/tactics.ts',
  'src/lib/share.ts',
  'src/lib/presets.ts',
  'src/lib/meta.ts',
];

for (const rel of MODULES) {
  const source = readFileSync(join(root, rel), 'utf8');
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  });
  // Node ESM needs explicit extensions; the sources use bundler-style
  // specifiers. All story-module imports are flattened into one dir.
  outputText = outputText.replace(/from\s+'[./]+([\w-]+)'/g, "from './$1.mjs'");
  const flat = rel.split('/').pop().replace(/\.ts$/, '.mjs');
  writeFileSync(join(scratch, flat), outputText);
}

const stories = await import(pathToFileURL(join(scratch, 'index.mjs')).href);
const { structureStories, endgameStories } = await import(pathToFileURL(join(scratch, 'patterns.mjs')).href);
const { tacticStories } = await import(pathToFileURL(join(scratch, 'tactics.mjs')).href);
const { encodeGame } = await import(pathToFileURL(join(scratch, 'share.mjs')).href);
const { presets } = await import(pathToFileURL(join(scratch, 'presets.mjs')).href);
const { COPYRIGHT } = await import(pathToFileURL(join(scratch, 'meta.mjs')).href);

const book = JSON.parse(readFileSync(join(root, 'src', 'data', 'openings.json'), 'utf8'));

// ---------- resolve each story to a slug, kind and board link ----------

const slugify = (name) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const sansOfPgn = (pgn) => pgn.split(/\s+/).filter((t) => !/^\d+\.$/.test(t));

/** Mainline (shortest) atlas entry for an exact dataset name. */
const entryOf = (name) => {
  let best = null;
  for (const e of Object.values(book)) {
    if (e.name === name && (!best || e.ply < best.ply)) best = e;
  }
  return best;
};

// Pattern stories have no move sequence of their own; borrow the demo
// preset so "play it on the board" works for them too.
const PRESET_OF = {
  iqp: 'Isolated', carlsbad: 'Carlsbad', 'maroczy-bind': 'Maróczy', hedgehog: 'Hedgehog',
  stonewall: 'Stonewall Attack', lucena: 'Lucena', philidor: 'Philidor',
  'kp-opposition': 'Opposition', 'wrong-rook-pawn': 'Wrong rook', 'kbn-mate': 'Bishop & knight',
  'smothered-mate': 'Smothered', 'back-rank-mate': 'Back-rank', 'anastasia-mate': 'Anastasia',
  'arabian-mate': 'Arabian', 'boden-mate': 'Boden', 'epaulette-mate': 'Epaulette',
  'greek-gift': 'Greek Gift',
};

const boardHashOf = (story, kind) => {
  if (kind === 'opening') {
    const entry = entryOf(story.id);
    return entry ? encodeGame({ sans: sansOfPgn(entry.pgn) }) : null;
  }
  const label = PRESET_OF[story.id];
  const preset = label && presets.find((p) => p.label.includes(label));
  if (!preset) return null;
  return preset.moves ? encodeGame({ sans: preset.moves }) : encodeGame({ sans: [], startFen: preset.fen });
};

const KINDS = [
  { kind: 'opening', title: 'Openings', eyebrow: (s) => entryOf(s.id)?.eco ?? 'OPENING', list: stories.allOpeningStories },
  { kind: 'structure', title: 'Pawn structures', eyebrow: () => 'PATTERN', list: structureStories },
  { kind: 'endgame', title: 'Endgames', eyebrow: () => 'ENDGAME', list: endgameStories },
  { kind: 'tactic', title: 'Named mates & tactics', eyebrow: () => 'TACTIC', list: tacticStories },
];

// ---------- render ----------

const esc = (s) =>
  String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const CSS = `
:root{--paper:#f0e8d4;--ink:#2b2418;--ink-soft:#5c5140;--brass:#8a6425;--stamp:#99392b}
*{box-sizing:border-box}body{margin:0;background:#1b2c22;font-family:'Literata',Georgia,serif;color:var(--ink);
-webkit-font-smoothing:antialiased}
main{max-width:680px;margin:32px auto;background:var(--paper);padding:40px 44px;border-radius:3px;
box-shadow:0 10px 30px rgba(0,0,0,.45)}
.eyebrow{font-family:'IBM Plex Mono',monospace;font-size:.66rem;text-transform:uppercase;letter-spacing:.18em;
color:var(--ink-soft);display:flex;gap:8px;align-items:center;margin-bottom:14px}
.eco{border:1px solid var(--stamp);color:var(--stamp);border-radius:2px;padding:1px 6px}
h1{font-family:'Fraunces',Georgia,serif;font-size:1.9rem;margin:0 0 6px;line-height:1.15}
.aka{font-style:italic;color:var(--ink-soft);font-size:.85rem;margin:0 0 20px}
.moves{font-family:'IBM Plex Mono',monospace;font-size:.8rem;color:var(--ink-soft);margin:0 0 22px;
border-top:1px solid rgba(92,81,64,.3);border-bottom:1px solid rgba(92,81,64,.3);padding:9px 0}
h2{font-family:'IBM Plex Mono',monospace;font-size:.66rem;font-weight:600;text-transform:uppercase;
letter-spacing:.18em;color:var(--ink-soft);margin:20px 0 4px}
p,li{font-size:.95rem;line-height:1.62;margin:6px 0}
ul{padding-left:20px}
.cta{display:inline-block;margin-top:26px;font-family:'IBM Plex Mono',monospace;font-size:.82rem;
color:var(--paper);background:var(--ink);padding:10px 16px;border-radius:3px;text-decoration:none}
.cta:hover{background:var(--brass)}
nav{font-family:'IBM Plex Mono',monospace;font-size:.72rem;margin-bottom:26px}
nav a{color:var(--brass);text-decoration:none}
.idx a{color:var(--ink);text-decoration:none;border-bottom:1px dotted var(--brass)}
.idx li{margin:4px 0}
footer{margin-top:34px;border-top:1px solid rgba(92,81,64,.3);padding-top:12px;
font-family:'IBM Plex Mono',monospace;font-size:.68rem;color:var(--ink-soft)}
footer a{color:var(--brass)}
@media(max-width:720px){main{margin:0;padding:26px 20px;border-radius:0}}
`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Literata:opsz,wght@7..72,400;7..72,600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">`;

const shell = (title, description, path, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE}${path}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${SITE}${path}">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='0.9em' font-size='90'%3E%E2%99%9E%3C/text%3E%3C/svg%3E">
${FONTS}
<style>${CSS}</style>
</head>
<body>
<main>
<nav><a href="/">♞ Chessography</a> · <a href="/atlas/">the story atlas</a> · <a href="/about/">about</a></nav>
${body}
<footer>Chessography — every named move carries a story. Openings from the <a href="https://github.com/lichess-org/chess-openings">lichess opening atlas</a> (CC0).<br>${esc(COPYRIGHT)}</footer>
</main>
</body>
</html>
`;

const truncate = (s, n = 155) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');

// Opening story ids ARE the display name; pattern ids are detector slugs,
// so their first alias carries the display name.
const displayName = (story, kind) => (kind === 'opening' ? story.id : (story.aliases?.[0] ?? story.id));
const alsoKnown = (story, kind) => (kind === 'opening' ? story.aliases : story.aliases?.slice(1)) ?? [];

const storyBody = (story, kind, eyebrow) => {
  const entry = kind.kind === 'opening' ? entryOf(story.id) : null;
  const hash = boardHashOf(story, kind.kind);
  const aka = alsoKnown(story, kind.kind);
  return `
<div class="eyebrow"><span class="eco">${esc(eyebrow)}</span><span>${esc(kind.title)} · the story behind the name</span></div>
<h1>${esc(displayName(story, kind.kind))}</h1>
${aka.length ? `<p class="aka">also known as: ${esc(aka.join(' · '))}</p>` : ''}
${entry ? `<p class="moves">${esc(entry.pgn)}</p>` : ''}
<h2>Named after</h2><p>${esc(story.eponym)}</p>
<h2>Origin</h2><p>${esc(story.origin)}</p>
<h2>The story</h2><p>${esc(story.story)}</p>
<h2>Why it matters</h2><p>${esc(story.significance)}</p>
${story.notableGames?.length ? `<h2>Notable games</h2><ul>${story.notableGames.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>` : ''}
${hash ? `<a class="cta" href="/${hash}">▶ Play this on the board</a>` : `<a class="cta" href="/">▶ Open the board</a>`}
`;
};

// ---------- write everything ----------

const urls = [`${SITE}/`, `${SITE}/atlas/`, `${SITE}/about/`];
let pages = 0;
const indexSections = [];

for (const kind of KINDS) {
  const items = [];
  for (const story of kind.list) {
    const slug = slugify(story.id);
    const path = `/atlas/${slug}/`;
    const dir = join(dist, 'atlas', slug);
    mkdirSync(dir, { recursive: true });
    const title = `${displayName(story, kind.kind)} — the story behind the name · Chessography`;
    const description = truncate(story.significance);
    writeFileSync(join(dir, 'index.html'), shell(title, description, path, storyBody(story, kind, kind.eyebrow(story))));
    urls.push(`${SITE}${path}`);
    items.push({ slug, name: displayName(story, kind.kind), eco: kind.kind === 'opening' ? (entryOf(story.id)?.eco ?? '') : '' });
    pages++;
  }
  items.sort((a, b) => a.eco.localeCompare(b.eco) || a.name.localeCompare(b.name));
  indexSections.push(
    `<h2>${esc(kind.title)}</h2><ul class="idx">${items
      .map((i) => `<li>${i.eco ? `${esc(i.eco)} · ` : ''}<a href="/atlas/${i.slug}/">${esc(i.name)}</a></li>`)
      .join('')}</ul>`,
  );
}

writeFileSync(
  join(dist, 'atlas', 'index.html'),
  shell(
    'The Story Atlas — every named move carries a story · Chessography',
    'The stories behind chess names: who the openings honour, where the pawn structures were mapped, why the endgames and mates are called what they are.',
    '/atlas/',
    `<div class="eyebrow"><span class="eco">ATLAS</span><span>the full collection</span></div>
<h1>The Story Atlas</h1>
<p>Every name on the chessboard was put there by someone — a priest in 1561, a novel from 1803, a spa town
between the wars. These are the stories behind the names, as told inside
<a href="/" style="color:var(--brass)">Chessography</a>, where they appear move by move as you play.</p>
${indexSections.join('')}`,
  ),
);

mkdirSync(join(dist, 'about'), { recursive: true });
writeFileSync(
  join(dist, 'about', 'index.html'),
  shell(
    'About — how Chessography works · Chessography',
    'Chessography is a chess app where every named move carries its story: play on the board and read who each opening, structure, endgame and mate is named after.',
    '/about/',
    `<div class="eyebrow"><span class="eco">ABOUT</span><span>how this works</span></div>
<h1>Every named move carries a story</h1>
<p><a href="/">Chessography</a> is a chessboard with a book beside it. Play a move, and the app resolves
the most specific <em>named</em> thing on the board — an opening line, a pawn structure, an endgame, a
famous mate — and opens its story: the person it honours, where the name came from, and how it earned its
place in the game.</p>

<h2>What gets recognized</h2>
<ul>
<li><strong>Openings</strong> — every position is checked against 3,732 named lines from the lichess
opening atlas. Recognition is by <em>position</em>, not move order, so transpositions resolve correctly,
and the naming lineage shows the name narrowing move by move (King's Pawn Game → Ruy Lopez → Morphy
Defense → Marshall Attack).</li>
<li><strong>Pawn structures</strong> — the Isolated Queen's Pawn, hanging pawns, the Carlsbad, the
Maróczy Bind, the Hedgehog, the Stonewall and the French chain, detected from the board itself.</li>
<li><strong>Endgames</strong> — the Lucena and Philidor positions, the Opposition, the wrong rook's pawn,
the bishop-and-knight mate.</li>
<li><strong>Named mates &amp; tactics</strong> — the smothered mate, back-rank mate, Anastasia's,
Arabian, Boden's and epaulette mates, and the Greek Gift sacrifice, recognized the moment they land.</li>
</ul>

<h2>How to use it</h2>
<ul>
<li>Play both sides, or face Stockfish at four strengths; <strong>💡 Advice</strong> explains the best
move in words and tells the story of the line it enters.</li>
<li>Step through any game with the arrow keys or on-screen controls; hover a lineage entry to see its
position.</li>
<li>When a game ends, the post-game chronicle names the ending, maps the named territory the game
crossed, and can annotate the finale with the classic ?? / ? / ?! glyphs.</li>
<li><strong>Share</strong> copies a link that carries the whole game — no accounts, nothing stored.</li>
<li>The <strong>opening trainer</strong> turns every storied line into a spaced-repetition card you
recite on the board; the <strong>chronicle</strong> fetches your own recent lichess or chess.com games
and resolves each against the atlas.</li>
</ul>

<h2>Credits</h2>
<p>Opening names from the <a href="https://github.com/lichess-org/chess-openings">lichess chess-openings
dataset</a> (CC0). Engine: Stockfish 18 lite, running entirely in your browser. Built with chess.js,
react-chessboard and React. All story text written for this site.</p>
<a class="cta" href="/">▶ Open the board</a>`,
  ),
);

writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
);

// Clean up the transpile scratch dir so it never deploys.
rmSync(scratch, { recursive: true, force: true });

console.log(`atlas pages=${pages + 1} (+about) sitemap urls=${urls.length} -> ${join(dist, 'atlas')}`);
