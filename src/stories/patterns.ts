import type { Story } from '../types';

/** Stories for middlegame pawn structures. Keys are detector slugs. */
export const structureStories: Story[] = [
  {
    id: 'iqp',
    aliases: ['Isolated Queen\'s Pawn', 'Isolani', 'IQP'],
    eponym: 'Nimzowitsch coined "isolani" for it — but the isolated queen\'s pawn belongs to no one and haunts everyone.',
    origin: 'The first great theoretical war over it was Steinitz vs Tarrasch in print in the 1880s–90s; it has been chess\'s central structural argument ever since.',
    story:
      'No pawn structure has generated more doctrine. Tarrasch loved the isolani — "he who fears the isolated queen\'s pawn should give up chess" — because it grants open lines, outpost squares (e5!) and attacking chances. Steinitz and later Nimzowitsch preached the opposite: blockade it, trade the attackers, and in the endgame the pawn is a corpse ("the isolani\'s lust to expand must be restrained... first blockade, then destroy"). Both were right, which is the point: the IQP position is chess\'s purest dynamic-versus-static bargain, arising from dozens of openings (QGA, Alapin, Nimzo, Caro-Kann Panov) and deciding the game by whether the middlegame or the endgame arrives first.',
    significance:
      'THE textbook structure: attackers keep pieces on and play for Nе5, Bc2–Qd3 batteries and d5 breaks; defenders trade pieces, blockade on d5/d4, and inherit the endgame. Every serious player must know both sides.',
    notableGames: ['Botvinnik–Vidmar, Nottingham 1936 (the attacking model)', 'Karpov\'s blockade masterpieces vs the IQP'],
  },
  {
    id: 'hanging-pawns',
    aliases: ['The Hanging Pawns', 'Isolated Pawn Couple cousin'],
    eponym: 'The term ("hängende Bauern") comes from Steinitz — pawns that "hang" side by side with no neighbors to lean on.',
    origin: 'Analyzed in the Steinitz–Zukertort world championship games of 1886, where the structure repeatedly decided play.',
    story:
      'Hanging pawns are the isolani\'s daring sibling: a duo (typically c- and d-pawns) standing abreast on the fourth rank, controlling a wall of central squares, supported by nothing but pieces. The 1886 Steinitz–Zukertort match made them famous — Steinitz\'s new "scientific" chess treating them as targets to besiege, while in other games their dynamic advance decided matters. They live on a knife-edge by nature: strong while they stand abreast (every advance square covered), weak the moment one advances or falls, since the remaining pawn becomes backward on an open file. Modern play still turns on the same single question: can the owner achieve the d5 (or c5) break at a moment it wins material or attack?',
    significance:
      'A structure defined by tension: the side owning them must play actively or drift into a lost endgame; the side facing them must provoke an advance without allowing the breakthrough. A favorite of Spassky, Karpov (both sides!) and every strategy textbook since Steinitz.',
    notableGames: ['Steinitz–Zukertort, WCh 1886', 'Karpov–Spassky, Leningrad candidates 1974'],
  },
  {
    id: 'carlsbad',
    aliases: ['Carlsbad Structure', 'Exchange QGD structure'],
    eponym: 'Named for Carlsbad (Karlovy Vary), the Bohemian spa town whose great tournaments of 1907, 1911, 1923 and 1929 showcased the structure.',
    origin: 'Arises canonically from the Queen\'s Gambit Declined Exchange Variation; systematized between the wars and drilled into every Soviet-school student.',
    story:
      'A spa town where Europe\'s masters gathered between the wars lent its name to the most PLANNED structure in chess. White\'s pawns (a2,b2,d4,e3) face Black\'s (a7,b7,c6,d5) with the c- and e-files half-open in opposite directions, and each side\'s correct plan is practically constitutional law: White plays b4–b5xc6, the "minority attack," sacrificing spatial modesty to leave Black one weak pawn on an open file; Black attacks the king with pieces or the ...e5 break before the queenside erodes. Generations learned strategy itself from this single tabiya — it is the classroom where "play follows structure" was first taught as gospel.',
    significance:
      'The definitive demonstration that pawn skeletons dictate plans: two pawn moves (b4–b5) constitute a complete winning strategy. Understanding Carlsbad is understanding why grandmasters talk about structures instead of moves.',
    notableGames: ['Rubinstein\'s Carlsbad-era models', 'Botvinnik–Keres, USSR ch 1952 (minority attack executed to perfection)'],
  },
  {
    id: 'maroczy-bind',
    aliases: ['Maróczy Bind'],
    eponym: 'Géza Maróczy (1870–1951), Hungarian grandmaster — world-title contender of the 1900s, engineer, and one of the great endgame technicians.',
    origin: 'From Maróczy\'s handling of the Sicilian around 1904–07: pawns on c4 and e4 against the open Sicilian\'s ...cxd4 structures.',
    story:
      'Maróczy\'s pawn clamp — c4 plus e4 with the d-pawn exchanged — was so feared for half a century that entire opening systems existed only to avoid it: the Accelerated Dragon\'s whole point was once considered refuted BY the Bind, because Black can never play the freeing ...d5 or ...b5, and the position slowly asphyxiates. The dogma cracked in the 1960s–70s when players (notably in the hands of Petrosian-era defenders and later Kasparov\'s generation) showed Black can live inside the bind — trade dark-square bishops, sit, and strike at the right instant. The name still means what it always meant: space as a weapon of slow strangulation.',
    significance:
      'The canonical space-advantage structure: nothing is attacked, everything is prevented. It taught chess that restriction — controlling your opponent\'s pawn breaks — can be a complete winning strategy.',
    notableGames: ['Maróczy\'s Sicilian squeezes, 1900s', 'Karpov\'s model binds of the 1970s'],
  },
  {
    id: 'hedgehog',
    aliases: ['The Hedgehog'],
    eponym: 'Named for the animal: Black\'s pawns crouch on the sixth rank like spines, and anyone who grabs carelessly gets hurt.',
    origin: 'Emerged in the early 1970s from English Opening and Sicilian move orders; Ulf Andersson and Ljubomir Ljubojević were its first great artists.',
    story:
      'The Hedgehog inverted a century of doctrine that space advantages simply win: Black voluntarily accepts pawns on a6, b6, d6, e6 — the whole army behind the third rank — and dares White\'s magnificent position to actually DO something. The spines are the eternal threats of ...b5 and ...d5, which can transform the coiled ball into an avalanche in one move; over-extend anywhere and the counterstrike lands. Perfected in the 1970s by Andersson (who could sit motionless for forty moves) and Ljubojević (who could not), it became the age\'s great strategic discovery: a defense where passivity is a coiled spring, beloved of players who win by letting opponents defeat themselves.',
    significance:
      'The modern monument to elastic defense: evaluation by potential energy rather than territory. It changed how chess judges "cramped" positions forever.',
    notableGames: ['Andersson\'s hedgehog grinds of the 1970s–80s', 'Kasparov–Andersson, Tilburg 1981'],
  },
  {
    id: 'stonewall',
    aliases: ['Stonewall Structure', 'Stonewall Attack', 'Stonewall Dutch'],
    eponym: 'Named for what it is: a wall of stone — pawns on d4/e3/f4 (or d5/e6/f5) that no piece can ever dislodge.',
    origin: 'The Stonewall Attack flourished in 19th-century American club play; the Stonewall Dutch reached world-championship level with Botvinnik in the 1930s–50s.',
    story:
      'The Stonewall is chess\'s most honest bargain, carved in granite on move five: the pawn wedge seizes e5 (or e4) permanently and supports a direct king-side attack — and in exchange the builder accepts a great square-shaped hole in the middle of the position and a bishop entombed behind its own pawns, FOREVER. Nineteenth-century Americans used the White version to massacre casual opposition so reliably it was considered almost unsporting; Botvinnik elevated the Black version into world-championship strategy; and the modern era (Carlsen included, who has dabbled in it) rediscovered it as a fighting weapon precisely because engines showed the "bad" bishop matters less than the attack arrives fast.',
    significance:
      'The classic teaching structure for strongpoints, good-versus-bad bishops, and attacking on the color of your pawn chain. Its eternal debate — grip versus hole — is the whole theory of pawn play in one formation.',
    notableGames: ['Pillsbury\'s Stonewall attacks, 1890s', 'Botvinnik–Bronstein, WCh 1951', 'Carlsen\'s Stonewall Dutch vs Anand, 2015'],
  },
];

