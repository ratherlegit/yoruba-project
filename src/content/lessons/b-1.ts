import type { Lesson } from "../types";

export const b1: Lesson = {
  id: "b-1",
  level: "beginner",
  title: "\"To be\": jẹ́ and ni",
  sources: [
    "COERLL, Yorùbá Yé Mi (University of Texas at Austin), Chapter 5, Lesson 1 \"The verbs jẹ́ and ni\", pages 115 to 116: jẹ́ with professions (Mo jẹ́ akẹ́kọ̀ọ́, I am a student); ni in Èmi ni màmáa Túndé and Dókítà ni Ládi; *Mo ni dókítà and *Ó ni olùkọ́ marked incorrect because regular pronouns cannot be used with ni. The PDF uses a legacy font encoding for tone marks.",
    "COERLL, Yorùbá Yé Mi, Chapter 1, Lesson 2, page 36: Àwa jẹ́ ọ̀rẹ́ (we are friends), given as an exercise sentence.",
    "Wiktionary, \"jẹ\" (Yoruba section): jẹ́, high tone, to be; jẹ, mid tone, to eat.",
    "Wiktionary, \"ni\" (Yoruba section): ni, mid tone, to be (identification); usage note that ni cannot be used with regular subject pronouns such as mo or ó, with the example Òun ni ọ̀rẹ́ mi (he is my friend). ní, high tone, is a different word (to have; at).",
    "Wiktionary, \"olukọ\" (Yoruba section): olùkọ́ teacher, with a quoted sentence ẹ jẹ́ olùkọ́ from Schleicher, Jẹ́ K'Á Sọ Yorùbá (Yale University Press, 1993), page 257.",
    "Wiktionary, \"eyi\", \"ile\", \"ọrẹ\", \"mi\" (Yoruba sections): èyí this, ilé house, ọ̀rẹ́ friend, mi my.",
    "The extra jobs (dókítà, nọ́ọ̀sì, àgbẹ̀, awakọ̀, oníṣòwò, akọrin, alásè), Kí ni iṣẹ́ rẹ and Iṣẹ́ mi ni olùkọ́ were added for this lesson. Not checked against a consulted source here. Needs a native speaker's check before verifying.",
  ],
  primer: {
    rule: "Yoruba has two common words for \"to be\". jẹ́ says what someone is, such as a job. ni points out or names someone or something. In the formula, the subject is who or what the sentence is about.",
    formula: "subject + jẹ́ + noun (what someone is); èyí or a long pronoun + ni + noun (pointing out)",
    tables: [
      {
        id: "jobs",
        title: "Jobs and roles",
        columns: [{ label: "English" }, { label: "Yoruba", yo: true }],
        rows: [
          ["teacher", "olùkọ́"],
          ["student", "akẹ́kọ̀ọ́"],
          ["doctor", "dókítà"],
          ["nurse", "nọ́ọ̀sì"],
          ["farmer", "àgbẹ̀"],
          ["driver", "awakọ̀"],
          ["trader", "oníṣòwò"],
          ["singer", "akọrin"],
          ["cook", "alásè"],
          ["friend", "ọ̀rẹ́"],
        ],
        note: "Put any of these after Mo jẹ́: Mo jẹ́ dókítà, I am a doctor.",
      },
      {
        id: "job-question",
        title: "Ask and answer about a job",
        columns: [{ label: "You want to say" }, { label: "Yoruba", yo: true }],
        rows: [
          ["What is your job?", "Kí ni iṣẹ́ rẹ?"],
          ["My job is teacher", "Iṣẹ́ mi ni olùkọ́"],
          ["I am a teacher", "Mo jẹ́ olùkọ́"],
          ["We are friends", "Àwa jẹ́ ọ̀rẹ́"],
          ["He is my friend", "Òun ni ọ̀rẹ́ mi"],
        ],
        note: "iṣẹ́ (work) is from Getting Started 1. Iṣẹ́ mi ni uses the same pattern as Orúkọ mi ni.",
      },
    ],
    rules: [
      {
        id: "je-what",
        title: "jẹ́ says what you are",
        explanation: [
          "Use jẹ́ for a job or a role.",
          "Mo jẹ́ olùkọ́ means \"I am a teacher\".",
          "jẹ́ has a high mark. Without it, jẹ means \"eat\".",
          "Swap in any job from the table.",
        ],
      },
      {
        id: "ni-identify",
        title: "ni points it out",
        explanation: [
          "Use ni to point out or name someone.",
          "Èyí ni ìyá mi: this is my mother (Getting Started 4).",
          "Òun ni ọ̀rẹ́ mi: he is my friend.",
          "ni has no mark (mid tone). ní with a high mark is a different word, \"to have\".",
          "Iṣẹ́ mi ni olùkọ́ names your job: my job is teacher.",
        ],
      },
      {
        id: "ni-long-form",
        title: "ni takes the long pronoun",
        explanation: [
          "ni does not follow short pronouns such as mo or ó.",
          "Use a long form instead: Òun ni ọ̀rẹ́ mi.",
          "The long forms are èmi, ìwọ, òun, àwa, ẹ̀yin, àwọn (Getting Started 3).",
        ],
      },
    ],
    examples: [
      {
        id: "mo-je-oluko", surface: "Mo jẹ́ olùkọ́", english: "I am a teacher",
        parts: [
          { text: "Mo", gloss: "I (short form)", role: "pronoun" },
          { text: "jẹ́", gloss: "is, am, are (what someone is)", role: "verb" },
          { text: "olùkọ́", gloss: "teacher", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "COERLL gives the same pattern with akẹ́kọ̀ọ́ (Mo jẹ́ akẹ́kọ̀ọ́, I am a student). The sentence with olùkọ́ is built on that pattern. Confirm the tones on olùkọ́.",
      },
      {
        id: "awa-je-ore", surface: "Àwa jẹ́ ọ̀rẹ́", english: "We are friends",
        parts: [
          { text: "Àwa", gloss: "we (long form)", role: "pronoun" },
          { text: "jẹ́", gloss: "is, am, are (what someone is)", role: "verb" },
          { text: "ọ̀rẹ́", gloss: "friend, friends", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Appears in COERLL as an exercise sentence without an English gloss. Confirm the gloss and the tones on ọ̀rẹ́ (low then high).",
      },
      {
        id: "oun-ni-ore-mi", surface: "Òun ni ọ̀rẹ́ mi", english: "He (or she) is my friend",
        parts: [
          { text: "Òun", gloss: "he, she (long form)", role: "pronoun" },
          { text: "ni", gloss: "is (points it out)", role: "verb" },
          { text: "ọ̀rẹ́", gloss: "friend", role: "noun" },
          { text: "mi", gloss: "my", role: "possessive" },
        ],
        steps: [], confidence: "needs-review",
        note: "Taken from the Wiktionary usage note on ni. COERLL writes a longer vowel before mi in some phrases (for example olùkọ́ọ̀ mi); this lesson writes the plain form. Confirm.",
      },
      {
        id: "mo-je-dokita", surface: "Mo jẹ́ dókítà", english: "I am a doctor",
        parts: [
          { text: "Mo", gloss: "I (short form)", role: "pronoun" },
          { text: "jẹ́", gloss: "is, am, are (what someone is)", role: "verb" },
          { text: "dókítà", gloss: "doctor", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Same pattern as Mo jẹ́ olùkọ́. Confirm the tones of dókítà.",
      },
      {
        id: "ise-mi-ni", surface: "Iṣẹ́ mi ni olùkọ́", english: "My job is teacher",
        parts: [
          { text: "Iṣẹ́", gloss: "job, work", role: "noun" },
          { text: "mi", gloss: "my", role: "possessive" },
          { text: "ni", gloss: "is", role: "linker" },
          { text: "olùkọ́", gloss: "teacher", role: "noun" },
        ],
        steps: [], confidence: "needs-review",
        note: "Written for this lesson on the pattern of Orúkọ mi ni Bùkọ́lá. Confirm this is the natural reply to Kí ni iṣẹ́ rẹ.",
      },
    ],
    commonMistake: {
      wrong: "Ó ni olùkọ́",
      right: "Ó jẹ́ olùkọ́",
      why: "COERLL marks Ó ni olùkọ́ as incorrect, because ni does not follow a short pronoun like ó. To say what someone is, use jẹ́: Ó jẹ́ olùkọ́, he is a teacher.",
    },
  },
  questions: [
    { type: "blank", prompt: "Mo ___ olùkọ́. (I am a teacher.)", answer: "jẹ́", choices: ["jẹ́", "ni", "àti"], wordId: "mo-je-oluko" },
    { type: "pick", prompt: "Why is Ó ni olùkọ́ wrong?", choices: ["ni does not follow a short pronoun like ó", "ó is not a pronoun", "olùkọ́ cannot follow ni"], answer: 0, wordId: "mo-je-oluko" },
    { type: "blank", prompt: "___ ni ọ̀rẹ́ mi. (He is my friend.)", answer: "Òun", choices: ["Òun", "Ó", "Èmi"], wordId: "oun-ni-ore-mi" },
    { type: "blank", prompt: "Mo jẹ́ ___. (I am a doctor.)", answer: "dókítà", choices: ["dókítà", "nọ́ọ̀sì", "àgbẹ̀"], wordId: "mo-je-dokita" },
    { type: "blank", prompt: "Iṣẹ́ mi ___ olùkọ́. (My job is teacher.)", answer: "ni", choices: ["ni", "jẹ́", "láti"], wordId: "ise-mi-ni" },
    { type: "order", english: "I am a doctor", words: ["dókítà", "Mo", "jẹ́"], answer: ["Mo", "jẹ́", "dókítà"] },
    { type: "order", english: "My job is teacher", words: ["ni", "olùkọ́", "mi", "Iṣẹ́"], answer: ["Iṣẹ́", "mi", "ni", "olùkọ́"] },
    { type: "order", english: "We are friends", words: ["ọ̀rẹ́", "jẹ́", "Àwa"], answer: ["Àwa", "jẹ́", "ọ̀rẹ́"] },
  ],
};
