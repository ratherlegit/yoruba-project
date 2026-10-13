import type { Lesson } from "../types";

export const gs1: Lesson = {
  id: "gs-1",
  level: "getting-started",
  title: "Vowels and consonants",
  sources: ["Needs cross-check against a published Yoruba orthography guide before verifying."],
  primer: {
    rule: "Yoruba spells most sounds with one letter, and three letters carry a dot underneath that changes the sound.",
    formula: "ẹ and ọ are open vowels, ṣ is \"sh\", and gb is one sound made of two letters.",
    rules: [
      { id: "under-dot-vowel", title: "Dotted vowels", explanation: "A dot under e or o opens the vowel. ẹ sounds like the e in \"bed\" and ọ like the o in \"law\". Without the dot, e and o are the closed sounds." },
      { id: "sh-sound", title: "The letter ṣ", explanation: "ṣ with a dot is the \"sh\" sound. Plain s is the s in \"sun\"." },
      { id: "gb-sound", title: "The pair gb", explanation: "gb is one sound made by closing both lips and the back of the throat at once. Treat it as a single letter." },
    ],
    examples: [
      {
        id: "omo", surface: "ọmọ", english: "child",
        parts: [
          { text: "ọ", gloss: "open o, as in \"law\"", role: "syllable" },
          { text: "mọ", gloss: "m + open o", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "Syllable glosses are pronunciation guides, not meanings. Confirm the English approximations.",
      },
      {
        id: "eja", surface: "ẹja", english: "fish",
        parts: [
          { text: "ẹ", gloss: "open e, as in \"bed\"", role: "syllable" },
          { text: "ja", gloss: "j + a", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "Confirm the English approximation of ẹ.",
      },
      {
        id: "sora", surface: "ṣọ́ra", english: "be careful",
        parts: [
          { text: "ṣọ́", gloss: "sh + open o, high tone", role: "syllable" },
          { text: "ra", gloss: "r + a", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "Confirm the word and its tones (ṣọ́ra).",
      },
      {
        id: "gbo", surface: "gbọ́", english: "hear",
        parts: [{ text: "gbọ́", gloss: "gb + open o, high tone", role: "syllable" }],
        steps: [], confidence: "needs-review",
        note: "Confirm the tone on gbọ́.",
      },
    ],
    commonMistake: {
      wrong: "omo",
      right: "ọmọ",
      why: "Without the dots the letters are different sounds. Writing omo for ọmọ is a spelling error, not a style choice.",
    },
  },
  questions: [
    { type: "blank", prompt: "The word for fish starts with ___ja.", answer: "ẹ", choices: ["ẹ", "e", "i"], wordId: "eja" },
    { type: "blank", prompt: "The word for child is ọ___ọ.", answer: "m", choices: ["m", "n", "l"], wordId: "omo" },
    { type: "blank", prompt: "The \"sh\" sound in ṣọ́ra is written ___.", answer: "ṣ", choices: ["ṣ", "s", "gb"], wordId: "sora" },
    { type: "pick", prompt: "Which word contains the sound gb?", choices: ["gbọ́", "bọ́", "gọ́"], answer: 0, wordId: "gbo" },
    { type: "pick", prompt: "Which spelling shows the open o, as in \"law\"?", choices: ["ọmọ", "omo", "ọmo"], answer: 0, wordId: "omo" },
    { type: "order", english: "Fish and child", words: ["ọmọ", "àti", "ẹja"], answer: ["ẹja", "àti", "ọmọ"] },
    { type: "order", english: "I hear the child", words: ["ọmọ", "gbọ́", "Mo"], answer: ["Mo", "gbọ́", "ọmọ"] },
    { type: "order", english: "It is a fish", words: ["ni", "Ẹja"], answer: ["Ẹja", "ni"] },
  ],
};
