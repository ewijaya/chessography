import { Chess, type Move, type Square } from 'chess.js';
import type { Advice as EngineAdvice, Eval } from './engine';
import { lookupPosition } from './openings';
import { getOpeningStory, type OpeningStoryResult } from '../stories';
import type { OpeningEntry } from '../types';

/** A best-move suggestion, explained: what to play, why, and its story if it has one. */
export interface MoveAdvice {
  san: string;
  from: Square;
  to: Square;
  /** Short human reasons, most concrete first. */
  reasons: string[];
  /** Engine's expected continuation in SAN, starting with the advised move. */
  line: string[];
  ev: Eval;
  /** Named opening position the move reaches, with its authored story when one exists. */
  opening: { entry: OpeningEntry; storyResult: OpeningStoryResult | null } | null;
}

const PIECE_NAMES: Record<string, string> = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king',
};

const CENTER = new Set(['d4', 'e4', 'd5', 'e5']);

/**
 * Turn an engine best-move result into something a person can read:
 * play the move on a scratch board, describe what it concretely does
 * (mate, check, capture, development, safety, threats), frame the eval,
 * and look up whether the resulting position has a name in the atlas.
 */
export function buildAdvice(fen: string, engine: EngineAdvice): MoveAdvice | null {
  const after = new Chess(fen);
  const before = new Chess(fen);
  const us = before.turn();
  const them = us === 'w' ? 'b' : 'w';
  let mv: Move;
  try {
    mv = after.move({
      from: engine.uci.slice(0, 2),
      to: engine.uci.slice(2, 4),
      promotion: engine.uci[4] as 'q' | 'r' | 'b' | 'n' | undefined,
    });
  } catch {
    return null;
  }

  const reasons: string[] = [];
  const pieceName = PIECE_NAMES[mv.piece];

  // -- concrete tactical facts, strongest first --
  if (after.isCheckmate()) {
    reasons.push('it is checkmate');
  } else if ('mateIn' in engine.ev) {
    const mate = engine.ev.mateIn * (us === 'w' ? 1 : -1);
    if (mate > 0) reasons.push(`forces checkmate in ${mate} move${mate === 1 ? '' : 's'}`);
  }
  if (!after.isCheckmate() && after.isCheck()) reasons.push('gives check');
  if (mv.flags.includes('k') || mv.flags.includes('q')) {
    reasons.push('castles — the king tucks into safety and the rooks connect');
  }
  if (mv.captured) {
    reasons.push(`captures the ${PIECE_NAMES[mv.captured]} on ${mv.to}${mv.flags.includes('e') ? ' en passant' : ''}`);
  }
  if (mv.promotion) reasons.push(`promotes to a ${PIECE_NAMES[mv.promotion]}`);

  // Rescues a valuable piece that stood attacked.
  const value: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  if (value[mv.piece] >= 3 && before.isAttacked(mv.from, them) && !after.isAttacked(mv.to, them)) {
    reasons.push(`moves the attacked ${pieceName} to safety`);
  }

  // New attacks created by the moved piece against heavy pieces.
  const threatened: string[] = [];
  for (const row of after.board()) {
    for (const sq of row) {
      if (!sq || sq.color !== them) continue;
      if (sq.type !== 'q' && sq.type !== 'r') continue;
      if (after.attackers(sq.square, us).includes(mv.to) && !before.attackers(sq.square, us).includes(mv.from)) {
        threatened.push(PIECE_NAMES[sq.type]);
      }
    }
  }
  if (threatened.length > 0 && !mv.captured) {
    reasons.push(`attacks the enemy ${threatened.join(' and ')}`);
  }

  // -- positional flavor --
  const backRank = us === 'w' ? '1' : '8';
  if ((mv.piece === 'n' || mv.piece === 'b') && mv.from[1] === backRank && !mv.captured) {
    reasons.push(`develops the ${pieceName} off the back rank`);
  }
  if (mv.piece === 'p' && CENTER.has(mv.to) && !mv.captured) {
    reasons.push('stakes a claim in the center');
  }

  // -- eval framing from the mover's point of view --
  if ('cp' in engine.ev) {
    const cp = engine.ev.cp * (us === 'w' ? 1 : -1);
    if (cp >= 300) reasons.push('keeps a winning advantage');
    else if (cp >= 100) reasons.push('holds a clear edge');
    else if (cp >= -99) reasons.push('keeps the position balanced');
    else reasons.push('is the best fighting chance in a difficult position');
  } else if (engine.ev.mateIn * (us === 'w' ? 1 : -1) < 0) {
    reasons.push('is the toughest defense, though the position is lost');
  }

  // Expected continuation, capped so the card stays readable.
  const lineBoard = new Chess(fen);
  const line: string[] = [];
  for (const uci of engine.pv.slice(0, 8)) {
    try {
      line.push(lineBoard.move({
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci[4] as 'q' | 'r' | 'b' | 'n' | undefined,
      }).san);
    } catch {
      break;
    }
  }

  // Does the move land on a named position? Then it has a story to tell.
  const entry = lookupPosition(after.fen());
  const opening = entry ? { entry, storyResult: getOpeningStory([entry]) } : null;

  return { san: mv.san, from: mv.from, to: mv.to, reasons, line, ev: engine.ev, opening };
}
