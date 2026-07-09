const GLYPHS: Record<string, string> = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};

/**
 * A tiny static board rendered from a FEN placement field — used for the
 * lineage position previews. Pure markup, no interaction, cheap enough to
 * render on hover.
 */
export default function MiniBoard({ fen, label }: { fen: string; label?: string }) {
  const placement = fen.split(' ')[0];
  const rows = placement.split('/');
  return (
    <div className="mini-board" role="img" aria-label={label ?? 'chess position'}>
      {rows.map((row, r) => {
        const cells: (string | null)[] = [];
        for (const ch of row) {
          if (/\d/.test(ch)) cells.push(...Array<null>(Number(ch)).fill(null));
          else cells.push(ch);
        }
        return cells.map((piece, f) => (
          <span key={`${r}-${f}`} className={`mb-sq ${(r + f) % 2 === 0 ? 'mb-light' : 'mb-dark'}`}>
            {piece ? GLYPHS[piece] : ''}
          </span>
        ));
      })}
    </div>
  );
}
