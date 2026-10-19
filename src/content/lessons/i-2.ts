import type { Lesson } from "../types";

export const i2: Lesson = {
  id: "i-2",
  level: "intermediate",
  title: "Possession: the owner comes second",
  sources: [
    "Wikipedia, \"Yoruba language\", Grammar section (citing Bamgboṣe 1966 and Rowlands 1969): possession is shown by putting two nouns side by side, the thing first and the owner second, as in fìlà Àkàndé (Àkàndé's cap) and inú àpótí (the inside of the box).",
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 2, Lesson 1 \"Possessive Pronouns\", page 51: mi (my), rẹ (your), rẹ̀ (his, her), wa (our), yín (your, plural), wọn (their), written after the noun with a lengthened vowel, as in ìwéè mi (my book) and ilée wọn (their house). The PDF uses a legacy font encoding for tone marks.",
    "COERLL, Yorùbá Yé Mi, Chapter 1, Lesson 1, page 29 dialogue: Orúkọ bàbáà mi ni Kúnlé Akínlàjà (my father's name is Kúnlé Akínlàjà).",
    "Wiktionary, \"ile\" (Yoruba section): ilé house; ilé ọba listed as palace. Wiktionary, \"ọba\": ọba king. Wiktionary, \"fila\": fìlà cap.",
    "Wiktionary, \"baba\" (Yoruba section): bàbá and baba both mean father; baálé (head of the household) is derived from baba + ilé.",
    "The tone of the lengthened vowel in COERLL's spellings varies from phrase to phrase and is not explained there, so this lesson shows no tone-change step. Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "To show who owns something, put two nouns side by side: the thing owned first, the owner second. No extra word for \"of\" is needed.",
    formula: "thing owned + owner",
    rules: [
      { id: "owner-second", title: "Owner second", explanation: "The thing comes first and the owner comes after it: ilé ọba, the king's house. Swap the order and you change the meaning." },
      { id: "pronoun-owner", title: "Pronouns as owners", explanation: "A possessive pronoun is a word like \"my\" or \"your\". In Yoruba it also comes after the noun: ilé mi, my house. The same order works in a chain: ilé bàbá mi, my father's house." },
      { id: "long-vowel", title: "A longer vowel in speech", explanation: "When the owner starts with a consonant, the last vowel of the first noun is often said longer. COERLL writes it out (ìwéè mi, my book) but many writers do not. This course writes the shorter spelling." },
    ],
    examples: [
      {
        id: "ile-oba", surface: "ilé ọba", english: "the king's house (a palace)",
        parts: [
          { text: "ilé", gloss: "house", role: "noun (thing owned)" },
          { text: "ọba", gloss: "king", role: "noun (owner)" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary lists ilé ọba as palace. Confirm that it is also read as \"the king's house\" in everyday use.",
      },
      {
        id: "fila-akande", surface: "fìlà Àkàndé", english: "Àkàndé's cap",
        parts: [
          { text: "fìlà", gloss: "cap", role: "noun (thing owned)" },
          { text: "Àkàndé", gloss: "a name", role: "noun (owner)" },
        ],
        steps: [], confidence: "needs-review",
        note: "Taken from Wikipedia, which cites Bamgboṣe and Rowlands. The tones on Àkàndé come from that page only. Confirm.",
      },
      {
        id: "ile-baba", surface: "ilé bàbá", english: "father's house",
        parts: [
          { text: "ilé", gloss: "house", role: "noun (thing owned)" },
          { text: "bàbá", gloss: "father", role: "noun (owner)" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary gives both bàbá and baba for father; COERLL uses bàbá. Confirm which form fits this phrase. The common mistake links bàbá ilé to baálé (baba + ilé), which rests on Wiktionary alone. Confirm.",
      },
      {
        id: "ile-baba-mi", surface: "ilé bàbá mi", english: "my father's house",
        parts: [
          { text: "ilé", gloss: "house", role: "noun (thing owned)" },
          { text: "bàbá", gloss: "father", role: "noun (owner)" },
          { text: "mi", gloss: "my", role: "possessive pronoun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Not written out in a source. COERLL writes bàbáà mi, with a lengthened vowel, in Orúkọ bàbáà mi. Confirm the spelling learners should use.",
      },
    ],
    commonMistake: {
      wrong: "bàbá ilé",
      right: "ilé bàbá",
      why: "For \"father's house\", the house comes first and the father second. With the order swapped, the phrase reads as \"the father of the house\", close to baálé, head of the household.",
    },
  },
  questions: [
    { type: "blank", prompt: "Ilé ___ (the king's house)", answer: "ọba", choices: ["ọba", "oba", "ọbá"], wordId: "ile-oba" },
    { type: "blank", prompt: "___ Àkàndé (Àkàndé's cap)", answer: "fìlà", choices: ["fìlà", "fila", "fílà"], wordId: "fila-akande" },
    { type: "blank", prompt: "Ilé bàbá ___ (my father's house)", answer: "mi", choices: ["mi", "mí", "wa"], wordId: "ile-baba-mi" },
    { type: "pick", prompt: "Which means \"father's house\"?", choices: ["bàbá ilé", "ilé bàbá", "ilé ọba"], answer: 1, wordId: "ile-baba" },
    { type: "pick", prompt: "In a phrase like ilé ọba, where does the owner go?", choices: ["Right after the thing owned", "Before the thing owned", "At the end of the sentence"], answer: 0, wordId: "ile-oba" },
    { type: "order", english: "The king's house", words: ["ọba", "Ilé"], answer: ["Ilé", "ọba"] },
    { type: "order", english: "Àkàndé's cap", words: ["Àkàndé", "Fìlà"], answer: ["Fìlà", "Àkàndé"] },
    { type: "order", english: "My father's house", words: ["mi", "bàbá", "Ilé"], answer: ["Ilé", "bàbá", "mi"] },
  ],
};
