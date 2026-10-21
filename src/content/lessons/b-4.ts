import type { Lesson } from "../types";

export const b4: Lesson = {
  id: "b-4",
  level: "beginner",
  title: "Questions: ṣé and kí ni",
  sources: [
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 1, Lesson 4 \"Interrogatives Kí ni? and Ṣé?\", page 41: Kí ni o fẹ́? (what do you want?), Kí ni orúkọ rẹ? (what is your name?, written there with a longer vowel, orúkọọ̀ rẹ), Ṣé o fẹ́ jẹun? (do you want to eat?). The PDF uses a legacy font encoding for tone marks.",
    "COERLL, Yorùbá Yé Mi, Chapter 1, Lesson 1 dialogue, page 27: Ṣé o sùn dáadáa? asked by a father to his son in the morning.",
    "Wiktionary, \"ṣe\" (Yoruba section): ṣé, high tone, a particle placed before a sentence to make it a yes or no question; ṣe, mid tone, is the verb \"do\".",
    "Wiktionary, \"daadaa\" (Yoruba section): dáadáa, well, with the example Ṣé ẹ sùn dáadáa? (did you sleep well?).",
    "Wiktionary, \"orukọ\" and \"rẹ\" (Yoruba sections): orúkọ name; the phrase kí ni orúkọ rẹ; rẹ (mid tone) your, rẹ̀ (low tone) his or her.",
    "Wikipedia, \"Yoruba language\", Grammar section: kí ni asks \"what?\" about things, ta ni asks \"who?\" about people.",
    "Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "Put ṣé at the start of a statement to make a yes or no question. Start with kí ni to ask \"what\". A question word is a word that starts a question. An adverb is a word that tells how an action is done, such as dáadáa, well.",
    formula: "ṣé + statement?; kí ni + rest of the question?",
    rules: [
      { id: "se-first", title: "ṣé comes first", explanation: "Take a statement such as O fẹ́ jẹun (you want to eat) and put ṣé in front: Ṣé o fẹ́ jẹun? (do you want to eat?). Nothing else moves. ṣé has a high mark; ṣe with no mark is the verb \"do\"." },
      { id: "ki-ni-what", title: "kí ni asks what", explanation: "kí ni at the start asks \"what\": Kí ni o fẹ́? (what do you want?). It asks about things. For people, Yoruba uses a different word, ta ni (who)." },
      { id: "re-your", title: "rẹ means your", explanation: "rẹ with no mark (mid tone) is \"your\" for one person. rẹ̀ with a low mark is \"his\" or \"her\". Only the tone tells them apart." },
    ],
    examples: [
      {
        id: "se-o-fe-jeun", surface: "Ṣé o fẹ́ jẹun", english: "Do you want to eat?",
        parts: [
          { text: "Ṣé", gloss: "yes or no question word", role: "question word" },
          { text: "o", gloss: "you (one person)", role: "pronoun" },
          { text: "fẹ́", gloss: "want", role: "verb" },
          { text: "jẹun", gloss: "eat (a meal)", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Taken from COERLL page 41. Confirm the high tone on fẹ́.",
      },
      {
        id: "se-o-sun-daadaa", surface: "Ṣé o sùn dáadáa", english: "Did you sleep well?",
        parts: [
          { text: "Ṣé", gloss: "yes or no question word", role: "question word" },
          { text: "o", gloss: "you (one person)", role: "pronoun" },
          { text: "sùn", gloss: "sleep", role: "verb" },
          { text: "dáadáa", gloss: "well", role: "adverb" },
        ],
        steps: [], confidence: "needs-review",
        note: "COERLL uses it in a dialogue and Wiktionary glosses the ẹ form as \"did you sleep well?\". Confirm the tones on dáadáa (high, mid, high, mid).",
      },
      {
        id: "ki-ni-oruko-re", surface: "Kí ni orúkọ rẹ", english: "What is your name?",
        parts: [
          { text: "Kí", gloss: "what", role: "question word" },
          { text: "ni", gloss: "is (the ni from Beginner 1)", role: "verb" },
          { text: "orúkọ", gloss: "name", role: "noun" },
          { text: "rẹ", gloss: "your (one person)", role: "possessive" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary writes kí ni orúkọ rẹ. COERLL writes a longer vowel, orúkọọ̀ rẹ. Treating this ni as the same word as in Beginner 1 is a simplification. Confirm both points.",
      },
      {
        id: "ki-ni-o-fe", surface: "Kí ni o fẹ́", english: "What do you want?",
        parts: [
          { text: "Kí", gloss: "what", role: "question word" },
          { text: "ni", gloss: "is (the ni from Beginner 1)", role: "verb" },
          { text: "o", gloss: "you (one person)", role: "pronoun" },
          { text: "fẹ́", gloss: "want", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Taken from COERLL page 41. Confirm the gloss of ni in this question.",
      },
    ],
    commonMistake: {
      wrong: "O fẹ́ jẹun ṣé?",
      right: "Ṣé o fẹ́ jẹun?",
      why: "Putting ṣé at the end is not the usual form. Wiktionary (\"ṣe\") describes ṣé as placed before a sentence, and COERLL (page 41) puts it first in Ṣé o fẹ́ jẹun?",
    },
  },
  questions: [
    { type: "blank", prompt: "___ o fẹ́ jẹun? (Do you want to eat?)", answer: "Ṣé", choices: ["Ṣé", "Ṣe", "Se"], wordId: "se-o-fe-jeun" },
    { type: "blank", prompt: "___ ni o fẹ́? (What do you want?)", answer: "Kí", choices: ["Kí", "Ki", "Kì"], wordId: "ki-ni-o-fe" },
    { type: "blank", prompt: "Kí ni orúkọ ___? (What is your name?)", answer: "rẹ", choices: ["rẹ", "rẹ̀", "re"], wordId: "ki-ni-oruko-re" },
    { type: "pick", prompt: "Which is the usual way to ask \"Do you want to eat?\"", choices: ["O fẹ́ jẹun ṣé?", "Ṣé o fẹ́ jẹun?", "O ṣé fẹ́ jẹun?"], answer: 1, wordId: "se-o-fe-jeun" },
    { type: "pick", prompt: "Which one is a yes or no question?", choices: ["Kí ni o fẹ́?", "Kí ni orúkọ rẹ?", "Ṣé o sùn dáadáa?"], answer: 2, wordId: "se-o-sun-daadaa" },
    { type: "order", english: "Do you want to eat?", words: ["fẹ́", "jẹun", "Ṣé", "o"], answer: ["Ṣé", "o", "fẹ́", "jẹun"] },
    { type: "order", english: "Did you sleep well?", words: ["dáadáa", "sùn", "Ṣé", "o"], answer: ["Ṣé", "o", "sùn", "dáadáa"] },
    { type: "order", english: "What do you want?", words: ["fẹ́", "ni", "o", "Kí"], answer: ["Kí", "ni", "o", "fẹ́"] },
  ],
};
