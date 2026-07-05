import { Chess } from 'chess.js';
import type { Engine } from './engine';
import { matchOpening } from './openings';
import { detectStructure } from './structures';
import { detectEndgame } from './endgames';

// ---------- the ending, named and given its history ----------

export interface Ending {
  id: string;
  name: string;
  result: '1-0' | '0-1' | '½–½';
  /** One line saying what happened on the board. */
  summary: string;
  /** The rule's place in chess history. */
  history: string;
}

/** Name how a finished game ended. Null while the game is still going. */
export function detectEnding(chess: Chess): Ending | null {
  if (chess.isCheckmate()) {
    const winner = chess.turn() === 'w' ? 'Black' : 'White';
    return {
      id: 'checkmate',
      name: 'Checkmate',
      result: chess.turn() === 'w' ? '0-1' : '1-0',
      summary: `${winner} wins — the ${chess.turn() === 'w' ? 'White' : 'Black'} king is attacked and has no escape.`,
      history:
        'From the Persian "shāh māt" — the king is helpless. The phrase crossed into Arabic and rode into medieval Europe with the game itself: scacco matto, échec et mat, checkmate — every language kept the sound of the original. Contrary to the popular gloss, māt means defeated or left without resource, not dead: the king is never captured, merely left without an answer.',
    };
  }
  if (chess.isStalemate()) {
    return {
      id: 'stalemate',
      name: 'Stalemate',
      result: '½–½',
      summary: `${chess.turn() === 'w' ? 'White' : 'Black'} has no legal move but is not in check — the game simply stops.`,
      history:
        'Few rules have flip-flopped harder. Medieval Arabic play scored stalemate a win; English rules into the early 1800s scored it a LOSS for the player delivering it; only in the 19th century did the draw become universal. Reformers still occasionally propose re-scoring it — a stalemate win would rewrite endgame theory overnight, since king-and-pawn endings lean on it constantly.',
    };
  }
  if (chess.isThreefoldRepetition()) {
    return {
      id: 'threefold',
      name: 'Draw by threefold repetition',
      result: '½–½',
      summary: 'The same position has occurred three times with the same side to move.',
      history:
        'Repetition claims entered formal tournament law in the late 19th century, codified in the London rules of 1883 so neither side could shadow-box forever. Its most famous face is "perpetual check" — the escape hatch of lost positions since the romantic era, which is not itself a rule but resolves through repetition.',
    };
  }
  if (chess.isInsufficientMaterial()) {
    return {
      id: 'insufficient',
      name: 'Draw — insufficient material',
      result: '½–½',
      summary: 'Neither side has enough force left to deliver checkmate by any sequence of legal moves.',
      history:
        'A distant echo of shatranj, the Arabic ancestor of chess, where stripping the enemy king bare was itself a victory. Modern rules inverted the verdict: the bare king is no longer a loss but a dead position, and the chronicle closes in a draw.',
    };
  }
  if (chess.isDrawByFiftyMoves()) {
    return {
      id: 'fifty-move',
      name: 'Draw by the fifty-move rule',
      result: '½–½',
      summary: 'Fifty consecutive moves have passed without a pawn move or a capture.',
      history:
        'Ruy López was already arguing over a fifty-move count in his 1561 treatise, and the exact number wandered for centuries before settling. In the 1980s, after computer analysis proved some endgames need more than fifty moves to win, FIDE carved out exceptions of 75 and 100 moves — then scrapped them all in 1992, reasoning that no human could play those endings perfectly anyway.',
    };
  }
  if (chess.isDraw()) {
    return {
      id: 'draw',
      name: 'Draw',
      result: '½–½',
      summary: 'The game ends level.',
      history:
        'The half-point itself is young: early tournaments replayed draws until someone won, and Wilhelm Steinitz campaigned for the ½–½ score that finally made peace a legitimate result.',
    };
  }
  return null;
}

// ---------- the game's journey through named territory ----------

export interface Milestone {
  ply: number;
  label: string;
  kind: 'opening' | 'structure' | 'endgame';
}

const STANDARD_START = new Chess().fen();

