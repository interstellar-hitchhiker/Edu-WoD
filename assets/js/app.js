import {
  dailyPick,
  formatDate,
  highlightWord,
  localDateKey,
  normalise,
  validateWords
} from './word-engine.js';
import { loadSet, saveSet } from './storage.js';
import { createAmbiencePlayer } from './audio-player.js';

const STORE_KEY = 'dailyLexicalBiscuit.favourites.v1';

let WORDS = [];
let CATEGORY_COUNT = 0;

const els = {
  dateText: document.getElementById('dateText'),
  posTag: document.getElementById('posTag'),
  registerTag: document.getElementById('registerTag'),
  modeTag: document.getElementById('modeTag'),
  wordText: document.getElementById('wordText'),
  meaningText: document.getElementById('meaningText'),
  exampleText: document.getElementById('exampleText'),
  noteText: document.getElementById('noteText'),
  categoryText: document.getElementById('categoryText'),
  archiveNumber: document.getElementById('archiveNumber'),
  categoryNumber: document.getElementById('categoryNumber'),
  cycleNumber: document.getElementById('cycleNumber'),
  favCount: document.getElementById('favCount'),
  wordNumber: document.getElementById('wordNumber'),
  todayBtn: document.getElementById('todayBtn'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  randomBtn: document.getElementById('randomBtn'),
  copyBtn: document.getElementById('copyBtn'),
  favBtn: document.getElementById('favBtn'),
  searchInput: document.getElementById('searchInput'),
  archiveList: document.getElementById('archiveList'),
  toast: document.getElementById('toast'),
  audioNow: document.getElementById('audioNow'),
  ambienceSelect: document.getElementById('ambienceSelect'),
  audioPlayBtn: document.getElementById('audioPlayBtn'),
  audioPauseBtn: document.getElementById('audioPauseBtn'),
  ambienceVolume: document.getElementById('ambienceVolume'),
  ambienceVolumeText: document.getElementById('ambienceVolumeText'),
  audioCredit: document.getElementById('audioCredit'),
  audioSourceLink: document.getElementById('audioSourceLink'),
  ambienceAudio: document.getElementById('ambienceAudio')
};

const state = {
  index: 0,
  mode: 'Today',
  favourites: loadSet(STORE_KEY),
  dailyIndex: 0,
  dailySlot: 0
};

function saveFavourites() {
  saveSet(STORE_KEY, state.favourites);
}

function showToast(text) {
  els.toast.textContent = text;
  els.toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove('show'), 1500);
}

function setWord(index, mode = 'Archive') {
  state.index = ((index % WORDS.length) + WORDS.length) % WORDS.length;
  state.mode = mode;
  const entry = WORDS[state.index];

  document.title = `${entry.word} — The Daily Lexical Biscuit`;
  els.posTag.textContent = entry.pos;
  els.registerTag.textContent = entry.register;
  els.modeTag.textContent = mode;
  els.wordText.textContent = entry.word;
  els.meaningText.textContent = entry.meaning;
  els.exampleText.innerHTML = highlightWord(entry.example, entry.word);
  els.noteText.textContent = entry.note;
  els.categoryText.innerHTML = `<strong>${entry.category}</strong><br>${entry.register}. Archive mix: ${CATEGORY_COUNT} themed shelves. This card uses one chosen sense, because several English words change part of speech depending on context.`;
  els.wordNumber.textContent = `#${entry.id}`;
  els.archiveNumber.textContent = WORDS.length;
  els.categoryNumber.textContent = CATEGORY_COUNT;
  els.cycleNumber.textContent = state.dailySlot;
  updateFavouriteButton();
  renderArchive();
}

function updateFavouriteButton() {
  const entry = WORDS[state.index];
  const isFav = state.favourites.has(entry.id);
  els.favBtn.textContent = isFav ? 'Saved ★' : 'Save favourite';
  els.favBtn.classList.toggle('starred', isFav);
  els.favCount.textContent = state.favourites.size;
}

function copyCard() {
  const entry = WORDS[state.index];
  const date = localDateKey(new Date());
  const text = [
    `The Daily Lexical Biscuit — ${date}`,
    `${entry.word} (${entry.pos})`,
    `Meaning: ${entry.meaning}`,
    `Register: ${entry.register}`,
    `Example: ${entry.example}`,
    `Usage note: ${entry.note}`
  ].join('\n');

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Copied the word card.'))
      .catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('Copied the word card.');
  } catch {
    showToast('Copy not available here.');
  }
  document.body.removeChild(textarea);
}

