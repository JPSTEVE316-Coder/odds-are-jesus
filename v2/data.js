/* ============================================================
   Odds Are Jesus — v2 prophecy dataset
   Odds are Peter Stoner's own from "Science Speaks" (1958;
   first published 1952). Our eight cards ADAPT his list:
   slot 2 uses Isaiah 40:3 (Stoner used Malachi 3:1) and slot 4
   uses Psalm 41:9 (Stoner used Zechariah 13:6). We also use
   Stoner's own 1-in-1,000 for the thirty pieces of silver.
   Scripture texts: King James Version (public domain).
   ============================================================ */

const BIBLE_VERSION = "King James Version (public domain)";

const POPULATION_EVER = 8.8e10; // Stoner's ~88 billion people who have lived

const PROPHECIES = [
  {
    id: 1,
    short: "Born in Bethlehem",
    name: "Birthplace: Bethlehem",
    prophecy: { ref: "Micah 5:2", date: "c. 700 BC" },
    fulfillment: { ref: "Matthew 2:1" },
    base: 280000,
    floor: 1000,
    assumption:
      "Stoner's only empirically derived number: Bethlehem's average population (7,150) ÷ the average human population across history (2 billion). Deliberately rough — the reference-class debate is real, and that's exactly why the doubt dial exists.",
    honest:
      "A critic's note: the Bethlehem birth is reported only by Matthew and Luke, via different mechanisms; some scholars read it as constructed to fit Micah. The math can't adjudicate that — it's a historical question you bring your own priors to.",
    stonerNote: null,
    scripture: {
      prophecy: {
        ref: "Micah 5:2",
        text: "But thou, Bethlehem Ephratah, though thou be little among the thousands of Judah, yet out of thee shall he come forth unto me that is to be ruler in Israel; whose goings forth have been from of old, from everlasting."
      },
      fulfillment: {
        ref: "Matthew 2:1",
        text: "Now when Jesus was born in Bethlehem of Judaea in the days of Herod the king, behold, there came wise men from the east to Jerusalem…"
      }
    }
  },
  {
    id: 2,
    short: "Preceded by a messenger",
    name: "Preceded by Messenger",
    prophecy: { ref: "Isaiah 40:3", date: "centuries BC" },
    fulfillment: { ref: "Matthew 3:1–3" },
    base: 1000,
    floor: 10,
    assumption:
      "Of the people in history who drew a public following, how many were preceded by a herald explicitly 'preparing the way'? A structured guess — heralds and forerunners were common in the ancient world, so weaken it freely if you like.",
    honest:
      "Critical scholars date Isaiah 40–55 to the Babylonian exile (6th century BC) rather than Isaiah's own century — either way, centuries before Jesus, so we say 'centuries,' not '700 years.'",
    stonerNote: "Stoner used Malachi 3:1 for this slot; we follow Matthew's own citation (Isaiah 40:3).",
    scripture: {
      prophecy: {
        ref: "Isaiah 40:3",
        text: "The voice of him that crieth in the wilderness, Prepare ye the way of the LORD, make straight in the desert a highway for our God."
      },
      fulfillment: {
        ref: "Matthew 3:3",
        text: "For this is he that was spoken of by the prophet Esaias, saying, The voice of one crying in the wilderness, Prepare ye the way of the Lord, make his paths straight."
      }
    }
  },
  {
    id: 3,
    short: "Entered on a donkey",
    name: "Entry Method: Donkey",
    prophecy: { ref: "Zechariah 9:9", date: "centuries BC" },
    fulfillment: { ref: "Matthew 21:7" },
    base: 100,
    floor: 2,
    assumption:
      "Kings entered cities on horses or in chariots; a donkey was a deliberate peace symbol. Stoner's students wanted 1 in 10,000 here — he chose 1 in 100.",
    honest:
      "Fair note: the Gospels describe Jesus arranging this one himself — so the honest skeptic move may be unchecking it, not just weakening it. Also, Matthew 21:7 reads the Hebrew poetry so literally that Jesus rides two animals; Mark, Luke, and John describe one. The strongest 'narrative shaped by prophecy' case in the set.",
    stonerNote: null,
    scripture: {
      prophecy: {
        ref: "Zechariah 9:9",
        text: "Rejoice greatly, O daughter of Zion; shout, O daughter of Jerusalem: behold, thy King cometh unto thee: he is just, and having salvation; lowly, and riding upon an ass, and upon a colt the foal of an ass."
      },
      fulfillment: {
        ref: "Matthew 21:7",
        text: "And brought the ass, and the colt, and put on them their clothes, and they set him thereon."
      }
    }
  },
  {
    id: 4,
    short: "Betrayed by a friend",
    name: "Betrayed by Associate",
    prophecy: { ref: "Psalm 41:9", date: "c. 1000 BC" },
    fulfillment: { ref: "John 13:18" },
    base: 1000,
    floor: 10,
    assumption:
      "How often does a betrayal come from inside the trusted inner circle — someone who 'shared bread' — rather than from enemies? A structured guess about the rarity of this specific circumstance.",
    honest:
      "Psalm 41 is David's personal lament about his own betrayers; its messianic reading rests on Jesus's own application of it in John 13:18 — hours before the betrayal.",
    stonerNote: "Stoner used Zechariah 13:6 for this slot; we follow Jesus's own citation (Psalm 41:9, quoted in John 13:18).",
    scripture: {
      prophecy: {
        ref: "Psalm 41:9",
        text: "Yea, mine own familiar friend, in whom I trusted, which did eat of my bread, hath lifted up his heel against me."
      },
      fulfillment: {
        ref: "John 13:18",
        text: "I speak not of you all: I know whom I have chosen: but that the scripture may be fulfilled, He that eateth bread with me hath lifted up his heel against me."
      }
    }
  },
  {
    id: 5,
    short: "Sold for 30 silver pieces",
    name: "Price: 30 Silver Pieces",
    prophecy: { ref: "Zechariah 11:12", date: "centuries BC" },
    fulfillment: { ref: "Matthew 26:15" },
    base: 1000,
    floor: 10,
    pair: 6,
    assumption:
      "Stoner's students said 1 in 10,000; he chose 1 in 1,000 — we use his number, not the stronger one. The estimate prices the exact amount: thirty pieces of silver, the legal price of a slave (Exodus 21:32) — a contempt-price.",
    honest:
      "Same passage as #6 (Zechariah 11:12–13). Counting both as independent events is the weakest link in the model — merge them below if you're being strict.",
    stonerNote: null,
    scripture: {
      prophecy: {
        ref: "Zechariah 11:12",
        text: "And I said unto them, If ye think good, give me my price; and if not, forbear. So they weighed for my price thirty pieces of silver."
      },
      fulfillment: {
        ref: "Matthew 26:15",
        text: "And said unto them, What will ye give me, and I will deliver him unto you? And they covenanted with him for thirty pieces of silver."
      }
    }
  },
  {
    id: 6,
    short: "Silver buys a potter's field",
    name: "Money → Potter's Field",
    prophecy: { ref: "Zechariah 11:13", date: "centuries BC" },
    fulfillment: { ref: "Matthew 27:7" },
    base: 100000,
    floor: 100,
    pair: 5,
    assumption:
      "The compound sequence: betrayal money thrown into the temple, then used to buy a specific potter's field. Stoner's students were 'very sure this was conservative' — but it's the same passage as #5, so strict skeptics should merge them below.",
    honest:
      "Two fair notes. First, Matthew attributes the quote to Jeremiah (27:9) — scholars read it as a deliberate fusion of Zechariah 11 with Jeremiah's potter-and-field passages (chapters 18–19), the same composite-citation habit as Mark 1:2–3 attributing Malachi to Isaiah. Second, 'potter' vs. 'treasury' differs by the revocalization of one Hebrew word.",
    stonerNote: null,
    scripture: {
      prophecy: {
        ref: "Zechariah 11:13",
        text: "And the LORD said unto me, Cast it unto the potter: a goodly price that I was prised at of them. And I took the thirty pieces of silver, and cast them to the potter in the house of the LORD."
      },
      fulfillment: {
        ref: "Matthew 27:7",
        text: "And they took counsel, and bought with them the potter's field, to bury strangers in."
      }
    }
  },
  {
    id: 7,
    short: "Refused to defend himself",
    name: "Refused to Defend Himself",
    prophecy: { ref: "Isaiah 53:7", date: "centuries BC" },
    fulfillment: { ref: "Matthew 27:14" },
    base: 1000,
    floor: 10,
    assumption:
      "A man facing execution who refuses to answer his accusers' charges. Note the retitle: he did answer Pilate's direct question (Matthew 27:11) — the 'silence' was refusing to defend himself, which is exactly what Isaiah 53:7 describes.",
    honest:
      "John shows him speaking at length before the authorities, and silence can be a deliberate choice (dignity, defiance) rather than a chance event. Scholars also debate whether Isaiah's 'servant' is Israel or an individual; the New Testament reads it as Jesus (Acts 8:32–35).",
    stonerNote: null,
    scripture: {
      prophecy: {
        ref: "Isaiah 53:7",
        text: "He was oppressed, and he was afflicted, yet he opened not his mouth: he is brought as a lamb to the slaughter, and as a sheep before her shearers is dumb, so he openeth not his mouth."
      },
      fulfillment: {
        ref: "Matthew 27:14",
        text: "And he answered him to never a word; insomuch that the governor marvelled greatly."
      }
    }
  },
  {
    id: 8,
    short: "Crucified: pierced hands & feet",
    name: "Execution: Crucifixion",
    prophecy: { ref: "Psalm 22:16", date: "c. 1000 BC" },
    fulfillment: { ref: "John 20:25" },
    base: 10000,
    floor: 100,
    assumption:
      "Stoner's 'study of execution methods' estimate. The honest reference class is debatable — condition on Roman execution in the 1st century and crucifixion was common. The case here is the whole psalm: pierced hands and feet (~1000 BC, some nine centuries before Rome made crucifixion its standard execution), the opening cry, the mocking, the divided garments — all echoed at the cross.",
    honest:
      "Three corrections in one card. (1) The Hebrew of v.16 is disputed: 'like a lion' in the Masoretic tradition, 'pierced' in the Greek translation and a Dead Sea Scroll fragment — translators divide. (2) Crucifixion was not invented by Rome; Persia used it centuries earlier. (3) So the card rests on the whole-psalm pattern, not on one disputed word.",
    stonerNote: null,
    scripture: {
      prophecy: {
        ref: "Psalm 22:16",
        text: "For dogs have compassed me: the assembly of the wicked have inclosed me: they pierced my hands and my feet."
      },
      fulfillment: {
        ref: "John 20:25",
        text: "Except I shall see in his hands the print of the nails, and put my finger into the print of the nails, and thrust my hand into his side, I will not believe."
      }
    }
  }
];

