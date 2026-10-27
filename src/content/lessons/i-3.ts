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
    "The extra olù- words (olùgbọ́, olùkàwé, olùṣọ́, olùrànlọ́wọ́, olùdarí) and oní- words (oníṣòwò kept from COERLL; olówó, alágbára, ẹlẹ́ran, aláró) and their breakdowns were added for this lesson. Only oníṣòwò, ẹlẹ́ran and aláró appear in a consulted source; the rest were not checked. Needs a native speaker's check before verifying.",
  ],
  primer: {
    rule: "A prefix is a piece added to the front of a word. olù- turns a verb into \"one who does it\". oní- turns a noun into \"one who has it\" or \"one who deals in it\".",
    formula: "olù + verb (one who does it); oní + noun (one who has or sells it)",
    tables: [
      {
        id: "olu-words",
        title: "olù- words: one who does it",
        columns: [{ label: "Word" }, { label: "Yoruba", yo: true }, { label: "Built from" }],
        listen: 1,
        rows: [
          ["teacher", "olùkọ́", "olù + kọ́ (teach)"],
          ["lover", "olùfẹ́", "olù + fẹ́ (love)"],
          ["listener", "olùgbọ́", "olù + gbọ́ (hear)"],
          ["reader", "olùkàwé", "olù + kàwé (read)"],
          ["guard", "olùṣọ́", "olù + ṣọ́ (watch over)"],
          ["helper", "olùrànlọ́wọ́", "olù + ran + ọwọ́ (help)"],
          ["director", "olùdarí", "olù + darí (lead)"],
        ],
        note: "Only some verbs take olù-, so learn these as whole words.",
      },
      {
        id: "oni-words",
        title: "oní- words: one who has or sells it",
        columns: [{ label: "Word" }, { label: "Yoruba", yo: true }, { label: "Built from" }],
        listen: 1,
        rows: [
          ["landlord", "onílé", "oní + ilé (house)"],
          ["fish seller", "ẹlẹ́ja", "oní + ẹja (fish)"],
          ["akara seller", "alákàrà", "oní + àkàrà (akara)"],
          ["trader", "oníṣòwò", "oní + ìṣòwò (trade)"],
          ["meat seller", "ẹlẹ́ran", "oní + ẹran (meat)"],
          ["rich person", "olówó", "oní + owó (money)"],
          ["strong person", "alágbára", "oní + agbára (strength)"],
          ["tie-dyer", "aláró", "oní + àró (dye)"],
        ],
        note: "Check the first letter of the noun to see which form the prefix takes.",
      },
    ],
    rules: [
      {
        id: "olu-verb",
        title: "olù- + verb",
        explanation: [
          "olù- goes before a verb.",
          "olù + kọ́ (teach) = olùkọ́, teacher.",
          "olù + gbọ́ (hear) = olùgbọ́, listener.",
          "Only some verbs take it, so learn each word one at a time.",
        ],
      },
      {
        id: "oni-noun",
        title: "oní- + noun",
        explanation: [
          "oní- goes before a noun.",
          "oní + ilé (house) = onílé, landlord.",
          "It means the one who owns it or sells it.",
        ],
      },
      {
        id: "oni-i-merge",
        title: "oní- before i",
        explanation: [
          "When the noun starts with i, the two i sounds merge into one high í.",
          "oní + ilé = onílé.",
        ],
      },
      {
        id: "oni-harmony",
        title: "oní- takes on the noun's vowel (several changes at once)",
        explanation: [
          "When the noun starts with another vowel, the prefix changes to match it and n becomes l.",
          "oní + ẹja = ẹlẹ́ja (fish seller).",
          "oní + àkàrà = alákàrà (akara seller).",
          "oní + owó = olówó (rich person).",
          "The noun's first vowel merges into the prefix.",
          "Several sound changes happen together, so the one step shown stands for all of them.",
        ],
      },
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
      {
        id: "olugbo", surface: "olùgbọ́", english: "listener",
        parts: [
          { text: "olù", gloss: "one who (does it)", role: "prefix" },
          { text: "gbọ́", gloss: "hear", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Built on olùkọ́ with gbọ́ from Getting Started 1. Confirm the tones.",
      },
      {
        id: "olowo", surface: "olówó", english: "rich person",
        parts: [
          { text: "oní", gloss: "one who has", role: "prefix" },
          { text: "owó", gloss: "money", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "oníowó" },
          { kind: "assimilate", result: "olówó", ruleId: "oni-harmony" },
        ],
        confidence: "needs-review",
        note: "Built from the oní- table row for o. Confirm olówó as the usual word and its tones.",
      },
    ],
    commonMistake: {
      wrong: "oníẹja",
      right: "ẹlẹ́ja",
      why: "oní- changes to match a noun that starts with ẹ. The usual word for a fish seller is ẹlẹ́ja.",
    },
  },
  questions: [
    { type: "blank", prompt: "oní + ẹja (fish) becomes ___ (fish seller).", answer: "ẹlẹ́ja", choices: ["ẹlẹ́ja", "oníẹja", "onílẹja"], wordId: "eleja" },
    { type: "blank", prompt: "Landlord: ___lé", answer: "oní", choices: ["oní", "olù", "ẹlẹ́"], wordId: "onile" },
    { type: "blank", prompt: "oní + owó (money) becomes ___ (rich person).", answer: "olówó", choices: ["olówó", "oníowó", "ẹlẹ́wó"], wordId: "olowo" },
    { type: "blank", prompt: "olù + gbọ́ (hear) is olùgbọ́, one who ___.", answer: "hears", choices: ["hears", "sells", "owns"], wordId: "olugbo" },
    { type: "pick", prompt: "What happens to the two i sounds when oní meets ilé?", choices: ["They merge into one high í", "The n is dropped", "Nothing changes"], answer: 0, wordId: "onile" },
    { type: "pick", prompt: "Which prefix goes before a verb?", choices: ["oní-", "olù-", "ẹlẹ́-"], answer: 1, wordId: "oluko" },
    { type: "order", english: "My teacher's house", words: ["mi", "Ilé", "olùkọ́"], answer: ["Ilé", "olùkọ́", "mi"] },
    { type: "order", english: "My landlord's vehicle", words: ["mi", "Ọkọ̀", "onílé"], answer: ["Ọkọ̀", "onílé", "mi"] },
  ],
};
