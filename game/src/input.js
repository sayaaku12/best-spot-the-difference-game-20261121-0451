// Lantern Harbor — Spot the Difference: mouse + keyboard input.
// The game is played by clicking on a picture panel, or by moving a
// crosshair with the arrow keys and pressing Enter/Space to "click" it.
// Buttons (Hint, Restart, Next) are canvas regions the game reports; this
// module only translates raw events into game actions.

export function createInput(canvas, hooks) {
  // hooks: { onPanelClick(panel, x, y), onButton(name), onKey(name) }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  canvas.addEventListener('pointerdown', (event) => {
    const p = canvasPoint(event);
    const hit = hooks.hitTest(p.x, p.y);
    if (hit.kind === 'button') hooks.onButton(hit.name);
    else if (hit.kind === 'panel') hooks.onPanelClick(hit.panel, p.x, p.y);
    else hooks.onMiss(p.x, p.y);
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      hooks.onKey(key);
      return;
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      hooks.onKey('confirm');
      return;
    }
    if (key === 'h' || key === 'H') hooks.onKey('hint');
    else if (key === 'r' || key === 'R') hooks.onKey('restart');
    else if (key === 'Escape') hooks.onKey('escape');
    else if (key === '1' || key === '2' || key === '3') hooks.onKey('level' + key);
  });
}
