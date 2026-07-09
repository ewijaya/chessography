import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Chess, type Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import StoryPanel, { type StoryView, type Starter } from './components/StoryPanel';
import EvalBar from './components/EvalBar';
import PromotionPicker from './components/PromotionPicker';
import AtlasExplorer from './components/AtlasExplorer';
import GameImporter from './components/GameImporter';
import Trainer, { type DrillState } from './components/Trainer';
import { recognize } from './lib/recognize';
import { loadBook, bookSize, bookEntries } from './lib/openings';
import { presets, type Preset } from './lib/presets';
import { Engine, LEVELS, type EngineLevel, type Eval } from './lib/engine';
import { buildAdvice, type MoveAdvice } from './lib/advice';
import { detectEnding, journeyMilestones } from './lib/postmortem';
import { encodeGame, decodeGame } from './lib/share';
import { buildDeck, grade, loadProgress, nextCard, saveProgress, type Grade, type ProgressMap, type TrainerCard } from './lib/trainer';
import Postmortem from './components/Postmortem';
import { playSound } from './lib/sound';
import { storyCounts, allOpeningStories } from './stories';
import type { OpeningEntry } from './types';
import './App.css';

type View = StoryView;
type Opponent = 'human' | 'engine-black' | 'engine-white';
type Theme = 'dark' | 'light';

const START_FEN = new Chess().fen();

