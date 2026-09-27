/* ============================================================
   Odds Are Jesus — "Chance"
   Faith-based mathematician & statistician. Speaks to all
   Stoner facts: the man, the book, the eight estimates, the
   methodology, the 48-prophecy extension — plus the full
   statistician's toolkit (independence, selection bias,
   reference classes, Bayesian framing) and honest answers
   to every standard objection.

   Local answer engine: keyword matching over a curated Q&A
   base. No network calls, no tracking.

   UPGRADE PATH: set BACKEND_URL to a chat API endpoint at
   deploy time to swap the local engine for live LLM replies.
   ============================================================ */
(function () {
  "use strict";

  var BACKEND_URL = null; // e.g. "https://api.oddsarejesus.com/chat"

  /* Customer Service Team referral: when a question falls outside Chance's
     scope, he offers to pass it to the Customer Service Team (Rocky).
     Submissions land in the "OAJ Chance referrals" Google Form; the linked
     sheet is monitored and every referral gets a personal follow-up. */
  var REFERRAL_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdIWVTdT8ndzytWrEMd9zg7e3oPx8rH0o8krdsf7TkTddYgHQ/formResponse";
  var REFERRAL_EMAIL_ENTRY = "entry.1058000927";    // "Your email"
  var REFERRAL_QUESTION_ENTRY = "entry.1665292420"; // "Your question for our Customer Service Team"

  /* ---------------- knowledge base ---------------- */
  // k: match phrases (word-boundary matched, case-insensitive,
  //     singular/plural tolerant). r: reply (may include
  //     <a href="#..."> links; authored, trusted).
  var KB = [

    /* ===== STONER: THE MAN ===== */
    { k: ["who was stoner", "peter stoner", "peter w. stoner", "about stoner", "stoner's background", "stoner bio", "for a living", "what did stoner do", "his job", "stoners job", "his work", "career", "profession", "professor", "chairman", "scientist", "when did stoner live", "stoner's dates", "1888"],
      r: "Peter W. Stoner (June 16, 1888 – March 21, 1980) — chairman of Mathematics and Astronomy at Pasadena City College until 1953, then science division chairman at Westmont College (1953–57); professor emeritus of both. Not a theologian by trade: a working mathematician and astronomer who turned probability loose on prophecy." },

    { k: ["stoner's religion", "his religion", "religion was", "denomination", "what did he believe", "his faith", "was he a christian", "stoner's faith"],
      r: "A Christian \u2014 specifically, one of the five founders of the American Scientific Affiliation, a fellowship of Christian scientists. His denomination isn\u2019t on record in my sources, and I won\u2019t guess." },

    { k: ["science speaks", "the book", "stoner's book", "what book"],
      r: "<em>Science Speaks: Scientific Proof of the Accuracy of Prophecy and the Bible</em> — editions in 1944, 1952 (Van Kampen Press), 1958, 1963, 1968/69, and a 1976 revision (Moody Press) co-credited to Robert C. Newman (Ph.D. astrophysics, Cornell, 1967). The full text is free online at sciencespeaks.dstoner.net, maintained by Stoner's grandson Don. Chapter 3, \u201cThe Christ of Prophecy,\u201d is the one with the math." },

    { k: ["thesis", "stoner's thesis", "central argument", "trying to prove", "in a nutshell", "sum up", "the whole argument", "point of the book", "book's argument", "what does he argue", "stoner's case", "his case for the bible", "case for the bible", "why did stoner", "write the book"],
      r: "Stoner's thesis in one paragraph: fulfilled prophecy is measurable evidence of divine authorship, and the measurement is probability. Four moves: Genesis 1 agrees with modern science though written millennia before it (ch. 1); prophecies about cities and nations \u2014 Tyre, Samaria, Babylon \u2014 were fulfilled literally (ch. 2); eight prophecies about one man converge at 1 in 10\u00b9\u2077 against chance (ch. 3); extended to 48, it's 1 in 10\u00b9\u2075\u2077 (ch. 3). Chapter 4 combines all three chapters into a single calculation of 1 in 1.5\u00d710\u00b2\u00b3\u2079. His conclusion: \u201cthe universe is not large enough to hold the evidence.\u201d Why write it? His preface: young people\u2019s faith was being wrecked in college by supposed science-vs-Scripture conflicts, so he laid the two side by side for anyone to compare." },

    { k: ["where can i read", "read the book", "read science speaks", "full text", "online edition", "free online", "read it online", "buy the book", "in print", "still in print", "get a copy", "download the book", "find the book"],
      r: "The complete text is free at sciencespeaks.dstoner.net \u2014 the online edition (revised 2005), maintained by his grandson Don W. Stoner \u2014 and a scanned print lives at the Internet Archive. Print history: 1944 (preface edition), Van Kampen Press 1952, Moody Press 1958, 1963, 1968/69, revised 1976. For a print copy today, think used bookshops; the pixels are free." },

    { k: ["asa", "american scientific affiliation", "foreword", "peer review", "peer reviewed", "peer-review", "hartzler", "endorsement", "endorse", "endorsed", "scientists"],
      r: "The ASA foreword is real, and quotable in full: a committee of the American Scientific Affiliation plus its Executive Council reviewed the manuscript and found it \u201cin general, to be dependable and accurate in regard to the scientific material presented.\u201d On the math, the complete sentence: \u201cThe mathematical analysis included is based upon principles of probability which are thoroughly sound and Professor Stoner has applied these principles in a proper and convincing way.\u201d Signed H. Harold Hartzler, Ph.D., Secretary-Treasurer (Goshen College, Indiana). The honest framing: the ASA is a fellowship of Christian scientists, and Stoner was one of its five founders — so it was a foreword endorsement by sympathetic colleagues, not blind peer review. It vouches for the arithmetic, not the conclusions." },

    { k: ["newman", "robert newman", "robert c. newman", "co-author", "coauthor", "co-authored", "cowrote", "helped stoner", "helped write", "who helped", "1976 revision", "revised 1976"],
      r: "Robert C. Newman \u2014 Ph.D. in astrophysics from Cornell (1967), later professor of New Testament \u2014 co-credited on the 1976 revised edition of <em>Science Speaks</em>. Stoner\u2019s book, Newman\u2019s revision; the probability chapters are Stoner\u2019s." },

    { k: ["how were the estimates made", "how did stoner estimate", "come up with", "came up with", "where did the numbers come from", "where did he get", "students estimate", "students", "agree", "600 students", "methodology", "how did he estimate"],
      r: "An Inter-Varsity Christian Fellowship class at Pasadena City College debated each prophecy \u201cat length\u201d and agreed unanimously on estimates they called reasonable and conservative. Stoner combined those with about twelve classes — 600+ students total — weighed them himself, and lowered some further. Then he invited readers: \u201cIf the reader does not agree with the estimates given, he may make his own estimates and carry them through.\u201d That invitation is the intellectual ancestor of this site's doubt dial." },

    { k: ["lowered", "lower", "why lower", "why did he lower", "conservative", "reduced the", "students wanted larger", "students said", "students say", "what did the students", "three times"],
      r: "Three times his students argued for bigger odds and Stoner deliberately picked smaller ones: the donkey entry (he used 1 in 100), the thirty pieces of silver (students said 1 in 10,000; he used 1 in 1,000), and the silence under accusation (students said 1 in 10,000; he used 1 in 1,000). The bias, where it exists, runs against his own conclusion." },

    { k: ["eight estimates", "stoner's eight", "eight numbers", "exact odds", "exact estimates", "all eight numbers", "stoner's numbers"],
      r: "Stoner's eight, exactly: Bethlehem 1 in 280,000; the forerunner 1 in 1,000; the donkey entry 1 in 100; wounded in the house of friends 1 in 1,000; thirty pieces of silver 1 in 1,000; cast to the potter 1 in 100,000; silent under affliction 1 in 1,000; crucified 1 in 10,000. Multiply: 1 in 2.8\u00d710\u00b2\u2078 for one person. Divide by ~88 billion people: about 1 in 3.2\u00d710\u00b9\u2077 — Stoner's famous \u201c1 in 10\u00b9\u2077\u201d is the rounded, conservative version." },

    { k: ["88 billion", "88billion", "ever lived", "population", "how many people", "the divisor", "divided by"],
      r: "About 88 billion — Stoner's estimate of everyone who has lived since the prophecies were written (his words, ch. 3). He divided the per-person figure by all of them, conceding the skeptic's \u201cwith that many people, someone was bound to match\u201d objection before anyone raised it. Fun footnote: the online edition's editor admits 88 billion may be ~10\u00d7 too high — which would make the answer 1 in 10\u00b9\u2078. His direction of error was conservative." },

    { k: ["48", "to the 157", "157", "forty-eight", "extended", "electrons", "electron"],
      r: "Stoner extended the same math to 48 prophecies and stated the aggregate as 1 in 10\u00b9\u2075\u2077. Scholar's footnote, because we checked the print scan: the book gives the per-prophecy figure as 1 in 10\u00b2\u00b9 — which doesn't multiply out (48 \u00d7 21 = 1,008, not 157). It's an erratum in Stoner's own text; 10\u00b9\u2075\u2077 is his stated conclusion either way. His illustration still stands: electrons, 2.5 \u00d7 10\u00b9\u2075 to the inch (count 250 a minute, day and night, and one inch takes 19 million years). Take 10\u00b9\u2075\u2077 of them, mark one, stir: they'd fill a ball six billion light-years in radius, 6 \u00d7 10\u00b2\u2078 times over. His closing line: \u201cthe universe is not large enough to hold the evidence.\u201d See <a href=\"#punchline\">the punchline</a>." },

    { k: ["punchline", "warm-up", "warm up", "just the warm", "now imagine 300", "imagine 300", "why only eight", "only eight", "eight was just", "the other 292", "292", "rest of the prophecies", "what's the point"],
      r: "The punchline is the whole argument in one breath: eight was just the warm-up. Stoner ran the same math on 48 prophecies and stated 1 in 10\u00b9\u2075\u2077 (with the erratum we disclose \u2014 his per-prophecy figures don't multiply out). The catalogs keep going: lists of Old Testament passages applied to Jesus run past 300, some top 365. We'll say before anyone else does: not every entry is equally strong \u2014 some are dependent, some may have been arranged, some are weakly supported, and list size alone proves nothing. Each additional specific, independent, well-supported prophecy with a defensible estimate would push the number further; that's the bar. And note the order of operations: we handed you the doubt dial first, disclosed every weakness first, and the number survived anyway. Now imagine 300 \u2014 done right. See <a href=\"#punchline\">the punchline</a>." },

    { k: ["texas", "silver dollar", "silver dollars", "marked coin", "the coin", "illustration", "tickets in a hat", "ten tickets"],
      r: "Stoner's setup: mark one of ten tickets, stir them in a hat, draw blindfolded — that's 1 in 10. Now scale up: 10\u00b9\u2077 silver dollars cover Texas two feet deep. Mark one, stir the whole state, and find it blindfolded on your first try. Same idea — sixteen orders of magnitude more absurd." },

    { k: ["site's eight", "adapted", "different from stoner", "different", "vs stoner", "changed the list", "isaiah 40:3", "psalm 41:9", "two slots", "not stoner's"],
      r: "This site's eight adapt Stoner's list in two slots, and we disclose both: we use Isaiah 40:3 for the forerunner (Stoner used Malachi 3:1) because it's the passage Matthew himself quotes, and Psalm 41:9 for the betrayal (Stoner used Zechariah 13:6) because it's the passage Jesus himself applies to Judas in John 13:18." },

    { k: ["don stoner", "grandson", "warning to apologists", "family"],
      r: "Don W. Stoner — Peter Stoner's grandson — maintains the official online edition at sciencespeaks.dstoner.net (2002/2005), and wrote both Appendix 3 (\u201cA Challenge to Critics of Chapter 3\u201d) and Appendix 4 (\u201cA Challenge to Apologists\u201d). Its front page carries his \u201cWarning to Apologists\u201d: the book is \u201cmore likely to be weighed for its historical significance than its usefulness as an evangelical tool,\u201d and the numerator of 1 Stoner assumed for each fulfillment doesn't hold up as cleanly today. We quote the family's skepticism because honesty is the brand." },

    { k: ["appendix", "appendices", "appendix 1", "appendix 2", "appendix 3", "appendix 4", "1944", "first edition", "preface to the 1944", "other interpretations of genesis", "challenge to critics", "challenge to apologists", "george davis", "fulfilled prophecies that prove the bible"],
      r: "Four appendices: (1) the preface to the 1944 edition \u2014 the cover gallery in the online edition starts there, though the first trade publication was 1952 with Van Kampen Press; (2) \u201cOther Interpretations of Genesis\u201d \u2014 alternate readings of the creation account; (3) Don W. Stoner's \u201cChallenge to Critics of Chapter 3\u201d; (4) his \u201cChallenge to Apologists,\u201d aimed at himself in Appendix 3 too \u2014 century-old arguments now face a century of objections. Source note from the online edition: chapter 2's arguments followed George T. B. Davis's 1931 <em>Fulfilled Prophecies that Prove the Bible</em>, from a copy in Peter Stoner's library." },

    { k: ["evolution", "evolve", "darwin", "darwinism", "creation", "old earth", "young earth", "creationism"],
      r: "Not on record in my sources, and I won\u2019t guess. What I can tell you: Appendix 2 is \u201cOther Interpretations of Genesis\u201d \u2014 alternate readings of the creation account \u2014 and his grandson Don wrote <em>A New Look at an Old Earth</em>. Peter\u2019s own position on evolution isn\u2019t something the book states outright." },

    { k: ["critics", "critic", "criticized", "criticism", "critique", "debunked", "refuted", "skeptics of stoner", "chu-carroll", "goodmath", "fundie probability"],
      r: "The sharpest statistical critique is computer scientist Mark Chu-Carroll's \u201cFundie Probability\u201d essay: he argues the independence and interpretation assumptions don't hold, so the product overstates the case. We link our critics on the site — check our math, check our verses, make up your own mind." },

    { k: ["read stoner", "stoner's text", "full text", "chapter 3", "christ of prophecy"],
      r: "Read him yourself — Chapter 3, \u201cThe Christ of Prophecy,\u201d free at sciencespeaks.dstoner.net/Christ_of_Prophecy.html. We'd rather you check the source than take our word." },

    { k: ["one man in how many", "framing question", "unbiased", "sacrilegious", "look at the evidence"],
      r: "Stoner's framing question for each prophecy: \u201cOne man in how many men has fulfilled this prophecy?\u201d He knew it sounded cheeky: \u201cI certainly am not trying to be sacrilegious,\u201d he wrote, \u201cbut I am trying to look at the evidence entirely unbiased, that I may the better give a clear argument.\u201d His point stands: Bethlehem births and crucifixions happened to other men — only the combination is the argument." },

    { k: ["library assistant", "280,000", "7150", "7,150", "bethlehem population", "how did they estimate bethlehem"],
      r: "For Bethlehem, one class member happened to be a library assistant, so he drew the research job: Bethlehem's population averaged under 7,150 from Micah's day to Stoner's, against an earth averaging under 2 billion — 1 in 280,000. That's the only estimate in the eight built on archival legwork rather than judgment." },

    { k: ["16 prophecies", "sixteen prophecies", "10^45", "ten to the 45", "doubled", "double the eight"],
      r: "Stoner's midpoint: double the eight to sixteen (same per-prophecy odds) and you get 1 in 10\u2074\u2075. His illustration: a solid ball of silver dollars centered on the earth, reaching 30 times farther than the sun — mark one, stir, find it blindfolded. (His aside: a train leaving earth at 60 mph when the Declaration of Independence was signed would just now be reaching the sun. The ball stretches 30\u00d7 that far.)" },

    { k: ["300 prophecies", "three hundred", "1 in 4", "one in four", "ridiculously low", "nazareth", "rich man's tomb", "taken to egypt"],
      r: "Stoner's dare: take 300+ prophecies and set every estimate \u201cridiculously low\u201d — 1 in 4. One man in four born in Bethlehem; one in four of those taken to Egypt; one in four home to Nazareth; a carpenter; betrayed for thirty pieces; crucified; buried in a rich man's tomb; risen the third day — \u201cand so on for all of the three hundred prophecies, and from them I will build a number much larger than the one we obtained from the forty-eight.\u201d We'll say what he didn't: not all 300 are equally strong." },

    { k: ["365", "three hundred sixty-five", "three sixty five", "one a day", "365 messianic", "where does 365"],
      r: "The 365 is a popular count, not a scholarly one: several Christian catalogs list 365 Messianic prophecies — a one-a-day devotional framing. Counts vary because compilers disagree on what counts: distinct predictions versus repeated references, direct prophecies versus types and shadows. That's why the site says lists \u201crun past 300 \u2014 some top 365\u201d and adds, before anyone else does, that not every entry is equally strong. The punchline doesn't need all 365 to be airtight; the direction runs one way. See <a href=\"#punchline\">the punchline</a>." },

    { k: ["chapter 4", "10^239", "ten to the 239", "all three chapters", "combined probability", "1.5"],
      r: "Stoner didn't stop at chapter 3: multiplying the probabilities from all three chapters — Genesis and science, the geographical prophecies, the Christ of prophecy — gives 1 in 1.5 \u00d7 10\u00b2\u00b3\u2079, \u201cevidence so overwhelming that no human mind can make any start at comprehending the definiteness of it.\u201d" },

    { k: ["stoner's conclusion", "what did stoner conclude", "lacks only one chance", "absolute", "investment analogy", "the investment"],
      r: "His own verdict on the eight: their fulfillment \u201cproves that God inspired the writing of those prophecies to a definiteness which lacks only one chance in 10\u00b9\u2077 of being absolute.\u201d Then the closer: \u201cWhoever heard of an investment that had only one chance in 10\u00b9\u2077 of failure?\u201d — accepting Christ, he said, is that investment." },

    { k: ["submit your own", "add a few more prophecies", "reestablished", "standing offer", "challenge to critics", "stoner's challenge", "was stoner's challenge"],
      r: "Stoner's standing offer to critics: \u201cAsk a man to submit his own estimates, and if they are smaller than these we have used, we shall add a few more prophecies to be evaluated and this same number will be reestablished or perhaps exceeded.\u201d This site's doubt dial is that sentence, built in JavaScript." },

    { k: ["chapter 1", "chapter one", "genesis and science", "genesis 1", "young's general astronomy", "young's", "1898", "scientific accuracy", "changes in science", "thirteen acts", "genesis", "introduction"],
      r: "Chapter 1, \u201cChanges in Science,\u201d argues from Genesis 1 \u2014 and the introduction sets it up with an object lesson: Young's General Astronomy (1898), the standard college text of its day, is now wrong about nearly everything beyond the solar system \u2014 dark \u201choles\u201d that are nebulas, spiral nebulas that are galaxies. Less than a century undid it. Genesis 1 is thousands of years old; if it merely reflected the science of its day, its definite statements should be mostly wrong. Instead, Stoner argues, its thirteen named acts, in their stated order \u2014 \u201ccreated,\u201d \u201cmade,\u201d \u201clet\u201d \u2014 agree with modern findings. Agreement that couldn't have come from the science of Moses' day." },

    { k: ["tyre", "tyrus", "ezekiel 26", "spreading nets", "fishermen", "alexander the great", "causeway", "seven things about tyre", "seven predictions", "nebuchadnezzar tyre", "sour lebanon"],
      r: "Chapter 2's showpiece: Ezekiel 26 (590 B.C.) names seven definite things about Tyre \u2014 Nebuchadnezzar takes it (a 13-year siege, 586\u2013573 B.C.); other nations finish the job (Alexander's coalition, 332 B.C.); the city scraped flat like a rock; a place for spreading nets (Stoner's 1944 account; not verified as current); its stones, timber and dust laid in the sea (Alexander's causeway); neighboring cities surrender in fear; and the old city never rebuilt (Stoner's 1944 claim \u2014 he noted the springs flowing 10 million gallons a day made it an ideal city site). Students estimated each item from human knowledge alone (item 1: 1 in 3). Scholar's honesty note, from Don Stoner himself: chapter 2 is \u201cseverely in need of updating\u201d \u2014 modern Tyre (Sour, Lebanon) has expanded, and the ancient mainland site can't be precisely located. It's presented largely unchanged." },

    { k: ["chapter 2", "geographical prophecies", "geography", "tyre", "samaria", "edom", "babylon", "gaza", "ashkelon", "jericho", "jerico", "golden gate", "zion plowed", "jerusalem enlarged", "palestine", "moab", "ammon"],
      r: "Chapter 2, \u201cProphetic Accuracy,\u201d runs the same method on geography: Tyre, Samaria, Gaza and Ashkelon, Jericho, the Golden Gate, Zion plowed, Jerusalem enlarged, Moab and Ammon, Edom, Babylon. Chapter 3 is the Christ chapter — eight prophecies at 1 in 10¹⁷, extended to 48 at 1 in 10¹⁵⁷ — and chapter 4 combines all three chapters into one calculation of 1 in 1.5×10²³⁹." },


    /* ===== THE STATISTICIAN'S TOOLKIT ===== */
    { k: ["what is the math based on", "math based on", "based on", "behind the math", "behind it", "what's behind", "basis", "what drives the math", "foundations", "foundation", "underlying", "assumptions", "premise", "what is the math", "how the math works", "how does the math work", "explain the math", "how's math work", "hows the math work", "how math works", "how the math", "how it works", "how does it work", "what are the odds", "what are the chances", "how did he get", "explain it", "explain the whole thing", "what's the math", "whats the math", "is the math legit", "math legit", "does the math hold up", "math hold up", "how was it calculated", "break down the math", "behind all this"],
      r: "Three things. <strong>One:</strong> eight probability estimates — one per prophecy — from Stoner's classes of 600+ students, who called them reasonable and conservative (three times Stoner went lower than his students wanted). <strong>Two:</strong> the multiplication rule, which combines them (valid if the events are independent — the weakest link, and we disclose it). <strong>Three:</strong> the 88-billion divisor — the per-person figure divided by Stoner's estimate of everyone who has lived since the prophecies were written, conceding the skeptic's objection up front. Disagree with any of it? The <a href=\"#calculator\">calculator</a> lets you change it." },

    { k: ["multiplication rule", "multiply", "multiplying", "product rule"],
      r: "P(A and B) = P(A) \u00d7 P(B) — but only if A and B are independent. Otherwise it's P(A) \u00d7 P(B|A). The multiplication itself is first-week statistics and nobody disputes it; every real argument is about the inputs — the estimates and the independence assumption." },

    { k: ["independent", "independence", "correlation", "correlated", "merge them", "weak link", "dependence"],
      r: "Independence is the weakest link, and we say so on the page. Three prophecies — the betrayal, the thirty coins, the potter's field — are consecutive beats of one connected story in Matthew 26–27 (the last two drawn from Zechariah 11:12–13), so multiplying them as independent events is generous to our side. The deep-dives let you merge them into a single event. Even merged, the number stays enormous." },

    { k: ["log", "logarithm", "log-space", "how does the calculator", "how the calculator", "calculator work", "calculator math", "adding logarithms"],
      r: "The calculator works in log-space: instead of multiplying astronomically small numbers (which computers fumble), it adds their logarithms. log\u2081\u2080(10\u00b9\u2077) = 17 — the readout is just counting zeros. Same arithmetic Stoner did by hand, minus the rounding errors." },

    { k: ["texas sharpshooter", "sharpshooter", "selection bias", "selection effect", "post-hoc", "post hoc", "look-elsewhere", "look elsewhere", "data dredging", "painted the target"],
      r: "The most serious statistical objection: drawing the bullseye after the shots. Two honest parts to the answer. First, the targets were painted centuries before the shots — every passage predates Jesus under any mainstream dating, so this isn't retrofitting after the fact. Second, choosing 8 from 300+ candidates IS a real selection effect, and the math doesn't discount for it — which is why the site discloses it instead of hiding it. You can shrink the number with the doubt dial to reflect your doubt; the margin is enormous." },

    { k: ["cherry", "cherry-pick", "cherry pick", "why these 8", "why these eight", "pick these", "from 300", "selected", "confirmation bias"],
      r: "Fair question, and we disclose it right on the page: Stoner picked these 8 from 300+ candidates, and the math doesn't discount for that selection. That's exactly why it's listed as a caveat instead of hidden." },

    { k: ["law of truly large numbers", "truly large", "unlikely things happen", "with enough chances", "lottery fallacy", "someone wins"],
      r: "Diaconis and Mosteller's law of truly large numbers: with enough opportunities, outrageous coincidences happen routinely. Stoner's whole 88-billion divisor IS the answer to this — he already gave chance every opportunity in human history, and the number still came out 1 in 10\u00b9\u2077." },

    { k: ["reference class", "denominator", "among jews", "first-century"],
      r: "Sharp question — the reference-class problem. Bethlehem at 1 in 280,000 is measured against all humans ever; against 1st-century Jews it would be likelier. Every estimate smuggles in a reference class, which is why they're judgment calls, not measurements. Disagree with one? That's what the adjusters are for." },

    { k: ["sensitivity", "sensitivity analysis", "which matters most", "biggest driver", "what drives the number"],
      r: "The doubt dial is sensitivity analysis with a friendly face. The result is driven by the smallest probabilities — Bethlehem (1 in 280,000) and the potter's field (1 in 100,000) do most of the work. And it has margin: in our testing, all eight at 1% skepticism still clear the one-in-all-of-history bar." },

    { k: ["bayes", "bayesian", "prior", "posterior", "likelihood ratio", "update"],
      r: "The Bayesian reading: 10\u00b9\u2077 works like a likelihood ratio against the chance hypothesis — posterior odds = prior odds \u00d7 likelihood ratio. So a skeptic with an extremely low prior stays unmoved, and that's coherent, not a math error. The math can't set your prior; that's your worldview, and we don't pretend otherwise." },

    { k: ["per-person", "per person", "one person", "2.8", "to the 28"],
      r: "Two numbers, don't mix them: 1 in 2.8\u00d710\u00b2\u2078 is the chance for one given person matching all eight. 1 in 10\u00b9\u2077 is after dividing by ~88 billion people — the chance that ANYONE in all of history matches by luck. The second is the steel-manned one." },

    { k: ["expected", "expectation", "how many would match"],
      r: "Flip it around: with ~88 billion people in history, Bethlehem alone (1 in 280,000) predicts about 314,000 matches by luck. The first three prophecies together predict about 3. All eight predict essentially zero — about 1 in 3.2\u00d710\u00b9\u2077. That's what the calculator's partial states show you." },

    { k: ["orders of magnitude", "scale of", "how big is 10", "compare 10^17", "10^28 vs"],
      r: "For scale: 10\u00b9\u2077 is our number. 10\u00b2\u2078 is the per-person figure. 10\u00b9\u2075\u2077 is Stoner's 48-prophecy extension. The observable universe holds ~10\u2078\u2070 atoms — so 10\u00b9\u2075\u2077 is vastly larger than the atom count of the universe. These aren't just big numbers; they're different universes of big." },

    { k: ["what would break", "what would change", "falsify", "could the number be wrong", "assumptions matter"],
      r: "Three things move it most: (1) the independence assumption — merge the linked betrayal chain and it drops, but stays huge; (2) the smallest estimates — Bethlehem and the potter's field carry the weight; (3) whether the Gospel accounts report real events — the math takes that as given, and if you doubt the accounts, that's where your skepticism belongs. Everything else is rounding." },

    { k: ["didn't fulfill", "didnt fulfill", "unfulfilled", "failed prophecies", "not fulfilled", "prophecies he didn't", "second coming"],
      r: "Fair question. Some prophecies are unfulfilled on any reading — Christians traditionally read the lion-and-lamb peace of Isaiah 11, Zechariah 14, as awaiting a second coming. This site claims nothing about those; it runs the numbers on eight passages with specific, checkable fulfillments claimed in the Gospels. The math doesn't touch the rest — and we'd rather say that than overclaim." },

    { k: ["vague", "vagueness", "fit anyone", "could fit anyone", "vague enough", "so vague"],
      r: "Some passages ARE vague — which is why the eight were picked for specificity: a named town, a price, an execution method. Vague prophecies don't survive an estimator's pen; specific ones are the whole game. And we show where the specificity frays — Psalm 22:16's disputed Hebrew, for instance. Check each card's critics' section." },

    { k: ["p-value", "p value", "statistical significance", "significant"],
      r: "Careful: this isn't a p-value. It's closer to a likelihood ratio — it doesn't say \u201cthe probability Jesus is the Messiah is X.\u201d It says: if chance alone produced this match, that would be a 1-in-10\u00b9\u2077 surprise. Surprising isn't the same as proven." },

    { k: ["numerator", "assumed 1", "presumed"],
      r: "Stoner set every fulfillment numerator to 1 — i.e., he assumed each prophecy was definitely fulfilled as described. His own grandson flags this as the shakiest assumption today. In plain terms: the math measures the match IF the accounts hold; judging the accounts is history's job, not arithmetic's." },

    { k: ["doubt dial", "skepticism", "doubt", "slider", "skeptical", "change the numbers", "my own estimates", "adjust the numbers", "customize"],
      r: "The doubt dial is our honesty instrument — and Stoner's own idea, more than 70 years early: he told readers to substitute their own estimates. It scales every estimate down by your chosen skepticism — 50%, 10%, even 1%. The number usually survives anyway. Try it in the <a href=\"#calculator\">calculator</a>." },

    /* ===== OBJECTIONS ===== */
    { k: ["proof", "prove", "does this prove", "should i believe", "convinced me", "convince me", "is it true", "is this proof", "circular", "circular reasoning", "begging the question"],
      r: "No — the argument isn't circular, and we don't claim it proves anything. The number measures how surprising a chance match would be, not what you should conclude. Probability is supporting evidence, not the headline. That's your call to make." },

    { k: ["gospels were written to fit", "written to fit", "written to match", "match the prophecies", "gospels written", "gospel writers", "gospel writer", "shaped the narrative", "evangelists shaped", "made it fit", "make it fit", "matthew shaped"],
      r: "True as far as it goes: the evangelists knew the Scriptures, and some scenes look shaped by them — Matthew putting Jesus on two donkeys (reading Hebrew poetic parallelism woodenly literally) is the clearest case, and we name it on the site. The math assumes the events happened as reported; judging that is history's job. The number quantifies the match IF the accounts hold." },

    { k: ["deliberate", "deliberately", "fulfilled", "fulfill them", "arranged", "staged", "on purpose", "set up the donkey"],
      r: "Some fulfillments may have been deliberate — the Gospels describe Jesus arranging the donkey himself. But nobody arranges their birthplace, their betrayer's price, or their execution method. Deliberate action explains at most the cheap seats." },

    { k: ["dating", "written after", "after jesus", "after the fact", "when were they written"],
      r: "Every one of the eight passages predates Jesus by centuries under any mainstream dating: Micah is 8th century BC (relatively uncontested), Isaiah 40–55 is exilic (6th c.), Zechariah 9–14 is Hellenistic, Psalm 22 is traditionally ~1000 BC. No mainstream scholar dates any of them after Jesus." },

    { k: ["just a coincidence", "mere coincidence", "coincidence"],
      r: "That's exactly what the number quantifies — how surprising the coincidence would be. 1 in 10\u00b9\u2077 is the size of the surprise. Whether surprise should move you is the part no equation can settle." },

    { k: ["other religions", "other figures", "muhammad", "buddha", "anyone else", "other claimant"],
      r: "The method is claimant-neutral: name any figure and any set of specifics written centuries before them, and the same math applies. We're not aware of another candidate with anything like this profile — and that's itself a testable claim. Run the numbers on anyone you like." },

    { k: ["math can't prove god", "can't prove", "math doesn't prove"],
      r: "Agreed completely — that's the brand's own hierarchy: Jesus is the hero, probability is the supporting evidence. \u201cWe're not asking you to believe anything. Just run the numbers.\u201d" },

    /* ===== PER-PROPHECY DEEP FACTS ===== */
    { k: ["which prophecies", "list the prophecies", "what are the 8", "what are the eight", "the eight prophecies", "all eight"],
      r: "The eight: born in Bethlehem, preceded by a messenger, entering Jerusalem on a donkey, betrayed by a friend, sold for thirty pieces of silver, the money buys a potter's field, silent before accusers, hands and feet pierced. Tap any card in <a href=\"#prophecies\">the prophecies</a> for verses, sources, and the critics' best shots." },

    { k: ["bethlehem", "bethleham", "micah"],
      r: "Micah 5:2 — born in Bethlehem Ephrathah (specifying which Bethlehem; there was another in Zebulun). 1 in 280,000, the only estimate built on real demographic math. Matthew 2:5–6 cites Micah as the reason the chief priests name Bethlehem. 8th-century dating is relatively uncontested — one of the strongest cards. The alternative reading: the verse addresses the Davidic clan generally, not one individual." },

    { k: ["messenger", "malachi", "forerunner", "john the baptist", "voice in the wilderness", "crying in the wilderness", "voice crying"],
      r: "Isaiah 40:3 — a voice in the wilderness preparing the way. 1 in 1,000. All four Gospels quote it of John the Baptist. Dating note: Isaiah 40–55 is exilic (6th c. BC) on mainstream dating — still centuries before Jesus. (Stoner used Malachi 3:1 here; we follow Matthew's own citation.)" },

    { k: ["donkey", "colt", "zechariah 9", "triumphal entry"],
      r: "Zechariah 9:9 — the coming king, \u201clowly and riding on a donkey.\u201d 1 in 100. Fair notes we disclose: Matthew reads the Hebrew parallelism so literally he brings two animals (Mark, Luke, John describe one), and the Gospels say Jesus arranged this one deliberately. The donkey-as-peace-symbol reading is historically solid — kings rode donkeys in peacetime (cf. Solomon in 1 Kings 1:33)." },

    { k: ["betrayed", "betrayal", "judas", "close friend", "shared my bread", "wounded in the house of friends", "house of friends", "zechariah 13"],
      r: "Psalm 41:9 — betrayal by a trusted friend who \u201cshared my bread.\u201d 1 in 1,000. The explicit quotation is John 13:18, where Jesus applies it to Judas at the Last Supper. Originally David's personal lament — the messianic reading rests on Jesus's own application. (Stoner used Zechariah 13:6, \u201cwounded in the house of my friends,\u201d here; we follow Jesus's citation.)" },

    { k: ["thirty", "30 pieces", "pieces of silver", "zechariah 11", "the price"],
      r: "Zechariah 11:12 — thirty pieces of silver. 1 in 1,000 (students said 1 in 10,000; Stoner lowered it). Context: an acted parable about a rejected shepherd — thirty shekels was the legal price of a slave (Exodus 21:32), a contempt-price. Matthew 26:15 records Judas's fee as exactly that." },

    { k: ["potter", "potter's field", "field", "akeldama"],
      r: "Zechariah 11:13 — the silver thrown \u201cto the potter, at the house of the LORD.\u201d 1 in 100,000. Matthew 27:3–10: Judas throws the silver into the temple; the priests buy a potter's field. Two honest footnotes: the Hebrew could read \u201ctreasury\u201d instead of \u201cpotter\u201d (one revocalized word), and Matthew attributes the quote to Jeremiah — scholars read it as a deliberate fusion with Jeremiah's potter-and-field passages (chs. 18–19)." },

    { k: ["silent", "isaiah 53", "lamb", "did not open", "suffering servant"],
      r: "Isaiah 53:7 — \u201che did not open his mouth\u201d when oppressed. 1 in 1,000 (students said 1 in 10,000; Stoner lowered it). Precision matters: he wasn't totally silent — he answered Pilate's direct question (Matthew 27:11), then refused to answer a single charge, \u201cto the great amazement of the governor.\u201d Scholars debate whether Isaiah's Servant is Israel or an individual; the NT reads it as Jesus (Acts 8:32–35)." },

    { k: ["pierced", "crucified", "crucifixion", "psalm 22", "hands and feet"],
      r: "Psalm 22:16 — pierced hands and feet. 1 in 10,000. Three honest notes: (1) the Hebrew is disputed — \u201clike a lion\u201d in the Masoretic tradition vs. \u201cpierced\u201d in the Greek Septuagint and a Dead Sea Scroll fragment; translations divide; (2) crucifixion wasn't invented by Rome — Persians used it in the 6th c. BC — but the psalm (~1000 BC traditional) still predates Rome's systematized use by centuries; (3) the wider pattern carries weight: the opening cry (Matthew 27:46), the mocking (27:39–43), the divided garments (John 19:24) are all Psalm 22." },

    { k: ["sources", "where from", "biblegateway", "check the verses", "references", "citations"],
      r: "Every prophecy card links its Old Testament passage and the New Testament fulfillment, with sources you can check — plus the critics' best objections. We also cite our critics. Check our math, check our verses." },

    /* ===== COMPARISONS ===== */
    { k: ["comparable", "comparison", "compare", "everyday", "real world", "analogy", "perspective", "put it in", "like what", "powerball", "lottery", "plain english", "simple terms", "put simply", "bottom line", "probablity", "odds"],
      r: "Here's one: winning the Powerball jackpot <strong>twice in a row</strong> is about 1 in 8.5\u00d710<sup>16</sup> — essentially the same neighborhood as our 1 in 10\u00b9\u2077. A single Powerball win (1 in 292 million) is about 290 million times <em>more</em> likely than back-to-back wins — and about 340 million times more likely than our rounded 1 in 10¹⁷. Or the classic: Texas two feet deep in silver dollars, one marked, found blindfolded." },

    { k: ["to the 17", "1 in 10", "10^17", "what does 1 in", "ten to the 17", "the number means"],
      r: "1 in 10\u00b9\u2077 means: if you replayed all of human history over and over, you'd expect a match like this about once per 100,000,000,000,000,000 replays. Picture Texas two feet deep in silver dollars, one marked, found blindfolded." },

    /* ===== MEANING / NEXT STEPS ===== */
    { k: ["what does it mean", "what should i", "so what", "the point", "why does it matter"],
      r: "The site's whole pitch: we're not asking you to believe anything — just run the numbers. The math says a chance match would be absurdly surprising. What you conclude from that is yours." },

    { k: ["become a christian", "learn more", "what now", "next step", "read the bible", "which gospel", "curious", "interested"],
      r: "If you're curious: read one Gospel — Mark is the shortest. And talk it over with someone you trust. No pressure, no pitch; that's the site's whole vibe." },

    { k: ["why jesus", "who is jesus", "jesus who"],
      r: "The claim on the table: Jesus of Nazareth matched a set of centuries-old descriptions at a combined 1 in 10\u00b9\u2077 — and the catalog of such passages runs past 300. Run the <a href=\"#calculator\">calculator</a> and see what you think." },

    /* ===== MERCH / MISSIONS / SITE ===== */
    { k: ["merch", "shirt", "t-shirt", "tee", "cap", "hat", "mug", "price", "cost", "buy", "store"],
      r: "Black & gold: the tee is $30, the snapback cap is $22, the mug is $20. Check the <a href=\"#merch\">merch section</a> to grab yours." },

    { k: ["mission", "missions", "profits", "money go", "merch money", "proceeds", "donate", "charity", "fund"],
      r: "100% of net profits go to mission work — first-language Scripture access in restricted regions, plus global missions, church planting, and training future Christian leaders — after a few hundred dollars a month to keep the site running. We describe the work but don't name the organizations. We'll publish a public giving report every year." },

    { k: ["hidden harvest", "kingdom builders", "name the organizations", "which organizations", "partner names", "who do you support", "name the mission"],
      r: "By design, we don't name the mission partners — the site describes the work, not the workers. The work: first-language Scripture access in restricted regions, plus global missions, church planting, and training future Christian leaders. We'll publish an annual giving report so you can see where the money goes." },

    { k: ["shipping", "delivery", "ship it", "how long to arrive"],
      r: "Shipping details are still being finalized before launch — we won't promise what we haven't set. Check back soon." },

    { k: ["what is odds are jesus", "odds are jesus", "what is this site", "what's this site", "this site about", "about odds are jesus", "this website"],
      r: "Odds Are Jesus is a friendly site that runs the numbers on eight ancient prophecies about Jesus, using the probability estimates of Peter Stoner — who had 600+ students check his math. We're not asking you to believe anything. Just run the numbers. It's just math." },

    { k: ["convert me", "trying to convert", "converting people", "proselytize", "proselytizing", "your agenda", "ulterior motive"],
      r: "Nope — we're not trying to convert you; no altar call here. The whole brand is \u201cwe're not asking you to believe anything, just run the numbers.\u201d If the math doesn't move you, that's a legitimate result. The share button exists because some people find it interesting, not because there's a quota." },

    { k: ["who made", "who built", "who runs", "behind this", "about this site", "who is behind"],
      r: "Odds Are Jesus is a passion project: a friendly site using logic and math to get people comfortable with the logical case for Jesus. It's just math — no preaching, no pressure." },

    { k: ["share", "send to", "tell a friend", "post it"],
      r: "Easy: run the calculator, then hit Share to get a card with your number — built for sending to a friend or posting. Find it in the <a href=\"#share\">share section</a>." },

    /* ===== SMALL TALK ===== */
    { k: ["what can you", "what do you know", "topics", "what should i ask"],
      r: "I'm deepest on Stoner — his life, the book, all eight estimates, the 48-prophecy extension — and on the statistics: independence, selection bias, reference classes, Bayesian framing, and every standard objection. Try me: \u201cWas Stoner's math peer-reviewed?\u201d or \u201cWhat's the Texas sharpshooter objection?\u201d" },

    { k: ["who are you", "your name", "about yourself", "chance"],
      r: "I'm Chance — mathematician, statistician, and your faith-friendly numbers guide. I know Stoner's work inside out and I answer objections with arithmetic, not sermons. What shall we run the numbers on?" },

    { k: ["joke", "funny", "make me laugh"],
      r: "A statistician's favorite prophecy? The one with the smallest p-value. I'll see myself out." },

    { k: ["hello", "hey", "howdy"],
      r: "Hey! I'm Chance — mathematician, statistician, Stoner scholar. Ask me anything: the eight estimates, the objections, the merch." },
    { k: ["hi"],
      r: "Hey! I'm Chance — mathematician, statistician, Stoner scholar. Ask me anything: the eight estimates, the objections, the merch." },
    { k: ["thanks", "thank you", "thx", "appreciate"],
      r: "Anytime. Run the numbers. \uD83E\uDD19" },
    { k: ["bye", "goodbye", "see you", "later"],
      r: "Later! The numbers will be here when you want them." },
    { k: ["ok", "okay", "cool", "nice", "interesting", "wow", "wild"],
      r: "Right? The numbers are wild. Anything else on your mind?" }
  ];

  var FALLBACKS = [
    "That's outside my scope — I'm the numbers guy: Stoner's life, the eight estimates, the 48-prophecy extension, the methods, and every standard objection. Want me to pass your question to our Customer Service Team? Leave your email below and they'll follow up with you personally.",
    "Don't have that one in my sources, and I won't guess. But our Customer Service Team can take it from here — drop your email below and I'll send your question straight to them.",
    "Not in my sources. The <a href=\"#prophecies\">prophecy deep-dives</a> may cover it — or leave your email below and our Customer Service Team will get back to you directly."
  ];

  var CHIPS = ["Was Stoner's math peer-reviewed?", "Texas sharpshooter objection?", "Why does it matter?"];

  /* Customer-service intent: operational questions always go to the
     Customer Service Team, even when they mention a product. Checked
     before the KB so "return policy for hats" doesn't hit the merch entry. */
  var CS_KEYWORDS = [
    "return", "refund", "exchange", "damaged", "broken", "defective",
    "my order", "order status", "track order", "tracking number",
    "cancel order", "cancellation",
    "billing", "charged twice", "payment", "receipt", "invoice",
    "shipping status", "delivery status", "not arrived", "late delivery",
    "wrong item", "missing item", "lost package",
    "unsubscribe", "privacy", "delete my data",
    "customer service", "help with my order", "file a complaint",
    "help with an order", "help with the order", "help me with my order",
    "help me with an order", "about an order", "about my order",
    "question about an order", "issue with an order", "problem with an order",
    "problem with my order", "order help", "need help ordering",
    "help on an order", "help on my order", "help for my order",
    "help regarding my order"
  ];
  var CS_REPLY = "That's a customer-service question — returns, orders, shipping, and billing are handled by our Customer Service Team, not by me. Leave your email below and I'll send your question straight to them for a personal follow-up.";

  /* ---------------- matching ---------------- */
  function norm(s) {
    return (s || "").toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function variants(kw) {
    var v = [kw];
    if (/s$/.test(kw) && kw.length > 4) v.push(kw.slice(0, -1));
    else v.push(kw + "s");
    return v;
  }

  var STOPWORDS = ("a,an,the,and,or,of,to,in,on,for,with,about,what,when,where,who,whom,whose,which,how,why," +
    "is,are,was,were,be,been,being,do,does,did,done,have,has,had,having,it,its,this,that,these,those," +
    "there,their,them,they,he,she,his,her,hers,him,you,your,yours,we,our,ours,us,i,me,my,mine,at,by,from," +
    "as,so,if,then,than,too,very,can,could,would,should,will,shall,may,might,must,just,not,no,nor,any," +
    "all,some,such,like,more,most,other,into,out,up,down,over,under,again,once,tell,say,said,says,know," +
    "think,thinks,mean,means,meant,give,gave,please").split(",");

  function contentWords(text) {
    var words = norm(text).split(" "), out = [], i, w;
    for (i = 0; i < words.length; i++) {
      w = words[i];
      if (w.length > 2 && STOPWORDS.indexOf(w) < 0 && out.indexOf(w) < 0) out.push(w);
    }
    return out;
  }

  function findReply(text) {
    var n = " " + norm(text) + " ";
    var c, kw, hit;
    for (c = 0; c < CS_KEYWORDS.length; c++) {
      kw = norm(CS_KEYWORDS[c]);
      hit = kw.indexOf(" ") >= 0
        ? n.indexOf(" " + kw + " ") >= 0
        : new RegExp("\\b" + escRe(kw) + "\\b").test(n);
      if (hit) return CS_REPLY;
    }
    var best = null, bestScore = 0, i, j;
    for (i = 0; i < KB.length; i++) {
      var score = 0;
      for (j = 0; j < KB[i].k.length; j++) {
        var alt = variants(norm(KB[i].k[j])).map(escRe).join("|");
        if (new RegExp("\\b(" + alt + ")\\b").test(n)) score++;
      }
      if (score > bestScore) { bestScore = score; best = KB[i]; }
    }
    if (bestScore > 0) return best.r;
    /* second pass: content-word overlap catches paraphrases the phrase list misses */
    var cw = contentWords(text), b2 = null, s2 = 0;
    for (i = 0; i < KB.length; i++) {
      var blob = KB[i].k.map(function (k) { return norm(k); }).join(" ");
      var s = 0;
      for (j = 0; j < cw.length; j++) {
        if (new RegExp("\\b" + escRe(cw[j])).test(blob)) s++;
      }
      if (s > s2) { s2 = s; b2 = KB[i]; }
    }
    if (s2 >= 2 && b2) return b2.r;
    return null;
  }

  /* ---------------- ui ---------------- */
  var fab, panel, log, form, input, chipsEl, closeBtn;
  var opened = false, fallbackIdx = 0, msgCount = 0;

  function el(tag, cls, html) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;
  }

  function addMsg(who, html, isHtml) {
    var m = el("div", "msg msg-" + who);
    if (isHtml) m.innerHTML = html; else m.textContent = html;
    log.appendChild(m);
    while (log.children.length > 60) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
    msgCount++;
  }

  function typing(on) {
    var t = document.getElementById("chatTyping");
    if (on) {
      if (!t) { t = el("div", "msg msg-bot typing", '<span></span><span></span><span></span>'); t.id = "chatTyping"; log.appendChild(t); }
      log.scrollTop = log.scrollHeight;
    } else if (t) t.remove();
  }

  function reply(text) {
    typing(true);
    var answer = findReply(text);
    var isFallback = !answer;
    if (isFallback) { answer = FALLBACKS[fallbackIdx % FALLBACKS.length]; fallbackIdx++; }
    else if (answer === CS_REPLY) { isFallback = true; /* show the referral capture too */ }
    setTimeout(function () {
      typing(false);
      addMsg("bot", answer, true);
      if (isFallback) showReferralCapture(text);
    }, 500 + Math.random() * 500);
  }

  /* Out-of-scope referral: inline email capture so the Customer Service
     Team can follow up personally. Posts to the referrals Google Form. */
  function showReferralCapture(question) {
    var row = el("div", "msg msg-bot referral");
    var label = el("div", "referral-label", "Email for the follow-up:");
    var formRow = el("div", "referral-row");
    var em = document.createElement("input");
    em.type = "email";
    em.placeholder = "you@example.com";
    em.className = "referral-input";
    em.setAttribute("aria-label", "Email for Customer Service Team follow-up");
    em.autocomplete = "email";
    var btn = el("button", "referral-btn", "Send");
    btn.type = "button";
    function done(ok) {
      row.textContent = ok
        ? "Sent — our Customer Service Team will follow up personally."
        : "Hmm, that didn't go through. Please try again in a moment.";
    }
    function submit() {
      var v = (em.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        em.focus();
        em.style.borderColor = "#c0392b";
        return;
      }
      btn.disabled = true;
      btn.textContent = "Sending…";
      var fd = new FormData();
      fd.append(REFERRAL_EMAIL_ENTRY, v);
      fd.append(REFERRAL_QUESTION_ENTRY, question);
      try {
        fetch(REFERRAL_FORM_URL, { method: "POST", mode: "no-cors", body: fd })
          .then(function () { done(true); }, function () { done(false); });
      } catch (e) { done(false); }
    }
    btn.addEventListener("click", submit);
    em.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); });
    formRow.appendChild(em);
    formRow.appendChild(btn);
    row.appendChild(label);
    row.appendChild(formRow);
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    msgCount++;
  }

  function send(text) {
    text = (text || "").trim();
    if (!text) return;
    addMsg("user", text, false);
    if (BACKEND_URL) { backendReply(text); } else { reply(text); }
  }

  function backendReply(text) {
    // Deploy-time upgrade: POST {message} -> {reply}. Falls back local on error.
    fetch(BACKEND_URL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    }).then(function (res) { return res.json(); }).then(function (data) {
      typing(false);
      addMsg("bot", (data && data.reply) || findReply(text) || FALLBACKS[0], true);
    }).catch(function () { reply(text); });
    typing(true);
  }

  function toggle(open) {
    opened = open == null ? !opened : open;
    panel.hidden = !opened;
    fab.setAttribute("aria-expanded", opened ? "true" : "false");
    if (opened && msgCount === 0) {
      addMsg("bot", "Hey, I'm <strong>Chance</strong> — mathematician, statistician, and your faith-friendly numbers guide. I know Stoner's work inside out: the eight estimates, the 48-prophecy extension, the methods, and every objection. What shall we run the numbers on?", true);
    }
    if (opened) setTimeout(function () { input.focus(); }, 50);
  }

  function init() {
    fab = document.getElementById("chatFab");
    panel = document.getElementById("chatPanel");
    log = document.getElementById("chatLog");
    form = document.getElementById("chatForm");
    input = document.getElementById("chatInput");
    chipsEl = document.getElementById("chatChips");
    closeBtn = document.getElementById("chatClose");
    if (!fab || !panel) return;

    CHIPS.forEach(function (c) {
      var b = el("button", "chip", c);
      b.type = "button";
      b.addEventListener("click", function () { send(c); });
      chipsEl.appendChild(b);
    });

    fab.addEventListener("click", function () { toggle(); });
    closeBtn.addEventListener("click", function () { toggle(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && opened) toggle(false); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      send(input.value);
      input.value = "";
    });
    panel.addEventListener("click", function (e) {
      var a = e.target.closest("a[href^='#']");
      if (a) toggle(false);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
