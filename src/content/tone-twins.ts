import type { Confidence } from "./types";

// Real Yoruba words with the same letters as a vocab word and different tone marks.
// Text only: twins are shown as wrong choices in tone practice and need no audio.
// Every entry is needs-review until a native speaker checks it.

export type ToneTwin = {
  yoruba: string;
  english: string; // for the reviewer only, never rendered in the app
};

export type ToneTwinEntry = {
  vocabId: string;
  twins: ToneTwin[];
  source: string;
  confidence: Confidence;
  note?: string;
};

// Source for every entry below: the Yoruba section of the Wiktionary page for the
// spelling shown (en.wiktionary.org/wiki/<page>), read on 2026-10-19. Wiktionary is a
// community source, so each entry stays needs-review.
const entry = (vocabId: string, page: string, twins: [string, string][], note: string): ToneTwinEntry => ({
  vocabId,
  twins: twins.map(([yoruba, english]) => ({ yoruba, english })),
  source: `Wiktionary, Yoruba section of the page "${page}" (en.wiktionary.org/wiki/${page}), read 2026-10-19`,
  confidence: "needs-review",
  note,
});

export const TONE_TWINS: ToneTwinEntry[] = [
  entry("i-town-oko", "ọkọ", [["ọkọ", "husband"], ["ọkọ́", "hoe"], ["ọ̀kọ̀", "spear"]], "Check all four tones and meanings."),
  entry("gs-family-oko", "ọkọ", [["ọkọ̀", "vehicle"], ["ọkọ́", "hoe"], ["ọ̀kọ̀", "spear"]], "Check all four tones and meanings."),
  entry("gs-body-owo", "ọwọ", [["ọ̀wọ̀", "respect"], ["ọ̀wọ́", "series, group"]], "ọ̀wọ́ is a less common word; check it is worth keeping."),
  entry("m-virtues-owo", "ọwọ", [["ọwọ́", "hand"], ["ọ̀wọ́", "series, group"]], "ọ̀wọ́ is a less common word; check it is worth keeping."),
  entry("gs-body-eyin", "ẹyin", [["ẹyin", "egg"], ["ẹ̀yin", "you (emphatic plural)"], ["ẹyìn", "palm nut"]], "Check ẹyìn (palm nut) and the tone of ẹ̀yin."),
  entry("gs-food-eyin", "ẹyin", [["ẹ̀yìn", "back"], ["ẹ̀yin", "you (emphatic plural)"], ["ẹyìn", "palm nut"]], "Check ẹyìn (palm nut) and the tone of ẹ̀yin."),
  entry("i-nature-oorun", "oorun", [["òórùn", "smell"], ["oorun", "sleep"]], "The page lists the sun entry with a capital letter (Oòrùn). Check the vocab spelling oòrùn and all three tones."),
  entry("m-custom-ogun", "ogun", [["ogun", "war, battle"]], "ogún has two meanings with one spelling (inheritance, twenty). Check ogun (war) is all mid tone."),
  entry("gs-body-okan", "ọkan", [["ọ̀kan", "one"], ["ọkan", "a tree (Uapaca guineensis)"], ["ọkán", "kinkeliba, a shrub"]], "ọkan and ọkán are plant names; check they are worth keeping as choices."),
  entry("gs-numbers-okan", "ọkan", [["ọkàn", "heart"], ["ọkan", "a tree (Uapaca guineensis)"], ["ọkán", "kinkeliba, a shrub"]], "ọkan and ọkán are plant names; check they are worth keeping as choices."),
  entry("i-feelings-eru", "ẹru", [["ẹrù", "load, luggage"], ["ẹrú", "slave"], ["ẹ̀rú", "haft or handle of a tool"]], "Check ẹ̀rú (handle) is a word learners should meet."),
  entry("gs-family-iya", "iya", [["ìyà", "punishment, suffering"]], "Check tone of ìyà."),
  entry("i-nature-okun", "okun", [["okùn", "rope, string"], ["okun", "strength, power"]], "The page writes okun (strength) without tone marks. Check it is all mid tone."),
  entry("gs-food-ewa", "ẹwa", [["ẹwà", "beauty"], ["ẹ̀wá", "ten"]], "Check both tones."),
  entry("i-town-ilu", "ilu", [["ìlù", "drum"]], "Check tone of ìlù."),
  entry("i-town-ona", "ọna", [["ọnà", "art, craft"]], "A dialect form ọ̀ná (yesterday) is on the page and was left out."),
  entry("m-abstract-ogbon", "ọgbọn", [["ọgbọ̀n", "thirty"]], "An Ekiti word ọ̀gbọ́n (neighborhood) is on the page and was left out."),
  entry("b-time-ola", "ọla", [["ọlá", "honor, prestige"], ["ọlà", "wealth"]], "Check both tones; ọlá and ọlà overlap in meaning."),
  entry("b-time-ana", "ana", [["àna", "in-law"]], "The page also lists the spelling ànà for in-law in some dialects."),
  entry("a-health-iba", "iba", [["ìbà", "praise, homage"], ["ìbá", "would, ought to"], ["ibá", "a meeting, chance encounter"]], "Check all three tones."),
  entry("b-colors-awo", "awọ", [["awọ", "skin, hide"]], "A rarer word awọ̀ (idiomatic, the sun or moon) is on the page and was left out."),
  entry("b-clothing-bata", "bata", [["bàtá", "batá drum"]], "Check tones of bàtá."),
  entry("b-animals-aja", "aja", [["àjà", "ceiling, attic"]], "Check tone of àjà."),
  entry("i-nature-odo", "odo", [["odó", "pounding mortar"], ["òdo", "zero"], ["odo", "white yam"]], "The page writes odo (white yam) without tone marks. Check tones, and that òdo (zero) is current."),
  entry("i-nature-ojo", "ojo", [["ojo", "coward"]], "The page writes ojo without tone marks and gives a mid tone pronunciation. Check."),
  entry("i-verbs-mu", "mu", [["mú", "to take"], ["mù", "to be hidden"]], "Check both."),
  entry("i-verbs-wa", "wa", [["wà", "to be (located), to drive"], ["wa", "our"]], "Check both."),
  entry("a-verbs2-pe", "pe", [["pé", "to be complete or enough, that"]], "pé has several senses on the page; check this is a good twin of pè."),
  entry("i-verbs-ri", "ri", [["rì", "to sink"]], "Check tone of rì."),
  entry("m-proverbs-ko", "kọ", [["kọ", "to write"], ["kọ̀", "to refuse"]], "kọ́ also means to build and to hang; check the twins."),
  entry("m-proverbs-gbe", "gbe", [["gbè", "to support, favor"]], "Check tone of gbè."),
  entry("i-verbs-je", "jẹ", [["jẹ́", "to be"]], "jẹ́ also means to allow or answer; check."),
  entry("gs-body-ese", "ẹsẹ", [["ẹsẹ", "verse"]], "Check ẹsẹ (verse) is all mid tone."),
  entry("i-town-oja", "ọja", [["ọ̀já", "belt, sash"]], "A dialect form ọ̀jà (princess, Ekiti) is on the page and was left out."),
  entry("b-time-odun", "ọdun", [["ọ̀dùn", "a plant (Discoglypremna caloneura)"]], "ọ̀dùn is a plant name; check it is worth keeping as a choice."),
];
