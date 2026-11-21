// Lantern Harbor — Spot the Difference: the three picture scenes.
// Every scene is drawn twice — variant 0 is the LEFT picture, variant 1
// the RIGHT picture — from one painter, so the two sides differ only where
// a difference is planted. Coordinates are normalised (0..1 across the
// panel); diffs carry the same normalised centre plus a radius in the same
// units, so clicks map cleanly in either panel.

import { circle, cloud, ellipse, gull, pine, rr, sky, sparkle } from './render.js';

// Panel geometry helpers: X(u)/Y(v) map normalised coords into the panel,
// S scales line widths and small sizes with the panel width.
function geom(px, py, pw, ph) {
  return {
    X: (u) => px + u * pw,
    Y: (v) => py + v * ph,
    S: pw / 600,
  };
}

// ---------------------------------------------------------------- harbor
// A fishing harbour at dusk: lighthouse, cottages, dock, boats, gulls.

function drawHarbor(ctx, px, py, pw, ph, variant) {
  const { X, Y, S } = geom(px, py, pw, ph);
  sky(ctx, px, py, pw, ph * 0.55, [
    [0, '#2e3a67'],
    [0.55, '#c96f4a'],
    [1, '#f2b25c'],
  ]);

  // Setting sun with a soft glow.
  ctx.save();
  const glow = ctx.createRadialGradient(X(0.8), Y(0.3), 4, X(0.8), Y(0.3), 90 * S);
  glow.addColorStop(0, 'rgba(255, 217, 160, 0.9)');
  glow.addColorStop(1, 'rgba(255, 217, 160, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(px, py, pw, ph * 0.55);
  ctx.fillStyle = '#ffd9a0';
  circle(ctx, X(0.8), Y(0.3), 26 * S);
  ctx.fill();
  ctx.restore();

  // Crescent moon, top left — difference 7 (absent on the right).
  if (variant === 0) {
    ctx.fillStyle = '#f4ead8';
    circle(ctx, X(0.12), Y(0.12), 20 * S);
    ctx.fill();
    ctx.fillStyle = '#3a4a7d';
    circle(ctx, X(0.13), Y(0.11), 17 * S);
    ctx.fill();
  }

  cloud(ctx, X(0.3), Y(0.14), 0.9 * S, 'rgba(244, 234, 216, 0.75)');
  cloud(ctx, X(0.62), Y(0.09), 0.7 * S, 'rgba(244, 234, 216, 0.6)');
  cloud(ctx, X(0.92), Y(0.2), 0.6 * S, 'rgba(244, 234, 216, 0.5)');

  // Seagulls — difference 2: the middle gull is missing on the right.
  gull(ctx, X(0.35), Y(0.18), S, '#1d2340');
  if (variant === 0) gull(ctx, X(0.42), Y(0.14), S, '#1d2340');
  gull(ctx, X(0.5), Y(0.2), S, '#1d2340');

  // Distant headland.
  ctx.fillStyle = '#233054';
  ctx.beginPath();
  ctx.moveTo(px, Y(0.55));
  ctx.quadraticCurveTo(X(0.25), Y(0.44), X(0.5), Y(0.53));
  ctx.quadraticCurveTo(X(0.75), Y(0.6), X(1), Y(0.5));
  ctx.lineTo(px + pw, Y(0.55));
  ctx.closePath();
  ctx.fill();

  // Sea.
  const sea = ctx.createLinearGradient(px, Y(0.55), px, py + ph);
  sea.addColorStop(0, '#2a6f7e');
  sea.addColorStop(1, '#17455c');
  ctx.fillStyle = sea;
  ctx.fillRect(px, Y(0.55), pw, ph * 0.45);

  // Sun glitter on the water.
  ctx.fillStyle = 'rgba(255, 217, 160, 0.55)';
  for (let i = 0; i < 7; i++) {
    const wob = 26 * S + (i % 3) * 14 * S;
    ctx.fillRect(X(0.8) - wob / 2, Y(0.58 + i * 0.055), wob, 3 * S);
  }
  // Wave lines.
  ctx.strokeStyle = 'rgba(244, 234, 216, 0.35)';
  ctx.lineWidth = 2 * S;
  for (const [u, v, len] of [[0.15, 0.66, 0.1], [0.55, 0.72, 0.12], [0.3, 0.85, 0.14], [0.75, 0.9, 0.1], [0.6, 0.62, 0.08]]) {
    ctx.beginPath();
    ctx.moveTo(X(u), Y(v));
    ctx.quadraticCurveTo(X(u + len / 2), Y(v - 0.012), X(u + len), Y(v));
    ctx.stroke();
  }

  // Lighthouse on the rocks, left side.
  ctx.fillStyle = '#5b6472';
  ellipse(ctx, X(0.12), Y(0.6), 62 * S, 16 * S);
  ctx.fill();
  ellipse(ctx, X(0.19), Y(0.61), 34 * S, 11 * S);
  ctx.fill();
  // Tower: white with two red bands.
  ctx.fillStyle = '#f4ead8';
  ctx.beginPath();
  ctx.moveTo(X(0.09), Y(0.6));
  ctx.lineTo(X(0.105), Y(0.32));
  ctx.lineTo(X(0.145), Y(0.32));
  ctx.lineTo(X(0.16), Y(0.6));
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#d64545';
  ctx.fillRect(X(0.098), Y(0.44), 0.058 * pw, 0.045 * ph);
  ctx.fillRect(X(0.104), Y(0.53), 0.05 * pw, 0.04 * ph);
  // Gallery + lamp room.
  ctx.fillStyle = '#1d2340';
  ctx.fillRect(X(0.095), Y(0.3), 0.06 * pw, 0.025 * ph);
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(X(0.105), Y(0.27), 0.04 * pw, 0.032 * ph);
  ctx.fillStyle = '#1d2340';
  ctx.beginPath();
  ctx.moveTo(X(0.1), Y(0.27));
  ctx.lineTo(X(0.125), Y(0.235));
  ctx.lineTo(X(0.15), Y(0.27));
  ctx.closePath();
  ctx.fill();
  // Beam — difference 1: lit on the left, dark on the right.
  if (variant === 0) {
    const beam = ctx.createLinearGradient(X(0.15), Y(0.28), X(0.45), Y(0.3));
    beam.addColorStop(0, 'rgba(255, 209, 102, 0.55)');
    beam.addColorStop(1, 'rgba(255, 209, 102, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(X(0.15), Y(0.27));
    ctx.lineTo(X(0.45), Y(0.22));
    ctx.lineTo(X(0.45), Y(0.36));
    ctx.lineTo(X(0.15), Y(0.3));
    ctx.closePath();
    ctx.fill();
  }

  // Cottages on the far shore, right side.
  for (const [hx, hw, hh, roof] of [[0.56, 0.09, 0.09, '#7a4a3a'], [0.68, 0.11, 0.11, '#5f6f8e']]) {
    ctx.fillStyle = '#f2d8a7';
    ctx.fillRect(X(hx), Y(0.55 - hh), hw * pw, hh * ph);
    ctx.fillStyle = roof;
    ctx.beginPath();
    ctx.moveTo(X(hx - 0.01), Y(0.55 - hh));
    ctx.lineTo(X(hx + hw / 2), Y(0.55 - hh - 0.05));
    ctx.lineTo(X(hx + hw + 0.01), Y(0.55 - hh));
    ctx.closePath();
    ctx.fill();
    // Window: lit on the left, dark on the right — difference 4.
    ctx.fillStyle = variant === 0 ? '#ffd166' : '#2a3352';
    ctx.fillRect(X(hx + hw * 0.32), Y(0.55 - hh * 0.62), 0.02 * pw, 0.03 * ph);
    ctx.strokeStyle = '#1d2340';
    ctx.lineWidth = 1.5 * S;
    ctx.strokeRect(X(hx + hw * 0.32), Y(0.55 - hh * 0.62), 0.02 * pw, 0.03 * ph);
  }
  // Chimney smoke curls.
  ctx.strokeStyle = 'rgba(244, 234, 216, 0.5)';
  ctx.lineWidth = 2.5 * S;
  ctx.beginPath();
  ctx.moveTo(X(0.72), Y(0.4));
  ctx.quadraticCurveTo(X(0.74), Y(0.36), X(0.72), Y(0.33));
  ctx.quadraticCurveTo(X(0.7), Y(0.3), X(0.72), Y(0.27));
  ctx.stroke();

  // Wooden dock, bottom centre-left.
  ctx.fillStyle = '#6b4a2f';
  ctx.beginPath();
  ctx.moveTo(X(0.28), Y(1));
  ctx.lineTo(X(0.32), Y(0.78));
  ctx.lineTo(X(0.5), Y(0.78));
  ctx.lineTo(X(0.54), Y(1));
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#4a3220';
  ctx.lineWidth = 2 * S;
  for (let i = 0; i < 5; i++) {
    const v = 0.8 + i * 0.05;
    ctx.beginPath();
    ctx.moveTo(X(0.3 + (v - 0.78) * 0.18), Y(v));
    ctx.lineTo(X(0.48 + (v - 0.78) * 0.27), Y(v));
    ctx.stroke();
  }

  // Crates on the dock — difference 8: three crates on the left, two on the right.
  const crate = (cx, cy, s) => {
    ctx.fillStyle = '#a4713a';
    ctx.fillRect(X(cx) - s / 2, Y(cy) - s / 2, s, s);
    ctx.strokeStyle = '#6b4a2f';
    ctx.lineWidth = 2 * S;
    ctx.strokeRect(X(cx) - s / 2, Y(cy) - s / 2, s, s);
    ctx.beginPath();
    ctx.moveTo(X(cx) - s / 2, Y(cy) - s / 2);
    ctx.lineTo(X(cx) + s / 2, Y(cy) + s / 2);
    ctx.moveTo(X(cx) + s / 2, Y(cy) - s / 2);
    ctx.lineTo(X(cx) - s / 2, Y(cy) + s / 2);
    ctx.stroke();
  };
  crate(0.42, 0.9, 30 * S);
  crate(0.475, 0.9, 30 * S);
  if (variant === 0) crate(0.447, 0.83, 30 * S);

  // Cat sitting on the dock — difference 6 (absent on the right).
  if (variant === 0) {
    ctx.fillStyle = '#1d2340';
    ellipse(ctx, X(0.36), Y(0.83), 13 * S, 16 * S);
    ctx.fill();
    circle(ctx, X(0.36), Y(0.775), 10 * S);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(X(0.35), Y(0.77));
    ctx.lineTo(X(0.348), Y(0.745));
    ctx.lineTo(X(0.358), Y(0.765));
    ctx.moveTo(X(0.37), Y(0.77));
    ctx.lineTo(X(0.372), Y(0.745));
    ctx.lineTo(X(0.38), Y(0.765));
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(X(0.372), Y(0.835));
    ctx.quadraticCurveTo(X(0.4), Y(0.83), X(0.395), Y(0.79));
    ctx.strokeStyle = '#1d2340';
    ctx.lineWidth = 4 * S;
    ctx.stroke();
  }

  // Sailboat — difference 3: red sail on the left, teal on the right.
  ctx.fillStyle = '#5b3a29';
  ctx.beginPath();
  ctx.moveTo(X(0.4), Y(0.68));
  ctx.lineTo(X(0.52), Y(0.68));
  ctx.lineTo(X(0.49), Y(0.72));
  ctx.lineTo(X(0.43), Y(0.72));
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3a2a1a';
  ctx.lineWidth = 2.5 * S;
  ctx.beginPath();
  ctx.moveTo(X(0.46), Y(0.68));
  ctx.lineTo(X(0.46), Y(0.5));
  ctx.stroke();
  ctx.fillStyle = variant === 0 ? '#d64545' : '#2a9d8f';
  ctx.beginPath();
  ctx.moveTo(X(0.46), Y(0.51));
  ctx.lineTo(X(0.46), Y(0.66));
  ctx.lineTo(X(0.55), Y(0.66));
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = variant === 0 ? '#e87a5a' : '#5ac8b8';
  ctx.beginPath();
  ctx.moveTo(X(0.455), Y(0.52));
  ctx.lineTo(X(0.455), Y(0.66));
  ctx.lineTo(X(0.39), Y(0.66));
  ctx.closePath();
  ctx.fill();

  // Little rowboat, far right.
  ctx.fillStyle = '#7a4a3a';
  ctx.beginPath();
  ctx.moveTo(X(0.84), Y(0.82));
  ctx.lineTo(X(0.93), Y(0.82));
  ctx.lineTo(X(0.9), Y(0.85));
  ctx.lineTo(X(0.87), Y(0.85));
  ctx.closePath();
  ctx.fill();

  // Buoy — difference 5 (absent on the right).
  if (variant === 0) {
    ctx.fillStyle = '#d64545';
    ctx.beginPath();
    ctx.moveTo(X(0.7), Y(0.72));
    ctx.lineTo(X(0.74), Y(0.72));
    ctx.lineTo(X(0.73), Y(0.68));
    ctx.lineTo(X(0.71), Y(0.68));
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f4ead8';
    ctx.fillRect(X(0.705), Y(0.7), 0.03 * pw, 0.012 * ph);
    ctx.fillStyle = '#1d2340';
    ctx.fillRect(X(0.717), Y(0.66), 0.006 * pw, 0.02 * ph);
    sparkle(ctx, X(0.72), Y(0.645), 5 * S, '#ffd166');
  }
}

const HARBOR_DIFFS = [
  { id: 0, x: 0.42, y: 0.29, r: 0.06, label: 'lighthouse beam' },
  { id: 1, x: 0.42, y: 0.14, r: 0.045, label: 'missing gull' },
  { id: 2, x: 0.47, y: 0.6, r: 0.05, label: 'sail colour' },
  { id: 3, x: 0.63, y: 0.475, r: 0.04, label: 'lit window' },
  { id: 4, x: 0.72, y: 0.7, r: 0.045, label: 'buoy' },
  { id: 5, x: 0.36, y: 0.8, r: 0.045, label: 'dock cat' },
  { id: 6, x: 0.12, y: 0.12, r: 0.05, label: 'moon' },
  { id: 7, x: 0.447, y: 0.83, r: 0.045, label: 'top crate' },
];

// ------------------------------------------------------------ forest camp
// A campsite at night: tent, campfire, lantern, owl, mushrooms, stars.

function drawForest(ctx, px, py, pw, ph, variant) {
  const { X, Y, S } = geom(px, py, pw, ph);
  sky(ctx, px, py, pw, ph * 0.62, [
    [0, '#0d1b3e'],
    [0.6, '#1d3a5f'],
    [1, '#2c4a6b'],
  ]);

  // Stars, seeded so both panels share the sky.
  for (let i = 0; i < 42; i++) {
    const sx = 0.03 + ((i * 37) % 97) / 100;
    const sy = 0.03 + ((i * 53) % 47) / 100;
    if (sx > 0.96 || sy > 0.5) continue;
    const r = 1 + (i % 3) * 0.7;
    ctx.fillStyle = i % 5 === 0 ? '#ffd166' : 'rgba(244, 234, 216, 0.9)';
    circle(ctx, X(sx), Y(sy), r * S);
    ctx.fill();
  }

  // Moon — difference 8: full on the left, crescent on the right.
  ctx.fillStyle = '#f4ead8';
  circle(ctx, X(0.15), Y(0.12), 22 * S);
  ctx.fill();
  if (variant === 1) {
    ctx.fillStyle = '#16294d';
    circle(ctx, X(0.16), Y(0.11), 19 * S);
    ctx.fill();
  }

  // Shooting star — difference 6 (absent on the right).
  if (variant === 0) {
    ctx.strokeStyle = 'rgba(255, 209, 102, 0.9)';
    ctx.lineWidth = 2.5 * S;
    ctx.beginPath();
    ctx.moveTo(X(0.72), Y(0.12));
    ctx.lineTo(X(0.8), Y(0.17));
    ctx.stroke();
    sparkle(ctx, X(0.8), Y(0.17), 6 * S, '#ffd166');
  }

  cloud(ctx, X(0.45), Y(0.1), 0.8 * S, 'rgba(120, 140, 190, 0.5)');
  cloud(ctx, X(0.85), Y(0.24), 0.6 * S, 'rgba(120, 140, 190, 0.4)');

  // Back pines.
  for (const [u, h] of [[0.06, 150], [0.2, 120], [0.88, 160], [0.97, 130]]) {
    pine(ctx, X(u), Y(0.62), h * S, '#16351f', '#1e4a2a');
  }
  // Front pines, framing the clearing.
  pine(ctx, X(0.02), Y(0.66), 230 * S, '#0f2a18', '#173d22');
  pine(ctx, X(0.98), Y(0.66), 210 * S, '#0f2a18', '#173d22');

  // Owl on a branch — difference 2 (absent on the right).
  ctx.strokeStyle = '#3a2a1a';
  ctx.lineWidth = 6 * S;
  ctx.beginPath();
  ctx.moveTo(X(0.82), Y(0.42));
  ctx.lineTo(X(0.94), Y(0.38));
  ctx.stroke();
  if (variant === 0) {
    ctx.fillStyle = '#8a6f4d';
    ellipse(ctx, X(0.88), Y(0.36), 14 * S, 18 * S);
    ctx.fill();
    circle(ctx, X(0.88), Y(0.325), 10 * S);
    ctx.fill();
    ctx.fillStyle = '#ffd166';
    circle(ctx, X(0.875), Y(0.322), 2.5 * S);
    ctx.fill();
    circle(ctx, X(0.885), Y(0.322), 2.5 * S);
    ctx.fill();
    ctx.fillStyle = '#1d2340';
    circle(ctx, X(0.875), Y(0.322), 1.2 * S);
    ctx.fill();
    circle(ctx, X(0.885), Y(0.322), 1.2 * S);
    ctx.fill();
  }

  // Ground.
  const ground = ctx.createLinearGradient(px, Y(0.62), px, py + ph);
  ground.addColorStop(0, '#22401f');
  ground.addColorStop(1, '#12260f');
  ctx.fillStyle = ground;
  ctx.fillRect(px, Y(0.62), pw, ph * 0.38);
  // Grass tufts.
  ctx.strokeStyle = '#2e5a26';
  ctx.lineWidth = 2 * S;
  for (let i = 0; i < 14; i++) {
    const gx = 0.05 + ((i * 67) % 90) / 100;
    const gy = 0.66 + ((i * 29) % 30) / 100;
    ctx.beginPath();
    ctx.moveTo(X(gx), Y(gy));
    ctx.lineTo(X(gx - 0.008), Y(gy - 0.02));
    ctx.moveTo(X(gx), Y(gy));
    ctx.lineTo(X(gx + 0.008), Y(gy - 0.022));
    ctx.stroke();
  }

  // Tent — difference 3: door open (warm light inside) vs closed.
  ctx.fillStyle = '#e07a5f';
  ctx.beginPath();
  ctx.moveTo(X(0.28), Y(0.68));
  ctx.lineTo(X(0.42), Y(0.46));
  ctx.lineTo(X(0.56), Y(0.68));
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c65a40';
  ctx.beginPath();
  ctx.moveTo(X(0.42), Y(0.46));
  ctx.lineTo(X(0.56), Y(0.68));
  ctx.lineTo(X(0.42), Y(0.68));
  ctx.closePath();
  ctx.fill();
  // Tent pole + flag.
  ctx.strokeStyle = '#3a2a1a';
  ctx.lineWidth = 2.5 * S;
  ctx.beginPath();
  ctx.moveTo(X(0.42), Y(0.46));
  ctx.lineTo(X(0.42), Y(0.4));
  ctx.stroke();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.moveTo(X(0.42), Y(0.4));
  ctx.lineTo(X(0.46), Y(0.415));
  ctx.lineTo(X(0.42), Y(0.43));
  ctx.closePath();
  ctx.fill();
  // Door.
  if (variant === 0) {
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(X(0.38), Y(0.68));
    ctx.lineTo(X(0.42), Y(0.56));
    ctx.lineTo(X(0.46), Y(0.68));
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#2a1a10';
    ctx.beginPath();
    ctx.moveTo(X(0.4), Y(0.68));
    ctx.lineTo(X(0.42), Y(0.6));
    ctx.lineTo(X(0.44), Y(0.68));
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = '#b05238';
    ctx.beginPath();
    ctx.moveTo(X(0.38), Y(0.68));
    ctx.lineTo(X(0.42), Y(0.56));
    ctx.lineTo(X(0.46), Y(0.68));
    ctx.closePath();
    ctx.fill();
  }
  // Guy ropes + pegs.
  ctx.strokeStyle = '#d8cbb0';
  ctx.lineWidth = 1.5 * S;
  ctx.beginPath();
  ctx.moveTo(X(0.3), Y(0.62));
  ctx.lineTo(X(0.22), Y(0.72));
  ctx.moveTo(X(0.54), Y(0.62));
  ctx.lineTo(X(0.62), Y(0.72));
  ctx.stroke();

  // Backpack beside the tent — difference 7 (absent on the right).
  if (variant === 0) {
    ctx.fillStyle = '#3a6ea5';
    rr(ctx, X(0.58), Y(0.72), 34 * S, 40 * S, 10 * S);
    ctx.fill();
    ctx.fillStyle = '#2a4f78';
    rr(ctx, X(0.585), Y(0.72), 24 * S, 14 * S, 6 * S);
    ctx.fill();
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 2 * S;
    ctx.beginPath();
    ctx.moveTo(X(0.58), Y(0.78));
    ctx.lineTo(X(0.614), Y(0.78));
    ctx.stroke();
  }

  // Campfire — difference 1: tall flame on the left, low embers on the right.
  const fireGlow = ctx.createRadialGradient(X(0.68), Y(0.78), 4, X(0.68), Y(0.78), variant === 0 ? 90 * S : 45 * S);
  fireGlow.addColorStop(0, 'rgba(255, 170, 60, 0.5)');
  fireGlow.addColorStop(1, 'rgba(255, 170, 60, 0)');
  ctx.fillStyle = fireGlow;
  ctx.fillRect(X(0.58), Y(0.66), 0.2 * pw, 0.24 * ph);
  // Stone ring.
  ctx.fillStyle = '#6b6f7a';
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    circle(ctx, X(0.68) + Math.cos(a) * 26 * S, Y(0.86) + Math.sin(a) * 7 * S, 6 * S);
    ctx.fill();
  }
  // Logs.
  ctx.strokeStyle = '#5b3a29';
  ctx.lineWidth = 7 * S;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(X(0.655), Y(0.87));
  ctx.lineTo(X(0.705), Y(0.83));
  ctx.moveTo(X(0.705), Y(0.87));
  ctx.lineTo(X(0.655), Y(0.83));
  ctx.stroke();
  // Flame.
  const flame = (cx, cy, h, w, c1, c2) => {
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.moveTo(cx, cy - h);
    ctx.quadraticCurveTo(cx + w, cy - h * 0.3, cx + w * 0.4, cy);
    ctx.quadraticCurveTo(cx, cy + h * 0.15, cx - w * 0.4, cy);
    ctx.quadraticCurveTo(cx - w, cy - h * 0.3, cx, cy - h);
    ctx.fill();
    ctx.fillStyle = c2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - h * 0.55);
    ctx.quadraticCurveTo(cx + w * 0.5, cy - h * 0.15, cx, cy);
    ctx.quadraticCurveTo(cx - w * 0.5, cy - h * 0.15, cx, cy - h * 0.55);
    ctx.fill();
  };
  if (variant === 0) flame(X(0.68), Y(0.85), 52 * S, 20 * S, '#f4842c', '#ffd166');
  else flame(X(0.68), Y(0.85), 22 * S, 12 * S, '#f4842c', '#ffd166');

  // Lantern on a stump — difference 5: lit on the left, dark on the right.
  ctx.fillStyle = '#5b3a29';
  ctx.fillRect(X(0.83), Y(0.78), 26 * S, 34 * S);
  ctx.fillStyle = '#7a5230';
  ellipse(ctx, X(0.843), Y(0.78), 15 * S, 5 * S);
  ctx.fill();
  if (variant === 0) {
    const lg = ctx.createRadialGradient(X(0.843), Y(0.72), 2, X(0.843), Y(0.72), 46 * S);
    lg.addColorStop(0, 'rgba(255, 209, 102, 0.55)');
    lg.addColorStop(1, 'rgba(255, 209, 102, 0)');
    ctx.fillStyle = lg;
    ctx.fillRect(X(0.78), Y(0.64), 0.13 * pw, 0.16 * ph);
  }
  ctx.fillStyle = '#1d2340';
  rr(ctx, X(0.833), Y(0.7), 20 * S, 30 * S, 4 * S);
  ctx.fill();
  ctx.fillStyle = variant === 0 ? '#ffd166' : '#2a3352';
  rr(ctx, X(0.837), Y(0.708), 12 * S, 18 * S, 3 * S);
  ctx.fill();
  ctx.strokeStyle = '#1d2340';
  ctx.lineWidth = 2 * S;
  ctx.beginPath();
  ctx.moveTo(X(0.843), Y(0.7));
  ctx.quadraticCurveTo(X(0.843), Y(0.68), X(0.843), Y(0.685));
  ctx.stroke();

  // Mushrooms at the pine base — difference 4: three on the left, two on the right.
  const mushroom = (mx, my, s) => {
    ctx.fillStyle = '#f4ead8';
    ctx.fillRect(X(mx) - 2 * S, Y(my) - 8 * S, 4 * S, 12 * S);
    ctx.fillStyle = '#d64545';
    ctx.beginPath();
    ctx.arc(X(mx), Y(my) - 8 * S, 9 * S, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f4ead8';
    circle(ctx, X(mx) - 3 * S, Y(my) - 11 * S, 1.8 * S);
    ctx.fill();
    circle(ctx, X(mx) + 3 * S, Y(my) - 13 * S, 1.5 * S);
    ctx.fill();
  };
  mushroom(0.1, 0.9, S);
  mushroom(0.14, 0.92, S);
  if (variant === 0) mushroom(0.18, 0.89, S);

  // Sleeping bag roll near the fire.
  ctx.fillStyle = '#2a9d8f';
  rr(ctx, X(0.72), Y(0.88), 52 * S, 16 * S, 8 * S);
  ctx.fill();
  ctx.fillStyle = '#1f7a6e';
  ctx.fillRect(X(0.72), Y(0.88), 8 * S, 16 * S);
}

const FOREST_DIFFS = [
  { id: 0, x: 0.68, y: 0.78, r: 0.055, label: 'campfire flame' },
  { id: 1, x: 0.88, y: 0.35, r: 0.045, label: 'owl' },
  { id: 2, x: 0.42, y: 0.62, r: 0.045, label: 'tent door' },
  { id: 3, x: 0.18, y: 0.89, r: 0.04, label: 'third mushroom' },
  { id: 4, x: 0.843, y: 0.72, r: 0.045, label: 'lantern light' },
  { id: 5, x: 0.76, y: 0.145, r: 0.05, label: 'shooting star' },
  { id: 6, x: 0.597, y: 0.76, r: 0.045, label: 'backpack' },
  { id: 7, x: 0.15, y: 0.12, r: 0.05, label: 'moon phase' },
];

// ---------------------------------------------------------- market morning
// A street market at sunrise: stalls, awnings, fruit, balloons, a cat.

function drawMarket(ctx, px, py, pw, ph, variant) {
  const { X, Y, S } = geom(px, py, pw, ph);
  sky(ctx, px, py, pw, ph * 0.45, [
    [0, '#aee1f9'],
    [0.7, '#d8f0fd'],
    [1, '#fdf3d0'],
  ]);

  // Morning sun with rays.
  ctx.fillStyle = '#ffd166';
  circle(ctx, X(0.88), Y(0.12), 24 * S);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 209, 102, 0.8)';
  ctx.lineWidth = 3 * S;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(X(0.88) + Math.cos(a) * 32 * S, Y(0.12) + Math.sin(a) * 32 * S);
    ctx.lineTo(X(0.88) + Math.cos(a) * 42 * S, Y(0.12) + Math.sin(a) * 42 * S);
    ctx.stroke();
  }

  cloud(ctx, X(0.22), Y(0.1), 0.9 * S, 'rgba(255, 255, 255, 0.9)');
  cloud(ctx, X(0.58), Y(0.18), 0.7 * S, 'rgba(255, 255, 255, 0.8)');
  cloud(ctx, X(0.08), Y(0.26), 0.6 * S, 'rgba(255, 255, 255, 0.7)');

  // Rooftops behind the stalls.
  ctx.fillStyle = '#e8b48c';
  ctx.fillRect(px, Y(0.4), pw, ph * 0.1);
  ctx.fillStyle = '#b56a4a';
  for (const [u, w] of [[0.05, 0.2], [0.3, 0.24], [0.6, 0.18], [0.82, 0.16]]) {
    ctx.beginPath();
    ctx.moveTo(X(u), Y(0.4));
    ctx.lineTo(X(u + w / 2), Y(0.33));
    ctx.lineTo(X(u + w), Y(0.4));
    ctx.closePath();
    ctx.fill();
  }
  // Windows on the facades.
  ctx.fillStyle = '#5f6f8e';
  for (const u of [0.1, 0.18, 0.36, 0.44, 0.65, 0.73, 0.86, 0.93]) {
    ctx.fillRect(X(u), Y(0.43), 0.03 * pw, 0.045 * ph);
  }
  // Weathervane rooster — difference 3: faces left on the left, right on the right.
  ctx.strokeStyle = '#1d2340';
  ctx.lineWidth = 2.5 * S;
  ctx.beginPath();
  ctx.moveTo(X(0.5), Y(0.33));
  ctx.lineTo(X(0.5), Y(0.26));
  ctx.stroke();
  const dir = variant === 0 ? -1 : 1;
  ctx.fillStyle = '#d64545';
  ctx.beginPath();
  ctx.moveTo(X(0.5), Y(0.27));
  ctx.lineTo(X(0.5 + dir * 0.03), Y(0.255));
  ctx.lineTo(X(0.5 + dir * 0.03), Y(0.285));
  ctx.closePath();
  ctx.fill();
  circle(ctx, X(0.5 - dir * 0.012), Y(0.27), 4 * S);
  ctx.fill();

  // Cobblestone ground.
  ctx.fillStyle = '#cfc4ae';
  ctx.fillRect(px, Y(0.62), pw, ph * 0.38);
  ctx.fillStyle = 'rgba(90, 70, 50, 0.25)';
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 12; col++) {
      const cx = px + ((col + (row % 2) * 0.5) * pw) / 12;
      const cy = Y(0.65 + row * 0.07);
      ellipse(ctx, cx, cy, 18 * S, 7 * S);
      ctx.fill();
    }
  }

  // ---- Left stall: fruit, striped awning.
  // Awning stripes — difference 1: red/white on the left, blue/white on the right.
  const stripeA = variant === 0 ? '#d64545' : '#3a6ea5';
  const stripeB = '#f4ead8';
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? stripeA : stripeB;
    ctx.beginPath();
    ctx.moveTo(X(0.06 + i * 0.055), Y(0.5));
    ctx.lineTo(X(0.06 + (i + 1) * 0.055), Y(0.5));
    ctx.lineTo(X(0.06 + (i + 1) * 0.055 + 0.012), Y(0.58));
    ctx.lineTo(X(0.06 + i * 0.055 + 0.012), Y(0.58));
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 2 * S;
  ctx.beginPath();
  ctx.moveTo(X(0.07), Y(0.5));
  ctx.lineTo(X(0.05), Y(0.78));
  ctx.moveTo(X(0.38), Y(0.5));
  ctx.lineTo(X(0.4), Y(0.78));
  ctx.stroke();
  // Counter + fruit pile — difference 5: red apples vs oranges.
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(X(0.08), Y(0.72), 0.3 * pw, 0.05 * ph);
  ctx.fillStyle = '#6b4222';
  ctx.fillRect(X(0.08), Y(0.77), 0.3 * pw, 0.02 * ph);
  const fruit = variant === 0 ? '#d64545' : '#f4842c';
  for (const [fx, fy, fr] of [[0.14, 0.7, 11], [0.18, 0.685, 12], [0.22, 0.7, 11], [0.16, 0.66, 11], [0.2, 0.655, 10], [0.26, 0.7, 11], [0.3, 0.685, 10], [0.24, 0.66, 10]]) {
    ctx.fillStyle = fruit;
    circle(ctx, X(fx), Y(fy), fr * S);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    circle(ctx, X(fx - 0.006), Y(fy - 0.007), 3 * S);
    ctx.fill();
  }
  // Price chalkboard.
  ctx.fillStyle = '#2a3352';
  rr(ctx, X(0.31), Y(0.62), 44 * S, 30 * S, 4 * S);
  ctx.fill();
  ctx.fillStyle = '#f4ead8';
  ctx.font = `bold ${Math.round(13 * S)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('5¢', X(0.31) + 22 * S, Y(0.62) + 15 * S);

  // Balloons tied to the stall post — difference 2: three vs two.
  ctx.strokeStyle = '#1d2340';
  ctx.lineWidth = 1.5 * S;
  ctx.beginPath();
  ctx.moveTo(X(0.05), Y(0.5));
  ctx.quadraticCurveTo(X(0.07), Y(0.4), X(0.08), Y(0.36));
  ctx.stroke();
  const balloon = (bx, by, color) => {
    ctx.fillStyle = color;
    ellipse(ctx, X(bx), Y(by), 13 * S, 16 * S);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(X(bx) - 4 * S, Y(by) + 15 * S);
    ctx.lineTo(X(bx) + 4 * S, Y(by) + 15 * S);
    ctx.lineTo(X(bx), Y(by) + 20 * S);
    ctx.closePath();
    ctx.fill();
  };
  balloon(0.08, 0.34, '#d64545');
  balloon(0.115, 0.3, '#ffd166');
  if (variant === 0) balloon(0.05, 0.3, '#3a6ea5');

  // Flower pots by the stall — difference 7: three pots vs two.
  const pot = (pxu, pyv) => {
    ctx.fillStyle = '#b56a4a';
    ctx.beginPath();
    ctx.moveTo(X(pxu) - 12 * S, Y(pyv));
    ctx.lineTo(X(pxu) + 12 * S, Y(pyv));
    ctx.lineTo(X(pxu) + 9 * S, Y(pyv) + 16 * S);
    ctx.lineTo(X(pxu) - 9 * S, Y(pyv) + 16 * S);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#2e8b57';
    circle(ctx, X(pxu) - 5 * S, Y(pyv) - 6 * S, 6 * S);
    ctx.fill();
    circle(ctx, X(pxu) + 5 * S, Y(pyv) - 7 * S, 6 * S);
    ctx.fill();
    ctx.fillStyle = '#ff8fa3';
    circle(ctx, X(pxu), Y(pyv) - 10 * S, 4 * S);
    ctx.fill();
  };
  pot(0.44, 0.86);
  pot(0.49, 0.87);
  if (variant === 0) pot(0.395, 0.86);

  // ---- Right stall: bread, green awning.
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#2e8b57' : '#f4ead8';
    ctx.beginPath();
    ctx.moveTo(X(0.6 + i * 0.06), Y(0.5));
    ctx.lineTo(X(0.6 + (i + 1) * 0.06), Y(0.5));
    ctx.lineTo(X(0.6 + (i + 1) * 0.06 + 0.012), Y(0.58));
    ctx.lineTo(X(0.6 + i * 0.06 + 0.012), Y(0.58));
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 2 * S;
  ctx.beginPath();
  ctx.moveTo(X(0.61), Y(0.5));
  ctx.lineTo(X(0.59), Y(0.78));
  ctx.moveTo(X(0.9), Y(0.5));
  ctx.lineTo(X(0.92), Y(0.78));
  ctx.stroke();
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(X(0.6), Y(0.72), 0.3 * pw, 0.05 * ph);
  // Bread loaves.
  ctx.fillStyle = '#d9a05b';
  for (const [bx, by] of [[0.65, 0.69], [0.7, 0.685], [0.75, 0.69], [0.8, 0.685], [0.85, 0.69]]) {
    ellipse(ctx, X(bx), Y(by), 16 * S, 10 * S);
    ctx.fill();
  }
  ctx.strokeStyle = '#8a5a33';
  ctx.lineWidth = 1.5 * S;
  for (const bx of [0.65, 0.7, 0.75, 0.8, 0.85]) {
    ctx.beginPath();
    ctx.moveTo(X(bx) - 8 * S, Y(0.685));
    ctx.lineTo(X(bx) + 8 * S, Y(0.685));
    ctx.stroke();
  }

  // Bird on the bread stall roof — difference 8 (absent on the right).
  if (variant === 0) {
    ctx.fillStyle = '#1d2340';
    ellipse(ctx, X(0.75), Y(0.48), 9 * S, 7 * S);
    ctx.fill();
    circle(ctx, X(0.758), Y(0.465), 5 * S);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(X(0.762), Y(0.463));
    ctx.lineTo(X(0.772), Y(0.466));
    ctx.lineTo(X(0.762), Y(0.469));
    ctx.closePath();
    ctx.fill();
  }

  // Bicycle leaning on the right stall — difference 6 (absent on the right).
  if (variant === 0) {
    ctx.strokeStyle = '#1d2340';
    ctx.lineWidth = 2.5 * S;
    circle(ctx, X(0.6), Y(0.86), 14 * S);
    ctx.stroke();
    circle(ctx, X(0.66), Y(0.86), 14 * S);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(0.6), Y(0.86));
    ctx.lineTo(X(0.63), Y(0.8));
    ctx.lineTo(X(0.66), Y(0.86));
    ctx.moveTo(X(0.63), Y(0.8));
    ctx.lineTo(X(0.615), Y(0.76));
    ctx.moveTo(X(0.615), Y(0.76));
    ctx.lineTo(X(0.6), Y(0.77));
    ctx.moveTo(X(0.63), Y(0.8));
    ctx.lineTo(X(0.645), Y(0.77));
    ctx.stroke();
  }

  // Cat on a crate by the bread stall — difference 4 (absent on the right).
  ctx.fillStyle = '#a4713a';
  ctx.fillRect(X(0.84), Y(0.84), 34 * S, 30 * S);
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 2 * S;
  ctx.strokeRect(X(0.84), Y(0.84), 34 * S, 30 * S);
  if (variant === 0) {
    ctx.fillStyle = '#e8b48c';
    ellipse(ctx, X(0.868), Y(0.825), 12 * S, 14 * S);
    ctx.fill();
    circle(ctx, X(0.868), Y(0.785), 9 * S);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(X(0.86), Y(0.782));
    ctx.lineTo(X(0.858), Y(0.76));
    ctx.lineTo(X(0.866), Y(0.778));
    ctx.moveTo(X(0.874), Y(0.782));
    ctx.lineTo(X(0.876), Y(0.76));
    ctx.lineTo(X(0.882), Y(0.778));
    ctx.fill();
    ctx.strokeStyle = '#e8b48c';
    ctx.lineWidth = 3.5 * S;
    ctx.beginPath();
    ctx.moveTo(X(0.88), Y(0.83));
    ctx.quadraticCurveTo(X(0.9), Y(0.82), X(0.895), Y(0.79));
    ctx.stroke();
  }
}

const MARKET_DIFFS = [
  { id: 0, x: 0.22, y: 0.54, r: 0.05, label: 'awning stripes' },
  { id: 1, x: 0.05, y: 0.3, r: 0.045, label: 'third balloon' },
  { id: 2, x: 0.5, y: 0.27, r: 0.04, label: 'weathervane' },
  { id: 3, x: 0.868, y: 0.81, r: 0.045, label: 'market cat' },
  { id: 4, x: 0.2, y: 0.68, r: 0.05, label: 'fruit colour' },
  { id: 5, x: 0.63, y: 0.82, r: 0.05, label: 'bicycle' },
  { id: 6, x: 0.395, y: 0.87, r: 0.04, label: 'third flower pot' },
  { id: 7, x: 0.75, y: 0.47, r: 0.04, label: 'roof bird' },
];

// ---------------------------------------------------------------- exports

export const SCENES = [
  { id: 0, name: 'Harbor Dusk', draw: drawHarbor, diffs: HARBOR_DIFFS },
  { id: 1, name: 'Forest Camp', draw: drawForest, diffs: FOREST_DIFFS },
  { id: 2, name: 'Market Morning', draw: drawMarket, diffs: MARKET_DIFFS },
];
