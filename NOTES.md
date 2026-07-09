# NOTES — lessons & confirmed approaches

## Position-keyed opening lookup beats a move-sequence trie
The spec suggested a trie on move sequences, but keying on position (FEN fields 1–3:
placement, side-to-move, castling) handles transpositions for free — lichess's own
tooling identifies openings by position, not sequence. Lineage falls out naturally:
walk the game's actual position history and collect every named hit; the last hit is
the most specific line, the ordered unique names before it are the naming lineage.
EP field is dropped from the key (ep matters ~never in book lines; widens
transposition matching).

## react-chessboard v5 has a rewritten API
v5 (installed: 5.10.0) takes a single `options` prop (`ChessboardOptions`), not the
v4 flat props. `onPieceDrop({piece, sourceSquare, targetSquare}) => boolean`,
`position` is a FEN string. Most online examples are v4 — don't copy them.

## Recognition priority (confirmed with user via scoping Q&A)
While the current position is still in book → opening is primary. Once departed:
endgame match > structure match > "out of book, last named line was X".
Stack confirmed: Vite+React+TS, react-chessboard, chess.js, free play both sides,
~40 deep opening stories, all three recognizers in MVP.

## Story keys must match lichess dataset names exactly
Stories are keyed by the dataset's `name` string (e.g. "Ruy Lopez: Morphy Defense").
Grep data/*.tsv for the exact spelling before authoring (e.g. lichess calls Petrov
"Russian Game", uses "Defense" not "Defence"). Unstoried named lines fall back to
nearest storied ancestor in the lineage.

## Headless verification pipeline that works on this box
Snap chromium can only WRITE screenshots to non-hidden $HOME paths (writing to
~/.claude/... fails with Permission denied). playwright-core (installed as
devDep, launched with executablePath /usr/bin/chromium-browser + --no-sandbox)
drives the real app; scripts must live/run inside the project dir or ESM can't
resolve the package. `vite preview --port 4173` serves dist for these checks.

## Two engine workers, not one
The eval bar and the opponent both need `go` commands; a single UCI worker can
only run one search at a time, so the app keeps two Engine instances (opponent
+ eval). The 7MB wasm is fetched once (HTTP cache) but instantiated twice —
acceptable on desktop, and eval is toggleable for weaker devices.

## Lazy opening book pattern
openings.ts keeps a module-level `book` filled by loadBook() (dynamic import);
matchOpening stays synchronous and just misses until loaded. App re-renders on
bookReady, tests call loadBook() in beforeAll. Main chunk: 1.1MB → 401KB.

## Chess glyphs need a font fallback
Fraunces (display font) lacks ♞ — it rendered as a blob in the masthead until
the glyph span got font-family: var(--serif-body). Check pictographic glyphs
against the actual font stack, not the editor preview.

## Stockfish on Pages: use the single-threaded lite build
Multi-threaded stockfish.js needs SharedArrayBuffer → COOP/COEP headers, which
Cloudflare Pages doesn't send by default. `stockfish-18-lite-single` (21KB js +
7MB wasm) runs in a plain Worker with no headers. Files are copied from
node_modules to public/engine at pre{dev,build} — never committed (gitignored).

## react-chessboard squareStyles land on a child of [data-square]
E2E checks that look for the style on the `[data-square]` element itself find
nothing; query descendants too. Click-to-move = onSquareClick + squareStyles
(selected ring, radial-gradient dots on legal targets, ring on captures).

## Endgames are unreachable by normal play in a demo
Added demo presets (FEN/moves) so recognizers 2 and 3 are demonstrable without
playing 40 moves. This was the only way to make the MVP reviewable.

## Decode shared-game URLs during state init, not in an effect
The first version decoded `#g=` in a mount effect: it mutated chessRef and
queued setOpponent('human'), but the engine-opponent effect ran in the same
mount pass, read the already-mutated chessRef while opponent state was still
the default 'engine-black', and played a move into the shared game. Anything
that must beat the engine effect to the board belongs in useState/useRef
initializers, where it commits atomically with the first render.

## Tactic recognition is two different problems
Named mates (smothered, Anastasia's, Boden's…) are pure functions of the
mated position — same discipline as endgames, detectable from a FEN. The
Greek Gift is an *event*: it needs the move that just landed, so recognize()
takes an optional last verbose Move and pattern presets that demo it must be
move sequences, not FENs. Negatives matter: a ladder mate must not read as
back-rank (require own-piece blocks), scholar's mate must not read as
epaulette (require queen at distance two).

## Importing the TS story modules from a Node build script
Node 22's type stripping can't follow the app's extensionless imports, so
scripts/build-story-pages.mjs transpiles the story modules with the installed
typescript package (transpileModule) into dist/.stories-tmp, rewrites
relative specifiers to ./x.mjs, imports, and deletes the scratch dir. No new
deps, works on whatever Node CI uses.

## lichess + chess.com public APIs are CORS-open
Both can be fetched straight from the browser with no auth or proxy:
lichess `GET /api/games/user/{u}` (Accept: application/x-ndjson, `moves=true`
gives SAN strings; filter variant!=='standard'), chess.com
`/pub/player/{u}/games/archives` → month URLs → games[].pgn (filter
rules!=='chess'). Verified live against real accounts.

## Three <details> panels share the .presets styling
Trainer and GameImporter reuse `presets` as a base class. E2E scripts must
select by summary text ("Visit a famous position…"), not `.presets summary`
— the first match in DOM order is now the trainer.

## Hash-only navigation doesn't reload the app
Share links decode during React state initialization, so page.goto from '/'
to '/#g=…' in Playwright (same origin, fragment-only change) never re-runs
the decode — the test sees an empty board and times out. E2E scripts must
page.reload() after setting a hash URL, or make the share URL the FIRST
navigation. Real users always arrive fresh, so the app itself is unaffected.

## Service worker: Vary: Origin breaks Cache API matching
vite preview (sirv) serves assets with `Vary: Origin`; the Cache API
respects Vary, so responses stored by cache.addAll (no Origin header) never
match the page's crossorigin script requests — precached files "exist" in
cache.keys() but every match() misses and offline dies with ERR_FAILED.
All SW cache lookups use { ignoreVary: true } (the cache is same-origin
static content; Vary semantics don't apply). Second gotcha: without
clients.claim() the first-visit page is uncontrolled and offline only works
from the second visit; claim() is safe here because the SW never calls
skipWaiting, so it can't hijack a live session mid-deploy.
