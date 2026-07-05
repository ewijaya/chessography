<p align="center">
  <a href="https://chessography.pages.dev">
    <img src="docs/chessography-hero.webp" alt="Chessography — every named move carries a story. An antique map styled as a chessboard, its territories named for openings, pawn structures and endgames, flanked by the historical figures they honour." width="100%">
  </a>
</p>

# ♞ Chessography

**[chessography.pages.dev](https://chessography.pages.dev)**

A chess app where every named move carries its story. Play on the board and,
after each move, the app resolves the most specific named thing that applies —
opening line, pawn structure, or endgame pattern — and tells you the story
behind the name: who it's named after, when it arose, why it caught on, and
why players care.

Naming is move-level: as a game walks deeper into theory the app shows the
naming lineage (King's Pawn Game → Ruy Lopez → Morphy Defense → Marshall
Attack), so you watch the name narrow with each move.

## The three recognition problems

| Phase | Method |
| --- | --- |
| Openings | Position-keyed lookup (transposition-safe) against the lichess CC0 dataset — 3,732 named lines |
| Middlegame | Pawn-structure detection on board state: IQP, hanging pawns, Carlsbad, Maróczy Bind, Hedgehog, Stonewall |
| Endgame | Material signature + placement: Lucena, Philidor, K+P opposition, wrong rook's pawn, B+N mate |

Story content is first-class data (`src/stories/`): 46 opening lines plus all
structures and endgames have full authored stories (eponym, origin, narrative,
significance, notable games). Named lines without an authored story still
resolve, show their lineage, and inherit the nearest ancestor's story.

## Develop

```bash
npm install
npm run dev        # dev server
npm test           # recognizer test suite (vitest)
npm run build      # regenerates src/data/openings.json, then builds to dist/
```

The opening dataset is rebuilt from `data/*.tsv` (lichess chess-openings,
CC0) by `scripts/build-openings.mjs` on every build.

## Deploy

Pushes to `main` auto-deploy to Cloudflare Pages via GitHub Actions
(`.github/workflows/deploy.yml`). For a manual one-off deploy:

```bash
bash scripts/deploy.sh   # Cloudflare Pages; reads credentials from ~/.secrets
```

## Stack

Vite · React · TypeScript · chess.js · react-chessboard (v5)
