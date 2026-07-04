// Thin UCI wrapper around the Stockfish web worker. One instance per app;
// strength is set via Skill Level and per-level movetime so weak levels
// both blunder (skill) and think less (time).

export type EngineLevel = 'casual' | 'club' | 'strong' | 'master';

export const LEVELS: Record<EngineLevel, { label: string; skill: number; movetimeMs: number }> = {
  casual: { label: 'Casual', skill: 2, movetimeMs: 150 },
  club: { label: 'Club', skill: 8, movetimeMs: 350 },
  strong: { label: 'Strong', skill: 15, movetimeMs: 700 },
  master: { label: 'Master', skill: 20, movetimeMs: 1200 },
};

export class Engine {
  private worker: Worker;
  private ready: Promise<void>;
  private pendingBestMove: ((move: string) => void) | null = null;

  constructor() {
    this.worker = new Worker('/engine/stockfish-18-lite-single.js');
    this.ready = new Promise((resolve) => {
      const onMessage = (e: MessageEvent<string>) => {
        const line = String(e.data);
        if (line === 'uciok') resolve();
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

  dispose() {
    this.worker.terminate();
  }
}
