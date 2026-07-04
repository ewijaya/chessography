import type { Story } from '../types';

/** Stories for 1.d4 and flank openings. Keys are exact lichess dataset names. */
export const d4Stories: Story[] = [
  {
    id: 'Queen\'s Pawn Game',
    aliases: ['1.d4'],
    eponym: 'No person — the pawn in front of the queen.',
    origin: 'Known from chess\'s beginnings but a minority choice until the late 19th century, when positional theory revealed its depth.',
    story:
      'For centuries 1.d4 was the "quiet" brother of 1.e4 — Steinitz and the classical school changed that, showing it leads to a slower but no less ferocious fight for the center, one where the d-pawn is defended by the queen from the start and cannot be so easily counterattacked. By the 1920s–30s it had overtaken 1.e4 in elite practice, and the World Championship matches of that era (Capablanca, Alekhine, Euwe) were essentially long arguments about the Queen\'s Gambit.',
    significance:
      'The strategic mirror of 1.e4: the same central claim, but the resulting structures reward long-term planning — pawn chains, minority attacks, blockades — over immediate tactics. The gateway to the Indian defenses, the Gambit complexes, and half of opening theory.',
    notableGames: ['Capablanca–Alekhine, Buenos Aires WCh 1927 (thirty-two of thirty-four games began 1.d4)'],
  },
  {
    id: 'Queen\'s Gambit',
    aliases: ['2.c4'],
    eponym: 'Not a person — the queen\'s bishop\'s pawn is offered. And not truly a gambit: Black cannot profitably keep the pawn.',
    origin: 'Appears in the Göttingen manuscript (c. 1490), the oldest surviving work on modern chess — making it one of the oldest recorded openings.',
    story:
      'The "gambit" is a polite fiction: after 2...dxc4 White regains the pawn at leisure (3.e3 b5? 4.a4 collapses Black\'s grip), which is precisely why the opening is eternal — it offers a pawn that cannot be kept, gaining central control either way. It ruled the classical era so completely that the 1927 Capablanca–Alekhine World Championship became a Queen\'s Gambit monoculture. In 2020 it acquired the strangest credential in opening history: a Netflix drama named after it became the most-watched series in the world and sent chess set sales up tenfold.',
    significance:
      'The foundational strategic opening: White trades a wing pawn\'s tension for central dominance. Every serious player must know its Declined, Accepted and Slav responses — they are the grammar of closed-game chess.',
    notableGames: ['Capablanca–Alekhine WCh 1927', 'Kasparov–Karpov WCh matches (QGD battles, 1984–87)'],
  },
  {
    id: 'Queen\'s Gambit Declined',
    aliases: ['QGD', '2...e6'],
    eponym: 'Not an eponym — Black declines the offered pawn, holding the center with 2...e6.',
    origin: 'The classical main line of 1.d4 since the Steinitz era; the orthodox defense was THE battlefield of the 1920s–30s championship matches.',
    story:
      'Declining the gambit is the classical school\'s creed in a single move: keep the pawn duo d5/e6, concede nothing, accept a passive bishop as the price of soundness. Generations of world champions trusted it with their titles — Lasker, Capablanca and Alekhine played the Orthodox QGD against each other so relentlessly that 1920s newspapers complained chess was solved. It was where Capablanca\'s machine-like technique and Alekhine\'s deep preparation met head-on in 1927, thirty-plus games of the same opening producing one of the tensest matches ever played.',
    significance:
      'The most trusted defense in chess history: an unbreakable central formation whose small concession — the c8 bishop\'s freedom — generates a century of plans (the Tartakower, Lasker and Cambridge Springs systems each "solve" it differently). Still the bedrock of elite repertoires.',
    notableGames: ['Capablanca–Alekhine, WCh 1927 (game 34 decided the title in a QGD)', 'Kasparov–Karpov, Moscow 1984–85 (the endless QGD siege)'],
  },
  {
    id: 'Queen\'s Gambit Accepted',
    aliases: ['QGA', '2...dxc4'],
    eponym: 'Not an eponym — Black takes the pawn.',
    origin: 'Analyzed in the earliest sources (Göttingen manuscript, Lucena); rehabilitated repeatedly, most notably in the 1930s and by Kasparov\'s use in the 1980s.',
    story:
      'Taking the pawn looks like an amateur\'s greed — every beginner learns Black cannot hold c4 — but the point is subtler: Black surrenders the center to gain free development and the ...c5 break, arguing the pawn recapture costs White time. The opening\'s reputation has swung with fashion for five hundred years: suspect in the classical era, trusted by Alekhine (who defended it in his 1937 title match), and a periodic elite weapon ever since. It offers 1.d4 players the closest thing to open-game clarity in the closed openings.',
    significance:
      'The dynamic counterpart to the QGD: instead of a fortress, Black chooses piece activity and a clean structure at the cost of the center. The eternal lesson: a "won" pawn returned at the right moment is a tempo invested, not material lost.',
    notableGames: ['Euwe–Alekhine, WCh 1937 (QGA battles)', 'Kasparov\'s QGA in the 1980s'],
  },
  {
    id: 'Slav Defense',
    aliases: ['2...c6'],
    eponym: 'Named for the great Slavic masters who developed it — Alapin, Alekhine, Bogoljubov and Vidmar chief among them.',
    origin: 'Analyzed from the 1920s as the "Slav" school\'s answer to the QGD\'s bad bishop; central to the Euwe–Alekhine World Championship matches of 1935 and 1937.',
    story:
      'The Slav fixes the QGD\'s one flaw: by supporting d5 with the c-pawn instead of the e-pawn, Black keeps the diagonal open for the queen\'s bishop — the piece the QGD buries alive. The refinement obsessed the strongest Slavic-speaking players of the interwar years, and the name honored their collective effort. Its main line (with ...dxc4 and ...Bf5) became one of the most respected equalizing systems in chess, and a century later engines confirm the old masters\' judgment: the Slav remains one of the very hardest defenses to crack.',
    significance:
      'The "improved QGD": same granite center, free bishop. Its cost — the c6 square and a slower queenside — defines the middlegame plans on both sides. With the Semi-Slav it forms the most durable defensive complex in 1.d4 theory.',
    notableGames: ['Euwe–Alekhine, WCh 1935 (the Slav as main battlefield)', 'Kramnik\'s Slav fortress era, 2000s'],
  },
  {
    id: 'Semi-Slav Defense',
    aliases: ['...e6 + ...c6 vs the Queen\'s Gambit'],
    eponym: 'Named as the hybrid it is — half Slav (...c6), half QGD (...e6), and more ambitious than either.',
    origin: 'The Meran Variation was analyzed by Akiba Rubinstein at the Meran tournament of 1924; Botvinnik\'s system (with ...dxc4 and ...b5 held back for war) was forged in the 1940s.',
    story:
      'The Semi-Slav plays both supporting moves and dares White to prove the light-squared bishop is really buried — because Black plans to take on c4 and blast it open with ...b5, ...Bb7 and ...c5 at the moment of maximum violence. Its two great tabiyas are named for a spa town (Meran 1924, where Rubinstein unveiled the plan) and a scientist (the Botvinnik System, a forcing labyrinth where both kings frequently die in the center and computer analysis has raged for eighty years). The Anti-Moscow Gambit revival of the 2000s made it, for a while, the sharpest mainstream opening on earth.',
    significance:
      'The fighting soul of the Queen\'s Gambit complex: Black accepts strategic risk to play for a win with the black pieces. The Botvinnik System in particular is theory\'s deepest jungle — a single prepared novelty at move twenty-five can decide a grandmaster game.',
    notableGames: ['Botvinnik–Denker, USSR–USA radio match 1945', 'Topalov–Kramnik, Elista WCh 2006 (Anti-Moscow wars)', 'Aronian–Anand, Wijk aan Zee 2013 (a modern Meran immortal)'],
  },
  {
    id: 'King\'s Indian Defense',
    aliases: ['KID'],
    eponym: '"Indian" honors Moheschunder Bannerjee, a Bengali player of the 1850s whose fianchetto systems against John Cochrane in Calcutta gave all "Indian" defenses their name.',
    origin: 'Sporadic for a century, then rehabilitated in the 1940s by Bronstein, Boleslavsky and Geller, who proved Black\'s counterattack was real.',
    story:
      'Cochrane, a British barrister in India, recorded hundreds of games against "the Brahmin," whose native rules (pawns moving one square) had taught him fianchetto structures Europeans found bizarre. A century later, Soviet analysts turned the despised setup into the most dangerous counterattacking defense in chess: Black concedes the entire center, castles, and then launches ...e5, ...f5, ...g4 at White\'s king while White storms the queenside — a race where Black\'s prize is checkmate. Bronstein nearly won a world title with it; Fischer and Kasparov made it a legend; Kasparov abandoned it in 1997 only after Kramnik kept beating him with his own weapon.',
    significance:
      'Chess\'s great asymmetric bargain: space now versus attack later. The mutual-races middlegame it produces (Mar del Plata structure) is one of the most studied and most terrifying in theory — engines have blunted it at the top, but below the stratosphere it remains a king-hunter\'s home.',
    notableGames: ['Taimanov–Najdorf, Zurich 1953 (the classic ...g4 avalanche)', 'Kasparov\'s KID masterpieces vs Karpov', 'Fischer\'s "game of the century"-era KIDs'],
  },
  {
    id: 'Nimzo-Indian Defense',
    aliases: ['Nimzo'],
    eponym: 'Aron Nimzowitsch (1886–1935), Latvian-born hypermodern prophet, author of "My System" — chess\'s most influential (and most argumentative) strategy book.',
    origin: 'Developed by Nimzowitsch in the 1910s–20s as hypermodernism\'s answer to 1.d4: control the center with pieces, not pawns.',
    story:
      'Nimzowitsch — brilliant, cantankerous, famous for standing on his head between moves and once shouting "Why must I lose to this idiot?" after a defeat — distilled his whole philosophy into 3...Bb4: the pin on the knight controls e4 without placing a single pawn in the center, and Black cheerfully gives the bishop pair to saddle White with doubled c-pawns (his beloved "blockade" targets). It was scandalous doctrine in 1920 and is simply the truth in 2020: the Nimzo-Indian is universally considered Black\'s soundest ambitious defense to 1.d4, so much so that avoiding it (via 3.Nf3 or 3.g3) defines entire White repertoires.',
    significance:
      'The most respected defense to the queen\'s pawn: every world champion since Capablanca has played it. Its themes — bishop-for-structure trades, dark-square blockades, the isolated pawn couple — are core curriculum for positional chess.',
    notableGames: ['Sämisch–Nimzowitsch, Copenhagen 1923 (the "Immortal Zugzwang Game")', 'Botvinnik–Capablanca, AVRO 1938 (the most famous combination in a Nimzo ever played)'],
  },
  {
    id: 'Queen\'s Indian Defense',
    aliases: ['QID'],
    eponym: 'The queenside sibling of the King\'s Indian — same Indian fianchetto heritage, opposite wing.',
    origin: 'Systematized by Nimzowitsch and the hypermoderns in the 1920s as the companion to the Nimzo-Indian when White plays 3.Nf3.',
    story:
      'When White dodges the Nimzo-Indian pin with 3.Nf3, Black fianchettoes the OTHER bishop: ...b6 and ...Bb7 train x-ray fire on e4, continuing the same hypermodern argument — the center will be controlled from a distance, occupied only when convenient. For decades the QID was the twin pillar (with the Nimzo) of "correct" chess: Karpov wielded it like a scalpel, and the Kasparov–Karpov matches gave it some of its deepest pages. Petrosian\'s 4.a3 — a "beginner\'s move" spending a whole tempo to stop a pin — becoming the critical main line is one of theory\'s best jokes.',
    significance:
      'The solid half of the Nimzo/QID repertoire that has anchored Black\'s classical play against 1.d4 for a century. Its light-square strategy — b7-bishop versus White\'s e4 ambitions — is a running seminar in piece-pressure over pawn-occupation.',
    notableGames: ['Karpov\'s QID model games of the 1970s–80s', 'Kasparov–Karpov, WCh 1985 (game 16 arose from a QID move order)'],
  },
  {
    id: 'Grünfeld Defense',
    aliases: ['Gruenfeld'],
    eponym: 'Ernst Grünfeld (1893–1962), Viennese grandmaster and walking opening encyclopedia, said to have "lived in the opening books" of the Vienna Chess Club.',
    origin: 'Introduced at Vienna 1922, where Grünfeld used the newborn defense to defeat Alekhine himself.',
    story:
      'The Grünfeld is hypermodernism at maximum voltage: 3...d5 invites 4.cxd5 Nxd5 5.e4, when Black\'s knight retreats and White erects the largest legal pawn center — which Black then treats as a shooting-gallery target for the g7 bishop, ...c5 and the c-file. Its birth announcement was beating a future world champion; its coming-of-age was the thirteen-year-old Bobby Fischer\'s "Game of the Century" against Donald Byrne in 1956, a Grünfeld with a queen sacrifice schoolchildren still replay. Kasparov trusted it in world championship matches; engines adore its concrete logic.',
    significance:
      'The sharpest scientific answer to 1.d4: an all-in argument that a big center is only as good as its defense. The Exchange Variation main lines are among the most theory-critical battlegrounds in chess.',
    notableGames: ['Alekhine–Grünfeld, Vienna 1922 (the debut — Black won)', 'D. Byrne–Fischer, New York 1956 (the Game of the Century)', 'Kasparov–Karpov WCh Grünfeld duels, 1986–87'],
  },
  {
    id: 'Catalan Opening',
    aliases: ['Catalan'],
    eponym: 'Named for Catalonia — not a person: the 1929 Barcelona tournament commissioned Savielly Tartakower to devise an opening honoring the region.',
    origin: 'Tartakower\'s hybrid (queen\'s-gambit center plus kingside fianchetto) debuted at Barcelona 1929 and slowly conquered elite chess.',
    story:
      'Chess\'s only major opening created on commission, like a symphony: the Barcelona organizers wanted a "Catalan" opening for their 1929 tournament, and Tartakower — the wittiest man in chess history, coiner of "the blunders are all there on the board, waiting to be made" — obliged by fusing 1.d4/2.c4 with g3 and Bg2. The result is a slow-acting poison: the g2 bishop stares down the long diagonal for forty moves, and Black\'s every freeing attempt feeds it. Fifty years later it became Kramnik\'s and then the elite\'s favorite grinding weapon; Carlsen, Caruana, Ding and Nepomniachtchi have all trusted world-championship games to it.',
    significance:
      'The modern professional\'s opening of choice for risk-free pressure: minimal theory-forcing, maximal squeeze. The eternal Catalan question — can Black ever fully free the c8 bishop? — has outlasted a century of answers.',
    notableGames: ['Kramnik\'s Catalan era (2006 WCh vs Topalov)', 'Ding–Nepomniachtchi, WCh 2023 (Catalan battles)'],
  },
  {
    id: 'London System',
    aliases: ['Bf4 System'],
    eponym: 'Named for the London tournament of 1922, where several masters (Alekhine, Rubinstein and Capablanca among the field) employed the early Bf4 setup.',
    origin: 'The 1922 event fixed the name; the setup existed earlier as a workmanlike anti-Indian formation.',
    story:
      'For ninety years the London was the accountant of openings — solid, safe, and mocked ("the system for people who don\'t want to learn openings"). The internet era transformed it: online blitz rewards low-maintenance setups, Gata Kamsky proved it could beat anyone, and then Magnus Carlsen started winning brilliancies with it — including a 2016 World Championship game and his famous 2019 demolitions — at which point the sneering stopped. The same Bf4-e3-c3 triangle now appears at every level from beginner to world champion, the most dramatic status climb of any opening in the modern era.',
    significance:
      'The definitive "system" opening: nearly identical development against any Black setup, minimal forced theory, real attacking schemes (the h4 lunges, the e5 clamp). Its rise is also a story about how internet chess changed what openings are FOR.',
    notableGames: ['Carlsen–Karjakin, WCh 2016 (game 9 territory — Carlsen\'s London period)', 'Kamsky\'s decades of London wins'],
  },
  {
    id: 'Dutch Defense',
    aliases: ['1...f5'],
    eponym: 'Named for the Netherlands — Elias Stein (1748–1812), a Strasbourg-born master settled in The Hague, recommended it as Black\'s best answer to 1.d4 in his 1789 book.',
    origin: 'Stein\'s 1789 "Nouvel essai sur le jeu des échecs" gave the defense its homeland; Botvinnik gave it world-championship credibility.',
    story:
      'The Dutch is 1.d4\'s mirror-image extremist: Black plays 1...f5 — the one developing pawn move that does nothing for development and weakens the king — because it stakes out e4 and promises a kingside attack White cannot avoid. It has always lived on the edge of respectability, kept alive by true believers: Alekhine used it to win one of his most famous brilliancies, and Botvinnik made the Stonewall Dutch a world-championship weapon in 1951. Its three families — Stonewall, Classical, and the modern Leningrad (fianchetto) — are practically three different openings sharing one first move.',
    significance:
      'The most committal first move Black can make: an unbalanced, all-three-results fight from move one. Beloved of attacking players and must-win situations; the standing counterexample to "develop before you attack."',
    notableGames: ['Bogoljubov–Alekhine, Hastings 1922 (one of the greatest games ever played — a Dutch)', 'Botvinnik–Bronstein, WCh 1951 (Stonewall battles)'],
  },
  {
    id: 'Benoni Defense',
    aliases: ['Ben-Oni'],
    eponym: 'From Hebrew "ben-oni" — "son of my sorrow" (Rachel\'s dying name for Benjamin in Genesis) — the melancholy title Aaron Reinganum gave his 1825 analysis, written to distract himself from depression.',
    origin: 'Reinganum\'s "Ben-Oni oder die Vertheidigungen gegen die Gambitzüge im Schache" (Frankfurt, 1825); the Modern Benoni structure was weaponized by Tal in the 1950s–60s.',
    story:
      'The saddest name in chess belongs to its most defiant defense. Reinganum, a Frankfurt lawyer, analyzed these counterattacks as therapy for his "hours of sorrow" and named the book accordingly. A century later Mikhail Tal — chess\'s great sorcerer — found in the Modern Benoni (...c5, ...e6xd5, ...g6) the perfect vehicle for chaos: a permanently unbalanced structure where Black\'s queenside pawn majority races White\'s central one, and every middlegame is a knife fight. Fischer trusted it in 1972; Kasparov\'s youth was full of it; engines frown at it and club players adore it precisely because the sorrow is usually White\'s.',
    significance:
      'The archetypal imbalance defense: opposite pawn majorities guarantee a decisive-result fight. The dark-square bishop on g7 plus the ...b5 break versus White\'s e4–e5 dream is one of theory\'s great standing arguments.',
    notableGames: ['Tal\'s Benoni massacres of the 1950s–60s', 'Fischer–Spassky, Reykjavík 1972 (game 3 — Fischer\'s first-ever win against Spassky, a Benoni)'],
  },
  {
    id: 'Benko Gambit',
    aliases: ['Volga Gambit'],
    eponym: 'Pal Benko (1928–2019), Hungarian-American grandmaster — wartime survivor, defector, puzzle composer, and the man who gave Fischer his 1970 Interzonal spot.',
    origin: 'Known in Soviet literature as the Volga Gambit (1946 article from Kuibyshev on the Volga); Benko\'s systematic treatment and 1974 book made it his in the West.',
    story:
      'Benko\'s life outdoes fiction: he survived a labor camp, was imprisoned after trying to defect, finally escaped to the U.S. via the 1957 World Student Championship, and famously gave up his own 1970 Interzonal qualification so Bobby Fischer could play — and win the world title. His gambit is equally generous and equally cunning: Black gives a whole pawn (...b5) for no attack at all, just two open files and an endgame initiative that grinds forever. It is the only mainstream gambit where the gambiteer is happiest in the ENDGAME — a strategic paradox that has never been refuted, only avoided.',
    significance:
      'Positional gambit par excellence: compensation measured in file pressure and pawn-structure paralysis rather than mating threats. It rewired theory\'s understanding of what "compensation" can mean.',
    notableGames: ['Benko\'s own model wins, 1960s–70s', 'Topalov\'s Benko revivals in the 1990s'],
  },
  {
    id: 'Modern Defense',
    aliases: ['Robatsch Defense', '1...g6'],
    eponym: 'Called "Modern" for its 1960s vogue; continental literature says Robatsch Defense, for Austrian grandmaster (and botanist) Karl Robatsch (1928–2000).',
    origin: 'Scattered 19th-century sightings; made a coherent system in the 1950s–60s by Robatsch and the English trio Keene, Botterill and Suttles-influenced experimenters.',
    story:
      'The Modern out-hypermoderns the hypermoderns: Black plays 1...g6 and 2...Bg7 against ANYTHING, refusing even the Pirc\'s early ...Nf6, conceding the whole center on the theory that White\'s pawns will advance until they become weaknesses. It is less an opening than a worldview — provocation as strategy — and its literature (Keene and Botterill\'s 1972 book made the name stick) reads like a manifesto. Forever on respectability\'s border, it remains the choice of players who want the game on their terms: original positions by move five, theory optional.',
    significance:
      'Maximum flexibility, maximum provocation: transposes into Pircs, King\'s Indians and Sicilians or stays defiantly itself. The ultimate test of whether understanding really can beat preparation.',
    notableGames: ['Robatsch\'s Olympiad games', 'Suttles and Keene\'s 1960s–70s experiments'],
  },
];