const SOURCES = [
  {
    label: "Read Stoner yourself — Science Speaks, Ch. 3 “The Christ of Prophecy” (full text, official online edition)",
    url: "http://sciencespeaks.dstoner.net/Christ_of_Prophecy.html"
  },
  {
    label: "Scanned original text (Internet Archive)",
    url: "https://archive.org/stream/sciencespeakspeterw.stoner/SCIENCE%20SPEAKS-%20Peter%20W.%20Stoner_djvu.txt"
  },
  {
    label: "Who the American Scientific Affiliation is, in their own words (a fellowship of Christian scientists)",
    url: "https://asa3.org/ASA/education/aboutasa/index.html"
  },
  {
    label: "Look up every verse — BibleGateway",
    url: "https://www.biblegateway.com/"
  },
  {
    label: "Verse-by-verse commentary — BibleHub (incl. the Zechariah 11:13 / Jeremiah-attribution thread)",
    url: "http://biblehub.com/commentaries/zechariah/11-13.htm"
  },
  {
    label: "A serious critical take on the math — Mark Chu-Carroll's “Fundie Probability”",
    url: "http://www.goodmath.org/blog/2006/06/24/fundie-probability-even-worse-math-than-swinburne/"
  },
  {
    label: "The in-house caution — Stoner's grandson on the limits of the argument (“A Warning to Apologists”)",
    url: "http://sciencespeaks.dstoner.net/"
  },
  {
    label: "The Psalm 22:16 textual debate (“pierced” vs. “like a lion”)",
    url: "https://en.wikipedia.org/wiki/They_have_pierced_my_hands_and_my_feet"
  }
];
