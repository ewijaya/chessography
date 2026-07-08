import { Chess } from 'chess.js';

// Fetch a player's recent games from the two big public APIs. Both allow
// CORS from the browser, no auth needed. Variants are filtered out — the
// atlas only speaks standard chess.

export interface FetchedGame {
  site: 'lichess' | 'chess.com';
  white: string;
  black: string;
  result: '1-0' | '0-1' | '½–½';
  /** bullet / blitz / rapid / classical / daily … */
  speed?: string;
  /** Epoch ms of when the game ended (or started, for lichess). */
  at: number;
  sans: string[];
}

const resultFromWinner = (winner?: string): FetchedGame['result'] =>
  winner === 'white' ? '1-0' : winner === 'black' ? '0-1' : '½–½';

/** Recent standard games from lichess (ND-JSON streaming API). */
export async function fetchLichessGames(username: string, max = 20): Promise<FetchedGame[]> {
  const url = `https://lichess.org/api/games/user/${encodeURIComponent(username)}?max=${max}&moves=true&pgnInJson=false`;
  const res = await fetch(url, { headers: { Accept: 'application/x-ndjson' } });
  if (res.status === 404) throw new Error(`lichess doesn't know "${username}"`);
  if (!res.ok) throw new Error(`lichess replied ${res.status}`);
  const text = await res.text();
  const games: FetchedGame[] = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    let g: {
      variant?: string;
      speed?: string;
      createdAt?: number;
      winner?: string;
      moves?: string;
      players?: { white?: { user?: { name?: string }; aiLevel?: number }; black?: { user?: { name?: string }; aiLevel?: number } };
    };
    try {
      g = JSON.parse(line);
    } catch {
      continue;
    }
    if (g.variant && g.variant !== 'standard') continue;
    const sans = (g.moves ?? '').split(' ').filter(Boolean);
    if (sans.length === 0) continue;
    const name = (p?: { user?: { name?: string }; aiLevel?: number }) =>
      p?.user?.name ?? (p?.aiLevel ? `Stockfish level ${p.aiLevel}` : 'Anonymous');
    games.push({
      site: 'lichess',
      white: name(g.players?.white),
      black: name(g.players?.black),
      result: resultFromWinner(g.winner),
      speed: g.speed,
      at: g.createdAt ?? 0,
      sans,
    });
  }
  return games;
}

/** Recent standard games from chess.com (monthly archive API). */
export async function fetchChessComGames(username: string, max = 20): Promise<FetchedGame[]> {
  const archRes = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(username)}/games/archives`);
  if (archRes.status === 404) throw new Error(`chess.com doesn't know "${username}"`);
  if (!archRes.ok) throw new Error(`chess.com replied ${archRes.status}`);
  const { archives } = (await archRes.json()) as { archives: string[] };
  const games: FetchedGame[] = [];
  // Walk back from the most recent month until we have enough games.
  for (let i = archives.length - 1; i >= 0 && games.length < max; i--) {
    const res = await fetch(archives[i]);
    if (!res.ok) continue;
    const month = (await res.json()) as {
      games: {
        rules?: string;
        pgn?: string;
        end_time?: number;
        time_class?: string;
        white?: { username?: string };
        black?: { username?: string };
      }[];
    };
    for (const g of month.games.reverse()) {
      // newest first within the month
      if (games.length >= max) break;
      if (g.rules && g.rules !== 'chess') continue;
      if (!g.pgn) continue;
      const chess = new Chess();
      try {
        chess.loadPgn(g.pgn);
      } catch {
        continue;
      }
      const sans = chess.history();
      if (sans.length === 0) continue;
      const header = chess.getHeaders();
      const result = header.Result === '1-0' ? '1-0' : header.Result === '0-1' ? '0-1' : '½–½';
      games.push({
        site: 'chess.com',
        white: g.white?.username ?? header.White ?? 'White',
        black: g.black?.username ?? header.Black ?? 'Black',
        result,
        speed: g.time_class,
        at: (g.end_time ?? 0) * 1000,
        sans,
      });
    }
  }
  return games;
}

export function fetchGames(site: FetchedGame['site'], username: string, max = 20): Promise<FetchedGame[]> {
  return site === 'lichess' ? fetchLichessGames(username, max) : fetchChessComGames(username, max);
}
