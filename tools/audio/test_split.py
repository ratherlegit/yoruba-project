"""Offline test for split_clips.py. Run: npm run audio:test"""
import hashlib, json, re, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SPLIT = ROOT / "tools/audio/split_clips.py"
MANIFEST = ROOT / "src/content/audio-manifest.json"
STRINGS = ROOT / "tools/audio/strings.json"
AUDIO = ROOT / "public/audio"


def dur(p: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(p)],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def source_clips(n):
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    keys = [s["key"] for s in json.loads(STRINGS.read_text(encoding="utf-8"))]
    keys = [k for k in keys if k in manifest][:n]
    return [(k, AUDIO / manifest[k]) for k in keys]


def build(clips, out: Path, inner=None, sep=0.8):
    """Concatenate clips with sep-second pauses, 1 s lead and tail. inner maps clip index -> seconds of silence put inside that clip."""
    inner = inner or {}
    inputs, chains, labels = [], [], []
    def sil(sec):
        i = len(labels)
        chains.append(f"anullsrc=r=44100:cl=mono,atrim=0:{sec},asetpts=N/SR/TB[s{i}]")
        labels.append(f"[s{i}]")
    def clip(path, idx, half=None):
        inputs.extend(["-i", str(path)])
        n = len(inputs) // 2 - 1
        base = f"[{n}:a]aformat=sample_rates=44100:channel_layouts=mono"
        if half is None:
            chains.append(f"{base}[c{idx}]"); labels.append(f"[c{idx}]")
        else:
            chains.append(f"{base},asplit[x{idx}a][x{idx}b]")
            chains.append(f"[x{idx}a]atrim=0:{half},asetpts=N/SR/TB[h{idx}a]")
            chains.append(f"[x{idx}b]atrim={half},asetpts=N/SR/TB[h{idx}b]")
            labels.append(f"[h{idx}a]"); sil(inner[idx]); labels.append(f"[h{idx}b]")
    sil(1.0)
    for i, (_, p) in enumerate(clips):
        clip(p, i, dur(p) / 2 if i in inner else None)
        sil(sep if i < len(clips) - 1 else 1.0)
    chains.append("".join(labels) + f"concat=n={len(labels)}:v=0:a=1[out]")
    r = subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(chains),
                        "-map", "[out]", "-ac", "1", "-ar", "44100", str(out)], capture_output=True, text=True)
    assert r.returncode == 0, r.stderr


def run(parts_dir, out_dir, *extra):
    return subprocess.run([sys.executable, str(SPLIT), "--parts-dir", str(parts_dir), "--out-dir", str(out_dir), *extra],
                          capture_output=True, text=True)


class SplitTests(unittest.TestCase):
    def test_thirty_clips(self):
        clips = source_clips(30)
        self.assertEqual(len(clips), 30)
        before = MANIFEST.read_bytes()
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            build(clips, td / "part-1.mp3", inner={4: 0.4, 17: 0.4}, sep=0.8)
            (td / "order.json").write_text(json.dumps({"part-1": [k for k, _ in clips]}, ensure_ascii=False), encoding="utf-8")
            r = run(td, td / "out")
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
            m = float(re.search(r"separation margin ([\d.]+)", r.stdout).group(1))
            self.assertGreaterEqual(m, 1.5)
            self.assertEqual(len(list((td / "out").glob("*.mp3"))), 30)
            for i, (k, src) in enumerate(clips):
                out = td / "out" / (hashlib.sha1(k.encode()).hexdigest()[:12] + ".mp3")
                self.assertTrue(out.exists(), k)
                want = dur(src) + (0.4 if i in (4, 17) else 0)
                self.assertLess(abs(dur(out) - want), 0.25, f"{k}: {dur(out)} vs {want}")
            keys = [k for k, _ in clips] + ["extra key"]
            (td / "order.json").write_text(json.dumps({"part-1": keys}, ensure_ascii=False), encoding="utf-8")
            r = run(td, td / "out2")
            self.assertNotEqual(r.returncode, 0)
            # one key too many: the N-1 largest gaps now include a pause inside an item, so the margin collapses
            self.assertIn("WARNING", r.stdout)
            self.assertIn("Nothing was written", r.stdout)
            self.assertFalse((td / "out2").exists() and any((td / "out2").iterdir()))
        self.assertEqual(MANIFEST.read_bytes(), before, "manifest changed")

    def test_too_few_pauses_diagnosed(self):
        clips = source_clips(3)
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            build(clips, td / "part-1.mp3", sep=0.8)
            keys = [k for k, _ in clips] + ["x", "y"]
            (td / "order.json").write_text(json.dumps({"part-1": keys}, ensure_ascii=False), encoding="utf-8")
            r = run(td, td / "out")
            self.assertNotEqual(r.returncode, 0)
            self.assertIn("found 3 segments but order.json lists 5", r.stdout)
            self.assertFalse((td / "out").exists())

    def test_low_margin_blocks_write(self):
        clips = source_clips(3)
        with tempfile.TemporaryDirectory() as td:
            td = Path(td)
            build(clips, td / "part-1.mp3", inner={1: 1.0}, sep=0.6)
            (td / "order.json").write_text(json.dumps({"part-1": [k for k, _ in clips]}, ensure_ascii=False), encoding="utf-8")
            r = run(td, td / "out")
            self.assertNotEqual(r.returncode, 0)
            self.assertIn("WARNING", r.stdout)
            self.assertFalse((td / "out").exists() and any((td / "out").iterdir()))
            r = run(td, td / "out3", "--accept-low-margin")
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
            self.assertEqual(len(list((td / "out3").glob("*.mp3"))), 3)


if __name__ == "__main__":
    unittest.main(verbosity=2)
