# Word data guide

The word archive lives in:

```text
assets/data/words.json
```

Each entry requires:

```json
{
  "id": 1,
  "word": "chinwag",
  "pos": "noun / verb",
  "meaning": "friendly chat",
  "register": "British informal / everyday",
  "category": "British everyday charm",
  "note": "Usage note.",
  "example": "Example sentence."
}
```

Run validation with:

```bash
npm run validate:words
```

The daily pick algorithm is unchanged from the single-file prototype: it uses the browser's local date to choose a deterministic slot in the yearly cycle.
