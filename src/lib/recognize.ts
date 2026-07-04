import type { Chess } from 'chess.js';
import type { Recognition } from '../types';
import { matchOpening } from './openings';
import { detectStructure } from './structures';
import { detectEndgame } from './endgames';

/**
 * Resolve everything nameable about the current position.
 * Priority: while still in book the opening is primary; once the game
 * departs, an endgame pattern beats a structure beats the stale opening.
 */
export function recognize(chess: Chess, sanHistory: string[]): Recognition {
  const opening = sanHistory.length > 0 ? matchOpening(sanHistory) : null;
  const endgame = detectEndgame(chess);
  const structure = endgame ? null : detectStructure(chess);

  let primary: Recognition['primary'] = null;
  if (opening?.inBook) primary = 'opening';
  else if (endgame) primary = 'endgame';
  else if (structure) primary = 'structure';
  else if (opening) primary = 'opening';

  return { opening, structure, endgame, primary };
}
