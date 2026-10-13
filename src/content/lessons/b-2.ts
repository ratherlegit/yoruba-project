import type { Lesson } from "../types";

export const b2: Lesson = {
  id: "b-2",
  level: "beginner",
  title: "Negation with kò",
  sources: [
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 1, Lesson 2 \"Negation of verbs using kò\", page 35: kò goes before the verb; N kò fẹ́ jẹ búrẹ́dì (I do not want to eat bread). The PDF uses a legacy font encoding for tone marks.",
    "COERLL, Yorùbá Yé Mi, Chapter 3, Lesson 2, page 76: pronoun table with kò, including N kò (I), A kò (we), and Kò with no pronoun for he or she.",
    "COERLL, Yorùbá Yé Mi, Chapter 4, Lesson 2 dialogue: O ò ṣe kúkú... (the short form ò after the pronoun o).",
    "Wiktionary, \"ko\" and \"o\" (Yoruba sections): kò, low tone, not, placed before a verb; ò is a short form of kò, frequently used after personal pronouns.",
    "Wiktionary, \"n\" (Yoruba section): n as a form of mo (I), used in negative or future sentences.",
    "Wiktionary, \"mi\" (Yoruba section): mi listed as a Lagos form of mo (I). Wiktionary, \"ṣe\": example Mi ò fẹ́ ṣe nǹkan kan (I don't want to do anything).",
    "Wiktionary, Template \"yo-aspects\" (aspect and negation tables citing Adebayo 2021 and Ogunbọwale 1970): kò negates the plain verb; mo lọ sí ilé-ìwé means \"I went to school\".",
    "COERLL translates kò + verb as \"is not ...-ing\" in its page 35 examples, while the Wiktionary table pairs kò with the plain past. This lesson uses \"did not\" and notes the other reading. Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "Negation means saying \"not\". Yoruba puts kò right before the verb. After a pronoun, kò is often shortened to ò.",
    formula: "subject + kò + verb; pronoun + ò + verb",
    rules: [
      { id: "ko-before-verb", title: "kò goes before the verb", explanation: "Put kò right before the verb: Kò lọ, he did not go. For he or she, there is no pronoun at all; kò stands alone. With a plain verb like lọ, this lesson reads kò as \"did not\". The same sentence can also mean \"is not going\", and context decides." },
      { id: "n-before-ko", title: "I is n before kò", explanation: "Before kò, the usual form of mo (I) is n: N kò lọ, I did not go. In everyday speech you will also hear Mi ò lọ, with mi for I." },
      { id: "ko-shortens", title: "kò shortens to ò", explanation: "After a pronoun, kò is often said as just ò, keeping its low tone: A kò lọ becomes A ò lọ, we did not go." },
    ],
    examples: [
      {
        id: "ko-lo", surface: "Kò lọ", english: "He (or she) did not go",
        parts: [
          { text: "Kò", gloss: "not (low tone)", role: "negation" },
          { text: "lọ", gloss: "go", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "COERLL's table shows Kò with no pronoun for he or she. Confirm whether Kò lọ is heard as \"did not go\", \"is not going\", or both.",
      },
      {
        id: "n-ko-lo", surface: "N kò lọ", english: "I did not go",
        parts: [
          { text: "N", gloss: "I (form used before kò)", role: "pronoun" },
          { text: "kò", gloss: "not", role: "negation" },
          { text: "lọ", gloss: "go", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "COERLL writes N kò and Wiktionary lists n as the form of mo in negative sentences. Neither marks a tone on n. Confirm the tone.",
      },
      {
        id: "a-o-lo", surface: "A ò lọ", english: "We did not go",
        parts: [
          { text: "A", gloss: "we (short form)", role: "pronoun" },
          { text: "kò", gloss: "not", role: "negation" },
          { text: "lọ", gloss: "go", role: "verb" },
        ],
        steps: [
          { kind: "join", result: "A kò lọ" },
          { kind: "elide", result: "A ò lọ", ruleId: "ko-shortens" },
        ],
        confidence: "needs-review",
        note: "COERLL gives A kò. Wiktionary says ò is frequent after pronouns but does not write A ò lọ itself. Confirm that the short form keeps the low tone.",
      },
      {
        id: "mi-o-lo", surface: "Mi ò lọ", english: "I did not go (everyday form)",
        parts: [
          { text: "Mi", gloss: "I (everyday form)", role: "pronoun" },
          { text: "ò", gloss: "not (short form of kò)", role: "negation" },
          { text: "lọ", gloss: "go", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary shows Mi ò fẹ́ ṣe nǹkan kan and labels mi for I as a Lagos form. No consulted source gives the full form Mi kò, so no step is shown. Confirm how widely Mi ò is used.",
      },
    ],
    commonMistake: {
      wrong: "Mo kò lọ",
      right: "N kò lọ",
      why: "Before kò, the usual form of mo (I) is n. COERLL and Wiktionary both show n in negative sentences. In speech, Mi ò lọ is also common.",
    },
  },
  questions: [
    { type: "blank", prompt: "___ kò lọ. (I did not go.)", answer: "N", choices: ["N", "Mo", "Ó"], wordId: "n-ko-lo" },
    { type: "blank", prompt: "A ___ lọ. (We did not go.)", answer: "ò", choices: ["ò", "ó", "o"], wordId: "a-o-lo" },
    { type: "blank", prompt: "___ lọ. (He did not go.)", answer: "Kò", choices: ["Kò", "Ko", "Kó"], wordId: "ko-lo" },
    { type: "pick", prompt: "Which is the usual way to say \"I did not go\"?", choices: ["Mo kò lọ", "N kò lọ", "Mo lọ"], answer: 1, wordId: "n-ko-lo" },
    { type: "pick", prompt: "In A ò lọ, what does ò stand for?", choices: ["ó (he)", "kò (not)", "o (you)"], answer: 1, wordId: "a-o-lo" },
    { type: "order", english: "He did not go", words: ["lọ", "Kò"], answer: ["Kò", "lọ"] },
    { type: "order", english: "We did not go", words: ["ò", "lọ", "A"], answer: ["A", "ò", "lọ"] },
    { type: "order", english: "I did not go", words: ["kò", "lọ", "N"], answer: ["N", "kò", "lọ"] },
  ],
};
