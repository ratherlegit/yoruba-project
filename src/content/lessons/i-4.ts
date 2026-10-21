import type { Lesson } from "../types";

export const i4: Lesson = {
  id: "i-4",
  level: "intermediate",
  title: "This, that, and plurals",
  sources: [
    "Wiktionary, \"yii\" (Yoruba section): yìí, this, placed after the noun (Ọmọ yìí ni tèmi, this child is mine); a short form of èyí.",
    "Wiktionary, \"yẹn\" (Yoruba section): yẹn, that, placed after the noun (Mo fẹ́ ka ìwé yẹn, I want to read that book); a short form of ìyẹn. The low-tone yẹ̀n is an Ìjẹ̀bú and Ìkálẹ̀ form.",
    "Wiktionary, \"wọnyi\" and \"wọnyẹn\" (Yoruba sections): wọ̀nyí, these; wọ̀nyẹn, those.",
    "Wiktionary, \"awọn\" (Yoruba section): àwọn, a particle that comes before a noun to mark it as plural; àwọ̀n (low, low) is a different word, net.",
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 2, Lesson 2 \"The Plural marker àwọn\", page 55: àwọn goes before the noun (Àwọn ilé, houses; Àwọn ọmọdé, children), is sometimes left out when the plural is clear, and can mark respect for one person. The textbook's exercise headings use àwọn ... wọ̀nyí, as in àwọn ìbéèrè wọ̀nyí (these questions). The PDF uses a legacy font encoding for tone marks.",
    "Not cross-checked against a print grammar.",
    "The extra nouns (ọkùnrin, obìnrin), describing words (dára, tuntun, ńlá, kékeré, gíga) and the phrases ilé ńlá yẹn and Ìwé wo were added for this lesson. Not checked against a consulted source here. Needs a native speaker's check before verifying.",
  ],
  primer: {
    rule: "A demonstrative is a word like \"this\" or \"that\". In Yoruba it comes after the noun. A plural means more than one; Yoruba shows it with àwọn before the noun, and the noun itself never changes. A particle is a small word that has a job but no meaning on its own, such as àwọn.",
    formula: "noun + yìí (this) or yẹn (that); àwọn + noun (plural)",
    tables: [
      {
        id: "demonstratives",
        title: "This, that, these, those",
        columns: [{ label: "How many" }, { label: "Near: this, these", yo: true }, { label: "Far: that, those", yo: true }],
        rows: [
          ["One", "yìí", "yẹn"],
          ["More than one", "wọ̀nyí", "wọ̀nyẹn"],
        ],
        note: "All four come after the noun. For more than one, also put àwọn before the noun: àwọn ọmọ wọ̀nyí, these children.",
      },
      {
        id: "dem-nouns",
        title: "Nouns to practice with",
        columns: [{ label: "English" }, { label: "Yoruba", yo: true }, { label: "This one", yo: true }, { label: "That one", yo: true }],
        rows: [
          ["book", "ìwé", "ìwé yìí", "ìwé yẹn"],
          ["house", "ilé", "ilé yìí", "ilé yẹn"],
          ["vehicle", "ọkọ̀", "ọkọ̀ yìí", "ọkọ̀ yẹn"],
          ["clothes", "aṣọ", "aṣọ yìí", "aṣọ yẹn"],
          ["man", "ọkùnrin", "ọkùnrin yìí", "ọkùnrin yẹn"],
          ["woman", "obìnrin", "obìnrin yìí", "obìnrin yẹn"],
          ["dog", "ajá", "ajá yìí", "ajá yẹn"],
          ["food", "oúnjẹ", "oúnjẹ yìí", "oúnjẹ yẹn"],
        ],
        note: "Add àwọn before the noun and use wọ̀nyí or wọ̀nyẹn for more than one.",
      },
      {
        id: "describing",
        title: "Describing words go after the noun too",
        columns: [{ label: "English" }, { label: "Yoruba", yo: true }, { label: "Use it", yo: true }],
        rows: [
          ["good", "dára", "ìwé dára"],
          ["new", "tuntun", "ilé tuntun"],
          ["big", "ńlá", "ilé ńlá"],
          ["small", "kékeré", "ọkọ̀ kékeré"],
          ["tall, long", "gíga", "ọkùnrin gíga"],
        ],
        note: "With this or that, the describing word comes between: ilé ńlá yẹn, that big house.",
      },
      {
        id: "which",
        title: "Which one?",
        columns: [{ label: "You want to say" }, { label: "Yoruba", yo: true }],
        rows: [
          ["Which book?", "Ìwé wo?"],
          ["Which house?", "Ilé wo?"],
          ["Which child?", "Ọmọ wo?"],
        ],
        note: "wo (which) goes after the noun, as in Getting Started 3.",
      },
    ],
    rules: [
      {
        id: "after-noun",
        title: "This and that come after",
        explanation: [
          "yìí (this) and yẹn (that) follow the noun.",
          "ọmọ yìí: this child. ọmọ yẹn: that child.",
          "Describing words also follow the noun: ilé ńlá, a big house.",
          "Put the describing word first: ilé ńlá yẹn.",
        ],
      },
      {
        id: "awon-before",
        title: "àwọn comes before",
        explanation: [
          "àwọn goes in front of the noun to make it plural.",
          "àwọn ọmọ means \"children\". The word ọmọ stays the same.",
          "When the plural is already clear, àwọn can be left out.",
        ],
      },
      {
        id: "these-those",
        title: "These and those",
        explanation: [
          "With a plural, use wọ̀nyí for \"these\" and wọ̀nyẹn for \"those\".",
          "àwọn ọmọ wọ̀nyí: these children.",
          "àwọn ọmọ wọ̀nyẹn: those children.",
        ],
      },
    ],
    examples: [
      {
        id: "omo-yii", surface: "ọmọ yìí", english: "this child",
        parts: [
          { text: "ọmọ", gloss: "child", role: "noun" },
          { text: "yìí", gloss: "this", role: "demonstrative" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary spells yìí but describes the sound as a high tone with a downstep (a slight drop in pitch). Confirm how to teach the pitch.",
      },
      {
        id: "omo-yen", surface: "ọmọ yẹn", english: "that child",
        parts: [
          { text: "ọmọ", gloss: "child", role: "noun" },
          { text: "yẹn", gloss: "that", role: "demonstrative" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary gives yẹn with no mark, also with a downstep. Not written out with ọmọ in a source. Confirm.",
      },
      {
        id: "awon-omo", surface: "àwọn ọmọ", english: "children",
        parts: [
          { text: "àwọn", gloss: "plural marker", role: "particle" },
          { text: "ọmọ", gloss: "child", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "COERLL shows the same pattern with àwọn ọmọdé and àwọn ilé. Confirm the tones on àwọn (low, mid).",
      },
      {
        id: "awon-omo-wonyi", surface: "àwọn ọmọ wọ̀nyí", english: "these children",
        parts: [
          { text: "àwọn", gloss: "plural marker", role: "particle" },
          { text: "ọmọ", gloss: "child", role: "noun" },
          { text: "wọ̀nyí", gloss: "these", role: "demonstrative" },
        ],
        steps: [], confidence: "needs-review",
        note: "Follows COERLL's àwọn ... wọ̀nyí pattern. Speakers may also say àwọn ọmọ yìí; no consulted source settles this. Confirm.",
      },
      {
        id: "ile-nla-yen", surface: "ilé ńlá yẹn", english: "that big house",
        parts: [
          { text: "ilé", gloss: "house", role: "noun" },
          { text: "ńlá", gloss: "big", role: "adjective" },
          { text: "yẹn", gloss: "that", role: "demonstrative" },
        ],
        steps: [], confidence: "needs-review",
        note: "Built on ọmọ yẹn and the usual noun + adjective order. Confirm the tones on ńlá and that the adjective comes before yẹn.",
      },
      {
        id: "iwe-wo", surface: "Ìwé wo", english: "Which book?",
        parts: [
          { text: "Ìwé", gloss: "book", role: "noun" },
          { text: "wo", gloss: "which", role: "question" },
        ],
        steps: [], confidence: "needs-review",
        note: "Built on Ìlú wo in Getting Started 3. Confirm the tones.",
      },
    ],
    commonMistake: {
      wrong: "ọmọ àwọn",
      right: "àwọn ọmọ",
      why: "ọmọ àwọn is not the usual form for \"children\". COERLL (page 55) and Wiktionary (\"awọn\") put àwọn before the noun. The noun does not change and takes no ending.",
    },
  },
  questions: [
    { type: "blank", prompt: "Ọmọ ___ (this child)", answer: "yìí", choices: ["yìí", "yẹn", "àwọn"], wordId: "omo-yii" },
    { type: "blank", prompt: "Ọmọ ___ (that child)", answer: "yẹn", choices: ["yẹn", "yìí", "àwọn"], wordId: "omo-yen" },
    { type: "blank", prompt: "___ ọmọ (children)", answer: "Àwọn", choices: ["Àwọn", "Yìí", "Yẹn"], wordId: "awon-omo" },
    { type: "blank", prompt: "Ìwé ___? (Which book?)", answer: "wo", choices: ["wo", "yìí", "mi"], wordId: "iwe-wo" },
    { type: "pick", prompt: "In ọmọ yìí, where does yìí go?", choices: ["After the noun", "Before the noun", "At the start of the sentence"], answer: 0, wordId: "omo-yii" },
    { type: "pick", prompt: "Which means \"these children\"?", choices: ["ọmọ yẹn", "àwọn ọmọ wọ̀nyí", "ọmọ àwọn"], answer: 1, wordId: "awon-omo-wonyi" },
    { type: "order", english: "That big house", words: ["yẹn", "Ilé", "ńlá"], answer: ["Ilé", "ńlá", "yẹn"] },
    { type: "order", english: "These children", words: ["wọ̀nyí", "ọmọ", "Àwọn"], answer: ["Àwọn", "ọmọ", "wọ̀nyí"] },
  ],
};
