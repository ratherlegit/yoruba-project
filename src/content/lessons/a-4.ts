import type { Lesson } from "../types";

export const a4: Lesson = {
  id: "a-4",
  level: "advanced",
  title: "Relative clauses with tí",
  sources: [
    "Lawal, \"Yoruba relativisation and the continuous segment principle\", Studies in African Linguistics 18(1), 1987, pages 68 to 72: tí follows the noun; when the noun is the subject of the clause, a pronoun (ó) stays in the clause, as in ọkùnrin tí ó ra aṣọ (the man who bought the cloth); when the noun is the object, nothing fills its place, as in aṣọ tí ọkùnrin náà rà (the cloth that the man bought). The online PDF text has lost most tone marks; tones here follow Wiktionary.",
    "Wiktionary, \"ti\" (Yoruba section): tí, relative pronoun \"which, who, that\", example Adìyẹ tí mo rà (the chicken that I bought).",
    "Wiktionary, \"gbe\" (Yoruba section): example Ilé tí Bọ́lá ń gbé ò tóbi tó (the house Bọ́lá lives in isn't big enough). Wiktionary, \"ra\" and \"ka\": rà, to buy; kà is said ka before a direct object.",
    "Wiktionary, \"adiyẹ\" (adìyẹ, chicken), \"ọkunrin\" (ọkùnrin, man), \"aṣọ\" (aṣọ, cloth).",
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 5, page 115: oúnjẹ tí ó dára (food that is good); Chapter 10, page 241: aṣọ tí ó mọ́ (clothes that are clean) and ẹni tó ní ìlera (a person who has good health), showing tí ó also written as tó. The PDF uses a legacy font encoding for tone marks.",
    "ọmọ tí ó lọ follows Lawal's subject pattern and was not found written out. Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "A relative clause is a group of words that describes a noun, like \"who went\" in \"the child who went\". In Yoruba, tí comes right after the noun and starts the clause.",
    formula: "noun + tí + clause: ọmọ tí ó lọ (the child who went)",
    rules: [
      { id: "ti-after-noun", title: "tí comes after the noun", explanation: "Put the noun first, then tí, then the clause: adìyẹ tí mo rà, the chicken that I bought. tí has a high tone." },
      { id: "subject-o", title: "The doer keeps ó", explanation: "When the noun is the one doing the action, ó comes after tí: ọkùnrin tí ó ra aṣọ, the man who bought the cloth. Lawal (1987) describes this pronoun in subject clauses. In writing, tí ó is often joined as tó." },
      { id: "object-gap", title: "The thing acted on leaves a gap", explanation: "When the noun is the thing acted on, nothing fills its place in the clause: adìyẹ tí mo rà. The chicken is not repeated after rà." },
      { id: "low-at-end", title: "rà at the end, ra before an object", explanation: "Some low-tone verbs change to mid tone before an object. Wiktionary gives this for kà and tà. So you see ra aṣọ (buy cloth) but tí mo rà with nothing after it." },
    ],
    examples: [
      {
        id: "omo-ti-o-lo", surface: "ọmọ tí ó lọ", english: "the child who went",
        parts: [
          { text: "ọmọ", gloss: "child", role: "noun" },
          { text: "tí", gloss: "who, that", role: "relative" },
          { text: "ó", gloss: "he, she (stands for the child)", role: "pronoun" },
          { text: "lọ", gloss: "go", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Follows Lawal's subject pattern; not written out in a source. Confirm the tones, and that ó is the usual pronoun here.",
      },
      {
        id: "okunrin-ti-o-ra-aso", surface: "ọkùnrin tí ó ra aṣọ", english: "the man who bought the cloth",
        parts: [
          { text: "ọkùnrin", gloss: "man", role: "noun" },
          { text: "tí", gloss: "who, that", role: "relative" },
          { text: "ó", gloss: "he (stands for the man)", role: "pronoun" },
          { text: "ra", gloss: "buy (before an object)", role: "verb" },
          { text: "aṣọ", gloss: "cloth", role: "object" },
        ],
        steps: [], confidence: "needs-review",
        note: "From Lawal (1987), example 1, whose text lost its tone marks. Tones follow Wiktionary. Confirm that ra is mid before aṣọ.",
      },
      {
        id: "adiye-ti-mo-ra", surface: "adìyẹ tí mo rà", english: "the chicken that I bought",
        parts: [
          { text: "adìyẹ", gloss: "chicken", role: "noun" },
          { text: "tí", gloss: "that", role: "relative" },
          { text: "mo", gloss: "I", role: "pronoun" },
          { text: "rà", gloss: "buy (nothing follows)", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary's example under tí, word for word. Wiktionary also lists adìẹ as another spelling. Confirm the tones.",
      },
      {
        id: "ile-ti-bola-n-gbe", surface: "ilé tí Bọ́lá ń gbé", english: "the house that Bọ́lá lives in",
        parts: [
          { text: "ilé", gloss: "house", role: "noun" },
          { text: "tí", gloss: "that", role: "relative" },
          { text: "Bọ́lá", gloss: "Bọ́lá (a name)", role: "subject" },
          { text: "ń", gloss: "ongoing", role: "aspect marker" },
          { text: "gbé", gloss: "live", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "From Wiktionary's example under gbé (to live). Here the house is the place, and no word like \"in\" is needed. Confirm.",
      },
    ],
    commonMistake: {
      wrong: "ọmọ tí lọ",
      right: "ọmọ tí ó lọ",
      why: "The child is the one who went, so ó stays after tí. Lawal (1987) shows that a clause about the doer keeps this pronoun. ọmọ tí lọ is not the usual form.",
    },
  },
  questions: [
    { type: "blank", prompt: "ọmọ ___ ó lọ (the child who went)", answer: "tí", choices: ["tí", "ti", "tì"], wordId: "omo-ti-o-lo" },
    { type: "blank", prompt: "adìyẹ tí mo ___ (the chicken that I bought)", answer: "rà", choices: ["rà", "ra", "rá"], wordId: "adiye-ti-mo-ra" },
    { type: "blank", prompt: "ọkùnrin tí ___ ra aṣọ (the man who bought the cloth)", answer: "ó", choices: ["ó", "o", "ọ"], wordId: "okunrin-ti-o-ra-aso" },
    { type: "pick", prompt: "Which means \"the chicken that I bought\"?", choices: ["adìyẹ tí mo rà", "adìyẹ mo rà", "adìyẹ tí ó rà"], answer: 0, wordId: "adiye-ti-mo-ra" },
    { type: "pick", prompt: "In ọmọ tí ó lọ, why is ó there?", choices: ["The child is the one who went", "It means \"not\"", "It makes a question"], answer: 0, wordId: "omo-ti-o-lo" },
    { type: "order", english: "The child who went", words: ["lọ", "tí", "Ọmọ", "ó"], answer: ["Ọmọ", "tí", "ó", "lọ"] },
    { type: "order", english: "The chicken that I bought", words: ["rà", "Adìyẹ", "mo", "tí"], answer: ["Adìyẹ", "tí", "mo", "rà"] },
    { type: "order", english: "The house that Bọ́lá lives in", words: ["gbé", "Ilé", "Bọ́lá", "ń", "tí"], answer: ["Ilé", "tí", "Bọ́lá", "ń", "gbé"] },
  ],
};
