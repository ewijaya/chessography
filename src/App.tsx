import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Chess, type Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import StoryPanel from './components/StoryPanel';
import EvalBar from './components/EvalBar';
import PromotionPicker from './components/PromotionPicker';
import AtlasExplorer from './components/AtlasExplorer';
import { recognize } from './lib/recognize';
import { loadBook, bookSize } from './lib/openings';
import { presets, type Preset } from './lib/presets';
import { Engine, LEVELS, type EngineLevel, type Eval } from './lib/engine';
import { playSound } from './lib/sound';
import { storyCounts } from './stories';
import type { OpeningEntry } from './types';
import './App.css';

type View = 'opening' | 'structure' | 'endgame';
type Opponent = 'human' | 'engine-black' | 'engine-white';
type Theme = 'dark' | 'light';

const START_FEN = new Chess().fen();

const initialTheme = (): Theme => {
  const saved = localStorage.getItem('chessography-theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

export default function App() {
  const chessRef = useRef(new Chess());
  const engineRef = useRef<Engine | null>(null);
  const evalEngineRef = useRef<Engine | null>(null);
  const startFenRef = useRef(START_FEN);
  const [fen, setFen] = useState(chessRef.current.fen());
  const [history, setHistory] = useState<string[]>([]);
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [view, setView] = useState<View>('opening');
  const [opponent, setOpponent] = useState<Opponent>('human');
  const [level, setLevel] = useState<EngineLevel>('club');
  const [thinking, setThinking] = useState(false);
  const [selected, setSelected] = useState<Square | null>(null);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [bookReady, setBookReady] = useState(false);
  const [viewPly, setViewPly] = useState<number | null>(null); // null = live tip
  const [pendingPromo, setPendingPromo] = useState<{ from: Square; to: Square } | null>(null);
  const [muted, setMuted] = useState(() => localStorage.getItem('chessography-muted') === '1');
  const [evalOn, setEvalOn] = useState(() => localStorage.getItem('chessography-eval') !== '0');
  const [evalScore, setEvalScore] = useState<Eval | null>(null);
  const [pgnOpen, setPgnOpen] = useState(false);
  const [pgnText, setPgnText] = useState('');
  const [pgnError, setPgnError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadBook().then(() => setBookReady(true));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('chessography-theme', theme);
  }, [theme]);

  useEffect(() => localStorage.setItem('chessography-muted', muted ? '1' : '0'), [muted]);
  useEffect(() => localStorage.setItem('chessography-eval', evalOn ? '1' : '0'), [evalOn]);

  const engineSide: 'w' | 'b' | null =
    opponent === 'engine-black' ? 'b' : opponent === 'engine-white' ? 'w' : null;

  // ---------- position timeline (for move navigation) ----------

  /** FEN after each ply; index 0 is the game's starting position. */
  const fens = useMemo(() => {
    const replay = new Chess(startFenRef.current);
    const list = [replay.fen()];
    for (const san of history) {
      replay.move(san);
      list.push(replay.fen());
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, fen]);

  const verboseHistory = useMemo(() => chessRef.current.history({ verbose: true }), [history, fen]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayPly = viewPly ?? history.length;
  const displayFen = fens[displayPly] ?? fen;
  const isLive = viewPly === null;

  /** Board object at the displayed ply (for recognition + status while browsing). */
  const displayChess = useMemo(() => new Chess(displayFen), [displayFen]);

  const recognition = useMemo(
    () => recognize(displayChess, history.slice(0, displayPly)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayFen, history, bookReady],
  );

  // While browsing, the story follows the viewed position.
  useEffect(() => {
    if (!isLive) setView(recognition.primary ?? 'opening');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayPly]);

  const sync = () => {
    setSelected(null);
    setViewPly(null);
    setPendingPromo(null);
    setFen(chessRef.current.fen());
    setHistory(chessRef.current.history());
    const r = recognize(chessRef.current, chessRef.current.history());
    setView(r.primary ?? 'opening');
  };

  // ---------- sounds ----------

  const soundFor = (captured: boolean): void => {
    const chess = chessRef.current;
    if (chess.isGameOver()) playSound('gameover', muted);
    else if (chess.isCheck()) playSound('check', muted);
    else if (captured) playSound('capture', muted);
    else playSound('move', muted);
  };

  // ---------- engine opponent ----------

  // Engine plays whenever it's its turn on the live board. The fen check on
  // resolve guards against a stale reply after new game / undo / preset.
  useEffect(() => {
    const chess = chessRef.current;
    if (!engineSide || chess.turn() !== engineSide || chess.isGameOver() || !isLive) return;
    engineRef.current ??= new Engine();
    const fenAtRequest = chess.fen();
    setThinking(true);
    engineRef.current.bestMove(fenAtRequest, level).then((uci) => {
      setThinking(false);
      if (chessRef.current.fen() !== fenAtRequest) return;
      try {
        const mv = chessRef.current.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] ?? 'q' });
        soundFor(Boolean(mv.captured));
      } catch {
        return;
      }
      sync();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, opponent, level, viewPly]);

  // ---------- eval bar ----------

  const displayFenRef = useRef(displayFen);
  displayFenRef.current = displayFen;

  useEffect(() => {
    if (!evalOn) {
      setEvalScore(null);
      return;
    }
    // Terminal positions need no engine.
    if (displayChess.isCheckmate()) {
      setEvalScore({ mateIn: 0 });
      return;
    }
    if (displayChess.isGameOver()) {
      setEvalScore({ cp: 0 });
      return;
    }
    const t = setTimeout(() => {
      evalEngineRef.current ??= new Engine();
      const fenAtRequest = displayFen;
      evalEngineRef.current.evaluate(fenAtRequest, 12).then((ev) => {
        // Only publish if we're still looking at the same position.
        setEvalScore((prev) => (fenAtRequest === displayFenRef.current ? ev : prev));
      });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayFen, evalOn]);

  // ---------- moving ----------

  const playerCanMove = () => {
    const chess = chessRef.current;
    return isLive && !chess.isGameOver() && (!engineSide || chess.turn() !== engineSide);
  };

  const commitMove = (from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n'): boolean => {
    try {
      const mv = chessRef.current.move({ from, to, promotion });
      soundFor(Boolean(mv.captured));
    } catch {
      return false;
    }
    sync();
    return true;
  };

  /** Route a player's from→to intent: open the promotion picker when needed. */
  const tryMove = (from: Square, to: Square): boolean => {
    const promo = chessRef.current
      .moves({ square: from, verbose: true })
      .find((m) => m.to === to && m.promotion);
    if (promo) {
      setPendingPromo({ from, to });
      return true; // move completes (or cancels) via the picker
    }
    return commitMove(from, to);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, fen]);

  const squareStyles = useMemo(() => {
    const styles: Record<string, CSSProperties> = {};
    // Last move on the displayed position stays tinted.
    const last = verboseHistory[displayPly - 1];
    if (last) {
      styles[last.from] = { backgroundColor: 'rgba(212, 172, 60, 0.30)' };
      styles[last.to] = { backgroundColor: 'rgba(212, 172, 60, 0.38)' };
    }
    if (selected) {
      styles[selected] = { ...styles[selected], boxShadow: 'inset 0 0 0 3px rgba(212, 172, 60, 0.95)' };
      for (const sq of legalTargets) {
        styles[sq] = chessRef.current.get(sq)
          ? { ...styles[sq], boxShadow: 'inset 0 0 0 4px rgba(96, 153, 84, 0.85)' } // capture ring
          : { ...styles[sq], backgroundImage: 'radial-gradient(circle, rgba(96, 153, 84, 0.85) 24%, transparent 26%)' };
      }
    }
    return styles;
  }, [selected, legalTargets, verboseHistory, displayPly]);

  // ---------- navigation ----------

  const goToPly = (ply: number) => {
    const clamped = Math.max(0, Math.min(history.length, ply));
    setSelected(null);
    setViewPly(clamped === history.length ? null : clamped);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowLeft') goToPly(displayPly - 1);
      else if (e.key === 'ArrowRight') goToPly(displayPly + 1);
      else if (e.key === 'Home') goToPly(0);
      else if (e.key === 'End') goToPly(history.length);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayPly, history.length]);

  // ---------- game management ----------

  const adoptGame = (chess: Chess, startFen = START_FEN) => {
    chessRef.current = chess;
    startFenRef.current = startFen;
    sync();
  };

  const newGame = (nextOpponent: Opponent = opponent) => {
    adoptGame(new Chess());
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
    setOpponent('human'); // presets are for exploring, not playing the engine
    adoptGame(chess, p.fen ?? START_FEN);
    // A preset promises its group ("Pawn structures" → structure story), so
    // open that tab if the recognizer found it, even while still in book.
    const r = recognize(chess, chess.history());
    if ((p.group === 'structure' && r.structure) || (p.group === 'endgame' && r.endgame)) {
      setView(p.group);
    }
  };

  const loadAtlasLine = (entry: OpeningEntry) => {
    const chess = new Chess();
    try {
      chess.loadPgn(entry.pgn);
    } catch {
      return;
    }
    setOpponent('human');
    adoptGame(chess);
  };

  // Load a story's famous game and rewind to the start, ready to step through.
  const playFamousGame = (pgn: string) => {
    const chess = new Chess();
    try {
      chess.loadPgn(pgn);
    } catch {
      return;
    }
    setOpponent('human');
    adoptGame(chess);
    setViewPly(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const importPgn = () => {
    const chess = new Chess();
    try {
      chess.loadPgn(pgnText);
    } catch {
      setPgnError('Could not read that PGN — check the movetext.');
      return;
    }
    setPgnError(null);
    setPgnOpen(false);
    setPgnText('');
    setOpponent('human');
    adoptGame(chess);
  };

  const copyPgn = async () => {
    try {
      await navigator.clipboard.writeText(chessRef.current.pgn());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — leave the button state alone.
    }
  };

  // ---------- status ----------

  const gameStatus = (): string | null => {
    if (!isLive) {
      const moveNo = Math.ceil(displayPly / 2);
      return displayPly === 0
        ? 'Viewing the starting position — → or End returns to the game'
        : `Viewing move ${moveNo} (ply ${displayPly} of ${history.length}) — → steps forward, End returns to the game`;
    }
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
  const movePairs: { no: number; whiteIdx: number; white?: string; black?: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({ no: i / 2 + 1, whiteIdx: i, white: moves[i], black: moves[i + 1] });
  }

  const boardColors =
    theme === 'dark'
      ? { dark: '#7d5a3a', light: '#e6d3a7' }
      : { dark: '#b58863', light: '#f0d9b5' };

  const boardOptions = {
    position: displayFen,
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

          <div className="board-row">
            {evalOn && <EvalBar score={evalScore} orientation={orientation} />}
            <div className="board-frame">
              <Chessboard options={boardOptions} />
              {pendingPromo && (
                <PromotionPicker
                  color={chessRef.current.turn()}
                  onPick={(p) => {
                    const { from, to } = pendingPromo;
                    setPendingPromo(null);
                    commitMove(from, to, p);
                  }}
                  onCancel={() => setPendingPromo(null)}
                />
              )}
            </div>
          </div>

          {status && <div className={`game-status${thinking && isLive ? ' thinking' : ''}${!isLive ? ' viewing' : ''}`}>{status}</div>}

          <div className="controls">
            <button onClick={() => newGame()} disabled={moves.length === 0 && fen === START_FEN}>
              New game
            </button>
            <button onClick={undo} disabled={moves.length === 0 || thinking}>
              Undo move
            </button>
            <button onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}>
              Flip board
            </button>
            <button
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'unmute sounds' : 'mute sounds'}
              title={muted ? 'unmute sounds' : 'mute sounds'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
            <button
              className={evalOn ? 'active' : ''}
              onClick={() => setEvalOn((v) => !v)}
              title={evalOn ? 'hide evaluation bar' : 'show evaluation bar'}
            >
              eval
            </button>
            <button onClick={() => { setPgnOpen((v) => !v); setPgnError(null); }} title="import a game">
              Import PGN
            </button>
            <button onClick={copyPgn} disabled={moves.length === 0} title="copy this game as PGN">
              {copied ? 'Copied ✓' : 'Copy PGN'}
            </button>
          </div>

          {pgnOpen && (
            <div className="pgn-import">
              <textarea
                value={pgnText}
                onChange={(e) => setPgnText(e.target.value)}
                placeholder={'Paste a PGN here, e.g.\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 …'}
                rows={5}
              />
              {pgnError && <div className="pgn-error">{pgnError}</div>}
              <div className="pgn-actions">
                <button onClick={importPgn} disabled={!pgnText.trim()}>
                  Load game
                </button>
                <button onClick={() => { setPgnOpen(false); setPgnError(null); }}>Cancel</button>
              </div>
            </div>
          )}

          <div className="scoresheet" aria-label="moves played">
            {movePairs.length === 0 ? (
              <span className="empty">
                {opponent === 'human'
                  ? 'Scoresheet — moves appear here. Click a move to revisit it; ←/→ to step.'
                  : 'Scoresheet — moves appear here. Stockfish awaits.'}
              </span>
            ) : (
              movePairs.map((p) => (
                <span key={p.no}>
                  <span className="move-no">{p.no}.</span>
                  <button
                    className={`san${displayPly === p.whiteIdx + 1 ? ' current' : ''}`}
                    onClick={() => goToPly(p.whiteIdx + 1)}
                  >
                    {p.white}
                  </button>
                  {p.black && (
                    <button
                      className={`san${displayPly === p.whiteIdx + 2 ? ' current' : ''}`}
                      onClick={() => goToPly(p.whiteIdx + 2)}
                    >
                      {p.black}
                    </button>
                  )}
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

          <AtlasExplorer ready={bookReady} onLoad={loadAtlasLine} />
        </div>

        <StoryPanel recognition={recognition} view={view} onSelectView={setView} onPlayGame={playFamousGame} />
      </main>

      <footer className="footer">
        {storyCounts.openings} opening stories · {storyCounts.structures} structures ·{' '}
        {storyCounts.endgames} endgames ·{' '}
        {bookReady ? `${bookSize().toLocaleString()} named positions` : 'opening atlas loading…'} from the
        lichess opening atlas (CC0) · engine: Stockfish 18 lite
      </footer>
    </div>
  );
}
