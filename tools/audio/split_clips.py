"""Split downloaded ElevenLabs web-tool audio (test.*, part-N.*) into one clip per string.

Uses ffmpeg silencedetect to list every internal silence, picks the N-1 longest as the
separators (N = items in order.json), checks the separation margin, then writes public/audio/<sha1(key)[:12]>.mp3 and merges the manifest.
"""
import argparse, hashlib, json, re, statistics, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PASTE = ROOT / "tools/audio/paste"
MANIFEST = ROOT / "src/content/audio-manifest.json"
PUBLIC_AUDIO = ROOT / "public/audio"
PAD = 0.05
MIN_SILENCE = 0.12
MIN_MARGIN = 1.5
SHORT = 0.15
AUDIO_EXT = {".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac", ".opus", ".webm", ".mp4"}


def clip_name(key: str) -> str:
    return hashlib.sha1(key.encode("utf-8")).hexdigest()[:12] + ".mp3"


def duration_of(path: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "default=nw=1:nk=1", str(path)], capture_output=True, text=True)
    return float(r.stdout.strip())


def detect_silences(path: Path, noise: str, min_dur: float):
    total = duration_of(path)
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af",
                        f"silencedetect=noise={noise}:d={min_dur}", "-f", "null", "-"],
                       capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: (-?[\d.]+)", r.stderr)]
    sil = [(max(s, 0.0), ends[i] if i < len(ends) else total) for i, s in enumerate(starts)]
    return sil, total


def segments_from(sil, total, seps):
    """Speech segments given the chosen separator silences (sorted by time)."""
    lead = sil[0][1] if sil and sil[0][0] < 0.01 else 0.0
    tail = sil[-1][0] if sil and sil[-1][1] > total - 0.01 and sil[-1][0] > 0.01 else total
    segs, pos = [], lead
    for s, e in seps:
        segs.append((pos, s))
        pos = e
    segs.append((pos, tail))
    return segs


def find_segments(path: Path, noise: str, n_items: int, min_gap=None):
    """Returns (segments, margin, internal_silences, total). margin is None in fixed --min-gap mode."""
    if min_gap is not None:
        sil, total = detect_silences(path, noise, min_gap)
        internal = [x for x in sil if x[0] > 0.01 and x[1] < total - 0.01]
        return segments_from(sil, total, internal), None, internal, total
    sil, total = detect_silences(path, noise, MIN_SILENCE)
    internal = [x for x in sil if x[0] > 0.01 and x[1] < total - 0.01]
    need = n_items - 1
    if len(internal) < need:
        return segments_from(sil, total, internal), None, internal, total
    ranked = sorted(internal, key=lambda x: x[0] - x[1])  # longest first
    chosen = sorted(ranked[:need])
    rest = ranked[need:]
    shortest = min((e - s for s, e in chosen), default=None)
    longest_rest = max((e - s for s, e in rest), default=0.0)
    if shortest is None or longest_rest <= 0:
        margin = float("inf")
    else:
        margin = shortest / longest_rest
    return segments_from(sil, total, chosen), margin, internal, total


def list_segments(segs):
    durs = [e - s for s, e in segs]
    med = statistics.median(durs) if durs else 0
    for i, (s, e) in enumerate(segs, 1):
        flag = ""
        if e - s < SHORT:
            flag = "  <-- suspiciously short"
        elif med and e - s > 3 * med:
            flag = "  <-- suspiciously long (maybe two items merged)"
        print(f"  {i:3d}. start {s:8.2f}  end {e:8.2f}  duration {e - s:6.2f}{flag}")


def diagnose(name, segs, expected, noise, min_gap):
    print(f"\nERROR {name}: found {len(segs)} segments but order.json lists {expected} items. Nothing was written for this file.")
    list_segments(segs)
    if min_gap is not None and len(segs) > expected:
        print(f"  Too many segments: try a larger --min-gap (now {min_gap}) or a lower --noise (now {noise}, e.g. -40dB).")
    else:
        print(f"  Too few pauses detected: try a higher --noise (now {noise}, e.g. -30dB) or a smaller --min-gap. "
              "Check that the downloaded audio really contains every item.")


def warn_low_margin(name, margin, segs, internal, chosen_count):
    print(f"\n!!! WARNING {name}: separation margin {margin:.2f} is below {MIN_MARGIN}. The pauses between items are not clearly longer than pauses inside items.")
    list_segments(segs)
    gaps = sorted(internal, key=lambda x: x[0] - x[1])
    print("  Closest-call gaps (rank, at, length):")
    for i, (s, e) in enumerate(gaps[max(chosen_count - 3, 0):chosen_count + 3], max(chosen_count - 3, 0) + 1):
        print(f"    #{i}: {s:.2f}-{e:.2f}  {e - s:.2f}s  {'(used as separator)' if i <= chosen_count else '(not used)'}")


