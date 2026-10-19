import type { Lesson } from "../types";

export const b3: Lesson = {
  id: "b-3",
  level: "beginner",
  title: "Ongoing action with ń",
  sources: [
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 1, Lesson 3 \"The progressive marker ń\", page 38: ń goes before the verb for an ongoing action, like English -ing; without it the verb means past (Mò ń lọ, I am going; Mo lọ, I went). Page 37: Òun ń ṣeré / Ó ń ṣeré (he or she is playing). Page 33: Adé ń mu omi (Adé is drinking water). The PDF uses a legacy font encoding for tone marks.",
    "Wiktionary, \"n\" (Yoruba section): ń marks the progressive, with the example Mo ń jẹun (I am eating; I was eating).",
    "Wiktionary, \"jẹun\" (Yoruba section): jẹun, to eat food, from jẹ (to eat) + ohun (thing).",
    "Wiktionary, \"jẹ\" and \"ounjẹ\" (Yoruba sections): jẹ, mid tone, to eat; oúnjẹ (food) comes from ohun + jíjẹ.",
    "COERLL writes the pronoun as mò (low tone) before ń, while Wiktionary writes Mo ń jẹun. This lesson follows Wiktionary and notes the difference. Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "ń is an aspect marker: a small word before the verb that tells you how the action unfolds. ń says the action is going on. In the formula, the subject is who or what the sentence is about.",
    formula: "subject + ń + verb",
    rules: [
      { id: "n-ongoing", title: "ń means going on", explanation: "Put ń between the subject and the verb: Mo ń jẹun, I am eating. It usually means now, but it can also describe something that was going on: I was eating." },
      { id: "no-n-past", title: "Without ń, it already happened", explanation: "Leave out ń and a verb like lọ or jẹun tells you the action is done: Mo jẹun, I ate. So ń changes the meaning." },
      { id: "jeun-fusion", title: "jẹun is two words in one", explanation: "jẹun (eat a meal) comes from jẹ (eat) and ohun (thing). The o and h of ohun drop out and the two words become one." },
    ],
    examples: [
      {
        id: "mo-n-jeun", surface: "Mo ń jẹun", english: "I am eating",
        parts: [
          { text: "Mo", gloss: "I (short form)", role: "pronoun" },
          { text: "ń", gloss: "is ...-ing (action going on)", role: "aspect marker" },
          { text: "jẹun", gloss: "eat (a meal)", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary writes Mo ń jẹun. COERLL writes the pronoun as mò, with a low mark, before ń (Mò ń lọ). Confirm which spelling to teach.",
      },
      {
        id: "jeun", surface: "jẹun", english: "eat (a meal)",
        parts: [
          { text: "jẹ", gloss: "eat", role: "verb" },
          { text: "ohun", gloss: "thing", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "jẹohun" },
          { kind: "elide", result: "jẹun", ruleId: "jeun-fusion" },
        ],
        confidence: "needs-review",
        note: "Wiktionary gives jẹ + ohun as the origin, and this rests on that one dictionary entry. It does not describe the sound changes, so the single drop step is a simplification. Confirm the tones of ohun.",
      },
      {
        id: "o-n-lo", surface: "Ó ń lọ", english: "He (or she) is going",
        parts: [
          { text: "Ó", gloss: "he, she (short form)", role: "pronoun" },
          { text: "ń", gloss: "is ...-ing (action going on)", role: "aspect marker" },
          { text: "lọ", gloss: "go", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Built on COERLL's Ó ń ṣeré (he or she is playing) and Mò ń lọ (I am going). Ó ń lọ itself is not written out there. Confirm.",
      },
      {
        id: "ade-n-mu-omi", surface: "Adé ń mu omi", english: "Adé is drinking water",
        parts: [
          { text: "Adé", gloss: "a name", role: "noun" },
          { text: "ń", gloss: "is ...-ing (action going on)", role: "aspect marker" },
          { text: "mu", gloss: "drink", role: "verb" },
          { text: "omi", gloss: "water", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Taken from COERLL page 33. Confirm the mid tones on mu and omi.",
      },
    ],
    commonMistake: {
      wrong: "Mo jẹun",
      right: "Mo ń jẹun",
      why: "To say \"I am eating\", you need ń. COERLL notes that without ń, the verb points to the past, so Mo jẹun means \"I ate\".",
    },
  },
  questions: [
    { type: "blank", prompt: "Mo ___ jẹun. (I am eating.)", answer: "ń", choices: ["ń", "n", "ǹ"], wordId: "mo-n-jeun" },
    { type: "blank", prompt: "Ó ń ___. (He is going.)", answer: "lọ", choices: ["lọ", "lo", "lọ́"], wordId: "o-n-lo" },
    { type: "blank", prompt: "Adé ___ mu omi. (Adé is drinking water.)", answer: "ń", choices: ["ń", "ní", "ni"], wordId: "ade-n-mu-omi" },
    { type: "pick", prompt: "Which means \"I am eating\"?", choices: ["Mo jẹun", "Mo ń jẹun", "Mo ń lọ"], answer: 1, wordId: "mo-n-jeun" },
    { type: "pick", prompt: "In Adé ń mu omi, what does ń tell you?", choices: ["The action is going on", "The action is already done", "The action will happen later"], answer: 0, wordId: "ade-n-mu-omi" },
    { type: "order", english: "I am eating", words: ["jẹun", "ń", "Mo"], answer: ["Mo", "ń", "jẹun"] },
    { type: "order", english: "He is going", words: ["lọ", "Ó", "ń"], answer: ["Ó", "ń", "lọ"] },
    { type: "order", english: "Adé is drinking water", words: ["omi", "ń", "Adé", "mu"], answer: ["Adé", "ń", "mu", "omi"] },
  ],
};
