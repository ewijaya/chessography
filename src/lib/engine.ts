// Thin UCI wrapper around the Stockfish web worker. The app runs two
// instances: one plays as the opponent, one continuously evaluates the
// displayed position for the eval bar (a single worker can only run one
// `go` at a time, and eval must not block the opponent's thinking).

export type EngineLevel = 'casual' | 'club' | 'strong' | 'master';

export const LEVELS: Record<EngineLevel, { label: string; skill: number; movetimeMs: number }> = {
  casual: { label: 'Casual', skill: 2, movetimeMs: 150 },
  club: { label: 'Club', skill: 8, movetimeMs: 350 },
  strong: { label: 'Strong', skill: 15, movetimeMs: 700 },
  master: { label: 'Master', skill: 20, movetimeMs: 1200 },
};

/** Centipawns from White's point of view, or a forced mate in N. */
export type Eval = { cp: number } | { mateIn: number };

/** Full-strength analysis result: best move, its eval, and the line behind it. */
export interface Advice {
  uci: string;
  ev: Eval;
  /** Principal variation as UCI moves, starting with `uci`. */
  pv: string[];
}

export class Engine {
  private worker: Worker;
  private ready: Promise<void>;
  private pendingBestMove: ((move: string) => void) | null = null;
  private lastInfoScore: { cp?: number; mate?: number } = {};
  private lastInfoPv: string[] = [];

  constructor() {
    this.worker = new Worker('/engine/stockfish-18-lite-single.js');
    this.ready = new Promise((resolve) => {
      const onMessage = (e: MessageEvent<string>) => {
        const line = String(e.data);
        if (line === 'uciok') resolve();
        if (line.startsWith('info ')) {
          const cp = / score cp (-?\d+)/.exec(line);
          const mate = / score mate (-?\d+)/.exec(line);
          if (cp) this.lastInfoScore = { cp: Number(cp[1]) };
          else if (mate) this.lastInfoScore = { mate: Number(mate[1]) };
          const pv = / pv (.+)$/.exec(line);
          if (pv) this.lastInfoPv = pv[1].split(' ');
        }
        if (line.startsWith('bestmove')) {
          const move = line.split(' ')[1];
          this.pendingBestMove?.(move);
          this.pendingBestMove = null;
        }
      };
      this.worker.addEventListener('message', onMessage);
      this.worker.postMessage('uci');
    });
  }

  /** Ask for the best move in `fen` at the given level. UCI move like "e2e4" / "e7e8q". */
  async bestMove(fen: string, level: EngineLevel): Promise<string> {
    await this.ready;
    const { skill, movetimeMs } = LEVELS[level];
    this.worker.postMessage(`setoption name Skill Level value ${skill}`);
    this.worker.postMessage(`position fen ${fen}`);
    return new Promise((resolve) => {
      this.pendingBestMove = resolve;
      this.worker.postMessage(`go movetime ${movetimeMs}`);
    });
  }

  /**
   * Quick fixed-depth evaluation of `fen`, normalized to White's point of
   * view (UCI scores are from the side to move). Serializes on the same
   * bestmove wait as bestMove(), so use a dedicated instance for eval.
   */
  async evaluate(fen: string, depth = 12): Promise<Eval> {
    await this.ready;
    this.worker.postMessage(`setoption name Skill Level value 20`);
    this.worker.postMessage(`position fen ${fen}`);
    this.lastInfoScore = {};
    await new Promise<void>((resolve) => {
      this.pendingBestMove = () => resolve();
      this.worker.postMessage(`go depth ${depth}`);
    });
    const whiteToMove = fen.split(' ')[1] === 'w';
    const sign = whiteToMove ? 1 : -1;
    const s = this.lastInfoScore;
    if (s.mate !== undefined) return { mateIn: s.mate * sign };
    return { cp: (s.cp ?? 0) * sign };
  }

  /**
   * Full-strength search for the hint feature: best move plus its score
   * (White's point of view) and principal variation. Serializes on the same
   * bestmove wait as the other calls, so use a dedicated instance.
   */
  async advise(fen: string, movetimeMs = 1000): Promise<Advice> {
    await this.ready;
    this.worker.postMessage(`setoption name Skill Level value 20`);
    this.worker.postMessage(`position fen ${fen}`);
    this.lastInfoScore = {};
    this.lastInfoPv = [];
    const uci = await new Promise<string>((resolve) => {
      this.pendingBestMove = resolve;
      this.worker.postMessage(`go movetime ${movetimeMs}`);
    });
    const sign = fen.split(' ')[1] === 'w' ? 1 : -1;
    const s = this.lastInfoScore;
    const ev: Eval = s.mate !== undefined ? { mateIn: s.mate * sign } : { cp: (s.cp ?? 0) * sign };
    const pv = this.lastInfoPv[0] === uci ? this.lastInfoPv : [uci];
    return { uci, ev, pv };
  }

  dispose() {
    this.worker.terminate();
  }
}
