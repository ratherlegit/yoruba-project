# Audio pipeline

Clips are pre-generated offline with ElevenLabs text-to-speech and shipped as static files. The app makes no model or network calls for speech. The old Meta MMS-TTS scripts are unused and kept in `legacy-mms/`.

Setup (once):

    python3 -m venv tools/audio/.venv
    tools/audio/.venv/bin/pip install -r tools/audio/requirements.txt
    cp tools/audio/.env.example tools/audio/.env

Then edit `tools/audio/.env` with your API key, voice id and model id. That file is git-ignored; never commit it.

Steps:

    # 1. Write tools/audio/strings.json from the lesson content
    npm run audio:list

    # 2. Dry run: no network, prints string count and total characters, flags strings over 200 characters
    tools/audio/.venv/bin/python tools/audio/generate_elevenlabs.py --dry-run

    # 3. Audition a few clips into a scratch folder (manifest is not touched)
    tools/audio/.venv/bin/python tools/audio/generate_elevenlabs.py --only "ọmọ" "ọkọ̀" --out-dir /tmp/yo-audition

    # 4. Full run (lists strings, then generates into public/audio and merges the manifest)
    npm run audio:generate

    # 5. Check that manifest and files match the lessons
    npm run validate && npx vitest run

Every full run REPLACES the existing clips when you pass `--force` (the default skips files that already exist, so an interrupted run resumes). The first real run must use `--force`, because the current files are old MMS clips:

    tools/audio/.venv/bin/python tools/audio/generate_elevenlabs.py --force

Other options: `--limit N`, `--sleep SECONDS` (default 0.3). Keys are NFC lowercase from `audioKey()` in `src/lib/audio.ts`. Text is sent as NFC so tone marks and dot-below letters survive.
