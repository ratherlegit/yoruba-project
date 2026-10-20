import type { Confidence } from "./types";

// Numbers section content. Number words are copied from sources, never computed:
// they have contractions and tone shifts. `build` shows how a number is made from
// the base-20 system and is only checked for arithmetic by the validator.
// Every entry is needs-review until a native speaker checks it.

export type NumberEntry = {
  id: string;
  value: number;
  yoruba: string; // the counting form
  after: string[]; // forms used after a noun (méjì, mẹ́ta); empty when none
  answers: string[]; // every accepted counting form, yoruba first
  build: string; // arithmetic such as "20-5"; "" when the number is a base word
  step: 1 | 2 | 3 | 4;
  example?: { yoruba: string; english: string };
  source: string;
  confidence: Confidence;
  note?: string;
};

export type NumberPhrase = {
  id: string;
  step: 5 | 6;
  prompt: string; // the English, for example "two children"
  numeral: string; // digits as a string, or "" when not a price or count to read back
  answers: string[];
  source: string;
  confidence: Confidence;
  note?: string;
};

export type NumberStep = { id: string; title: string; rule: string; entryIds: string[]; phraseIds: string[] };

// Evaluates a build expression: digits, + - * x × and parentheses. No eval.
export function evalBuild(expr: string): number | null {
  if (/[0-9]\s+[0-9]/.test(expr)) return null;
  const src = expr.replace(/\s+/g, "").replace(/[x×]/g, "*");
  if (!src || !/^[0-9+\-*()]+$/.test(src)) return null;
  let i = 0;
  const peek = () => src[i];
  function number(): number | null {
    let j = i;
    while (j < src.length && /[0-9]/.test(src[j]!)) j++;
    if (j === i) return null;
    const n = Number(src.slice(i, j));
    i = j;
    return n;
  }
  function atom(): number | null {
    if (peek() === "(") {
      i++;
      const v = sum();
      if (v === null || peek() !== ")") return null;
      i++;
      return v;
    }
    return number();
  }
  function product(): number | null {
    let v = atom();
    while (v !== null && peek() === "*") {
      i++;
      const r = atom();
      v = r === null ? null : v * r;
    }
    return v;
  }
  function sum(): number | null {
    let v = product();
    while (v !== null && (peek() === "+" || peek() === "-")) {
      const op = src[i++];
      const r = product();
      v = r === null ? null : op === "+" ? v + r : v - r;
    }
    return v;
  }
  const v = sum();
  return v !== null && i === src.length ? v : null;
}

const entry = (
  value: number, yoruba: string, answers: string[], after: string[], build: string, step: 1 | 2 | 3 | 4,
  source: string, note: string, extra: { example?: { yoruba: string; english: string } } = {},
): NumberEntry => ({
  id: `num-${value}`, value, yoruba, after, answers, build, step, source, confidence: "needs-review", note, ...extra,
});

const phrase = (
  id: string, step: 5 | 6, prompt: string, numeral: string, answers: string[], source: string, note: string,
): NumberPhrase => ({ id, step, prompt, numeral, answers, source, confidence: "needs-review", note });

