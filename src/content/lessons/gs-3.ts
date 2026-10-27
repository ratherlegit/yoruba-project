import type { Lesson } from "../types";

export const gs3: Lesson = {
  id: "gs-3",
  level: "getting-started",
  title: "Where you are from",
  sources: [
    "Wiktionary, \"wá\" and \"láti\" (Yoruba sections): wá to come, láti from.",
    "The sentences Mo wá láti Nàìjíríà, Ó wá láti Amẹ́ríkà and Wọ́n wá láti Èkó, and the question Níbo ni o ti wá, were written for this lesson. Not found written out in a consulted source. Needs a native speaker's check before verifying.",
    "The questions Orílẹ̀-èdè wo ni o ti wá, Ìlú wo ni o ti wá, Abúlé wo ni o ti wá and Ìpínlẹ̀ wo ni o ti wá, and the answers Orílẹ̀-èdè mi ni Nàìjíríà, Ìlú mi ni Ìbàdàn and Ìpínlẹ̀ mi ni Ọ̀yọ́, were written for this lesson from the noun + wo (which) and noun + mi + ni patterns. Not found written out in a consulted source. Needs a native speaker's check before verifying.",
  ],
  primer: {
    rule: "A pronoun stands in for a person, and Yoruba uses a short form right before the verb. To say where you come from, use a short pronoun, then wá láti, then the place.",
    formula: "pronoun + wá láti + place; kind of place + wo + ni o ti wá (asking); kind of place + mi + ni + name (answering)",
    tables: [
      {
        id: "pronouns",
        title: "Pronouns",
        columns: [{ label: "Person" }, { label: "Short form", yo: true }, { label: "Long form", yo: true }, { label: "Good to know" }],
        rows: [
          ["I", "mo", "èmi", "Same pronoun for any speaker"],
          ["you (one person)", "o", "ìwọ", "No mark: mid tone"],
          ["he, she, it", "ó", "òun", "High tone. Only the tone tells o and ó apart"],
          ["we", "a", "àwa", "Same pronoun for any group"],
          ["you (a group)", "ẹ", "ẹ̀yin", "Also used for one older person"],
          ["they", "wọ́n", "àwọn", "Also used for one respected elder, such as your father"],
        ],
      },
      {
        id: "places",
        title: "Places to say you come from",
        columns: [{ label: "Place" }, { label: "Yoruba", yo: true }],
        listen: 1,
        rows: [
          ["Nigeria", "Nàìjíríà"],
          ["Lagos", "Èkó"],
          ["Ibadan", "Ìbàdàn"],
          ["America", "Amẹ́ríkà"],
          ["England", "Ilẹ̀ Gẹ̀ẹ́sì"],
          ["Canada", "Kánádà"],
          ["Ghana", "Gánà"],
        ],
        note: "Any of these can go after wá láti.",
      },
      {
        id: "place-words",
        title: "Kinds of place",
        columns: [{ label: "English" }, { label: "Yoruba", yo: true }],
        listen: 1,
        rows: [
          ["country", "orílẹ̀-èdè"],
          ["state", "ìpínlẹ̀"],
          ["town, city", "ìlú"],
          ["village", "abúlé"],
          ["home", "ilé"],
        ],
      },
      {
        id: "ask-where",
        title: "Ask where someone is from",
        columns: [{ label: "You want to know" }, { label: "Ask", yo: true }],
        listen: 1,
        rows: [
          ["Where are you from?", "Níbo ni o ti wá?"],
          ["Which country are you from?", "Orílẹ̀-èdè wo ni o ti wá?"],
          ["Which state are you from?", "Ìpínlẹ̀ wo ni o ti wá?"],
          ["Which town are you from?", "Ìlú wo ni o ti wá?"],
          ["Which village are you from?", "Abúlé wo ni o ti wá?"],
        ],
      },
      {
        id: "answer-where",
        title: "Answer",
        columns: [{ label: "You say" }, { label: "Yoruba", yo: true }],
        listen: 1,
        rows: [
          ["I come from Ghana", "Mo wá láti Gánà"],
          ["My country is Nigeria", "Orílẹ̀-èdè mi ni Nàìjíríà"],
          ["My state is Oyo", "Ìpínlẹ̀ mi ni Ọ̀yọ́"],
          ["My town is Ibadan", "Ìlú mi ni Ìbàdàn"],
          ["My village is Ijaye", "Abúlé mi ni Ìjàyè"],
        ],
      },
    ],
    rules: [
      {
        id: "short-long",
        title: "Short before a verb, long on its own",
        explanation: [
          "Short forms sit right before the verb: Mo wá (I come), Ó wá (he or she comes).",
          "Use the long form when no verb follows: Àwọn àti ẹ̀yin (they and you).",
          "The long form can also stress who did it.",
        ],
      },
      {
        id: "wa-lati",
        title: "wá láti: come from",
        explanation: [
          "wá means \"come\" and láti means \"from\".",
          "Order: pronoun, wá láti, place.",
          "Mo wá láti Nàìjíríà means \"I come from Nigeria\".",
        ],
      },
      {
        id: "which-place",
        title: "Asking which place: wo",
        explanation: [
          "Put the kind of place first, then wo (which): Ìlú wo? means \"which town?\".",
          "Add ni o ti wá to finish the question.",
          "Use ẹ instead of o when you ask an older person: Ìlú wo ni ẹ ti wá?",
        ],
      },
      {
        id: "my-place",
        title: "Answering with mi ni",
        explanation: [
          "Kind of place, then mi (my), then ni, then the name. It is the same pattern as Orúkọ mi ni Bùkọ́lá.",
          "Or answer shortly with Mo wá láti plus the place.",
        ],
      },
    ],
    examples: [
      {
        id: "mo-wa", surface: "Mo wá láti Nàìjíríà", english: "I come from Nigeria",
        parts: [
          { text: "Mo", gloss: "I", role: "pronoun" },
          { text: "wá", gloss: "come", role: "verb" },
          { text: "láti", gloss: "from", role: "preposition" },
          { text: "Nàìjíríà", gloss: "Nigeria", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Written for this lesson. Confirm wá láti is the natural way to say where you come from, and the tones of Nàìjíríà.",
      },
      {
        id: "o-he-wa", surface: "Ó wá láti Amẹ́ríkà", english: "He or she comes from America",
        parts: [
          { text: "Ó", gloss: "he, she, or it", role: "pronoun" },
          { text: "wá", gloss: "come", role: "verb" },
          { text: "láti", gloss: "from", role: "preposition" },
          { text: "Amẹ́ríkà", gloss: "America", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Confirm the tones of Amẹ́ríkà. COERLL and Wiktionary agree on the high tone of ó (he, she, it).",
      },
      {
        id: "won-wa", surface: "Wọ́n wá láti Èkó", english: "They come from Lagos",
        parts: [
          { text: "Wọ́n", gloss: "they", role: "pronoun" },
          { text: "wá", gloss: "come", role: "verb" },
          { text: "láti", gloss: "from", role: "preposition" },
          { text: "Èkó", gloss: "Lagos", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Confirm Èkó as the Yoruba name for Lagos and its tones. wọn without a mark is a different form (them).",
      },
      {
        id: "nibo-ni-o-wa", surface: "Níbo ni o ti wá", english: "Where are you from?",
        parts: [
          { text: "Níbo", gloss: "where", role: "question" },
          { text: "ni", gloss: "(focus word)", role: "particle" },
          { text: "o", gloss: "you", role: "pronoun" },
          { text: "ti", gloss: "(learn as part of the phrase)", role: "particle" },
          { text: "wá", gloss: "come", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Learn this as a fixed phrase for now. ni and ti are taught properly later. Confirm the phrase and its tones.",
      },
      {
        id: "ilu-wo", surface: "Ìlú wo ni o ti wá", english: "Which town are you from?",
        parts: [
          { text: "Ìlú", gloss: "town, city", role: "noun" },
          { text: "wo", gloss: "which", role: "question" },
          { text: "ni", gloss: "(focus word)", role: "particle" },
          { text: "o", gloss: "you", role: "pronoun" },
          { text: "ti wá", gloss: "(learn as part of the phrase)", role: "verb" },
        ],
        steps: [], confidence: "needs-review",
        note: "Written for this lesson on the pattern of Níbo ni o ti wá. Confirm wo after the noun and the tones.",
      },
      {
        id: "ilu-mi", surface: "Ìlú mi ni Ìbàdàn", english: "My town is Ibadan",
        parts: [
          { text: "Ìlú", gloss: "town, city", role: "noun" },
          { text: "mi", gloss: "my", role: "possessive" },
          { text: "ni", gloss: "is", role: "linker" },
          { text: "Ìbàdàn", gloss: "Ibadan", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Same pattern as Orúkọ mi ni Bùkọ́lá in the previous lesson. Confirm the tones of Ìbàdàn and that this is the natural reply.",
      },
    ],
    commonMistake: {
      wrong: "Wọ́n àti ẹ̀yin",
      right: "Àwọn àti ẹ̀yin",
      why: "They and you. àti means \"and\". A short form like wọ́n only goes right before a verb. Here no verb follows, so use the long form àwọn.",
    },
  },
  questions: [
    { type: "blank", prompt: "___ wá láti Nàìjíríà. (I come from Nigeria.)", answer: "Mo", choices: ["Mo", "Ó", "A"], wordId: "mo-wa" },
    { type: "blank", prompt: "___ wo ni o ti wá? (Which town are you from?)", answer: "Ìlú", choices: ["Ìlú", "Ìpínlẹ̀", "Orílẹ̀-èdè"], wordId: "ilu-wo" },
    { type: "blank", prompt: "Ìlú ___ ni Ìbàdàn. (My town is Ibadan.)", answer: "mi", choices: ["mi", "wo", "wá"], wordId: "ilu-mi" },
    { type: "pick", prompt: "In Ìlú wo ni o ti wá?, where does wo (which) go?", choices: ["Right after the kind of place", "At the very end", "Before the kind of place"], answer: 0, wordId: "ilu-wo" },
    { type: "pick", prompt: "Which pronoun do you use to speak politely to one older person?", choices: ["o", "ó", "ẹ"], answer: 2 },
    { type: "pick", prompt: "In Àwọn àti ẹ̀yin (they and you), why are the long forms used?", choices: ["No verb follows, so a short form cannot be used", "Long forms are more polite", "Short forms are only for children"], answer: 0, wordId: "won-wa" },
    { type: "order", english: "Which town are you from?", words: ["wá", "Ìlú", "o", "ni", "wo", "ti"], answer: ["Ìlú", "wo", "ni", "o", "ti", "wá"] },
    { type: "order", english: "My state is Oyo", words: ["ni", "Ọ̀yọ́", "mi", "Ìpínlẹ̀"], answer: ["Ìpínlẹ̀", "mi", "ni", "Ọ̀yọ́"] },
  ],
};
