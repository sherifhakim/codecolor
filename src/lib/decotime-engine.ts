import { DecotimeColor } from "./decotime-colors";

function hexToRGB(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

function linear(c: number) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function rgbToOklab(r: number, g: number, b: number) {
  const lr = linear(r);
  const lg = linear(g);
  const lb = linear(b);

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  };
}

function oklabToOklch(L: number, a: number, b: number) {
  const C = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) * (180 / Math.PI);
  if (h < 0) h += 360;
  return { L, C, h };
}

export function augmentDecotimeColors(colors: DecotimeColor[]) {
  return colors.map(c => {
    if (c._oklch) return c;
    const { r, g, b } = hexToRGB(c.hex);
    const { L, a, labB } = rgbToOklab(r, g, b) as any;
    // Note: destructuring "b" as "labB" 
    const lab = rgbToOklab(r, g, b);
    const oklch = oklabToOklch(lab.L, lab.a, lab.b);
    return { ...c, _oklch: oklch };
  });
}

// Ensure color has oklch
function getOklch(c: DecotimeColor) {
  if (c._oklch) return c._oklch;
  const { r, g, b } = hexToRGB(c.hex);
  const lab = rgbToOklab(r, g, b);
  return oklabToOklch(lab.L, lab.a, lab.b);
}

export const DECO_ZONES = {
  All: () => true,
  Dark: (c: DecotimeColor) => { const o = getOklch(c); return o.L < 0.45; },
  Warm: (c: DecotimeColor) => { const o = getOklch(c); return (o.h >= 0 && o.h <= 100) || o.h >= 320; },
  Cold: (c: DecotimeColor) => { const o = getOklch(c); return o.h > 100 && o.h < 320; },
  Vintage: (c: DecotimeColor) => { const o = getOklch(c); return o.L >= 0.4 && o.L <= 0.8 && o.C <= 0.1; },
  Summer: (c: DecotimeColor) => { const o = getOklch(c); return o.C > 0.12 && o.L > 0.6; },
  Spring: (c: DecotimeColor) => { const o = getOklch(c); return o.L > 0.7 && o.C > 0.08; },
  Autumn: (c: DecotimeColor) => { const o = getOklch(c); return o.L >= 0.4 && o.L <= 0.7 && o.C > 0.08; },
  Winter: (c: DecotimeColor) => { const o = getOklch(c); return (o.h >= 200 && o.h <= 300) || o.C < 0.05; },
  Pink: (c: DecotimeColor) => { const o = getOklch(c); return o.h >= 320 || o.h <= 20; },
  Blue: (c: DecotimeColor) => { const o = getOklch(c); return o.h >= 220 && o.h <= 280; },
  Pastel: (c: DecotimeColor) => { const o = getOklch(c); return o.L >= 0.82 && o.C <= 0.12; },
  Neon: (c: DecotimeColor) => { const o = getOklch(c); return o.L >= 0.75 && o.C >= 0.20; },
} as const;

export type DecoStyleMode = keyof typeof DECO_ZONES;

const HARMONY_MODES = ["Analogous", "Complementary", "Triadic", "Split Complementary"] as const;
type HarmonyMode = typeof HARMONY_MODES[number];