// Entries follow the Wikipedia numeral table and are kept only when a second source agrees.
// 300 (ọ̀ọ́dúrún) and ení for one were left out: nothing second confirmed them.
export const NUMBERS: NumberEntry[] = [
  entry(1, "ọ̀kan", ["ọ̀kan"], ["kan"], "", 1, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); the example sentences were drafted by the model", "Tones from Wikipedia and Wiktionary; the forms after a noun are from Wiktionary's adjective entries. Wiktionary lists ọ̀kan (one) and kan after a noun. Sentence drafted by the model, not found written out; confirm it reads naturally. Confirm ṣoṣo (only) reads naturally in Imú kan ṣoṣo ni mo ní.", { example: { yoruba: "Imú kan ṣoṣo ni mo ní.", english: "I have only one nose." } }),
  entry(2, "èjì", ["èjì"], ["méjì"], "", 1, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); the example sentences were drafted by the model", "Tones from Wikipedia and Wiktionary; the forms after a noun are from Wiktionary's adjective entries. Sentence drafted by the model, not found written out; confirm it reads naturally.", { example: { yoruba: "Mo ní ojú méjì.", english: "I have two eyes." } }),
  entry(3, "ẹ̀ta", ["ẹ̀ta"], ["mẹ́ta"], "", 1, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); the example sentences were drafted by the model", "Tones from Wikipedia and Wiktionary; the forms after a noun are from Wiktionary's adjective entries. Sentence drafted by the model, not found written out; confirm it reads naturally. Confirm àti (and) plus jẹ́ is a natural way to say a sum to a learner.", { example: { yoruba: "Méjì àti ọ̀kan jẹ́ mẹ́ta.", english: "Two and one make three." } }),
  entry(4, "ẹ̀rin", ["ẹ̀rin"], ["mẹ́rin"], "", 1, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); the example sentences were drafted by the model", "Tones from Wikipedia and Wiktionary; the forms after a noun are from Wiktionary's adjective entries. Sentence drafted by the model, not found written out; confirm it reads naturally. The animal word ajá is the model's own knowledge.", { example: { yoruba: "Ajá ní ẹsẹ̀ mẹ́rin.", english: "A dog has four legs." } }),
  entry(5, "àrún", ["àrún"], ["márùn-ún"], "", 1, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); the example sentences were drafted by the model", "Tones from Wikipedia and Wiktionary; the forms after a noun are from Wiktionary's adjective entries. Sentence drafted by the model, not found written out; confirm it reads naturally.", { example: { yoruba: "Ọwọ́ kan ní ìka márùn-ún.", english: "One hand has five fingers." } }),
  entry(6, "ẹ̀fà", ["ẹ̀fà"], ["mẹ́fà"], "", 1, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); the example sentences were drafted by the model", "Tones from Wikipedia and Wiktionary; the forms after a noun are from Wiktionary's adjective entries. Sentence drafted by the model, not found written out; confirm it reads naturally. Confirm the tones of èèrà (ant).", { example: { yoruba: "Èèrà ní ẹsẹ̀ mẹ́fà.", english: "An ant has six legs." } }),
  entry(7, "èje", ["èje"], ["méje", "mẹ́je"], "", 1, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); the example sentences were drafted by the model", "Tones from Wikipedia and Wiktionary; the forms after a noun are from Wiktionary's adjective entries. Wiktionary labels èje as an Ekiti form of seven. Wikipedia and the vocab sentence use èje and méje. Sentence drafted by the model, not found written out; confirm it reads naturally. Confirm the tones of ọ̀sẹ̀ (week).", { example: { yoruba: "Ọ̀sẹ̀ kan ní ọjọ́ méje.", english: "A week has seven days." } }),
  entry(8, "ẹ̀jọ", ["ẹ̀jọ"], ["mẹ́jọ"], "", 1, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); the example sentences were drafted by the model", "Tones from Wikipedia and Wiktionary; the forms after a noun are from Wiktionary's adjective entries. Sentence drafted by the model, not found written out; confirm it reads naturally. Confirm the spelling and tones of aláǹtakùn (spider).", { example: { yoruba: "Aláǹtakùn ní ẹsẹ̀ mẹ́jọ.", english: "A spider has eight legs." } }),
  entry(9, "ẹ̀sán", ["ẹ̀sán"], ["mẹ́sàn-án"], "", 1, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); the example sentences were drafted by the model", "Tones from Wikipedia and Wiktionary; the forms after a noun are from Wiktionary's adjective entries. Sentence drafted by the model, not found written out; confirm it reads naturally.", { example: { yoruba: "Mẹ́rin àti márùn-ún jẹ́ mẹ́sàn-án.", english: "Four and five make nine." } }),
  entry(10, "ẹ̀wá", ["ẹ̀wá"], ["mẹ́wàá"], "", 1, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); the example sentences were drafted by the model", "Tones from Wikipedia and Wiktionary; the forms after a noun are from Wiktionary's adjective entries. Sentence drafted by the model, not found written out; confirm it reads naturally.", { example: { yoruba: "Ọwọ́ méjì ní ìka mẹ́wàá.", english: "Two hands have ten fingers." } }),
  entry(11, "ọ̀kanlá", ["ọ̀kanlá", "oókànlá"], [], "10+1", 2, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "Chan writes the object form as oókàn làá. Confirm which spelling learners should see."),
  entry(12, "èjìlá", ["èjìlá", "eéjìlá"], [], "10+2", 2, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "Confirm the object form eéjìlá."),
  entry(13, "ẹ̀tàlá", ["ẹ̀tàlá", "ẹẹ́tàlá"], [], "10+3", 2, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "Confirm the object form ẹẹ́tàlá."),
  entry(14, "ẹ̀rìnlá", ["ẹ̀rìnlá", "ẹẹ́rìnlá"], [], "10+4", 2, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "Confirm the object form ẹẹ́rìnlá."),
  entry(15, "ẹ̀ẹ́dógún", ["ẹ̀ẹ́dógún"], [], "20-5", 2, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "A contraction of five from twenty. Confirm the tones."),
  entry(16, "ẹ̀rìndínlógún", ["ẹ̀rìndínlógún", "ẹẹ́rìndínlógún"], [], "20-4", 2, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "Wiktionary notes ẹ̀rìndínlógún is also a divination system name; here it is only the number."),
  entry(17, "ẹ̀tàdínlógún", ["ẹ̀tàdínlógún", "ẹẹ́tàdínlógún"], [], "20-3", 2, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "Confirm the tones."),
  entry(18, "èjìdínlógún", ["èjìdínlógún", "eéjìdínlógún"], [], "20-2", 2, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "Confirm the tones."),
  entry(19, "ọ̀kàndínlógún", ["ọ̀kàndínlógún", "oókàndínlógún"], [], "20-1", 2, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "Confirm the tones."),
  entry(20, "ogún", ["ogún", "okòó"], [], "", 2, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "ogún also means inheritance (a Mastery vocab word) and ogun means war. okòó is the form for counting objects (Wikipedia)."),
  entry(25, "ẹ̀ẹ́dọ́gbọ̀n", ["ẹ̀ẹ́dọ́gbọ̀n", "àrúnlélógún"], [], "30-5", 3, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998; Preply, \"Numbers in Yoruba\" (the 1 to 100 lists)", "Thirty minus five. Chan spells it ẹ̀ẹ́dọ̀ọ́gbọ̀ǹ. Preply gives the additive àrúnlélógún (twenty and five), which Wikipedia says is a more recent additive form for the fives. Confirm both."),
  entry(30, "ọgbọ̀n", ["ọgbọ̀n"], [], "", 3, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "A base word. Differs from ọgbọ́n (wisdom) only in tone; Wikipedia also lists ọgbọ̀n ǒ for counting objects, left out here."),
  entry(35, "aárùn-ún-dínlógójì", ["aárùn-ún-dínlógójì", "aárùndínlógójì"], [], "40-5", 3, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); University at Buffalo, \"Yoruba Numerals\" page (math.buffalo.edu)", "Forty minus five. Buffalo gives the unmarked aarundinlogoji (no -ún-), accepted here as aárùndínlógójì with tones assumed from Wikipedia's form. Confirm the tones and which spelling is standard."),
  entry(40, "ogójì", ["ogójì"], [], "20*2", 3, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists)", "Two twenties. Chan gives a variant, ọgbọ̀ji. Confirm which is standard."),
  entry(50, "àádọ́ta", ["àádọ́ta"], [], "20*3-10", 3, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "Three twenties minus ten. Confirm the tones."),
  entry(60, "ọgọ́ta", ["ọgọ́ta"], [], "20*3", 3, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "Three twenties. Confirm the tones."),
  entry(70, "àádọ́rin", ["àádọ́rin"], [], "20*4-10", 3, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "Four twenties minus ten. Confirm the tones."),
  entry(80, "ọgọ́rin", ["ọgọ́rin"], [], "20*4", 3, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998; University at Buffalo, \"Yoruba Numerals\" page (math.buffalo.edu)", "Four twenties. Buffalo writes ogerin. Confirm the tones."),
  entry(90, "àádọ́rùn-ún", ["àádọ́rùn-ún"], [], "20*5-10", 3, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "Five twenties minus ten. Chan writes àádọ́rùń. Confirm the tones."),
  entry(100, "ọgọ́rùn-ún", ["ọgọ́rùn-ún", "ọrún"], [], "20*5", 3, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Preply, \"Numbers in Yoruba\" (the 1 to 100 lists); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "Five twenties. ọrún is a shortened form (Wikipedia, Chan, Wiktionary). Confirm the tones."),
  entry(200, "igba", ["igba", "igbéo"], [], "20*10", 4, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998; University at Buffalo, \"Yoruba Numerals\" page (math.buffalo.edu)", "Ten twenties, the next base. igba also means calabash. igbéo is the object-counting form (Wikipedia). Confirm."),
  entry(400, "irinwó", ["irinwó"], [], "", 4, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998; University at Buffalo, \"Yoruba Numerals\" page (math.buffalo.edu)", "A base word with no build shown. Confirm the tones."),
  entry(500, "ọ̀ọ́dẹ́gbẹ̀ta", ["ọ̀ọ́dẹ́gbẹ̀ta", "ẹ̀ẹ́dẹ́gbẹ̀ta"], [], "200*3-100", 4, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Omniglot, \"Yoruba numbers\" (read through search excerpts; the page itself blocked direct download)", "Three times two hundred minus one hundred. Only Wikipedia and Omniglot (via search excerpts) give it. Confirm the tones and which variant is standard."),
  entry(600, "ẹgbẹ̀ta", ["ẹgbẹ̀ta"], [], "200*3", 4, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Omniglot, \"Yoruba numbers\" (read through search excerpts; the page itself blocked direct download)", "Three times two hundred. Only Wikipedia and Omniglot (via search excerpts) give it. Confirm the tones."),
  entry(700, "ọ̀ọ́dẹ́gbẹ̀rin", ["ọ̀ọ́dẹ́gbẹ̀rin", "ẹ̀ẹ́dẹ́gbẹ̀rin"], [], "200*4-100", 4, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Omniglot, \"Yoruba numbers\" (read through search excerpts; the page itself blocked direct download)", "Four times two hundred minus one hundred. Only Wikipedia and Omniglot (via search excerpts) give it. Confirm the tones."),
  entry(800, "ẹgbẹ̀rin", ["ẹgbẹ̀rin"], [], "200*4", 4, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Omniglot, \"Yoruba numbers\" (read through search excerpts; the page itself blocked direct download); WALS example igt-2450 (ẹgbẹ̀rin as 200 times 4)", "Four times two hundred. Confirm the tones."),
  entry(900, "ẹ̀ẹ́dẹ́gbẹ̀rún", ["ẹ̀ẹ́dẹ́gbẹ̀rún"], [], "200*5-100", 4, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Omniglot, \"Yoruba numbers\" (read through search excerpts; the page itself blocked direct download)", "Five times two hundred minus one hundred. Only Wikipedia and Omniglot (via search excerpts) give it. Confirm the tones."),
  entry(1000, "ẹgbẹ̀rún", ["ẹgbẹ̀rún"], [], "200*5", 4, "Wikipedia, \"Yoruba numerals\" (the numeral table, citing Lounge 2009; the article is flagged \"more citations needed\"); Wiktionary, the Yoruba numeral entries for the words (and the adjective entries for the forms after a noun); Eugene S. L. Chan, \"Yoruba\" numerals page (lingweb.eva.mpg.de/channumerals), data from Armstrong 1962, \"Yoruba Numerals\", supplied by Dr Ethelbert Kari in 1998", "Five times two hundred. Confirm the tones."),
];

