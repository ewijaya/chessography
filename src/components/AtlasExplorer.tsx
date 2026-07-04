import { useMemo, useState } from 'react';
import { bookEntries } from '../lib/openings';
import type { OpeningEntry } from '../types';

const SHOW_MAX = 150;

/**
 * Browse the whole opening atlas: search the named lines, click one and the
 * board walks its mainline — the inverse of discovering names by playing.
 */
export default function AtlasExplorer({ ready, onLoad }: { ready: boolean; onLoad: (entry: OpeningEntry) => void }) {
  const [query, setQuery] = useState('');
  const entries = useMemo(() => (ready ? bookEntries() : []), [ready]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.name.toLowerCase().includes(q) || e.eco.toLowerCase() === q);
  }, [entries, query]);

  return (
    <details className="presets atlas">
      <summary>Browse the opening atlas…</summary>
      <div className="atlas-body">
        <input
          type="search"
          className="atlas-search"
          placeholder={ready ? `Search ${entries.length.toLocaleString()} named lines (name or ECO)…` : 'Loading atlas…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={!ready}
        />
        <div className="atlas-list">
          {filtered.slice(0, SHOW_MAX).map((e) => (
            <button className="preset atlas-row" key={e.eco + e.name} onClick={() => onLoad(e)}>
              <span className="atlas-eco">{e.eco}</span> {e.name}
            </button>
          ))}
          {filtered.length > SHOW_MAX && (
            <div className="atlas-more">
              showing {SHOW_MAX} of {filtered.length.toLocaleString()} — refine the search
            </div>
          )}
          {ready && filtered.length === 0 && <div className="atlas-more">no line matches “{query}”</div>}
        </div>
      </div>
    </details>
  );
}
