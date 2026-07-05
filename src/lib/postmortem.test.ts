import { beforeAll, describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { loadBook } from './openings';
import { classifyLoss, computeAnnotations, detectEnding, journeyMilestones } from './postmortem';

beforeAll(() => loadBook());

const play = (moves: string[]) => {
  const chess = new Chess();
  for (const m of moves) chess.move(m);
  return chess;
};

describe('detectEnding', () => {
  it('names checkmate with the winner', () => {
    const e = detectEnding(play(['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6', 'Qxf7#']));
    expect(e?.id).toBe('checkmate');
    expect(e?.result).toBe('1-0');
    expect(e?.summary).toContain('White wins');
    expect(e?.history).toContain('shāh māt');
  });

  it('names stalemate', () => {
    const e = detectEnding(new Chess('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1'));
    expect(e?.id).toBe('stalemate');
    expect(e?.result).toBe('½–½');
  });

  it('names insufficient material', () => {
    const e = detectEnding(new Chess('8/8/4k3/8/8/4K3/8/8 w - - 0 1'));
    expect(e?.id).toBe('insufficient');
  });

  it('names threefold repetition', () => {
    const e = detectEnding(play(['Nf3', 'Nf6', 'Ng1', 'Ng8', 'Nf3', 'Nf6', 'Ng1', 'Ng8']));
    expect(e?.id).toBe('threefold');
  });

  it('returns null for a live game', () => {
    expect(detectEnding(play(['e4']))).toBeNull();
  });
});

describe('journeyMilestones', () => {
  it('collects the opening lineage in ply order', () => {
    const ms = journeyMilestones(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5']);
    const openings = ms.filter((m) => m.kind === 'opening');
    expect(openings[0].label).toContain("King's Pawn Game");
    expect(openings[openings.length - 1].label).toContain('Ruy Lopez');
    expect(ms.map((m) => m.ply)).toEqual([...ms.map((m) => m.ply)].sort((a, b) => a - b));
  });

  it('skips the opening atlas for games from a custom FEN', () => {
    const ms = journeyMilestones(['Kd3'], '8/8/4k3/8/8/8/3K4/4R3 w - - 0 1');
    expect(ms.every((m) => m.kind !== 'opening')).toBe(true);
  });
});

describe('finale annotation', () => {
  it('classifies losses on the classic scale', () => {
    expect(classifyLoss(0)).toBe('');
    expect(classifyLoss(49)).toBe('');
    expect(classifyLoss(50)).toBe('?!');
    expect(classifyLoss(100)).toBe('?');
    expect(classifyLoss(200)).toBe('??');
  });

  it('grades each mover from their own side of the board', () => {
    // White plays a fine move (+20 → +30), Black then blunders (+30 → +330).
    const annotated = computeAnnotations(['a4', 'h5'], [20, 30, 330], 41, 'w');
    expect(annotated[0]).toMatchObject({ san: 'a4', mover: 'w', glyph: '', loss: 0 });
    expect(annotated[1]).toMatchObject({ san: 'h5', mover: 'b', glyph: '??', loss: 300 });
    expect(annotated.map((a) => a.ply)).toEqual([41, 42]);
  });
});