export const PHRASES: NumberPhrase[] = [
  phrase("count-one-child", 5, "one child", "", ["ọmọ kan"], "Taught in the vocab topics (the nouns) and Wiktionary's adjective entries (the number forms after a noun)", "The number kan after ọmọ. The pairing is the model's own composition."),
  phrase("count-two-children", 5, "two children", "", ["ọmọ méjì"], "Taught in the vocab topics (the nouns) and Wiktionary's adjective entries (the number forms after a noun)", "The pairing is the model's own composition; the vocab blurb used ọmọ méjì as its example."),
  phrase("count-three-dogs", 5, "three dogs", "", ["ajá mẹ́ta"], "Taught in the vocab topics (the nouns) and Wiktionary's adjective entries (the number forms after a noun)", "The pairing is the model's own composition."),
  phrase("count-four-legs", 5, "four legs", "", ["ẹsẹ̀ mẹ́rin"], "Taught in the vocab topics (the nouns) and Wiktionary's adjective entries (the number forms after a noun)", "From the vocab sentence Ajá ní ẹsẹ̀ mẹ́rin."),
  phrase("count-five-fingers", 5, "five fingers", "", ["ìka márùn-ún"], "Taught in the vocab topics (the nouns) and Wiktionary's adjective entries (the number forms after a noun)", "From the vocab sentence Ọwọ́ kan ní ìka márùn-ún."),
  phrase("count-six-legs", 5, "six legs", "", ["ẹsẹ̀ mẹ́fà"], "Taught in the vocab topics (the nouns) and Wiktionary's adjective entries (the number forms after a noun)", "From the vocab sentence Èèrà ní ẹsẹ̀ mẹ́fà."),
  phrase("count-seven-days", 5, "seven days", "", ["ọjọ́ méje", "ọjọ́ mẹ́je"], "Taught in the vocab topics (the nouns) and Wiktionary's adjective entries (the number forms after a noun)", "From the vocab sentence Ọ̀sẹ̀ kan ní ọjọ́ méje."),
  phrase("count-ten-fingers", 5, "ten fingers", "", ["ìka mẹ́wàá"], "Taught in the vocab topics (the nouns) and Wiktionary's adjective entries (the number forms after a noun)", "From the vocab sentence Ọwọ́ méjì ní ìka mẹ́wàá."),
  phrase("price-50", 6, "fifty naira", "50", ["àádọ́ta náírà"], "Wiktionary and Wikipedia for the number words; the vocab topic Market and money for the náírà sentences", "Number before náírà, as in the vocab sentence with ọgọ́rùn-ún náírà. Confirm the order."),
  phrase("price-100", 6, "one hundred naira", "100", ["ọgọ́rùn-ún náírà", "ọrún náírà"], "Wiktionary and Wikipedia for the number words; the vocab topic Market and money for the náírà sentences", "From a vocab sentence in Market and money. Confirm the order."),
  phrase("price-200", 6, "two hundred naira", "200", ["igba náírà", "igbéo náírà"], "Wiktionary and Wikipedia for the number words; the vocab topic Market and money for the náírà sentences", "From a vocab sentence in Market and money. Confirm the order."),
  phrase("price-400", 6, "four hundred naira", "400", ["irinwó náírà"], "Wiktionary and Wikipedia for the number words; the vocab topic Market and money for the náírà sentences", "Built from the table and the same order. Confirm."),
  phrase("price-500", 6, "five hundred naira", "500", ["ọ̀ọ́dẹ́gbẹ̀ta náírà", "ẹ̀ẹ́dẹ́gbẹ̀ta náírà"], "Wiktionary and Wikipedia for the number words; the vocab topic Market and money for the náírà sentences", "Built from the table and the same order. Confirm the variant."),
  phrase("price-1000", 6, "one thousand naira", "1000", ["ẹgbẹ̀rún náírà"], "Wiktionary and Wikipedia for the number words; the vocab topic Market and money for the náírà sentences", "Built from the table and the same order. Confirm."),
];

