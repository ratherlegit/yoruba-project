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
  ],
  primer: {
    rule: "A demonstrative is a word like \"this\" or \"that\". In Yoruba it comes after the noun. A plural means more than one; Yoruba shows it with àwọn before the noun, and the noun itself never changes.",
    formula: "noun + yìí (this) or yẹn (that); àwọn + noun (plural)",
    rules: [
      { id: "after-noun", title: "This and that come after", explanation: "yìí (this) and yẹn (that) follow the noun: ọmọ yìí, this child. ọmọ yẹn, that child." },
      { id: "awon-before", title: "àwọn comes before", explanation: "àwọn goes in front of the noun to make it plural: àwọn ọmọ, children. The word ọmọ stays the same. When the plural is already clear, àwọn can be left out." },
      { id: "these-those", title: "These and those", explanation: "With a plural, COERLL and Wiktionary use wọ̀nyí for \"these\" and wọ̀nyẹn for \"those\": àwọn ọmọ wọ̀nyí, these children." },
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
    ],
    commonMistake: {
      wrong: "ọmọ àwọn",
      right: "àwọn ọmọ",
      why: "àwọn marks the plural and goes before the noun. The noun does not change and takes no ending.",
    },
  },
  questions: [
    { type: "blank", prompt: "Ọmọ ___ (this child)", answer: "yìí", choices: ["yìí", "yíí", "yii"], wordId: "omo-yii" },
    { type: "blank", prompt: "Ọmọ ___ (that child)", answer: "yẹn", choices: ["yẹn", "yen", "yìí"], wordId: "omo-yen" },
    { type: "blank", prompt: "___ ọmọ (children)", answer: "Àwọn", choices: ["Àwọn", "Àwọ̀n", "Awọn"], wordId: "awon-omo" },
    { type: "pick", prompt: "Which word makes a noun plural?", choices: ["yìí", "yẹn", "àwọn"], answer: 2, wordId: "awon-omo" },
    { type: "pick", prompt: "Which means \"these children\"?", choices: ["ọmọ yẹn", "àwọn ọmọ wọ̀nyí", "ọmọ àwọn"], answer: 1, wordId: "awon-omo-wonyi" },
    { type: "order", english: "This child", words: ["yìí", "Ọmọ"], answer: ["Ọmọ", "yìí"] },
    { type: "order", english: "That child", words: ["yẹn", "Ọmọ"], answer: ["Ọmọ", "yẹn"] },
    { type: "order", english: "These children", words: ["wọ̀nyí", "ọmọ", "Àwọn"], answer: ["Àwọn", "ọmọ", "wọ̀nyí"] },
  ],
};
