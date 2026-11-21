// Lantern Harbor — Spot the Difference: deterministic screenshot states.
// The screenshots are real renders of the game, driven by a ?shot= query
// so the same URL always shows the same frame:
//   ?shot=start   title screen, level 1 preview behind it
//   ?shot=play    level 1 mid-game, 3 differences found, 5 still to find
//   ?shot=level2  level 2 mid-game, 2 found, 6 still to find
//   ?shot=end     level 1 cleared, win panel with the final time
// In shot mode the clock is frozen at the preset time, so two runs of the
// same URL render the same frame.

export const SHOTS = {
  start: { level: 0, found: [], elapsedMs: 0, mistakes: 0, screen: 'title' },
  play: { level: 0, found: [0, 2, 4], elapsedMs: 47_000, mistakes: 1, screen: 'playing' },
  level2: { level: 1, found: [0, 3], elapsedMs: 72_000, mistakes: 0, screen: 'playing' },
  end: { level: 0, found: [0, 1, 2, 3, 4, 5, 6, 7], elapsedMs: 96_000, mistakes: 2, screen: 'won' },
};

export function readShot() {
  let params;
  try {
    params = new URLSearchParams(window.location.search);
  } catch {
    return null;
  }
  const name = params.get('shot');
  if (!name || !Object.hasOwn(SHOTS, name)) return null;
  const preset = SHOTS[name];
  return { name, ...preset };
}

// In shot mode the animation clock is frozen, so pulsing markers and the
// timer never drift between two renders of the same URL.
export function shotNow(preset) {
  return preset ? 1_700_000_000_000 + preset.elapsedMs : Date.now();
}
