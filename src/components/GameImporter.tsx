import { useState } from 'react';
import { fetchGames, type FetchedGame } from '../lib/fetchGames';
import { matchOpening } from '../lib/openings';
import { journeyMilestones } from '../lib/postmortem';

interface Chronicled extends FetchedGame {
  /** Most specific named line the game reached, if any. */
  openingName: string | null;
  /** Named ground beyond the opening: first structure / endgame / tactics. */
  waypoints: string[];
}

/**
 * Import a player's recent games from lichess or chess.com and chronicle
 * them: each game is resolved against the atlas (opening line, structures,
 * endgames, named tactics) before it ever touches the board.
 */
export default function GameImporter({
  ready,
  onLoad,
}: {
  ready: boolean;
  onLoad: (sans: string[]) => void;
}) {
  const [site, setSite] = useState<FetchedGame['site']>('lichess');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [games, setGames] = useState<Chronicled[] | null>(null);
  const [fetchedFor, setFetchedFor] = useState('');

  const chronicle = (g: FetchedGame): Chronicled => {
    const m = matchOpening(g.sans);
    const waypoints = journeyMilestones(g.sans)
      .filter((w) => w.kind !== 'opening')
      .map((w) => w.label);
    return { ...g, openingName: m?.entry.name ?? null, waypoints };
  };

  const run = async () => {
    const user = username.trim();
    if (!user || loading) return;
    setLoading(true);
    setError(null);
    try {
      const fetched = await fetchGames(site, user, 20);
      setGames(fetched.map(chronicle));
      setFetchedFor(user);
      if (fetched.length === 0) setError('No standard games found for that account.');
    } catch (e) {
      setGames(null);
      setError(e instanceof Error ? e.message : 'Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  // The player's most-visited named territory across the fetched games.
  const homeGround = (() => {
    if (!games || games.length === 0) return null;
    const counts = new Map<string, number>();
    for (const g of games) {
      // Count by the family name (before the colon) so variations aggregate.
      const family = g.openingName?.split(':')[0];
      if (family) counts.set(family, (counts.get(family) ?? 0) + 1);
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return top && top[1] > 1 ? { name: top[0], n: top[1], of: games.length } : null;
  })();

  return (
    <details className="presets importer">
      <summary>
        <span className="panel-icon" aria-hidden="true">📜</span>
        <span className="panel-text">
          <span className="panel-title">Chronicle your own games</span>
          <span className="panel-sub">lichess · chess.com — your last 20, resolved against the atlas</span>
        </span>
      </summary>
      <div className="importer-form">
        <div className="importer-sites" role="radiogroup" aria-label="game site">
          {(['lichess', 'chess.com'] as const).map((s) => (
            <button key={s} className={site === s ? 'active' : ''} onClick={() => setSite(s)}>
              {s}
            </button>
          ))}
        </div>
        <input
          className="importer-user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder={`your ${site} username`}
          aria-label={`${site} username`}
        />
        <button className="importer-fetch" onClick={run} disabled={!ready || loading || !username.trim()}>
          {loading ? 'Fetching…' : ready ? 'Fetch last 20' : 'atlas loading…'}
        </button>
      </div>
      {error && <div className="pgn-error">{error}</div>}
      {homeGround && (
        <p className="importer-home">
          Your most-visited territory: <strong>{homeGround.name}</strong> — {homeGround.n} of{' '}
          {homeGround.of} games.
        </p>
      )}
      {games && games.length > 0 && (
        <div className="importer-list">
          {games.map((g, i) => (
            <button
              className="importer-game"
              key={`${g.at}-${i}`}
              onClick={() => onLoad(g.sans)}
              title="open this game on the board"
            >
              <span className="imp-players">
                <strong className={g.white.toLowerCase() === fetchedFor.toLowerCase() ? 'imp-you' : ''}>{g.white}</strong>
                {' – '}
                <strong className={g.black.toLowerCase() === fetchedFor.toLowerCase() ? 'imp-you' : ''}>{g.black}</strong>
                <span className="imp-result">{g.result}</span>
              </span>
              <span className="imp-meta">
                {g.at > 0 && <span>{new Date(g.at).toLocaleDateString()}</span>}
                {g.speed && <span>{g.speed}</span>}
                <span>{Math.ceil(g.sans.length / 2)} moves</span>
              </span>
              <span className="imp-chronicle">
                {g.openingName ?? 'Out of book from the start'}
                {g.waypoints.length > 0 && <> · {g.waypoints.join(' · ')}</>}
              </span>
            </button>
          ))}
        </div>
      )}
    </details>
  );
}
