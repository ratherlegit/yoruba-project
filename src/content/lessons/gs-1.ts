import type { Lesson } from "../types";

export const gs1: Lesson = {
  id: "gs-1",
  level: "getting-started",
  title: "Sounds and tones",
  sources: [
    "Needs cross-check against a published Yoruba orthography guide before verifying the letter sounds.",
    "Wiktionary, \"ọkọ\" (Yoruba section): ọkọ husband, ọkọ̀ vehicle.",
    "Wikipedia, \"Yoruba language\", Phonology section: acute for high, grave for low, mid unmarked.",
    "The read-aloud words ẹ̀gbọ́n, iṣẹ́, ṣíbí, omi, ilé, bàbá and ìyá were added for practice. Their tone marks are standard spellings but were not checked against a consulted source here. Needs a native speaker's check before verifying.",
  ],
  primer: {
    rule: "Yoruba spells most sounds with one letter. Three letters carry a dot underneath, and the pitch of each syllable is written with a tone mark. The Sound Bank has more practice.",
    formula: "ó = high tone; o = mid tone (no mark); ò = low tone",
    tables: [
      {
        id: "letters",
        title: "Letters with a dot, and gb",
        columns: [{ label: "Letter", yo: true }, { label: "How it sounds" }],
        rows: [
          ["ẹ", "Open e, like the e in \"bed\""],
          ["ọ", "Open o, like the \"aw\" in \"law\""],
          ["ṣ", "The \"sh\" sound"],
          ["gb", "One sound, made by closing both lips and the back of the throat at once. Treat it as a single letter"],
        ],
        note: "Without the dot, e and o are the closed sounds and s is the s in \"sun\". A dotted letter is a different sound, so ọmọ and omo are not the same word.",
      },
      {
        id: "tones",
        title: "Tone marks",
        columns: [{ label: "Tone" }, { label: "Written as" }, { label: "Example", yo: true }, { label: "Your voice" }],
        rows: [
          ["High", "A mark that slants up to the right", "ó", "Goes high"],
          ["Low", "A mark that slants down to the right", "ò", "Goes low"],
          ["Mid", "No mark", "o", "Stays level, in the middle"],
        ],
        note: "Standard spelling leaves mid tone unmarked on vowels.",
      },
      {
        id: "read-aloud",
        title: "Words to read aloud",
        columns: [{ label: "Word", yo: true }, { label: "Means" }, { label: "Look for" }],
        rows: [
          ["ọmọ", "child", "ọ, twice"],
          ["ẹja", "fish", "ẹ"],
          ["ọkọ", "husband", "ọ, no tone marks"],
          ["ọkọ̀", "vehicle", "same letters, low tone at the end"],
          ["gbọ́", "hear", "gb and a high tone"],
          ["ẹ̀gbọ́n", "older sibling", "ẹ, gb and ọ together"],
          ["iṣẹ́", "work", "ṣ and ẹ"],
          ["ṣíbí", "spoon", "ṣ and two high tones"],
          ["omi", "water", "plain o, all mid"],
          ["ilé", "house", "mid then high"],
          ["bàbá", "father", "low then high"],
          ["ìyá", "mother", "low then high"],
        ],
        note: "Say each one out loud, then tap the speaker to compare.",
      },
    ],
    rules: [
      {
        id: "tone-marks",
        title: "Tone marks show pitch",
        explanation: [
          "Every syllable has a tone, and the tone can change the word: ọkọ is husband, ọkọ̀ is vehicle.",
        ],
      },
    ],
    examples: [
      {
        id: "omo", surface: "ọmọ", english: "child",
        parts: [
          { text: "ọ", gloss: "open o, like the \"aw\" in \"law\"", role: "syllable" },
          { text: "mọ", gloss: "m + open o", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "Syllable glosses are pronunciation guides, not meanings. Confirm the English approximations.",
      },
      {
        id: "eja", surface: "ẹja", english: "fish",
        parts: [
          { text: "ẹ", gloss: "open e, as in \"bed\"", role: "syllable" },
          { text: "ja", gloss: "j + a", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "Confirm the English approximation of ẹ.",
      },
      {
        id: "gbo", surface: "gbọ́", english: "hear",
        parts: [{ text: "gbọ́", gloss: "gb + open o, high tone", role: "syllable" }],
        steps: [], confidence: "needs-review",
        note: "Confirm the tone on gbọ́.",
      },
      {
        id: "word-husband", surface: "ọkọ", english: "husband",
        parts: [
          { text: "ọ", gloss: "open o, mid tone (no mark)", role: "syllable" },
          { text: "kọ", gloss: "k + open o, mid tone (no mark)", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary gives mid-mid for husband. Wiktionary also lists \"dear, beloved\" as a second sense. Confirm the tones with a speaker.",
      },
      {
        id: "word-vehicle", surface: "ọkọ̀", english: "vehicle",
        parts: [
          { text: "ọ", gloss: "open o, mid tone (no mark)", role: "syllable" },
          { text: "kọ̀", gloss: "k + open o, low tone", role: "syllable" },
        ],
        steps: [], confidence: "needs-review",
        note: "Wiktionary gives mid-low. Confirm that \"vehicle\" covers both car and boat, as Wiktionary suggests.",
      },
    ],
    commonMistake: {
      wrong: "omo",
      right: "ọmọ",
      why: "Without the dots the letters are different sounds. Writing omo for ọmọ is a spelling error, not a style choice.",
    },
  },
  questions: [
    { type: "blank", prompt: "gbọ́ is spelled with three letters (g, b and ọ), but it has ___ sounds.", answer: "2", choices: ["2", "3", "1"], wordId: "gbo" },
    { type: "pick", prompt: "Which word starts with the vowel sound in \"bed\"?", choices: ["ọmọ", "ẹja", "gbọ́"], answer: 1, wordId: "eja" },
    { type: "pick", prompt: "How is ṣ pronounced?", choices: ["Like the \"sh\" in \"ship\"", "Like the \"s\" in \"sun\"", "Like the \"ch\" in \"chin\""], answer: 0, wordId: "gbo" },
    { type: "pick", prompt: "Which letter is said like the \"aw\" in \"law\"?", choices: ["ọ", "o", "ẹ"], answer: 0, wordId: "omo" },
    { type: "blank", prompt: "No mark on a syllable means ___ tone.", answer: "mid", choices: ["mid", "high", "low"], wordId: "word-husband" },
    { type: "blank", prompt: "In ọkọ̀, the last syllable has ___ tone.", answer: "low", choices: ["low", "high", "mid"], wordId: "word-vehicle" },
    { type: "pick", prompt: "ọkọ and ọkọ̀ have the same letters. What makes them different words?", choices: ["The tone mark on the last syllable", "The dots under the vowels", "Nothing, they are the same word"], answer: 0, wordId: "word-vehicle" },
    { type: "pick", prompt: "Which mark means the voice goes low?", choices: ["ò", "ó", "o"], answer: 0, wordId: "word-vehicle" },
  ],
};
