import type { Chess, Move, Square } from 'chess.js';
import type { PatternMatch } from '../types';

// The fourth atlas: named checkmate patterns and the one great named
// sacrifice. Mate patterns are recognized from the final position alone
// (like endgames); the Greek Gift is an event, so it needs the last move.

const FILES = 'abcdefgh';

const fileIdx = (sq: string) => sq.charCodeAt(0) - 97;
const rankOf = (sq: string) => Number(sq[1]);

/** All on-board squares adjacent to `sq`. */
function neighbors(sq: string): Square[] {
  const f = fileIdx(sq);
  const r = rankOf(sq);
  const out: Square[] = [];
  for (let df = -1; df <= 1; df++) {
    for (let dr = -1; dr <= 1; dr++) {
      if (df === 0 && dr === 0) continue;
      const nf = f + df;
      const nr = r + dr;
      if (nf >= 0 && nf < 8 && nr >= 1 && nr <= 8) out.push((FILES[nf] + nr) as Square);
    }
  }
  return out;
}

function kingSquare(chess: Chess, color: 'w' | 'b'): Square {
  for (const row of chess.board()) {
    for (const sq of row) {
      if (sq && sq.type === 'k' && sq.color === color) return sq.square;
    }
  }
  throw new Error('no king'); // unreachable on a legal board
}

/**
 * Recognize named checkmate patterns in a mated position. Checked most
 * specific first; the mated side is the side to move.
 */
