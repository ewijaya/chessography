import { useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import type { Recognition, Story } from '../types';
import { getOpeningStory, getPatternStory } from '../stories';
import MiniBoard from './MiniBoard';

function StorySections({ story, onPlayGame }: { story: Story; onPlayGame?: (pgn: string) => void }) {
  return (
    <>
      {story.aliases && story.aliases.length > 0 && (
        <p className="aka">also known as: {story.aliases.join(' · ')}</p>
      )}
      <div className="story-section">
        <h3>Named after</h3>
        <p>{story.eponym}</p>
      </div>
      <div className="story-section">
        <h3>Origin</h3>
        <p>{story.origin}</p>
      </div>
      <div className="story-section">
        <h3>The story</h3>
        <p>{story.story}</p>
      </div>
      <div className="story-section">
        <h3>Why it matters</h3>
        <p>{story.significance}</p>
      </div>
      {story.notableGames && story.notableGames.length > 0 && (
        <div className="story-section">
          <h3>Notable games</h3>
          <ul>
            {story.notableGames.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      )}
      {story.famousGame && onPlayGame && (
        <button className="play-famous" onClick={() => onPlayGame(story.famousGame!.pgn)}>
          ▶ Step through {story.famousGame.label}
        </button>
      )}
    </>
  );
}

function plyLabel(ply: number): string {
  const moveNo = Math.ceil(ply / 2);
  return ply % 2 === 1 ? `${moveNo}.` : `${moveNo}…`;
}

function OpeningView({ recognition, onPlayGame }: { recognition: Recognition; onPlayGame?: (pgn: string) => void }) {
  const opening = recognition.opening!;
  const { entry, lineage, inBook, atPly } = opening;
  const storyResult = getOpeningStory(lineage);
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  // FEN of each lineage position, computed once per line (replaying the
  // short book PGNs is cheap; lineage is a handful of entries).
  const lineageFens = useMemo(
    () =>
      lineage.map((l) => {
        const chess = new Chess();
        try {
          chess.loadPgn(l.pgn);
        } catch {
          return null;
        }
        return chess.fen();
      }),
    [lineage],
  );

  return (
    <div className="story-fade" key={entry.name + String(inBook)}>
      <div className="eyebrow">
        <span className="eco-stamp stamp-press">{entry.eco}</span>
        <span>Opening · named line</span>
      </div>
      <h2 className="named-title">{entry.name}</h2>
      {!inBook && (
        <p className="departed">
          left the book after move {Math.ceil(atPly / 2)} — this is the last named position reached
        </p>
      )}
      {lineage.length > 1 && (
        <div className="ledger">
          <div className="ledger-title">Naming lineage — how the name narrowed · tap or hover a line to see its position</div>
          <ol>
            {lineage.map((l, i) => (
              <li
                key={l.name}
                className={i === lineage.length - 1 ? 'current' : ''}
                onMouseEnter={() => setPreviewIdx(i)}
                onMouseLeave={() => setPreviewIdx((p) => (p === i ? null : p))}
              >
                <span className="ply">{plyLabel(l.ply)}</span>
                <button
                  className="line-name"
                  onClick={() => setPreviewIdx((p) => (p === i ? null : i))}
                  aria-expanded={previewIdx === i}
                  title="show this position"
                >
                  {l.name}
                </button>
                {previewIdx === i && lineageFens[i] && (
                  <span className="lineage-preview">
                    <MiniBoard fen={lineageFens[i]!} label={`position of ${l.name}`} />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
      {storyResult ? (
        <>
          {storyResult.inherited && (
            <div className="inherited-note">
              story of the parent line “{storyResult.story.id}” — the deeper branch “{entry.name}” has its
              name recorded, its own story is still to be written
            </div>
          )}
          <StorySections story={storyResult.story} onPlayGame={onPlayGame} />
        </>
      ) : (
        <p className="no-story">
          This line’s name is recorded in the atlas ({entry.eco}), but its story has not been written yet.
          Every name has one — this page is waiting for it.
        </p>
      )}
    </div>
  );
}

const PATTERN_EYEBROW = {
  structure: { stamp: 'PATTERN', text: 'pawn structure · detected on the board' },
  endgame: { stamp: 'ENDGAME', text: 'named endgame · recognized from the position' },
  tactic: { stamp: 'TACTIC', text: 'named pattern · struck on this board' },
} as const;

function PatternView({ recognition, kind, onPlayGame }: { recognition: Recognition; kind: 'structure' | 'endgame' | 'tactic'; onPlayGame?: (pgn: string) => void }) {
  const match = recognition[kind]!;
  const story = getPatternStory(match.id);
  return (
    <div className="story-fade" key={match.id}>
      <div className="eyebrow">
        <span className="eco-stamp stamp-press">{PATTERN_EYEBROW[kind].stamp}</span>
        <span>{PATTERN_EYEBROW[kind].text}</span>
      </div>
      <h2 className="named-title">{match.name}</h2>
      <p className="detected-detail">{match.detail}</p>
      {story ? (
        <StorySections story={story} onPlayGame={onPlayGame} />
      ) : (
        <p className="no-story">Recognized, but its story has not been written yet.</p>
      )}
    </div>
  );
}

export type StoryView = 'opening' | 'structure' | 'endgame' | 'tactic';

export interface Starter {
  label: string;
  hint: string;
  run: () => void;
}

export default function StoryPanel({
  recognition,
  view,
  onSelectView,
  onPlayGame,
  starters,
}: {
  recognition: Recognition;
  view: StoryView;
  onSelectView: (v: StoryView) => void;
  onPlayGame?: (pgn: string) => void;
  starters?: Starter[];
}) {
  const available: StoryView[] = [];
  if (recognition.tactic) available.push('tactic');
  if (recognition.opening) available.push('opening');
  if (recognition.structure) available.push('structure');
  if (recognition.endgame) available.push('endgame');

  if (available.length === 0) {
    return (
      <section className="page" aria-live="polite">
        <div className="blank-page">
          <span className="big-knight">♞</span>
          <p>
            Make a move. The moment the game reaches anything with a name — an opening, a pawn structure, a
            famous endgame — its story appears on this page.
          </p>
          {starters && starters.length > 0 && (
            <div className="starters">
              {starters.map((s) => (
                <button key={s.label} className="starter" onClick={s.run}>
                  <span className="starter-label">{s.label}</span>
                  <span className="starter-hint">{s.hint}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  const active = available.includes(view) ? view : available[0];

  return (
    <section className="page" aria-live="polite">
      {available.length > 1 && (
        <div className="tabs" role="tablist">
          {available.map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={active === v}
              className={active === v ? 'active' : ''}
              onClick={() => onSelectView(v)}
            >
              {v}
            </button>
          ))}
        </div>
      )}
      {active === 'opening' && <OpeningView recognition={recognition} onPlayGame={onPlayGame} />}
      {active !== 'opening' && <PatternView recognition={recognition} kind={active} onPlayGame={onPlayGame} />}
    </section>
  );
}
