const TONE_MARKS = /[\u0300\u0301\u0304]/g;
const ALL_MARKS = /[\u0300-\u036f]/g;

export const nfc = (s: string): string => s.normalize("NFC");

export function stripTones(s: string): string {
  return s.normalize("NFD").replace(TONE_MARKS, "").normalize("NFC");
}

export function stripMarks(s: string): string {
  return s.normalize("NFD").replace(ALL_MARKS, "").normalize("NFC");
}

export function cleanAnswer(s: string): string {
  return nfc(s).trim().replace(/\s+/g, " ").toLowerCase();
}
