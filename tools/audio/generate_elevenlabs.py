"""Pre-generate Yoruba audio with ElevenLabs text-to-speech.

Reads tools/audio/strings.json (made by `npm run audio:list`), writes
public/audio/<sha1(key)[:12]>.mp3 and merges src/content/audio-manifest.json.
Keys are NFC (see audioKey in src/lib/audio.ts). Settings come from tools/audio/.env.
"""
import argparse, hashlib, json, os, shutil, subprocess, sys, tempfile, time, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ENV_PATH = ROOT / "tools/audio/.env"
STRINGS = ROOT / "tools/audio/strings.json"
MANIFEST = ROOT / "src/content/audio-manifest.json"
API = "https://api.elevenlabs.io/v1/text-to-speech/{voice}"
OUTPUT_FORMAT = "mp3_44100_64"
VOICE_SETTINGS = {"stability": 0.6, "similarity_boost": 0.8, "style": 0.0, "use_speaker_boost": True}
LONG = 200


class Stop(Exception):
    pass


def clip_name(key: str) -> str:
    # Same formula as the legacy MMS generator.
    return hashlib.sha1(key.encode("utf-8")).hexdigest()[:12] + ".mp3"


def load_env() -> dict:
    if not ENV_PATH.exists():
        raise Stop("tools/audio/.env not found. Copy tools/audio/.env.example to tools/audio/.env and fill it in.")
    env = {}
    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    for req in ("ELEVENLABS_API_KEY", "ELEVENLABS_VOICE_ID", "ELEVENLABS_MODEL_ID"):
        if not env.get(req):
            raise Stop(f"{req} is missing from tools/audio/.env")
    env.setdefault("ELEVENLABS_LANGUAGE_CODE", "yo")
    return env


def tidy(path: Path) -> None:
    """Trim edge silence and lightly normalize loudness, if ffmpeg exists."""
    if not shutil.which("ffmpeg"):
        return
    sil = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05"
    flt = f"{sil},areverse,{sil},areverse,loudnorm=I=-18:TP=-2:LRA=11"
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td) / "out.mp3"
        r = subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(path), "-af", flt,
                            "-ac", "1", "-ar", "44100", "-codec:a", "libmp3lame", "-b:a", "64k",
                            "-map_metadata", "-1", str(tmp)], capture_output=True)
        if r.returncode == 0 and tmp.exists() and tmp.stat().st_size > 500:
            shutil.copyfile(tmp, path)


