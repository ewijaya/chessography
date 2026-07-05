import type { OpeningEntry, Story } from '../types';
import { e4Stories } from './openings-e4';
import { d4Stories } from './openings-d4';
import { flankStories } from './openings-flank';
import { structureStories, endgameStories } from './patterns';

/** Every authored opening story (exported for validation tests). */
export const allOpeningStories: Story[] = [...e4Stories, ...d4Stories, ...flankStories];

const openingStoryMap = new Map<string, Story>(allOpeningStories.map((s) => [s.id, s]));
const patternStoryMap = new Map<string, Story>(
  [...structureStories, ...endgameStories].map((s) => [s.id, s]),
);

export function getPatternStory(id: string): Story | undefined {
  return patternStoryMap.get(id);
}

export interface OpeningStoryResult {
  story: Story;
  /** The lineage entry the story belongs to (may be an ancestor of the current line). */
  storyOf: OpeningEntry;
  /** True when the story comes from a parent line, not the exact line reached. */
  inherited: boolean;
}

/**
 * Find the story for the most specific named line reached. If the exact
 * line has no authored story yet, fall back to the nearest storied
 * ancestor: first the earlier lineage entries (most recent first), then
 * prefixes of the name itself split on ':' and ',' (so "Ruy Lopez:
 * Morphy Defense, Anderssen Variation" can inherit from "Ruy Lopez:
 * Morphy Defense" or "Ruy Lopez" even when transposition skipped them).
 */
export function getOpeningStory(lineage: OpeningEntry[]): OpeningStoryResult | null {
  for (let i = lineage.length - 1; i >= 0; i--) {
    const entry = lineage[i];
    const names = [entry.name, ...ancestorNames(entry.name)];
    for (const n of names) {
      const story = openingStoryMap.get(n);
      if (story) {
        return {
          story,
          storyOf: entry,
          inherited: i < lineage.length - 1 || n !== lineage[lineage.length - 1].name,
        };
      }
    }
  }
  return null;
}

/** "A: B, C" -> ["A: B", "A"] — name prefixes from most to least specific. */
function ancestorNames(name: string): string[] {
  const out: string[] = [];
  let rest = name;
  while (true) {
    const cut = Math.max(rest.lastIndexOf(','), rest.lastIndexOf(':'));
    if (cut === -1) break;
    rest = rest.slice(0, cut).trim();
    out.push(rest);
  }
  return out;
}

export const storyCounts = {
  openings: openingStoryMap.size,
  structures: structureStories.length,
  endgames: endgameStories.length,
};
