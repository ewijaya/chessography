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

## Chess glyphs need a font fallback
Fraunces (display font) lacks ♞ — it rendered as a blob in the masthead until
the glyph span got font-family: var(--serif-body). Check pictographic glyphs
against the actual font stack, not the editor preview.

## Endgames are unreachable by normal play in a demo
Added demo presets (FEN/moves) so recognizers 2 and 3 are demonstrable without
playing 40 moves. This was the only way to make the MVP reviewable.
