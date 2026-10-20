import type { Confidence } from "./types";

// Sentences for the Transform page. The learner is shown a Yoruba sentence and an
// instruction, then types the transformed sentence. Text only: no audio.
// Every entry is needs-review until a native speaker checks it.

export type TransformKind = "negative" | "question" | "future" | "past";

export type Transform = {
  id: string;
  kind: TransformKind;
  base: string; // the sentence shown
  baseEnglish: string;
  answers: string[]; // every accepted answer; answers[0] is the model answer
  rule: string; // one line on what changed and why
  source: string;
  confidence: Confidence;
  note?: string;
};

export const INSTRUCTIONS: Record<TransformKind, string> = {
  negative: "Make this negative",
  question: "Turn this into a question",
  future: "Say this in the future",
  past: "Say this in the past",
};

const SRC_NEG =
  "COERLL, Yorùbá Yé Mi, Chapter 1, Lesson 2, page 35 (kò goes before the verb) and Chapter 3, Lesson 2, page 76 (pronoun table: N kò, and kò alone for he or she). Wiktionary, \"ko\" and \"o\" (ò is a short form of kò after personal pronouns), \"mi\" and \"ṣe\" (Mi ò fẹ́ ṣe nǹkan kan, I don't want to do anything).";
const SRC_Q =
  "COERLL, Yorùbá Yé Mi, Chapter 1, Lesson 4, page 41 (Ṣé o fẹ́ jẹun?) and the Lesson 1 dialogue, page 27 (Ṣé o sùn dáadáa?). Wiktionary, \"ṣe\" (ṣé before a statement makes a yes or no question) and \"daadaa\" (Ṣé ẹ sùn dáadáa?).";
const SRC_FUT =
  "Wiktionary, Template \"yo-aspects\" (Ajani 2001): máa anticipative and yóò intentional; examples Ẹ̀yin yóò wá kí wa lọ́la, Èmi yóò máa lọ, A ti máa lọ kí o tó dé. Wiktionary, \"rọ\": Òjò máa rọ̀ (it will rain).";
const SRC_PAST =
  "COERLL, Yorùbá Yé Mi, Chapter 1, Lesson 3, page 38 (without ń the verb means past: Mò ń lọ, Mo lọ). Wiktionary, \"n\" (Mo ń jẹun) and Template \"yo-aspects\" (unmarked verb is completed: mo lọ sí ilé-ìwé, I went to school; progressive Wọ́n ń ṣiṣẹ́).";

const item = (
  id: string, kind: TransformKind, base: string, baseEnglish: string,
  answers: string[], rule: string, source: string, note: string,
): Transform => ({ id, kind, base, baseEnglish, answers, rule, source, confidence: "needs-review", note });

