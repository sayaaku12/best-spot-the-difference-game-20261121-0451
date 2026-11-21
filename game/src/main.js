// Lantern Harbor — Spot the Difference: game state, loop and HUD.
// Two near-identical pictures side by side; click a difference in either
// picture and it is marked on both. Find all 8 to clear the level, then
// the next of three levels. Keyboard: arrows move the crosshair, Enter
// clicks it, H hints, R restarts, 1/2/3 pick a level, Esc goes to title.

import {
  BAR_Y,
  CANVAS_H,
  CANVAS_W,
  CLICK_RADIUS,
  COLORS,
  DIFFS_PER_LEVEL,
  HUD_H,
  LEFT_X,
  LEVELS,
  PANEL_H,
  PANEL_W,
  PANEL_Y,
  RIGHT_X,
} from './config.js';
import { foundMarker, missMarker, rr } from './render.js';
import { SCENES } from './scenes.js';
import { createInput } from './input.js';
import { playFound, playHint, playMiss, playWin } from './audio.js';
import { readShot, shotNow } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');

const HINT_BUTTON = { x: 1000, y: 648, w: 112, h: 44 };
const RESTART_BUTTON = { x: 1124, y: 648, w: 128, h: 44 };
const LEVEL_CARDS = [
  { x: 250, y: 380, w: 240, h: 150 },
  { x: 520, y: 380, w: 240, h: 150 },
  { x: 790, y: 380, w: 240, h: 150 },
];
const NEXT_BUTTON = { x: 540, y: 470, w: 200, h: 48 };
const AGAIN_BUTTON = { x: 540, y: 530, w: 200, h: 48 };

const shot = readShot();

const state = {
  screen: 'title',
  level: 0,
  found: new Set(),
  mistakes: 0,
  startedAt: 0,
  elapsedMs: 0,
  hintId: null,
  hintUntil: 0,
  miss: null,
  cursor: { panel: 0, x: LEFT_X + PANEL_W / 2, y: PANEL_Y + PANEL_H / 2 },
  cursorVisible: false,
  cleared: [false, false, false],
  totalMistakes: 0,
  totalMs: 0,
};

function scene() {
  return SCENES[state.level];
}

function diffs() {
  return scene().diffs;
}

function remaining() {
  return DIFFS_PER_LEVEL - state.found.size;
}

function nowMs() {
  return shot ? shotNow(shot) : Date.now();
}

function elapsed() {
  if (shot) return shot.elapsedMs;
  if (state.screen !== 'playing' || !state.startedAt) return state.elapsedMs;
  return state.elapsedMs + (Date.now() - state.startedAt);
}

