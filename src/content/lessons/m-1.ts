import type { Lesson } from "../types";

export const m1: Lesson = {
  id: "m-1",
  level: "mastery",
  title: "Words that join into one",
  sources: [
    "Wiktionary, \"nile\" (Yoruba section): nílé, at home, a contraction of ní ilé; other forms lúlé (Èkìtì), núlí (Oǹdó, Ìkálẹ̀), ńlé.",
    "Wiktionary, \"lọla\" (lọ́la, tomorrow, contraction of ní ọ̀la), \"lonii\" (lónìí, today, contraction of ní òní, pronounced lóní with a downstep on the second syllable; example Kí l'ẹ jẹun lónìí?), \"lanaa\" (lánàá, yesterday, contraction of ní àná), \"ọla\" (ọ̀la, tomorrow; ọlà, wealth), \"oni\" (òní, today).",
    "Wikipedia, \"Yoruba language\", section \"Assimilation and elision\": the spelling follows speech, so contracted words are written without a word break; some writers mark a dropped vowel with an apostrophe, as in n'ílé.",
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 10, page 241: the same passage writes aṣọ tí ó mọ́ (clothes that are clean) and ẹni tó ní ìlera (a person who has good health), so tí ó and tó both appear. COERLL does not explain tó. The PDF uses a legacy font encoding for tone marks.",
    "The practice sentences Mo máa lọ lọ́la, Mo máa lọ lónìí and Ọmọ tó lọ were not found written out. Not cross-checked against a print grammar.",
    "The extra fused forms lọ́jà, lóko, láàárọ̀, lálẹ́ and lọ́sàn-án, and the sentences using wà, were added for this lesson on the pattern of lọ́la. Only lánàá appears in a consulted source. Needs a native speaker's check before verifying.",
  ],
  primer: {
    rule: "Some words are so often said together that they are written as one word. Many start with ní (at, in) joined to a word for a place or a day.",
    formula: "ní + ilé → nílé (at home); ní + ọ̀la → lọ́la (tomorrow); tí + ó → tó",
    tables: [
      {
        id: "fused-forms",
        title: "Joined words at a glance",
        columns: [{ label: "Joined from", yo: true }, { label: "Written as", yo: true }, { label: "Means" }, { label: "What happens" }],
        listen: 1,
        rows: [
          ["ní + ilé", "nílé", "at home", "The two i sounds merge into one high í"],
          ["ní + ọ̀la", "lọ́la", "tomorrow", "n becomes l, the i drops, and ọ takes the high tone"],
          ["tí + ó", "tó", "who, that (with he or she)", "The i drops (the lesson author's reading)"],
        ],
      },
      {
        id: "more-fused",
        title: "More ní words that fuse",
        columns: [{ label: "Joined from" }, { label: "Written as", yo: true }, { label: "Means" }],
        listen: 1,
        rows: [
          ["ní + ọjà", "lọ́jà", "at the market"],
          ["ní + oko", "lóko", "at the farm"],
          ["ní + àná", "lánàá", "yesterday"],
          ["ní + àárọ̀", "láàárọ̀", "in the morning"],
          ["ní + alẹ́", "lálẹ́", "at night"],
          ["ní + ọ̀sán", "lọ́sàn-án", "in the afternoon"],
        ],
        note: "Same recipe as lọ́la: n becomes l and the next vowel takes the high tone.",
      },
      {
        id: "fused-use",
        title: "Joined words in sentences",
        columns: [{ label: "You want to say" }, { label: "Yoruba", yo: true }],
        listen: 1,
        rows: [
          ["I am at home", "Mo wà nílé"],
          ["I will go tomorrow", "Mo máa lọ lọ́la"],
          ["I am going today", "Mo ń lọ lónìí"],
          ["I ate yesterday", "Mo jẹun lánàá"],
          ["She is at the market", "Ó wà lọ́jà"],
        ],
        note: "wà means \"be (at a place)\". Fused forms sit where the unfused ní phrase would.",
      },
    ],
    rules: [
      {
        id: "ni-i-merge",
        title: "ní before i",
        explanation: [
          "When the next word starts with i, the two i sounds merge into one high í.",
          "ní + ilé = nílé, at home.",
        ],
      },
      {
        id: "ni-to-l",
        title: "ní before other vowels (several changes at once)",
        explanation: [
          "Before another vowel, n becomes l.",
          "The i of ní drops, and the next vowel takes the high tone.",
          "ní + ọ̀la = lọ́la, tomorrow. ní + ọjà = lọ́jà, at the market.",
          "Several sound changes happen together, so the one step shown stands for all of them.",
          "Wiktionary gives only the result.",
        ],
      },
      {
        id: "ti-o",
        title: "tí + ó becomes tó",
        explanation: [
          "In writing, tó appears to be tí ó (who, that + he or she) joined, with the i dropped.",
          "COERLL uses both spellings in the same passage.",
          "No source says one comes from the other, so this is the lesson author's reading.",
        ],
      },
      {
        id: "downstep",
        title: "A small drop in pitch",
        explanation: [
          "Wiktionary spells today as lónìí but describes the sound as lóní with a downstep.",
          "A downstep is a slight drop in pitch on the second syllable.",
          "Say it as one word.",
        ],
      },
    ],
    examples: [
      {
        id: "nile", surface: "nílé", english: "at home",
        parts: [
          { text: "ní", gloss: "at, in", role: "preposition" },
          { text: "ilé", gloss: "house, home", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "níilé" },
          { kind: "elide", result: "nílé", ruleId: "ni-i-merge" },
        ],
        confidence: "needs-review",
        note: "Wiktionary gives nílé as a contraction of ní ilé. Describing it as two i sounds merging is an interpretation of that result.",
      },
      {
        id: "lola", surface: "lọ́la", english: "tomorrow",
        parts: [
          { text: "ní", gloss: "at, in", role: "preposition" },
          { text: "ọ̀la", gloss: "tomorrow", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "níọ̀la" },
          { kind: "assimilate", result: "lọ́la", ruleId: "ni-to-l" },
        ],
        confidence: "needs-review",
        note: "Wiktionary gives lọ́la from ní ọ̀la, with a downstep on la. The single step covers several changes (n to l, í dropped, ọ̀ taking a high tone). Confirm.",
      },
      {
        id: "lonii", surface: "lónìí", english: "today",
        parts: [
          { text: "ní", gloss: "at, in", role: "preposition" },
          { text: "òní", gloss: "today", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "níòní" },
          { kind: "assimilate", result: "lónìí", ruleId: "ni-to-l" },
        ],
        confidence: "needs-review",
        note: "Wiktionary gives lónìí from ní òní and says it sounds like lóní with a downstep. Reading the ìí spelling as a way of writing that drop is an interpretation. The single step covers several changes. Lagos lénìí and Èkìtì lóòní are also listed. Confirm.",
      },
      {
        id: "to", surface: "tó", english: "who, that (with he or she)",
        parts: [
          { text: "tí", gloss: "who, that", role: "relative" },
          { text: "ó", gloss: "he, she, it", role: "pronoun" },
        ],
        steps: [
          { kind: "join", result: "tíó" },
          { kind: "elide", result: "tó", ruleId: "ti-o" },
        ],
        confidence: "needs-review",
        note: "COERLL writes both tí ó and tó on page 241 but does not state that tó comes from tí ó. That link is an interpretation. Confirm.",
      },
      {
        id: "loja", surface: "lọ́jà", english: "at the market",
        parts: [
          { text: "ní", gloss: "at, in", role: "preposition" },
          { text: "ọjà", gloss: "market", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "níọjà" },
          { kind: "assimilate", result: "lọ́jà", ruleId: "ni-to-l" },
        ],
        confidence: "needs-review",
        note: "Built on lọ́la. Not written out in a consulted source. Confirm the tones.",
      },
      {
        id: "lanaa", surface: "lánàá", english: "yesterday",
        parts: [
          { text: "ní", gloss: "at, in", role: "preposition" },
          { text: "àná", gloss: "yesterday", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "níàná" },
          { kind: "assimilate", result: "lánàá", ruleId: "ni-to-l" },
        ],
        confidence: "needs-review",
        note: "Wiktionary gives lánàá from ní àná. The single step covers several changes. Confirm the tones.",
      },
    ],
    commonMistake: {
      wrong: "ní ọ̀la",
      right: "lọ́la",
      why: "Tomorrow is written as one word. Wiktionary gives lọ́la, and Wikipedia notes that Yoruba spelling follows speech and does not split contracted words. ní ọ̀la is the unfused form, not the usual way to write it.",
    },
  },
  questions: [
    { type: "blank", prompt: "ní + ọ̀la fuse into ___ (tomorrow).", answer: "lọ́la", choices: ["lọ́la", "nọ́la", "ní ọ̀la"], wordId: "lola" },
    { type: "blank", prompt: "ní + ilé fuse into ___ (at home).", answer: "nílé", choices: ["nílé", "lílé", "ní ilé"], wordId: "nile" },
    { type: "blank", prompt: "tí + ó fuse into ___.", answer: "tó", choices: ["tó", "tí ó", "ní"], wordId: "to" },
    { type: "blank", prompt: "ní + ọjà fuse into ___ (at the market).", answer: "lọ́jà", choices: ["lọ́jà", "nọ́jà", "ní ọjà"], wordId: "loja" },
    { type: "blank", prompt: "ní + àná fuse into ___ (yesterday).", answer: "lánàá", choices: ["lánàá", "nánàá", "ní àná"], wordId: "lanaa" },
    { type: "pick", prompt: "What happens to the n of ní in lọ́la?", choices: ["It becomes l", "It stays n", "It becomes a high tone"], answer: 0, wordId: "lola" },
    { type: "pick", prompt: "What happens to the two i sounds in ní + ilé?", choices: ["They merge into one high í", "Both stay", "The n is dropped"], answer: 0, wordId: "nile" },
    { type: "blank", prompt: "lónìí (today) is written as ___ word.", answer: "one", choices: ["one", "two", "three"], wordId: "lonii" },
  ],
};
