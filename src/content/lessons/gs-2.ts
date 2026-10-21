import type { Lesson } from "../types";

export const gs2: Lesson = {
  id: "gs-2",
  level: "getting-started",
  title: "Greetings and your name",
  sources: [
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 1, Lesson 1 \"Ìkíni\", page 32: kú + àárọ̀ = káàárọ̀, kú + alẹ́ = káalẹ́; ẹ used to greet an older person, and káàárọ̀ o with no ẹ as the reply to a friend or younger sibling. The PDF uses a legacy font encoding for tone marks.",
    "Wiktionary, \"káàárọ̀\" and \"káalẹ́\" (Yoruba sections): etymology kú + noun, and the usage note that ẹ comes first when speaking respectfully.",
    "Wiktionary, \"mi\" and \"rẹ\" (Yoruba sections): my and your, placed after the noun.",
    "The sentence Orúkọ mi ni Bùkọ́lá is built from the noun + mi pattern and ni. It was written for this lesson and not found written out in a consulted source. Needs a native speaker's check before verifying.",
  ],
  primer: {
    rule: "Greet an older person or a group with ẹ and kú, which join the word after them. To say your name, put mi (my) after orúkọ (name), then ni and the name.",
    formula: "ẹ + kú + àárọ̀ becomes ẹ káàárọ̀; orúkọ mi ni + name",
    rules: [
      { id: "respect-e", title: "Start with ẹ for respect", explanation: "ẹ means \"you\" when you speak to an older person or to a group. Put it first when you greet them. An older person answering a friend or a younger sibling says káàárọ̀ o, without ẹ." },
      { id: "u-to-a", title: "kú takes on an a", explanation: "In a greeting, kú runs into the next word. When that word starts with a, the u of kú becomes a too. The high tone of kú stays: kú àárọ̀ is said káàárọ̀." },
      { id: "my-your", title: "mi and rẹ come after the noun", explanation: "mi means \"my\" and rẹ means \"your\". Both go after the noun: orúkọ mi is my name, orúkọ rẹ is your name." },
      { id: "name-sentence", title: "Saying your name", explanation: "Orúkọ mi ni Bùkọ́lá means \"My name is Bùkọ́lá\". ni links \"my name\" to the name itself." },
    ],
    examples: [
      {
        id: "e-kaaro", surface: "ẹ káàárọ̀", english: "good morning (to an elder or a group)",
        parts: [
          { text: "ẹ", gloss: "you (respectful or plural)", role: "pronoun" },
          { text: "kú", gloss: "greeting word", role: "greeting" },
          { text: "àárọ̀", gloss: "morning", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "ẹ kúàárọ̀" },
          { kind: "assimilate", result: "ẹ káàárọ̀", ruleId: "u-to-a" },
        ],
        confidence: "needs-review",
        note: "Sources show kú + àárọ̀ = káàárọ̀, with the high tone of kú kept. Describing this as the u turning into a is an interpretation. Sources do not gloss kú here; \"greeting word\" is a placeholder gloss.",
      },
      {
        id: "e-kaale", surface: "ẹ káalẹ́", english: "good evening (to an elder or a group)",
        parts: [
          { text: "ẹ", gloss: "you (respectful or plural)", role: "pronoun" },
          { text: "kú", gloss: "greeting word", role: "greeting" },
          { text: "alẹ́", gloss: "evening", role: "noun" },
        ],
        steps: [
          { kind: "join", result: "ẹ kúalẹ́" },
          { kind: "assimilate", result: "ẹ káalẹ́", ruleId: "u-to-a" },
        ],
        confidence: "needs-review",
        note: "COERLL and Wiktionary both give káalẹ́. Confirm the mid tone on the second a, and whether a shorter form with the u dropped is also used.",
      },
      {
        id: "oruko-mi", surface: "Orúkọ mi ni Bùkọ́lá", english: "My name is Bùkọ́lá",
        parts: [
          { text: "Orúkọ", gloss: "name", role: "noun" },
          { text: "mi", gloss: "my", role: "possessive" },
          { text: "ni", gloss: "is (links the name to the person)", role: "linker" },
          { text: "Bùkọ́lá", gloss: "a woman's name", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Written for this lesson from the noun + mi pattern. Confirm the tones of orúkọ and that ni is the natural linker here.",
      },
      {
        id: "ki-ni-oruko-re", surface: "Kí ni orúkọ rẹ", english: "What is your name?",
        parts: [
          { text: "Kí ni", gloss: "what", role: "question" },
          { text: "orúkọ", gloss: "name", role: "noun" },
          { text: "rẹ", gloss: "your", role: "possessive" },
        ],
        steps: [], confidence: "needs-review",
        note: "Confirm the tones of orúkọ and kí ni. Beginner 4 teaches kí ni questions in full.",
      },
    ],
    commonMistake: {
      wrong: "Mi orúkọ ni Bùkọ́lá",
      right: "Orúkọ mi ni Bùkọ́lá",
      why: "English puts \"my\" first, but Yoruba puts mi after the noun: orúkọ mi.",
    },
  },
  questions: [
    { type: "blank", prompt: "Good morning (to an elder): Ẹ ___.", answer: "káàárọ̀", choices: ["káàárọ̀", "kú àárọ̀", "kúàárọ̀"], wordId: "e-kaaro" },
    { type: "blank", prompt: "kú + alẹ́ (evening) join in speech. Good evening (to an elder): Ẹ ___.", answer: "káalẹ́", choices: ["káalẹ́", "kúalẹ́", "kaalẹ́"], wordId: "e-kaale" },
    { type: "blank", prompt: "Orúkọ ___ ni Bùkọ́lá. (My name is Bùkọ́lá.)", answer: "mi", choices: ["mi", "rẹ", "wa"], wordId: "oruko-mi" },
    { type: "pick", prompt: "Where does mi go in orúkọ mi?", choices: ["Right after the noun", "Before the noun", "At the end of the sentence"], answer: 0, wordId: "oruko-mi" },
    { type: "pick", prompt: "kú àárọ̀ becomes káàárọ̀. What happens to the u of kú?", choices: ["It becomes a, matching the next vowel", "It is dropped", "It becomes i"], answer: 0, wordId: "e-kaaro" },
    { type: "pick", prompt: "Who is ẹ káàárọ̀ for?", choices: ["An older person or a group", "Only your own age mates", "Only a baby"], answer: 0, wordId: "e-kaaro" },
    { type: "order", english: "My name is Bùkọ́lá", words: ["ni", "mi", "Bùkọ́lá", "Orúkọ"], answer: ["Orúkọ", "mi", "ni", "Bùkọ́lá"] },
    { type: "order", english: "What is your name?", words: ["orúkọ", "Kí", "rẹ", "ni"], answer: ["Kí", "ni", "orúkọ", "rẹ"] },
  ],
};
