// Lantern Harbor — Spot the Difference: a tiny seeded RNG so every scene
// draws the same stars, waves and birds on every load, and so the two
// panels of a level differ only where a difference is planted.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A deterministic float in [min, max) from a seed and a slot number, so a
// scene element keeps its place without carrying RNG state around.
export function seeded(seed, slot, min, max) {
  const r = mulberry32(seed * 7919 + slot * 104729);
  return min + r() * (max - min);
}

// Integer in [min, max] from the same scheme.
export function seededInt(seed, slot, min, max) {
  return Math.floor(seeded(seed, slot, min, max + 1));
}
