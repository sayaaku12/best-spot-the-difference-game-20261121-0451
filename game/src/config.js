// Lantern Harbor — Spot the Difference: shared constants for the game.
// All layout is in a fixed 1280x720 canvas, scaled by CSS to fit the window.

export const CANVAS_W = 1280;
export const CANVAS_H = 720;

// Top HUD strip and bottom bar.
export const HUD_H = 72;
export const BAR_Y = 636;

// The two picture panels, side by side.
export const PANEL_W = 600;
export const PANEL_H = 540;
export const PANEL_Y = 84;
export const PANEL_GAP = 24;
export const LEFT_X = 28;
export const RIGHT_X = LEFT_X + PANEL_W + PANEL_GAP;

// Click tolerance, in panel pixels, around a difference centre.
export const CLICK_RADIUS = 34;

// How many differences each level hides.
export const DIFFS_PER_LEVEL = 8;

// Mistakes allowed before the hint button starts flashing (no fail state;
// the game stays friendly, the counter just tracks accuracy).
export const HINT_FLASH_AFTER = 3;

// Level select: name, short tagline, accent colour.
export const LEVELS = [
  { id: 0, name: 'Harbor Dusk', tag: 'lanterns over the bay', accent: '#f7b267' },
  { id: 1, name: 'Forest Camp', tag: 'a night under the pines', accent: '#8ecae6' },
  { id: 2, name: 'Market Morning', tag: 'stalls, fruit and gossip', accent: '#e07a5f' },
];

// Colours shared by the HUD and overlays.
export const COLORS = {
  hudBg: '#141a2e',
  hudLine: '#2a3352',
  hudText: '#f4ead8',
  hudDim: '#9aa5c4',
  panelFrame: '#0d1120',
  panelLabel: '#f4ead8',
  marker: '#ffd166',
  markerBad: '#ef476f',
  button: '#f7b267',
  buttonText: '#1d2340',
  overlay: 'rgba(10, 13, 26, 0.82)',
};
