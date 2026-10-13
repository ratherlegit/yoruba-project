"""Quality checks for the generated clips (run after generate.py).

1. Per-clip sanity: non-empty, 0.2 s < duration < 15 s, not clipping.
2. Tone sanity: do tone-marked variants of the same word get different pitch?
   Uses librosa.pyin on the raw model output over several seeds.
"""
import json, sys, unicodedata
from pathlib import Path
import numpy as np
import librosa

sys.path.insert(0, str(Path(__file__).parent))
import generate as g

ROOT = g.ROOT
SEEDS = [1, 2, 3, 4, 5]


def clip_checks():
    manifest = json.loads((ROOT / "src/content/audio-manifest.json").read_text(encoding="utf-8"))
    problems, durs = [], []
    for key, f in manifest.items():
        y, sr = librosa.load(ROOT / "public/audio" / f, sr=None)
        d = len(y) / sr
        durs.append(d)
        peak = float(np.max(np.abs(y))) if len(y) else 0
        if len(y) == 0 or peak < 0.05: problems.append((key, "empty/silent"))
        if not (0.2 < d < 15): problems.append((key, f"duration {d:.2f}"))
        if peak >= 0.99 or np.mean(np.abs(y) > 0.98) > 0.001: problems.append((key, f"clipping peak {peak:.3f}"))
    print(f"clips={len(manifest)} dur min={min(durs):.2f} max={max(durs):.2f} mean={np.mean(durs):.2f}")
    print("clip problems:", problems or "none")


def f0_track(wav, sr):
    f0, voiced, _ = librosa.pyin(wav, fmin=60, fmax=400, sr=sr, frame_length=1024)
    t = librosa.times_like(f0, sr=sr, hop_length=256)
    return t, f0


def halves(wav, sr):
    """Trim, take F0 over voiced frames, return semitone median of first and second half of voiced span."""
    wav, _ = librosa.effects.trim(wav, top_db=35)
    t, f0 = f0_track(wav, sr)
    ok = ~np.isnan(f0)
    if ok.sum() < 6: return None
    tv, fv = t[ok], f0[ok]
    mid = (tv[0] + tv[-1]) / 2
    a, b = fv[tv < mid], fv[tv >= mid]
    if len(a) < 2 or len(b) < 2: return None
    return float(np.median(a)), float(np.median(b)), float(np.median(fv)), float(len(wav) / sr), t, f0


def contour(wav, sr, n=10):
    """Voiced F0 resampled to n points, in semitones relative to the clip's own median."""
    wav, _ = librosa.effects.trim(wav, top_db=35)
    t, f0 = f0_track(wav, sr)
    ok = ~np.isnan(f0)
    if ok.sum() < 6: return None
    st = 12 * np.log2(f0[ok] / np.nanmedian(f0[ok]))
    xs = np.linspace(0, 1, ok.sum())
    return np.interp(np.linspace(0, 1, n), xs, st)


def tone_report(tok, model, groups):
    for title, words in groups:
        print(f"\n== {title}")
        rows = {}
        for w in words:
            m2, hi, cs, lo, ds = [], [], [], [], []
            for sd in SEEDS:
                wav, sr = g.synth(tok, model, w, seed=sd)
                r = halves(wav, sr)
                if r is None: continue
                f1, f2, med, dur, _, _ = r
                m2.append(12 * np.log2(f2 / f1)); hi.append(f2); lo.append(f1)
                cs.append(contour(wav, sr)); ds.append(dur)
            if not hi:
                print(f"{w}: no voiced F0"); continue
            rows[w] = (np.mean(cs, axis=0), np.mean(hi), np.mean(lo))
            print(f"{w:10s} dur={np.mean(ds):.2f}s  half1={np.mean(lo):6.1f}Hz  half2={np.mean(hi):6.1f}Hz  "
                  f"half2-half1={np.mean(m2):+5.2f}st (sd {np.std(m2):.2f})  contour={np.round(np.mean(cs,axis=0),1).tolist()}")
        ws = list(rows)
        for i in range(len(ws)):
            for j in range(i + 1, len(ws)):
                d = float(np.sqrt(np.mean((rows[ws[i]][0] - rows[ws[j]][0]) ** 2)))
                print(f"   contour RMS diff {ws[i]} vs {ws[j]}: {d:.2f} st")


def main():
    clip_checks()
    tok, model = g.load()
    groups = [
        ("gs-2 set with tone marks and stripped", ["ọkọ", "ọkọ̀", "ọkọ́", "ọ̀kọ̀", "oko", "okọ", "okọ̀"]),
        ("single syllable ọ vs tone", ["gbọ", "gbọ́", "gbọ̀", "bọ́", "gọ́"]),
        ("rẹ- pairs", ["rẹja", "rẹ́ja", "ra", "rá", "rà"]),
        ("kà/kí/kọ́", ["ka", "kà", "ká", "ki", "kí", "kì"]),
        ("mo / o / ó", ["o", "ó", "ò", "a", "á", "à"]),
        ("ọmọ", ["ọmọ", "ọ̀mọ̀", "ọmọ́", "omo"]),
    ]
    tone_report(tok, model, groups)


if __name__ == "__main__":
    main()
