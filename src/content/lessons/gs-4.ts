import type { Lesson } from "../types";

export const gs4: Lesson = {
  id: "gs-4",
  level: "getting-started",
  title: "Family and interests",
  sources: [
    "Wiktionary, \"ìyá\", \"bàbá\", \"arákùnrin\", \"arábìnrin\", \"fẹ́ràn\", \"orin\", \"oúnjẹ\" and \"kan\" (Yoruba sections): mother, brother, to like or love, song or music, food, one.",
    "The sentences Èyí ni ìyá mi, Mo ní arákùnrin kan, Mo fẹ́ràn orin and Mo fẹ́ràn oúnjẹ were written for this lesson from those words and the patterns taught earlier. Not found written out in a consulted source. Needs a native speaker's check before verifying.",
  ],
  primer: {
    rule: "Introduce your family with èyí ni (this is) and a noun followed by mi (my). Say what you like with mo fẹ́ràn, and what you have with mo ní.",
    formula: "èyí ni + noun + mi (this is my ...); mo fẹ́ràn + noun (I like ...); mo ní + noun + kan (I have one ...)",
    tables: [
      {
        id: "family-words",
        title: "Family words",
        columns: [{ label: "Word", yo: true }, { label: "Means" }, { label: "With mi", yo: true }],
        rows: [
          ["ìyá", "mother", "ìyá mi"],
          ["bàbá", "father", "bàbá mi"],
          ["arákùnrin", "brother", "arákùnrin mi"],
          ["arábìnrin", "sister", "arábìnrin mi"],
        ],
        note: "Each takes mi (my) after it, as orúkọ does: ìyá mi, my mother.",
      },
    ],
    rules: [
      { id: "pointing", title: "Pointing out someone", explanation: "Èyí ni points at a person or thing: Èyí ni ìyá mi, this is my mother." },
      { id: "like", title: "Saying what you like", explanation: "Mo fẹ́ràn means \"I like\". The thing you like comes right after: Mo fẹ́ràn orin, I like music." },
      { id: "have", title: "Saying what you have", explanation: "Mo ní means \"I have\". kan goes after the noun and means \"one\": Mo ní arákùnrin kan, I have one brother." },
    ],
    examples: [
      {
        id: "eyi-ni-iya-mi", surface: "Èyí ni ìyá mi", english: "This is my mother",
        parts: [
          { text: "Èyí", gloss: "this", role: "demonstrative" },
          { text: "ni", gloss: "is", role: "linker" },
          { text: "ìyá", gloss: "mother", role: "noun" },
          { text: "mi", gloss: "my", role: "possessive" },
        ],
        steps: [], confidence: "needs-review",
        note: "Written for this lesson. The Beginner 1 lesson uses the same Èyí ni ... pattern. Confirm the tones of ìyá.",
      },
      {
        id: "mo-ni-arakunrin", surface: "Mo ní arákùnrin kan", english: "I have one brother",
        parts: [
          { text: "Mo", gloss: "I", role: "pronoun" },
          { text: "ní", gloss: "have", role: "verb" },
          { text: "arákùnrin", gloss: "brother (a younger or older male sibling)", role: "noun" },
          { text: "kan", gloss: "one", role: "number" },
        ],
        steps: [], confidence: "needs-review",
        note: "Written for this lesson. Confirm the tones of arákùnrin and that kan follows the noun here.",
      },
      {
        id: "mo-feran-orin", surface: "Mo fẹ́ràn orin", english: "I like music",
        parts: [
          { text: "Mo", gloss: "I", role: "pronoun" },
          { text: "fẹ́ràn", gloss: "like", role: "verb" },
          { text: "orin", gloss: "song, music", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Written for this lesson. Confirm the tones of fẹ́ràn and orin.",
      },
      {
        id: "mo-feran-ounje", surface: "Mo fẹ́ràn oúnjẹ", english: "I like food",
        parts: [
          { text: "Mo", gloss: "I", role: "pronoun" },
          { text: "fẹ́ràn", gloss: "like", role: "verb" },
          { text: "oúnjẹ", gloss: "food", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Written for this lesson. Confirm the tones of oúnjẹ.",
      },
    ],
    commonMistake: {
      wrong: "Èyí ni mi ìyá",
      right: "Èyí ni ìyá mi",
      why: "mi goes after the noun it belongs to: ìyá mi, not mi ìyá.",
    },
  },
  questions: [
    { type: "blank", prompt: "Èyí ni ìyá ___. (This is my mother.)", answer: "mi", choices: ["mi", "rẹ", "wa"], wordId: "eyi-ni-iya-mi" },
    { type: "blank", prompt: "Mo ___ orin. (I like music.)", answer: "fẹ́ràn", choices: ["fẹ́ràn", "ní", "wá"], wordId: "mo-feran-orin" },
    { type: "blank", prompt: "Mo ní arákùnrin ___. (I have one brother.)", answer: "kan", choices: ["kan", "mi", "rẹ"], wordId: "mo-ni-arakunrin" },
    { type: "pick", prompt: "Which means \"I like food\"?", choices: ["Mo fẹ́ràn oúnjẹ", "Mo ní oúnjẹ kan", "Èyí ni oúnjẹ mi"], answer: 0, wordId: "mo-feran-ounje" },
    { type: "pick", prompt: "What comes right after mo fẹ́ràn?", choices: ["The thing you like", "The place you are from", "Your name"], answer: 0, wordId: "mo-feran-orin" },
    { type: "pick", prompt: "Which sentence says you have one brother?", choices: ["Mo ní arákùnrin kan", "Mo fẹ́ràn arákùnrin", "Èyí ni arákùnrin mi"], answer: 0, wordId: "mo-ni-arakunrin" },
    { type: "order", english: "This is my mother", words: ["ìyá", "mi", "ni", "Èyí"], answer: ["Èyí", "ni", "ìyá", "mi"] },
    { type: "order", english: "I like music", words: ["orin", "fẹ́ràn", "Mo"], answer: ["Mo", "fẹ́ràn", "orin"] },
  ],
};
