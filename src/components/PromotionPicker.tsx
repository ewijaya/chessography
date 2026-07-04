const GLYPHS: Record<'w' | 'b', Record<string, string>> = {
  w: { q: '♕', r: '♖', b: '♗', n: '♘' },
  b: { q: '♛', r: '♜', b: '♝', n: '♞' },
};

/** Overlay shown when a pawn reaches the last rank: pick the promotion piece. */
export default function PromotionPicker({
  color,
  onPick,
  onCancel,
}: {
  color: 'w' | 'b';
  onPick: (piece: 'q' | 'r' | 'b' | 'n') => void;
  onCancel: () => void;
}) {
  return (
    <div className="promo-overlay" onClick={onCancel}>
      <div className="promo-picker" onClick={(e) => e.stopPropagation()}>
        <span className="promo-title">Promote to</span>
        <div className="promo-choices">
          {(['q', 'r', 'b', 'n'] as const).map((p) => (
            <button key={p} onClick={() => onPick(p)} aria-label={`promote to ${p}`}>
              {GLYPHS[color][p]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
