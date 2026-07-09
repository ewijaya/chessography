// Generate draft stories for named opening lines that have no authored
// story yet, using the Google Gemini API (free tier friendly). Progress is
// checkpointed to data/generated-stories.json after every batch, so the
// script can be interrupted or hit the daily quota and simply be re-run
// later — it always resumes where it left off. Each successful batch also
// re-emits src/stories/generated.ts, the module the app imports.
//
// Run:  GEMINI_API_KEY=... node scripts/generate-stories.mjs [options]
//   --model <id>    Gemini model (default: gemini-2.5-flash-lite)
//   --batch <n>     lines per request (default: 5)
//   --limit <n>     stop after generating n stories this run
//   --rpm <n>       max requests per minute (default: 10)
//   --dry-run       report what remains, make no API calls
//
// Anti-hallucination stance: the model is told to write about the moves,
// plans and character of a line whenever the history behind a name is not
// well established, rather than invent biography. Generated stories carry
// no notableGames/famousGame — those are reserved for authored, verified
// content — and the app labels them as AI-drafted.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECKPOINT = join(root, 'data', 'generated-stories.json');
const EMIT = join(root, 'src', 'stories', 'generated.ts');

// ---------- CLI ----------

const argv = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : dflt;
};
const MODEL = opt('model', 'gemini-2.5-flash-lite');
const BATCH = Number(opt('batch', 5));
const LIMIT = Number(opt('limit', Infinity));
const RPM = Number(opt('rpm', 10));
const DRY = argv.includes('--dry-run');

// ---------- work out what remains ----------

// Authored story ids: regex the `id: '...'` lines out of the hand-written
// story files (same approach as story-coverage.mjs; the format is stable).
const authored = new Set();
const storyDir = join(root, 'src', 'stories');
for (const f of readdirSync(storyDir).filter((f) => f.startsWith('openings-'))) {
  const src = readFileSync(join(storyDir, f), 'utf8');
  for (const m of src.matchAll(/^\s+id: '((?:[^'\\]|\\.)*)'/gm)) {
    authored.add(m[1].replace(/\\'/g, "'"));
  }
}

// The book: unique names, shortest line for each.
const book = JSON.parse(readFileSync(join(root, 'src', 'data', 'openings.json'), 'utf8'));
const byName = new Map();
for (const e of Object.values(book)) {
  const prev = byName.get(e.name);
  if (!prev || e.ply < prev.ply) byName.set(e.name, e);
}

const done = existsSync(CHECKPOINT) ? JSON.parse(readFileSync(CHECKPOINT, 'utf8')) : {};

// Inheritance weight (how many deeper lines fall back to this name) so the
// most valuable stories are generated first across multi-day runs.
const ancestorsOf = (name) => {
  const out = [];
  let rest = name;
  while (true) {
    const cut = Math.max(rest.lastIndexOf(','), rest.lastIndexOf(':'));
    if (cut === -1) break;
    rest = rest.slice(0, cut).trim();
    out.push(rest);
  }
  return out;
};
const weight = new Map();
for (const [name] of byName) {
  for (const a of ancestorsOf(name)) weight.set(a, (weight.get(a) ?? 0) + 1);
}

const queue = [...byName.values()]
  .filter((e) => !authored.has(e.name) && !done[e.name])
  .sort(
    (a, b) => (weight.get(b.name) ?? 0) - (weight.get(a.name) ?? 0) || a.ply - b.ply,
  );

console.log(
  `book: ${byName.size} names · authored: ${authored.size} · generated so far: ${Object.keys(done).length} · remaining: ${queue.length}`,
);
if (DRY || queue.length === 0) process.exit(0);

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error('GEMINI_API_KEY is not set. Get a free key at https://aistudio.google.com/apikey');
  process.exit(1);
}

// ---------- Gemini ----------

const RESPONSE_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      id: { type: 'STRING', description: 'The exact line name, copied verbatim from the input.' },
      eponym: { type: 'STRING' },
      origin: { type: 'STRING' },
      story: { type: 'STRING' },
      significance: { type: 'STRING' },
    },
    required: ['id', 'eponym', 'origin', 'story', 'significance'],
  },
};

