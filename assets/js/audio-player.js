export function createAmbiencePlayer(els, tracks, showToast) {
  const state = {
    tracks: Array.isArray(tracks) ? tracks : [],
    current: null,
    playing: false
  };

  const setStatus = (message) => {
    els.audioNow.textContent = message;
  };

  const updateCredit = (track) => {
    if (!track) {
      els.audioCredit.innerHTML = 'Audio files are not included. Add the three MP3s to <code>assets/audio/bbc/</code>.';
      els.audioSourceLink.href = 'docs/audio-guide.md';
      els.audioSourceLink.textContent = 'Audio guide';
      return;
    }
    els.audioCredit.textContent = `${track.label} — ${track.credit}. File: ${track.filename}`;
    els.audioSourceLink.href = track.source;
    els.audioSourceLink.textContent = 'BBC Sound Effects source';
  };

  const renderOptions = () => {
    const options = ['<option value="">Off</option>'].concat(state.tracks.map(track => (
      `<option value="${track.id}">${track.label}</option>`
    )));
    els.ambienceSelect.innerHTML = options.join('');
  };

  const setVolume = () => {
    const value = Number(els.ambienceVolume.value || 35);
    els.ambienceAudio.volume = Math.max(0, Math.min(1, value / 100));
    els.ambienceVolumeText.textContent = Math.round(value);
  };

  const pause = (message = 'Ambience paused.') => {
    els.ambienceAudio.pause();
    state.playing = false;
    if (message) setStatus(message);
  };

  const selectTrack = (id, { restart = false } = {}) => {
    const track = state.tracks.find(item => item.id === id) || null;
    state.current = track;

    if (!track) {
      els.ambienceAudio.removeAttribute('src');
      els.ambienceAudio.load();
      updateCredit(null);
      pause('Ambience off.');
      return;
    }

    const wasPlaying = restart || state.playing || !els.ambienceAudio.paused;
    els.ambienceAudio.pause();
    els.ambienceAudio.src = track.src;
    els.ambienceAudio.loop = true;
    els.ambienceAudio.load();
    updateCredit(track);
    setStatus(`Selected: ${track.label}.`);

    if (wasPlaying) {
      play();
    }
  };

  const play = async () => {
    if (!state.current) {
      const firstTrack = state.tracks[0];
      if (!firstTrack) {
        showToast('No ambience tracks configured.');
        return;
      }
      els.ambienceSelect.value = firstTrack.id;
      selectTrack(firstTrack.id);
    }

    try {
      setVolume();
      await els.ambienceAudio.play();
      state.playing = true;
      setStatus(`Playing: ${state.current.label}.`);
    } catch (error) {
      state.playing = false;
      setStatus(`Could not play ${state.current?.label || 'ambience'}. Check that the MP3 exists in assets/audio/bbc/.`);
      showToast('Audio file missing or blocked.');
      console.warn(error);
    }
  };

  renderOptions();
  setVolume();
  updateCredit(null);

  els.ambienceSelect.addEventListener('change', () => {
    selectTrack(els.ambienceSelect.value, { restart: state.playing });
  });
  els.audioPlayBtn.addEventListener('click', play);
  els.audioPauseBtn.addEventListener('click', () => pause());
  els.ambienceVolume.addEventListener('input', setVolume);

  els.ambienceAudio.addEventListener('error', () => {
    if (!state.current) return;
    state.playing = false;
    setStatus(`Missing or unplayable file: ${state.current.filename}. Put it in assets/audio/bbc/.`);
  });

  els.ambienceAudio.addEventListener('ended', () => {
    state.playing = false;
  });

  return { play, pause, selectTrack };
}
