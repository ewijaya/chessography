import type { Chess, Square } from 'chess.js';
import type { PatternMatch } from '../types';

type PawnSet = Set<string>; // squares like "d4"

function pawnSquares(chess: Chess, color: 'w' | 'b'): PawnSet {
  const set: PawnSet = new Set();
  for (const row of chess.board()) {
    for (const sq of row) {
      if (sq && sq.type === 'p' && sq.color === color) set.add(sq.square);
    }
  }
  return set;
}

function filesOf(pawns: PawnSet): Set<string> {
  return new Set([...pawns].map((s) => s[0]));
}

/**
 * Detect named middlegame pawn structures. Checked most-specific first;
 * the first hit wins. Detection is on board STATE, so a structure is
 * recognized however the game arrived at it.
 */
export function detectStructure(chess: Chess): PatternMatch | null {
  const wp = pawnSquares(chess, 'w');
  const bp = pawnSquares(chess, 'b');
  const wf = filesOf(wp);
  const bf = filesOf(bp);

  // Stonewall: the rigid d4/e3/f4 (or d5/e6/f5) pawn wedge.
  if (wp.has('d4') && wp.has('e3') && wp.has('f4')) {
    return { id: 'stonewall', name: 'Stonewall Structure', detail: 'White pawn wedge on d4, e3, f4 — iron grip on e5, at the cost of a hole on e4.' };
  }
  if (bp.has('d5') && bp.has('e6') && bp.has('f5')) {
    return { id: 'stonewall', name: 'Stonewall Structure', detail: 'Black pawn wedge on d5, e6, f5 — iron grip on e4, at the cost of a hole on e5.' };
  }

  // Hedgehog: black pawns crouched on the 6th rank behind White's c4 space.
  if (bp.has('a6') && bp.has('b6') && bp.has('d6') && bp.has('e6') && !bf.has('c') && wp.has('c4')) {
    return { id: 'hedgehog', name: 'Hedgehog Structure', detail: 'Black pawns on a6, b6, d6, e6 with the c-pawn exchanged — coiled behind the third rank, waiting for ...b5 or ...d5.' };
  }

  // Maróczy Bind: white pawns c4+e4 clamping d5, Black's c-pawn gone.
  if (wp.has('c4') && wp.has('e4') && !wf.has('d') && !bf.has('c') && bf.has('d')) {
    return { id: 'maroczy-bind', name: 'Maróczy Bind', detail: 'White pawns on c4 and e4 clamp the d5 square; Black cannot free the position with ...b5 or ...d5.' };
  }

  // Carlsbad: the QGD Exchange skeleton (White d4+e3 vs Black d5+c6).
  if (
    wp.has('d4') && !wf.has('c') && (wp.has('e3') || wp.has('e2')) &&
    bp.has('d5') && !bf.has('e') && (bp.has('c6') || bp.has('c7'))
  ) {
    return { id: 'carlsbad', name: 'Carlsbad Structure', detail: 'White d4/e3 vs Black d5/c6 with the c- and e-files half-open — minority-attack territory.' };
  }

  // Hanging pawns: the c+d pawn duo on the 4th with no neighbors.
  if (wp.has('c4') && wp.has('d4') && !wf.has('b') && !wf.has('e') && !bf.has('c') && !bf.has('d')) {
    return { id: 'hanging-pawns', name: 'Hanging Pawns', detail: 'White pawns abreast on c4 and d4 with no pawn support on the b- or e-files — dynamic strength, static weakness.' };
  }
  if (bp.has('c5') && bp.has('d5') && !bf.has('b') && !bf.has('e') && !wf.has('c') && !wf.has('d')) {
    return { id: 'hanging-pawns', name: 'Hanging Pawns', detail: 'Black pawns abreast on c5 and d5 with no pawn support on the b- or e-files — dynamic strength, static weakness.' };
  }

  // Isolated Queen's Pawn: a d-pawn with no friendly pawns on c or e files.
  const wIQP = ([...wp].some((s) => s === 'd4' || s === 'd5')) && !wf.has('c') && !wf.has('e') && !bf.has('d');
  if (wIQP) {
    const sq = [...wp].find((s) => s[0] === 'd') as Square;
    return { id: 'iqp', name: 'Isolated Queen’s Pawn', detail: `White pawn on ${sq} with no c- or e-pawns to defend it — a spearhead and a target at once.` };
  }
  const bIQP = ([...bp].some((s) => s === 'd5' || s === 'd4')) && !bf.has('c') && !bf.has('e') && !wf.has('d');
  if (bIQP) {
    const sq = [...bp].find((s) => s[0] === 'd') as Square;
    return { id: 'iqp', name: 'Isolated Queen’s Pawn', detail: `Black pawn on ${sq} with no c- or e-pawns to defend it — a spearhead and a target at once.` };
  }

  return null;
}
