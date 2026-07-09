import { dueCards, dueLabel, newCards, type Grade, type ProgressMap, type TrainerCard } from '../lib/trainer';

export interface DrillState {
  card: TrainerCard;
  /** Index of the next expected move. */
  idx: number;
  errors: number;
  /** Correction / hint message, shown until the next correct move. */
  flash: string | null;
  done: boolean;
}

const plyLabel = (i: number) => (i % 2 === 0 ? `${i / 2 + 1}.` : `${(i + 1) / 2}…`);

/**
 * The spaced-repetition drill UI. The card asks you to play a storied line
 * from memory on the real board (both sides — you are reciting the line);
 * App intercepts the moves and reports back through `drill`.
 */
export default function Trainer({
  ready,
  deck,
  progress,
  drill,
  now,
  onStart,
  onGrade,
  onHint,
  onQuit,
}: {
  ready: boolean;
  deck: TrainerCard[];
  progress: ProgressMap;
  drill: DrillState | null;
  now: number;
  onStart: (card: TrainerCard) => void;
  onGrade: (q: Grade) => void;
  onHint: () => void;
  onQuit: () => void;
}) {
  const due = dueCards(deck, progress, now);
  const fresh = newCards(deck, progress);
  const next = due[0] ?? fresh[0] ?? null;

  if (drill) {
    const { card, idx, errors, flash, done } = drill;
    return (
      <div className="drill-card" aria-live="polite">
        <div className="drill-head">
          <span className="eco-stamp">{card.eco}</span>
          <span className="drill-name">{card.name}</span>
          <button className="advice-close" onClick={onQuit} aria-label="quit drill">
            ×
          </button>
        </div>
        {!done ? (
          <>
            <p className="drill-ask">
              Play the line from memory — both sides. Move {idx + 1} of {card.sans.length}
              {errors > 0 && <span className="drill-errors"> · {errors} slip{errors === 1 ? '' : 's'}</span>}
            </p>
            <div className="drill-progress">
              {card.sans.map((san, i) => (
                <span key={i} className={i < idx ? 'played' : 'pending'}>
                  {i % 2 === 0 && <span className="move-no">{plyLabel(i)}</span>}
                  {i < idx ? san : '·'}
                </span>
              ))}
            </div>
            {flash && <p className="drill-flash">{flash}</p>}
            <button className="drill-hint" onClick={onHint}>
              show me (counts as a slip)
            </button>
          </>
        ) : (
          <>
            <p className="drill-ask">
              Line complete{errors === 0 ? ' — flawless.' : ` — ${errors} slip${errors === 1 ? '' : 's'} along the way.`} How
              did it feel?
            </p>
            <div className="drill-grades">
              <button onClick={() => onGrade('again')}>Again — soon</button>
              <button onClick={() => onGrade('good')}>Good</button>
              <button onClick={() => onGrade('easy')}>Easy</button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <details className="presets trainer">
      <summary>
        <span className="panel-icon" aria-hidden="true">🎓</span>
        <span className="panel-text">
          <span className="panel-title">
            Opening trainer
            {ready && due.length > 0 && <span className="panel-badge">{due.length} due</span>}
          </span>
          <span className="panel-sub">recite storied lines from memory, on a schedule</span>
        </span>
      </summary>
      <p className="trainer-blurb">
        Every storied line is a card. Read its story, then recite the moves on the board from memory —
        the scheduler brings each line back just before you'd forget it.
      </p>
      {!ready ? (
        <p className="trainer-blurb">atlas loading…</p>
      ) : (
        <>
          {next && (
            <button className="trainer-next" onClick={() => onStart(next)}>
              ▶ Drill next: {next.name} ({due.length > 0 ? 'review' : 'new line'})
            </button>
          )}
          <div className="trainer-list">
            {deck.map((c) => (
              <button className="trainer-row" key={c.id} onClick={() => onStart(c)}>
                <span className="atlas-eco">{c.eco}</span>
                <span className="trainer-row-name">{c.name}</span>
                <span className={`trainer-due${progress[c.id] && progress[c.id].due <= now ? ' is-due' : ''}`}>
                  {dueLabel(progress[c.id], now)}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </details>
  );
}