def cut(src: Path, start: float, end: float, dest: Path) -> None:
    sil = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05"
    flt = f"{sil},areverse,{sil},areverse,loudnorm=I=-18:TP=-2:LRA=11"
    ss = max(start - PAD, 0.0)
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{ss:.3f}", "-to", f"{end + PAD:.3f}", "-i", str(src),
           "-af", flt, "-ac", "1", "-ar", "44100", "-codec:a", "libmp3lame", "-b:a", "64k",
           "-map_metadata", "-1", str(dest)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0 or not dest.exists() or dest.stat().st_size < 300:
        raise RuntimeError(f"ffmpeg failed for {dest.name}: {r.stderr[:200]}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--parts-dir", required=True, help="folder with test.*, part-1.*, ... audio files")
    ap.add_argument("--out-dir", help="write clips here; manifest untouched")
    ap.add_argument("--order", help="order.json path (default: PARTS_DIR/order.json, else tools/audio/paste/order.json)")
    ap.add_argument("--noise", default="-35dB")
    ap.add_argument("--min-gap", type=float, default=None, help="optional fixed mode: split at every silence at least this long (default: use the N-1 longest gaps)")
    ap.add_argument("--accept-low-margin", action="store_true", help="write clips even if the separation margin is below 1.5")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    parts_dir = Path(a.parts_dir).expanduser()
    if not parts_dir.is_dir():
        print(f"parts dir not found: {parts_dir}", file=sys.stderr)
        return 1
    order_path = Path(a.order).expanduser() if a.order else (parts_dir / "order.json")
    if not order_path.exists():
        order_path = PASTE / "order.json"
    if not order_path.exists():
        print("order.json not found. Run: python tools/audio/prepare_paste.py", file=sys.stderr)
        return 1
    order = json.loads(order_path.read_text(encoding="utf-8"))

    files = {}
    for p in sorted(parts_dir.iterdir()):
        if p.suffix.lower() in AUDIO_EXT and p.stem in order:
            files.setdefault(p.stem, p)
    if not files:
        print(f"no audio files named test.* or part-N.* found in {parts_dir}", file=sys.stderr)
        return 1

    def sort_key(n):
        return (0, 0) if n == "test" else (1, int(n.split("-")[1]))
    failed, manifest_new = 0, {}
    for name in sorted(files, key=sort_key):
        keys = order[name]
        segs, margin, internal, total = find_segments(files[name], a.noise, len(keys), a.min_gap)
        if len(segs) != len(keys):
            diagnose(files[name].name, segs, len(keys), a.noise, a.min_gap)
            failed += 1
            continue
        if margin is not None:
            print(f"{files[name].name}: separation margin {margin:.2f}")
            if margin < MIN_MARGIN:
                warn_low_margin(files[name].name, margin, segs, internal, len(keys) - 1)
                if not a.accept_low_margin:
                    print("  Nothing was written for this file. Re-record it, adjust --noise, or pass --accept-low-margin.")
                    failed += 1
                    continue
        is_test = name == "test"
        if a.out_dir:
            dest_dir, touch_manifest = Path(a.out_dir).expanduser(), False
        elif is_test:
            dest_dir, touch_manifest = PASTE / "test-clips", False
        else:
            dest_dir, touch_manifest = PUBLIC_AUDIO, True
        print(f"{files[name].name}: {len(segs)} segments match -> {dest_dir}{'' if touch_manifest else ' (manifest untouched)'}")
        if not a.dry_run:
            dest_dir.mkdir(parents=True, exist_ok=True)
        for (s, e), key in zip(segs, keys):
            dest = dest_dir / clip_name(key)
            print(f"  {key!r}: {s:.2f}-{e:.2f} ({e - s:.2f}s) -> {dest.name}")
            if a.dry_run:
                continue
            cut(files[name], s, e, dest)
            if touch_manifest:
                manifest_new[key] = dest.name
    if manifest_new and not a.dry_run:
        m = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
        m.update(manifest_new)
        MANIFEST.write_text(json.dumps(m, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        print(f"manifest updated: {len(manifest_new)} entries")
    if failed:
        print(f"\n{failed} file(s) failed the segment count check.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
