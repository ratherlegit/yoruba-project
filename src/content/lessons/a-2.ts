import type { Lesson } from "../types";

export const a2: Lesson = {
  id: "a-2",
  level: "advanced",
  title: "Verbal nouns: lílọ, jíjẹ, kíkà",
  sources: [
    "Inkelas and Zoll, Reduplication: Doubling in Morphology (Cambridge University Press), Chapter 1 excerpt, pages 2 to 3: Yoruba gerunds are made by adding a high-tone í after a copy of the verb's first consonant; data from Kawu 1998: gbé → gbígbé (take, taking), jẹ → jíjẹ (eat, eating), wọ̀ → wíwọ̀ (enter, entering), bú → bíbú (insult, insulting). The book notes that some linguists call this reduplication and others call it copying.",
    "Wiktionary, \"jijẹ\" (jíjẹ, eating, partial reduplication of jẹ), \"ka\" (kà, to read or count; derived term kíkà, reading), \"mu\" (mu, to drink; derived term mímu, drinking), \"wa\" (wà, to be; derived term wíwà, existence), \"gbe\" (gbé, to carry; example Gbígbé ni mo gbé e), \"lọ\" (lọ, to go, mid tone; lọ̀, to grind; lílọ̀, ground).",
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin): ìwé kíkà (studies), Chapter 9 vocabulary, page 213; ilé-ìwé lílọ (going to school), Chapter 9, page 221; nǹkan mímu (drinks), Chapter 7, page 170; aṣọ wíwọ̀ (wearing clothes), Chapter 11 title, page 263. The PDF uses a legacy font encoding for tone marks.",
    "lílọ is taken from COERLL's ilé-ìwé lílọ; Wiktionary has no entry for it. Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "A verbal noun is a noun that names an action, like \"reading\" in English. Yoruba makes one by reduplication, which means copying part of a word: copy the verb's first consonant, add a high-tone í, then say the verb.",
    formula: "first consonant + í + verb: lọ → lílọ (going)",
    rules: [
      { id: "copy-ci", title: "Copy the consonant, add í", explanation: "Take the verb's first consonant and add í with a high tone in front of the verb: jẹ (eat) → jíjẹ (eating). Inkelas and Zoll describe this pattern, citing Kawu." },
      { id: "keep-verb-tone", title: "The verb keeps its own tone", explanation: "The added í is always high, but the verb part does not change: kà (read, low) → kíkà; jẹ (eat, mid) → jíjẹ; gbé (carry, high) → gbígbé." },
      { id: "gb-copy", title: "gb is copied whole", explanation: "gb is one sound, so the whole gb is copied: gbé → gbígbé." },
      { id: "noun-first", title: "In these examples the noun comes first", explanation: "COERLL puts the noun before the verbal noun in phrases like ìwé kíkà (book reading, studies) and ilé-ìwé lílọ (going to school). The examples here keep the noun first." },
    ],
    examples: [
      {
        id: "lilo", surface: "lílọ", english: "going",
        parts: [
          { text: "lí", gloss: "copied l + high-tone í", role: "prefix" },
          { text: "lọ", gloss: "go", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Found in COERLL's ilé-ìwé lílọ (page 221). No dictionary entry was found. Do not confuse with lílọ̀ (ground), from lọ̀, to grind.",
      },
      {
        id: "jije", surface: "jíjẹ", english: "eating",
        parts: [
          { text: "jí", gloss: "copied j + high-tone í", role: "prefix" },
          { text: "jẹ", gloss: "eat", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary and Kawu (via Inkelas and Zoll) agree on jíjẹ. Wiktionary also lists jíjẹ as an Ifẹ̀ word for food. Confirm the tones.",
      },
      {
        id: "kika", surface: "kíkà", english: "reading, counting",
        parts: [
          { text: "kí", gloss: "copied k + high-tone í", role: "prefix" },
          { text: "kà", gloss: "read, count", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary lists kíkà under kà, and COERLL uses ìwé kíkà. Confirm the low tone on kà is kept.",
      },
      {
        id: "gbigbe", surface: "gbígbé", english: "carrying, taking",
        parts: [
          { text: "gbí", gloss: "copied gb + high-tone í", role: "prefix" },
          { text: "gbé", gloss: "carry, take", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "From Kawu's data in Inkelas and Zoll, and Wiktionary's example Gbígbé ni mo gbé e. Confirm the gloss.",
      },
      {
        id: "mimu", surface: "mímu", english: "drinking",
        parts: [
          { text: "mí", gloss: "copied m + high-tone í", role: "prefix" },
          { text: "mu", gloss: "drink", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary lists mímu under mu, and COERLL uses nǹkan mímu for drinks. Do not confuse mu (drink) with mú (take).",
      },
      {
        id: "iwe-kika", surface: "ìwé kíkà", english: "reading, studies",
        parts: [
          { text: "ìwé", gloss: "book", role: "noun" },
          { text: "kíkà", gloss: "reading", role: "verbal noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "COERLL glosses ìwé kíkà as \"studies\" (page 213). Confirm the tones on ìwé.",
      },
    ],
    commonMistake: {
      wrong: "kikà",
      right: "kíkà",
      why: "The added i always has a high tone, whatever the verb's own tone. Inkelas and Zoll (citing Kawu) describe it as a high-tone í. kikà is not the usual form.",
    },
  },
  questions: [
    { type: "blank", prompt: "jẹ (eat) → ___jẹ (eating)", answer: "jí", choices: ["jí", "jì", "ji"], wordId: "jije" },
    { type: "blank", prompt: "kà (read) → kí___ (reading)", answer: "kà", choices: ["kà", "ka", "ká"], wordId: "kika" },
    { type: "blank", prompt: "gbé (carry) → ___gbé (carrying)", answer: "gbí", choices: ["gbí", "bí", "gí"], wordId: "gbigbe" },
    { type: "pick", prompt: "lọ (go) becomes which verbal noun?", choices: ["lílọ", "lilọ", "lílọ̀"], answer: 0, wordId: "lilo" },
    { type: "pick", prompt: "Which verb does kíkà come from?", choices: ["kà", "kí", "kọ́"], answer: 0, wordId: "kika" },
    { type: "order", english: "Studies (book reading)", words: ["kíkà", "Ìwé"], answer: ["Ìwé", "kíkà"] },
    { type: "order", english: "Going to school", words: ["lílọ", "Ilé-ìwé"], answer: ["Ilé-ìwé", "lílọ"] },
    { type: "order", english: "Drinks (things for drinking)", words: ["mímu", "Nǹkan"], answer: ["Nǹkan", "mímu"] },
  ],
};
