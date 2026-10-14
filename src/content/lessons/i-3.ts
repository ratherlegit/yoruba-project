import type { Lesson } from "../types";

export const i3: Lesson = {
  id: "i-3",
  level: "intermediate",
  title: "Words for people: olù- and oní-",
  sources: [
    "Wiktionary, \"olukọ\" (Yoruba section): olùkọ́ teacher, from olù- (a non-productive agent prefix) + kọ́ (to teach), literally \"the one who teaches\".",
    "Wiktionary, \"olufẹ\" (Yoruba section): olùfẹ́ lover, loved one, from olù- + fẹ́ (to love).",
    "Wiktionary, \"oni-\" (Yoruba section): oní- is added to nouns for ownership or association (ilé → onílé, landlord); usage table: before a, e, ẹ, o, ọ, u the prefix changes to alá-, elé-, ẹlẹ́-, oló-, ọlọ́-, onú-, and before i it stays oní-.",
    "Wiktionary, \"onile\" (onílé, landlord, from oní- + ilé), \"ẹlẹja\" (ẹlẹ́ja, fish seller, from oní- + ẹja), \"alakara\" (alákàrà, akara seller, from oní- + àkàrà).",
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 9 vocabulary, page 212: olùkọ́ (teacher), oníṣòwò (trader), onídìrí (hair braider), ẹlẹ́ran (meat seller), aláró (tie-dyer). The PDF uses a legacy font encoding for tone marks.",
    "The step-by-step vowel changes below follow the Wiktionary table; the table gives the results, not the stages. Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "A prefix is a piece added to the front of a word. olù- turns a verb into \"one who does it\". oní- turns a noun into \"one who has it\" or \"one who deals in it\".",
    formula: "olù + verb (one who does it); oní + noun (one who has or sells it)",
    rules: [
      { id: "olu-verb", title: "olù- + verb", explanation: "olù- goes before a verb: olù + kọ́ (teach) = olùkọ́, teacher. Only some verbs take it, so learn olù- words one at a time." },
      { id: "oni-noun", title: "oní- + noun", explanation: "oní- goes before a noun: oní + ilé (house) = onílé, landlord, the one who owns the house." },
      { id: "oni-i-merge", title: "oní- before i", explanation: "When the noun starts with i, the two i sounds merge into one high-tone í: oní + ilé = onílé." },
      { id: "oni-harmony", title: "oní- takes on the noun's vowel (several changes at once)", explanation: "When the noun starts with another vowel, the prefix changes to match it and n becomes l: oní + ẹja = ẹlẹ́ja (fish seller), oní + àkàrà = alákàrà (akara seller). The noun's first vowel merges into the prefix. Several sound changes happen together here. The one step shown stands for all of them. Wiktionary gives only the result, not separate stages." },
    ],
    examples: [
      {
        id: "oluko", surface: "olùkọ́", english: "teacher",
        parts: [
          { text: "olù", gloss: "one who (does it)", role: "prefix" },
          { text: "kọ́", gloss: "teach", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary and COERLL agree on olùkọ́. Wiktionary calls olù- non-productive. Confirm the tones.",
      },
      {
        id: "olufe", surface: "olùfẹ́", english: "lover, loved one",
        parts: [
          { text: "olù", gloss: "one who (does it)", role: "prefix" },
          { text: "fẹ́", gloss: "love", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "From Wiktionary only. Confirm the gloss, since fẹ́ also means \"want\".",
      },
      {
        id: "onile", surface: "onílé", english: "landlord",
        parts: [
          { text: "oní", gloss: "one who has", role: "prefix" },
          { text: "ilé", gloss: "house", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "oníilé" },
          { kind: "elide", result: "onílé", ruleId: "oni-i-merge" },
        ],
        confidence: "needs-review",
        note: "Wiktionary gives oní- + ilé = onílé. Describing it as two i sounds merging is an interpretation of that result.",
      },
      {
        id: "eleja", surface: "ẹlẹ́ja", english: "fish seller",
        parts: [
          { text: "oní", gloss: "one who has", role: "prefix" },
          { text: "ẹja", gloss: "fish", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "oníẹja" },
          { kind: "assimilate", result: "ẹlẹ́ja", ruleId: "oni-harmony" },
        ],
        confidence: "needs-review",
        note: "Wiktionary gives oní- + ẹja = ẹlẹ́ja and the ẹlẹ́- row of its table. The single step covers several changes at once (o to ẹ, n to l, i to ẹ, the noun's ẹ merging).",
      },
      {
        id: "alakara", surface: "alákàrà", english: "akara (bean fritter) seller",
        parts: [
          { text: "oní", gloss: "one who has", role: "prefix" },
          { text: "àkàrà", gloss: "akara, bean fritter", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "oníàkàrà" },
          { kind: "assimilate", result: "alákàrà", ruleId: "oni-harmony" },
        ],
        confidence: "needs-review",
        note: "Wiktionary gives oní- + àkàrà = alákàrà, and also lists oníkàrà. The low tone of the noun's first à is lost in the merge. Confirm.",
      },
    ],
    commonMistake: {
      wrong: "oníẹja",
      right: "ẹlẹ́ja",
      why: "oní- changes to match a noun that starts with ẹ. The usual word for a fish seller is ẹlẹ́ja.",
    },
  },
  questions: [
    { type: "blank", prompt: "Fish seller: ___ja", answer: "ẹlẹ́", choices: ["ẹlẹ́", "ẹlẹ", "elé"], wordId: "eleja" },
    { type: "blank", prompt: "Landlord: ___lé", answer: "oní", choices: ["oní", "oni", "olù"], wordId: "onile" },
    { type: "blank", prompt: "Teacher: olù___", answer: "kọ́", choices: ["kọ́", "kọ", "ko"], wordId: "oluko" },
    { type: "pick", prompt: "Which word is built from a noun, not a verb?", choices: ["olùkọ́", "olùfẹ́", "onílé"], answer: 2, wordId: "onile" },
    { type: "pick", prompt: "Which prefix goes before a verb?", choices: ["oní-", "olù-"], answer: 1, wordId: "oluko" },
    { type: "order", english: "My teacher", words: ["mi", "Olùkọ́"], answer: ["Olùkọ́", "mi"] },
    { type: "order", english: "My landlord", words: ["mi", "Onílé"], answer: ["Onílé", "mi"] },
    { type: "order", english: "The fish seller's house", words: ["ẹlẹ́ja", "Ilé"], answer: ["Ilé", "ẹlẹ́ja"] },
  ],
};
