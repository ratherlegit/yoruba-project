"""Prepare paste-ready text files for the ElevenLabs free web tool.

Reads tools/audio/strings.json and writes tools/audio/paste/test.txt, part-N.txt
and order.json. One paragraph per item: the text plus a period (unless it already ends in
punctuation), then a blank line.

Only strings whose key is not yet in src/content/audio-manifest.json are pasted, so
re-runs after a partial batch only include what is still missing. Use --group
(repeatable: grammar, vocab-word, vocab-sentence, number-word, number-sentence, sound-word, dialogue-female, dialogue-male) to restrict the batch, for example
vocab words first and sentences second. Add --level (repeatable) to limit vocab strings to
chosen levels, for example --level getting-started --level beginner. Strings are tagged with
the first level that uses them; grammar strings have no level, so they are left out when
--level is given.
"""
import argparse, json, sys, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STRINGS = ROOT / "tools/audio/strings.json"
MANIFEST = ROOT / "src/content/audio-manifest.json"
LEVELS = ["getting-started", "beginner", "intermediate", "advanced", "mastery"]
GROUPS = ["grammar", "vocab-word", "vocab-sentence", "number-word", "number-sentence", "sound-word", "dialogue-female", "dialogue-male"]
PASTE = ROOT / "tools/audio/paste"
MAX_ITEMS = 30
MAX_CHARS = 3500
TEST_KEYS = ["ọmọ", "ọkọ", "ọkọ̀", "ọkọ́", "ẹ káàárọ̀"]


def nfc(s: str) -> str:
    return unicodedata.normalize("NFC", s)


END_PUNCT = (".", "!", "?", "\u2026", ";", ":")


def line_for(text: str) -> str:
    """One paragraph: the text, a period only if it does not already end in punctuation, then a blank line."""
    t = text.rstrip()
    return f"{t}\n\n" if t.endswith(END_PUNCT) else f"{t}.\n\n"


def clear_paste() -> None:
    """Remove generated files so a stale order.json or part-N.txt can never be read by split_clips.py."""
    PASTE.mkdir(parents=True, exist_ok=True)
    for old in list(PASTE.glob("*.txt")) + [PASTE / "order.json"]:
        if old.exists():
            old.unlink()


def pending_items(entries: list, manifest: dict, groups: list, levels: list = None) -> list:
    """(key, text, group) for entries in the wanted groups (and levels, when given) that have no manifest entry yet.

    Entries without a level (grammar strings) are left out when levels are given."""
    done = {nfc(k) for k in manifest}
    out = []
    for s in entries:
        group = s.get("group", "grammar")
        key = nfc(s["key"])
        if levels and s.get("level") not in levels:
            continue
        if group in groups and key not in done:
            out.append((key, nfc(s["text"]), group))
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--group", action="append", choices=GROUPS,
                    help="only include this group (repeatable). Default: all groups")
    ap.add_argument("--level", action="append", choices=LEVELS,
                    help="only include vocab strings first used in this level (repeatable). Default: all levels")
    ap.add_argument("--no-test", action="store_true",
                    help="skip test.txt (a short sample whose strings are also in the parts); use once the voice is vetted")
    args = ap.parse_args(argv)
    wanted_groups = args.group or GROUPS
    if not STRINGS.exists():
        print("tools/audio/strings.json not found. Run: npm run audio:list", file=sys.stderr)
        return 1
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
    full = pending_items(json.loads(STRINGS.read_text(encoding="utf-8")), manifest, wanted_groups, args.level)
    items = [(k, t) for k, t, _ in full]
    group_of = {k: g for k, _, g in full}
    clear_paste()
    if not items:
        print(f"Nothing to paste: every string in group(s) {', '.join(wanted_groups)} already has a clip.")
        return 0
    by_key = dict(items)
    wanted = [nfc(k) for k in TEST_KEYS]
    test = [k for k in wanted if k in by_key]
    if len(test) < 5:
        test = test + [k for k, _ in items if k not in test][: 5 - len(test)]
    if args.no_test:
        test = []
    rest = items  # test strings stay in the parts too, so their clips are saved

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

    order, sizes = {}, []
    files = ([("test", [(k, by_key[k]) for k in test])] if test else []) + [(f"part-{i}", p) for i, p in enumerate(parts, 1)]
    for name, group in files:
        body = "".join(line_for(t) for _, t in group)
        assert body == nfc(body)
        (PASTE / f"{name}.txt").write_text(body, encoding="utf-8")
        order[name] = [k for k, _ in group]
        sizes.append((name, len(group), len(body)))
    (PASTE / "order.json").write_text(json.dumps(order, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Credits are characters, so also report totals per group (text, any added period, blank line).
    chars = {g: sum(len(line_for(t)) for k, t in items if group_of[k] == g) for g in GROUPS}
    counts = {g: sum(1 for k, _ in items if group_of[k] == g) for g in GROUPS}
    total = sum(c for name, _, c in sizes if name != "test")
    print(f"{len(parts)} parts{' plus a test file' if test else ''}, written to {PASTE}")
    for name, n, c in sizes:
        note = " (a sample; these items are also in the parts, so it is not in the total)" if name == "test" else ""
        print(f"  {name}: {n} items, {c} characters{note}")
    print("per group (still missing from the manifest):")
    for g in GROUPS:
        if g in wanted_groups:
            print(f"  {g}: {counts[g]} items, {chars[g]} characters")
    print(f"total characters across the parts (including added periods; the test file is extra credits): {total}")
    print(f"characters of text only, no periods: {sum(len(t) for _, t in items)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
