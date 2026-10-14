import type { Lesson } from "../types";

export const gs3: Lesson = {
  id: "gs-3",
  level: "getting-started",
  title: "Syllables and greetings",
  sources: [
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 1, Lesson 1 \"Ìkíni\", page 32: kú + àárọ̀ = káàárọ̀, kú + alẹ́ = káalẹ́, kú + iṣẹ́ = kúuṣẹ́; ẹ used to greet an older person, and káàárọ̀ o with no ẹ as the reply to a friend or younger sibling. The PDF uses a legacy font encoding for tone marks.",
    "COERLL, Yorùbá Yé Mi, Appendix, \"The syllabic [m] and [n]\", page 312: a nasal can stand as its own syllable.",
    "Wiktionary, \"káàárọ̀\", \"káalẹ́\", \"kúuṣẹ́\" (Yoruba sections): etymology kú + noun, and the usage note that ẹ comes first when speaking respectfully.",
    "Wiktionary, \"àárọ̀\" and \"alẹ́\" (Yoruba sections): morning, evening.",
    "Wikipedia, \"Yoruba language\", Phonology section: syllable shape (C)V(N), every syllable has a tone.",
    "COERLL and Wiktionary both give the evening greeting as káalẹ́. Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "Yoruba syllables are a vowel alone, a consonant plus a vowel, or a nasal. Greetings join several words and run together in speech.",
    formula: "ẹ + kú + àárọ̀ becomes ẹ káàárọ̀",
    rules: [
      { id: "syllable-shapes", title: "Three syllable shapes", explanation: "A syllable is a vowel alone (à), a consonant plus a vowel (rọ̀), or a nasal standing alone (n). Every syllable carries its own tone. So àárọ̀ has three syllables: à, á, rọ̀." },
      { id: "respect-e", title: "Start with ẹ for respect", explanation: "ẹ means \"you\" when you speak to an older person or to a group. Put it first when you greet them. In the COERLL textbook, an older person answering a friend or a younger sibling says káàárọ̀ o, without ẹ." },
      { id: "u-to-a", title: "kú takes on an a", explanation: "In a greeting, kú runs into the next word. When that word starts with a, the u of kú becomes a too. The high tone of kú stays: kú àárọ̀ is said káàárọ̀." },
      { id: "i-to-u", title: "An i takes on the u", explanation: "When the next word starts with i, the change goes the other way. The i becomes u to match kú: kú iṣẹ́ is said kúuṣẹ́." },
    ],
    examples: [
      {
        id: "aaro", surface: "àárọ̀", english: "morning",
        parts: [
          { text: "à", gloss: "vowel alone, low tone", role: "syllable" },
          { text: "á", gloss: "vowel alone, high tone", role: "syllable" },
          { text: "rọ̀", gloss: "r + open o, low tone", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary and COERLL agree on the tones àárọ̀. Treating àá as two syllables follows the one-tone-per-syllable rule. Confirm with a speaker.",
      },
      {
        id: "e-kaaro", surface: "ẹ káàárọ̀", english: "good morning (to an elder or a group)",
        parts: [
          { text: "ẹ", gloss: "you (respectful or plural)", role: "pronoun" },
          { text: "kú", gloss: "greeting word", role: "greeting" },
          { text: "àárọ̀", gloss: "morning", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "ẹ kúàárọ̀" },
          { kind: "assimilate", result: "ẹ káàárọ̀", ruleId: "u-to-a" },
        ],
        confidence: "needs-review",
        note: "Sources show kú + àárọ̀ = káàárọ̀, with the high tone of kú kept. Describing this as the u turning into a is an interpretation. Sources do not gloss kú here; \"greeting word\" is a placeholder gloss.",
      },
      {
        id: "e-kaale", surface: "ẹ káalẹ́", english: "good evening (to an elder or a group)",
        parts: [
          { text: "ẹ", gloss: "you (respectful or plural)", role: "pronoun" },
          { text: "kú", gloss: "greeting word", role: "greeting" },
          { text: "alẹ́", gloss: "evening", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "ẹ kúalẹ́" },
          { kind: "assimilate", result: "ẹ káalẹ́", ruleId: "u-to-a" },
        ],
        confidence: "needs-review",
        note: "COERLL and Wiktionary both give káalẹ́. Confirm the mid tone on the second a, and whether a shorter form with the u dropped is also used.",
      },
      {
        id: "e-kuuse", surface: "ẹ kúuṣẹ́", english: "well done (to someone working)",
        parts: [
          { text: "ẹ", gloss: "you (respectful or plural)", role: "pronoun" },
          { text: "kú", gloss: "greeting word", role: "greeting" },
          { text: "iṣẹ́", gloss: "work", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "ẹ kúiṣẹ́" },
          { kind: "assimilate", result: "ẹ kúuṣẹ́", ruleId: "i-to-u" },
        ],
        confidence: "needs-review",
        note: "COERLL and Wiktionary give kú + iṣẹ́ = kúuṣẹ́. Confirm that the i of iṣẹ́ becomes a mid-tone u.",
      },
    ],
    commonMistake: {
      wrong: "ẹ kú àárọ̀",
      right: "ẹ káàárọ̀",
      why: "ẹ kú àárọ̀ is the full form, built from its parts. In speech people usually join it into ẹ káàárọ̀, and that joined form is the one textbooks teach as the greeting.",
    },
  },
  questions: [
    { type: "blank", prompt: "Good morning (to an elder): Ẹ ___.", answer: "káàárọ̀", choices: ["káàárọ̀", "kaaro", "káàrọ̀"], wordId: "e-kaaro" },
    { type: "blank", prompt: "kú + alẹ́ (evening) join in speech. Good evening (to an elder): Ẹ ___.", answer: "káalẹ́", choices: ["káalẹ́", "kúalẹ́", "kaalẹ́"], wordId: "e-kaale" },
    { type: "blank", prompt: "To someone at work: Ẹ kúu___.", answer: "ṣẹ́", choices: ["ṣẹ́", "sẹ́", "ṣẹ"], wordId: "e-kuuse" },
    { type: "pick", prompt: "Which is the joined morning greeting?", choices: ["ẹ kú àárọ̀", "ẹ káàárọ̀", "ẹ káalẹ́"], answer: 1, wordId: "e-kaaro" },
    { type: "pick", prompt: "How many syllables does àárọ̀ have?", choices: ["2", "3", "4"], answer: 1, wordId: "aaro" },
    { type: "order", english: "Good morning (to an elder)", words: ["káàárọ̀", "Ẹ"], answer: ["Ẹ", "káàárọ̀"] },
    { type: "order", english: "Good evening (to an elder)", words: ["káalẹ́", "Ẹ"], answer: ["Ẹ", "káalẹ́"] },
    { type: "order", english: "Well done (to an elder at work)", words: ["kúuṣẹ́", "Ẹ"], answer: ["Ẹ", "kúuṣẹ́"] },
  ],
};