function toggleFavourite() {
  const entry = WORDS[state.index];
  if (state.favourites.has(entry.id)) {
    state.favourites.delete(entry.id);
    showToast('Removed from favourites.');
  } else {
    state.favourites.add(entry.id);
    showToast('Saved to favourites.');
  }
  saveFavourites();
  updateFavouriteButton();
  renderArchive();
}

function renderArchive() {
  const query = normalise(els.searchInput.value.trim());
  const matches = WORDS.filter(entry => {
    if (!query) return true;
    const haystack = normalise(`${entry.word} ${entry.pos} ${entry.meaning} ${entry.register} ${entry.category} ${entry.note}`);
    return haystack.includes(query);
  });

  const html = matches.slice(0, 365).map(entry => {
    const fav = state.favourites.has(entry.id) ? ' ★' : '';
    const selected = WORDS[state.index].id === entry.id ? ' aria-current="true"' : '';
    return `
      <button class="item" data-id="${entry.id}" role="option"${selected}>
        <span class="num">#${entry.id}</span>
        <span>
          <strong>${entry.word}${fav}</strong>
          <span>${entry.pos} · ${entry.meaning}</span>
        </span>
      </button>
    `;
  }).join('');

  els.archiveList.innerHTML = html || '<div class="item"><span class="num">—</span><span><strong>No matches</strong><span>Try a broader search.</span></span></div>';
}

function jumpBy(delta) {
  setWord(state.index + delta, 'Archive stroll');
}

function randomWord() {
  let next = Math.floor(Math.random() * WORDS.length);
  if (WORDS.length > 1 && next === state.index) next = (next + 1) % WORDS.length;
  setWord(next, 'Random biscuit');
}

function goToday() {
  setWord(state.dailyIndex, 'Today');
}

function bindEvents() {
  els.todayBtn.addEventListener('click', goToday);
  els.prevBtn.addEventListener('click', () => jumpBy(-1));
  els.nextBtn.addEventListener('click', () => jumpBy(1));
  els.randomBtn.addEventListener('click', randomWord);
  els.copyBtn.addEventListener('click', copyCard);
  els.favBtn.addEventListener('click', toggleFavourite);
  els.searchInput.addEventListener('input', renderArchive);

  els.archiveList.addEventListener('click', event => {
    const item = event.target.closest('[data-id]');
    if (!item) return;
    const id = Number(item.dataset.id);
    const index = WORDS.findIndex(entry => entry.id === id);
    if (index >= 0) {
      setWord(index, 'Archive');
      showToast(`Opened #${id}.`);
    }
  });

  window.addEventListener('keydown', event => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (event.key === 'ArrowLeft') jumpBy(-1);
    if (event.key === 'ArrowRight') jumpBy(1);
    if (event.key.toLowerCase() === 'r') randomWord();
    if (event.key.toLowerCase() === 't') goToday();
    if (event.key.toLowerCase() === 'f') toggleFavourite();
  });
}

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
  return response.json();
}

async function init() {
  try {
    WORDS = await loadJson('assets/data/words.json');
    const errors = validateWords(WORDS);
    if (errors.length) {
      console.warn('Word data validation warnings:', errors);
    }
    CATEGORY_COUNT = new Set(WORDS.map(entry => entry.category)).size;

    const now = new Date();
    const pick = dailyPick(WORDS, now);
    state.dailyIndex = pick.index;
    state.dailySlot = pick.slot;
    els.dateText.textContent = formatDate(now);

    bindEvents();
    goToday();

    try {
      const tracks = await loadJson('assets/data/audio-library.json');
      createAmbiencePlayer(els, tracks, showToast);
    } catch (error) {
      console.warn(error);
      els.audioNow.textContent = 'Ambience library could not be loaded.';
    }
  } catch (error) {
    console.error(error);
    els.wordText.textContent = 'data error';
    els.meaningText.textContent = 'Could not load the word archive.';
    els.exampleText.textContent = 'Run this app from a local server or GitHub Pages, not directly from file://.';
    showToast('Word data failed to load.');
  }
}

init();
