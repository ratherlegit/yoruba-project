"""Prepare paste-ready text files for the ElevenLabs free web tool.

Reads tools/audio/strings.json and writes tools/audio/paste/test.txt, part-N.txt
and order.json. One item per line, each followed by a 2 second pause tag.
"""
import json, sys, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STRINGS = ROOT / "tools/audio/strings.json"
PASTE = ROOT / "tools/audio/paste"
BREAK = '<break time="2.0s" />'
MAX_ITEMS = 30
MAX_CHARS = 3500
TEST_KEYS = ["ọmọ", "ọkọ", "ọkọ̀", "ọkọ́", "ẹ káàárọ̀"]


def nfc(s: str) -> str:
    return unicodedata.normalize("NFC", s)


def line_for(text: str) -> str:
    return f"{text} {BREAK}\n"


def main() -> int:
    if not STRINGS.exists():
        print("tools/audio/strings.json not found. Run: npm run audio:list", file=sys.stderr)
        return 1
    items = [(nfc(s["key"]), nfc(s["text"])) for s in json.loads(STRINGS.read_text(encoding="utf-8"))]
    by_key = dict(items)
    wanted = [nfc(k) for k in TEST_KEYS]
    test = [k for k in wanted if k in by_key]
    if len(test) < 5:
        test = test + [k for k, _ in items if k not in test][: 5 - len(test)]
    rest = [(k, t) for k, t in items if k not in set(test)]

    parts, cur, cur_chars = [], [], 0
    for k, t in rest:
        n = len(line_for(t))
        if cur and (len(cur) >= MAX_ITEMS or cur_chars + n >= MAX_CHARS):
            parts.append(cur)
            cur, cur_chars = [], 0
        cur.append((k, t))
        cur_chars += n
    if cur:
        parts.append(cur)

    PASTE.mkdir(parents=True, exist_ok=True)
    for old in PASTE.glob("*.txt"):
        old.unlink()
    order, sizes = {}, []
    groups = [("test", [(k, by_key[k]) for k in test])] + [(f"part-{i}", p) for i, p in enumerate(parts, 1)]
    for name, group in groups:
        body = "".join(line_for(t) for _, t in group)
        assert body == nfc(body)
        (PASTE / f"{name}.txt").write_text(body, encoding="utf-8")
        order[name] = [k for k, _ in group]
        sizes.append((name, len(group), len(body)))
    (PASTE / "order.json").write_text(json.dumps(order, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    total = sum(c for _, _, c in sizes)
    print(f"{len(parts)} parts plus a test file, written to {PASTE}")
    for name, n, c in sizes:
        print(f"  {name}: {n} items, {c} characters")
    print(f"total characters across all files (counting break tags): {total}")
    print(f"characters of text only, no tags: {sum(len(t) for _, t in items)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
