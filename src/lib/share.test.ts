import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { decodeGame, encodeGame } from './share';

describe('shareable game links', () => {
  it('round-trips a game from the standard start', () => {
    const sans = ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'O-O', 'Nf6'];
    const decoded = decodeGame(encodeGame({ sans }));
    expect(decoded).toEqual({ sans, startFen: undefined });
  });

  it('round-trips a game from a custom position', () => {
    const startFen = '1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1';
    const sans = ['Rc8+'];
    const decoded = decodeGame(encodeGame({ sans, startFen }));
    expect(decoded).toEqual({ sans, startFen });
  });

  it('produces a fragment that survives a URL untouched', () => {
    const hash = encodeGame({ sans: ['e4', 'c5', 'Nf3'] });
    expect(hash).toMatch(/^#g=[A-Za-z0-9_-]+$/);
    expect(new URL(`https://example.com/${hash}`).hash).toBe(hash);
  });

  it('a decoded game actually replays', () => {
    const chess = new Chess();
    for (const san of ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6']) chess.move(san);
    const decoded = decodeGame(encodeGame({ sans: chess.history() }))!;
    const replay = new Chess();
    for (const san of decoded.sans) replay.move(san);
    expect(replay.fen()).toBe(chess.fen());
  });

  it('rejects garbage, foreign and empty hashes', () => {
    expect(decodeGame('')).toBeNull();
    expect(decodeGame('#')).toBeNull();
    expect(decodeGame('#other=thing')).toBeNull();
    expect(decodeGame('#g=!!!not-base64url!!!')).toBeNull();
    expect(decodeGame('#g=')).toBeNull();
  });
});
