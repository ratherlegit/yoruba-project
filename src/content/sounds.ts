import type { Confidence } from "./types";

// Sources consulted: standard Yoruba orthography and phonology references
// (Bamgbose, "A Grammar of Yoruba"; Rowlands, "Yoruba"; Abraham, "Dictionary of Modern Yoruba").
// English comparisons are approximations. Every entry is needs-review until a native speaker checks it.

export type SoundExample = { yoruba: string; english: string };
export type SoundSection = "vowels" | "consonants";

export type Sound = {
  id: string;
  section: SoundSection;
  letter: string;
  compare: string;
  examples: SoundExample[];
  confidence: Confidence;
  note?: string;
};

export type MinimalPair = {
  id: string;
  contrast: "tone" | "sound";
  explain: string;
  words: SoundExample[];
  confidence: Confidence;
  note?: string;
};

const ex = (yoruba: string, english: string): SoundExample => ({ yoruba, english });
const s = (
  id: string, section: SoundSection, letter: string, compare: string, examples: SoundExample[], note: string,
): Sound => ({ id, section, letter, compare, examples, confidence: "needs-review", note });

export const SOUNDS: Sound[] = [
  // Oral vowels
  s("v-a", "vowels", "a", "like 'a' in 'father'", [ex("àga", "chair"), ex("ajá", "dog"), ex("àná", "yesterday")], "English comparison approximate."),
  s("v-e", "vowels", "e", "like 'e' in 'they'", [ex("erin", "elephant"), ex("ejò", "snake"), ex("etí", "ear")], "Check the comparison; Yoruba e is a pure vowel."),
  s("v-ee", "vowels", "ẹ", "like 'e' in 'bed'", [ex("ẹja", "fish"), ex("ẹran", "meat"), ex("ẹyin", "egg")], "English comparison approximate."),
  s("v-i", "vowels", "i", "like 'ee' in 'see', shorter", [ex("ilé", "house"), ex("irun", "hair"), ex("ikùn", "stomach")], "English comparison approximate."),
  s("v-o", "vowels", "o", "like 'o' in 'go', without the glide", [ex("omi", "water"), ex("orí", "head"), ex("ojú", "eye")], "Check the comparison; Yoruba o is a pure vowel."),
  s("v-oo", "vowels", "ọ", "like 'aw' in 'saw'", [ex("ọmọ", "child"), ex("ọkọ", "husband"), ex("ọwọ́", "hand")], "English comparison approximate (varies by accent)."),
  s("v-u", "vowels", "u", "like 'oo' in 'moon', shorter", [ex("iṣu", "yam"), ex("ẹnu", "mouth"), ex("ìlú", "town")], "English comparison approximate."),
  // Nasal vowels
  s("n-an", "vowels", "an", "a nasal 'a', like the vowel in French 'blanc'", [ex("ọkàn", "heart"), ex("ẹran", "meat")], "Nasal vowel; check example words and the French comparison. In Standard Yoruba an is often said like ọn, so the French comparison is approximate."),
  s("n-en", "vowels", "ẹn", "a nasal 'ẹ', like the vowel in French 'vin'", [ex("ìyẹn", "that one"), ex("yẹn", "that, as in ilé yẹn")], "Rare and debated nasal vowel; example words are my least certain, a native speaker must confirm or replace them."),
  s("n-in", "vowels", "in", "a nasal 'i', like English 'ee' said through the nose", [ex("erin", "elephant"), ex("mẹ́rin", "four")], "Check comparison and example words."),
  s("n-un", "vowels", "un", "a nasal 'u', like English 'oo' said through the nose", [ex("irun", "hair"), ex("ikùn", "stomach")], "Check comparison and example words."),
  s("n-on", "vowels", "ọn", "a nasal 'ọ', like the vowel in French 'bon'", [ex("ẹ̀gbọ́n", "older sibling"), ex("ìbọn", "gun")], "Check comparison and example words."),
  // Consonants
  s("c-b", "consonants", "b", "like 'b' in 'bat'", [ex("bàbá", "father"), ex("bàtà", "shoe"), ex("ọ̀bọ", "monkey")], "Plain consonant."),
  s("c-d", "consonants", "d", "like 'd' in 'dog'", [ex("dúdú", "black"), ex("adìyẹ", "chicken"), ex("ọdún", "year")], "Plain consonant."),
  s("c-f", "consonants", "f", "like 'f' in 'fun'", [ex("funfun", "white"), ex("fìlà", "cap"), ex("fèrèsé", "window")], "Plain consonant."),
  s("c-g", "consonants", "g", "like 'g' in 'go'", [ex("gèlè", "head wrap"), ex("àga", "chair")], "Plain consonant."),
  s("c-gb", "consonants", "gb", "one sound made by saying 'g' and 'b' together, lips closed", [ex("agbádá", "agbada robe"), ex("ẹ̀gbọ́n", "older sibling"), ex("ológbò", "cat")], "Single sound, not g then b. Check the description and examples."),
  s("c-h", "consonants", "h", "like 'h' in 'hat'", [ex("ahọ́n", "tongue"), ex("ihò", "hole")], "Check example words; h is not common."),
  s("c-j", "consonants", "j", "like 'j' in 'jam'", [ex("ejò", "snake"), ex("ọjọ́", "day")], "Plain consonant."),
  s("c-k", "consonants", "k", "like 'k' in 'kit'", [ex("kọ́kọ́rọ́", "key"), ex("ikùn", "stomach"), ex("ọkọ", "husband")], "Plain consonant."),
  s("c-l", "consonants", "l", "like 'l' in 'lamp'", [ex("ilé", "house"), ex("ọ̀la", "tomorrow"), ex("alẹ́", "night")], "Plain consonant."),
  s("c-m", "consonants", "m", "like 'm' in 'man'", [ex("omi", "water"), ex("méjì", "two"), ex("ọmọ", "child")], "Plain consonant."),
  s("c-n", "consonants", "n", "like 'n' in 'net'", [ex("ẹnu", "mouth"), ex("òní", "today"), ex("àná", "yesterday")], "Plain consonant."),
  s("c-p", "consonants", "p", "written p but said like 'kp': 'k' and 'p' together, lips closed", [ex("pupa", "red"), ex("àpò", "bag")], "Yoruba p is a kp sound; check description and examples."),
  s("c-r", "consonants", "r", "a quick tap of the tongue, like the 'tt' in American 'butter'", [ex("erin", "elephant"), ex("ọ̀rẹ́", "friend")], "English comparison approximate."),
  s("c-s", "consonants", "s", "like 's' in 'sun'", [ex("sùn", "sleep"), ex("èso", "fruit"), ex("ọ̀sẹ̀", "week")], "Plain consonant."),
  s("c-sh", "consonants", "ṣ", "like 'sh' in 'ship'", [ex("aṣọ", "cloth"), ex("ṣòkòtò", "trousers"), ex("iṣu", "yam")], "Check; do not confuse with s."),
  s("c-t", "consonants", "t", "like 't' in 'top'", [ex("tábìlì", "table"), ex("etí", "ear"), ex("mẹ́ta", "three")], "Plain consonant."),
  s("c-w", "consonants", "w", "like 'w' in 'water'", [ex("ọwọ́", "hand"), ex("ẹ̀wù", "garment"), ex("wàrà", "milk")], "Plain consonant."),
  s("c-y", "consonants", "y", "like 'y' in 'yes'", [ex("ẹyin", "egg"), ex("yàrá", "room"), ex("ìyá", "mother")], "Plain consonant."),
];

