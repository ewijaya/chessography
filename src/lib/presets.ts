export interface Preset {
  label: string;
  group: 'opening' | 'structure' | 'endgame' | 'tactic';
  /** Either a move sequence from the start... */
  moves?: string[];
  /** ...or a raw position. */
  fen?: string;
}

/**
 * Famous positions reachable in one click, so the structure and endgame
 * recognizers can be seen without playing forty moves.
 */
export const presets: Preset[] = [
  {
    label: 'Ruy Lopez — Marshall Attack',
    group: 'opening',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'O-O', 'c3', 'd5'],
  },
  {
    label: 'Sicilian — Najdorf Variation',
    group: 'opening',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'],
  },
  {
    label: 'Isolated Queen’s Pawn (via Alapin)',
    group: 'structure',
    moves: ['e4', 'c5', 'c3', 'd5', 'exd5', 'Qxd5', 'd4', 'Nf6', 'Nf3', 'e6', 'Be2', 'cxd4', 'cxd4'],
  },
  {
    label: 'Carlsbad (via QGD Exchange)',
    group: 'structure',
    moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'cxd5', 'exd5', 'Bg5', 'c6'],
  },
  {
    label: 'Maróczy Bind (via Accelerated Dragon)',
    group: 'structure',
    moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'g6', 'c4'],
  },
  {
    label: 'Hedgehog (via English)',
    group: 'structure',
    moves: ['c4', 'c5', 'Nf3', 'Nf6', 'Nc3', 'e6', 'g3', 'b6', 'Bg2', 'Bb7', 'O-O', 'Be7', 'd4', 'cxd4', 'Qxd4', 'd6', 'Rd1', 'a6'],
  },
  {
    label: 'Stonewall Attack',
    group: 'structure',
    moves: ['d4', 'd5', 'e3', 'Nf6', 'Bd3', 'e6', 'f4'],
  },
  {
    label: 'Lucena position',
    group: 'endgame',
    fen: '1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1',
  },
  {
    label: 'Philidor position',
    group: 'endgame',
    fen: '4k3/8/1r6/4K3/4P3/8/8/R7 b - - 0 1',
  },
  {
    label: 'King & pawn — the Opposition',
    group: 'endgame',
    fen: '4k3/8/4K3/4P3/8/8/8/8 b - - 0 1',
  },
  {
    label: 'Wrong rook’s pawn',
    group: 'endgame',
    fen: '6k1/8/8/7P/8/8/8/1B2K3 w - - 0 1',
  },
  {
    label: 'Bishop & knight mate',
    group: 'endgame',
    fen: '4k3/8/8/8/8/8/8/2B1KN2 w - - 0 1',
  },
  {
    label: 'Smothered mate (Philidor’s Legacy)',
    group: 'tactic',
    fen: '6rk/5Npp/8/8/8/8/8/6K1 b - - 0 1',
  },
  {
    label: 'Back-rank mate',
    group: 'tactic',
    fen: '3R2k1/5ppp/8/8/8/8/8/6K1 b - - 0 1',
  },
  {
    label: 'Anastasia’s mate',
    group: 'tactic',
    fen: '8/4N1pk/8/8/8/8/8/6KR b - - 0 1',
  },
  {
    label: 'The Arabian mate',
    group: 'tactic',
    fen: '7k/7R/5N2/8/8/8/8/6K1 b - - 0 1',
  },
  {
    label: 'Boden’s mate',
    group: 'tactic',
    fen: '2kr4/3p4/B7/8/5B2/8/8/4K3 b - - 0 1',
  },
  {
    label: 'The Epaulette mate',
    group: 'tactic',
    fen: '3rkr2/8/4Q3/8/8/8/8/4K3 b - - 0 1',
  },
  {
    label: 'The Greek Gift (Bxh7+, the pattern)',
    group: 'tactic',
    moves: ['d4', 'd5', 'Nf3', 'Nf6', 'e3', 'e6', 'Bd3', 'Be7', 'O-O', 'O-O', 'Bxh7+'],
  },
];