/**
 * Walk the finished game and mark where it crossed named ground: the
 * opening lineage, the first recognized pawn structure, the first named
 * endgame. Games from a custom starting FEN skip the opening atlas
 * (its book is keyed to games from the standard start).
 */
export function journeyMilestones(sans: string[], startFen = STANDARD_START): Milestone[] {
  const out: Milestone[] = [];
  if (startFen === STANDARD_START) {
    const m = matchOpening(sans);
    if (m) for (const l of m.lineage) out.push({ ply: l.ply, label: `${l.name} (${l.eco})`, kind: 'opening' });
  }
  const chess = new Chess(startFen);
  let sawStructure = false;
  let sawEndgame = false;
  sans.forEach((san, i) => {
    try {
      chess.move(san);
    } catch {
      return;
    }
    if (!sawStructure) {
      const s = detectStructure(chess);
      if (s) {
        sawStructure = true;
        out.push({ ply: i + 1, label: s.name, kind: 'structure' });
      }
    }
    if (!sawEndgame) {
      const e = detectEndgame(chess);
      if (e) {
        sawEndgame = true;
        out.push({ ply: i + 1, label: e.name, kind: 'endgame' });
      }
    }
  });
  return out.sort((a, b) => a.ply - b.ply);
}

// ---------- annotating the finale ----------

export interface AnnotatedPly {
  /** 1-based ply index into the game. */
  ply: number;
  san: string;
  mover: 'w' | 'b';
  /** Classic annotation glyph, '' when the move held the evaluation. */
  glyph: '??' | '?' | '?!' | '';
  /** Centipawns the mover gave away (0 when the move held or improved). */
  loss: number;
}

/** Mate scores folded onto the centipawn scale so eval deltas stay comparable. */
const MATE_CP = 100000;

export function classifyLoss(loss: number): AnnotatedPly['glyph'] {
  if (loss >= 200) return '??';
  if (loss >= 100) return '?';
  if (loss >= 50) return '?!';
  return '';
}

/**
 * Pure core of the finale annotation: given the SANs of the analyzed
 * stretch and the eval (White POV centipawns) of each position around
 * them (cps.length === sans.length + 1), grade every move by how much
 * of the evaluation its mover let slip.
 */
export function computeAnnotations(sans: string[], cps: number[], firstPly: number, firstMover: 'w' | 'b'): AnnotatedPly[] {
  return sans.map((san, i) => {
    const mover = (i % 2 === 0 ? firstMover : firstMover === 'w' ? 'b' : 'w') as 'w' | 'b';
    const pov = mover === 'w' ? 1 : -1;
    const loss = Math.max(0, Math.round((cps[i] - cps[i + 1]) * pov));
    return { ply: firstPly + i, san, mover, glyph: classifyLoss(loss), loss };
  });
}

/**
 * Evaluate the last `maxPlies` moves of a finished game and grade them.
 * `fens[i]` is the position before move `sans[i]`; the final entry of
 * `fens` is the terminal position. Terminal positions are scored without
 * the engine (mate or dead draw); the rest run a fixed-depth search.
 */
export async function annotateFinale(
  fens: string[],
  sans: string[],
  engine: Engine,
  maxPlies = 12,
  onProgress?: (done: number, total: number) => void,
): Promise<AnnotatedPly[]> {
  const from = Math.max(0, sans.length - maxPlies);
  const positions = fens.slice(from, sans.length + 1);
  const cps: number[] = [];
  for (let i = 0; i < positions.length; i++) {
    const board = new Chess(positions[i]);
    if (board.isCheckmate()) {
      cps.push(board.turn() === 'w' ? -MATE_CP : MATE_CP);
    } else if (board.isGameOver()) {
      cps.push(0);
    } else {
      const ev = await engine.evaluate(positions[i], 12);
      cps.push('cp' in ev ? ev.cp : Math.sign(ev.mateIn) * (MATE_CP - Math.abs(ev.mateIn) * 100));
    }
    onProgress?.(i + 1, positions.length);
  }
  const firstMover = new Chess(positions[0]).turn();
  return computeAnnotations(sans.slice(from), cps, from + 1, firstMover);
}
