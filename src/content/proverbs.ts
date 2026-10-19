import type { Confidence } from "./types";

// Proverbs (òwe) shown one at a time on the Proverbs page. The learner reads the
// Yoruba and its direct translation, then guesses the social meaning from three
// choices. Text only for now: no audio.
// Every entry is needs-review until a native speaker checks it.

export type Proverb = {
  id: string;
  yoruba: string;
  literal: string; // direct, word for word English translation
  meaning: string; // the social meaning
  usedWhen: string; // finishes "You would say this when ..." (lowercase start, ends with a period)
  wrong: [string, string]; // two plausible but wrong meanings
  source: string;
  confidence: Confidence;
  note?: string;
};

// Source for the Wiktionary entries: the Yoruba section of the page for the proverb
// (en.wiktionary.org/wiki/<page>), read on 2026-10-19. Wiktionary is a community source and
// gives the tone-marked wording plus a literal and a figurative sense; the "used when" line is
// the author's reading of the figurative sense. Every entry stays needs-review.
const wik = (
  id: string,
  page: string,
  yoruba: string,
  literal: string,
  meaning: string,
  usedWhen: string,
  wrong: [string, string],
  note: string,
): Proverb => ({
  id,
  yoruba,
  literal,
  meaning,
  usedWhen,
  wrong,
  source: `Wiktionary, "${page}" (Yoruba section), read 2026-10-19`,
  confidence: "needs-review",
  note: `${note} The "used when" line is the author's reading of Wiktionary's figurative sense.`,
});