function fmtTime(ms) {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function startLevel(level) {
  state.level = level;
  state.found = new Set();
  state.mistakes = 0;
  state.elapsedMs = 0;
  state.startedAt = Date.now();
  state.hintId = null;
  state.miss = null;
  state.screen = 'playing';
  state.cursor = { panel: 0, x: LEFT_X + PANEL_W / 2, y: PANEL_Y + PANEL_H / 2 };
  announce(`${LEVELS[level].name}. Find ${DIFFS_PER_LEVEL} differences.`);
}

function announce(text) {
  statusEl.textContent = text;
}

function panelAt(x, y) {
  if (y >= PANEL_Y && y <= PANEL_Y + PANEL_H) {
    if (x >= LEFT_X && x <= LEFT_X + PANEL_W) return 0;
    if (x >= RIGHT_X && x <= RIGHT_X + PANEL_W) return 1;
  }
  return -1;
}

function panelOrigin(panel) {
  return panel === 0 ? LEFT_X : RIGHT_X;
}

function inRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function hitTest(x, y) {
  if (state.screen === 'title') {
    for (let i = 0; i < 3; i++) {
      if (inRect(x, y, LEVEL_CARDS[i])) return { kind: 'button', name: 'level' + i };
    }
    return { kind: 'none' };
  }
  if (state.screen === 'won') {
    if (inRect(x, y, NEXT_BUTTON)) return { kind: 'button', name: 'next' };
    if (inRect(x, y, AGAIN_BUTTON)) return { kind: 'button', name: 'again' };
    return { kind: 'none' };
  }
  if (state.screen === 'complete') {
    if (inRect(x, y, AGAIN_BUTTON)) return { kind: 'button', name: 'again' };
    return { kind: 'none' };
  }
  if (inRect(x, y, HINT_BUTTON)) return { kind: 'button', name: 'hint' };
  if (inRect(x, y, RESTART_BUTTON)) return { kind: 'button', name: 'restart' };
  const panel = panelAt(x, y);
  if (panel >= 0) return { kind: 'panel', panel };
  return { kind: 'none' };
}

function tryClick(panel, x, y) {
  if (state.screen !== 'playing') return;
  const origin = panelOrigin(panel);
  const u = (x - origin) / PANEL_W;
  const v = (y - PANEL_Y) / PANEL_H;
  let best = null;
  let bestD = Infinity;
  for (const d of diffs()) {
    if (state.found.has(d.id)) continue;
    const dx = (u - d.x) * PANEL_W;
    const dy = (v - d.y) * PANEL_H;
    const dist = Math.hypot(dx, dy);
    const radius = Math.max(d.r * PANEL_W, CLICK_RADIUS);
    if (dist <= radius && dist < bestD) {
      best = d;
      bestD = dist;
    }
  }
  if (best) {
    state.found.add(best.id);
    state.hintId = null;
    playFound();
    announce(`Found: ${best.label}. ${remaining()} left.`);
    if (remaining() === 0) {
      state.elapsedMs = elapsed();
      state.startedAt = 0;
      state.cleared[state.level] = true;
      state.totalMistakes += state.mistakes;
      state.totalMs += state.elapsedMs;
      state.screen = state.level === 2 ? 'complete' : 'won';
      playWin();
      announce(`Level clear in ${fmtTime(state.elapsedMs)} with ${state.mistakes} misses.`);
    }
  } else {
    state.mistakes += 1;
    state.miss = { x, y, until: nowMs() + 450 };
    playMiss();
    announce(`Not a difference. ${remaining()} left.`);
  }
}

function useHint() {
  if (state.screen !== 'playing') return;
  const left = diffs().filter((d) => !state.found.has(d.id));
  if (!left.length) return;
  const pick = left[Math.floor(left.length / 2)];
  state.hintId = pick.id;
  state.hintUntil = nowMs() + 2200;
  playHint();
  announce(`Hint: look near "${pick.label}".`);
}

function onButton(name) {
  if (name.startsWith('level')) {
    startLevel(Number(name.slice(5)));
    return;
  }
  if (name === 'hint') useHint();
  else if (name === 'restart') startLevel(state.level);
  else if (name === 'again') {
    state.cleared = [false, false, false];
    state.totalMistakes = 0;
    state.totalMs = 0;
    startLevel(0);
  } else if (name === 'next') {
    startLevel(Math.min(state.level + 1, 2));
  }
}

function onKey(name) {
  if (name === 'hint') {
    useHint();
    return;
  }
  if (name === 'restart') {
    if (state.screen === 'playing') startLevel(state.level);
    return;
  }
  if (name === 'escape') {
    if (state.screen !== 'title') {
      state.screen = 'title';
      state.startedAt = 0;
    }
    return;
  }
  if (name.startsWith('level')) {
    startLevel(Number(name.slice(5)));
    return;
  }
  if (name === 'confirm') {
    const c = state.cursor;
    state.cursorVisible = true;
    tryClick(c.panel, c.x, c.y);
    return;
  }
  // Arrow keys move the crosshair.
  state.cursorVisible = true;
  const step = 14;
  const c = state.cursor;
  if (name === 'ArrowLeft') c.x -= step;
  if (name === 'ArrowRight') c.x += step;
  if (name === 'ArrowUp') c.y -= step;
  if (name === 'ArrowDown') c.y += step;
  if (c.x < LEFT_X) {
    c.panel = 0;
    c.x = LEFT_X;
  }
  if (c.x > LEFT_X + PANEL_W && c.x < RIGHT_X) c.x = RIGHT_X;
  if (c.x > RIGHT_X + PANEL_W) c.x = RIGHT_X + PANEL_W;
  if (c.y < PANEL_Y) c.y = PANEL_Y;
  if (c.y > PANEL_Y + PANEL_H) c.y = PANEL_Y + PANEL_H;
  c.panel = c.x < RIGHT_X ? 0 : 1;
}

// ------------------------------------------------------------------ drawing

function drawHud() {
  ctx.fillStyle = COLORS.hudBg;
  ctx.fillRect(0, 0, CANVAS_W, HUD_H);
  ctx.fillStyle = COLORS.hudLine;
  ctx.fillRect(0, HUD_H - 2, CANVAS_W, 2);

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = COLORS.hudText;
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillText('Lantern Harbor', 28, 30);
  ctx.fillStyle = COLORS.hudDim;
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText('spot the difference', 28, 56);

  ctx.textAlign = 'center';
  ctx.fillStyle = LEVELS[state.level].accent;
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText(`Level ${state.level + 1} · ${LEVELS[state.level].name}`, CANVAS_W / 2, 28);
  ctx.fillStyle = COLORS.hudDim;
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText(LEVELS[state.level].tag, CANVAS_W / 2, 54);

  ctx.textAlign = 'right';
  ctx.fillStyle = COLORS.hudText;
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText(fmtTime(elapsed()), CANVAS_W - 28, 28);
  ctx.fillStyle = state.mistakes > 0 ? '#ef476f' : COLORS.hudDim;
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText(`misses: ${state.mistakes}`, CANVAS_W - 28, 56);
}

function panelLabel(panel, x, y) {
  ctx.fillStyle = 'rgba(13, 17, 32, 0.72)';
  rr(ctx, x + 10, y + 10, 62, 24, 12);
  ctx.fill();
  ctx.fillStyle = COLORS.panelLabel;
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(panel === 0 ? 'LEFT' : 'RIGHT', x + 41, y + 23);
}

function drawPanels(now) {
  for (const panel of [0, 1]) {
    const ox = panelOrigin(panel);
    ctx.save();
    ctx.beginPath();
    ctx.rect(ox, PANEL_Y, PANEL_W, PANEL_H);
    ctx.clip();
    scene().draw(ctx, ox, PANEL_Y, PANEL_W, PANEL_H, panel);
    ctx.restore();

    ctx.strokeStyle = COLORS.panelFrame;
    ctx.lineWidth = 4;
    ctx.strokeRect(ox, PANEL_Y, PANEL_W, PANEL_H);
    panelLabel(panel, ox, PANEL_Y);

    // Found markers on both pictures.
    for (const d of diffs()) {
      if (!state.found.has(d.id)) continue;
      const mx = ox + d.x * PANEL_W;
      const my = PANEL_Y + d.y * PANEL_H;
      foundMarker(ctx, mx, my, Math.max(d.r * PANEL_W, 26), COLORS.marker);
    }

    // Hint pulse on the hinted difference, both pictures.
    if (state.hintId !== null && now < state.hintUntil) {
      const d = diffs().find((x) => x.id === state.hintId);
      if (d) {
        const pulse = 1 + 0.18 * Math.sin(now / 160);
        const r = Math.max(d.r * PANEL_W, 26) * pulse;
        ctx.save();
        ctx.strokeStyle = '#8ecae6';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(ox + d.x * PANEL_W, PANEL_Y + d.y * PANEL_H, r + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // Wrong-click flash.
  if (state.miss && now < state.miss.until) {
    const alpha = (state.miss.until - now) / 450;
    missMarker(ctx, state.miss.x, state.miss.y, 22, alpha);
  }

  // Keyboard crosshair.
  if (state.cursorVisible && state.screen === 'playing') {
    const c = state.cursor;
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(c.x, c.y, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(c.x - 18, c.y);
    ctx.lineTo(c.x - 8, c.y);
    ctx.moveTo(c.x + 8, c.y);
    ctx.lineTo(c.x + 18, c.y);
    ctx.moveTo(c.x, c.y - 18);
    ctx.lineTo(c.x, c.y - 8);
    ctx.moveTo(c.x, c.y + 8);
    ctx.lineTo(c.x, c.y + 18);
    ctx.stroke();
    ctx.restore();
  }
}

function drawBottomBar() {
  ctx.fillStyle = COLORS.hudBg;
  ctx.fillRect(0, BAR_Y, CANVAS_W, CANVAS_H - BAR_Y);
  ctx.fillStyle = COLORS.hudLine;
  ctx.fillRect(0, BAR_Y, CANVAS_W, 2);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = COLORS.hudText;
  ctx.font = 'bold 22px system-ui, sans-serif';
  const left = remaining();
  ctx.fillText(
    state.screen === 'playing'
      ? `${left} difference${left === 1 ? '' : 's'} left`
      : `${DIFFS_PER_LEVEL} differences to find`,
    640, 672,
  );

  // Level dots, bottom-left, clear of the centred counter.
  for (let i = 0; i < 3; i++) {
    const cx = 60 + i * 26;
    ctx.fillStyle = state.cleared[i] ? '#06d6a0' : i === state.level ? LEVELS[i].accent : '#3a4568';
    ctx.beginPath();
    ctx.arc(cx, 672, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  drawButton(HINT_BUTTON, 'Hint (H)');
  drawButton(RESTART_BUTTON, 'Restart (R)');
}

function drawButton(r, label) {
  const flash = r === HINT_BUTTON && state.mistakes >= 3 && state.screen === 'playing';
  ctx.fillStyle = flash ? '#ffd166' : COLORS.button;
  rr(ctx, r.x, r.y, r.w, r.h, 10);
  ctx.fill();
  ctx.fillStyle = COLORS.buttonText;
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2 + 1);
}

function overlayPanel(x, y, w, h) {
  ctx.fillStyle = COLORS.overlay;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#1d2340';
  rr(ctx, x, y, w, h, 18);
  ctx.fill();
  ctx.strokeStyle = '#3a4568';
  ctx.lineWidth = 2;
  rr(ctx, x, y, w, h, 18);
  ctx.stroke();
}

function drawTitle() {
  overlayPanel(190, 110, 900, 500);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.fillText('LANTERN HARBOR', CANVAS_W / 2, 170);
  ctx.fillStyle = COLORS.hudText;
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText('a spot-the-difference game in three pictures', CANVAS_W / 2, 212);
  ctx.fillStyle = COLORS.hudDim;
  ctx.font = '17px system-ui, sans-serif';
  ctx.fillText('Two pictures side by side. Eight differences hide between them.', CANVAS_W / 2, 258);
  ctx.fillText('Click a difference in either picture — it is marked on both.', CANVAS_W / 2, 284);
  ctx.fillText('Find all eight to clear the level. H hints, R restarts.', CANVAS_W / 2, 310);

  for (let i = 0; i < 3; i++) {
    const c = LEVEL_CARDS[i];
    ctx.fillStyle = '#141a2e';
    rr(ctx, c.x, c.y, c.w, c.h, 14);
    ctx.fill();
    ctx.strokeStyle = LEVELS[i].accent;
    ctx.lineWidth = 2;
    rr(ctx, c.x, c.y, c.w, c.h, 14);
    ctx.stroke();
    ctx.fillStyle = LEVELS[i].accent;
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(`Level ${i + 1}`, CANVAS_W / 2 + (c.x + c.w / 2 - CANVAS_W / 2), c.y + 42);
    ctx.fillStyle = COLORS.hudText;
    ctx.font = 'bold 19px system-ui, sans-serif';
    ctx.fillText(LEVELS[i].name, c.x + c.w / 2, c.y + 76);
    ctx.fillStyle = COLORS.hudDim;
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText(LEVELS[i].tag, c.x + c.w / 2, c.y + 106);
    ctx.fillStyle = state.cleared[i] ? '#06d6a0' : COLORS.hudDim;
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText(state.cleared[i] ? 'cleared' : '8 differences', c.x + c.w / 2, c.y + 130);
  }
  ctx.fillStyle = COLORS.hudDim;
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText('Click a level to start · arrow keys move the crosshair, Enter clicks', CANVAS_W / 2, 566);
}

function drawWon() {
  overlayPanel(380, 150, 520, 420);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#06d6a0';
  ctx.font = 'bold 40px system-ui, sans-serif';
  ctx.fillText('Level clear!', CANVAS_W / 2, 210);
  ctx.fillStyle = COLORS.hudText;
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillText(`${LEVELS[state.level].name} — all 8 differences found`, CANVAS_W / 2, 258);
  ctx.fillStyle = COLORS.hudDim;
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText(`Time ${fmtTime(state.elapsedMs)}   ·   Misses ${state.mistakes}`, CANVAS_W / 2, 300);
  const acc = Math.round((8 / (8 + state.mistakes)) * 100);
  ctx.fillText(`Accuracy ${acc}%`, CANVAS_W / 2, 330);
  ctx.fillStyle = COLORS.hudDim;
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(
    state.level < 2 ? 'Ready for the next picture?' : 'That was the last picture!',
    CANVAS_W / 2, 372,
  );
  drawButton(NEXT_BUTTON, state.level < 2 ? 'Next level' : 'See results');
  drawButton(AGAIN_BUTTON, 'Play again');
}

function drawComplete() {
  overlayPanel(330, 130, 620, 440);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 40px system-ui, sans-serif';
  ctx.fillText('You found them all!', CANVAS_W / 2, 190);
  ctx.fillStyle = COLORS.hudText;
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillText('All three pictures cleared — 24 differences spotted.', CANVAS_W / 2, 240);
  ctx.fillStyle = COLORS.hudDim;
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText(`Total time ${fmtTime(state.totalMs)}   ·   Total misses ${state.totalMistakes}`, CANVAS_W / 2, 282);
  const acc = Math.round((24 / (24 + state.totalMistakes)) * 100);
  ctx.fillText(`Overall accuracy ${acc}%`, CANVAS_W / 2, 312);
  ctx.fillText('Thanks for playing Lantern Harbor.', CANVAS_W / 2, 352);
  drawButton(AGAIN_BUTTON, 'Play again');
}

function draw(now) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#0d1120';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  drawHud();
  drawPanels(now);
  drawBottomBar();
  if (state.screen === 'title') drawTitle();
  else if (state.screen === 'won') drawWon();
  else if (state.screen === 'complete') drawComplete();
}

function frame() {
  draw(nowMs());
  if (!shot) requestAnimationFrame(frame);
}

// ------------------------------------------------------------------- wiring

createInput(canvas, {
  hitTest,
  onPanelClick: tryClick,
  onButton,
  onKey,
  onMiss: () => {},
});

// A shot URL presets the whole scene before the first frame.
if (shot) {
  state.level = shot.level;
  state.found = new Set(shot.found);
  state.mistakes = shot.mistakes;
  state.elapsedMs = shot.elapsedMs;
  state.screen = shot.screen;
  if (shot.screen === 'won') {
    state.cleared[shot.level] = true;
    state.totalMistakes = shot.mistakes;
    state.totalMs = shot.elapsedMs;
  }
  if (shot.screen === 'playing') state.startedAt = Date.now();
  draw(shotNow(shot));
} else {
  frame();
}