const initialTheme = (): Theme => {
  const saved = localStorage.getItem('chessography-theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

/**
 * A shared game arriving in the URL fragment. Decoded during state
 * INITIALIZATION (not in an effect) so the engine-opponent effect never
 * sees the shared position with the default engine opponent still set.
 */
const sharedArrival = (): { chess: Chess; startFen: string } | null => {
  const g = decodeGame(window.location.hash);
  if (!g) return null;
  const chess = new Chess();
  try {
    if (g.startFen) chess.load(g.startFen);
    for (const san of g.sans) chess.move(san);
  } catch {
    return null;
  }
  return { chess, startFen: g.startFen ?? START_FEN };
};

export default function App() {
  const [arrived] = useState(sharedArrival);
  const chessRef = useRef(arrived?.chess ?? new Chess());
  const engineRef = useRef<Engine | null>(null);
  const evalEngineRef = useRef<Engine | null>(null);
  const adviceEngineRef = useRef<Engine | null>(null);
  const postmortemEngineRef = useRef<Engine | null>(null);
  const startFenRef = useRef(arrived?.startFen ?? START_FEN);
  const [fen, setFen] = useState(chessRef.current.fen());
  const [history, setHistory] = useState<string[]>(chessRef.current.history());
  const [orientation, setOrientation] = useState<'white' | 'black'>('white');
  const [view, setView] = useState<View>('opening');
  const [opponent, setOpponent] = useState<Opponent>(arrived ? 'human' : 'engine-black');
  const [level, setLevel] = useState<EngineLevel>('club');
  const [thinking, setThinking] = useState(false);
  const [selected, setSelected] = useState<Square | null>(null);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [bookReady, setBookReady] = useState(false);
  // null = live tip; a shared game arrives rewound to the start.
  const [viewPly, setViewPly] = useState<number | null>(arrived ? 0 : null);
  const [pendingPromo, setPendingPromo] = useState<{ from: Square; to: Square } | null>(null);
  const [muted, setMuted] = useState(() => localStorage.getItem('chessography-muted') === '1');
  const [evalOn, setEvalOn] = useState(() => localStorage.getItem('chessography-eval') !== '0');
  const [evalScore, setEvalScore] = useState<Eval | null>(null);
  const [pgnOpen, setPgnOpen] = useState(false);
  const [pgnText, setPgnText] = useState('');
  const [pgnError, setPgnError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [advice, setAdvice] = useState<MoveAdvice | null>(null);
  const [advising, setAdvising] = useState(false);
  const [shared, setShared] = useState(false);
  const [drill, setDrill] = useState<DrillState | null>(null);
  const [trainerProgress, setTrainerProgress] = useState<ProgressMap>(() => loadProgress());

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
    () =>
      recognize(
        displayChess,
        // The opening atlas is keyed to games from the standard start; a
        // custom-FEN game's SANs don't replay from move one.
        startFenRef.current === START_FEN ? history.slice(0, displayPly) : [],
        verboseHistory[displayPly - 1],
      ),
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
    setAdvice(null);
    setFen(chessRef.current.fen());
    setHistory(chessRef.current.history());
    const chess = chessRef.current;
    const r = recognize(
      chess,
      startFenRef.current === START_FEN ? chess.history() : [],
      chess.history({ verbose: true }).at(-1),
    );
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

  // ---------- advice (best-move hint with its story) ----------

  // Full-strength Stockfish suggests a move for the player; the atlas and
  // story library supply the history of the line it leads into. Runs on a
  // dedicated engine instance so it never blocks the opponent or the eval bar.
  const requestAdvice = async () => {
    if (!playerCanMove() || advising) return;
    adviceEngineRef.current ??= new Engine();
    const fenAtRequest = chessRef.current.fen();
    setAdvising(true);
    const result = await adviceEngineRef.current.advise(fenAtRequest);
    setAdvising(false);
    // Stale if the position changed while the engine was thinking.
    if (chessRef.current.fen() !== fenAtRequest) return;
    setAdvice(buildAdvice(fenAtRequest, result));
  };

  const commitMove = (from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n'): boolean => {
    // Drill mode: the move must be the line's next move, or the board
    // snaps back and the slip is counted.
    if (drill && !drill.done) {
      let san: string;
      try {
        san = new Chess(chessRef.current.fen()).move({ from, to, promotion }).san;
      } catch {
        return false;
      }
      if (san !== drill.card.sans[drill.idx]) {
        setDrill({ ...drill, errors: drill.errors + 1, flash: `${san} isn't the line — try again, or ask for the move below.` });
        return false;
      }
    }
    try {
      const mv = chessRef.current.move({ from, to, promotion });
      soundFor(Boolean(mv.captured));
    } catch {
      return false;
    }
    sync();
    if (drill && !drill.done) {
      const idx = drill.idx + 1;
      setDrill({ ...drill, idx, flash: null, done: idx >= drill.card.sans.length });
    }
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

  // Keep the scoresheet's current move in view while stepping through.
  const scoresheetRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scoresheetRef.current?.querySelector('.san.current')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [displayPly]);

  // The story panel, for the mobile peek chip to scroll to.
  const storyRef = useRef<HTMLDivElement>(null);

  // ---------- game management ----------

  const adoptGame = (chess: Chess, startFen = START_FEN) => {
    chessRef.current = chess;
    startFenRef.current = startFen;
    setDrill(null);
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
    // In a drill, stepping back rewinds the recitation too.
    setDrill((d) => (d ? { ...d, idx: Math.max(0, d.idx - 1), flash: null, done: false } : d));
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
    const r = recognize(chess, chess.history(), chess.history({ verbose: true }).at(-1));
    if (p.group !== 'opening' && r[p.group]) {
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

  // The whole game rides in the URL fragment — the link IS the chronicle.
  const shareGame = async () => {
    const hash = encodeGame({
      sans: history,
      startFen: startFenRef.current === START_FEN ? undefined : startFenRef.current,
    });
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
    try {
      await navigator.clipboard.writeText(url);
      window.history.replaceState(null, '', hash);
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    } catch {
      // Clipboard unavailable — leave the button state alone.
    }
  };

  // A game fetched from lichess / chess.com, rewound for stepping through.
  const loadImported = (sans: string[]) => {
    const chess = new Chess();
    try {
      for (const san of sans) chess.move(san);
    } catch {
      return;
    }
    setOpponent('human');
    adoptGame(chess);
    setViewPly(0);
  };

  // ---------- opening trainer ----------

  const trainerDeck = useMemo(() => (bookReady ? buildDeck(bookEntries(), allOpeningStories) : []), [bookReady]);

  const startDrill = (card: TrainerCard) => {
    setOpponent('human');
    adoptGame(new Chess());
    setDrill({ card, idx: 0, errors: 0, flash: null, done: false });
  };

  const drillHint = () => {
    setDrill((d) =>
      d && !d.done ? { ...d, errors: d.errors + 1, flash: `The line continues ${d.card.sans[d.idx]}.` } : d,
    );
  };

  const gradeDrill = (q: Grade) => {
    if (!drill) return;
    const next = { ...trainerProgress, [drill.card.id]: grade(trainerProgress[drill.card.id], q, Date.now()) };
    setTrainerProgress(next);
    saveProgress(next);
    setDrill(null);
  };

  // ---------- post-mortem chronicle ----------

  // Appears when the LIVE game is finished (even while browsing history):
  // the ending named with its history, the game's named milestones, and an
  // on-demand engine annotation of the finale.
  const ending = useMemo(() => detectEnding(chessRef.current), [fen]); // eslint-disable-line react-hooks/exhaustive-deps
  const milestones = useMemo(
    () => (ending ? journeyMilestones(history, startFenRef.current) : []),
    [ending, history],
  );

  // ---------- check / checkmate callout ----------

  // Follows the DISPLAYED position, so it also fires while stepping through
  // a famous game or browsing history — not just on the live board.
  const checkState = displayChess.isCheckmate() ? 'CHECKMATE' : displayChess.isCheck() ? 'CHECK' : null;

  // ---------- captured pieces ----------

  // Diff the displayed board against the standard starting set. Clamped at
  // zero so promotions never produce negative counts; a promoted pawn still
  // reads as a captured pawn, which matches how players tally material.
  const captures = useMemo(() => {
    const counts = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    };
    for (const row of displayChess.board()) {
      for (const sq of row) {
        if (sq && sq.type !== 'k') counts[sq.color][sq.type]++;
      }
    }
    const initial = { p: 8, n: 2, b: 2, r: 2, q: 1 } as const;
    const value = { p: 1, n: 3, b: 3, r: 5, q: 9 } as const;
    const order = ['q', 'r', 'b', 'n', 'p'] as const;
    const missing = (color: 'w' | 'b') =>
      order.flatMap((t) => Array<keyof typeof value>(Math.max(0, initial[t] - counts[color][t])).fill(t));
    const byWhite = missing('b'); // black pieces off the board = White's captures
    const byBlack = missing('w');
    const points = (list: (keyof typeof value)[]) => list.reduce((s, t) => s + value[t], 0);
    return { byWhite, byBlack, diff: points(byWhite) - points(byBlack) };
  }, [displayChess]);

  const glyphs: Record<'w' | 'b', Record<string, string>> = {
    b: { q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }, // black pieces (White's captures)
    w: { q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' }, // white pieces (Black's captures)
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
    arrows:
      advice && isLive
        ? [{ startSquare: advice.from, endSquare: advice.to, color: 'rgba(96, 153, 84, 0.85)' }]
        : [],
    boardOrientation: orientation,
    darkSquareStyle: { backgroundColor: boardColors.dark },
    lightSquareStyle: { backgroundColor: boardColors.light },
    // Coordinates readable on both square colors (each label sits on the
    // opposite color's ink).
    darkSquareNotationStyle: { color: boardColors.light, fontSize: '11px', fontWeight: 600 },
    lightSquareNotationStyle: { color: boardColors.dark, fontSize: '11px', fontWeight: 600 },
    animationDurationInMs: 180,
  };

  const status = gameStatus();

  // ---------- player plates ----------

  const plateFor = (side: 'w' | 'b') => ({
    side,
    name:
      engineSide === side
        ? `Stockfish · ${LEVELS[level].label}`
        : engineSide
          ? 'You'
          : side === 'w'
            ? 'White'
            : 'Black',
    engine: engineSide === side,
    caps: side === 'w' ? captures.byWhite : captures.byBlack,
    capGlyphs: side === 'w' ? glyphs.b : glyphs.w,
    ahead: side === 'w' ? captures.diff : -captures.diff,
  });
  const topPlate = plateFor(orientation === 'white' ? 'b' : 'w');
  const bottomPlate = plateFor(orientation === 'white' ? 'w' : 'b');

  // ---------- mobile story peek ----------

  const peekName =
    recognition.primary === 'opening'
      ? recognition.opening?.entry.name
      : recognition.primary
        ? recognition[recognition.primary]?.name
        : null;

  // ---------- blank-page starters ----------

  const starters: Starter[] | undefined =
    history.length === 0 && isLive
      ? [
          {
            label: 'Play 1. e4',
            hint: 'and watch the first name appear',
            run: () => commitMove('e2', 'e4'),
          },
          {
            label: 'Visit the Marshall Attack',
            hint: 'a gambit saved up for a decade',
            run: () => {
              const p = presets.find((x) => x.label.includes('Marshall'));
              if (p) loadPreset(p);
            },
          },
          {
            label: 'Drill your first line',
            hint: 'recite a storied opening from memory',
            run: () => {
              const card = nextCard(trainerDeck, trainerProgress, Date.now());
              if (card) startDrill(card);
            },
          },
        ]
      : undefined;

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

          <div className={`player-plate plate-top${topPlate.engine && thinking && isLive ? ' is-thinking' : ''}`}>
            <span className="plate-name">
              {topPlate.engine && <span className="plate-dot" aria-hidden="true" />}
              {topPlate.name}
              {topPlate.engine && thinking && isLive && <span className="plate-thinking">thinking…</span>}
            </span>
            <span className="plate-caps" aria-label={`pieces captured by ${topPlate.name}`}>
              {topPlate.caps.map((t) => topPlate.capGlyphs[t]).join('')}
              {topPlate.ahead > 0 && <span className="cap-diff">+{topPlate.ahead}</span>}
            </span>
          </div>

          <div className="board-row">
            {evalOn && <EvalBar score={evalScore} orientation={orientation} />}
            <div className="board-frame">
              <Chessboard options={boardOptions} />
              {checkState && (
                <div
                  key={`${checkState}-${displayPly}`}
                  className={`check-badge${checkState === 'CHECKMATE' ? ' mate' : ''}`}
                  role="status"
                  aria-live="assertive"
                >
                  {checkState}
                </div>
              )}
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

          <div className={`player-plate plate-bottom${bottomPlate.engine && thinking && isLive ? ' is-thinking' : ''}`}>
            <span className="plate-name">
              {bottomPlate.engine && <span className="plate-dot" aria-hidden="true" />}
              {bottomPlate.name}
              {bottomPlate.engine && thinking && isLive && <span className="plate-thinking">thinking…</span>}
            </span>
            <span className="plate-caps" aria-label={`pieces captured by ${bottomPlate.name}`}>
              {bottomPlate.caps.map((t) => bottomPlate.capGlyphs[t]).join('')}
              {bottomPlate.ahead > 0 && <span className="cap-diff">+{bottomPlate.ahead}</span>}
            </span>
          </div>

          <div className="move-nav" role="group" aria-label="move navigation">
            <button onClick={() => goToPly(0)} disabled={displayPly === 0} title="start (Home)" aria-label="go to start">
              ⏮
            </button>
            <button onClick={() => goToPly(displayPly - 1)} disabled={displayPly === 0} title="back (←)" aria-label="previous move">
              ◀
            </button>
            <span className="move-nav-pos">
              {displayPly === 0 ? 'start' : `${Math.ceil(displayPly / 2)}${displayPly % 2 === 1 ? '.' : '…'} ${history[displayPly - 1] ?? ''}`}
            </span>
            <button
              onClick={() => goToPly(displayPly + 1)}
              disabled={displayPly >= history.length}
              title="forward (→)"
              aria-label="next move"
            >
              ▶
            </button>
            <button
              onClick={() => goToPly(history.length)}
              disabled={displayPly >= history.length}
              title="live position (End)"
              aria-label="go to live position"
            >
              ⏭
            </button>
          </div>

          {status && <div className={`game-status${!isLive ? ' viewing' : ''}`}>{status}</div>}

          {ending && (
            <Postmortem
              key={`${fen}-${history.length}`}
              ending={ending}
              milestones={milestones}
              fens={fens}
              sans={history}
              getEngine={() => (postmortemEngineRef.current ??= new Engine())}
              onGoToPly={goToPly}
            />
          )}

          <div className="controls">
            <button
              className="primary"
              onClick={requestAdvice}
              disabled={!playerCanMove() || advising}
              title="ask Stockfish for the best move — and the story behind it"
            >
              {advising ? 'Consulting…' : '💡 Advice'}
            </button>
            <span className="ctl-group" role="group" aria-label="game">
              <button onClick={() => newGame()} disabled={moves.length === 0 && fen === START_FEN}>
                New game
              </button>
              <button onClick={undo} disabled={moves.length === 0 || thinking}>
                Undo
              </button>
              <button onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}>
                Flip
              </button>
            </span>
            <span className="ctl-group" role="group" aria-label="sharing">
              <button onClick={() => { setPgnOpen((v) => !v); setPgnError(null); }} title="import a game">
                Import PGN
              </button>
              <button onClick={copyPgn} disabled={moves.length === 0} title="copy this game as PGN">
                {copied ? 'Copied ✓' : 'Copy PGN'}
              </button>
              <button onClick={shareGame} disabled={moves.length === 0} title="copy a link that carries this whole game">
                {shared ? 'Link copied ✓' : '🔗 Share'}
              </button>
            </span>
            <span className="ctl-group ctl-toggles" role="group" aria-label="settings">
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
            </span>
          </div>

          {advice && isLive && (
            <div className="advice-card" aria-live="polite">
              <div className="advice-head">
                <span className="advice-move">
                  Best move: <strong>{advice.san}</strong>
                </span>
                <button className="advice-close" onClick={() => setAdvice(null)} aria-label="dismiss advice">
                  ×
                </button>
              </div>
              <p className="advice-why">
                {advice.reasons.length > 0
                  ? advice.reasons.join('; ').replace(/^./, (c) => c.toUpperCase()) + '.'
                  : 'The engine likes this move best here.'}
              </p>
              {advice.line.length > 1 && (
                <p className="advice-line">expected line: {advice.line.join(' ')}</p>
              )}
              {advice.opening && (
                <div className="advice-story">
                  <div className="advice-story-head">
                    <span className="eco-stamp">{advice.opening.entry.eco}</span>
                    <span>
                      this move enters <strong>{advice.opening.entry.name}</strong>
                    </span>
                  </div>
                  {advice.opening.storyResult ? (
                    <>
                      <p>{advice.opening.storyResult.story.significance}</p>
                      <details>
                        <summary>read the history</summary>
                        <p>
                          <em>Named after:</em> {advice.opening.storyResult.story.eponym}
                        </p>
                        <p>{advice.opening.storyResult.story.story}</p>
                      </details>
                    </>
                  ) : (
                    <p>
                      A named position in the atlas — play it and the full story panel takes over on the
                      right.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <Trainer
            ready={bookReady}
            deck={trainerDeck}
            progress={trainerProgress}
            drill={drill}
            now={Date.now()}
            onStart={startDrill}
            onGrade={gradeDrill}
            onHint={drillHint}
            onQuit={() => setDrill(null)}
          />

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

          <div className="scoresheet" aria-label="moves played" ref={scoresheetRef}>
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
            <summary>
              <span className="panel-icon" aria-hidden="true">🏛</span>
              <span className="panel-text">
                <span className="panel-title">Visit a famous position…</span>
                <span className="panel-sub">openings, structures, endgames and mates — one click each</span>
              </span>
            </summary>
            {(['opening', 'structure', 'endgame', 'tactic'] as const).map((group) => (
              <div key={group}>
                <div className="preset-group">
                  {group === 'opening'
                    ? 'Openings'
                    : group === 'structure'
                      ? 'Pawn structures'
                      : group === 'endgame'
                        ? 'Endgames'
                        : 'Named mates & tactics'}
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

          <GameImporter ready={bookReady} onLoad={loadImported} />
        </div>

        <div className="story-wrap" ref={storyRef}>
          <StoryPanel
            recognition={recognition}
            view={view}
            onSelectView={setView}
            onPlayGame={playFamousGame}
            starters={starters}
          />
        </div>
      </main>

      {peekName && (
        <button
          className="story-peek"
          onClick={() => storyRef.current?.scrollIntoView({ behavior: 'smooth' })}
          aria-label={`read the story of ${peekName}`}
        >
          <span className="peek-book" aria-hidden="true">📖</span>
          <span className="peek-name">{peekName}</span>
          <span aria-hidden="true">→</span>
        </button>
      )}

      <footer className="footer">
        <div className="footer-meta">
          {storyCounts.openings} opening stories · {storyCounts.structures} structures ·{' '}
          {storyCounts.endgames} endgames · {storyCounts.tactics} named tactics ·{' '}
          {bookReady ? `${bookSize().toLocaleString()} named positions` : 'opening atlas loading…'} from the
          lichess opening atlas (CC0) · engine: Stockfish 18 lite · <a href="/atlas/">read the story atlas</a>
        </div>
        <div className="footer-copyright">© 2026 Edward Wijaya</div>
      </footer>
    </div>
  );
}
