import { beforeAll, describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { loadBook } from './openings';
import { buildAdvice } from './advice';

beforeAll(() => loadBook());

const fenAfter = (moves: string[]) => {
  const chess = new Chess();
  for (const m of moves) chess.move(m);
  return chess.fen();
};

describe('buildAdvice', () => {
  it('explains a center pawn push and names the line it enters', () => {
    const advice = buildAdvice(new Chess().fen(), { uci: 'e2e4', ev: { cp: 30 }, pv: ['e2e4', 'e7e5'] });
    expect(advice?.san).toBe('e4');
    expect(advice?.reasons.join(' ')).toContain('center');
    expect(advice?.opening?.entry.name).toBe("King's Pawn Game");
    expect(advice?.opening?.storyResult?.story.id).toBe("King's Pawn Game");
    expect(advice?.line).toEqual(['e4', 'e5']);
  });

  it('finds the Ruy Lopez story for 3.Bb5', () => {
    const fen = fenAfter(['e4', 'e5', 'Nf3', 'Nc6']);
    const advice = buildAdvice(fen, { uci: 'f1b5', ev: { cp: 25 }, pv: ['f1b5'] });
    expect(advice?.san).toBe('Bb5');
    expect(advice?.opening?.entry.name).toBe('Ruy Lopez');
    expect(advice?.opening?.storyResult?.story.eponym).toContain('Ruy López');
    expect(advice?.reasons.join(' ')).toContain('develops the bishop');
  });

  it('describes captures and checkmate', () => {
    // Scholar's mate: Qxf7#
    const fen = fenAfter(['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6']);
    const advice = buildAdvice(fen, { uci: 'h5f7', ev: { mateIn: 1 }, pv: ['h5f7'] });
    expect(advice?.san).toBe('Qxf7#');
    expect(advice?.reasons[0]).toBe('it is checkmate');
    expect(advice?.reasons.join(' ')).toContain('captures the pawn on f7');
  });

  it('frames the eval from Black\'s point of view', () => {
    const fen = fenAfter(['e4']);
    const advice = buildAdvice(fen, { uci: 'c7c5', ev: { cp: 20 }, pv: ['c7c5'] });
    expect(advice?.san).toBe('c5');
    // +20 cp for White is still "balanced" for the Black mover.
    expect(advice?.reasons.join(' ')).toContain('balanced');
  });

  it('returns null for an illegal engine move', () => {
    expect(buildAdvice(new Chess().fen(), { uci: 'e2e5', ev: { cp: 0 }, pv: [] })).toBeNull();
  });
});
