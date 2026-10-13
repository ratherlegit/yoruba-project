import type { Lesson } from "../types";

export const gs4: Lesson = {
  id: "gs-4",
  level: "getting-started",
  title: "Pronouns",
  sources: [
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 1, Lesson 3 \"Subject Pronouns\", pages 37 to 38: regular forms mo, o, ó, a, ẹ, wọ́n; emphatic forms èmi, ìwọ, òun, àwa, ẹ̀yin, àwọn; Àwọn àti ẹ̀yin correct and Wọ́n àti ẹ̀yin incorrect; ẹ and wọ́n as pronouns of respect; Mo lọ = I went. The PDF uses a legacy font encoding for tone marks.",
    "Wiktionary, Yoruba personal pronoun table (shown on the \"wọn\" entry): the same short and long forms.",
    "Wiktionary, \"o\", \"mo\", \"ẹ\" (Yoruba sections): o is mid tone (you), ó is high tone (he, she, it), ẹ is plural or honorific you.",
    "Wiktionary, \"lọ\" (Yoruba section): lọ, mid tone, to go.",
    "COERLL translates Mo lọ as \"I went\" and lists both Mo lọ and Èmí lọ as correct. Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "A pronoun stands in for a person, and Yoruba uses a short form before verbs.",
    formula: "mo (I), o (you), ó (he/she/it), a (we), ẹ (you plural), wọ́n (they)",
    rules: [
      { id: "short-forms", title: "Short forms", explanation: "The short forms sit right before the verb: Mo lọ, I went. Ó lọ, he went. With a verb like lọ (go), the plain verb tells you something already happened." },
      { id: "long-forms", title: "Long forms", explanation: "Each pronoun also has a long form: èmi, ìwọ, òun, àwa, ẹ̀yin, àwọn. Use the long form when no verb follows, as in Àwọn àti ẹ̀yin (they and you). It can also stress who did it." },
      { id: "o-tones", title: "o or ó", explanation: "o with no mark (mid tone) is \"you\". ó with a high mark is \"he\", \"she\", or \"it\". Only the tone tells them apart." },
      { id: "respect", title: "Pronouns of respect", explanation: "ẹ is \"you\" for a group, and also for one older person. wọ́n is \"they\", and is also used for one respected elder, such as your father." },
    ],
    examples: [
      {
        id: "mo", surface: "mo", english: "I",
        parts: [{ text: "mo", gloss: "I (short form, mid tone)", role: "pronoun" }],
        steps: [], confidence: "needs-review",
        note: "COERLL writes mò before the marker ń (Mò ń lọ). This lesson only shows mo before a plain verb. Confirm the long form èmi.",
      },
      {
        id: "o-you", surface: "o", english: "you (one person, informal)",
        parts: [{ text: "o", gloss: "you (short form, mid tone)", role: "pronoun" }],
        steps: [], confidence: "needs-review",
        note: "Wiktionary gives mid tone. Confirm the long form ìwọ and the gloss \"informal\".",
      },
      {
        id: "o-he", surface: "ó", english: "he, she, or it",
        parts: [{ text: "ó", gloss: "he, she, it (short form, high tone)", role: "pronoun" }],
        steps: [], confidence: "needs-review",
        note: "COERLL and Wiktionary agree on the high tone. Confirm the long form òun.",
      },
      {
        id: "a", surface: "a", english: "we",
        parts: [{ text: "a", gloss: "we (short form, mid tone)", role: "pronoun" }],
        steps: [], confidence: "needs-review",
        note: "Confirm the mid tone on a and the long form àwa.",
      },
      {
        id: "e", surface: "ẹ", english: "you (a group, or one elder)",
        parts: [{ text: "ẹ", gloss: "you, plural or respectful (short form, mid tone)", role: "pronoun" }],
        steps: [], confidence: "needs-review",
        note: "Wiktionary notes a low-tone ẹ̀ in some uses, marked as not standard. Confirm the long form ẹ̀yin.",
      },
      {
        id: "won", surface: "wọ́n", english: "they",
        parts: [{ text: "wọ́n", gloss: "they (short form, high tone)", role: "pronoun" }],
        steps: [], confidence: "needs-review",
        note: "COERLL and Wiktionary agree on the high tone. wọn without a mark is a different form (them). Confirm the long form àwọn, and that Wọ́n àti ẹ̀yin (the common mistake) is wrong for speakers generally, as COERLL states.",
      },
    ],
    commonMistake: {
      wrong: "Wọ́n àti ẹ̀yin",
      right: "Àwọn àti ẹ̀yin",
      why: "They and you. àti means \"and\". A short form like wọ́n only goes right before a verb. Here no verb follows, so use the long form àwọn.",
    },
  },
  questions: [
    { type: "blank", prompt: "___ lọ. (He went.)", answer: "Ó", choices: ["Ó", "O", "Ọ"], wordId: "o-he" },
    { type: "blank", prompt: "___ lọ. (They went.)", answer: "Wọ́n", choices: ["Wọ́n", "Wọn", "Wọ̀n"], wordId: "won" },
    { type: "blank", prompt: "___ lọ. (I went.)", answer: "Mo", choices: ["Mo", "Mọ", "Mó"], wordId: "mo" },
    { type: "pick", prompt: "Which short pronoun means \"we\"?", choices: ["ẹ", "a", "wọ́n"], answer: 1, wordId: "a" },
    { type: "pick", prompt: "Which pronoun do you use to speak politely to one older person?", choices: ["o", "ó", "ẹ"], answer: 2, wordId: "e" },
    { type: "order", english: "I went", words: ["lọ", "Mo"], answer: ["Mo", "lọ"] },
    { type: "order", english: "He went", words: ["lọ", "Ó"], answer: ["Ó", "lọ"] },
    { type: "order", english: "We went", words: ["lọ", "A"], answer: ["A", "lọ"] },
  ],
};