/** Stories for named endgame patterns. Keys are detector slugs. */
export const endgameStories: Story[] = [
  {
    id: 'lucena',
    aliases: ['The Lucena Position', 'Building the Bridge'],
    eponym: 'Luis Ramírez de Lucena (c. 1465–c. 1530), Spanish author of the oldest surviving printed chess book (1497) — which, in history\'s best chess joke, does NOT contain the position bearing his name.',
    origin: 'The winning method actually appears in Alessandro Salvio\'s "Il Puttino" (1634), attributed to Scipione Genovino. Misattribution froze into tradition centuries ago.',
    story:
      'The most important position in endgame theory carries the wrong man\'s name. Lucena\'s 1497 "Repetición de Amores y Arte de Ajedrez" — half chess manual, half misogynist dating advice, printed when Columbus was still sailing — became so iconic as chess\'s first book that posterity filed the rook endgame\'s crown jewel under his name, though it appears nowhere in it. The position itself: pawn on the seventh, king in front of it, enemy rook checking forever. The immortal solution — Rf1–f4, king out, and when the checks come, the rook interposes on the fourth rank like a drawbridge — is called "building the bridge" and is the first advanced endgame every serious student ever learns.',
    significance:
      'The cornerstone of all rook endgames — and since rook endgames are the most common endgames in chess, arguably the single most valuable piece of technique in the game. "All rook endgames are drawn" ends precisely here.',
    notableGames: ['Taught in every endgame manual since Salvio 1634; reached in thousands of master games'],
  },
  {
    id: 'philidor',
    aliases: ['The Philidor Position', 'Third-Rank Defense'],
    eponym: 'François-André Danican Philidor (1726–1795) — opera composer, era-defining player, and author of the defense that has saved more half-points than any idea in chess.',
    origin: 'Published in his "Analyse du jeu des Échecs" (1749 edition\'s endgame analysis) — correct in every detail 275 years later.',
    story:
      'Philidor solved the defender\'s side of the rook endgame in 1777-era analysis so cleanly that nothing has been added since: park the rook on the third rank and wait. The attacking king cannot cross without pawn support, and the moment the pawn advances to the sixth to shelter it — the ONE moment the position changes character — the rook leaps to the eighth and checks from behind forever, the king now having no shelter ahead of its own pawn. It is prophylaxis distilled to two moves: prevent, then punish. That a working musician between opera premieres permanently settled a corner of chess truth is the measure of the man Diderot called the great "Philidor le subtil".',
    significance:
      'The defensive half of rook-endgame literacy (Lucena is the attacking half): know it and R+P vs R holds itself; forget it and even grandmasters have lost drawn positions. The most cost-effective knowledge in chess.',
    notableGames: ['Countless saved half-points; famously botched even at top level when the third-rank moment is missed'],
  },
  {
    id: 'kp-opposition',
    aliases: ['The Opposition', 'King and Pawn vs King', 'Key Squares'],
    eponym: 'No person — "opposition" names the geometric duel itself: kings facing off with one square between, where having to move is losing.',
    origin: 'Understood in medieval shatranj practice; systematized across centuries of analysis into the key-square rules every textbook now states.',
    story:
      'The atom of all endgame theory. King, pawn, king: whether the pawn queens depends not on material but on a single geometric fact — when the kings stand face to face, the one who must move loses ground. From this seed grows the entire concept of zugzwang, key squares, and corresponding squares — ideas that reach their mystical extreme in positions where kings maneuver on invisible matched grids. Every player\'s first true endgame lesson is the shock that K+P vs K can be a DRAW, and that one tempo — one wasted pawn move hundreds of moves earlier — is the whole story. Réti\'s famous 1921 study (a king catching an uncatchable pawn by walking diagonally) lives in the same magic square country.',
    significance:
      'The foundation under everything: all pawn endgames reduce to it, and all endgames threaten to reduce to pawn endgames. Whoever counts tempi better owns the endgame — this is where counting is learned.',
    notableGames: ['Réti\'s 1921 king-chase study', 'Every simplification decision in every master game implicitly calculates this position'],
  },
  {
    id: 'wrong-rook-pawn',
    aliases: ['Wrong Rook\'s Pawn', 'Wrong-Colored Bishop'],
    eponym: 'No person — named for the cruel geometry: the rook\'s pawn whose promotion corner the bishop cannot control is the "wrong" one.',
    origin: 'Known to the earliest endgame compilers and formalized in 19th–20th century theory as the classic fortress draw.',
    story:
      'Chess\'s most famous injustice: a full bishop and pawn ahead, completely winning — unless the pawn is a rook\'s pawn AND the bishop travels on the opposite color from the promotion corner, in which case the defending king simply sits in that corner and NOTHING can evict it. Stalemate guards the fortress: chase the king out with the pawn and it is stalemate; approach with your own king, stalemate. The defender shuffles between two corner squares for eternity while the extra material watches, helpless. It is the endgame that teaches every player the deepest lesson in chess: the board\'s geometry outranks material — and it has rescued desperate defenders for two hundred years, who see the right corner from twenty moves away and run for it.',
    significance:
      'The most important fortress draw in practice: it dictates piece trades, pawn races and entire defensive strategies dozens of moves before it appears. "Which corner does the bishop control?" is a professional reflex.',
    notableGames: ['A standard swindle/save at every level — even world championship games have steered into it'],
  },
  {
    id: 'kbn-mate',
    aliases: ['Bishop and Knight Mate', 'The W Manoeuvre'],
    eponym: 'No person — though the "W manoeuvre," the knight\'s zigzag path that herds the king along the edge, names the technique\'s signature.',
    origin: 'Analyzed since Philidor\'s era; the systematic corner-herding method (Delétang\'s triangles, the W path) was codified in the 19th–20th centuries.',
    story:
      'The final boss of basic checkmates. Two minor pieces CAN force mate against a lone king — but only in a corner the bishop\'s color controls, and the defending king, knowing this, flees to the WRONG corner first. The winning method — trap the king on the edge, then escort it along the rank with the knight tracing a "W" while the bishop closes each escape hatch in turn — takes up to thirty-three precise moves against best defense, with the fifty-move rule ticking. Its fame is fed by schadenfreude: strong grandmasters have failed it on live broadcast, whole careers carry the asterisk of a KBN half-botched, and every coach uses it as the rite of passage between knowing the pieces and commanding them.',
    significance:
      'Beyond its rare occurrence, it is THE training ground for piece coordination — three pieces working as one organism with zero margin for error. Completing it once changes how a player sees minor pieces forever.',
    notableGames: ['Epishin–Ye Jiangchuan, Bled Olympiad 2002 (a famous GM failure to mate)', 'Countless online rating-list dramas'],
  },
];
