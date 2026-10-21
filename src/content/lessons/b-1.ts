import type { Lesson } from "../types";

export const b1: Lesson = {
  id: "b-1",
  level: "beginner",
  title: "\"To be\": jẹ́ and ni",
  sources: [
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 5, Lesson 1 \"The verbs jẹ́ and ni\", pages 115 to 116: jẹ́ with professions (Mo jẹ́ akẹ́kọ̀ọ́, I am a student); ni in Èmi ni màmáa Túndé and Dókítà ni Ládi; *Mo ni dókítà and *Ó ni olùkọ́ marked incorrect because regular pronouns cannot be used with ni. The PDF uses a legacy font encoding for tone marks.",
    "COERLL, Yorùbá Yé Mi, Chapter 1, Lesson 2, page 36: Àwa jẹ́ ọ̀rẹ́ (we are friends), given as an exercise sentence.",
    "Wiktionary, \"jẹ\" (Yoruba section): jẹ́, high tone, to be; jẹ, mid tone, to eat.",
    "Wiktionary, \"ni\" (Yoruba section): ni, mid tone, to be (identification); usage note that ni cannot be used with regular subject pronouns such as mo or ó, with the example Òun ni ọ̀rẹ́ mi (he is my friend). ní, high tone, is a different word (to have; at).",
    "Wiktionary, \"olukọ\" (Yoruba section): olùkọ́ teacher, with a quoted sentence ẹ jẹ́ olùkọ́ from Schleicher, Jẹ́ K'Á Sọ Yorùbá (Yale University Press, 1993), page 257.",
    "Wiktionary, \"eyi\", \"ile\", \"ọrẹ\", \"mi\" (Yoruba sections): èyí this, ilé house, ọ̀rẹ́ friend, mi my.",
    "Èyí ni ilé mi is not written out in any consulted source; it follows the pattern of Wiktionary's Èyí ni mo fẹ́ rà (this is what I want to buy). Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "Yoruba has two common words for \"to be\". jẹ́ says what someone is, such as a job. ni points out or names someone or something. In the formula, the subject is who or what the sentence is about.",
    formula: "subject + jẹ́ + noun (what someone is); èyí or a long pronoun + ni + noun (pointing out)",
    rules: [
      { id: "je-what", title: "jẹ́ says what you are", explanation: "Use jẹ́ for a job or a role: Mo jẹ́ olùkọ́, I am a teacher. jẹ́ has a high mark. Without it, jẹ means \"eat\"." },
      { id: "ni-identify", title: "ni points it out", explanation: "Use ni to point out or name: Èyí ni ilé mi, this is my house. Òun ni ọ̀rẹ́ mi, he is my friend. ni has no mark (mid tone). ní with a high mark is a different word (to have)." },
      { id: "ni-long-form", title: "ni takes the long pronoun", explanation: "ni does not follow the short pronouns such as mo or ó. Use a long form instead: Òun ni ọ̀rẹ́ mi. The long forms (èmi, ìwọ, òun, àwa, ẹ̀yin, àwọn) are in Getting Started 4." },
    ],
    examples: [
      {
        id: "mo-je-oluko", surface: "Mo jẹ́ olùkọ́", english: "I am a teacher",
        parts: [
          { text: "Mo", gloss: "I (short form)", role: "pronoun" },
          { text: "jẹ́", gloss: "is, am, are (what someone is)", role: "verb" },
          { text: "olùkọ́", gloss: "teacher", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "COERLL gives the same pattern with akẹ́kọ̀ọ́ (Mo jẹ́ akẹ́kọ̀ọ́, I am a student). The sentence with olùkọ́ is built on that pattern. Confirm the tones on olùkọ́.",
      },
      {
        id: "awa-je-ore", surface: "Àwa jẹ́ ọ̀rẹ́", english: "We are friends",
        parts: [
          { text: "Àwa", gloss: "we (long form)", role: "pronoun" },
          { text: "jẹ́", gloss: "is, am, are (what someone is)", role: "verb" },
          { text: "ọ̀rẹ́", gloss: "friend, friends", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Appears in COERLL as an exercise sentence without an English gloss. Confirm the gloss and the tones on ọ̀rẹ́ (low then high).",
      },
      {
        id: "eyi-ni-ile-mi", surface: "Èyí ni ilé mi", english: "This is my house",
        parts: [
          { text: "Èyí", gloss: "this (one)", role: "pronoun" },
          { text: "ni", gloss: "is (points it out)", role: "verb" },
          { text: "ilé", gloss: "house", role: "noun" },
          { text: "mi", gloss: "my", role: "possessive" },
        ],
        steps: [], confidence: "needs-review",
        note: "Not found written out in a source. Wiktionary shows Èyí ni mo fẹ́ rà and Àǹtí mi ni èyí (this is my auntie), so ilé mi ni èyí may also be heard. Confirm with a speaker.",
      },
      {
        id: "oun-ni-ore-mi", surface: "Òun ni ọ̀rẹ́ mi", english: "He (or she) is my friend",
        parts: [
          { text: "Òun", gloss: "he, she (long form)", role: "pronoun" },
          { text: "ni", gloss: "is (points it out)", role: "verb" },
          { text: "ọ̀rẹ́", gloss: "friend", role: "noun" },
          { text: "mi", gloss: "my", role: "possessive" },
        ],
        steps: [], confidence: "needs-review",
        note: "Taken from the Wiktionary usage note on ni. COERLL writes a longer vowel before mi in some phrases (for example olùkọ́ọ̀ mi); this lesson writes the plain form. Confirm.",
      },
    ],
    commonMistake: {
      wrong: "Ó ni olùkọ́",
      right: "Ó jẹ́ olùkọ́",
      why: "COERLL marks Ó ni olùkọ́ as incorrect, because ni does not follow a short pronoun like ó. To say what someone is, use jẹ́: Ó jẹ́ olùkọ́, he is a teacher.",
    },
  },
  questions: [
    { type: "blank", prompt: "Mo ___ olùkọ́. (I am a teacher.)", answer: "jẹ́", choices: ["jẹ́", "ni", "àti"], wordId: "mo-je-oluko" },
    { type: "blank", prompt: "Èyí ___ ilé mi. (This is my house.)", answer: "ni", choices: ["ni", "jẹ́", "àti"], wordId: "eyi-ni-ile-mi" },
    { type: "blank", prompt: "___ ni ọ̀rẹ́ mi. (He is my friend.)", answer: "Òun", choices: ["Òun", "Ó", "Èmi"], wordId: "oun-ni-ore-mi" },
    { type: "pick", prompt: "Which sentence says what job someone has?", choices: ["Èyí ni ilé mi", "Mo jẹ́ olùkọ́", "Òun ni ọ̀rẹ́ mi"], answer: 1, wordId: "mo-je-oluko" },
    { type: "pick", prompt: "Which means \"We are friends\"?", choices: ["Jẹ́ àwa ọ̀rẹ́", "Àwa jẹ́ ọ̀rẹ́", "Ọ̀rẹ́ àwa jẹ́"], answer: 1, wordId: "awa-je-ore" },
    { type: "order", english: "I am a teacher", words: ["olùkọ́", "Mo", "jẹ́"], answer: ["Mo", "jẹ́", "olùkọ́"] },
    { type: "order", english: "He is a teacher", words: ["olùkọ́", "jẹ́", "Òun"], answer: ["Òun", "jẹ́", "olùkọ́"] },
    { type: "order", english: "We are friends", words: ["ọ̀rẹ́", "jẹ́", "Àwa"], answer: ["Àwa", "jẹ́", "ọ̀rẹ́"] },
  ],
};