def synth(requests, env, text, use_lang, sleep):
    """Returns (audio_bytes, lang_still_ok). Raises Stop on fatal errors."""
    url = API.format(voice=env["ELEVENLABS_VOICE_ID"])
    body = {"text": text, "model_id": env["ELEVENLABS_MODEL_ID"], "voice_settings": VOICE_SETTINGS}
    if use_lang:
        body["language_code"] = env["ELEVENLABS_LANGUAGE_CODE"]
    headers = {"xi-api-key": env["ELEVENLABS_API_KEY"], "Content-Type": "application/json", "Accept": "audio/mpeg"}
    attempts = 0
    while True:
        attempts += 1
        try:
            r = requests.post(url, params={"output_format": OUTPUT_FORMAT}, headers=headers, json=body, timeout=60)
        except requests.RequestException as e:
            if attempts >= 3:
                raise Stop(f"network error after 3 tries: {type(e).__name__}")
            time.sleep(2 * attempts)
            continue
        code = r.status_code
        if code == 200:
            return r.content, use_lang
        detail = r.text[:300].replace("\n", " ")
        low = detail.lower()
        if code == 401:
            raise Stop("401: the API key was rejected. Check ELEVENLABS_API_KEY in tools/audio/.env.")
        if code == 402 or "quota" in low:
            raise Stop("quota exceeded or payment required (402). Stopping.")
        if code == 429:
            if attempts >= 4:
                raise Stop("429: still rate limited after 3 retries. Stopping.")
            time.sleep(5 * attempts)
            continue
        if use_lang and code in (400, 422) and "language" in low:
            print("note: the API rejected language_code; retrying without it for the rest of the run")
            body.pop("language_code")
            use_lang = False
            attempts = 0
            continue
        if code in (400, 422, 403) and ("voice" in low or "plan" in low or "library" in low):
            raise Stop(f"{code}: this voice is not allowed for API use. It may need a paid plan, or it must be added to your own voices in ElevenLabs. ({detail})")
        if code >= 500 and attempts < 3:
            time.sleep(2 * attempts)
            continue
        raise Stop(f"HTTP {code}: {detail}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--dry-run", action="store_true", help="no network; report counts")
    ap.add_argument("--only", nargs="+", metavar="KEY", help="generate just these keys")
    ap.add_argument("--limit", type=int, help="generate at most N strings")
    ap.add_argument("--force", action="store_true", help="regenerate existing files")
    ap.add_argument("--out-dir", help="write clips here instead of public/audio; manifest untouched")
    ap.add_argument("--sleep", type=float, default=0.3, help="seconds between requests")
    a = ap.parse_args()

    if not STRINGS.exists():
        print("tools/audio/strings.json not found. Run: npm run audio:list", file=sys.stderr)
        return 1
    strings = json.loads(STRINGS.read_text(encoding="utf-8"))
    items = []
    for s in strings:
        text = unicodedata.normalize("NFC", s["text"])
        assert "̣" not in text, f"decomposed dot-below in {s['key']!r}"
        items.append((s["key"], text))
    if a.only:
        wanted = {unicodedata.normalize("NFC", k) for k in a.only}
        missing = wanted - {k for k, _ in items}
        if missing:
            print(f"unknown keys: {sorted(missing)}", file=sys.stderr)
            return 1
        items = [(k, t) for k, t in items if k in wanted]
    if a.limit is not None:
        items = items[: a.limit]

    out_dir = Path(a.out_dir) if a.out_dir else ROOT / "public/audio"

    if a.dry_run:
        total = sum(len(t) for _, t in items)
        print(f"dry run: {len(items)} strings, {total} characters would be sent")
        for k, t in items:
            if len(t) > LONG:
                print(f"  over {LONG} characters ({len(t)}): {k}")
        return 0

    try:
        env = load_env()
        try:
            import requests
        except ImportError:
            raise Stop("the requests package is missing. Run: tools/audio/.venv/bin/pip install -r tools/audio/requirements.txt")
        out_dir.mkdir(parents=True, exist_ok=True)
        # language_code is only sent for models that support it; eleven_v3 and the multilingual v2 family
        # are the ones with Yoruba. If the API rejects it, synth() drops it and says so.
        use_lang = bool(env.get("ELEVENLABS_LANGUAGE_CODE"))
        done = {}
        failed = 0
        for i, (key, text) in enumerate(items, 1):
            name = clip_name(key)
            dest = out_dir / name
            if dest.exists() and not a.force:
                done[key] = name
                print(f"[{i}/{len(items)}] skip {key} (exists)")
                continue
            try:
                audio, use_lang = synth(requests, env, text, use_lang, a.sleep)
            except Stop as e:
                save_manifest(done, a)
                print(f"error: {e} ({len(done)} of {len(items)} done before stopping)", file=sys.stderr)
                return 1
            dest.write_bytes(audio)
            tidy(dest)
            done[key] = name
            print(f"[{i}/{len(items)}] {key} -> {name}")
            time.sleep(a.sleep)
        save_manifest(done, a)
        print(f"done: {len(done)} clips")
        return 1 if failed else 0
    except Stop as e:
        print(f"error: {e}", file=sys.stderr)
        return 1


def save_manifest(done: dict, a) -> None:
    if a.out_dir or not done:
        return
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
    manifest.update(done)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


if __name__ == "__main__":
    sys.exit(main())
