function hash(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(a: number): () => number {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  const rand = mulberry32(hash(seed));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  const same = out.every((v, i) => v === items[i]);
  if (same && out.length > 1) out.push(out.shift()!);
  return out;
}

// Shuffles like seededShuffle, but the result never matches the `avoid` order
// (compared through `key`) whenever some other arrangement exists.
export function seededShuffleAvoiding<T>(
  items: readonly T[],
  seed: string,
  avoid: readonly string[],
  key: (item: T) => string = (item) => String(item),
): T[] {
  const matches = (arr: readonly T[]) => arr.length === avoid.length && arr.every((v, i) => key(v) === avoid[i]);
  let out = seededShuffle(items, seed);
  if (!matches(out)) return out;
  for (let n = 1; n <= 24; n++) {
    out = seededShuffle(items, `${seed}#${n}`);
    if (!matches(out)) return out;
  }
  // Deterministic fallback: any adjacent swap that changes the key order.
  for (let i = 0; i < items.length - 1; i++) {
    const swapped = [...out];
    [swapped[i], swapped[i + 1]] = [swapped[i + 1]!, swapped[i]!];
    if (!matches(swapped)) return swapped;
  }
  return out;
}
