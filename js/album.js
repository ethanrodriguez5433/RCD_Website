/* ================================================================
   album.js
   Preview player for the "Latest Album" track list.

   Each <li class="track"> in the markup carries:
     data-src       — path to the audio file (required)
     data-start     — seconds into the track where the preview begins
                      (default 0)
     data-duration  — seconds the preview runs for
                      (defaults to PREVIEW_DURATION below)

   Behaviour:
     • Click a play button → starts a preview from data-start for
       `duration` seconds, then auto-stops.
     • Click the same button again while it's playing → stops.
     • Click a different track while one is playing → stops the old
       and starts the new (only one track plays at a time).
   ================================================================ */

/* ┌─────────────────────────────────────────────────────────────┐
   │ CHANGE THIS to retune every preview at once.                │
   │ Per-track override: add data-duration="10" on any <li>.     │
   └─────────────────────────────────────────────────────────────┘ */
const PREVIEW_DURATION = 15; // seconds

// One shared Audio element for all tracks. Reusing it guarantees
// "only one preview plays at a time" for free — setting .src on
// an already-playing audio stops the previous file automatically.
const audio = new Audio();

let currentTrack = null;
let stopTimer = null;
// Incremented on every click; play() promises that resolve late
// compare against this and bail if they've been superseded.
let generation = 0;

function stop() {
  audio.pause();
  clearTimeout(stopTimer);
  stopTimer = null;
  if (currentTrack) {
    currentTrack.classList.remove('playing');
    currentTrack = null;
  }
}

// If the file happens to be shorter than the preview window,
// clean up the UI when it ends naturally.
audio.addEventListener('ended', stop);

document.querySelectorAll('.track').forEach(track => {
  const btn = track.querySelector('.track-play');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    // Clicking the currently-playing track toggles it off.
    if (currentTrack === track) {
      stop();
      return;
    }

    const src = track.dataset.src;
    if (!src) {
      console.warn('Track is missing data-src:', track);
      return;
    }

    const start = parseFloat(track.dataset.start) || 0;
    const duration = parseFloat(track.dataset.duration) || PREVIEW_DURATION;

    // Stop whatever's playing, then start this one.
    stop();
    const myGen = ++generation;

    // Flip the UI first — play() is async and we want the icon
    // to swap immediately for snappy feedback.
    currentTrack = track;
    track.classList.add('playing');

    audio.src = src;
    audio.currentTime = start;

    audio.play()
      .then(() => {
        // A newer click has already taken over — don't set a
        // stop-timer for a playback that's no longer active.
        if (myGen !== generation) return;
        stopTimer = setTimeout(stop, duration * 1000);
      })
      .catch(err => {
        if (myGen !== generation) return;
        console.error(`Couldn't play ${src}:`, err);
        stop();
      });
  });
});
