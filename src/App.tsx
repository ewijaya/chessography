import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Chess, type Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import StoryPanel from './components/StoryPanel';
import { recognize } from './lib/recognize';
import { bookSize } from './lib/openings';
import { presets, type Preset } from './lib/presets';
import { Engine, LEVELS, type EngineLevel } from './lib/engine';
import { storyCounts } from './stories';
import './App.css';

type View = 'opening' | 'structure' | 'endgame';
type Opponent = 'human' | 'engine-black' | 'engine-white';
type Theme = 'dark' | 'light';

const initialTheme = (): Theme => {
  const saved = localStorage.getItem('chessography-theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

export default function App() {
  const chessRef = useRef(new Chess());
  const engineRef = useRef<Engine | null>(null);
  const [fen, setFen] = useState(chessRef.current.fen());
  const [history, setHistory] = useState<string[]>([]);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [view, setView] = useState<View>('opening');
  const [opponent, setOpponent] = useState<Opponent>('human');
  const [level, setLevel] = useState<EngineLevel>('club');
  const [thinking, setThinking] = useState(false);
  const [selected, setSelected] = useState<Square | null>(null);
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const recognition = useMemo(() => recognize(chessRef.current, history), [fen, history]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('chessography-theme', theme);
  }, [theme]);

  const engineSide: 'w' | 'b' | null =
    opponent === 'engine-black' ? 'b' : opponent === 'engine-white' ? 'w' : null;

  const sync = () => {
    setSelected(null);
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

  // Engine plays whenever it's its turn on the live board. The fen check on
  // resolve guards against a stale reply after new game / undo / preset.
  useEffect(() => {
    const chess = chessRef.current;
    if (!engineSide || chess.turn() !== engineSide || chess.isGameOver()) return;
    engineRef.current ??= new Engine();
    const fenAtRequest = chess.fen();
    setThinking(true);
    engineRef.current.bestMove(fenAtRequest, level).then((uci) => {
      setThinking(false);
      if (chessRef.current.fen() !== fenAtRequest) return;
      try {
        chessRef.current.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] ?? 'q' });
      } catch {
        return;
      }
      sync();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, opponent, level]);

  const playerCanMove = () => {
    const chess = chessRef.current;
    return !chess.isGameOver() && (!engineSide || chess.turn() !== engineSide);
  };

  const tryMove = (from: Square, to: Square): boolean => {
    try {
      chessRef.current.move({ from, to, promotion: 'q' });
    } catch {
      return false;
    }
    sync();
    return true;
  };

  const onPieceDrop = ({ sourceSquare, targetSquare }: { piece: unknown; sourceSquare: string; targetSquare: string | null }) => {
    if (!targetSquare || !playerCanMove()) return false;
    return tryMove(sourceSquare as Square, targetSquare as Square);
  };

  // Click-to-move: click a piece to see its legal destinations, click one to
  // move there. Clicking the selected piece (or an empty non-target) deselects.
  const onSquareClick = ({ square }: { piece: unknown; square: string }) => {
    if (!playerCanMove()) return;
    const chess = chessRef.current;
    const sq = square as Square;
    if (selected && legalTargets.has(sq)) {
      tryMove(selected, sq);
      return;
    }
    const piece = chess.get(sq);
    setSelected(piece && piece.color === chess.turn() && sq !== selected ? sq : null);
  };

  const legalTargets = useMemo(() => {
    if (!selected) return new Set<Square>();
    return new Set(chessRef.current.moves({ square: selected, verbose: true }).map((m) => m.to));
  }, [selected, fen]);

  const squareStyles = useMemo(() => {
    const styles: Record<string, CSSProperties> = {};
    if (!selected) return styles;
    styles[selected] = { boxShadow: 'inset 0 0 0 3px rgba(212, 172, 60, 0.95)' };
    for (const sq of legalTargets) {
      styles[sq] = chessRef.current.get(sq)
        ? { boxShadow: 'inset 0 0 0 4px rgba(96, 153, 84, 0.85)' } // capture: ring around the piece
        : { backgroundImage: 'radial-gradient(circle, rgba(96, 153, 84, 0.85) 24%, transparent 26%)' };
    }
    return styles;
  }, [selected, legalTargets]);

  const newGame = (nextOpponent: Opponent = opponent) => {
    chessRef.current = new Chess();
    sync();
    if (nextOpponent === 'engine-white') setOrientation('black');
    if (nextOpponent === 'engine-black') setOrientation('white');
  };

  const selectOpponent = (o: Opponent) => {
    setOpponent(o);
    newGame(o);
  };

  // Against the engine, undo the engine's reply too, so it's your move again.
  const undo = () => {
    chessRef.current.undo();
    if (engineSide && chessRef.current.turn() === engineSide) chessRef.current.undo();
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
    setOpponent('human'); // presets are for exploring, not playing the engine
    sync();
    // A preset promises its group ("Pawn structures" → structure story), so
    // open that tab if the recognizer found it, even while still in book.
    const r = recognize(chess, chess.history());
    if ((p.group === 'structure' && r.structure) || (p.group === 'endgame' && r.endgame)) {
      setView(p.group);
    }
  };

  const gameStatus = (): string | null => {
    const chess = chessRef.current;
    if (chess.isCheckmate()) return chess.turn() === 'w' ? 'Checkmate — Black wins' : 'Checkmate — White wins';
    if (chess.isStalemate()) return 'Draw — stalemate';
    if (chess.isThreefoldRepetition()) return 'Draw — threefold repetition';
    if (chess.isInsufficientMaterial()) return 'Draw — insufficient material';
    if (chess.isDraw()) return 'Draw';
    if (thinking) return 'Stockfish is thinking…';
    if (chess.isCheck()) return 'Check';
    return null;
  };

  const moves = history;
  const movePairs: { no: number; white?: string; black?: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({ no: i / 2 + 1, white: moves[i], black: moves[i + 1] });
  }

  const boardColors =
    theme === 'dark'
      ? { dark: '#7d5a3a', light: '#e6d3a7' }
      : { dark: '#b58863', light: '#f0d9b5' };

  const boardOptions = {
    position: fen,
    onPieceDrop,
    onSquareClick,
    squareStyles,
    boardOrientation: orientation,
    darkSquareStyle: { backgroundColor: boardColors.dark },
    lightSquareStyle: { backgroundColor: boardColors.light },
    animationDurationInMs: 180,
  };

  const status = gameStatus();

  return (
    <div className="app">
      <header className="masthead">
        <h1>
          <span className="knight">♞</span>Chessography
        </h1>
        <span className="tagline">every named move carries a story — play, and read it</span>
        <button
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </header>

      <main className="layout">
        <div className="board-side">
          <div className="opponent-bar">
            <span className="opponent-label">Opponent</span>
            <div className="opponent-modes">
              <button className={opponent === 'human' ? 'active' : ''} onClick={() => selectOpponent('human')}>
                Two players
              </button>
              <button
                className={opponent === 'engine-black' ? 'active' : ''}
                onClick={() => selectOpponent('engine-black')}
              >
                Play White vs ♟
              </button>
              <button
                className={opponent === 'engine-white' ? 'active' : ''}
                onClick={() => selectOpponent('engine-white')}
              >
                Play Black vs ♙
              </button>
            </div>
            {opponent !== 'human' && (
              <select
                className="level-select"
                value={level}
                onChange={(e) => setLevel(e.target.value as EngineLevel)}
                aria-label="engine strength"
              >
                {(Object.keys(LEVELS) as EngineLevel[]).map((l) => (
                  <option key={l} value={l}>
                    {LEVELS[l].label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="board-frame">
            <Chessboard options={boardOptions} />
          </div>

          {status && <div className={`game-status${thinking ? ' thinking' : ''}`}>{status}</div>}

          <div className="controls">
            <button onClick={() => newGame()} disabled={moves.length === 0 && fen === new Chess().fen()}>
              New game
            </button>
            <button onClick={undo} disabled={moves.length === 0 || thinking}>
              Undo move
            </button>
            <button onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}>
              Flip board
            </button>
          </div>

          <div className="scoresheet" aria-label="moves played">
            {movePairs.length === 0 ? (
              <span className="empty">
                {opponent === 'human'
                  ? 'Scoresheet — moves appear here. You play both sides.'
                  : 'Scoresheet — moves appear here. Stockfish awaits.'}
              </span>
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
        {storyCounts.endgames} endgames · {bookSize.toLocaleString()} named positions from the lichess
        opening atlas (CC0) · engine: Stockfish 18 lite
      </footer>
    </div>
  );
}
