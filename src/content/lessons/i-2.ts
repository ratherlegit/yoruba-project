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
    "The extra things (ìwé, aṣọ, bàtà, àpò, owó, ajá, ológbò), the possessives wa, yín and wọn in use, and the phrases ọkọ̀ wa and ilé bàbá Adé were added for this lesson. Not checked against a consulted source here. Needs a native speaker's check before verifying.",
  ],
  primer: {
    rule: "To show who owns something, put two nouns side by side: the thing owned first, the owner second. No extra word for \"of\" is needed.",
    formula: "thing owned + owner",
    tables: [
      {
        id: "possessives",
        title: "Pronouns after the noun",
        columns: [{ label: "English" }, { label: "Yoruba", yo: true }, { label: "Use it", yo: true }],
        rows: [
          ["my", "mi", "ìwé mi"],
          ["your (one person)", "rẹ", "aṣọ rẹ"],
          ["his, her", "rẹ̀", "ọkọ̀ rẹ̀"],
          ["our", "wa", "ọkọ̀ wa"],
          ["your (a group, or an elder)", "yín", "ilé yín"],
          ["their", "wọn", "ilé wọn"],
        ],
        note: "rẹ (your) and rẹ̀ (his, her) differ only by the low tone mark.",
      },
      {
        id: "owned-things",
        title: "Things people own",
        columns: [{ label: "English" }, { label: "Yoruba", yo: true }],
        rows: [
          ["house", "ilé"],
          ["cap", "fìlà"],
          ["book", "ìwé"],
          ["clothes", "aṣọ"],
          ["vehicle", "ọkọ̀"],
          ["shoes", "bàtà"],
          ["bag", "àpò"],
          ["money", "owó"],
          ["dog", "ajá"],
          ["cat", "ológbò"],
        ],
        note: "Any of these can come first, with the owner after.",
      },
    ],
    rules: [
      {
        id: "owner-second",
        title: "Owner second",
        explanation: [
          "The thing comes first, the owner second.",
          "Ilé ọba means \"the king's house\".",
          "Swap the order and you change the meaning.",
          "Names work the same way: fìlà Àkàndé.",
        ],
      },
      {
        id: "pronoun-owner",
        title: "Pronouns as owners",
        explanation: [
          "A possessive pronoun is a word like \"my\" or \"your\".",
          "In Yoruba it also comes after the noun: ilé mi, my house.",
          "It works in a chain: ilé bàbá mi, my father's house.",
          "Use the table for our, their and the rest: ọkọ̀ wa, ilé wọn.",
        ],
      },
      {
        id: "long-vowel",
        title: "A longer vowel in speech",
        explanation: [
          "When the owner starts with a consonant, the last vowel of the first noun is often said longer.",
          "COERLL writes it out: ìwéè mi, my book.",
          "Many writers do not. This course writes the shorter spelling.",
        ],
      },
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
      {
        id: "oko-wa", surface: "ọkọ̀ wa", english: "our vehicle",
        parts: [
          { text: "ọkọ̀", gloss: "vehicle", role: "noun (thing owned)" },
          { text: "wa", gloss: "our", role: "possessive pronoun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Built on the COERLL possessive table. Confirm the tones.",
      },
      {
        id: "ile-baba-adé", surface: "ilé bàbá Adé", english: "Adé's father's house",
        parts: [
          { text: "ilé", gloss: "house", role: "noun (thing owned)" },
          { text: "bàbá", gloss: "father", role: "noun (owner)" },
          { text: "Adé", gloss: "a name", role: "noun (owner)" },
        ],
        steps: [], confidence: "needs-review",
        note: "A chain built on ilé bàbá mi. Confirm that a name can end the chain in this way.",
      },
    ],
    commonMistake: {
      wrong: "bàbá ilé",
      right: "ilé bàbá",
      why: "For \"father's house\", the house comes first and the father second. With the order swapped, the phrase reads as \"the father of the house\", close to baálé, head of the household.",
    },
  },
  questions: [
    { type: "blank", prompt: "Ilé ___ (the king's house)", answer: "ọba", choices: ["ọba", "ilé", "bàbá"], wordId: "ile-oba" },
    { type: "blank", prompt: "Ọkọ̀ ___ (our vehicle)", answer: "wa", choices: ["wa", "mi", "wọn"], wordId: "oko-wa" },
    { type: "blank", prompt: "Aṣọ ___ (your clothes, one person)", answer: "rẹ", choices: ["rẹ", "wa", "wọn"] },
    { type: "blank", prompt: "Ilé bàbá ___ (my father's house)", answer: "mi", choices: ["mi", "wa", "rẹ"], wordId: "ile-baba-mi" },
    { type: "pick", prompt: "Which means \"father's house\"?", choices: ["bàbá ilé", "ilé bàbá", "ilé ọba"], answer: 1, wordId: "ile-baba" },
    { type: "pick", prompt: "In a phrase like ilé ọba, where does the owner go?", choices: ["Right after the thing owned", "Before the thing owned", "At the end of the sentence"], answer: 0, wordId: "ile-oba" },
    { type: "order", english: "My father's vehicle", words: ["mi", "bàbá", "Ọkọ̀"], answer: ["Ọkọ̀", "bàbá", "mi"] },
    { type: "order", english: "Adé's father's house", words: ["Adé", "Ilé", "bàbá"], answer: ["Ilé", "bàbá", "Adé"] },
  ],
};
