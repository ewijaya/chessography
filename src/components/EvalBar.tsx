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

/** True when the side ahead is winning big (≥ ±2 pawns or forced mate). */
function decisive(ev: Eval): boolean {
  return 'mateIn' in ev || Math.abs(ev.cp) >= 200;
}

export default function EvalBar({ score, orientation }: { score: Eval | null; orientation: 'white' | 'black' }) {
  const share = score ? whiteShare(score) : 50;
  const whiteAtBottom = orientation === 'white';
  // The numeric chip sits at the leading edge of whoever is ahead.
  const whiteAhead = share >= 50;
  const chipAtBottom = whiteAhead === whiteAtBottom;
  return (
    <div className="eval-wrap">
      <div
        className="eval-bar"
        role="meter"
        aria-label={`engine evaluation ${score ? label(score) : 'pending'}`}
        title={score ? `Stockfish: ${label(score)}` : 'evaluating…'}
      >
        <div
          className={`eval-white${score && decisive(score) ? ' decisive' : ''}`}
          style={{
            height: `${share}%`,
            top: whiteAtBottom ? 'auto' : 0,
            bottom: whiteAtBottom ? 0 : 'auto',
          }}
        />
        <span className="eval-tick" aria-hidden="true" />
      </div>
      <span className={`eval-label ${whiteAhead ? 'on-white' : 'on-black'} ${chipAtBottom ? 'at-bottom' : 'at-top'}`}>
        {score ? label(score) : '·'}
      </span>
    </div>
  );
}