function getClosestHueDiff(h1: number, h2: number) {
  let diff = Math.abs(h1 - h2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

function snapToHarmony(targetHue: number, pool: DecotimeColor[]) {
  if (pool.length === 0) return null;
  targetHue = ((targetHue % 360) + 360) % 360;

  let bestColor = pool[0];
  let minDiff = getClosestHueDiff(targetHue, getOklch(pool[0]).h);

  for (let i = 1; i < pool.length; i++) {
    const diff = getClosestHueDiff(targetHue, getOklch(pool[i]).h);
    if (diff < minDiff) {
      minDiff = diff;
      bestColor = pool[i];
    }
  }
  return bestColor;
}

export function generateDecoPalette(
  dataset: DecotimeColor[],
  currentStyle: DecoStyleMode,
  currentCount: number,
  currentLocks: Record<number, boolean>,
  currentColors: DecotimeColor[]
): DecotimeColor[] {
  const augmentedDataset = augmentDecotimeColors(dataset);
  const pastelHarmonies: HarmonyMode[] = ["Analogous", "Triadic", "Split Complementary"];
  const availableHarmonies = currentStyle === "Pastel" ? pastelHarmonies : [...HARMONY_MODES];
  const currentHarmony: HarmonyMode = availableHarmonies[Math.floor(Math.random() * availableHarmonies.length)];

  const zoneFilter = DECO_ZONES[currentStyle];
  let pool = augmentedDataset.filter(zoneFilter);
  if (pool.length === 0) pool = augmentedDataset; // fallback

  const newColors: DecotimeColor[] = [...currentColors];
  newColors.length = currentCount;

  // Pick a base hue randomly from the pool
  const baseColor = pool[Math.floor(Math.random() * pool.length)];
  const baseHue = getOklch(baseColor).h;

  const availablePool = [...pool];
  const usedCodes = new Set<string>();

  for (let i = 0; i < currentCount; i++) {
    if (currentLocks[i] && currentColors[i]) {
      newColors[i] = currentColors[i];
      usedCodes.add(currentColors[i].code);
      continue;
    }

    let targetHue = baseHue;
    if (currentHarmony === "Analogous") {
      if (i % 3 === 1) targetHue = baseHue - 30;
      if (i % 3 === 2) targetHue = baseHue + 30;
    } else if (currentHarmony === "Complementary") {
      if (i % 2 === 1) targetHue = baseHue + 180;
    } else if (currentHarmony === "Triadic") {
      if (i % 3 === 1) targetHue = baseHue + 120;
      if (i % 3 === 2) targetHue = baseHue + 240;
    } else if (currentHarmony === "Split Complementary") {
      if (i % 3 === 1) targetHue = baseHue + 150;
      if (i % 3 === 2) targetHue = baseHue + 210;
    }

    targetHue = ((targetHue % 360) + 360) % 360;

    let options = availablePool.filter(c => !usedCodes.has(c.code));
    if (options.length === 0) options = availablePool; // fallback
    if (options.length === 0) options = augmentedDataset; // desperate fallback

    // Filter to colors somewhat close to targetHue to allow some variance
    let hueMatched = options.filter(c => getClosestHueDiff(getOklch(c).h, targetHue) <= 45);
    if (hueMatched.length === 0) hueMatched = options; // fallback

    const choice = hueMatched[Math.floor(Math.random() * hueMatched.length)];
    newColors[i] = choice;
    usedCodes.add(choice.code);

    const poolIdx = availablePool.findIndex(c => c.code === choice.code);
    if (poolIdx !== -1) availablePool.splice(poolIdx, 1);
  }

  return newColors;
}

function colorDistanceOklab(c1: DecotimeColor, c2: DecotimeColor) {
  const { r: r1, g: g1, b: b1 } = hexToRGB(c1.hex);
  const lab1 = rgbToOklab(r1, g1, b1);

  const { r: r2, g: g2, b: b2 } = hexToRGB(c2.hex);
  const lab2 = rgbToOklab(r2, g2, b2);

  return Math.sqrt(
    Math.pow(lab1.L - lab2.L, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  );
}

export function getDecoShadowHighlight(color: DecotimeColor, dataset: DecotimeColor[]) {
  const augmentedDataset = augmentDecotimeColors(dataset);
  const targetOklch = getOklch(color);

  // Filter for siblings: similar hue (within 20 deg), similar chroma (within 0.05) if possible
  const siblings = augmentedDataset.filter(c => c.code !== color.code);
  let closeSiblings = siblings.filter(c => getClosestHueDiff(getOklch(c).h, targetOklch.h) <= 25);

  if (closeSiblings.length === 0) {
    return { highlight: null, shadow: null };
  }

  const lighter = closeSiblings.filter(c => getOklch(c).L > targetOklch.L + 0.02);
  const darker = closeSiblings.filter(c => getOklch(c).L < targetOklch.L - 0.02);

  let highlight: DecotimeColor | null = null;
  let shadow: DecotimeColor | null = null;

  if (lighter.length > 0) {
    // find closest visual distance in Oklab
    highlight = lighter.reduce((prev, curr) =>
      colorDistanceOklab(color, curr) < colorDistanceOklab(color, prev) ? curr : prev
    );
  }

  if (darker.length > 0) {
    shadow = darker.reduce((prev, curr) =>
      colorDistanceOklab(color, curr) < colorDistanceOklab(color, prev) ? curr : prev
    );
  }

  return { highlight, shadow };
}
