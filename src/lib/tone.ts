import type { Tone } from "@/content/types";

const ACUTE = "\u0301";
const GRAVE = "\u0300";
const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const isMark = (c: string | undefined): boolean => !!c && /[\u0300-\u036f]/.test(c);

type Letter = { base: string; text: string; tone: Tone };

function letters(word: string): Letter[] {
  const chars = Array.from(word.normalize("NFD"));
  const out: Letter[] = [];
  let i = 0;
  while (i < chars.length) {
    const first = chars[i]!;
    let base = first.toLowerCase();
    let text = first;
    i++;
    if (base === "g" && chars[i]?.toLowerCase() === "b") {
      base = "gb";
      text += chars[i]!;
      i++;
    }
    let tone: Tone = "mid";
    while (isMark(chars[i])) {
      const mark = chars[i]!;
      const next: Tone | null = mark === ACUTE ? "high" : mark === GRAVE ? "low" : null;
      if (next) {
        if (tone !== "mid" && tone !== next) throw new Error(`Conflicting tone marks in "${word}"`);
        tone = next;
      }
      text += mark;
      i++;
    }
    out.push({ base, text, tone });
  }
  return out;
}

const isVowel = (l: Letter | undefined): boolean => !!l && VOWELS.has(l.base);
const isNasalCoda = (n: Letter | undefined, after: Letter | undefined): boolean =>
  !!n && n.base === "n" && n.tone === "mid" && !isVowel(after);

export function syllabify(word: string): string[] {
  const ls = letters(word);
  const out: string[] = [];
  let i = 0;
  while (i < ls.length) {
    const l = ls[i]!;
    if (isVowel(l)) {
      let s = l.text;
      i++;
      if (isNasalCoda(ls[i], ls[i + 1])) {
        s += ls[i]!.text;
        i++;
      }
      out.push(s);
    } else if ((l.base === "n" || l.base === "m") && (l.tone !== "mid" || !isVowel(ls[i + 1]))) {
      out.push(l.text);
      i++;
    } else if (isVowel(ls[i + 1])) {
      let s = l.text + ls[i + 1]!.text;
      i += 2;
      if (isNasalCoda(ls[i], ls[i + 1])) {
        s += ls[i]!.text;
        i++;
      }
      out.push(s);
    } else {
      throw new Error(`Cannot syllabify "${word}" at "${l.text}"`);
    }
  }
  return out.map((s) => s.normalize("NFC"));
}

export function toneOf(syllable: string): Tone {
  const marked = letters(syllable).find((l) => l.tone !== "mid");
  return marked ? marked.tone : "mid";
}
