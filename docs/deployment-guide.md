# Deployment guide

## Local test

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## GitHub Pages

- Keep `.nojekyll` in the root.
- Upload all files and folders.
- Add the three MP3 files to `assets/audio/bbc/` if you want ambience.
- Enable GitHub Pages in repository settings.

## Service worker

The service worker pre-caches the app shell and JSON data. Audio files are not pre-cached in the generated zip because they are not included; once you add the files, they are runtime-cached after first successful playback.