// Order interleaves the four kinds so the learner reads the instruction each time.
export const TRANSFORMS: Transform[] = [
  item("neg-mo-lo", "negative", "Mo lọ", "I went", ["Mi ò lọ", "N kò lọ"],
    "kò goes before the verb. After mo it shows up as mi ò (or n kò).", SRC_NEG,
    "The sentence is a new example. Confirm mi ò versus n kò as the usual form, and the reading \"did not go\" versus \"am not going\"."),
  item("q-o-fe-jeun", "question", "O fẹ́ jẹun", "You want to eat", ["Ṣé o fẹ́ jẹun?"],
    "Put ṣé in front of the statement. Nothing else moves.", SRC_Q,
    "The question is written in COERLL and the lessons. Tones are from Wiktionary and an encoding-damaged PDF, so confirm them."),
  item("fut-ade-jeun", "future", "Adé jẹun", "Adé ate", ["Adé máa jẹun", "Adé yóò jẹun"],
    "Put máa (or yóò) before the verb to talk about what is going to happen.", SRC_FUT,
    "The sentence is a new example. Wiktionary shows yóò mostly with pronouns, so confirm it with a name as subject."),
  item("past-mo-jeun", "past", "Mo ń jẹun", "I am eating", ["Mo jẹun"],
    "Drop ń. The bare verb means the action is done.", SRC_PAST,
    "COERLL writes the pronoun with a low tone before ń (Mò ń jẹun), Wiktionary writes Mo. Confirm the reading \"I ate\"."),

  item("neg-o-lo", "negative", "O lọ", "You went", ["O ò lọ", "O kò lọ"],
    "kò goes before the verb. After o it is usually shortened to ò.", SRC_NEG,
    "The sentence is a new example. Confirm the tone on the shortened form after o."),
  item("q-o-sun", "question", "O sùn dáadáa", "You slept well", ["Ṣé o sùn dáadáa?"],
    "Put ṣé in front of the statement to ask yes or no.", SRC_Q,
    "The question is written in the COERLL dialogue. Confirm the tones on sùn and dáadáa."),
  item("fut-oja-ro", "future", "Òjò rọ̀", "It rained", ["Òjò máa rọ̀", "Òjò yóò rọ̀"],
    "Put máa (or yóò) before the verb for what will happen.", SRC_FUT,
    "Òjò máa rọ̀ is written in Wiktionary. The yóò version is built from the aspect table and not found written out."),
  item("past-o-sere", "past", "Ó ń ṣeré", "He is playing", ["Ó ṣeré"],
    "Drop ń. The bare verb means the action is done.", SRC_PAST,
    "Ó ń ṣeré is written in COERLL. Confirm the tones on ṣeré and the reading \"he played\"."),

  item("neg-mo-fe-jeun", "negative", "Mo fẹ́ jẹun", "I want to eat", ["Mi ò fẹ́ jẹun", "N kò fẹ́ jẹun"],
    "kò goes before the verb fẹ́. After mo it shows up as mi ò (or n kò).", SRC_NEG,
    "Built from Mi ò fẹ́ ṣe nǹkan kan (Wiktionary) and N kò fẹ́ jẹ búrẹ́dì (COERLL). Not found written out as given."),
  item("q-e-sun", "question", "Ẹ sùn dáadáa", "You (plural or respectful) slept well", ["Ṣé ẹ sùn dáadáa?"],
    "Put ṣé in front of the statement to ask yes or no.", SRC_Q,
    "Wiktionary writes Ṣé ẹ sùn dáadáa? as an example. Confirm the tones."),
  item("fut-mo-ilewe", "future", "Mo lọ sí ilé-ìwé", "I went to school", ["Mo máa lọ sí ilé-ìwé", "Èmi yóò lọ sí ilé-ìwé"],
    "máa goes before the verb. With yóò, the long pronoun èmi is used.", SRC_FUT,
    "The past sentence is written in Wiktionary. The future forms are built from the aspect table. Confirm Mo máa versus Èmi yóò."),
  item("past-ade-mu-omi", "past", "Adé ń mu omi", "Adé is drinking water", ["Adé mu omi"],
    "Drop ń. The bare verb means the action is done.", SRC_PAST,
    "Adé ń mu omi is written in COERLL. Confirm the reading \"Adé drank water\"."),

  item("neg-ade-sun", "negative", "Adé sùn", "Adé slept", ["Adé kò sùn"],
    "kò goes before the verb. After a name it stays kò.", SRC_NEG,
    "The sentence is a new example. Confirm that a name before kò is not shortened."),
  item("q-ade-mu-omi", "question", "Adé ń mu omi", "Adé is drinking water", ["Ṣé Adé ń mu omi?"],
    "Put ṣé in front of the statement. The ń stays.", SRC_Q,
    "The statement is written in COERLL. The question is built from the ṣé pattern and not found written out."),
  item("fut-eyin-wa", "future", "Ẹ̀yin wá kí wa", "You came to greet us", ["Ẹ̀yin yóò wá kí wa", "Ẹ máa wá kí wa"],
    "yóò goes after the long pronoun and before the verb.", SRC_FUT,
    "Wiktionary writes Ẹ̀yin yóò wá kí wa lọ́la. The máa version with the short pronoun ẹ is built from the pattern."),
  item("past-won-sise", "past", "Wọ́n ń ṣiṣẹ́", "They are working", ["Wọ́n ṣiṣẹ́"],
    "Drop ń. The bare verb means the action is done.", SRC_PAST,
    "Wọ́n ń ṣiṣẹ́ is written in Wiktionary. Confirm the reading \"they worked\"."),

  item("neg-eyin-wa", "negative", "Ẹ wá", "You (plural) came", ["Ẹ ò wá", "Ẹ kò wá"],
    "kò goes before the verb. After ẹ it is usually shortened to ò.", SRC_NEG,
    "The sentence is a new example. Confirm the shortened form and the tone on wá."),
  item("q-o-lo-ile", "question", "O lọ sí ilé", "You went home", ["Ṣé o lọ sí ilé?"],
    "Put ṣé in front of the statement to ask yes or no.", SRC_Q,
    "Built from the ṣé pattern and the lọ sí ilé phrase in the lessons. Not found written out."),
  item("fut-a-lo", "future", "A lọ", "We went", ["A máa lọ", "Àwa yóò lọ"],
    "máa goes before the verb. With yóò, the long pronoun àwa is used.", SRC_FUT,
    "Wiktionary writes A ti máa lọ kí o tó dé and Àwa yóò ti lọ. The exact forms are built from the table."),
  item("past-mo-lo", "past", "Mo ń lọ", "I am going", ["Mo lọ"],
    "Drop ń. The bare verb means the action is done.", SRC_PAST,
    "COERLL writes Mò ń lọ and Mo lọ (I went). Confirm the low tone on the pronoun before ń."),
];
