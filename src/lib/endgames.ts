import type { Chess } from 'chess.js';
import type { PatternMatch } from '../types';

interface Side {
  color: 'w' | 'b';
  pieces: string[]; // non-king piece types, e.g. ['r', 'p']
  squares: Record<string, string[]>; // type -> squares
  kingSquare: string;
}

function sides(chess: Chess): { w: Side; b: Side } {
  const make = (color: 'w' | 'b'): Side => ({ color, pieces: [], squares: {}, kingSquare: '' });
  const result = { w: make('w'), b: make('b') };
  for (const row of chess.board()) {
    for (const sq of row) {
      if (!sq) continue;
      const side = result[sq.color];
      if (sq.type === 'k') {
        side.kingSquare = sq.square;
      } else {
        side.pieces.push(sq.type);
        (side.squares[sq.type] ??= []).push(sq.square);
      }
    }
  }
  result.w.pieces.sort();
  result.b.pieces.sort();
  return result;
}

const sig = (s: Side) => s.pieces.join('');
const fileOf = (sq: string) => sq[0];
const rankOf = (sq: string) => Number(sq[1]);
// a1 is dark: (file index 0) + (rank 1) = 1, odd.
const isDarkSquare = (sq: string) => (sq.charCodeAt(0) - 97 + rankOf(sq)) % 2 === 1;
const fileDist = (a: string, b: string) => Math.abs(a.charCodeAt(0) - b.charCodeAt(0));

/**
 * Recognize named endgame patterns from material signature + piece placement.
 * Only fires on exact signatures, so no gating against middlegame positions
 * is needed.
 */
export function detectEndgame(chess: Chess): PatternMatch | null {
  const { w, b } = sides(chess);

  for (const [me, them] of [
    [w, b],
    [b, w],
  ] as const) {
    const mySig = sig(me);
    const theirSig = sig(them);
    const relRank = (sq: string) => (me.color === 'w' ? rankOf(sq) : 9 - rankOf(sq));

    // King + pawn vs king: the schoolroom of the opposition.
    if (mySig === 'p' && theirSig === '') {
      return {
        id: 'kp-opposition',
        name: 'King and Pawn vs King — the Opposition',
        detail: 'The oldest question in chess: can the pawn promote? The answer lives in key squares and the opposition.',
      };
    }

    // Bishop + rook-pawn(s) of the wrong color vs bare king.
    if (theirSig === '' && me.squares['b']?.length === 1 && me.squares['p']?.length && me.pieces.every((p) => p === 'b' || p === 'p')) {
      const pawns = me.squares['p'];
      const allRookPawns = pawns.every((p) => fileOf(p) === 'a' || fileOf(p) === 'h');
      const sameFile = new Set(pawns.map(fileOf)).size === 1;
      if (allRookPawns && sameFile) {
        const file = fileOf(pawns[0]);
        const promoSq = file + (me.color === 'w' ? '8' : '1');
        const bishopSq = me.squares['b'][0];
        if (isDarkSquare(promoSq) !== isDarkSquare(bishopSq)) {
          return {
            id: 'wrong-rook-pawn',
            name: 'The Wrong Rook’s Pawn',
            detail: `The ${file}-pawn promotes on ${promoSq}, but the bishop can never control that corner — if the defending king gets there, it is a draw.`,
          };
        }
      }
    }

    // Bishop + knight mate: the hardest of the basic mates.
    if (mySig === 'bn' && theirSig === '') {
      return {
        id: 'kbn-mate',
        name: 'Bishop and Knight Mate',
        detail: 'Mate can only be forced in a corner the bishop controls — the famous “W manoeuvre” herds the king there.',
      };
    }

    // Rook + pawn vs rook: Lucena (winning) and Philidor (drawing) country.
    if (mySig === 'pr' && theirSig === 'r') {
      const pawn = me.squares['p'][0];
      const promoRank = me.color === 'w' ? 8 : 1;
      const kingOnPromoRank = rankOf(me.kingSquare) === promoRank;
      const kingNearPawnFile = fileDist(me.kingSquare, pawn) <= 1;
      const defKingInFront =
        fileDist(them.kingSquare, pawn) <= 1 && relRank(them.kingSquare) > relRank(pawn);

      if (relRank(pawn) === 7 && kingOnPromoRank && kingNearPawnFile) {
        return {
          id: 'lucena',
          name: 'The Lucena Position',
          detail: `Pawn on the seventh, king in front of it — the winning side “builds a bridge” with the rook to shelter the king from checks.`,
        };
      }
      if (defKingInFront) {
        return {
          id: 'philidor',
          name: 'The Philidor Position',
          detail: 'The defending king stands on the promotion square’s path — Philidor’s third-rank defense holds the draw.',
        };
      }
      return {
        id: 'philidor',
        name: 'Rook and Pawn vs Rook',
        detail: 'The most common endgame in chess. Whether it is won or drawn usually comes down to Lucena (win) vs Philidor (draw).',
      };
    }
  }

  return null;
}
