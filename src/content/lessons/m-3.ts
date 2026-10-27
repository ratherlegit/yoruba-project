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
    "The joining words ṣùgbọ́n, tàbí and nígbà tí, the weather words (oòrùn, afẹ́fẹ́, òtútù, ooru) and the sentence Mo fẹ́ lọ, ṣùgbọ́n òjò ń rọ̀ were added for this lesson. Not checked against a consulted source here. Needs a native speaker's check before verifying.",
  ],
  primer: {
    rule: "A clause is a group of words with its own verb. A complex sentence joins two clauses, for example an \"if\" clause and a main clause. Yoruba uses bí ... bá for \"if\" and nítorí pé for \"because\".",
    formula: "Bí + subject + bá + verb, main clause: Bí òjò bá rọ̀, a ò níí lọ",
    tables: [
      {
        id: "joining-words",
        title: "Words that join clauses",
        columns: [{ label: "English" }, { label: "Yoruba", yo: true }, { label: "Example" }],
        listen: 1,
        rows: [
          ["if", "bí ... bá", "Bí òjò bá rọ̀"],
          ["because", "nítorí pé", "Nítorí pé òjò rọ̀"],
          ["but", "ṣùgbọ́n", "Mo fẹ́ lọ, ṣùgbọ́n òjò ń rọ̀"],
          ["and", "àti", "Mo fẹ́ orin àti ijó"],
          ["or", "tàbí", "Ṣé o fẹ́ omi tàbí oúnjẹ?"],
          ["when", "nígbà tí", "Nígbà tí òjò rọ̀"],
        ],
        note: "àti was in Getting Started 3. The new ones follow the same idea: they sit between or before the pieces they join.",
      },
      {
        id: "weather-words",
        title: "Weather and everyday words",
        columns: [{ label: "English" }, { label: "Yoruba", yo: true }],
        listen: 1,
        rows: [
          ["rain", "òjò"],
          ["sun", "oòrùn"],
          ["wind", "afẹ́fẹ́"],
          ["cold", "òtútù"],
          ["heat", "ooru"],
          ["it is raining", "Òjò ń rọ̀"],
        ],
        note: "Òjò ń rọ̀ uses ń from Beginner 3: rain is falling.",
      },
    ],
    rules: [
      {
        id: "bi-ba",
        title: "If: bí at the start, bá before the verb",
        explanation: [
          "Start the if-clause with bí.",
          "Put bá right before its verb.",
          "Bí òjò bá rọ̀: if it rains.",
          "COERLL lists tí ... bá for \"if\" too.",
        ],
      },
      {
        id: "will-not",
        title: "Will not: kò níí",
        explanation: [
          "kò níí before a verb means \"will not\".",
          "A kò níí lọ: we will not go.",
          "Wiktionary and COERLL write níí. Other sources write ní or ní í.",
          "It is not the preposition ní from Mastery 1.",
        ],
      },
      {
        id: "ko-shortens",
        title: "kò shortens to ò",
        explanation: [
          "After a pronoun, kò is often said as ò.",
          "You saw this in Beginner 2.",
          "A kò níí lọ becomes A ò níí lọ.",
        ],
      },
      {
        id: "because",
        title: "Because: nítorí pé",
        explanation: [
          "nítorí pé comes before the reason.",
          "Nítorí pé òjò rọ̀: because it rained.",
        ],
      },
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
          { text: "kàwé", gloss: "read books (ka + ìwé joined)", role: "verb + object" },
          { text: "rẹ", gloss: "your", role: "possessive" },
        ],
        steps: [], confidence: "needs-review",
        note: "From the COERLL song on page 290. COERLL gives no English line for it; \"if you read your books\" is our gloss. kàwé is read as ka + ìwé contracted, as in Advanced 1, where kà is said ka before an object; the song prints it with a low tone on kà. Confirm.",
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
        note: "COERLL lists nítorí pé as \"because\". The bare verb rọ̀ is read as past, as COERLL reads Mo lọ (I went). Not written out in a source. Confirm.",
      },
      {
        id: "mo-fe-lo-sugbon", surface: "Mo fẹ́ lọ, ṣùgbọ́n òjò ń rọ̀", english: "I want to go, but it is raining",
        parts: [
          { text: "Mo", gloss: "I", role: "pronoun" },
          { text: "fẹ́", gloss: "want", role: "verb" },
          { text: "lọ,", gloss: "go", role: "verb" },
          { text: "ṣùgbọ́n", gloss: "but", role: "conjunction" },
          { text: "òjò", gloss: "rain", role: "subject" },
          { text: "ń", gloss: "is ...-ing (action going on)", role: "aspect marker" },
          { text: "rọ̀", gloss: "fall (of rain)", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Built from fẹ́ and ń rọ̀ with ṣùgbọ́n as a common word for but. Not checked against a consulted source. Confirm the tones.",
      },
    ],
    commonMistake: {
      wrong: "Bí òjò rọ̀",
      right: "Bí òjò bá rọ̀",
      why: "COERLL (page 89) lists tí ... bá for \"if\", and its song says Bí o bá kàwé rẹ. Wiktionary shows that bí without bá can mean \"as soon as\". So for \"if\", bá is the usual form.",
    },
  },
  questions: [
    { type: "blank", prompt: "___ òjò bá rọ̀. (If it rains.)", answer: "Bí", choices: ["Bí", "Nítorí", "Ṣé"], wordId: "bi-ojo-ba-ro" },
    { type: "blank", prompt: "Bí o ___ kàwé rẹ. (If you read your books.)", answer: "bá", choices: ["bá", "ti", "ń"], wordId: "bi-o-ba-kawe-re" },
    { type: "blank", prompt: "___ pé òjò rọ̀. (Because it rained.)", answer: "Nítorí", choices: ["Nítorí", "Bí", "Ṣé"], wordId: "nitori-pe-ojo-ro" },
    { type: "blank", prompt: "Mo fẹ́ lọ, ___ òjò ń rọ̀. (I want to go, but it is raining.)", answer: "ṣùgbọ́n", choices: ["ṣùgbọ́n", "àti", "bí"], wordId: "mo-fe-lo-sugbon" },
    { type: "pick", prompt: "Which means \"we will not go\"?", choices: ["A ò níí lọ", "A ò lọ", "A máa lọ"], answer: 0, wordId: "a-o-nii-lo" },
    { type: "pick", prompt: "In an if-clause, where does bá go?", choices: ["Right before the verb", "At the end of the sentence", "Before bí"], answer: 0, wordId: "bi-ojo-ba-ro" },
    { type: "order", english: "If it rains, we will not go", words: ["lọ", "bá", "a", "Bí", "níí", "rọ̀", "ò", "òjò"], answer: ["Bí", "òjò", "bá", "rọ̀", "a", "ò", "níí", "lọ"] },
    { type: "order", english: "I want to go, but it is raining", words: ["ṣùgbọ́n", "òjò", "Mo", "rọ̀", "lọ", "fẹ́", "ń"], answer: ["Mo", "fẹ́", "lọ", "ṣùgbọ́n", "òjò", "ń", "rọ̀"] },
  ],
};
