import type { Story } from '../types';

/** Stories for 1.e4 openings. Keys are exact lichess dataset names. */
export const e4Stories: Story[] = [
  {
    id: 'King\'s Pawn Game',
    aliases: ['King\'s Pawn Opening', '1.e4'],
    eponym: 'No person — named for the pawn in front of the king, the oldest first move in recorded chess.',
    origin: 'As old as modern chess itself: nearly every line in the Göttingen manuscript (c. 1490) and Lucena\'s 1497 book begins 1.e4.',
    story:
      'For four centuries 1.e4 simply WAS chess — the romantic era\'s gambits, Morphy\'s open games and Fischer\'s entire career were built on it. Fischer called it "best by test," and when he finally deviated (game 6 vs Spassky, 1972, playing 1.c4) it made headlines precisely because he never had. It stakes a claim in the center, opens lines for the bishop and queen at once, and invites the sharpest fight chess has to offer.',
    significance:
      'White grabs central space and rapid development. Every Black reply is itself a named world: 1...e5 (the Open Games), 1...c5 (Sicilian), 1...e6 (French), 1...c6 (Caro-Kann) — the first branching point of the whole naming tree.',
    notableGames: ['Fischer beat nearly everyone with it; see any Morphy brilliancy, e.g. the Opera Game (Paris 1858)'],
  },
  {
    id: 'Ruy Lopez',
    aliases: ['Spanish Game', 'Spanish Opening'],
    eponym:
      'Ruy López de Segura (c. 1530–c. 1580), a Spanish priest from Zafra, Extremadura — the strongest player of his age and confessor at the court of Philip II.',
    origin:
      'Analyzed in his 1561 book "Libro de la invención liberal y arte del juego del axedrez", one of the first serious chess treatises in Europe.',
    story:
      'López travelled to Rome on church business in 1560, discovered the Italians\' chess literature, and came home to write a better book. In it he recommended 3.Bb5 — attacking the knight that defends e5 — as White\'s most testing try. The move was actually known before him, but his analysis gave it life, and outside the English-speaking world the opening still carries his homeland\'s name: the Spanish Game. Legend adds that he advised placing the board so the sun shone in your opponent\'s eyes — the man was a competitor. Four and a half centuries later, his move order remains the main battlefield of 1.e4 e5 at every World Championship.',
    significance:
      '3.Bb5 pressures the defender of e5 and poses a question Black must answer for the next twenty moves. It is chess\'s longest-running argument: virtually every classical plan — the Marshall, the Berlin, the Closed labyrinths — lives inside it.',
    notableGames: [
      'Kasparov–Karpov, many World Championship games (1985–1990)',
      'Kramnik\'s Berlin Wall vs Kasparov, London 2000',
      'Capablanca–Marshall, New York 1918 (the Marshall Attack unveiled)',
    ],
    famousGame: {
      label: 'Fischer–Spassky, Game 1, Sveti Stefan/Belgrade 1992',
      pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 O-O 8. c3 d6 9. h3 Nb8 10. d4 Nbd7 11. Nbd2 Bb7 12. Bc2 Re8 13. Nf1 Bf8 14. Ng3 g6 15. Bg5 h6 16. Bd2 Bg7 17. a4 c5 18. d5 c4 19. b4 Nh7 20. Be3 h5 21. Qd2 Rf8 22. Ra3 Ndf6 23. Rea1 Qd7 24. R1a2 Rfc8 25. Qc1 Bf8 26. Qa1 Qe8 27. Nf1 Be7 28. N1d2 Kg7 29. Nb1 Nxe4 30. Bxe4 f5 31. Bc2 Bxd5 32. axb5 axb5 33. Ra7 Kf6 34. Nbd2 Rxa7 35. Rxa7 Ra8 36. g4 hxg4 37. hxg4 Rxa7 38. Qxa7 f4 39. Bxf4 exf4 40. Nh4 Bf7 41. Qd4+ Ke6 42. Nf5 Bf8 43. Qxf4 Kd7 44. Nd4 Qe1+ 45. Kg2 Bd5+ 46. Be4 Bxe4+ 47. Nxe4 Be7 48. Nxb5 Nf8 49. Nbxd6 Ne6 50. Qe5',
    },
  },
  {
    id: 'Ruy Lopez: Morphy Defense',
    aliases: ['Spanish, 3...a6'],
    eponym: 'Paul Morphy (1837–1884), the New Orleans prodigy who crushed Europe\'s best in 1858–59 and then walked away from chess.',
    origin: 'Morphy played 3...a6 consistently in his 1858 Paris matches, and his authority made it the main line forever after.',
    story:
      'Before Morphy, Black usually defended e5 directly. Morphy\'s little pawn move asks the bishop a question a move early: retreat or take? If 4.Bxc6 dxc6 5.Nxe5, Black regains the pawn with Qd4 — so the "threat" against e5 is an illusion, and Black gains the option of ...b5 for free. It is the quintessential Morphy idea: an apparently modest move that seizes long-term flexibility. Nearly every Ruy Lopez played today passes through 3...a6.',
    significance:
      'The insertion of ...a6 and Ba4 defines the modern Spanish: Black keeps the b5 tempo-gainer in reserve, and White keeps the bishop aimed at the kingside. The whole Closed Ruy Lopez complex grows from here.',
    notableGames: ['Anderssen–Morphy, Paris 1858', 'Fischer–Spassky, Reykjavík 1972 (game 10)'],
  },
  {
    id: 'Ruy Lopez: Berlin Defense',
    aliases: ['Berlin Wall', 'Spanish, 3...Nf6'],
    eponym: 'The Berlin school of the mid-1800s — the "Pleiades" masters around Ludwig Bledow and Paul Rudolf von Bilguer, who analyzed 3...Nf6 in their handbooks.',
    origin: 'A respected 19th-century defense that slept for a century until Vladimir Kramnik resurrected it in London, 2000.',
    story:
      'Kramnik needed a way to neutralize Garry Kasparov — the most feared attacking player alive — in their 2000 World Championship match. He dusted off the antique 3...Nf6 and steered into the queenless "Berlin endgame" (4.O-O Nxe4 5.d4 Nd6 6.Bxc6 dxc6 7.dxe5 Nf5 8.Qxd8+ Kxd8). Kasparov battered it for the whole match, won nothing, and lost the crown without winning a single game. Journalists called it the Berlin Wall, and this time the wall went up. It has been an elite mainstay ever since.',
    significance:
      'Black accepts doubled pawns and loses castling rights but gets the bishop pair and a fortress-like structure. It converted the Ruy Lopez from an attacking arena into a test of endgame technique — and shifted opening fashion at the top for two decades.',
    notableGames: ['Kasparov–Kramnik, London 2000 (games 1 and 3)', 'Carlsen–Caruana, London 2018 (multiple Berlins)'],
  },
  {
    id: 'Ruy Lopez: Marshall Attack',
    aliases: ['Marshall Gambit (Spanish)'],
    eponym: 'Frank James Marshall (1877–1944), U.S. Champion for 27 years and one of history\'s great attacking players.',
    origin: 'Unveiled against Capablanca at New York 1918 — allegedly saved up for years, waiting for the right victim.',
    story:
      'The legend: Marshall kept 8...d5!? secret for nearly a decade, refusing 1.e4 e5 lines in order to spring it on José Raúl Capablanca himself. Capablanca, facing a prepared sacrificial storm over the board, navigated it with legendary coolness and won — yet the gambit was so sound that it outlived the game that introduced it. A century of analysis has established that Black\'s piece activity fully compensates the pawn, and today the main line often forces White into razor-edge theory or "anti-Marshall" sidesteps.',
    significance:
      'Black gives a center pawn for a standing kingside initiative — an entire complex where the gambiteer is the strategically respectable side. Its soundness is why 8.a4 and other anti-Marshall moves dominate modern elite play.',
    notableGames: ['Capablanca–Marshall, New York 1918', 'Aronian and Svidler as modern Marshall specialists'],
    famousGame: {
      label: 'Capablanca–Marshall, New York 1918',
      pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 O-O 8. c3 d5 9. exd5 Nxd5 10. Nxe5 Nxe5 11. Rxe5 Nf6 12. Re1 Bd6 13. h3 Ng4 14. Qf3 Qh4 15. d4 Nxf2 16. Re2 Bg4 17. hxg4 Bh2+ 18. Kf1 Bg3 19. Rxf2 Qh1+ 20. Ke2 Bxf2 21. Bd2 Bh4 22. Qh3 Rae8+ 23. Kd3 Qf1+ 24. Kc2 Bf2 25. Qf3 Qg1 26. Bd5 c5 27. dxc5 Bxc5 28. b4 Bd6 29. a4 a5 30. axb5 axb4 31. Ra6 bxc3 32. Nxc3 Bb4 33. b6 Bxc3 34. Bxc3 h6 35. b7 Re3 36. Bxf7+',
    },
  },
  {
    id: 'Ruy Lopez: Exchange Variation',
    aliases: ['Spanish Exchange'],
    eponym: 'Not an eponym — named for the exchange 4.Bxc6, giving up the "Spanish bishop" at once.',
    origin: 'Played by Emanuel Lasker with deadly effect around 1900; revived single-handedly by Bobby Fischer at the Havana Olympiad, 1966.',
    story:
      'Lasker used 4.Bxc6 to reach endgames where White\'s healthy kingside pawn majority ground Black down — his win over Capablanca at St. Petersburg 1914, in front of a stunned crowd, is the archetype. The line then gathered dust as "drawish" until Fischer uncorked it three times at Havana 1966, scoring wins with fresh ideas (5.O-O!) and proving the endgame was a real weapon, not a peace offer.',
    significance:
      'White trades the pride of the Spanish for structural profit: after ...dxc6 Black\'s queenside majority is crippled, so every simplification favors White. A permanent, teachable lesson in playing against pawn structure.',
    notableGames: ['Lasker–Capablanca, St. Petersburg 1914', 'Fischer–Portisch, Havana Olympiad 1966'],
  },
  {
    id: 'Italian Game',
    aliases: ['Giuoco Italiano'],
    eponym: 'Named for the Italian masters of the 16th–17th centuries — Polerio, Greco and their school — who first analyzed it deeply.',
    origin: 'Among the oldest recorded openings: lines with Bc4 appear in the Göttingen manuscript (c. 1490) and dominate Greco\'s celebrated games (1620s).',
    story:
      'When chess\'s modern rules settled in the late 1400s, the Italians built the first great school of play, and their favorite attacking scheme aimed the bishop at f7 — the weakest point in Black\'s camp. Gioachino Greco\'s manuscript games, essentially the first chess bestsellers, spread these attacks across Europe. The Italian was eventually eclipsed by the Ruy Lopez for two centuries, then returned to the absolute elite in the 2010s when engines showed the quiet d3 systems were as rich as any Spanish.',
    significance:
      '3.Bc4 develops toward f7 and keeps every option open: the quiet Giuoco Piano, the romantic Evans Gambit, or the tactical chaos of the Two Knights. Today it is arguably the main line of 1.e4 e5 again — a 500-year-old opening back in fashion.',
    notableGames: ['Greco\'s model attacks (1620s)', 'Carlsen, Caruana and So reviving the Giuoco Pianissimo (2015–present)'],
    famousGame: {
      label: 'Rossolimo–Reissmann, Puerto Rico 1967',
      pgn: '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Bd2 Bxd2+ 8.Nbxd2 d5 9.exd5 Nxd5 10.Qb3 Nce7 11.O-O c6 12.Rfe1 O-O 13.a4 b6 14.Ne5 Bb7 15.a5 Rc8 16.Ne4 Qc7 17.a6 Ba8 18.Qh3 Nf4 19.Qg4 Ned5 20.Ra3 Ne6 21.Bxd5 cxd5 22.Nf6+ Kh8 23.Qg6 Qc2 24.Rh3',
    },
  },
  {
    id: 'Italian Game: Giuoco Piano',
    aliases: ['Quiet Game', 'Italian, 3...Bc5'],
    eponym: 'Italian for "quiet game" — a name that is half description, half irony, since its gambit lines are anything but.',
    origin: 'The symmetric 3...Bc5 tabiya is one of the oldest recorded positions in chess, analyzed continuously since the 15th century.',
    story:
      'The name distinguished the "quiet" 3...Bc5 development from the wild countergambits of the era, but history keeps playing jokes with it: the sharpest lines (4.c3 and d4, the Møller Attack) produce some of the most violent theory in the open games, while the modern grandmaster treatment — the "Giuoco Pianissimo," the very quiet game — wins by maneuvering an eyelash at a time. Five centuries on, both personalities of the opening are alive.',
    significance:
      'Black develops the bishop to its most active diagonal, mirroring White\'s claim. The central question — will White build with c3+d4 or squeeze with d3 — defines two entire eras of chess style.',
    notableGames: ['Greco vs NN, 1620 (the classic bishop sacrifice patterns)', 'Carlsen–Karjakin, WCh 2016 (Pianissimo battles)'],
  },
  {
    id: 'Italian Game: Evans Gambit',
    aliases: ['Evans'],
    eponym: 'Captain William Davies Evans (1790–1872), a Welsh sea captain who also invented colored signal lights for shipping.',
    origin: 'Conceived around 1827, reputedly while Evans commanded a mail steamer between Milford Haven and Waterford; he beat Alexander McDonnell with it in London, 1829.',
    story:
      'A sailor with time to think at sea produced the most romantic pawn sacrifice in chess: 4.b4!? offers a wing pawn to drag the bishop off course and build a monster center with tempo. It became the darling of the 19th century — the Evergreen Game, Anderssen\'s immortal attacking masterpiece of 1852, is an Evans — until Lasker\'s defensive method cooled it. Then in 1995 Garry Kasparov played it against Anand and Piket, won brilliantly, and proved the old captain\'s idea still bites even in the computer age.',
    significance:
      'The purest lesson in time-versus-material in the open games: White invests a pawn for two tempi and a broad center. Its rise, refutation and rebirth trace the entire history of attacking theory.',
    notableGames: ['Anderssen–Dufresne, Berlin 1852 (the Evergreen Game)', 'Kasparov–Anand, Riga 1995'],
    famousGame: {
      label: 'the Evergreen Game — Anderssen–Dufresne, Berlin 1852',
      pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O d3 8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 b5 12. Qxb5 Rb8 13. Qa4 Bb6 14. Nbd2 Bb7 15. Ne4 Qf5 16. Bxd3 Qh5 17. Nf6+ gxf6 18. exf6 Rg8 19. Rad1 Qxf3 20. Rxe7+ Nxe7 21. Qxd7+ Kxd7 22. Bf5+ Ke8 23. Bd7+ Kf8 24. Bxe7#',
    },
  },
  {
    id: 'Italian Game: Two Knights Defense',
    aliases: ['Prussian Defense'],
    eponym: 'Named for Black\'s two developed knights — though its soul belongs to the Italians who analyzed it and to Chigorin, its great champion.',
    origin: 'Analyzed by Giulio Cesare Polerio in the 1580s; the critical 4.Ng5 assault on f7 has been debated ever since.',
    story:
      '3...Nf6 is less a defense than a counterattack — Bronstein suggested it should be called the "Two Knights Counterattack," since Black invites 4.Ng5, when the sound reply 4...d5 leads to positions where Black sacrifices a pawn (the Polerio/main line) for furious activity. The greedy alternative 5...Nxd5?! walks into the Fried Liver Attack, 6.Nxf7!?, dragging the king into the center — four hundred years of scholastic players have learned that lesson the hard way. Steinitz insisted 4.Ng5 was a "duffer\'s move"; Fischer disagreed; the argument is still running.',
    significance:
      'The sharpest branch of the Italian complex: Black refuses passivity and fights for the initiative from move three. A rite of passage for every improving player learning about f7, tempo and the price of pawn-grabbing.',
    notableGames: ['Polerio\'s 16th-century analysis', 'Morphy\'s Two Knights games', 'Fischer–Bisguier, New York 1963'],
    famousGame: {
      label: 'Estrin–Berliner, 5th World Correspondence Ch. 1965',
      pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 b5 6. Bf1 Nd4 7. c3 Nxd5 8. Ne4 Qh4 9. Ng3 Bg4 10. f3 e4 11. cxd4 Bd6 12. Bxb5+ Kd8 13. O-O exf3 14. Rxf3 Rb8 15. Be2 Bxf3 16. Bxf3 Qxd4+ 17. Kh1 Bxg3 18. hxg3 Rb6 19. d3 Ne3 20. Bxe3 Qxe3 21. Bg4 h5 22. Bh3 g5 23. Nd2 g4 24. Nc4 Qxg3 25. Nxb6 gxh3 26. Qf3 hxg2+ 27. Qxg2 Qxg2+ 28. Kxg2 cxb6 29. Rf1 Ke7 30. Re1+ Kd6 31. Rf1 Rc8 32. Rxf7 Rc7 33. Rf2 Ke5 34. a4 Kd4 35. a5 Kxd3 36. Rf3+ Kc2 37. b4 b5 38. a6 Rc4 39. Rf7 Rxb4 40. Rb7 Rg4+ 41. Kf3 b4 42. Rxa7 b3',
    },
  },
  {
    id: 'Sicilian Defense',
    aliases: ['1...c5'],
    eponym: 'Named for Sicily: the 17th-century Sicilian priest and player Pietro Carrera analyzed it, and English writer Jacob Sarratt\'s 1813 translation of an Italian manuscript fixed the name "the Sicilian" in print.',
    origin: 'Known to Polerio by the 1590s; a minor guest for centuries until the 20th century made it Black\'s most feared reply to 1.e4.',
    story:
      'For 300 years 1...c5 was considered slightly disreputable — it concedes the center\'s first rank and accepts a cramped game for the promise of counterplay. The hypermoderns rehabilitated it, but it was the post-war generation — Najdorf, Tal, Fischer, then Kasparov — who turned it into the fighting defense: an asymmetric battlefield where Black plays for a win from move one. By the Fischer and Kasparov eras it was scoring better for Black than any other defense, and "Open Sicilian or chicken?" became the eternal taunt at every level of play.',
    significance:
      'The defining asymmetry of modern chess: Black trades a c-pawn for White\'s d-pawn, gets a half-open c-file and long-term queenside play, and dares White to attack first. Roughly a quarter of all recorded games begin with it.',
    notableGames: ['Fischer\'s Najdorfs vs the world', 'Karpov–Kasparov, WCh 1985 game 16 (the immortal "octopus knight" Sicilian)', 'Tal\'s sacrificial Sicilians of the 1950s'],
  },
  {
    id: 'Sicilian Defense: Najdorf Variation',
    aliases: ['Najdorf'],
    eponym: 'Miguel Najdorf (1910–1997), Polish-Argentine grandmaster — born Mojsze Najdorf, he stayed in Buenos Aires when WWII broke out during the 1939 Olympiad; his family perished in the Holocaust.',
    origin: 'Developed in Argentine tournaments of the 1940s; 5...a6 became the spine of Black\'s Sicilian repertoire within a decade.',
    story:
      'Najdorf rebuilt his life in Argentina — selling insurance, giving blindfold exhibitions of staggering size partly in hope his family in Poland would read of them — and gave his name to the most analyzed opening variation in chess. The unassuming 5...a6 prepares ...e5 and queenside expansion while taking b5 from White\'s pieces. Fischer adopted it as a "personal religion"; Kasparov called it the Rolls-Royce of openings and made it his lifelong weapon. Its theory now runs deeper than any other line in the game — thirty-move forced sequences are routine.',
    significance:
      'The gold standard of fighting defenses: flexible, theoretically dense, and never refuted despite more analytical firepower than any opening in history. Playing the Najdorf well is a professional credential in itself.',
    notableGames: ['Fischer–Spassky, Reykjavík 1972 (game 7, a Najdorf; and game 11, where Spassky refuted Fischer\'s Poisoned Pawn)', 'Kasparov\'s career-long Najdorfs', 'The "Poisoned Pawn" debates: Spassky–Fischer 1972, rehabilitated by engines'],
    famousGame: {
      label: 'Fischer–Najdorf, Varna Olympiad 1962',
      pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. h3 b5 7. Nd5 Bb7 8. Nxf6+ gxf6 9. c4 bxc4 10. Bxc4 Bxe4 11. O-O d5 12. Re1 e5 13. Qa4+ Nd7 14. Rxe4 dxe4 15. Nf5 Bc5 16. Ng7+ Ke7 17. Nf5+ Ke8 18. Be3 Bxe3 19. fxe3 Qb6 20. Rd1 Ra7 21. Rd6 Qd8 22. Qb3 Qc7 23. Bxf7+ Kd8 24. Be6',
    },
  },
  {
    id: 'Sicilian Defense: Dragon Variation',
    aliases: ['Dragon'],
    eponym: 'Named by Russian master Fyodor Dus-Chotimirsky around 1901 — an amateur astronomer, he thought Black\'s d6–e7–f7–g6–h7 pawn silhouette resembled the constellation Draco, the Dragon.',
    origin: 'The fianchetto Sicilian existed in the 19th century, but the name — and the ferocious theory — are 20th-century creations.',
    story:
      'The Dragon is chess\'s best-named opening and its most honest: both sides announce their intentions and race. White castles long and storms the h-file ("pry open the h-file, sac, sac... mate," as Fischer cheerfully summarized his 1961 demolition of Larsen); Black\'s dragon bishop on g7 breathes fire down the long diagonal while the c-file counterattack arrives. The Yugoslav Attack turned the whole variation into a single forcing argument that has raged for seventy years, with computer analysis keeping both dragons and dragon-slayers in business.',
    significance:
      'The archetype of opposite-side castling races and the g7-bishop\'s power. Its theory is a shared cultural artifact — every chess generation learns the Dragon\'s moves the way musicians learn scales.',
    notableGames: ['Fischer–Larsen, Portorož Interzonal 1958 ("sac, sac, mate")', 'Karpov–Korchnoi, Moscow 1974 (game 2, the model h-file win)', 'Topalov and Carlsen\'s modern Dragon revivals'],
    famousGame: {
      label: 'Fischer–Larsen, Portoroz Interzonal 1958',
      pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3 O-O 8. Qd2 Nc6 9. Bc4 Nxd4 10. Bxd4 Be6 11. Bb3 Qa5 12. O-O-O b5 13. Kb1 b4 14. Nd5 Bxd5 15. Bxd5 Rac8 16. Bb3 Rc7 17. h4 Qb5 18. h5 Rfc8 19. hxg6 hxg6 20. g4 a5 21. g5 Nh5 22. Rxh5 gxh5 23. g6 e5 24. gxf7+ Kf8 25. Be3 d5 26. exd5 Rxf7 27. d6 Rf6 28. Bg5 Qb7 29. Bxf6 Bxf6 30. d7 Rd8 31. Qd6+',
    },
  },
  {
    id: 'Sicilian Defense: Alapin Variation',
    aliases: ['c3 Sicilian', 'Anti-Sicilian 2.c3'],
    eponym: 'Semyon Alapin (1856–1923), a Lithuanian-born Russian master, railway engineer and opening theoretician with a taste for unfashionable ideas.',
    origin: 'Advocated by Alapin around the turn of the 20th century; carried into the modern era by Evgeny Sveshnikov, its lifelong apostle.',
    story:
      'Alapin\'s pragmatic 2.c3 sidesteps the entire Open Sicilian: White simply prepares d4 and says "no" to thirty years of your Najdorf files. Dismissed for decades as harmless, it was Sveshnikov — ironically also the author of Black\'s sharpest Sicilian system — who insisted "2.c3 and White is better" and built the modern theory proving it at least fully respectable. It became the workhorse anti-Sicilian for players who would rather understand structures than memorize refutations.',
    significance:
      'The premier "opt-out" of Sicilian theory: play transposes toward IQP or advance-French structures where ideas beat memory. A lesson that opening choice is also a negotiation about whose preparation gets used.',
    notableGames: ['Sveshnikov\'s decades of 2.c3 wins', 'Kasparov–Deep Blue, 1996 (game 3, a 2.c3 Sicilian — Kasparov won)'],
  },
  {
    id: 'Sicilian Defense: Closed',
    aliases: ['Closed Sicilian'],
    eponym: 'Not an eponym — "Closed" because White declines to open the center with d4, keeping the pawn chains locked.',
    origin: 'A 19th-century approach systematized in the 20th; Vasily Smyslov and, above all, Boris Spassky made it a weapon.',
    story:
      'Instead of detonating the center, White builds quietly — Nc3, g3, Bg2, d3 — and then rolls the f-pawn at Black\'s king. Spassky used it as a change-of-pace weapon with devastating effect, including in his 1968–69 candidates run: opponents booked to the teeth in Open Sicilians found themselves in a slow kingside squeeze where general understanding, not memory, decided. It remains the classic recommendation for club players facing Sicilian specialists.',
    significance:
      'Demonstrates the strategic alternative to the theoretical arms race: pawn-structure play, kingside space, and the f4–f5 lever. The eternal second weapon of 1.e4 players.',
    notableGames: ['Spassky–Geller, Sukhumi 1968 (candidates match, model kingside attack)'],
  },
  {
    id: 'French Defense',
    aliases: ['1...e6'],
    eponym: 'Named for France — specifically the Paris team whose 1...e6 won a celebrated correspondence match against London, 1834–36.',
    origin: 'The move is older (Lucena mentions it, and Philidor\'s contemporaries knew it), but the Paris–London match gave it identity and a nation.',
    story:
      'When the chess clubs of Paris and London played their grand correspondence match in the 1830s, the Parisians met 1.e4 with 1...e6 and won so convincingly that the defense has been "French" ever since. It is chess\'s great acquired taste: Black voluntarily shuts in the light-squared bishop — the "French bishop," the opening\'s eternal problem child — in exchange for an unbreakable pawn chain and the promise of counterblows ...c5 and ...f6 against White\'s proud center. Botvinnik, Korchnoi and Petrosian built careers on its stubbornness.',
    significance:
      'The classic counterattacking structure: White gets space, Black gets a plan. Every French player learns the same eternal trade-offs — bad bishop versus solid chain, cramped now versus breaking later — which makes it one of the most instructive defenses in chess.',
    notableGames: ['London–Paris correspondence 1834–36', 'Korchnoi\'s lifelong French battles', 'Nimzowitsch–Salwe, Carlsbad 1911 (the model Advance French — a pawn-chain clinic)'],
  },
  {
    id: 'French Defense: Winawer Variation',
    aliases: ['Winawer', 'Nimzowitsch Variation'],
    eponym: 'Szymon Winawer (1838–1919), Polish master and merchant who stunned Europe by tying for second at Paris 1867 while barely known.',
    origin: 'Winawer essayed 3...Bb4 in the 1860s–80s; Botvinnik\'s adoption in the 1930s–50s made it the French\'s main line.',
    story:
      '3...Bb4 pins the knight and threatens to inflict doubled c-pawns — and after the main line 4.e5 c5 5.a3 Bxc3+ 6.bxc3, both sides get exactly what they asked for: White owns the dark squares and attacking chances, Black owns the crippled queenside pawns as targets forever. Botvinnik, the great scientist of chess, was willing to defend Black\'s side against the world for twenty years, and the Winawer became the sharpest strategic argument in the French — "positionally unsound but tactically justified," as one wit put it, or possibly the reverse.',
    significance:
      'A structural bargain in its purest form: bishop pair and pawn weaknesses traded against dark-square control and attacking chances. The Poisoned Pawn line (7.Qg4) remains one of the sharpest strategic gambles in mainstream theory.',
    notableGames: ['Botvinnik\'s Winawers across three decades', 'Fischer–Tal, Leipzig Olympiad 1960 (a legendary Winawer draw)'],
    famousGame: {
      label: 'Tal–Botvinnik, World Championship Game 1, Moscow 1960',
      pgn: '1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. a3 Bxc3+ 6. bxc3 Qc7 7. Qg4 f5 8. Qg3 Ne7 9. Qxg7 Rg8 10. Qxh7 cxd4 11. Kd1 Bd7 12. Qh5+ Ng6 13. Ne2 d3 14. cxd3 Ba4+ 15. Ke1 Qxe5 16. Bg5 Nc6 17. d4 Qc7 18. h4 e5 19. Rh3 Qf7 20. dxe5 Ncxe5 21. Re3 Kd7 22. Rb1 b6 23. Nf4 Rae8 24. Rb4 Bc6 25. Qd1 Nxf4 26. Rxf4 Ng6 27. Rd4 Rxe3+ 28. fxe3 Kc7 29. c4 dxc4 30. Bxc4 Qg7 31. Bxg8 Qxg8 32. h5',
    },
  },
  {
    id: 'Caro-Kann Defense',
    aliases: ['1...c6'],
    eponym: 'Horatio Caro (1862–1920), an English master living in Berlin, and Marcus Kann (1820–1886), a Viennese master — who analyzed 1...c6 together.',
    origin: 'Their joint analysis appeared in the German magazine Brüderschaft in 1886; Kann had already beaten world-class Jacques Mieses with it in 1885.',
    story:
      'Caro and Kann\'s modest pawn move solves the French Defense\'s eternal problem: Black supports ...d5 with the c-pawn instead of the e-pawn, so the light-squared bishop gets out BEFORE the door closes. For a century it wore the "solid but passive" label — then Capablanca and later Karpov showed that its solidity was a weapon, grinding wins from microscopic advantages. Modern engines adore it, and it has quietly become one of the most trusted defenses at every level, from beginners taught it for its clear plans to World Championship matches.',
    significance:
      'The structurally soundest reply to 1.e4: no weaknesses, free development for every piece, endgames a shade more pleasant for Black. Its price — a tempo here, a shade of passivity there — is the cheapest rent in opening theory.',
    notableGames: ['Capablanca\'s Caro-Kann endgames', 'Karpov\'s career-long advocacy', 'Deep Blue–Kasparov, 1997 (game 6 — the Caro-Kann Nxe6 disaster that ended the match)'],
    famousGame: {
      label: 'Deep Blue–Kasparov, IBM Match Game 6, New York 1997',
      pgn: '1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Nd7 5. Ng5 Ngf6 6. Bd3 e6 7. N1f3 h6 8. Nxe6 Qe7 9. O-O fxe6 10. Bg6+ Kd8 11. Bf4 b5 12. a4 Bb7 13. Re1 Nd5 14. Bg3 Kc8 15. axb5 cxb5 16. Qd3 Bc6 17. Bf5 exf5 18. Rxe7 Bxe7 19. c4',
    },
  },
  {
    id: 'Scandinavian Defense',
    aliases: ['Center Counter Defense', '1...d5'],
    eponym: 'Named for the Scandinavian masters — especially Danes and Swedes around Ludvig and Gustav Collijn — whose analysis revived it in the late 19th century.',
    origin: 'The oldest recorded Black defense: 1.e4 d5 appears in the Valencian poem "Scachs d\'amor" (c. 1475), the first game of modern chess ever written down.',
    story:
      'Black\'s most direct retort — challenge e4 immediately, before White adds a second center pawn. The cost is famous: after 2.exd5 Qxd5 3.Nc3 the queen must move again, and every beginner is warned about it. The Scandinavians of the 1880s showed the lost tempo buys a French-like structure with the good bishop free, and the defense has been periodically respectable ever since — never more so than when Anand used it against Kasparov in their 1995 World Championship match and drew comfortably.',
    significance:
      'The simplest solution to 1.e4 in existence: one forcing sequence, one solid structure, minimal theory. A standing demonstration that a tempo can be worth less than a plan.',
    notableGames: ['Scachs d\'amor, Valencia c. 1475 (the first recorded game)', 'Kasparov–Anand, New York WCh 1995 (game 14)'],
    famousGame: {
      label: 'Canal–NN, Peruvian Immortal, Budapest simul 1934',
      pgn: '1. e4 d5 2. exd5 Qxd5 3. Nc3 Qa5 4. d4 c6 5. Nf3 Bg4 6. Bf4 e6 7. h3 Bxf3 8. Qxf3 Bb4 9. Be2 Nd7 10. a3 O-O-O 11. axb4 Qxa1+ 12. Kd2 Qxh1 13. Qxc6+ bxc6 14. Ba6#',
    },
  },
  {
    id: 'Alekhine Defense',
    aliases: ['1...Nf6 vs 1.e4'],
    eponym: 'Alexander Alekhine (1892–1946), the fourth World Champion — attacking genius, exile from revolutionary Russia, and the only champion to die holding the title.',
    origin: 'Introduced by Alekhine at Budapest 1921, in the first flush of hypermodernism.',
    story:
      'The most provocative defense in chess: Black attacks e4 with a knight and then lets it be kicked across the board — 2.e5 Nd5 3.d4 d6 4.c4 Nb6 5.f4 building White the biggest pawn center imaginable. Alekhine\'s wager, pure hypermodern doctrine, is that the center is not strength but target: Black will spend the middlegame demolishing what White spent the opening building. It shocked the chess world in 1921, gave the new hypermodern school its most vivid slogan, and found its greatest later champion in Fischer, who used it twice against Spassky in Reykjavík 1972.',
    significance:
      'The purest expression of "the center as a target" — an entire strategic philosophy in one knight tour. Rare at the top but immortal in the textbooks, because no opening teaches the tension between space and overextension better.',
    notableGames: ['Sämisch–Alekhine, Budapest 1921', 'Spassky–Fischer, Reykjavík 1972 (games 13 and 19)'],
    famousGame: {
      label: 'Spassky–Fischer, World Championship Game 13, Reykjavik 1972',
      pgn: '1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. Nf3 g6 5. Bc4 Nb6 6. Bb3 Bg7 7. Nbd2 O-O 8. h3 a5 9. a4 dxe5 10. dxe5 Na6 11. O-O Nc5 12. Qe2 Qe8 13. Ne4 Ncxa4 14. Bxa4 Nxa4 15. Re1 Nb6 16. Bd2 a4 17. Bg5 h6 18. Bh4 Bf5 19. g4 Be6 20. Nd4 Bc4 21. Qd2 Qd7 22. Rad1 Rfe8 23. f4 Bd5 24. Nc5 Qc8 25. Qc3 e6 26. Kh2 Nd7 27. Nd3 c5 28. Nb5 Qc6 29. Nd6 Qxd6 30. exd6 Bxc3 31. bxc3 f6 32. g5 hxg5 33. fxg5 f5 34. Bg3 Kf7 35. Ne5+ Nxe5 36. Bxe5 b5 37. Rf1 Rh8 38. Bf6 a3 39. Rf4 a2 40. c4 Bxc4 41. d7 Bd5 42. Kg3 Ra3+ 43. c3 Rha8 44. Rh4 e5 45. Rh7+ Ke6 46. Re7+ Kd6 47. Rxe5 Rxc3+ 48. Kf2 Rc2+ 49. Ke1 Kxd7 50. Rexd5+ Kc6 51. Rd6+ Kb7 52. Rd7+ Ka6 53. R7d2 Rxd2 54. Kxd2 b4 55. h4 Kb5 56. h5 c4 57. Ra1 gxh5 58. g6 h4 59. g7 h3 60. Be7 Rg8 61. Bf8 h2 62. Kc2 Kc6 63. Rd1 h1=Q 64. Rxh1 b3+ 65. Kc3 Kd5 66. Rd1+ Ke4 67. Kb2 f4 68. Rc1 Kd3 69. Rd1+ Ke2 70. Rc1 f3 71. Bc5 Rxg7 72. Rxc4 Rd7 73. Re4+ Kf1 74. Bd4 f2',
    },
  },
  {
    id: 'Pirc Defense',
    aliases: ['Pirc-Ufimtsev', '1...d6 & ...g6'],
    eponym: 'Vasja Pirc (1907–1980), Slovenian grandmaster and five-time Yugoslav champion; Soviet master Anatoly Ufimtsev developed it independently, and eastern literature hyphenates them.',
    origin: 'Worked out in the 1930s–40s; entered mainstream practice in the 1960s as hypermodern ideas became household tools.',
    story:
      'The Pirc invites White to take the whole center — then aims the g7 bishop and the ...e5/...c5 breaks at it. Long considered borderline insolent (Tarrasch would have fainted), it matured into a respected counterpuncher\'s weapon: flexible, low on forced theory, rich in transpositional tricks. Its most famous moment is also its most painful — Fischer chose it for game 17 of Reykjavík 1972, and it appeared in the fateful last game of that match, when Spassky\'s title ended in a Pirc.',
    significance:
      'The workhorse "system defense" against 1.e4: Black\'s setup barely changes whatever White does, which makes it beloved of players who prize understanding over memorization — and of anyone needing a fighting game against a booked-up opponent.',
    notableGames: ['Spassky–Fischer, Reykjavík 1972 (game 21, the title-clincher)'],
    famousGame: {
      label: 'Kasparov–Topalov, Wijk aan Zee 1999',
      pgn: '1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1 d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8 Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7',
    },
  },
  {
    id: 'Philidor Defense',
    aliases: ['1...e5 2...d6'],
    eponym: 'François-André Danican Philidor (1726–1795) — the greatest player of the 18th century and simultaneously France\'s leading opera composer.',
    origin: 'Advocated in his epochal 1749 book "Analyse du jeu des Échecs", the first work to treat chess strategically.',
    story:
      'Philidor learned chess waiting around the Versailles chapel as a boy chorister and became so strong he gave the world\'s best players odds — while writing operas the same decade. His famous dictum, "the pawns are the soul of chess," was revolutionary in an age that saw pawns as furniture, and his 2...d6 was doctrine in action: support the e5 strongpoint with pawns rather than expose a knight to attack on c6. Posterity found the defense a bit modest, but the man himself towered so far above his era that he played blindfold simuls that newspapers covered as miracles.',
    significance:
      'Cramped but tough, with the modern "Hanham" setup (…Nd7, …Be7) still a playable surprise weapon. Its real legacy is conceptual: the first defense ever built on a pawn-structure philosophy.',
    notableGames: ['Philidor\'s blindfold exhibitions, London 1783', 'Morphy vs Duke Karl / Count Isouard, Paris 1858 — the Opera Game — began as a Philidor'],
    famousGame: {
      label: 'the Opera Game — Morphy vs Duke Karl & Count Isouard, Paris 1858',
      pgn: '1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8#',
    },
  },
  {
    id: 'Petrov\'s Defense',
    aliases: ['Russian Game', 'Petroff Defense'],
    eponym: 'Alexander Petrov (1794–1867), Russia\'s first great master, unbeaten in his homeland for half a century.',
    origin: 'Analyzed by Petrov and Carl Jaenisch in the 1840s — the first major Russian contribution to opening theory, hence its other name, the Russian Game.',
    story:
      'Instead of defending e5, Black counterattacks e4 symmetrically: 2...Nf6. The point is a tactical trap older than the theory — 3.Nxe5 Nxe4? loses to 4.Qe2, so Black must first insert 3...d6 — but the strategic point is deeper: perfect symmetry is remarkably hard to break. The Petrov became the fortress of choice for defensive virtuosos from Marshall (who used it as well as his gambit) to Karpov, Kramnik and, above all, Fabiano Caruana, whose Petrov in the late 2010s was so impregnable that elite players largely stopped testing it with 1.e4.',
    significance:
      'The defense that measures White\'s ambition: it concedes nothing structurally and dares White to prove anything at all. Its reputation for dryness is half-deserved and half-slander — the Cochrane Gambit (4.Nxf7!?) lives inside it.',
    notableGames: ['Caruana\'s candidate-winning Petrovs, 2018', 'Marshall\'s Petrov draws vs Lasker and Capablanca'],
  },
  {
    id: 'King\'s Gambit',
    aliases: ['2.f4'],
    eponym: 'Not an eponym — the king\'s pawn\'s neighbor (the f-pawn, the king\'s bishop\'s pawn in old notation) is gambited.',
    origin: 'Analyzed by Ruy López in 1561 and central to chess for three hundred years; the signature opening of the Romantic era.',
    story:
      'For centuries this WAS attacking chess: White rips open the f-file at the cost of a pawn and his own king\'s shelter, and every gentleman was expected to accept. The Immortal Game (Anderssen–Kieseritzky, London 1851), where White sacrificed both rooks, the bishop and the queen, is a King\'s Gambit. Steinitz\'s positional revolution wounded it; Fischer, furious after losing to Spassky\'s King\'s Gambit in 1960, published "A Bust to the King\'s Gambit" declaring 1.e4 e5 2.f4 exf4 3.Nf3 d6! winning for Black — then cheekily played the gambit himself, once, and won. It survives today as chess\'s most romantic anachronism, dangerous in fast games and beloved forever.',
    significance:
      'The historical vehicle of sacrifice-first chess and still the best classroom for open lines, lead in development, and king safety as a currency. Objectively dubious at the top; practically venomous everywhere else.',
    notableGames: ['Anderssen–Kieseritzky, London 1851 (the Immortal Game)', 'Spassky–Fischer, Mar del Plata 1960', 'Spassky–Bronstein, Leningrad 1960 (the "James Bond" game, shown in From Russia with Love)'],
  },
  {
    id: 'King\'s Gambit Accepted',
    aliases: ['KGA'],
    eponym: 'Not an eponym — Black accepts the offered f-pawn, as three centuries of etiquette demanded.',
    origin: 'The main battlefield of chess from the 16th to the mid-19th century; whole families of named sub-gambits (Muzio, Kieseritzky, Allgaier…) live here.',
    story:
      'Taking the pawn is principled: Black grabs material and dares White to prove the attack. The resulting theory is a museum of romantic-era violence — in the Muzio Gambit White sacrifices a full knight on move five for nothing but open lines, and analysis says it is nearly sound. Every named line records a 19th-century personality: Kieseritzky the café professional, Allgaier the Viennese theorist whose knight sacrifice on f7 still wins miniatures two centuries on.',
    significance:
      'The KGA is chess\'s laboratory of initiative: it taught the game that time and open lines can outweigh material — the insight underneath every sacrifice since.',
    notableGames: ['Anderssen–Kieseritzky, London 1851', 'Short–Kasparov, London blitz 1993 (a modern KGA massacre)'],
    famousGame: {
      label: 'the Immortal Game — Anderssen–Kieseritzky, London 1851',
      pgn: '1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7#',
    },
  },
  {
    id: 'Vienna Game',
    aliases: ['2.Nc3'],
    eponym: 'Named for Vienna, whose coffee-house masters — Carl Hamppe above all — analyzed it in the mid-19th century.',
    origin: 'Hamppe\'s games from the 1840s–50s established 2.Nc3; the Vienna Gambit (2.Nc3 and 3.f4) was its fighting form.',
    story:
      'Vienna\'s chess cafés — the Café Central chief among them — were an institution: Hamppe, a government official, ruled them for decades, and the city\'s opening deferred the f4 break by one move so it could be played without allowing the equalizing ...d5 counter. The delayed King\'s Gambit proved a clever container for romantic ideas in a slightly safer bottle, and the Frankenstein–Dracula Variation (a monstrous piece-sacrifice tangle named by Tim Harding in 1975) still lurks inside it as one of chess\'s wildest named lines.',
    significance:
      'A flexible cousin of the King\'s Gambit: White keeps the attack in reserve. Enjoying a genuine modern revival as a surprise weapon with real bite (the Vienna Gambit scores brutally below master level).',
    notableGames: ['Hamppe–Meitner, Vienna 1872 (the "Immortal Draw")'],
    famousGame: {
      label: 'Hamppe–Meitner, the Immortal Draw, Vienna 1872',
      pgn: '1. e4 e5 2. Nc3 Bc5 3. Na4 Bxf2+ 4. Kxf2 Qh4+ 5. Ke3 Qf4+ 6. Kd3 d5 7. Kc3 Qxe4 8. Kb3 Na6 9. a3 Qxa4+ 10. Kxa4 Nc5+ 11. Kb4 a5+ 12. Kxc5 Ne7 13. Bb5+ Kd8 14. Bc6 b6+ 15. Kb5 Nxc6 16. Kxc6 Bb7+ 17. Kb5 Ba6+ 18. Kc6 Bb7+',
    },
  },
  {
    id: 'Scotch Game',
    aliases: ['Scotch Opening'],
    eponym: 'Named for Scotland — the Edinburgh Chess Club adopted 3.d4 in its 1824–28 correspondence match against London and won with it.',
    origin: 'Known to Ercole del Rio in 1750; christened by the Edinburgh–London match; resurrected at the highest level by Kasparov in 1990.',
    story:
      'The Scotch settles the central question immediately — 3.d4, no waiting. The 19th century enjoyed it, then it spent a hundred years in the drawer marked "harmless: releases the tension too soon." Kasparov, hunting for ways to dodge Karpov\'s bottomless Ruy Lopez preparation in their 1990 World Championship match, pulled it out, won crucial games, and made the chess world relearn the opening overnight — the most famous opening resurrection of the modern era. It has stayed a respected elite weapon ever since.',
    significance:
      'Immediate central clarification into rich, slightly offbeat middlegames — the standing alternative for 1.e4 players who want open-game activity without Ruy Lopez theory. Proof that no sound opening ever really dies.',
    notableGames: ['Edinburgh–London correspondence 1824–28', 'Kasparov–Karpov, Lyon/New York WCh 1990 (games 14 and 16)'],
    famousGame: {
      label: 'Kasparov–Karpov, Game 16, World Ch. 1990',
      pgn: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Nf6 5. Nxc6 bxc6 6. e5 Qe7 7. Qe2 Nd5 8. c4 Nb6 9. Nd2 Qe6 10. b3 a5 11. Bb2 Bb4 12. a3 Bxd2+ 13. Qxd2 d5 14. cxd5 cxd5 15. Rc1 O-O 16. Rxc7 Qg6 17. f3 Bf5 18. g4 Bb1 19. Bb5 Rac8 20. Rxc8 Rxc8 21. O-O h5 22. h3 hxg4 23. hxg4 Bc2 24. Qd4 Qe6 25. Rf2 Rc7 26. Rh2 Nd7 27. b4 axb4 28. axb4 Nf8 29. Bf1 Bb3 30. Bd3 Bc4 31. Bf5 Qe7 32. Qd2 Rc6 33. Bd4 Ra6 34. Bb1 Ra3 35. Rh3 Rb3 36. Bc2 Qxb4 37. Qf2 Ng6 38. e6 Rb1+ 39. Bxb1 Qxb1+ 40. Kh2 fxe6 41. Qb2 Qxb2+ 42. Bxb2 Nf4 43. Rh4 Nd3 44. Bc3 e5 45. Kg3 d4 46. Bd2 Bd5 47. Rh5 Kf7 48. Ba5 Ke6 49. Rh8 Nb2 50. Re8+ Kd6 51. Bb4+ Kc6 52. Rc8+ Kd7 53. Rc5 Ke6 54. Rc7 g6 55. Re7+ Kf6 56. Rd7 Ba2 57. Ra7 Bc4 58. Ba5 Bd3 59. f4 exf4+ 60. Kxf4 Bc2 61. Ra6+ Kf7 62. Ke5 Nd3+ 63. Kxd4 Nf2 64. g5 Bf5 65. Bd2 Ke7 66. Kd5 Ne4 67. Ra7+ Ke8 68. Be3 Nc3+ 69. Ke5 Kd8 70. Bb6+ Ke8 71. Rc7 Ne4 72. Be3 Ng3 73. Bf4 Nh5 74. Ra7 Kf8 75. Bh2 Ng7 76. Bg1 Nh5 77. Bc5+ Kg8 78. Kd6 Kf8 79. Bd4 Bg4 80. Be5 Bf5 81. Rh7 Kg8 82. Rc7 Kf8 83. Kc6 Kg8 84. Re7 Kf8 85. Bd6 Kg8 86. Re8+ Kf7 87. Re7+ Kg8 88. Be5 Kf8 89. Ra7 Bg4 90. Kd6 Bh3 91. Ra3 Bg4 92. Re3 Bf5 93. Kc7 Kf7 94. Kd8 Bg4 95. Bb2 Be6 96. Bc3 Bf5 97. Re7+ Kf8 98. Be5 Bd3 99. Ra7 Be4 100. Rc7 Bb1 101. Bd6+ Kg8 102. Ke7',
    },
  },
];
