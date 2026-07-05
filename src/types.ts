export interface Story {
  /** Key: for openings, the exact lichess dataset name; for structures/endgames, a slug. */
  id: string;
  aliases?: string[];
  /** Who or what it's named after, and who they were. */
  eponym: string;
  /** When/where it first appeared or was first analyzed. */
  origin: string;
  /** The narrative: how it arose, why it caught on, human/historical context. */
  story: string;
  /** What it does strategically and why players care. */
  significance: string;
  notableGames?: string[];
  /** A complete, verified game score the reader can step through on the board. */
  famousGame?: { label: string; pgn: string };
}

export interface OpeningEntry {
  eco: string;
  name: string;
  pgn: string;
  ply: number;
}

export interface OpeningMatch {
  /** Most specific named line whose position occurred in this game. */
  entry: OpeningEntry;
  /** Ply (1-based move count) at which that position was reached. */
  atPly: number;
  /** True if the current position itself is a named book position. */
  inBook: boolean;
  /** Ordered unique names encountered on the way, ending at `entry`. */
  lineage: OpeningEntry[];
}

export interface PatternMatch {
  /** Story id in the structure/endgame story tables. */
  id: string;
  /** Display name of the detected pattern. */
  name: string;
  /** Short note on what triggered detection, e.g. "White pawn on d4, no c/e pawns". */
  detail: string;
}

export interface Recognition {
  opening: OpeningMatch | null;
  structure: PatternMatch | null;
  endgame: PatternMatch | null;
  /** Which panel should lead the display. */
  primary: 'opening' | 'structure' | 'endgame' | null;
}
