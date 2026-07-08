import type { OpeningEntry, Story } from '../types';

// Spaced-repetition opening trainer. The premise of the whole app is that
// stories make names memorable — the trainer closes the loop: recite the
// storied line on the board from memory, and an SM-2-style scheduler
// decides when you should recite it again.

export interface TrainerCard {
  /** Story id = exact dataset name of the line. */
  id: string;
  eco: string;
  name: string;
  sans: string[];
}

export interface CardProgress {
  reps: number;
  lapses: number;
  /** SM-2 ease factor. */
  ease: number;
  /** Current interval in days. */
  intervalDays: number;
  /** Epoch ms when the card is next due. */
  due: number;
}

export type ProgressMap = Record<string, CardProgress>;

export type Grade = 'again' | 'good' | 'easy';

const DAY = 86_400_000;
const STORAGE_KEY = 'chessography-trainer-v1';

const sansOfPgn = (pgn: string): string[] => pgn.split(/\s+/).filter((t) => !/^\d+\.$/.test(t));

/**
 * The deck: every authored opening story whose line exists in the atlas,
 * shortest (mainline) form. Order follows the atlas (ECO, then name).
 */
export function buildDeck(entries: OpeningEntry[], stories: Story[]): TrainerCard[] {
  const byName = new Map(entries.map((e) => [e.name, e]));
  const deck: TrainerCard[] = [];
  for (const s of stories) {
    const entry = byName.get(s.id);
    if (!entry) continue;
    deck.push({ id: s.id, eco: entry.eco, name: entry.name, sans: sansOfPgn(entry.pgn) });
  }
  return deck.sort((a, b) => a.eco.localeCompare(b.eco) || a.name.localeCompare(b.name));
}

export function loadProgress(): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as ProgressMap;
  } catch {
    return {};
  }
}

export function saveProgress(p: ProgressMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

/** Cards due for review (studied before, timer expired). */
export function dueCards(deck: TrainerCard[], progress: ProgressMap, now: number): TrainerCard[] {
  return deck.filter((c) => progress[c.id] && progress[c.id].due <= now);
}

/** Cards never studied. */
export function newCards(deck: TrainerCard[], progress: ProgressMap): TrainerCard[] {
  return deck.filter((c) => !progress[c.id]);
}

/** The next card to drill: due reviews first (most overdue first), then new. */
export function nextCard(deck: TrainerCard[], progress: ProgressMap, now: number): TrainerCard | null {
  const due = dueCards(deck, progress, now).sort((a, b) => progress[a.id].due - progress[b.id].due);
  if (due.length > 0) return due[0];
  return newCards(deck, progress)[0] ?? null;
}

/**
 * SM-2, simplified to three buttons. "Again" resets the card to ten
 * minutes and dents the ease; "good" follows the standard ladder
 * (1 day → 3 days → interval × ease); "easy" jumps ahead.
 */
export function grade(prev: CardProgress | undefined, q: Grade, now: number): CardProgress {
  const p: CardProgress = prev ?? { reps: 0, lapses: 0, ease: 2.5, intervalDays: 0, due: now };
  if (q === 'again') {
    return {
      ...p,
      reps: 0,
      lapses: p.lapses + 1,
      ease: Math.max(1.3, p.ease - 0.2),
      intervalDays: 0,
      due: now + 10 * 60_000,
    };
  }
  const bonus = q === 'easy' ? 1.5 : 1;
  const ease = q === 'easy' ? p.ease + 0.15 : p.ease;
  const intervalDays =
    p.reps === 0 ? 1 * bonus : p.reps === 1 ? 3 * bonus : Math.round(p.intervalDays * p.ease * bonus * 10) / 10;
  return { ...p, reps: p.reps + 1, ease, intervalDays, due: now + intervalDays * DAY };
}

/** Human phrasing of when a card comes back. */
export function dueLabel(p: CardProgress | undefined, now: number): string {
  if (!p) return 'new';
  const ms = p.due - now;
  if (ms <= 0) return 'due now';
  if (ms < DAY) return 'due today';
  const days = Math.round(ms / DAY);
  return days === 1 ? 'due tomorrow' : `due in ${days} days`;
}
