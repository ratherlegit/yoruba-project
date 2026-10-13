import type { Lesson } from "../types";

export const i1: Lesson = {
  id: "i-1",
  level: "intermediate",
  title: "Done, will, and usually: ti, máa, yóò",
  sources: [
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 3, Lesson 2 \"Future Tense Máa\", page 76: Mo máa lọ (I will go); máa works with both short and long pronouns. The PDF uses a legacy font encoding for tone marks.",
    "COERLL, Yorùbá Yé Mi, Chapter 9, Lesson 2, page 219: exercise sentences with ti, including Olú ti jẹun and Mo ti lọ sí ibẹ̀.",
    "COERLL, Yorùbá Yé Mi, Chapter 2, Lesson 2, page 55: Àwọn ọkùnrin máa ń dé fìlà (men do wear hats). Chapter 4, Lesson 2 exercise: Aago mélòó ni o máa ń jẹ oúnjẹ ọ̀sán? (asking at what time you eat lunch).",
    "Wiktionary, Template \"yo-aspects\" (citing Ajani 2001, Bamgboṣe 2000, Ogunbọwale 1970): ti marks an action that has happened and still matters (ẹ ti jẹun, you have eaten); máa marks an expected future; yóò marks an intended future; máa ń marks a habit; a pronoun before yóò must be a long form.",
    "Wiktionary, \"ti\", \"maa\", \"yoo\" (Yoruba sections): Mo ti ṣe é tán (I have completed it); Mo máa lọ sí Èkó (I'll be going to Lagos); yóò, will.",
    "Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "Small words before the verb tell you when or how often something happens. ti says it is done, máa and yóò say it will happen, and máa ń says it usually happens. In the formula, the subject is who or what the sentence is about.",
    formula: "subject + ti + verb (done); subject + máa + verb (will); long pronoun + yóò + verb (will); subject + máa ń + verb (usually)",
    rules: [
      { id: "ti-done", title: "ti: done", explanation: "ti before the verb says the action has happened and still matters now: Mo ti jẹun, I have eaten (so I am full)." },
      { id: "maa-will", title: "máa: will", explanation: "máa before the verb says the action is expected to happen: Mo máa lọ, I will go. It works with the short pronouns like mo." },
      { id: "yoo-long-form", title: "yóò: will, with a long pronoun", explanation: "yóò also means \"will\", and it stresses that you intend to do it. The pronoun before yóò must be a long form: Èmi yóò lọ, not mo." },
      { id: "maa-n-usually", title: "máa ń: usually", explanation: "Put máa and ń together to say something happens regularly: Mo máa ń jẹun, I usually eat. Without ń, máa means \"will\"." },
    ],
    examples: [
      {
        id: "mo-ti-jeun", surface: "Mo ti jẹun", english: "I have eaten",
        parts: [
          { text: "Mo", gloss: "I (short form)", role: "pronoun" },
          { text: "ti", gloss: "has, have (done)", role: "aspect marker" },
          { text: "jẹun", gloss: "eat (a meal)", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "COERLL has Olú ti jẹun and Wiktionary has ẹ ti jẹun. Wiktionary adds that ti can also be read as \"ate\". Confirm the mid tone on ti.",
      },
      {
        id: "mo-maa-lo", surface: "Mo máa lọ", english: "I will go",
        parts: [
          { text: "Mo", gloss: "I (short form)", role: "pronoun" },
          { text: "máa", gloss: "will (expected)", role: "aspect marker" },
          { text: "lọ", gloss: "go", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Taken from COERLL page 76. COERLL also lists Mà á lọ for I will go. Confirm the tones on máa (high, mid).",
      },
      {
        id: "emi-yoo-lo", surface: "Èmi yóò lọ", english: "I will go (I intend to)",
        parts: [
          { text: "Èmi", gloss: "I (long form)", role: "pronoun" },
          { text: "yóò", gloss: "will (intended)", role: "aspect marker" },
          { text: "lọ", gloss: "go", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Built from the Wiktionary rule that yóò takes a long pronoun, and its example Èmi yóò máa lọ. Not found in COERLL. Wiktionary lists yóó, yíò, and yíó as other spellings. Confirm the tones.",
      },
      {
        id: "mo-maa-n-jeun", surface: "Mo máa ń jẹun", english: "I usually eat",
        parts: [
          { text: "Mo", gloss: "I (short form)", role: "pronoun" },
          { text: "máa", gloss: "habit (with ń)", role: "aspect marker" },
          { text: "ń", gloss: "ongoing (with máa)", role: "aspect marker" },
          { text: "jẹun", gloss: "eat (a meal)", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary lists máa ń as the habit marker, and COERLL uses o máa ń jẹ oúnjẹ ọ̀sán for a daily meal. Mo máa ń jẹun itself is not written out in a source. Confirm the English \"usually\".",
      },
    ],
    commonMistake: {
      wrong: "Mo yóò lọ",
      right: "Èmi yóò lọ",
      why: "yóò needs a long pronoun before it, so use èmi, not mo. With mo, use máa instead: Mo máa lọ.",
    },
  },
  questions: [
    { type: "blank", prompt: "Mo ___ jẹun. (I have eaten.)", answer: "ti", choices: ["ti", "tí", "ń"], wordId: "mo-ti-jeun" },
    { type: "blank", prompt: "Èmi ___ lọ. (I will go.)", answer: "yóò", choices: ["yóò", "ti", "ń"], wordId: "emi-yoo-lo" },
    { type: "blank", prompt: "Mo ___ ń jẹun. (I usually eat.)", answer: "máa", choices: ["máa", "maa", "ti"], wordId: "mo-maa-n-jeun" },
    { type: "pick", prompt: "Which word can follow mo to say \"will\"?", choices: ["yóò", "máa", "ti"], answer: 1, wordId: "mo-maa-lo" },
    { type: "pick", prompt: "Which means \"I usually eat\"?", choices: ["Mo ti jẹun", "Mo ń jẹun", "Mo máa ń jẹun"], answer: 2, wordId: "mo-maa-n-jeun" },
    { type: "order", english: "I have eaten", words: ["jẹun", "Mo", "ti"], answer: ["Mo", "ti", "jẹun"] },
    { type: "order", english: "I will go (I intend to)", words: ["lọ", "yóò", "Èmi"], answer: ["Èmi", "yóò", "lọ"] },
    { type: "order", english: "I usually eat", words: ["ń", "jẹun", "Mo", "máa"], answer: ["Mo", "máa", "ń", "jẹun"] },
  ],
};
