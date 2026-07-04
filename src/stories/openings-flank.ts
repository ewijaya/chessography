import type { Story } from '../types';

/** Stories for flank openings. Keys are exact lichess dataset names. */
export const flankStories: Story[] = [
  {
    id: 'English Opening',
    aliases: ['1.c4'],
    eponym: 'Named for the English master Howard Staunton (1810–1874), who wielded 1.c4 in his 1843 match victory over Saint-Amant — the unofficial world championship of its day.',
    origin: 'Staunton\'s matches of the 1840s; treated as eccentric for eighty years, then adopted by the hypermoderns and every world champion since.',
    story:
      'Staunton — Shakespeare scholar, chess columnist, and the man the standard chess pieces are named after — met the French champion Saint-Amant in 1843 and beat him with a flank pawn the era found baffling. The opening languished as "irregular" until the hypermoderns saw its point: attack d5 from the side, keep every central option in reserve, let Black overcommit first. Its modern résumé is unmatched — Botvinnik built systems on it, Fischer stunned Spassky with it in 1972 (abandoning his lifelong 1.e4 in game 6, arguably the finest game of the match), and Karpov, Kasparov and Carlsen all trusted world-title games to it.',
    significance:
      'The most flexible serious first move: it can become a reversed Sicilian, a Catalan, or a unique symmetrical battleground. Its motto is patience — control before occupation, information before commitment.',
    notableGames: ['Staunton–Saint-Amant, Paris 1843', 'Fischer–Spassky, Reykjavík 1972 (game 6)', 'Kasparov–Karpov, Seville 1987 (game 24 — Kasparov saved his title with 1.c4)'],
  },
  {
    id: 'Réti Opening',
    aliases: ['Reti Opening'],
    eponym: 'Richard Réti (1889–1929), Czechoslovak grandmaster, endgame-study composer of genius, and co-founder of hypermodernism.',
    origin: 'Réti\'s signature system (Nf3, c4, double fianchetto) crystallized in the early 1920s and announced itself at New York 1924.',
    story:
      'Réti was the artist of the hypermodern revolution — his book "Modern Ideas in Chess" its most elegant statement, his endgame study (the impossible king chase K-h8 catching a pawn two files away) its most famous artwork. At New York 1924 he did the unthinkable: beat Capablanca, ending the world champion\'s EIGHT-YEAR unbeaten run, with his own opening — knights and fianchettoed bishops encircling a center his pawns never entered. The chess world treated the game like a scientific proof: the classical center could be beaten by pressure from the wings. He died of scarlet fever at thirty-nine, his opening now permanent.',
    significance:
      'The purest hypermodern system: control the center with pieces, strike with c4 and the fianchettos, transpose at will. Half of modern "1.Nf3 move-order chess" is Réti\'s legacy in daily use.',
    notableGames: ['Réti–Capablanca, New York 1924', 'Réti–Bogoljubov, New York 1924 (a brilliancy-prize miniature)'],
  },
  {
    id: 'Zukertort Opening',
    aliases: ['1.Nf3'],
    eponym: 'Johannes Zukertort (1842–1888), Polish-German master, polyglot, army surgeon (by his own colorful account), and loser of the first official World Championship match, 1886.',
    origin: 'Zukertort opened 1.Nf3 habitually in the 1870s–80s, long before the hypermoderns gave the move its philosophy.',
    story:
      'Zukertort was chess\'s great almost-champion: brilliant enough to win London 1883 ahead of Steinitz by three clear points, fragile enough to collapse in their 1886 title match — the first officially for the "Championship of the World" — after leading 4–1. His quiet knight move outlived his heartbreak: 1.Nf3 develops, controls e5, commits to nothing, and today it is the third most popular first move in chess, the professional\'s tool for steering games away from an opponent\'s preparation. The name honors the man who played it when it was merely odd.',
    significance:
      'The great non-committal move: it can transpose into almost any 1.d4 or 1.c4 system while dodging their sharpest defenses. Move-order chess — winning the opening before it starts — begins here.',
    notableGames: ['Zukertort–Blackburne, London 1883 (one of the most celebrated combinations of the 19th century)', 'Steinitz–Zukertort, WCh 1886'],
  },
];
