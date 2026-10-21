import type { Lesson } from "../types";

export const a1: Lesson = {
  id: "a-1",
  level: "advanced",
  title: "Vowel elision and contraction",
  sources: [
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 10, Lesson 2 \"Vowel Assimilation, Vowel Lengthening, and Vowel Deletion\", page 243: kú + ilé = kúulé, kú + ìrọ̀lẹ́ = kúùrọ̀lẹ́, ojú + irin = ojúurin; assimilation can go either way (kú + alẹ́ = káalẹ́). Page 245: contraction drops one of two vowels that meet across a word boundary: rí ẹja = rẹ́ja (to see fish), ta iṣu = taṣu (to sell yams), ra ẹran = rẹran (to buy meat), ti ọ̀rẹ́ = tọ̀rẹ́. COERLL says assimilation and contraction are two different processes. The PDF uses a legacy font encoding for tone marks.",
    "Wikipedia, \"Yoruba language\", section \"Assimilation and elision\" (citing Bamgboṣe 1965 and Ward 1952): ra ẹja becomes rẹja (buy fish); elision is absent only in slow, unnatural speech; the spelling follows speech and writes the contracted form as one word; some writers mark a dropped vowel with an apostrophe (n'ílé).",
    "Wiktionary, \"ta\", \"ra\", \"ẹran\", \"iṣu\" (Yoruba sections): tà, to sell, said ta before a direct object; rà, to buy; ẹran, meat; iṣu, yam.",
    "The practice sentences Mo rẹran, N kò rẹran and Ó taṣu are built from the contractions above and were not found written out in a source.",
    "No source consulted states a general rule for which of the two vowels drops; this lesson teaches each pair as the sources give it. Not cross-checked against a print grammar.",
    "The extra nouns (ẹyin, ọbẹ̀, ata) and the contractions rẹyin and tẹyin were added for this lesson by applying the sources' pattern. Not found in a consulted source. Needs a native speaker's check before verifying.",
  ],
  primer: {
    rule: "When a word ending in a vowel meets a word starting with a vowel, speech usually drops one vowel or changes one to match the other. Elision means dropping a sound. A contraction is the shorter word that results. Assimilation means one vowel changes to match its neighbour, so nothing is lost.",
    formula: "verb + noun becomes one word: ra + ẹran = rẹran; kú + ilé = kúulé",
    tables: [
      {
        id: "elision-words",
        title: "Words to combine",
        columns: [{ label: "English" }, { label: "Yoruba", yo: true }],
        rows: [
          ["buy", "ra"],
          ["sell", "ta"],
          ["see", "rí"],
          ["eat", "jẹ"],
          ["meat", "ẹran"],
          ["fish", "ẹja"],
          ["yam", "iṣu"],
          ["egg", "ẹyin"],
          ["soup", "ọbẹ̀"],
          ["pepper", "ata"],
        ],
        note: "Put a verb in front of a noun that starts with a vowel and the two usually become one word.",
      },
      {
        id: "elision-pairs",
        title: "Pairs and what they become",
        columns: [{ label: "Two words" }, { label: "Said as", yo: true }, { label: "Means" }],
        rows: [
          ["ra ẹran", "rẹran", "buy meat"],
          ["ra ẹja", "rẹja", "buy fish"],
          ["ra ẹyin", "rẹyin", "buy eggs"],
          ["ra ọbẹ̀", "rọbẹ̀", "buy soup"],
          ["rí ẹja", "rẹ́ja", "see fish"],
          ["ta iṣu", "taṣu", "sell yams"],
          ["ta ẹyin", "tẹyin", "sell eggs"],
        ],
        note: "Pattern: with ra and ta, ẹ and ọ push the a out. With iṣu, the i drops and a stays.",
      },
    ],
    rules: [
      {
        id: "drop-first",
        title: "The first vowel drops",
        explanation: [
          "Often the verb's vowel drops and the noun's vowel stays.",
          "ra ẹran (buy meat) is said rẹran.",
          "The two words are then written as one.",
          "Same with ẹyin and ọbẹ̀: rẹyin, rọbẹ̀.",
        ],
      },
      {
        id: "keep-tone",
        title: "A dropped high tone can stay",
        explanation: [
          "In rí ẹja (see fish), the í of rí drops.",
          "Its high tone stays on ẹ: rẹ́ja.",
          "Compare ra ẹja (buy fish), which becomes rẹja with no high mark.",
          "Mostly the tone tells them apart.",
        ],
      },
      {
        id: "drop-second",
        title: "Sometimes the second vowel drops",
        explanation: [
          "In ta iṣu (sell yams), the i of iṣu drops instead: taṣu.",
          "The sources list which vowel drops for each pair.",
          "Learn each one as it comes.",
        ],
      },
      {
        id: "match-vowel",
        title: "Assimilation: a vowel changes to match",
        explanation: [
          "In kú ilé (a welcome into the house), no vowel drops.",
          "The i of ilé becomes u to match kú: kúulé.",
          "Greetings did something similar: kú àárọ̀ is said káàárọ̀.",
          "There it is kú's vowel that changes.",
        ],
      },
    ],
    examples: [
      {
        id: "reran", surface: "rẹran", english: "to buy meat",
        parts: [
          { text: "ra", gloss: "buy", role: "verb" },
          { text: "ẹran", gloss: "meat", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "raẹran" },
          { kind: "elide", result: "rẹran", ruleId: "drop-first" },
        ],
        confidence: "needs-review",
        note: "COERLL page 245 gives ra ẹran = rẹran. Confirm the mid tones on rẹran.",
      },
      {
        id: "reja-buy", surface: "rẹja", english: "to buy fish",
        parts: [
          { text: "ra", gloss: "buy", role: "verb" },
          { text: "ẹja", gloss: "fish", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "raẹja" },
          { kind: "elide", result: "rẹja", ruleId: "drop-first" },
        ],
        confidence: "needs-review",
        note: "From Wikipedia only (ra ẹja becomes rẹja). Not found in COERLL. Confirm the tones.",
      },
      {
        id: "reja-see", surface: "rẹ́ja", english: "to see fish",
        parts: [
          { text: "rí", gloss: "see", role: "verb" },
          { text: "ẹja", gloss: "fish", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "ríẹja" },
          { kind: "elide", result: "rẹ́ja", ruleId: "keep-tone" },
        ],
        confidence: "needs-review",
        note: "COERLL page 245 gives rí ẹja = rẹ́ja. Reading the high mark on ẹ as the tone left behind by rí is an interpretation of that result. Confirm.",
      },
      {
        id: "tasu", surface: "taṣu", english: "to sell yams",
        parts: [
          { text: "ta", gloss: "sell", role: "verb" },
          { text: "iṣu", gloss: "yam", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "taiṣu" },
          { kind: "elide", result: "taṣu", ruleId: "drop-second" },
        ],
        confidence: "needs-review",
        note: "COERLL page 245 gives ta iṣu = taṣu. Wiktionary lists the verb as tà (low), said ta before an object. Confirm the tones on taṣu.",
      },
      {
        id: "kuule", surface: "kúulé", english: "welcome (into the house)",
        parts: [
          { text: "kú", gloss: "greeting word", role: "greeting" },
          { text: "ilé", gloss: "house", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "kúilé" },
          { kind: "assimilate", result: "kúulé", ruleId: "match-vowel" },
        ],
        confidence: "needs-review",
        note: "COERLL page 243 gives kú + ilé = kúulé, a greeting to welcome someone into the house. Confirm that the new u is mid tone.",
      },
      {
        id: "reyin", surface: "rẹyin", english: "to buy eggs",
        parts: [
          { text: "ra", gloss: "buy", role: "verb" },
          { text: "ẹyin", gloss: "egg", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "raẹyin" },
          { kind: "elide", result: "rẹyin", ruleId: "drop-first" },
        ],
        confidence: "needs-review",
        note: "Built on ra ẹran = rẹran. Not found written out in a source. Confirm the tones.",
      },
      {
        id: "teyin", surface: "tẹyin", english: "to sell eggs",
        parts: [
          { text: "ta", gloss: "sell", role: "verb" },
          { text: "ẹyin", gloss: "egg", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "taẹyin" },
          { kind: "elide", result: "tẹyin", ruleId: "drop-first" },
        ],
        confidence: "needs-review",
        note: "Built on ra ẹran = rẹran, with ta from taṣu. Not found written out in a source. Confirm the tones.",
      },
    ],
    commonMistake: {
      wrong: "rẹja (for \"to see fish\")",
      right: "rẹ́ja",
      why: "When rí loses its vowel, its high tone stays. COERLL (page 245) writes rí ẹja as rẹ́ja. Without the high mark, rẹja is the form Wikipedia gives for ra ẹja, to buy fish.",
    },
  },
  questions: [
    { type: "blank", prompt: "ra ẹran (to buy meat) is said ___.", answer: "rẹran", choices: ["rẹran", "raẹran", "rẹ́ran"], wordId: "reran" },
    { type: "blank", prompt: "rí ẹja (to see fish) is said ___ja.", answer: "rẹ́", choices: ["rẹ́", "ra", "rí"], wordId: "reja-see" },
    { type: "blank", prompt: "ta iṣu (to sell yams) is said ___.", answer: "taṣu", choices: ["taṣu", "taiṣu", "tasu"], wordId: "tasu" },
    { type: "blank", prompt: "ra ẹyin (to buy eggs) is said ___.", answer: "rẹyin", choices: ["rẹyin", "raẹyin", "rẹ́yin"], wordId: "reyin" },
    { type: "blank", prompt: "ta ẹyin (to sell eggs) is said ___.", answer: "tẹyin", choices: ["tẹyin", "taẹyin", "tẹ́yin"], wordId: "teyin" },
    { type: "pick", prompt: "How is kú ilé (welcome into the house) said?", choices: ["kúulé", "kúlé", "kílé"], answer: 0, wordId: "kuule" },
    { type: "order", english: "I did not buy eggs", words: ["rẹyin", "kò", "N"], answer: ["N", "kò", "rẹyin"] },
    { type: "order", english: "I did not buy meat", words: ["rẹran", "kò", "N"], answer: ["N", "kò", "rẹran"] },
  ],
};
