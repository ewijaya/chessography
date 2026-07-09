import { useEffect } from 'react';

/**
 * The "?" help sheet: everything a visitor can't discover by moving a
 * piece — what gets recognized, the keyboard, and what the tools do.
 * Rendered as a modal over the app; Escape or the backdrop dismisses it.
 */
export default function HelpOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="help-backdrop" onClick={onClose}>
      <div
        className="help-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="how Chessography works"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="help-head">
          <h2>How this works</h2>
          <button className="advice-close" onClick={onClose} aria-label="close help">
            ×
          </button>
        </div>

        <p className="help-lede">
          Play chess. After every move, the app resolves the most specific <em>named</em> thing on the
          board and tells you its story — who it honours, where it came from, why it earned a name.
        </p>

        <h3>What gets recognized</h3>
        <ul className="help-list">
          <li><strong>Openings</strong> — 3,732 named lines; the lineage shows the name narrowing move by move</li>
          <li><strong>Pawn structures</strong> — IQP, Carlsbad, Hedgehog, Maróczy Bind, Stonewall…</li>
          <li><strong>Endgames</strong> — Lucena, Philidor, the Opposition, the wrong rook’s pawn…</li>
          <li><strong>Named mates & tactics</strong> — smothered mate, Boden’s, Anastasia’s, the Greek Gift…</li>
        </ul>

        <h3>The board</h3>
        <ul className="help-list">
          <li>Drag a piece, or click it to see its legal moves as dots</li>
          <li><kbd>←</kbd> <kbd>→</kbd> step through the game · <kbd>Home</kbd>/<kbd>End</kbd> jump to start/live — or use the ⏮ ◀ ▶ ⏭ buttons</li>
          <li>Click any move on the scoresheet (or any milestone after the game) to revisit that position</li>
          <li>Hover a line in the naming lineage to see its position</li>
        </ul>

        <h3>The tools</h3>
        <ul className="help-list">
          <li><strong>💡 Advice</strong> — Stockfish suggests your best move, explained in words, with the story of the line it enters</li>
          <li><strong>🔗 Share</strong> — copies a link carrying the whole game; whoever opens it can step through your chronicle</li>
          <li><strong>🎓 Opening trainer</strong> — recite storied lines from memory; <em>Again</em> brings a line back in minutes, <em>Good</em> in days, <em>Easy</em> in weeks</li>
          <li><strong>📜 Chronicle your own games</strong> — fetch your recent lichess or chess.com games, each resolved against the atlas</li>
          <li><strong>🏛 Famous positions</strong> — one-click demos of every structure, endgame and named mate</li>
        </ul>

        <p className="help-foot">
          When the game ends, the post-game chronicle names the ending, maps the journey, and can annotate
          the finale. Read more <a href="/about/">about the project</a> or browse{' '}
          <a href="/atlas/">the story atlas</a>.
        </p>
      </div>
    </div>
  );
}
