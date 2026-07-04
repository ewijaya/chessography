import { useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import StoryPanel from './components/StoryPanel';
import { recognize } from './lib/recognize';
import { presets, type Preset } from './lib/presets';
import { storyCounts } from './stories';
import './App.css';

type View = 'opening' | 'structure' | 'endgame';

export default function App() {
  const chessRef = useRef(new Chess());
  const [fen, setFen] = useState(chessRef.current.fen());
  const [history, setHistory] = useState<string[]>([]);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [view, setView] = useState<View>('opening');

  const recognition = useMemo(() => recognize(chessRef.current, history), [fen, history]);

  const sync = () => {
    setFen(chessRef.current.fen());
    setHistory(chessRef.current.history());
    setView(recognitionPrimaryAfterSync());
  };

  // After a board change the primary recognition may shift (e.g. into an
  // endgame); recompute it directly so the story panel follows the game.
  const recognitionPrimaryAfterSync = (): View => {
    const r = recognize(chessRef.current, chessRef.current.history());
    return r.primary ?? 'opening';
  };

  const onPieceDrop = ({ sourceSquare, targetSquare }: { piece: unknown; sourceSquare: string; targetSquare: string | null }) => {
    if (!targetSquare) return false;
    try {
      chessRef.current.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    } catch {
      return false;
    }
    sync();
    return true;
  };

  const newGame = () => {
    chessRef.current = new Chess();
    sync();
  };

  const undo = () => {
    chessRef.current.undo();
    sync();
  };

  const loadPreset = (p: Preset) => {
    const chess = new Chess();
    if (p.moves) {
      for (const san of p.moves) chess.move(san);
    } else if (p.fen) {
      chess.load(p.fen);
    }
    chessRef.current = chess;
    sync();
  };

  const moves = history;
  const movePairs: { no: number; white?: string; black?: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({ no: i / 2 + 1, white: moves[i], black: moves[i + 1] });
  }

  const boardOptions = {
    position: fen,
    onPieceDrop,
    boardOrientation: orientation,
    darkSquareStyle: { backgroundColor: '#7d5a3a' },
    lightSquareStyle: { backgroundColor: '#e6d3a7' },
    animationDurationInMs: 180,
  };

  return (
    <div className="app">
      <header className="masthead">
        <h1>
          <span className="knight">♞</span>Chessography
        </h1>
        <span className="tagline">every named move carries a story — play, and read it</span>
      </header>

      <main className="layout">
        <div className="board-side">
          <div className="board-frame">
            <Chessboard options={boardOptions} />
          </div>

          <div className="controls">
            <button onClick={newGame} disabled={moves.length === 0 && fen === new Chess().fen()}>
              New game
            </button>
            <button onClick={undo} disabled={moves.length === 0}>
              Undo move
            </button>
            <button onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}>
              Flip board
            </button>
          </div>

          <div className="scoresheet" aria-label="moves played">
            {movePairs.length === 0 ? (
              <span className="empty">Scoresheet — moves appear here. You play both sides.</span>
            ) : (
              movePairs.map((p) => (
                <span key={p.no}>
                  <span className="move-no">{p.no}.</span>
                  <span className="san">{p.white}</span>
                  {p.black && <span className="san">{p.black}</span>}
                </span>
              ))
            )}
          </div>

          <details className="presets">
            <summary>Visit a famous position…</summary>
            {(['opening', 'structure', 'endgame'] as const).map((group) => (
              <div key={group}>
                <div className="preset-group">
                  {group === 'opening' ? 'Openings' : group === 'structure' ? 'Pawn structures' : 'Endgames'}
                </div>
                {presets
                  .filter((p) => p.group === group)
                  .map((p) => (
                    <button className="preset" key={p.label} onClick={() => loadPreset(p)}>
                      {p.label}
                    </button>
                  ))}
              </div>
            ))}
          </details>
        </div>

        <StoryPanel recognition={recognition} view={view} onSelectView={setView} />
      </main>

      <footer className="footer">
        {storyCounts.openings} opening stories · {storyCounts.structures} structures ·{' '}
        {storyCounts.endgames} endgames · 3,732 named positions from the lichess opening atlas (CC0)
      </footer>
    </div>
  );
}
