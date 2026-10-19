import type { Lesson } from "../types";

export const a3: Lesson = {
  id: "a-3",
  level: "advanced",
  title: "Serial verbs",
  sources: [
    "Wikipedia, \"Serial verb construction\", section \"Examples with intervening elements between verbs\" (citing Tallerman): ó mú ìwé wá, he brought the book, literally \"he took book came\"; the subject applies to both verbs.",
    "Ariyo, The definition of head and the syntactic structure of verbs in the composition of Yorùbá serial verb constructions (PhD dissertation, University of Victoria, 2025): page 47, Olú mú ọ̀bẹ gé ẹran (Olú took the knife to cut meat) and Olú ti mú ọ̀bẹ gé ẹran, with ti allowed only before the first verb; pages 52 to 53, Olú mú ìwé wá ilé (Olú brought a book home), Olú kò mú ìwé wá ilé (Olú did not bring a book home), and *Olú mú ìwé kò wá ilé marked ungrammatical, because the negative marker always comes before the first verb.",
    "Wiktionary, \"mu\" (mú, to take; derived term mú wá, to bring), \"gbe\" (gbé, to carry or take; example Dáńfó yẹn ń gbé èèyàn lọ sí Muṣin, that danfo bus is taking people to Mushin), \"wa\" (wá, to come), \"lọ\" (lọ, to go), \"ọbẹ\" (ọ̀bẹ, knife; ọbẹ̀, stew).",
    "Wikipedia, \"Yoruba language\", Grammar section: serial verb constructions are common.",
    "Ó gbé ìwé lọ is built on the gbé ... lọ pattern in Wiktionary's example and was not found written out. Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "A serial verb sentence chains two verbs with no linking word between them to describe one event. The subject is said once and applies to both verbs.",
    formula: "subject + verb 1 + object + verb 2: Ó mú ìwé wá (he brought the book)",
    rules: [
      { id: "chain", title: "Two verbs, one event", explanation: "mú (take) + wá (come) together mean \"bring\": Ó mú ìwé wá, he took the book and came, so he brought it. gbé (carry) + lọ (go) mean \"take away\"." },
      { id: "object-between", title: "The object sits between the verbs", explanation: "The thing being moved comes right after the first verb: mú ìwé wá. Nothing like \"and\" goes between the verbs." },
      { id: "markers-first", title: "kò and ti go before the first verb only", explanation: "Ariyo shows that kò (not) and ti (done) come before the first verb and cover the whole chain: Olú kò mú ìwé wá ilé, Olú did not bring a book home." },
    ],
    examples: [
      {
        id: "o-mu-iwe-wa", surface: "Ó mú ìwé wá", english: "He brought the book",
        parts: [
          { text: "Ó", gloss: "he, she", role: "pronoun" },
          { text: "mú", gloss: "take", role: "verb 1" },
          { text: "ìwé", gloss: "book", role: "object" },
          { text: "wá", gloss: "come", role: "verb 2" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wikipedia gives ó mú ìwé wá, citing Tallerman. Wiktionary lists mú wá as \"to bring\". Confirm the tones.",
      },
      {
        id: "olu-mu-iwe-wa-ile", surface: "Olú mú ìwé wá ilé", english: "Olú brought a book home",
        parts: [
          { text: "Olú", gloss: "Olú (a name)", role: "subject" },
          { text: "mú", gloss: "take", role: "verb 1" },
          { text: "ìwé", gloss: "book", role: "object" },
          { text: "wá", gloss: "come", role: "verb 2" },
          { text: "ilé", gloss: "home", role: "place" },
        ],
        steps: [], confidence: "needs-review",
        note: "Taken from Ariyo (2025), page 52, which glosses mú as \"bring\" and wá as \"come\". Only one source. Confirm the tones.",
      },
      {
        id: "o-gbe-iwe-lo", surface: "Ó gbé ìwé lọ", english: "He took the book away",
        parts: [
          { text: "Ó", gloss: "he, she", role: "pronoun" },
          { text: "gbé", gloss: "carry, take", role: "verb 1" },
          { text: "ìwé", gloss: "book", role: "object" },
          { text: "lọ", gloss: "go", role: "verb 2" },
        ],
        steps: [], confidence: "needs-review",
        note: "Built on Wiktionary's gbé èèyàn lọ (taking people away). This exact sentence was not found in a source. Confirm the gloss \"took away\".",
      },
      {
        id: "olu-mu-obe-ge-eran", surface: "Olú mú ọ̀bẹ gé ẹran", english: "Olú took the knife to cut meat",
        parts: [
          { text: "Olú", gloss: "Olú (a name)", role: "subject" },
          { text: "mú", gloss: "take", role: "verb 1" },
          { text: "ọ̀bẹ", gloss: "knife", role: "object 1" },
          { text: "gé", gloss: "cut", role: "verb 2" },
          { text: "ẹran", gloss: "meat", role: "object 2" },
        ],
        steps: [], confidence: "needs-review",
        note: "Taken from Ariyo (2025), page 47, which glosses it \"Olú took the knife to cut meat\". Each verb here has its own object. Confirm the tones on ọ̀bẹ (knife), not ọbẹ̀ (stew).",
      },
    ],
    commonMistake: {
      wrong: "Olú mú ìwé kò wá ilé",
      right: "Olú kò mú ìwé wá ilé",
      why: "Olú did not bring a book home. kò goes before the first verb, never between the verbs. Ariyo (2025, page 53) marks the first version as ungrammatical.",
    },
  },
  questions: [
    { type: "blank", prompt: "Ó mú ìwé ___. (He brought the book.)", answer: "wá", choices: ["wá", "wà", "wa"], wordId: "o-mu-iwe-wa" },
    { type: "blank", prompt: "Ó gbé ìwé ___. (He took the book away.)", answer: "lọ", choices: ["lọ", "lọ̀", "lo"], wordId: "o-gbe-iwe-lo" },
    { type: "blank", prompt: "Olú ___ mú ìwé wá ilé. (Olú did not bring a book home.)", answer: "kò", choices: ["kò", "ko", "kó"], wordId: "olu-mu-iwe-wa-ile" },
    { type: "pick", prompt: "Which means \"Olú took the knife to cut meat\"?", choices: ["Olú mú ọ̀bẹ gé ẹran", "Olú gé ọ̀bẹ mú ẹran", "Olú mú ẹran gé ọ̀bẹ"], answer: 0, wordId: "olu-mu-obe-ge-eran" },
    { type: "pick", prompt: "Where does kò go in a serial verb sentence?", choices: ["Before the first verb", "Between the two verbs", "At the end"], answer: 0, wordId: "olu-mu-iwe-wa-ile" },
    { type: "order", english: "He brought the book", words: ["wá", "ìwé", "Ó", "mú"], answer: ["Ó", "mú", "ìwé", "wá"] },
    { type: "order", english: "He took the book away", words: ["lọ", "Ó", "ìwé", "gbé"], answer: ["Ó", "gbé", "ìwé", "lọ"] },
    { type: "order", english: "Olú took the knife to cut meat", words: ["gé", "Olú", "ẹran", "mú", "ọ̀bẹ"], answer: ["Olú", "mú", "ọ̀bẹ", "gé", "ẹran"] },
  ],
};
