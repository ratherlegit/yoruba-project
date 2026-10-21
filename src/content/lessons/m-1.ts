import type { Lesson } from "../types";

export const m1: Lesson = {
  id: "m-1",
  level: "mastery",
  title: "Fused forms",
  sources: [
    "Wiktionary, \"nile\" (Yoruba section): nílé, at home, a contraction of ní ilé; other forms lúlé (Èkìtì), núlí (Oǹdó, Ìkálẹ̀), ńlé.",
    "Wiktionary, \"lọla\" (lọ́la, tomorrow, contraction of ní ọ̀la), \"lonii\" (lónìí, today, contraction of ní òní, pronounced lóní with a downstep on the second syllable; example Kí l'ẹ jẹun lónìí?), \"lanaa\" (lánàá, yesterday, contraction of ní àná), \"ọla\" (ọ̀la, tomorrow; ọlà, wealth), \"oni\" (òní, today).",
    "Wikipedia, \"Yoruba language\", section \"Assimilation and elision\": the spelling follows speech, so contracted words are written without a word break; some writers mark a dropped vowel with an apostrophe, as in n'ílé.",
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 10, page 241: the same passage writes aṣọ tí ó mọ́ (clothes that are clean) and ẹni tó ní ìlera (a person who has good health), so tí ó and tó both appear. COERLL does not explain tó. The PDF uses a legacy font encoding for tone marks.",
    "The practice sentences Mo máa lọ lọ́la, Mo máa lọ lónìí and Ọmọ tó lọ were not found written out. Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "A fused form is two words that are so often said together that they are written as one word. Many start with ní (at, in) joined to a word for a place or a day.",
    formula: "ní + ilé → nílé (at home); ní + ọ̀la → lọ́la (tomorrow); tí + ó → tó",
    rules: [
      { id: "ni-i-merge", title: "ní before i", explanation: "When the next word starts with i, the two i sounds merge into one high í: ní + ilé = nílé, at home." },
      { id: "ni-to-l", title: "ní before other vowels (several changes at once)", explanation: "Before another vowel, n becomes l, the i of ní drops, and the next vowel takes the high tone: ní + ọ̀la = lọ́la, tomorrow. Several sound changes happen together. The one step shown stands for all of them. Wiktionary gives only the result." },
      { id: "ti-o", title: "tí + ó becomes tó", explanation: "In writing, tó appears to be tí ó (who, that + he or she) joined, with the i dropped. COERLL uses both spellings in the same passage, but no source says one comes from the other, so this is the lesson author's reading." },
      { id: "downstep", title: "A small drop in pitch", explanation: "Wiktionary spells today as lónìí but describes the sound as lóní with a downstep, a slight drop in pitch on the second syllable. Say it as one word." },
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
    ],
    commonMistake: {
      wrong: "ní ọ̀la",
      right: "lọ́la",
      why: "Tomorrow is written as one word. Wiktionary gives lọ́la, and Wikipedia notes that Yoruba spelling follows speech and does not split contracted words. ní ọ̀la is the unfused form, not the usual way to write it.",
    },
  },
  questions: [
    { type: "blank", prompt: "ní + ọ̀la fuse into ___ (tomorrow).", answer: "lọ́la", choices: ["lọ́la", "lọ̀la", "lọla"], wordId: "lola" },
    { type: "blank", prompt: "ní + ilé fuse into ___ (at home).", answer: "nílé", choices: ["nílé", "níilé", "nilé"], wordId: "nile" },
    { type: "blank", prompt: "tí + ó fuse into ___.", answer: "tó", choices: ["tó", "tí", "tò"], wordId: "to" },
    { type: "pick", prompt: "Which two words make lọ́la?", choices: ["ní + ọ̀la", "ní + ọlà", "ní + ilé"], answer: 0, wordId: "lola" },
    { type: "pick", prompt: "Which two words make tó?", choices: ["tí + ó", "ti + o", "tì + ó"], answer: 0, wordId: "to" },
    { type: "pick", prompt: "What happens to the n of ní in lọ́la?", choices: ["It becomes l", "It stays n", "It becomes a high tone"], answer: 0, wordId: "lola" },
    { type: "pick", prompt: "What happens to the two i sounds in ní + ilé?", choices: ["They merge into one high í", "Both stay", "The n is dropped"], answer: 0, wordId: "nile" },
    { type: "blank", prompt: "lónìí (today) is written as ___ word.", answer: "one", choices: ["one", "two", "three"], wordId: "lonii" },
  ],
};
