// Lantern Harbor — Spot the Difference: tiny WebAudio bleeps, no assets.
// Everything is synthesised at click time; if audio is unavailable the
// game simply stays silent.

let ctx = null;

function audioCtx() {
  if (ctx) return ctx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  } catch {
    return null;
  }
  return ctx;
}

function blip(freq, dur, type, vol, when = 0) {
  const ac = audioCtx();
  if (!ac) return;
  try {
    if (ac.state === 'suspended') void ac.resume();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ac.currentTime + when);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + when + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + when);
    osc.stop(ac.currentTime + when + dur);
  } catch {
    // Sound is decoration; never let it break the game.
  }
}

// A bright two-note chime when a difference is found.
export function playFound() {
  blip(660, 0.12, 'sine', 0.12);
  blip(880, 0.18, 'sine', 0.12, 0.09);
}

// A low thud for a wrong click.
export function playMiss() {
  blip(160, 0.14, 'triangle', 0.1);
}

// A little arpeggio when a level is cleared.
export function playWin() {
  blip(523, 0.14, 'sine', 0.12);
  blip(659, 0.14, 'sine', 0.12, 0.12);
  blip(784, 0.2, 'sine', 0.12, 0.24);
  blip(1047, 0.3, 'sine', 0.12, 0.36);
}

// A soft tick for the hint button.
export function playHint() {
  blip(440, 0.1, 'sine', 0.08);
}