function detectMatePattern(chess: Chess): PatternMatch | null {
  if (!chess.isCheckmate()) return null;

  const loser = chess.turn();
  const winner = loser === 'w' ? 'b' : 'w';
  const kSq = kingSquare(chess, loser);
  const checkers = chess.attackers(kSq, winner).map((s) => ({ square: s, piece: chess.get(s)! }));
  if (checkers.length === 0) return null; // defensive; cannot happen in mate
  const around = neighbors(kSq);
  const ownBlocked = around.filter((s) => chess.get(s)?.color === loser);
  const single = checkers.length === 1 ? checkers[0] : null;

  // Smothered mate: a knight mates a king buried alive under its own army.
  if (single?.piece.type === 'n' && around.every((s) => chess.get(s)?.color === loser)) {
    return {
      id: 'smothered-mate',
      name: 'Smothered Mate',
      detail: `The knight on ${single.square} delivers mate — every flight square around ${kSq} is occupied by the king's own pieces.`,
    };
  }

  // Anastasia's mate: a rook mates along the edge file while a knight
  // seals the escape squares one file in.
  const onEdgeFile = fileIdx(kSq) === 0 || fileIdx(kSq) === 7;
  if (single?.piece.type === 'r' && onEdgeFile && fileIdx(single.square) === fileIdx(kSq)) {
    const innerEscapes = around.filter((s) => fileIdx(s) !== fileIdx(kSq) && !chess.get(s));
    const knightSeals =
      innerEscapes.length > 0 &&
      innerEscapes.every((s) => chess.attackers(s, winner).some((a) => chess.get(a)?.type === 'n'));
    if (knightSeals) {
      return {
        id: 'anastasia-mate',
        name: 'Anastasia’s Mate',
        detail: `The rook mates along the ${kSq[0]}-file while the knight seals the inner escape squares — the classic rook-and-knight trap on the edge.`,
      };
    }
  }

  // Arabian mate: rook adjacent to the cornered king, guarded by a knight.
  const inCorner = ['a1', 'a8', 'h1', 'h8'].includes(kSq);
  if (
    single?.piece.type === 'r' &&
    inCorner &&
    around.includes(single.square as Square) &&
    chess.attackers(single.square, winner).some((a) => chess.get(a)?.type === 'n')
  ) {
    return {
      id: 'arabian-mate',
      name: 'The Arabian Mate',
      detail: `Rook on ${single.square} mates the cornered king, guarded by the knight — the oldest recorded mate in chess.`,
    };
  }

  // Boden's mate: two bishops slice criss-crossing diagonals through a king
  // blocked by its own pieces (classically a queenside-castled king).
  if (single?.piece.type === 'b' && ownBlocked.length > 0) {
    const otherBishop = around.some(
      (s) =>
        !chess.get(s) &&
        chess.attackers(s, winner).some((a) => a !== single.square && chess.get(a)?.type === 'b'),
    );
    if (otherBishop) {
      return {
        id: 'boden-mate',
        name: 'Boden’s Mate',
        detail: 'Two bishops rake criss-crossing diagonals while the king’s own pieces block its retreat — the scissors close.',
      };
    }
  }

  // Epaulette mate: a queen mates a king flanked on both sides by its own
  // pieces, standing like epaulettes on its shoulders.
  if (single?.piece.type === 'q') {
    const df = fileIdx(single.square) - fileIdx(kSq);
    const dr = rankOf(single.square) - rankOf(kSq);
    const straight = (df === 0) !== (dr === 0);
    const distTwo = Math.abs(df) === 2 || Math.abs(dr) === 2;
    if (straight && distTwo) {
      // The two squares beside the king, perpendicular to the queen's line.
      const lat = df === 0 ? [1, -1].map((d) => FILES[fileIdx(kSq) + d] && ((FILES[fileIdx(kSq) + d] + rankOf(kSq)) as Square))
                           : [1, -1].map((d) => (rankOf(kSq) + d >= 1 && rankOf(kSq) + d <= 8 ? ((kSq[0] + (rankOf(kSq) + d)) as Square) : undefined));
      if (lat.every((s) => s && chess.get(s)?.color === loser)) {
        return {
          id: 'epaulette-mate',
          name: 'The Epaulette Mate',
          detail: `The queen mates from ${single.square} — the king's own pieces sit on its shoulders like epaulettes, blocking both flights.`,
        };
      }
    }
  }

  // Back-rank mate: a major piece mates along the home rank, the king's
  // own pawns forming the fatal wall in front.
  const homeRank = loser === 'w' ? 1 : 8;
  const forward = loser === 'w' ? 1 : -1;
  if (
    single &&
    (single.piece.type === 'r' || single.piece.type === 'q') &&
    rankOf(kSq) === homeRank &&
    rankOf(single.square) === homeRank
  ) {
    const front = around.filter((s) => rankOf(s) === homeRank + forward);
    if (front.length > 0 && front.every((s) => chess.get(s)?.color === loser)) {
      return {
        id: 'back-rank-mate',
        name: 'Back-Rank Mate',
        detail: `Mate along the ${homeRank === 1 ? 'first' : 'eighth'} rank — the pawns that sheltered the king all game become the bars of its cell.`,
      };
    }
  }

  return null;
}

/**
 * Recognize named tactical events. Mate patterns need only the position;
 * the Greek Gift needs the move that just landed.
 */
export function detectTactic(chess: Chess, lastMove?: Move): PatternMatch | null {
  const mate = detectMatePattern(chess);
  if (mate) return mate;

  // Greek Gift: the classical bishop sacrifice on h7/h2 against a castled king.
  if (
    lastMove &&
    lastMove.piece === 'b' &&
    lastMove.captured === 'p' &&
    (lastMove.to === 'h7' || lastMove.to === 'h2') &&
    chess.isCheck()
  ) {
    const victim = lastMove.color === 'w' ? 'b' : 'w';
    const kSq = kingSquare(chess, victim);
    if (kSq === (lastMove.to === 'h7' ? 'g8' : 'g1')) {
      return {
        id: 'greek-gift',
        name: 'The Greek Gift',
        detail: `${lastMove.san} — the classical bishop sacrifice against the castled king. If accepted, the knight comes to g5 and the queen follows; the king's shelter is gone.`,
      };
    }
  }

  return null;
}
