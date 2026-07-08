import type { Story } from '../types';

/** Stories for named checkmate patterns and sacrifices. Keys are detector slugs. */
export const tacticStories: Story[] = [
  {
    id: 'smothered-mate',
    aliases: ['The Smothered Mate', 'Philidor\'s Legacy'],
    eponym: 'The finishing sequence (Qg8+!! Rxg8, Nf7#) is called "Philidor\'s Legacy" after François-André Danican Philidor — though, in a twist worthy of the Lucena Position, the mate predates him by centuries.',
    origin: 'Described by Luis Ramírez de Lucena in 1497 — the oldest printed chess book actually DOES contain this one — and known to Arabic shatranj players before that.',
    story:
      'The most theatrical checkmate in chess: a lone knight kills a king that its own army has buried alive. The full sequence is a small opera in three acts — the knight gives a discovered double check (the only escape is the corner), the queen hurls herself onto g8 in a sacrifice that CANNOT be declined (the rook must take), and the knight hops to f7 to mate a king now sealed in by its own rook and pawns. Lucena printed it in 1497; Greco made it his signature swindle in the 1620s, luring opponent after opponent into the same trap; and somewhere along the way posterity attached Philidor\'s name to the finish. Five hundred years later it still lands in blitz games every day, and delivering one\'s first smothered mate remains a rite of passage — the moment a player discovers that in chess, your own pieces can be the walls of your tomb.',
    significance:
      'The canonical demonstration of the knight\'s unique power (no other piece can mate a fully-defended king) and of deflection sacrifice. Its ingredients — double check, forced capture, self-block — are a compressed course in forcing tactics.',
    notableGames: ['Lucena\'s 1497 demonstration', 'Greco\'s model games, 1620s', 'Short–Timman would-be threats and a thousand blitz games since'],
  },
  {
    id: 'back-rank-mate',
    aliases: ['The Back-Rank Mate', 'Corridor Mate', 'Back-Row Mate'],
    eponym: 'No person — named for the geography: the back rank, the king\'s home row, where safety curdles into a prison.',
    origin: 'As old as castling itself; codified as THE elementary combination theme in the earliest tactics primers of the 19th century.',
    story:
      'The cruellest irony in chess: the three little pawns that shelter a castled king all game become, the instant a rook or queen lands on the home rank, the bars of its cell. Whole families of combinations exist only to exploit it — deflections that drag a defending rook off the rank, interference moves that cut its guard, queen sacrifices that jam the escape hatch shut. Its most famous single appearance is Adams–Torre, New Orleans 1920, where White\'s queen wandered the board untouchable for six consecutive moves — she could never be captured, because every capture opened the back door to mate. Every improving player learns the same two-word prophylaxis the hard way: "luft" (air), the little pawn move that gives the king a breathing hole and makes the whole theme vanish.',
    significance:
      'The first mating pattern every player must internalize, and the hidden engine behind countless deflection and overloading combinations: material means nothing while the back rank hangs. "Weak back rank" is a permanent entry in every evaluation.',
    notableGames: ['Adams–Torre, New Orleans 1920 (the immortal queen-wandering deflection)', 'Bernstein–Capablanca, Moscow 1914 (Capablanca\'s 29...Qb2! wins a rook by back-rank threat)'],
  },
  {
    id: 'anastasia-mate',
    aliases: ['Anastasia\'s Mate'],
    eponym: 'Named not for a player but for a novel: "Anastasia und das Schachspiel" (Anastasia and the Game of Chess) by Johann Jakob Wilhelm Heinse, published 1803, where the mate appears in the story.',
    origin: 'From the pages of Heinse\'s epistolary novel, 1803 — chess\'s only famous mate to come out of literature.',
    story:
      'Chess history\'s most romantic attribution: a checkmate named after a character in a German novel. Heinse — better known as the author of scandalous art-novels — wove chess through "Anastasia und das Schachspiel" and included the position that now carries the heroine\'s name. The mechanism is a pincer built from the two most awkward dance partners on the board: a knight lands on e7 (or e2), covering BOTH inner escape squares beside the enemy king, and a rook then arrives on the edge file to deliver mate — very often introduced by a queen sacrifice on h7 to drag the king onto the fatal file. The knight and rook never touch, never defend each other; they simply divide the king\'s world between them. It remains a staple of attacking play against a castled king whenever a knight can reach e7 with tempo.',
    significance:
      'The textbook example of coordination without contact — two pieces partitioning the escape squares between them. Learning it teaches the attacking pattern: exile the king to the edge file, then close the inner lane.',
    notableGames: ['The novel\'s own position, 1803', 'A recurring guest in master miniatures whenever ...Ne2/Ne7 and a rook lift coincide'],
  },
  {
    id: 'arabian-mate',
    aliases: ['The Arabian Mate'],
    eponym: 'Named for its ancestry: it comes down from the Arabic masters of shatranj, the medieval ancestor of chess, making it the oldest named mate on the board.',
    origin: 'Found in shatranj manuscripts over a thousand years old — composed and studied centuries before the queen and bishop even acquired their modern powers.',
    story:
      'The grandfather of all checkmates. In shatranj the pieces we now call queen and bishop were feeble, short-legged things — the ferz stepped one diagonal square, the alfil hopped exactly two — so the rook and knight were the giants of the medieval board, and the mate they deliver together in the corner is the game\'s oldest recorded finishing pattern, preserved in Arabic manuscripts from the golden age of al-Adli and as-Suli, players whose analysis was the strongest in the world for four hundred years. The pattern itself is a perfect miniature of cooperation: the rook sits beside the cornered king, untouchable because the knight guards it, while the same knight covers the one diagonal flight square. A thousand years of rule changes — the mad queen, the flying bishop, castling itself — and the Arabian mate still lands on modern boards unchanged, a living fossil.',
    significance:
      'Beyond its pedigree, it is the fundamental rook-and-knight mating cell: the knight guarding the rook that the king cannot approach. Rook-and-knight attacks on h7/h8 resolve into it constantly.',
    notableGames: ['as-Suli\'s shatranj studies, 10th century', 'Countless modern games — the pattern ends R+N attacks to this day'],
  },
  {
    id: 'boden-mate',
    aliases: ['Boden\'s Mate', 'The Criss-Cross Mate'],
    eponym: 'Samuel Standidge Boden (1826–1882), English master and The Field\'s chess columnist — Morphy called him the strongest English player he faced.',
    origin: 'From Schulder–Boden, London 1853, a casual game whose queen-sacrifice finish (...Qxc3+!! bxc3 Ba3#) became immortal.',
    story:
      'Samuel Boden was the quintessential Victorian gentleman-amateur — a railway man and painter who played chess brilliantly on the side, beat Morphy in their first casual encounter, and declined to make the game a profession. History repaid the modesty by attaching his name to one of the most beautiful mating patterns in chess, delivered in an otherwise forgettable 1853 skittles game: a queen sacrifice on c3 ripped open the castled queenside, and two bishops closed on the king like scissors — one slicing along each diagonal, the king\'s own rook and pawn blocking every retreat. The pattern is the great argument for the bishop pair as an ATTACKING force: two pieces that never guard each other, arriving from opposite corners of the board, meeting only at the enemy king. Queenside castlers fear it to this day; the ...Qxc3 (or Qxc6) demolition sacrifice against the long-castled king is checked move by move in every Sicilian and Caro-Kann attack.',
    significance:
      'THE pattern that makes queenside castling dangerous: c3/c6 is the permanent soft spot, and every long-castled player calculates the demolition sacrifice by reflex. Also the purest demonstration of criss-crossing bishops as a mating force.',
    notableGames: ['Schulder–Boden, London 1853 (the original: 14...Qxc3+!! 15.bxc3 Ba3#)', 'Alekhine–Vasić, Banja Luka 1931 (10.Qxe6+!! fxe6 11.Bg6# — the most famous later example)'],
  },
  {
    id: 'epaulette-mate',
    aliases: ['The Epaulette Mate', 'Epaulet Mate'],
    eponym: 'No person — named for military dress: the king\'s own rooks (or pieces) sit on the squares at its shoulders like the epaulettes on an officer\'s uniform.',
    origin: 'A staple of the composed-problem tradition and the tactics primer since the 19th century; its most famous over-the-board appearance is Réti\'s queen sacrifice against Bogoljubov\'s teacher — Tartakower called such finishes "the poetry of chess".',
    story:
      'The mate that turns honor guards into pallbearers. A king stands with its own rooks — its decorations, its protectors — on the squares immediately beside it, and precisely because of them it cannot step aside when the enemy queen appears two squares away on the same file: every flight square ahead is covered by the queen, every square beside occupied by a loyal subordinate. The most celebrated example is Réti–Bogoljubov, New York 1924, where Réti finished a positional masterpiece with a quiet bishop retreat that left Black\'s pieces standing at attention around their doomed king; problem composers adore the geometry and have built thousands of studies on it. It is the aristocrat of self-block mates: nothing is pinned, nothing is far away — the defenders simply stand where the king needs to run.',
    significance:
      'The definitive self-block pattern: it teaches attackers to see crowding as a target, and defenders that a king\'s safety is measured in empty squares, not nearby defenders. The parent of the whole dovetail/swallow-tail family of mates.',
    notableGames: ['Réti–Bogoljubov, New York 1924 (the classic finish)', 'A thousand composed problems on the self-block theme'],
  },
  {
    id: 'greek-gift',
    aliases: ['The Greek Gift', 'Classical Bishop Sacrifice', 'Bxh7+'],
    eponym: 'Named for the Trojan Horse — timeo Danaos et dona ferentes, "beware of Greeks bearing gifts": the bishop on h7 is a present the king should never accept, and usually must.',
    origin: 'The oldest analyzed sacrifice in chess: Gioachino Greco set down the model attack in his manuscripts around 1620, and the assessment machinery around it has been refined for four hundred years since.',
    story:
      'Four centuries ago, a Calabrian professional who made his living playing through the courts of Europe wrote down chess\'s first great attacking formula: sacrifice the bishop on h7, follow with knight to g5 and queen to h5, and the castled king\'s position collapses like the walls of Troy. Greco\'s manuscript games — possibly constructed, possibly real, nobody knows — spread the pattern across Europe, and it has since become the most deeply mapped sacrifice in the game: whole book chapters catalogue exactly when it works (queen\'s path to h5 open, knight ready on f3, no defender able to reach f6 or h7 in time) and when it is merely a bishop thrown away. Vukovic\'s "Art of Attack" devotes its most famous chapter to the conditions. It is every attacking player\'s first sacrifice and every French Defense player\'s inherited nightmare — the eternal tax on the move ...O-O played one tempo too early.',
    significance:
      'The archetypal attacking sacrifice: material converted into time and open lines against the king. Its acceptance conditions are the first "sacrifice checklist" most players ever learn, and the threat of it shapes opening theory — entire move orders exist just to keep Bxh7+ unsound.',
    notableGames: ['Greco\'s model attack, c. 1620', 'Edgard Colle\'s career of Bxh7 wins, 1920s', 'Every French and Colle-System primer since'],
  },
];
