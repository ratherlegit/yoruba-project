import type { Lesson } from "../types";

export const gs1: Lesson = {
  id: "gs-1",
  level: "getting-started",
  title: "Sounds and tones",
  sources: [
    "Needs cross-check against a published Yoruba orthography guide before verifying the letter sounds.",
    "Wiktionary, \"ọkọ\" (Yoruba section): ọkọ husband, ọkọ̀ vehicle.",
    "Wikipedia, \"Yoruba language\", Phonology section: acute for high, grave for low, mid unmarked.",
  ],
  primer: {
    rule: "Yoruba spells most sounds with one letter. Three letters carry a dot underneath, and the pitch of each syllable is written with a tone mark. The Sound Bank has more practice.",
    formula: "ẹ and ọ are open vowels, ṣ is \"sh\", gb is one sound; acute = high, grave = low, no mark = mid",
    toneFocus: ["high", "mid", "low"],
    rules: [
      { id: "under-dot-vowel", title: "Dotted vowels", explanation: "A dot under e or o opens the vowel. ẹ sounds like the e in \"bed\" and ọ like the \"aw\" in \"law\". Without the dot, e and o are the closed sounds." },
      { id: "sh-sound", title: "The letter ṣ", explanation: "ṣ with a dot is the \"sh\" sound. Plain s is the s in \"sun\"." },
      { id: "gb-sound", title: "The pair gb", explanation: "gb is one sound made by closing both lips and the back of the throat at once. Treat it as a single letter." },
      { id: "high-tone", title: "High tone", explanation: "A mark that slants up to the right, as in ó, means the voice goes high on that syllable." },
      { id: "low-tone", title: "Low tone", explanation: "A mark that slants down to the right, as in ò, means the voice goes low on that syllable." },
      { id: "mid-tone", title: "Mid tone", explanation: "No mark means a level voice in the middle. Standard spelling leaves mid tone unmarked on vowels." },
    ],
    examples: [
      {
        id: "omo", surface: "ọmọ", english: "child",
        parts: [
          { text: "ọ", gloss: "open o, like the \"aw\" in \"law\"", role: "syllable" },
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
        id: "gbo", surface: "gbọ́", english: "hear",
        parts: [{ text: "gbọ́", gloss: "gb + open o, high tone", role: "syllable" }],
        steps: [], confidence: "needs-review",
        note: "Confirm the tone on gbọ́.",
      },
      {
        id: "word-husband", surface: "ọkọ", english: "husband",
        parts: [
          { text: "ọ", gloss: "open o, mid tone (no mark)", role: "syllable" },
          { text: "kọ", gloss: "k + open o, mid tone (no mark)", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary gives mid-mid for husband. Wiktionary also lists \"dear, beloved\" as a second sense. Confirm the tones with a speaker.",
      },
      {
        id: "word-vehicle", surface: "ọkọ̀", english: "vehicle",
        parts: [
          { text: "ọ", gloss: "open o, mid tone (no mark)", role: "syllable" },
          { text: "kọ̀", gloss: "k + open o, low tone", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary gives mid-low. Confirm that \"vehicle\" covers both car and boat, as Wiktionary suggests.",
      },
    ],
    commonMistake: {
      wrong: "omo",
      right: "ọmọ",
      why: "Without the dots the letters are different sounds. Writing omo for ọmọ is a spelling error, not a style choice.",
    },
  },
  questions: [
    { type: "blank", prompt: "gbọ́ is spelled with three letters (g, b and ọ), but it has ___ sounds.", answer: "2", choices: ["2", "3", "1"], wordId: "gbo" },
    { type: "pick", prompt: "Which word starts with the vowel sound in \"bed\"?", choices: ["ọmọ", "ẹja", "gbọ́"], answer: 1, wordId: "eja" },
    { type: "pick", prompt: "How is ṣ pronounced?", choices: ["Like the \"sh\" in \"ship\"", "Like the \"s\" in \"sun\"", "Like the \"ch\" in \"chin\""], answer: 0, wordId: "gbo" },
    { type: "pick", prompt: "Which letter is said like the \"aw\" in \"law\"?", choices: ["ọ", "o", "ẹ"], answer: 0, wordId: "omo" },
    { type: "blank", prompt: "No mark on a syllable means ___ tone.", answer: "mid", choices: ["mid", "high", "low"], wordId: "word-husband" },
    { type: "blank", prompt: "In ọkọ̀, the last syllable has ___ tone.", answer: "low", choices: ["low", "high", "mid"], wordId: "word-vehicle" },
    { type: "pick", prompt: "ọkọ and ọkọ̀ have the same letters. What makes them different words?", choices: ["The tone mark on the last syllable", "The dots under the vowels", "Nothing, they are the same word"], answer: 0, wordId: "word-vehicle" },
    { type: "pick", prompt: "Which mark means the voice goes low?", choices: ["ò", "ó", "o"], answer: 0, wordId: "word-vehicle" },
  ],
};
