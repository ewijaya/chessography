import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { matchOpening } from './openings';
import { detectStructure } from './structures';
import { detectEndgame } from './endgames';
import { recognize } from './recognize';
import { getOpeningStory, getPatternStory } from '../stories';
import { presets } from './presets';

const play = (moves: string[]) => {
  const chess = new Chess();
  for (const m of moves) chess.move(m);
  return chess;
};

describe('opening recognition', () => {
  it('names 1.e4 immediately', () => {
    const m = matchOpening(['e4']);
    expect(m?.entry.name).toBe("King's Pawn Game");
    expect(m?.inBook).toBe(true);
  });

  it('resolves the Ruy Lopez and its lineage', () => {
    const m = matchOpening(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5']);
    expect(m?.entry.name).toBe('Ruy Lopez');
    expect(m?.entry.eco).toBe('C60');
    const names = m!.lineage.map((l) => l.name);
    expect(names[0]).toBe("King's Pawn Game");
    expect(names[names.length - 1]).toBe('Ruy Lopez');
  });

  it('narrows to the Morphy Defense after 3...a6', () => {
    const m = matchOpening(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6']);
    expect(m?.entry.name).toBe('Ruy Lopez: Morphy Defense');
    expect(m!.lineage.map((l) => l.name)).toContain('Ruy Lopez');
  });

  it('recognizes transpositions (position-keyed, not sequence-keyed)', () => {
    // Queen's Gambit Declined via an odd move order.
    const a = matchOpening(['d4', 'e6', 'c4', 'd5']);
    const b = matchOpening(['d4', 'd5', 'c4', 'e6']);
    expect(a?.entry.name).toBe(b?.entry.name);
  });

  it('reports book departure but keeps the last named line', () => {
    const m = matchOpening(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'h6', 'a3', 'g5']);
    expect(m?.inBook).toBe(false);
    expect(m?.entry.name).toMatch(/^Ruy Lopez/);
  });

  it('finds the Marshall Attack at full depth', () => {
    const preset = presets.find((p) => p.label.includes('Marshall'))!;
    const m = matchOpening(preset.moves!);
    expect(m?.entry.name).toContain('Marshall');
  });
});

describe('opening stories', () => {
  it('has a full story for the Ruy Lopez mentioning the 1561 book', () => {
    const m = matchOpening(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'])!;
    const s = getOpeningStory(m.lineage)!;
    expect(s.story.id).toBe('Ruy Lopez');
    expect(s.inherited).toBe(false);
    expect(s.story.origin).toContain('1561');
    expect(s.story.eponym).toContain('priest');
    expect(s.story.aliases).toContain('Spanish Game');
  });

  it('falls back to the nearest storied ancestor for deep unstoried lines', () => {
    // Ruy Lopez: Morphy Defense, Cozio Defense — no authored story.
    const m = matchOpening(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nge7'])!;
    const s = getOpeningStory(m.lineage)!;
    expect(s.inherited).toBe(true);
    expect(['Ruy Lopez: Morphy Defense', 'Ruy Lopez']).toContain(s.story.id);
  });
});

describe('structure detection', () => {
  it('detects the IQP from the Alapin preset', () => {
    const preset = presets.find((p) => p.label.includes('Isolated'))!;
    expect(detectStructure(play(preset.moves!))?.id).toBe('iqp');
  });

  it('detects the Carlsbad from the QGD Exchange', () => {
    const preset = presets.find((p) => p.label.includes('Carlsbad'))!;
    expect(detectStructure(play(preset.moves!))?.id).toBe('carlsbad');
  });

  it('detects the Maróczy Bind', () => {
    const preset = presets.find((p) => p.label.includes('Maróczy'))!;
    expect(detectStructure(play(preset.moves!))?.id).toBe('maroczy-bind');
  });

  it('detects the Hedgehog', () => {
    const preset = presets.find((p) => p.label.includes('Hedgehog'))!;
    expect(detectStructure(play(preset.moves!))?.id).toBe('hedgehog');
  });

  it('detects the Stonewall', () => {
    const preset = presets.find((p) => p.label.includes('Stonewall'))!;
    expect(detectStructure(play(preset.moves!))?.id).toBe('stonewall');
  });

  it('detects nothing in the start position', () => {
    expect(detectStructure(new Chess())).toBeNull();
  });

  it('every detected structure has a story', () => {
    for (const id of ['iqp', 'hanging-pawns', 'carlsbad', 'maroczy-bind', 'hedgehog', 'stonewall']) {
      expect(getPatternStory(id), id).toBeDefined();
    }
  });
});

describe('endgame detection', () => {
  const fenOf = (label: string) => presets.find((p) => p.label.includes(label))!.fen!;

  it('recognizes the Lucena position', () => {
    expect(detectEndgame(new Chess(fenOf('Lucena')))?.id).toBe('lucena');
  });

  it('recognizes the Philidor position', () => {
    expect(detectEndgame(new Chess(fenOf('Philidor')))?.id).toBe('philidor');
  });

  it('recognizes K+P vs K', () => {
    expect(detectEndgame(new Chess(fenOf('Opposition')))?.id).toBe('kp-opposition');
  });

  it('recognizes the wrong rook pawn', () => {
    expect(detectEndgame(new Chess(fenOf('Wrong rook')))?.id).toBe('wrong-rook-pawn');
  });

  it('does NOT flag a right-colored bishop + rook pawn', () => {
    // Dark-squared bishop, h-pawn: h8 is dark — this is winning, not a fortress.
    const chess = new Chess('6k1/8/8/7P/8/8/8/B3K3 w - - 0 1');
    expect(detectEndgame(chess)).toBeNull();
  });

  it('recognizes bishop + knight mate material', () => {
    expect(detectEndgame(new Chess(fenOf('Bishop & knight')))?.id).toBe('kbn-mate');
  });

  it('detects nothing in the start position', () => {
    expect(detectEndgame(new Chess())).toBeNull();
  });

  it('every endgame id has a story', () => {
    for (const id of ['lucena', 'philidor', 'kp-opposition', 'wrong-rook-pawn', 'kbn-mate']) {
      expect(getPatternStory(id), id).toBeDefined();
    }
  });
});

describe('recognition priority', () => {
  it('opening is primary while in book, even with a structure on the board', () => {
    const preset = presets.find((p) => p.label.includes('Carlsbad'))!;
    const chess = play(preset.moves!);
    const r = recognize(chess, preset.moves!);
    expect(r.structure?.id).toBe('carlsbad');
    expect(r.primary).toBe('opening');
  });

  it('endgame wins once out of book', () => {
    const chess = new Chess(presets.find((p) => p.label.includes('Lucena'))!.fen!);
    const r = recognize(chess, []);
    expect(r.primary).toBe('endgame');
  });

  it('all preset move sequences are legal', () => {
    for (const p of presets) {
      if (p.moves) expect(() => play(p.moves!), p.label).not.toThrow();
      if (p.fen) expect(() => new Chess(p.fen!), p.label).not.toThrow();
    }
  });
});