export const PROVERBS: Proverb[] = [
  wik(
    "aaro-ki-i-gbona",
    "aaro ki i gbona kalẹ",
    "Ààrò kì í gbóná kalẹ́.",
    "The hearth does not stay hot until nighttime.",
    "Hard times do not last forever.",
    "someone is discouraged by a difficulty and needs to hear that it will pass.",
    ["Cooking should be finished before dark.", "A fire needs constant tending."],
    "Wiktionary also lists the alternative form àdìrò kì í gbóná kalẹ́. Confirm the tones.",
  ),
  wik(
    "aisi-nle-ekun",
    "aisi-nle ẹkun, aja n gbo",
    "Àìsí-ńlé ẹkùn, ajá ń gbó.",
    "In the leopard's absence from home, the dog barks.",
    "When the person in charge is away, others misbehave or grow bold.",
    "people start acting up as soon as the boss, parent or teacher leaves the room.",
    ["Dogs are braver than leopards.", "A guard should always stay at home."],
    "Wiktionary lists a variant, àìsí-ńlé ológbò, ilé dilé èkúté. Confirm the tones and the hyphen.",
  ),
  wik(
    "aja-ki-i-roro",
    "aja ki i roro ko ṣọ ojule meji",
    "Ajá kì í rorò kó ṣọ́ ojúlé méjì.",
    "A dog is never so fierce that it can guard two doorways.",
    "No one can serve two masters or give full attention to two demands at once.",
    "someone is trying to be loyal to two sides, or to do two big jobs at the same time.",
    ["Fierce dogs make the best guards.", "Two houses are safer than one."],
    "Confirm the tones, especially kó ṣọ́.",
  ),
  wik(
    "ajo-ki-i-dun",
    "ajo ki i dun konile ma rele",
    "Àjò kì í dùn kónílé má relé.",
    "A journey cannot be so good that the homeowner does not return home.",
    "However well things go away from home, a person should not forget where they come from.",
    "someone is enjoying life abroad and others remind them to remember home.",
    ["Travel is not worth the cost.", "A house is only a place to sleep."],
    "Wiktionary also gives àjò ò lè dùn kónílé má relé as an alternative form. Confirm the tones.",
  ),
  wik(
    "agbada-o-ba-gbona",
    "bi agbada o ba gbona, agbado o le ta",
    "Bí agbada ò bá gbóná, àgbàdo ò lè ta.",
    "If the pan is not hot, the corn will not pop.",
    "You cannot get a result without the effort or the cost it takes.",
    "someone wants a good outcome but does not want to pay or work for it.",
    ["Cook corn in a hot pan only on market days.", "Good things come to those who wait."],
    "Wiktionary lists two alternative forms (tí agbada ò bá gbóná... and bí agbada kò bá gbóná...). Confirm which wording speakers use.",
  ),
  wik(
    "ewe-ba-pe-lara-ose",
    "bi ewe ba pẹ lara ọṣẹ, a dọṣẹ",
    "Bí ewé bá pẹ́ lára ọṣẹ, á dọṣẹ.",
    "If a leaf stays on the soap long enough, it will become soap.",
    "People who spend a long time together begin to take on each other's ways.",
    "someone warns a friend about the company they keep, or notes how a person has changed.",
    ["Leaves wash clean when they touch soap.", "Soap should be kept away from plants."],
    "Wiktionary's literal sense says the leaf is wrapped around the soap. Confirm the tones.",
  ),
  wik(
    "majala-a-fo-wa-sile",
    "bi ina ba jo loko, majala a fo wa sile",
    "Bí iná bá jó lóko, màjàlà á fò wá sílé.",
    "When a fire burns in the field, the soot flies home.",
    "News of what happens far away always finds its way back home.",
    "someone thinks a deed done far from home will stay secret.",
    ["Fires on the farm should be put out quickly.", "Soot is the sign of a good cook."],
    "Wiktionary lists a second form ending ṣòfófó (the soot gossips). Confirm which form is standard and the tones.",
  ),
  wik(
    "epe-la-fi-n-wo-epe",
    "epe la fi n wo epe san",
    "Èpè la fi ń wo èpè sàn.",
    "Curses are what we use to cure curses.",
    "The remedy has to match the trouble. You answer like with like.",
    "someone argues that a hard problem needs an equally strong answer.",
    ["Never answer an insult.", "Words cannot hurt anyone."],
    "Wiktionary glosses this as fighting fire with fire. Confirm the tones.",
  ),
  wik(
    "ise-enia-nise-eranko",
    "iṣe eniyan niṣe ẹranko",
    "Ìṣe ènìyàn nìṣe ẹranko.",
    "The actions of humans are the actions of animals.",
    "People behave much as animals do, so watching animals teaches you about people.",
    "someone points to an animal's behaviour to explain how people act.",
    ["Humans and animals should never be kept together.", "Animals copy everything people do."],
    "Wiktionary lists several alternative spellings (ìṣe èèyàn nìṣe ẹranko, ìṣe ènìyàn ni ìṣe ẹranko). Confirm the standard form.",
  ),
  wik(
    "ka-rin-ka-po",
    "ka rin ka pọ, yiyẹ ni n yẹni",
    "Ká rìn ká pọ̀, yíyẹ ní ń yẹni.",
    "Let us walk together; being fitting is what suits a person.",
    "People look their best when they live and work together, not alone.",
    "someone is encouraging a group to stick together instead of going it alone.",
    ["Walking alone is faster.", "Travelling in a group is slower."],
    "Wiktionary's literal sense reads: traveling in the company of others shows people in a good light. The word-for-word line here is the author's, so confirm it.",
  ),
  wik(
    "omi-tuntun-ti-ru",
    "omi tuntun ti ru, ẹja tuntun ti wọ ọ",
    "Omi tuntun ti rú, ẹja tuntun ti wọ̀ ọ́.",
    "New water has stirred, new fish have entered it.",
    "Every era brings its own fashions and its own people.",
    "an older person comments that young people follow different trends from their own.",
    ["Fish cannot live in new water.", "Rivers should be left undisturbed."],
    "Wiktionary lists the alternative forms omi tuntun ti dé, ẹja tuntun ti wọ̀ ọ́ and omi titun dé, ẹja titun wọ̀ ọ́. Confirm the tones.",
  ),
  wik(
    "obe-to-dun",
    "ọbẹ to dun, owo lo pa a",
    "Ọbẹ̀ tó dùn, owó ló pa á.",
    "A delicious soup, it is money that killed it.",
    "Nothing good comes without money.",
    "someone complains about the cost of something good and is reminded that quality has a price.",
    ["Soup tastes best when it is shared.", "Money spoils good cooking."],
    "Wiktionary's literal sense reads: delicious soups are procured with money. The word-for-word line here is the author's, so confirm it. The verb pa (kill) is read here in its idiom of buying or procuring.",
  ),
  wik(
    "ona-kan-o-woja",
    "ọna kan o wọja",
    "Ọ̀nà kan ò wọjà.",
    "Only one road does not enter the market.",
    "There is more than one way to reach a goal.",
    "someone insists there is only one way to do something and another person offers a different one.",
    ["The market is best reached by the shortest road.", "Roads to the market are always crowded."],
    "Wiktionary lists the alternative form ọ̀nà kan ò wọ ọjà. Confirm the tones, and note that the English line follows Wiktionary's literal sense: it is not one road only that leads to the market.",
  ),
  wik(
    "sago-n-bugo",
    "ṣago n bugo",
    "Ṣágo ń búgò.",
    "The demijohn insults the bottle.",
    "Someone with the same fault is criticising another for it.",
    "a person who is guilty of something scolds someone else for the same thing.",
    ["Large things should respect small things.", "Bottles are worth more than demijohns."],
    "Wiktionary glosses this as pot calling the kettle black. Confirm the tones.",
  ),
  {
    id: "omo-ti-a-ko-ko-proverb",
    yoruba: "Ọmọ tí a kò kọ́ ni yóò gbé ilé tí a kọ́ tà.",
    literal: "The child we did not teach is the one who will carry the house we built and sell it.",
    meaning: "A child who is not raised and taught well will waste what their parents worked to build.",
    usedWhen: "someone says parents must pass on character along with property.",
    wrong: ["Children should sell the house their parents built.", "Teaching a child costs more than building a house."],
    source:
      "Afolayan, \"Ọmọ Tí A Kò Kọ́: Globalization and Cultural Education among New Generation Nigerian Yorùbá\", Yoruba Studies Review 3(1), 2021, quoted in lesson Mastery 4; translated \"the child that is not taught will eventually sell the house that is built\"",
    confidence: "needs-review",
    note: "Very high doubt: wording found in one source only, so confirm every tone. The social meaning is the author's reading of that translation. The proverb plays on kọ́ (teach) and kọ́ (build). The literal line is the author's.",
  },
  {
    id: "oni-la-ri",
    yoruba: "Òní l'a rí, ọba òkè l'ó rọ́la.",
    literal: "Today is what we see; the king above is the one who sees tomorrow.",
    meaning: "Only God knows what tomorrow brings, so no one can be sure of the future.",
    usedWhen: "someone makes confident plans for tomorrow, or a person is reminded to stay humble about the future.",
    wrong: ["Wealth should be saved for tomorrow.", "Kings can tell what the future holds."],
    source:
      "Wiktionary, \"oni\" (Yoruba section), quoting Awoyale, Global Yoruba Lexical Database v. 1.0 (Linguistic Data Consortium, 2008), translated \"It is [only] today that we see, [only] the Most High sees tomorrow\" and called a proverb on divine supremacy; quoted in lesson Mastery 4",
    confidence: "needs-review",
    note: "Very high doubt: one source. Confirm the wording, the apostrophe spelling (l' read as ni) and the tones. The social meaning follows the source's 'divine supremacy' label; the literal line and the used-when line are the author's.",
  },
];
