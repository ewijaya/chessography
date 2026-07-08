import { beforeAll, describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { detectTactic } from './tactics';
import { recognize } from './recognize';
import { loadBook } from './openings';
import { getPatternStory } from '../stories';
import { presets } from './presets';

beforeAll(() => loadBook());

const fenOf = (label: string) => presets.find((p) => p.label.includes(label))!.fen!;

const play = (moves: string[]) => {
  const chess = new Chess();
  for (const m of moves) chess.move(m);
  return chess;
};

describe('named mate detection', () => {
  it('recognizes the smothered mate', () => {
    expect(detectTactic(new Chess(fenOf('Smothered')))?.id).toBe('smothered-mate');
  });

  it('recognizes the smothered mate against a white king', () => {
    expect(detectTactic(new Chess('6k1/8/8/8/8/8/5nPP/6RK w - - 0 1'))?.id).toBe('smothered-mate');
  });

  it('recognizes the back-rank mate', () => {
    expect(detectTactic(new Chess(fenOf('Back-rank')))?.id).toBe('back-rank-mate');
  });

  it('recognizes Anastasia’s mate', () => {
    expect(detectTactic(new Chess(fenOf('Anastasia')))?.id).toBe('anastasia-mate');
  });

  it('recognizes the Arabian mate', () => {
    expect(detectTactic(new Chess(fenOf('Arabian')))?.id).toBe('arabian-mate');
  });

  it('recognizes Boden’s mate', () => {
    expect(detectTactic(new Chess(fenOf('Boden')))?.id).toBe('boden-mate');
  });

  it('recognizes the epaulette mate', () => {
    expect(detectTactic(new Chess(fenOf('Epaulette')))?.id).toBe('epaulette-mate');
  });

  it('does NOT name a plain ladder mate back-rank (no self-block)', () => {
    // Rook mates along the 8th with the attacking king supplying the wall.
    const chess = new Chess('R3k3/8/4K3/8/8/8/8/8 b - - 0 1');
    expect(chess.isCheckmate()).toBe(true);
    expect(detectTactic(chess)).toBeNull();
  });

  it('does NOT name scholar’s mate an epaulette (queen adjacent, no flank block)', () => {
    const chess = play(['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6', 'Qxf7#']);
    expect(chess.isCheckmate()).toBe(true);
    expect(detectTactic(chess)).toBeNull();
  });

  it('detects nothing in the start position', () => {
    expect(detectTactic(new Chess())).toBeNull();
  });
});

describe('the Greek Gift', () => {
  it('recognizes Bxh7+ against the castled king', () => {
    const preset = presets.find((p) => p.label.includes('Greek Gift'))!;
    const chess = play(preset.moves!);
    const last = chess.history({ verbose: true }).at(-1);
    expect(detectTactic(chess, last)?.id).toBe('greek-gift');
  });

  it('needs the last move — position alone is not an event', () => {
    const preset = presets.find((p) => p.label.includes('Greek Gift'))!;
    const chess = play(preset.moves!);
    expect(detectTactic(chess)).toBeNull();
  });

  it('ignores a bishop capturing h7 when the king is elsewhere', () => {
    // Same sacrifice square, but the black king never castled.
    const chess = new Chess('rnbqk2r/ppppbppp/4pn2/8/3P4/3B1N2/PPP1PPPP/RNBQK2R w KQkq - 0 5');
    const mv = chess.move('Bxh7');
    expect(detectTactic(chess, mv)).toBeNull();
  });
});

describe('recognition priority with tactics', () => {
  it('a named mate leads the display', () => {
    const r = recognize(new Chess(fenOf('Smothered')), []);
    expect(r.tactic?.id).toBe('smothered-mate');
    expect(r.primary).toBe('tactic');
  });

  it('the Greek Gift leads once out of book', () => {
    const preset = presets.find((p) => p.label.includes('Greek Gift'))!;
    const chess = play(preset.moves!);
    const r = recognize(chess, preset.moves!, chess.history({ verbose: true }).at(-1));
    expect(r.primary).toBe('tactic');
  });

  it('every tactic id has a story', () => {
    for (const id of [
      'smothered-mate',
      'back-rank-mate',
      'anastasia-mate',
      'arabian-mate',
      'boden-mate',
      'epaulette-mate',
      'greek-gift',
    ]) {
      expect(getPatternStory(id), id).toBeDefined();
    }
  });
});

describe('robustness', () => {
  it('recognize survives a history that does not replay from the start', () => {
    // A custom-FEN game hands recognize SANs that are illegal from move one.
    const chess = new Chess(fenOf('Lucena'));
    chess.move('Rc2');
    expect(() => recognize(chess, chess.history())).not.toThrow();
  });
});
