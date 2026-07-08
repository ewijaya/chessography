import type { Chess, Move } from 'chess.js';
import type { Recognition } from '../types';
import { matchOpening } from './openings';
import { detectStructure } from './structures';
import { detectEndgame } from './endgames';
import { detectTactic } from './tactics';

/**
 * Resolve everything nameable about the current position.
 * Priority: a named mate is the game's final word and always leads; while
 * still in book the opening is primary; once the game departs, a named
 * tactic beats an endgame beats a structure beats the stale opening.
 */
export function recognize(chess: Chess, sanHistory: string[], lastMove?: Move): Recognition {
  const opening = sanHistory.length > 0 ? matchOpening(sanHistory) : null;
  const endgame = detectEndgame(chess);
  const structure = endgame ? null : detectStructure(chess);
  const tactic = detectTactic(chess, lastMove);

  let primary: Recognition['primary'] = null;
  if (tactic && (chess.isCheckmate() || !opening?.inBook)) primary = 'tactic';
  else if (opening?.inBook) primary = 'opening';
  else if (endgame) primary = 'endgame';
  else if (structure) primary = 'structure';
  else if (opening) primary = 'opening';

  return { opening, structure, endgame, tactic, primary };
}
