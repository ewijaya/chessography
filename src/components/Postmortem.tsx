import { useState } from 'react';
import type { Ending, Milestone, AnnotatedPly } from '../lib/postmortem';
import { annotateFinale } from '../lib/postmortem';
import type { Engine } from '../lib/engine';

const plyLabel = (ply: number): string => {
  const moveNo = Math.ceil(ply / 2);
  return ply % 2 === 1 ? `${moveNo}.` : `${moveNo}…`;
};

const judgement = (a: AnnotatedPly): string => {
  if (a.glyph === '??') return a.loss >= 90000 ? 'overlooks the mate' : `blunder — gives away ${(a.loss / 100).toFixed(1)} pawns`;
  if (a.glyph === '?') return `mistake — costs ${(a.loss / 100).toFixed(1)} pawns`;
  if (a.glyph === '?!') return 'inaccuracy';
  return '';
};

/**
 * Post-game chronicle: names the ending and tells its history, lists the
 * named territory the game crossed, and (on demand) grades the final
 * moves with the classic annotation glyphs.
 */
export default function Postmortem({
  ending,
  milestones,
  fens,
  sans,
  getEngine,
  onGoToPly,
}: {
  ending: Ending;
  milestones: Milestone[];
  fens: string[];
  sans: string[];
  getEngine: () => Engine;
  onGoToPly: (ply: number) => void;
}) {
  const [annotated, setAnnotated] = useState<AnnotatedPly[] | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const runAnnotation = async () => {
    if (progress) return;
    setProgress({ done: 0, total: 1 });
    const result = await annotateFinale(fens, sans, getEngine(), 12, (done, total) =>
      setProgress({ done, total }),
    );
    setProgress(null);
    setAnnotated(result);
  };

  const turningPoint = annotated?.reduce<AnnotatedPly | null>(
    (worst, a) => (a.loss >= 100 && a.loss > (worst?.loss ?? 0) ? a : worst),
    null,
  );

  return (
    <div className="postmortem" aria-live="polite">
      <div className="pm-head">
        <span className="pm-result">{ending.result}</span>
        <span className="pm-name">{ending.name}</span>
      </div>
      <p className="pm-summary">{ending.summary}</p>
      <p className="pm-history">{ending.history}</p>

      {milestones.length > 0 && (
        <div className="pm-journey">
          <div className="pm-title">The game's journey through named territory</div>
          <ol>
            {milestones.map((m) => (
              <li key={`${m.kind}-${m.ply}-${m.label}`}>
                <button className="pm-ply" onClick={() => onGoToPly(m.ply)} title="view this position">
                  {plyLabel(m.ply)}
                </button>
                <span className={`pm-kind pm-kind-${m.kind}`}>{m.kind}</span>
                <span>{m.label}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {sans.length > 0 && !annotated && (
        <button className="pm-annotate" onClick={runAnnotation} disabled={Boolean(progress)}>
          {progress ? `Annotating… ${progress.done}/${progress.total}` : '✒ Annotate the finale'}
        </button>
      )}

      {annotated && (
        <div className="pm-finale">
          <div className="pm-title">The finale, annotated</div>
          <div className="pm-moves">
            {annotated.map((a) => (
              <button
                key={a.ply}
                className={`pm-move${a.glyph === '??' ? ' blunder' : a.glyph === '?' ? ' mistake' : a.glyph === '?!' ? ' inaccuracy' : ''}`}
                onClick={() => onGoToPly(a.ply)}
                title={judgement(a) || 'holds the evaluation'}
              >
                <span className="pm-move-no">{plyLabel(a.ply)}</span>
                {a.san}
                {a.glyph && <span className="pm-glyph">{a.glyph}</span>}
              </button>
            ))}
          </div>
          {turningPoint && (
            <p className="pm-turning">
              The turning point: <strong>{plyLabel(turningPoint.ply)} {turningPoint.san}{turningPoint.glyph}</strong> —{' '}
              {judgement(turningPoint)}. Click any move to revisit it.
            </p>
          )}
          <p className="pm-glyph-note">
            ?? blunder · ? mistake · ?! inaccuracy — the shorthand of chess annotation, born in
            19th-century chess columns and standardized by the Chess Informant's language-free symbols
            (1966).
          </p>
        </div>
      )}
    </div>
  );
}
