"""Pre-generate Yoruba audio with Meta MMS-TTS (facebook/mms-tts-yor, CC-BY-NC 4.0).

Reads tools/audio/strings.json (made by `npm run audio:list`), writes
public/audio/<sha1(key)[:12]>.<ext> and src/content/audio-manifest.json.
Keys are NFC (see audioKey in src/lib/audio.ts). The model tokenizer drops the
dot-below (U+0323) in NFD input, so text is always fed to it in NFC.
"""
import hashlib, json, shutil, subprocess, sys, tempfile, unicodedata
from pathlib import Path

import numpy as np
import librosa
import scipy.io.wavfile as wavfile
import torch
from transformers import AutoTokenizer, VitsModel

ROOT = Path(__file__).resolve().parents[2]
MODEL = "facebook/mms-tts-yor"
SEED = 1234
NOISE = 0.3          # default is 0.667 / 0.8; lower is more stable run to run
TARGET_RMS = 0.08    # light loudness normalization
PEAK_CEIL = 0.9


def load():
    tok = AutoTokenizer.from_pretrained(MODEL)
    model = VitsModel.from_pretrained(MODEL).eval()
    model.noise_scale = NOISE
    model.noise_scale_duration = NOISE
    return tok, model


def synth(tok, model, text, seed=SEED):
    text = unicodedata.normalize("NFC", text)
    inputs = tok(text, return_tensors="pt")
    torch.manual_seed(seed)
    with torch.no_grad():
        wav = model(**inputs).waveform[0].numpy().astype(np.float32)
    return wav, model.config.sampling_rate


def tidy(wav, sr):
    trimmed, _ = librosa.effects.trim(wav, top_db=35)
    pad = np.zeros(int(0.05 * sr), dtype=np.float32)
    out = np.concatenate([pad, trimmed, pad])
    rms = float(np.sqrt(np.mean(out ** 2))) or 1e-9
    out = out * (TARGET_RMS / rms)
    peak = float(np.max(np.abs(out)))
    if peak > PEAK_CEIL:
        out = out * (PEAK_CEIL / peak)
    return out


def write_clip(wav, sr, dest_base: Path):
    """Returns the written path. mp3 via ffmpeg when available, else 16-bit wav."""
    pcm = (np.clip(wav, -1, 1) * 32767).astype(np.int16)
    if shutil.which("ffmpeg"):
        with tempfile.TemporaryDirectory() as td:
            tmp = Path(td) / "in.wav"
            wavfile.write(tmp, sr, pcm)
            dest = dest_base.with_suffix(".mp3")
            subprocess.run(
                ["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-ac", "1", "-ar", str(sr),
                 "-codec:a", "libmp3lame", "-b:a", "48k", "-map_metadata", "-1", "-fflags", "+bitexact", str(dest)],
                check=True)
            return dest
    dest = dest_base.with_suffix(".wav")
    wavfile.write(dest, sr, pcm)
    return dest


def check_tokens(tok, strings):
    bad = []
    unk = tok.get_vocab()["<unk>"]
    for s in strings:
        text = unicodedata.normalize("NFC", s["key"])
        ids = tok(text)["input_ids"]
        toks = [t for t in tok.convert_ids_to_tokens(ids) if t != "|"]
        if unk in ids or "".join(toks) != text:
            bad.append((s["key"], toks))
    return bad


def main():
    strings = json.loads((ROOT / "tools/audio/strings.json").read_text(encoding="utf-8"))
    tok, model = load()
    bad = check_tokens(tok, strings)
    if bad:
        for k, t in bad:
            print("TOKENIZATION PROBLEM", k, t)
        sys.exit(1)
    out_dir = ROOT / "public/audio"
    out_dir.mkdir(parents=True, exist_ok=True)
    for old in out_dir.iterdir():
        if old.suffix in (".mp3", ".wav", ".ogg"):
            old.unlink()
    manifest = {}
    for i, s in enumerate(strings, 1):
        key = s["key"]
        wav, sr = synth(tok, model, key)
        wav = tidy(wav, sr)
        name = hashlib.sha1(key.encode("utf-8")).hexdigest()[:12]
        dest = write_clip(wav, sr, out_dir / name)
        manifest[key] = dest.name
        print(f"[{i}/{len(strings)}] {key} -> {dest.name} ({len(wav) / sr:.2f}s)")
    (ROOT / "src/content/audio-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print("done", len(manifest))


if __name__ == "__main__":
    main()
