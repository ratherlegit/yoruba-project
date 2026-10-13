import type { Lesson } from "../types";

export const gs2: Lesson = {
  id: "gs-2",
  level: "getting-started",
  title: "The three tones",
  sources: [
    "Wiktionary, \"ọkọ\" (Yoruba section): ọkọ husband, ọkọ̀ vehicle, ọkọ́ hoe, ọ̀kọ̀ spear or lance.",
    "Wiktionary, \"oko\" (Yoruba section): oko farm, field.",
    "Wiktionary, \"mi\" (Yoruba section): mi as the determiner \"my\".",
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Appendix, vowel /ọ/ table, page 304: ọkọ́ hoe, ọ̀kọ̀ spear, ọkọ̀ vehicle, ọkọ husband. The PDF uses a legacy font, so the tone marks were decoded by hand.",
    "Wikipedia, \"Yoruba language\", Phonology section: acute for high, grave for low, mid unmarked.",
    "No source found that writes out the phrases ọkọ mi, ọkọ̀ mi, oko mi in full. They follow the noun + mi pattern. Not cross-checked against a print dictionary.",
  ],
  primer: {
    rule: "The pitch of a syllable is part of the word, and Yoruba writes three tones.",
    formula: "acute = high, grave = low, no mark = mid",
    toneFocus: ["high", "mid", "low"],
    rules: [
      { id: "high-tone", title: "High tone", explanation: "A mark that slants up to the right, as in ó, means the voice goes high on that syllable." },
      { id: "low-tone", title: "Low tone", explanation: "A mark that slants down to the right, as in ò, means the voice goes low on that syllable." },
      { id: "mid-tone", title: "Mid tone", explanation: "No mark means a level voice in the middle. Standard spelling leaves mid tone unmarked on vowels." },
      { id: "marks-stack", title: "Dots and tone marks together", explanation: "A tone mark sits on top of the vowel and the dot sits underneath, so ọ̀ has both. Each mark changes the word, so keep both." },
    ],
    examples: [
      {
        id: "oko-husband", surface: "ọkọ", english: "husband",
        parts: [
          { text: "ọ", gloss: "open o, mid tone (no mark)", role: "syllable" },
          { text: "kọ", gloss: "k + open o, mid tone (no mark)", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary and the COERLL appendix give mid-mid for husband. Wiktionary also lists \"dear, beloved\" as a second sense. Confirm the tones with a speaker.",
      },
      {
        id: "oko-vehicle", surface: "ọkọ̀", english: "vehicle",
        parts: [
          { text: "ọ", gloss: "open o, mid tone (no mark)", role: "syllable" },
          { text: "kọ̀", gloss: "k + open o, low tone", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary and the COERLL appendix agree on mid-low. Confirm that \"vehicle\" covers both car and boat, as Wiktionary suggests.",
      },
      {
        id: "oko-hoe", surface: "ọkọ́", english: "hoe",
        parts: [
          { text: "ọ", gloss: "open o, mid tone (no mark)", role: "syllable" },
          { text: "kọ́", gloss: "k + open o, high tone", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "The lesson brief glossed ọkọ́ as \"spear or hoe\". Wiktionary and the COERLL appendix give ọkọ́ as hoe only, and spell spear ọ̀kọ̀. Confirm the gloss.",
      },
      {
        id: "oko-spear", surface: "ọ̀kọ̀", english: "spear",
        parts: [
          { text: "ọ̀", gloss: "open o, low tone", role: "syllable" },
          { text: "kọ̀", gloss: "k + open o, low tone", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "Added from research, not in the brief. Wiktionary and the COERLL appendix give low-low for spear. Confirm both low tones.",
      },
      {
        id: "oko-farm", surface: "oko", english: "farm",
        parts: [
          { text: "o", gloss: "closed o, mid tone (no mark)", role: "syllable" },
          { text: "ko", gloss: "k + closed o, mid tone (no mark)", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary gives oko as farm or field, mid-mid, no dots. Only one source checked for this word.",
      },
    ],
    commonMistake: {
      wrong: "ọkọ",
      right: "ọkọ̀",
      why: "Same letters, different word. ọkọ is husband. With the low mark on the second syllable, ọkọ̀ is vehicle.",
    },
  },
  questions: [
    { type: "blank", prompt: "The word for vehicle is ọ___.", answer: "kọ̀", choices: ["kọ̀", "kọ", "kọ́"], wordId: "oko-vehicle" },
    { type: "blank", prompt: "The word for hoe is ọ___.", answer: "kọ́", choices: ["kọ́", "kọ̀", "kọ"], wordId: "oko-hoe" },
    { type: "blank", prompt: "The word for spear is ___kọ̀.", answer: "ọ̀", choices: ["ọ̀", "ọ", "ọ́"], wordId: "oko-spear" },
    { type: "pick", prompt: "Which word means husband?", choices: ["ọkọ̀", "ọkọ", "ọkọ́"], answer: 1, wordId: "oko-husband" },
    { type: "pick", prompt: "Which word means farm?", choices: ["ọkọ", "oko", "ọ̀kọ̀"], answer: 1, wordId: "oko-farm" },
    { type: "order", english: "My vehicle", words: ["mi", "Ọkọ̀"], answer: ["Ọkọ̀", "mi"] },
    { type: "order", english: "My husband", words: ["mi", "Ọkọ"], answer: ["Ọkọ", "mi"] },
    { type: "order", english: "My farm", words: ["mi", "Oko"], answer: ["Oko", "mi"] },
  ],
};
