import type { Eval } from '../lib/engine';

/** Win-probability share for White from a centipawn score (lichess curve). */
function whiteShare(ev: Eval): number {
  if ('mateIn' in ev) {
    if (ev.mateIn === 0) return 50; // resolved by caller for actual mate
    return ev.mateIn > 0 ? 100 : 0;
  }
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * ev.cp)) - 1);
}

function label(ev: Eval): string {
  if ('mateIn' in ev) return ev.mateIn === 0 ? '#' : `M${Math.abs(ev.mateIn)}`;
  const pawns = ev.cp / 100;
  return (pawns > 0 ? '+' : '') + pawns.toFixed(1);
}

export default function EvalBar({ score, orientation }: { score: Eval | null; orientation: 'white' | 'black' }) {
  const share = score ? whiteShare(score) : 50;
  const whiteAtBottom = orientation === 'white';
  return (
    <div
      className="eval-bar"
      role="meter"
      aria-label={`engine evaluation ${score ? label(score) : 'pending'}`}
      title={score ? `Stockfish: ${label(score)}` : 'evaluating…'}
    >
      <div
        className="eval-white"
        style={{
          height: `${share}%`,
          top: whiteAtBottom ? 'auto' : 0,
          bottom: whiteAtBottom ? 0 : 'auto',
        }}
      />
      <span className={`eval-label ${share >= 50 ? 'on-white' : 'on-black'}`}>{score ? label(score) : '·'}</span>
    </div>
  );
}