const pair = (
  id: string, contrast: "tone" | "sound", explain: string, words: SoundExample[], note: string,
): MinimalPair => ({ id, contrast, explain, words, confidence: "needs-review", note });

export const MINIMAL_PAIRS: MinimalPair[] = [
  pair("p-oko-tone", "tone", "Same letters, three tones, three meanings.", [ex("ọkọ", "husband"), ex("ọkọ̀", "vehicle"), ex("ọkọ́", "hoe")], "Check all three meanings and tones."),
  pair("p-igba-tone", "tone", "Same letters, three tones, three meanings.", [ex("igba", "two hundred"), ex("ìgbà", "time"), ex("igbá", "calabash")], "Native speaker to check the tones of all three words (igba, ìgbà, igbá) and their meanings."),
  pair("p-eyin-tone", "tone", "Same letters, different tones and vowel marks.", [ex("ẹyin", "egg"), ex("eyín", "tooth"), ex("ẹ̀yìn", "back")], "eyín tone is a known doubt."),
  pair("p-apa-tone", "tone", "Only the tone changes.", [ex("apá", "arm"), ex("àpá", "scar")], "Check meanings and tones."),
  pair("p-oko-sound", "sound", "o and ọ are different vowels.", [ex("oko", "farm"), ex("ọkọ", "husband")], "Check meanings."),
  pair("p-owo-sound", "sound", "o and ọ are different vowels.", [ex("owó", "money"), ex("ọwọ́", "hand")], "Check meanings and tones."),
  pair("p-ose-sound", "sound", "s and ṣ are different sounds (tones differ too).", [ex("ọ̀sẹ̀", "week"), ex("ọṣẹ", "soap")], "Tones also differ, so not a pure sound pair; check."),
];

export const soundsBySection = (section: SoundSection): Sound[] => SOUNDS.filter((x) => x.section === section);
