import { Chess } from 'chess.js';
import openingsJson from '../data/openings.json';
import type { OpeningEntry, OpeningMatch } from '../types';

const book = openingsJson as Record<string, OpeningEntry>;

/** Number of named positions in the opening atlas. */
export const bookSize = Object.keys(book).length;

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
