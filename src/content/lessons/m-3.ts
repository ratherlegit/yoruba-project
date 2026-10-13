import type { Lesson } from "../types";

export const m3: Lesson = {
  id: "m-3",
  level: "mastery",
  title: "Complex sentences: if and because",
  sources: [
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 4 vocabulary, page 89: tí..bá, if; nítorí pé, because. Chapter 12, page 290, a song: Bí o bá kàwé rẹ, bàtà rẹ á dún ko ko kà, and Bí o ò bá kàwé rẹ ... Chapter 11, page 279: Mà á lọ sí ilé nígbà tí mo bá parí ìwé tí mò ń kà (I will go home when I finish the book I'm reading). Chapter 8, page 202: Ṣebí dókítà kò níí fún mi ní abẹ́rẹ́ nínú ojú (the doctor will not give me an injection in the eye, will he?). The PDF uses a legacy font encoding for tone marks.",
    "Wiktionary, \"bi\" (Yoruba section): bí, conditional \"if\"; another bí means \"when, as soon as\" (Bí a ti jáde ni wọ́n dé, as soon as we left, they arrived).",
    "Wiktionary, \"rọ\" (rọ̀, to fall, of rain; example Òjò máa rọ̀, it will rain) and \"ojo\" (òjò, rain). Wiktionary, \"rọ\", second sense: Tẹ́ ẹ bá gbàgbé ..., òdòdó náà á rọ (if you forget ..., the flower will wilt), another if-clause with bá.",
    "Wiktionary, \"nitori\" (nítorí, on account of, because of) and \"pe\" (pé, that).",
    "Wiktionary, Template \"yo-aspects\" (citing Adebayo 2021 and others): the negative future is written kò níí; ò is a short form of kò after pronouns. Wiktionary examples elsewhere write kò ní and kò ní í.",
    "The sentences Bí òjò bá rọ̀, A ò níí lọ, and Nítorí pé òjò rọ̀ are built from these sources and were not found written out. Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "A clause is a group of words with its own verb. A complex sentence joins two clauses, for example an \"if\" clause and a main clause. Yoruba uses bí ... bá for \"if\" and nítorí pé for \"because\".",
    formula: "Bí + subject + bá + verb, main clause: Bí òjò bá rọ̀, a ò níí lọ",
    rules: [
      { id: "bi-ba", title: "If: bí at the start, bá before the verb", explanation: "Start the if-clause with bí and put bá right before its verb: Bí òjò bá rọ̀, if it rains. COERLL lists tí ... bá for \"if\" too." },
      { id: "will-not", title: "Will not: kò níí", explanation: "kò níí before a verb means \"will not\": A kò níí lọ, we will not go. Wiktionary's aspect table and COERLL write níí." },
      { id: "ko-shortens", title: "kò shortens to ò", explanation: "After a pronoun, kò is often said as ò, as you saw in Beginner 2: A kò níí lọ becomes A ò níí lọ." },
      { id: "because", title: "Because: nítorí pé", explanation: "nítorí pé (because) comes before the reason: Nítorí pé òjò rọ̀, because it rained." },
    ],
    examples: [
      {
        id: "bi-ojo-ba-ro", surface: "Bí òjò bá rọ̀", english: "If it rains",
        parts: [
          { text: "Bí", gloss: "if", role: "conjunction" },
          { text: "òjò", gloss: "rain", role: "subject" },
          { text: "bá", gloss: "marks the if-clause", role: "particle" },
          { text: "rọ̀", gloss: "fall (of rain)", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Built from Wiktionary's Òjò máa rọ̀ and COERLL's bí ... bá pattern; not written out in a source. Confirm the low tone on rọ̀.",
      },
      {
        id: "a-o-nii-lo", surface: "A ò níí lọ", english: "We will not go",
        parts: [
          { text: "A", gloss: "we", role: "pronoun" },
          { text: "kò", gloss: "not", role: "negation" },
          { text: "níí", gloss: "will (with kò)", role: "aspect marker" },
          { text: "lọ", gloss: "go", role: "verb" },
        ],
        steps: [
          { kind: "join", result: "A kò níí lọ" },
          { kind: "elide", result: "A ò níí lọ", ruleId: "ko-shortens" },
        ],
        confidence: "needs-review",
        note: "COERLL writes kò níí (page 202). Wiktionary also writes kò ní and kò ní í. A ò níí lọ itself was not found. Confirm the spelling.",
      },
      {
        id: "bi-o-ba-kawe-re", surface: "Bí o bá kàwé rẹ", english: "If you read your books",
        parts: [
          { text: "Bí", gloss: "if", role: "conjunction" },
          { text: "o", gloss: "you", role: "pronoun" },
          { text: "bá", gloss: "marks the if-clause", role: "particle" },
          { text: "kàwé", gloss: "read books (kà + ìwé joined)", role: "verb + object" },
          { text: "rẹ", gloss: "your", role: "possessive" },
        ],
        steps: [], confidence: "needs-review",
        note: "From the COERLL song on page 290. COERLL gives no English line for it; \"if you read your books\" is our gloss. kàwé is kà + ìwé contracted, as in Advanced 1. Confirm.",
      },
      {
        id: "nitori-pe-ojo-ro", surface: "Nítorí pé òjò rọ̀", english: "Because it rained",
        parts: [
          { text: "Nítorí", gloss: "on account of", role: "conjunction" },
          { text: "pé", gloss: "that", role: "conjunction" },
          { text: "òjò", gloss: "rain", role: "subject" },
          { text: "rọ̀", gloss: "fell (of rain)", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "COERLL lists nítorí pé as \"because\". The bare verb rọ̀ is read as past, as in Getting Started 4. Not written out in a source. Confirm.",
      },
    ],
    commonMistake: {
      wrong: "Bí òjò rọ̀",
      right: "Bí òjò bá rọ̀",
      why: "COERLL (page 89) lists tí ... bá for \"if\", and its song says Bí o bá kàwé rẹ. Wiktionary shows that bí without bá can mean \"as soon as\". So for \"if\", bá is the usual form.",
    },
  },
  questions: [
    { type: "blank", prompt: "___ òjò bá rọ̀. (If it rains.)", answer: "Bí", choices: ["Bí", "Bì", "Bi"], wordId: "bi-ojo-ba-ro" },
    { type: "blank", prompt: "Bí òjò ___ rọ̀. (If it rains.)", answer: "bá", choices: ["bá", "ba", "bà"], wordId: "bi-ojo-ba-ro" },
    { type: "blank", prompt: "___ pé òjò rọ̀. (Because it rained.)", answer: "Nítorí", choices: ["Nítorí", "Nitori", "Nìtorí"], wordId: "nitori-pe-ojo-ro" },
    { type: "pick", prompt: "Which means \"we will not go\"?", choices: ["A ò níí lọ", "A ò lọ", "A máa lọ"], answer: 0, wordId: "a-o-nii-lo" },
    { type: "pick", prompt: "In an if-clause, where does bá go?", choices: ["Right before the verb", "At the end of the sentence", "Before bí"], answer: 0, wordId: "bi-ojo-ba-ro" },
    { type: "order", english: "If it rains, we will not go", words: ["lọ", "bá", "a", "Bí", "níí", "rọ̀", "ò", "òjò"], answer: ["Bí", "òjò", "bá", "rọ̀", "a", "ò", "níí", "lọ"] },
    { type: "order", english: "If you read your books", words: ["rẹ", "bá", "kàwé", "Bí", "o"], answer: ["Bí", "o", "bá", "kàwé", "rẹ"] },
    { type: "order", english: "Because it rained", words: ["rọ̀", "pé", "òjò", "Nítorí"], answer: ["Nítorí", "pé", "òjò", "rọ̀"] },
  ],
};
