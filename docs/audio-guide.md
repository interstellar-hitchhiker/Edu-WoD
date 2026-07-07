# Audio guide

This app is designed for local ambience files, not hotlinked streams.

## Required folder

Put the three BBC MP3 files here:

```text
assets/audio/bbc/
```

## Required filenames

```text
bbc_song-thrus_nhu0508018.mp3
bbc_fire---clo_nhu0500210.mp3
bbc_rain---hea_nhu0503213.mp3
```

## Labels shown in the app

The user-facing labels are stored in `assets/data/audio-library.json`:

- Song thrush birdsong
- Close fire / fireplace
- Heavy rain

## Source lookup links

- https://sound-effects.bbcrewind.co.uk/search?q=NHU05080188
- https://sound-effects.bbcrewind.co.uk/search?q=NHU05002102
- https://sound-effects.bbcrewind.co.uk/search?q=NHU05032133

## Why local files rather than embedded BBC links?

Local files are more reliable for a GitHub Pages PWA. They can be cached, they do not depend on a third-party player, and the app can show a useful error if a file is missing.

## Format rule

Keep the `.mp3` extension only for real MP3 files. If you later use WAV, update the filename and `src` in `assets/data/audio-library.json`.

## Licence note

This generated package does not include the BBC audio files. If you add them, keep the BBC source links and check that your use matches the BBC Sound Effects terms for your project context.
