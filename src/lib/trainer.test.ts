import { beforeAll, describe, expect, it } from 'vitest';
import { buildDeck, dueCards, grade, newCards, nextCard, type ProgressMap } from './trainer';
import { bookEntries, loadBook } from './openings';
import { allOpeningStories } from '../stories';

beforeAll(() => loadBook());

const NOW = 1_750_000_000_000;
const DAY = 86_400_000;

describe('the deck', () => {
  it('has a card for every storied line in the atlas, mainline form', () => {
    const deck = buildDeck(bookEntries(), allOpeningStories);
    // Every authored story is an exact dataset name (enforced elsewhere),
    // so every story becomes a card.
    expect(deck.length).toBe(allOpeningStories.length);
    const ruy = deck.find((c) => c.id === 'Ruy Lopez')!;
    expect(ruy.sans).toEqual(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5']);
    expect(ruy.eco).toBe('C60');
  });
});

describe('SM-2 scheduling', () => {
  it('a new card graded good comes back in a day, then three, then grows', () => {
    const first = grade(undefined, 'good', NOW);
    expect(first.intervalDays).toBe(1);
    expect(first.due).toBe(NOW + DAY);
    const second = grade(first, 'good', NOW + DAY);
    expect(second.intervalDays).toBe(3);
    const third = grade(second, 'good', NOW + 4 * DAY);
    expect(third.intervalDays).toBeCloseTo(3 * 2.5, 5);
  });

  it('"again" resets the ladder, counts the lapse, and dents the ease', () => {
    let p = grade(undefined, 'good', NOW);
    p = grade(p, 'good', NOW + DAY);
    const lapsed = grade(p, 'again', NOW + 2 * DAY);
    expect(lapsed.reps).toBe(0);
    expect(lapsed.lapses).toBe(1);
    expect(lapsed.ease).toBeCloseTo(2.3, 5);
    expect(lapsed.due - (NOW + 2 * DAY)).toBe(10 * 60_000);
    // The ladder restarts from one day.
    expect(grade(lapsed, 'good', NOW + 3 * DAY).intervalDays).toBe(1);
  });

  it('"easy" jumps ahead and rewards the ease factor', () => {
    const p = grade(undefined, 'easy', NOW);
    expect(p.intervalDays).toBe(1.5);
    expect(p.ease).toBeCloseTo(2.65, 5);
  });

  it('ease never drops below 1.3', () => {
    let p = grade(undefined, 'good', NOW);
    for (let i = 0; i < 10; i++) p = grade(p, 'again', NOW);
    expect(p.ease).toBe(1.3);
  });
});

describe('queueing', () => {
  const deck = [
    { id: 'A', eco: 'C60', name: 'A', sans: ['e4'] },
    { id: 'B', eco: 'D06', name: 'B', sans: ['d4'] },
    { id: 'C', eco: 'A10', name: 'C', sans: ['c4'] },
  ];

  it('reviews come before new cards, most overdue first', () => {
    const progress: ProgressMap = {
      A: { reps: 1, lapses: 0, ease: 2.5, intervalDays: 1, due: NOW - DAY },
      B: { reps: 1, lapses: 0, ease: 2.5, intervalDays: 1, due: NOW - 2 * DAY },
    };
    expect(dueCards(deck, progress, NOW).map((c) => c.id).sort()).toEqual(['A', 'B']);
    expect(newCards(deck, progress).map((c) => c.id)).toEqual(['C']);
    expect(nextCard(deck, progress, NOW)?.id).toBe('B');
  });

  it('falls back to a new card when nothing is due, null when done', () => {
    const progress: ProgressMap = {
      A: { reps: 1, lapses: 0, ease: 2.5, intervalDays: 1, due: NOW + DAY },
    };
    expect(nextCard(deck, progress, NOW)?.id).toBe('B');
    const all: ProgressMap = {
      A: progress.A,
      B: { ...progress.A },
      C: { ...progress.A },
    };
    expect(nextCard(deck, all, NOW)).toBeNull();
  });
});
