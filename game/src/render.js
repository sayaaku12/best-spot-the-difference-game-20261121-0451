// Lantern Harbor — Spot the Difference: small canvas helpers shared by the
// three scene painters, plus the panel frame and found-difference markers.

export function rr(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

export function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

// A soft four-point sparkle, used for stars and glints.
export function sparkle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

// A puffy cloud made of overlapping circles, centred at (x, y).
export function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y, 34 * s, 16 * s);
  ctx.fill();
  ellipse(ctx, x - 26 * s, y + 5 * s, 22 * s, 13 * s);
  ctx.fill();
  ellipse(ctx, x + 26 * s, y + 5 * s, 24 * s, 14 * s);
  ctx.fill();
  ellipse(ctx, x + 2 * s, y - 11 * s, 20 * s, 13 * s);
  ctx.fill();
}

// A simple pine: layered triangles on a trunk.
export function pine(ctx, x, y, h, dark, light) {
  const w = h * 0.42;
  ctx.fillStyle = '#5b3a29';
  ctx.fillRect(x - h * 0.03, y - h * 0.08, h * 0.06, h * 0.1);
  for (let i = 0; i < 3; i++) {
    const ty = y - h * 0.08 - (h * 0.26 * i);
    const tw = w * (1 - i * 0.24);
    ctx.fillStyle = i % 2 === 0 ? dark : light;
    ctx.beginPath();
    ctx.moveTo(x, ty - h * 0.3);
    ctx.lineTo(x + tw / 2, ty);
    ctx.lineTo(x - tw / 2, ty);
    ctx.closePath();
    ctx.fill();
  }
}

// A seagull as two small arcs.
export function gull(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - 7 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 7 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

// A vertical sky gradient from the given colour stops.
export function sky(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

// Frame around a picture panel, with a small "LEFT / RIGHT" tag.
export function panelFrame(ctx, x, y, w, h, tag, frameColor, tagColor) {
  ctx.fillStyle = frameColor;
  ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
  ctx.fillStyle = tagColor;
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(tag, x + 2, y - 16);
}

// A found-difference marker: a warm ring with a check, drawn on both panels.
export function foundMarker(ctx, x, y, r, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.42, y);
  ctx.lineTo(x - r * 0.08, y + r * 0.34);
  ctx.lineTo(x + r * 0.45, y - r * 0.32);
  ctx.stroke();
  ctx.restore();
}

// A wrong-click flash: a red ring that fades (drawn for one frame by the
// caller with an alpha it controls).
export function missMarker(ctx, x, y, r, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ef476f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - r * 0.5, y - r * 0.5);
  ctx.lineTo(x + r * 0.5, y + r * 0.5);
  ctx.moveTo(x + r * 0.5, y - r * 0.5);
  ctx.lineTo(x - r * 0.5, y + r * 0.5);
  ctx.stroke();
  ctx.restore();
}
