// Shareable game links: the whole game rides in the URL fragment, so a
// finished chronicle is a link you can send — no backend, nothing stored.
// Uses only APIs available in both the browser and Node (the static
// story-page generator reuses this encoding for its "open on the board"
// links).

export interface SharedGame {
  sans: string[];
  /** Present only when the game did not start from the standard position. */
  startFen?: string;
}

const toBase64Url = (s: string): string => {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
};

const fromBase64Url = (s: string): string => {
  const b64 = s.replaceAll('-', '+').replaceAll('_', '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

/** Encode a game as a URL fragment: "#g=<payload>". */
export function encodeGame(game: SharedGame): string {
  const payload = game.startFen ? `${game.startFen}|${game.sans.join(' ')}` : game.sans.join(' ');
  return `#g=${toBase64Url(payload)}`;
}

/** Decode a "#g=..." fragment (full hash string). Null when absent or unreadable. */
export function decodeGame(hash: string): SharedGame | null {
  const m = /^#g=([A-Za-z0-9_-]+)$/.exec(hash);
  if (!m) return null;
  try {
    const payload = fromBase64Url(m[1]);
    const bar = payload.indexOf('|');
    const startFen = bar === -1 ? undefined : payload.slice(0, bar);
    const moveText = bar === -1 ? payload : payload.slice(bar + 1);
    const sans = moveText.split(' ').filter(Boolean);
    if (!startFen && sans.length === 0) return null;
    return { sans, startFen };
  } catch {
    return null;
  }
}
