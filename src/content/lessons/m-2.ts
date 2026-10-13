import type { Lesson } from "../types";

export const m2: Lesson = {
  id: "m-2",
  level: "mastery",
  title: "Focus with ni",
  sources: [
    "Jones, \"Focus in Yorùbá: a semantic/pragmatic account\", ZAS Papers in Linguistics 46 (2006), pages 143 to 144: the focused part goes first and is followed by ni; when a subject is focused, the pronoun ó is obligatory (citing Carstens 1985): Adé ni ó ra ìwé; a focused object leaves a gap: Ìwé ni Adé rà. Page 148: Akin ni ó lo (printed without the dot under o), answering Ta ni ó lo? (who went?).",
    "Ariyo, The definition of head and the syntactic structure of verbs in the composition of Yorùbá serial verb constructions (PhD dissertation, University of Victoria, 2025), page 51: Olú kọ́ ni ó gbé igi (it was not Olú who carried a stick); page 61: Olú ni ó lọ ata se ọbẹ̀ (it was Olú who ground pepper to cook stew).",
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 5, page 116: ni is negated as kọ́ ni. Chapter 4, page 90: Ìwé mẹ́ta ni ó wà lóríi tábìlì (there are three books on the table). Chapter 10, page 241: Ìmọ́tótó ló lè ṣẹ́gun àrùn gbogbo (cleanliness can conquer every disease), where the form ló is attested; reading ló as ni ó is the author's inference, not something COERLL states. The PDF uses a legacy font encoding for tone marks.",
    "Wiktionary, \"rọ\" (Yoruba section), example Alágbẹ̀dẹ ló bá mi rọ àdá yẹn (it was a blacksmith that forged that cutlass for me).",
    "Not cross-checked against a print grammar.",
  ],
  primer: {
    rule: "Focus means putting the spotlight on one part of a sentence, like \"It was Adé who...\" in English. Yoruba moves that part to the front and puts ni right after it.",
    formula: "focused word + ni + rest of the sentence",
    rules: [
      { id: "front-ni", title: "Front it, then ni", explanation: "Put the word you want to stress first, then ni: Adé ni ó ra ìwé, it was Adé who bought the book." },
      { id: "subject-o", title: "A focused doer takes ó", explanation: "When the focused word is the one doing the action, the sources show ó after ni, followed by a plain verb. Jones (2006) calls this ó obligatory. This lesson teaches it only for that pattern, not for every sentence." },
      { id: "object-gap", title: "A focused object leaves a gap", explanation: "When the focused word is the thing acted on, nothing fills its old place: Ìwé ni Adé rà. With nothing after it, the verb is said rà, as in Advanced 4." },
      { id: "ko-ni", title: "kọ́ ni: it was not", explanation: "To say \"it was not\", use kọ́ ni: Olú kọ́ ni ó gbé igi, it was not Olú who carried the stick." },
      { id: "lo-joined", title: "ló is usually read as ni ó", explanation: "COERLL writes ló in Ìmọ́tótó ló lè ṣẹ́gun àrùn gbogbo. ló is usually read as ni ó joined, much as tó appears to be tí ó joined. No source states either reading; they are the lesson author's inference." },
    ],
    examples: [
      {
        id: "ade-ni-o-ra-iwe", surface: "Adé ni ó ra ìwé", english: "It was Adé who bought the book",
        parts: [
          { text: "Adé", gloss: "Adé (a name)", role: "focus" },
          { text: "ni", gloss: "it is (focus)", role: "focus marker" },
          { text: "ó", gloss: "he, she (stands for Adé)", role: "pronoun" },
          { text: "ra", gloss: "buy (before an object)", role: "verb" },
          { text: "ìwé", gloss: "book", role: "object" },
        ],
        steps: [], confidence: "needs-review",
        note: "Jones (2006), example 3, word for word. Jones glosses it \"[Ade] bought a/the book\". Confirm the tones. The lesson also reads ló as ni ó (see the rule on ló); that reading is the author's inference, and COERLL does not state it.",
      },
      {
        id: "iwe-ni-ade-ra", surface: "Ìwé ni Adé rà", english: "It was a book that Adé bought",
        parts: [
          { text: "Ìwé", gloss: "book", role: "focus" },
          { text: "ni", gloss: "it is (focus)", role: "focus marker" },
          { text: "Adé", gloss: "Adé (a name)", role: "subject" },
          { text: "rà", gloss: "buy (nothing follows)", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Jones (2006), example 4, word for word. Confirm the low tone on rà.",
      },
      {
        id: "akin-ni-o-lo", surface: "Akin ni ó lọ", english: "It was Akin who went",
        parts: [
          { text: "Akin", gloss: "Akin (a name)", role: "focus" },
          { text: "ni", gloss: "it is (focus)", role: "focus marker" },
          { text: "ó", gloss: "he (stands for Akin)", role: "pronoun" },
          { text: "lọ", gloss: "go", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Jones (2006), example 16, prints lo without the dot under o; lọ (go) follows Wiktionary. Confirm.",
      },
      {
        id: "olu-ko-ni-o-gbe-igi", surface: "Olú kọ́ ni ó gbé igi", english: "It was not Olú who carried the stick",
        parts: [
          { text: "Olú", gloss: "Olú (a name)", role: "focus" },
          { text: "kọ́", gloss: "not (with ni)", role: "negation" },
          { text: "ni", gloss: "it is (focus)", role: "focus marker" },
          { text: "ó", gloss: "he (stands for Olú)", role: "pronoun" },
          { text: "gbé", gloss: "carry", role: "verb" },
          { text: "igi", gloss: "stick", role: "object" },
        ],
        steps: [], confidence: "needs-review",
        note: "Ariyo (2025), example 42, word for word. COERLL gives kọ́ ni as the negative of ni. Confirm the tones.",
      },
    ],
    commonMistake: {
      wrong: "Adé ni ra ìwé",
      right: "Adé ni ó ra ìwé",
      why: "Adé is the one who bought it, so ó follows ni. Jones (2006, page 144) says this ó is obligatory when the subject is focused, in the pattern shown here.",
    },
  },
  questions: [
    { type: "blank", prompt: "Adé ___ ó ra ìwé. (It was Adé who bought the book.)", answer: "ni", choices: ["ni", "ní", "nì"], wordId: "ade-ni-o-ra-iwe" },
    { type: "blank", prompt: "Akin ni ___ lọ. (It was Akin who went.)", answer: "ó", choices: ["ó", "o", "ọ"], wordId: "akin-ni-o-lo" },
    { type: "blank", prompt: "Ìwé ni Adé ___. (It was a book that Adé bought.)", answer: "rà", choices: ["rà", "ra", "rá"], wordId: "iwe-ni-ade-ra" },
    { type: "pick", prompt: "Which sentence puts the spotlight on Akin?", choices: ["Akin ni ó lọ", "Akin lọ", "Ṣé Akin lọ"], answer: 0, wordId: "akin-ni-o-lo" },
    { type: "pick", prompt: "Which means \"It was not Olú who carried the stick\"?", choices: ["Olú kọ́ ni ó gbé igi", "Olú ni ó gbé igi", "Olú kò gbé igi"], answer: 0, wordId: "olu-ko-ni-o-gbe-igi" },
    { type: "order", english: "It was Adé who bought the book", words: ["ra", "ni", "Adé", "ìwé", "ó"], answer: ["Adé", "ni", "ó", "ra", "ìwé"] },
    { type: "order", english: "It was a book that Adé bought", words: ["rà", "Adé", "ni", "Ìwé"], answer: ["Ìwé", "ni", "Adé", "rà"] },
    { type: "order", english: "It was Akin who went", words: ["lọ", "ó", "ni", "Akin"], answer: ["Akin", "ni", "ó", "lọ"] },
  ],
};