export const NUMBER_STEPS: NumberStep[] = [
  { id: "one-to-ten", title: "One to ten", rule: "Counting from one to ten uses one set of words (ọ̀kan, èjì, ẹ̀ta). When you count things, the number goes after the noun and takes a different form: ọmọ méjì, two children.", entryIds: ["num-1", "num-2", "num-3", "num-4", "num-5", "num-6", "num-7", "num-8", "num-9", "num-10"], phraseIds: [] },
  { id: "eleven-to-twenty", title: "Eleven to twenty", rule: "Eleven to fourteen add to ten: ọ̀kanlá is ten and one (lá comes from lé ẹ̀wá, and ten). From fifteen the count turns around and subtracts from twenty: ẹ̀ẹ́dógún is twenty minus five.", entryIds: ["num-11", "num-12", "num-13", "num-14", "num-15", "num-16", "num-17", "num-18", "num-19", "num-20"], phraseIds: [] },
  { id: "tens-and-twenties", title: "Tens and twenties", rule: "Twenty (ogún) is the base. Forty is two twenties and sixty is three. The numbers in between lean on subtraction: fifty is three twenties minus ten, and twenty-five is thirty minus five.", entryIds: ["num-25", "num-30", "num-35", "num-40", "num-50", "num-60", "num-70", "num-80", "num-90", "num-100"], phraseIds: [] },
  { id: "hundreds", title: "Hundreds and thousands", rule: "Two hundred (igba) is the next base: ten twenties. The hundreds are built on it, and some subtract from it: five hundred is three times two hundred minus one hundred.", entryIds: ["num-200", "num-400", "num-500", "num-600", "num-700", "num-800", "num-900", "num-1000"], phraseIds: [] },
  { id: "counting-things", title: "Counting things", rule: "The number goes after the noun: ọmọ méjì, two children. One is kan: ọmọ kan.", entryIds: [], phraseIds: ["count-one-child", "count-two-children", "count-three-dogs", "count-four-legs", "count-five-fingers", "count-six-legs", "count-seven-days", "count-ten-fingers"] },
  { id: "money", title: "Money", rule: "Prices put the amount before náírà: ọgọ́rùn-ún náírà is a hundred naira.", entryIds: [], phraseIds: ["price-50", "price-100", "price-200", "price-400", "price-500", "price-1000"] },
];
