# Audio pipeline

Clips are pre-generated offline with Meta's MMS-TTS Yoruba model (`facebook/mms-tts-yor`, CC-BY-NC 4.0, non-commercial use) and shipped as static files. The app makes no model or network calls for speech.

One-time setup (CPU only):

    python3 -m venv tools/audio/.venv
    tools/audio/.venv/bin/pip install -r tools/audio/requirements.txt

Regenerate after any lesson content change (also rewrites `tools/audio/strings.json`):

    npm run audio:generate

Quality and tone checks (prints clip sanity and F0 comparisons):

    tools/audio/.venv/bin/python tools/audio/analyze.py

Outputs: `public/audio/<12-char sha1 of key>.mp3` and `src/content/audio-manifest.json`. Keys come from `audioKey()` in `src/lib/audio.ts`. The model tokenizer must receive NFC text, because it drops the dot-below (U+0323) in NFD input. The `src/lib/audio.test.ts` drift test fails if content changes without regenerating.
