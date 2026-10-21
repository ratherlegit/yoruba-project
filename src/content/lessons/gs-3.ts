import type { Lesson } from "../types";

export const gs3: Lesson = {
  id: "gs-3",
  level: "getting-started",
  title: "Where you are from",
  sources: [
    "Wiktionary, \"wá\" and \"láti\" (Yoruba sections): wá to come, láti from.",
    "The sentences Mo wá láti Nàìjíríà, Ó wá láti Amẹ́ríkà and Wọ́n wá láti Èkó, and the question Níbo ni o ti wá, were written for this lesson. Not found written out in a consulted source. Needs a native speaker's check before verifying.",
  ],
  primer: {
    rule: "A pronoun stands in for a person, and Yoruba uses a short form right before the verb. To say where you come from, use a short pronoun, then wá láti, then the place.",
    formula: "mo (I), o (you), ó (he/she/it), a (we), ẹ (you plural), wọ́n (they) + wá láti + place",
    tables: [
      {
        id: "pronouns",
        title: "Pronouns",
        columns: [{ label: "Person" }, { label: "Short form", yo: true }, { label: "Long form", yo: true }, { label: "Good to know" }],
        rows: [
          ["I", "mo", "èmi", "Same pronoun for any speaker"],
          ["you (one person)", "o", "ìwọ", "No mark: mid tone"],
          ["he, she, it", "ó", "òun", "High tone. Only the tone tells o and ó apart"],
          ["we", "a", "àwa", "Same pronoun for any group"],
          ["you (a group)", "ẹ", "ẹ̀yin", "Also used for one older person"],
          ["they", "wọ́n", "àwọn", "Also used for one respected elder, such as your father"],
        ],
        note: "Use the short form right before a verb. Use the long form when no verb follows, or to stress who did it.",
      },
    ],
    rules: [
      { id: "short-long", title: "Short before a verb, long on its own", explanation: "The short forms sit right before the verb: Mo wá, I come. Ó wá, he or she comes. Use the long form when no verb follows, as in Àwọn àti ẹ̀yin (they and you). It can also stress who did it." },
      { id: "wa-lati", title: "wá láti: come from", explanation: "wá means \"come\" and láti means \"from\". Put the place last: Mo wá láti Nàìjíríà, I come from Nigeria." },
    ],
    examples: [
      {
        id: "mo-wa", surface: "Mo wá láti Nàìjíríà", english: "I come from Nigeria",
        parts: [
          { text: "Mo", gloss: "I", role: "pronoun" },
          { text: "wá", gloss: "come", role: "verb" },
          { text: "láti", gloss: "from", role: "preposition" },
          { text: "Nàìjíríà", gloss: "Nigeria", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Written for this lesson. Confirm wá láti is the natural way to say where you come from, and the tones of Nàìjíríà.",
      },
      {
        id: "o-he-wa", surface: "Ó wá láti Amẹ́ríkà", english: "He or she comes from America",
        parts: [
          { text: "Ó", gloss: "he, she, or it", role: "pronoun" },
          { text: "wá", gloss: "come", role: "verb" },
          { text: "láti", gloss: "from", role: "preposition" },
          { text: "Amẹ́ríkà", gloss: "America", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Confirm the tones of Amẹ́ríkà. COERLL and Wiktionary agree on the high tone of ó (he, she, it).",
      },
      {
        id: "won-wa", surface: "Wọ́n wá láti Èkó", english: "They come from Lagos",
        parts: [
          { text: "Wọ́n", gloss: "they", role: "pronoun" },
          { text: "wá", gloss: "come", role: "verb" },
          { text: "láti", gloss: "from", role: "preposition" },
          { text: "Èkó", gloss: "Lagos", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Confirm Èkó as the Yoruba name for Lagos and its tones. wọn without a mark is a different form (them).",
      },
      {
        id: "nibo-ni-o-wa", surface: "Níbo ni o ti wá", english: "Where are you from?",
        parts: [
          { text: "Níbo", gloss: "where", role: "question" },
          { text: "ni", gloss: "(focus word)", role: "particle" },
          { text: "o", gloss: "you", role: "pronoun" },
          { text: "ti", gloss: "(learn as part of the phrase)", role: "particle" },
          { text: "wá", gloss: "come", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Learn this as a fixed phrase for now. ni and ti are taught properly later. Confirm the phrase and its tones.",
      },
    ],
    commonMistake: {
      wrong: "Wọ́n àti ẹ̀yin",
      right: "Àwọn àti ẹ̀yin",
      why: "They and you. àti means \"and\". A short form like wọ́n only goes right before a verb. Here no verb follows, so use the long form àwọn.",
    },
  },
  questions: [
    { type: "blank", prompt: "___ wá láti Nàìjíríà. (I come from Nigeria.)", answer: "Mo", choices: ["Mo", "Ó", "A"], wordId: "mo-wa" },
    { type: "blank", prompt: "___ wá láti Èkó. (They come from Lagos.)", answer: "Wọ́n", choices: ["Wọ́n", "Mo", "Ó"], wordId: "won-wa" },
    { type: "blank", prompt: "Mo wá ___ Nàìjíríà. (I come from Nigeria.)", answer: "láti", choices: ["láti", "àti", "ni"], wordId: "mo-wa" },
    { type: "pick", prompt: "Which pronoun do you use to speak politely to one older person?", choices: ["o", "ó", "ẹ"], answer: 2 },
    { type: "pick", prompt: "With no tone mark, which pronoun is said to one friend (\"you\")?", choices: ["ó", "o", "a"], answer: 1, wordId: "nibo-ni-o-wa" },
    { type: "pick", prompt: "In Àwọn àti ẹ̀yin (they and you), why are the long forms used?", choices: ["No verb follows, so a short form cannot be used", "Long forms are more polite", "Short forms are only for children"], answer: 0, wordId: "won-wa" },
    { type: "order", english: "I come from Nigeria", words: ["láti", "wá", "Nàìjíríà", "Mo"], answer: ["Mo", "wá", "láti", "Nàìjíríà"] },
    { type: "order", english: "They come from Lagos", words: ["Èkó", "láti", "Wọ́n", "wá"], answer: ["Wọ́n", "wá", "láti", "Èkó"] },
  ],
};
