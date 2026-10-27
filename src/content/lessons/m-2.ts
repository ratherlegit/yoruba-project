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
    "The questions Ta ni ó lọ and Kí ni Adé rà, and the answers Bùkọ́lá ni ó ra aṣọ and Ìwé ni Adé rà in question and answer form, were added for this lesson on Jones's patterns. Ta ni ó lo appears in Jones (2006); the others were not found in a consulted source. Needs a native speaker's check before verifying.",
  ],
  primer: {
    rule: "Focus means putting the spotlight on one part of a sentence, like \"It was Adé who...\" in English. Yoruba moves that part to the front and puts ni right after it.",
    formula: "focused word + ni + rest of the sentence",
    tables: [
      {
        id: "focus-patterns",
        title: "Three ways to focus",
        columns: [{ label: "Spotlight on" }, { label: "Yoruba", yo: true }, { label: "Means" }],
        listen: 1,
        rows: [
          ["the doer", "Adé ni ó ra ìwé", "It was Adé who bought the book"],
          ["the thing", "Ìwé ni Adé rà", "It was a book that Adé bought"],
          ["not the doer", "Olú kọ́ ni ó gbé igi", "It was not Olú who carried the stick"],
        ],
        note: "Whatever you stress goes first, then ni.",
      },
      {
        id: "focus-questions",
        title: "Questions and focused answers",
        columns: [{ label: "You want to say" }, { label: "Yoruba", yo: true }],
        listen: 1,
        rows: [
          ["Who went?", "Ta ni ó lọ?"],
          ["It was Akin", "Akin ni ó lọ"],
          ["What did Adé buy?", "Kí ni Adé rà?"],
          ["A book", "Ìwé ni Adé rà"],
          ["Who bought clothes?", "Ta ni ó ra aṣọ?"],
          ["It was Bùkọ́lá", "Bùkọ́lá ni ó ra aṣọ"],
        ],
        note: "A question with ta ni or kí ni already has the focus pattern, so the answer copies it.",
      },
      {
        id: "focus-words",
        title: "Names and things to swap in",
        columns: [{ label: "English" }, { label: "Yoruba", yo: true }],
        listen: 1,
        rows: [
          ["Adé", "Adé"],
          ["Akin", "Akin"],
          ["Olú", "Olú"],
          ["Bùkọ́lá", "Bùkọ́lá"],
          ["clothes", "aṣọ"],
          ["book", "ìwé"],
          ["fish", "ẹja"],
          ["vehicle", "ọkọ̀"],
        ],
        note: "Change the focused word and the rest of the sentence stays the same.",
      },
    ],
    rules: [
      {
        id: "front-ni",
        title: "Front it, then ni",
        explanation: [
          "Put the word you want to stress first.",
          "Then ni: Adé ni ó ra ìwé.",
          "It means \"it was Adé who bought the book\".",
          "A question word goes first too: Ta ni ó lọ?",
        ],
      },
      {
        id: "subject-o",
        title: "A focused doer takes ó",
        explanation: [
          "When the focused word is the one doing the action, ó follows ni.",
          "A plain verb comes after ó.",
          "Jones (2006) calls this ó obligatory.",
          "This lesson teaches it only for that pattern, not for every sentence.",
        ],
      },
      {
        id: "object-gap",
        title: "A focused object leaves a gap",
        explanation: [
          "When the focused word is the thing acted on, nothing fills its old place.",
          "Ìwé ni Adé rà: the book is not repeated.",
          "With nothing after it, the verb is said rà, as in Advanced 4.",
        ],
      },
      {
        id: "ko-ni",
        title: "kọ́ ni: it was not",
        explanation: [
          "To say \"it was not\", use kọ́ ni.",
          "Olú kọ́ ni ó gbé igi: it was not Olú who carried the stick.",
        ],
      },
      {
        id: "lo-joined",
        title: "ló is usually read as ni ó",
        explanation: [
          "COERLL writes ló in Ìmọ́tótó ló lè ṣẹ́gun àrùn gbogbo.",
          "ló is usually read as ni ó joined, much as tó appears to be tí ó joined.",
          "No source states either reading. They are the lesson author's inference.",
        ],
      },
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
      {
        id: "ta-ni-o-lo", surface: "Ta ni ó lọ", english: "Who went?",
        parts: [
          { text: "Ta ni", gloss: "who", role: "question" },
          { text: "ó", gloss: "he, she", role: "pronoun" },
          { text: "lọ", gloss: "go", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Jones (2006) gives Ta ni ó lo? as the question for Akin ni ó lọ. Confirm the tones.",
      },
      {
        id: "ki-ni-ade-ra", surface: "Kí ni Adé rà", english: "What did Adé buy?",
        parts: [
          { text: "Kí ni", gloss: "what", role: "question" },
          { text: "Adé", gloss: "Adé (a name)", role: "subject" },
          { text: "rà", gloss: "buy (nothing follows)", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Built on Ìwé ni Adé rà with kí ni from Getting Started 2. Confirm the tones.",
      },
    ],
    commonMistake: {
      wrong: "Adé ni ra ìwé",
      right: "Adé ni ó ra ìwé",
      why: "Adé is the one who bought it, so ó follows ni. Jones (2006, page 144) says this ó is obligatory when the subject is focused, in the pattern shown here.",
    },
  },
  questions: [
    { type: "blank", prompt: "Adé ___ ó ra ìwé. (It was Adé who bought the book.)", answer: "ni", choices: ["ni", "kò", "ń"], wordId: "ade-ni-o-ra-iwe" },
    { type: "blank", prompt: "Akin ni ó ___. (It was Akin who went.)", answer: "lọ", choices: ["lọ", "ra", "gbé"], wordId: "akin-ni-o-lo" },
    { type: "blank", prompt: "Ìwé ni Adé ___. (It was a book that Adé bought.)", answer: "rà", choices: ["rà", "ra", "lọ"], wordId: "iwe-ni-ade-ra" },
    { type: "blank", prompt: "___ ni ó lọ? (Who went?)", answer: "Ta", choices: ["Ta", "Kí", "Ṣé"], wordId: "ta-ni-o-lo" },
    { type: "blank", prompt: "Bùkọ́lá ni ó ___ aṣọ. (It was Bùkọ́lá who bought clothes.)", answer: "ra", choices: ["ra", "rà", "lọ"] },
    { type: "pick", prompt: "Which means \"It was not Olú who carried the stick\"?", choices: ["Olú kọ́ ni ó gbé igi", "Olú ni ó gbé igi", "Olú kò gbé igi"], answer: 0, wordId: "olu-ko-ni-o-gbe-igi" },
    { type: "order", english: "It was Adé who bought the book", words: ["ra", "ni", "Adé", "ìwé", "ó"], answer: ["Adé", "ni", "ó", "ra", "ìwé"] },
    { type: "order", english: "What did Adé buy?", words: ["rà", "Adé", "ni", "Kí"], answer: ["Kí", "ni", "Adé", "rà"] },
  ],
};