const promptFor = (entries) => {
  const lines = entries
    .map((e) => {
      const parents = ancestorsOf(e.name).filter((a) => byName.has(a));
      return `- name: ${e.name}\n  eco: ${e.eco}\n  moves: ${e.pgn}${parents.length ? `\n  parent lines: ${parents.join(' | ')}` : ''}`;
    })
    .join('\n');
  return `You are a careful chess historian writing entries for an atlas of named chess openings. For each named line below, write a story entry with four fields:

- eponym: who or what the line is named after, and who they were. If the name is descriptive (a place, a piece, a move) say so plainly.
- origin: when and where it first appeared or was first analyzed.
- story: 2-5 sentences of narrative — how it arose, why it caught on, human or historical context.
- significance: 1-3 sentences on what the line does strategically and why players care.

STRICT RULES:
- Accuracy over color. Only state names, dates, places and anecdotes you are confident are historically established. NEVER invent a biography, a date, or an anecdote.
- When the history behind a name is obscure or disputed, say so honestly ("the attribution is uncertain") and spend the story on the line's chess content instead: the point of the key moves, typical plans for both sides, its reputation, and how it relates to its parent line.
- Do not repeat the parent line's story; assume the reader can look the parent up. Focus on what THIS line adds.
- Return the "id" field copied character-for-character from the input name.
- Plain text only, no markdown.

Lines to write:
${lines}`;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.7,
        },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error(`empty response: ${JSON.stringify(data).slice(0, 300)}`);
      return JSON.parse(text);
    }
    const body = await res.text();
    if (res.status === 429) {
      // Daily quota exhausted → save-and-exit is handled by the caller;
      // per-minute limits → wait and retry.
      if (/PerDay|daily/i.test(body)) {
        const err = new Error('daily quota exhausted');
        err.daily = true;
        throw err;
      }
      const wait = Number(body.match(/"retryDelay":\s*"(\d+)s"/)?.[1] ?? 30) + 2;
      console.log(`  rate limited, waiting ${wait}s...`);
      await sleep(wait * 1000);
      continue;
    }
    if ((res.status >= 500 || res.status === 408) && attempt <= 3) {
      const wait = 2 ** attempt * 2;
      console.log(`  HTTP ${res.status}, retry in ${wait}s...`);
      await sleep(wait * 1000);
      continue;
    }
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
}

// ---------- emit the app module ----------

function emitModule(stories) {
  const list = Object.values(stories)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(({ id, eponym, origin, story, significance }) => ({
      id, eponym, origin, story, significance, generated: true,
    }));
  const body = JSON.stringify(list, null, 2);
  writeFileSync(
    EMIT,
    `// GENERATED FILE — do not edit by hand.\n` +
      `// Draft stories produced by scripts/generate-stories.mjs (Gemini).\n` +
      `// Authored stories in openings-*.ts always take precedence over these.\n` +
      `import type { Story } from '../types';\n\n` +
      `export const generatedOpeningStories: Story[] = ${body};\n`,
  );
}

function save() {
  writeFileSync(CHECKPOINT, JSON.stringify(done, null, 1));
  emitModule(done);
}

// ---------- main loop ----------

const minGap = Math.ceil(60_000 / RPM);
let generated = 0;
let lastCall = 0;

for (let i = 0; i < queue.length && generated < LIMIT; i += BATCH) {
  const batch = queue.slice(i, i + BATCH);
  const wanted = new Map(batch.map((e) => [e.name.toLowerCase(), e.name]));

  const gap = lastCall + minGap - Date.now();
  if (gap > 0) await sleep(gap);
  lastCall = Date.now();

  let items;
  try {
    items = await callGemini(promptFor(batch));
  } catch (e) {
    save();
    if (e.daily) {
      console.log(`\nDaily free-tier quota reached. Progress saved (${Object.keys(done).length} total). Run again tomorrow.`);
      process.exit(0);
    }
    throw e;
  }

  let ok = 0;
  for (const it of Array.isArray(items) ? items : []) {
    const name = wanted.get(String(it.id ?? '').toLowerCase());
    const fields = [it.eponym, it.origin, it.story, it.significance];
    if (!name || fields.some((f) => typeof f !== 'string' || f.trim().length < 10)) continue;
    done[name] = {
      id: name,
      eponym: it.eponym.trim(),
      origin: it.origin.trim(),
      story: it.story.trim(),
      significance: it.significance.trim(),
      model: MODEL,
      date: new Date().toISOString().slice(0, 10),
    };
    ok++;
    generated++;
  }
  save();
  const missed = batch.length - ok;
  console.log(
    `[${Object.keys(done).length}/${byName.size - authored.size}] +${ok}${missed ? ` (${missed} rejected, will retry next run)` : ''} — ${batch[0].name}${batch.length > 1 ? ` … ${batch[batch.length - 1].name}` : ''}`,
  );
}

save();
console.log(`\nDone for this run: +${generated} stories, ${queue.length - generated} remaining.`);
