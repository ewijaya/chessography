import { Chess } from 'chess.js';
import type { OpeningEntry, OpeningMatch } from '../types';

// The 3,732-entry book is the heaviest data in the app, so it is loaded
// lazily: the main chunk ships without it and recognition switches on the
// moment it arrives. Callers await loadBook() (the app does this on mount;
// tests in beforeAll).
let book: Record<string, OpeningEntry> = {};
let loadPromise: Promise<void> | null = null;

export function loadBook(): Promise<void> {
  loadPromise ??= import('../data/openings.json').then((m) => {
    book = m.default as Record<string, OpeningEntry>;
  });
  return loadPromise;
}

/** Number of named positions in the opening atlas (0 until loaded). */
export function bookSize(): number {
  return Object.keys(book).length;
}

/** All entries, ECO-then-name sorted, deduped by name — for the atlas explorer. */
export function bookEntries(): OpeningEntry[] {
  const byName = new Map<string, OpeningEntry>();
  for (const e of Object.values(book)) {
    const prev = byName.get(e.name);
    if (!prev || e.ply < prev.ply) byName.set(e.name, e); // keep the mainline (shortest) form
  }
  return [...byName.values()].sort((a, b) => a.eco.localeCompare(b.eco) || a.name.localeCompare(b.name));
}

/** Position key: FEN piece placement + side to move + castling rights. */
export function positionKey(fen: string): string {
  return fen.split(' ').slice(0, 3).join(' ');
}

export function lookupPosition(fen: string): OpeningEntry | undefined {
  return book[positionKey(fen)];
}

/**
 * Walk the game's position history and collect every named position.
 * The last hit is the most specific line reached; the ordered unique
 * names before it are the naming lineage (e.g. King's Pawn Game →
 * Ruy Lopez → Ruy Lopez: Morphy Defense).
 */
export function matchOpening(sanHistory: string[]): OpeningMatch | null {
  const chess = new Chess();
  const hits: { entry: OpeningEntry; atPly: number }[] = [];
  sanHistory.forEach((san, i) => {
    chess.move(san);
    const entry = lookupPosition(chess.fen());
    if (entry) hits.push({ entry, atPly: i + 1 });
  });
  if (hits.length === 0) return null;

  const last = hits[hits.length - 1];
  const lineage: OpeningEntry[] = [];
  for (const h of hits) {
    if (lineage.length === 0 || lineage[lineage.length - 1].name !== h.entry.name) {
      lineage.push(h.entry);
    }
  }
  return {
    entry: last.entry,
    atPly: last.atPly,
    inBook: last.atPly === sanHistory.length,
    lineage,
  };
}
