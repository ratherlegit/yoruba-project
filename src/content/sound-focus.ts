import type { Confidence, Tone } from "./types";

// Content for the Sound Bank's tone comparison grid and consonant contrast sets.
// Every row and set is needs-review until a native speaker checks it.

export type ToneCompareWord = { yoruba: string; english: string; tone: Tone };

export type ToneCompareRow = {
  id: string;
  vowel: string; // "a", "ẹ", ..., or a nasal vowel such as "an", "ọn"
  words: [ToneCompareWord, ToneCompareWord, ToneCompareWord]; // mid, high, low
  source: string;
  confidence: Confidence;
  note: string;
};

export type ConsonantFocus = "gb" | "p" | "s-sh";

export type ConsonantSet = {
  id: string;
  focus: ConsonantFocus[]; // the key consonant cards this set appears on
  explain: string; // one line saying what to listen for
  words: { yoruba: string; english: string }[]; // 2 to 4, same vowel and tone, different consonants
  source: string;
  confidence: Confidence;
  note: string;
};

const wik = (...pages: string[]) =>
  `Wiktionary, Yoruba ${pages.length > 1 ? "sections of the pages" : "section of the page"} ${pages.map((p) => `"${p}"`).join(", ")} (en.wiktionary.org/wiki/<page>), read 2026-10-19`;

const row = (
  id: string, vowel: string, page: string, words: [string, string][], note: string,
): ToneCompareRow => ({
  id, vowel, source: wik(page), confidence: "needs-review", note,
  words: [
    { yoruba: words[0]![0], english: words[0]![1], tone: "mid" },
    { yoruba: words[1]![0], english: words[1]![1], tone: "high" },
    { yoruba: words[2]![0], english: words[2]![1], tone: "low" },
  ],
});

const set = (
  id: string, focus: ConsonantFocus[], explain: string, words: [string, string][], pages: string[], note: string,
): ConsonantSet => ({
  id, focus, explain, source: wik(...pages), confidence: "needs-review", note,
  words: words.map(([yoruba, english]) => ({ yoruba, english })),
});

export const TONE_COMPARE: ToneCompareRow[] = [
  row("tc-a", "a", "wa", [["wa", "our"], ["wá", "come"], ["wà", "be, be located"]], "Check all three tones and meanings."),
  row("tc-e", "e", "le", [["le", "hard"], ["lé", "chase"], ["lè", "can"]], "The mid word le has several unrelated meanings on its page; check the mid tone and the chosen meaning."),
  row("tc-ee", "ẹ", "bẹ", [["bẹ", "peel"], ["bẹ́", "hop down"], ["bẹ̀", "beg"]], "The mid word bẹ has several unrelated meanings on its page; check the mid tone and the chosen meaning."),
  row("tc-i", "i", "ṣi", [["ṣi", "make a mistake"], ["ṣí", "open"], ["ṣì", "become dull"]], "The page writes ṣi (make a mistake) without a tone mark; check it is mid tone."),
  row("tc-o", "o", "ro", [["ro", "hoe, till"], ["ró", "wrap a wrapper"], ["rò", "think"]], "The mid word ro has several meanings on its page (hoe, ache); check the mid tone and the chosen meaning."),
  row("tc-oo", "ọ", "kọ", [["kọ", "write"], ["kọ́", "build, teach"], ["kọ̀", "refuse"]], "Check all three tones and meanings. The kọ and kọ̀ clips are very short; listen to them in the app."),
  row("tc-u", "u", "mu", [["mu", "drink"], ["mú", "take"], ["mù", "be hidden"]], "Check all three tones and meanings."),
  row("tc-an", "an", "kan", [["kan", "one"], ["kán", "break"], ["kàn", "touch, concern"]], "Nasal vowel. The mid word kan is listed as a word for one; check the mid tone and meaning."),
  row("tc-in", "in", "rin", [["rin", "grate"], ["rín", "smile, laugh"], ["rìn", "walk"]], "Nasal vowel. The mid word rin has several unrelated meanings on its page; check the mid tone and the chosen meaning."),
  row("tc-un", "un", "sun", [["sun", "roast, cry"], ["sún", "move, shift"], ["sùn", "sleep"]], "Nasal vowel. The mid word sun has several unrelated meanings (roast, trickle, cry); check the mid tone and the chosen meaning."),
  row("tc-on", "ọn", "wọn", [["wọn", "their"], ["wọ́n", "expensive"], ["wọ̀n", "measure, weigh"]], "Nasal vowel. wọ́n also means they (pronoun), and wọn is a possessive; check all three tones and the chosen meanings."),
];

export const CONSONANT_SETS: ConsonantSet[] = [
  set("cs-gb-a-low", ["gb"], "Listen for gb: the g and b are said together with the lips closed. Compare it with plain b and g.", [["bà", "perch"], ["gà", "tickle"], ["gbà", "rescue, take"]], ["ba", "ga", "gba"], "Check the three words, their tones and the chosen meanings."),
  set("cs-gb-e-high", ["gb"], "Hear gé with a plain g, then gbé with g and b said together.", [["gé", "cut"], ["gbé", "carry"]], ["ge", "gbe"], "Check both words and the chosen meanings."),
  set("cs-p-o-high", ["p"], "Compare p, k, b and gb at the same vowel and tone. Yoruba p is said like kp, with the lips closed.", [["pọ́", "inflate, pump"], ["kọ́", "build"], ["bọ́", "fall"], ["gbọ́", "hear"]], ["pọ", "kọ", "bọ", "gbọ"], "Strict p minimal pairs are scarce, so this contrasts p with k, b and gb at one vowel and tone. Check the words, tones and chosen meanings."),
  set("cs-p-o-low", ["p"], "Compare p, k, b and g at the same vowel and tone. Yoruba p is said like kp, with the lips closed.", [["pọ̀", "be plenty"], ["kọ̀", "refuse"], ["bọ̀", "come back"], ["gọ̀", "be foolish"]], ["pọ", "kọ", "bọ", "gọ"], "Strict p minimal pairs are scarce, so this contrasts p with k, b and g at one vowel and tone. Check the words, tones and chosen meanings."),
  set("cs-s-sh-e-high", ["s-sh"], "Listen for s as in sun, then ṣ as in ship.", [["sé", "shut, block"], ["ṣé", "question word"]], ["se", "ṣe"], "The gloss for ṣé comes from the app's own lesson (Ṣé o fẹ́ jẹun?), not the Wiktionary page. Check both words and meanings."),
  set("cs-s-sh-ee-high", ["s-sh"], "Listen for s as in sun, then ṣ as in ship.", [["sẹ́", "sieve"], ["ṣẹ́", "break"]], ["sẹ", "ṣẹ"], "Check both words and the chosen meanings."),
  set("cs-s-sh-ee-low", ["s-sh"], "Listen for s as in sun, then ṣ as in ship.", [["sẹ̀", "condense"], ["ṣẹ̀", "sin"]], ["sẹ", "ṣẹ"], "Check both words and the chosen meanings."),
];
