import type { ColorItem } from "./ohuhu-colors";

export const CHROMATIC_FAMILIES = ["Y", "YR", "R", "RV", "V", "BV", "B", "BG", "G", "YG"];

export const ZONES = {
  All: () => true,
  Pastel: (c: ColorItem) => CHROMATIC_FAMILIES.includes(c.family) && c.l > 75,
  Dark: (c: ColorItem) => CHROMATIC_FAMILIES.includes(c.family) && c.l < 35,
  Warm: (c: ColorItem) => ["Y", "YR", "R", "RV", "E", "YGY", "WG"].includes(c.family),
  Cold: (c: ColorItem) => ["B", "BV", "BG", "CG", "BGY"].includes(c.family),
  Neon: (c: ColorItem) => c.family === "FY" || (["RV", "R", "Y", "YR", "G", "BG"].includes(c.family) && c.s > 65),
  Vintage: (c: ColorItem) => {
    const families = ["E", "YR", "Y", "YGY", "WG", "BG", "BGY", "R", "G", "YG", "BV", "V"];
    if (!families.includes(c.family)) return false;
    if (c.family === "YGY" || c.family === "BGY") return c.s >= 5;
    return c.s >= 20 && c.s <= 50;
  },
  Summer: (c: ColorItem) => ["Y", "YR", "R", "RV", "BG", "G", "YG", "E"].includes(c.family) && c.l >= 50,
  Winter: (c: ColorItem) => {
    if (c.family === "RV") return c.l > 70;
    return ["B", "BV", "BG", "V", "CG", "BGY", "GG"].includes(c.family) && (c.s < 40 || c.l > 70);
  },
  Spring: (c: ColorItem) => ["RV", "G", "YG", "Y"].includes(c.family) && c.l > 70,
  Autumn: (c: ColorItem) => ["YR", "R", "E", "Y", "YG"].includes(c.family) && c.l >= 30 && c.l <= 70,
} as const;

const HARMONY_MODES = ["Analogous", "Complementary", "Triadic", "Split Complementary"] as const;
type HarmonyMode = typeof HARMONY_MODES[number];
export type StyleMode = keyof typeof ZONES;

export const WHEEL = ["Y", "YR", "R", "RV", "V", "BV", "B", "BG", "G", "YG"];

// Given a list of allowed families in the current style zone, snap the target index to the nearest allowed family
export function snapToZone(targetIndex: number, allowedFamiliesInZone: string[]) {
  // Wrap around index
  const len = WHEEL.length;
  const normalizedIndex = ((targetIndex % len) + len) % len;
  const targetFamily = WHEEL[normalizedIndex];
  if (allowedFamiliesInZone.includes(targetFamily)) return targetFamily;

  let dist = 1;
  const maxDist = Math.floor(len / 2);
  while (dist <= maxDist) {
    const up = WHEEL[(normalizedIndex + dist) % len];
    if (allowedFamiliesInZone.includes(up)) return up;
    const down = WHEEL[(normalizedIndex - dist + len) % len];
    if (allowedFamiliesInZone.includes(down)) return down;
    dist++;
  }
  return null;
}

export function getShadowHighlight(color: ColorItem, dataset: ColorItem[]) {
  const familySiblings = dataset.filter(c => c.family === color.family && c.newCode !== color.newCode);

  let highlight: ColorItem | null = null;
  let shadow: ColorItem | null = null;

  const sameSaturation = familySiblings.filter(c => c.saturation === color.saturation);

  if (sameSaturation.length > 0) {
    const lighter = sameSaturation.filter(c => c.brightness < color.brightness).sort((a, b) => b.brightness - a.brightness);
    const darker = sameSaturation.filter(c => c.brightness > color.brightness).sort((a, b) => a.brightness - b.brightness);
    if (lighter.length > 0) highlight = lighter[0];
    if (darker.length > 0) shadow = darker[0];
  }

  return { highlight, shadow };
}

export function generatePalette(
  dataset: ColorItem[],
  currentStyle: StyleMode,
  currentCount: number,
  currentLocks: Record<number, boolean>,
  currentColors: ColorItem[]
): ColorItem[] {
  // Randomly pick a harmony method on each generation
  const currentHarmony: HarmonyMode = HARMONY_MODES[Math.floor(Math.random() * HARMONY_MODES.length)];
  // 1. Filter by Style Zone
  const zoneFilter = ZONES[currentStyle];
  let pool = dataset.filter(zoneFilter);
  if (pool.length === 0) pool = dataset;

  const allowedChromatic = [...new Set(pool.filter(c => CHROMATIC_FAMILIES.includes(c.family)).map(c => c.family))];
  const newColors: ColorItem[] = [...currentColors];
  newColors.length = currentCount;

  // Pick base hue if not Random harmony
  let baseFamilyIdx = Math.floor(Math.random() * WHEEL.length);
  if (allowedChromatic.length > 0) {
    baseFamilyIdx = WHEEL.indexOf(allowedChromatic[Math.floor(Math.random() * allowedChromatic.length)]);
  }

  const availablePool = [...pool];
  const usedFamilies = new Set<string>();

  for (let i = 0; i < currentCount; i++) {
    if (currentLocks[i] && currentColors[i]) {
      newColors[i] = currentColors[i];
      usedFamilies.add(currentColors[i].family);
      continue;
    }

    let targetFamilies: string[] | null = null;
    if (allowedChromatic.length > 0) {
      let targetIdx = baseFamilyIdx;
      const len = WHEEL.length;
      if (currentHarmony === "Analogous") {
        if (i % 3 === 1) targetIdx = baseFamilyIdx - 1;
        if (i % 3 === 2) targetIdx = baseFamilyIdx + 1;
      } else if (currentHarmony === "Complementary") {
        if (i % 2 === 1) targetIdx = baseFamilyIdx + Math.round(len / 2);
      } else if (currentHarmony === "Triadic") {
        if (i % 3 === 1) targetIdx = baseFamilyIdx + Math.round(len / 3);
        if (i % 3 === 2) targetIdx = baseFamilyIdx + Math.round((len / 3) * 2);
      } else if (currentHarmony === "Split Complementary") {
        const half = Math.round(len / 2);
        if (i % 3 === 1) targetIdx = baseFamilyIdx + half - 1;
        if (i % 3 === 2) targetIdx = baseFamilyIdx + half + 1;
      }
      const resolvedFamily = snapToZone(targetIdx, allowedChromatic);
      if (resolvedFamily) targetFamilies = [resolvedFamily];
    }

    let options = availablePool.filter(c => !usedFamilies.has(c.family));
    if (targetFamilies && targetFamilies.length > 0) {
      const familyOptions = options.filter(c => targetFamilies!.includes(c.family));
      if (familyOptions.length > 0) options = familyOptions;
    }

    if (options.length === 0) options = availablePool; // fallback
    if (options.length === 0) options = dataset; // desperate fallback

    const choice = options[Math.floor(Math.random() * options.length)];
    newColors[i] = choice;
    // Allow repeated picks from repeatable families (e.g. YGY, BGY in Vintage)
    const repeatableFamilies = ["YGY", "BGY"];
    if (!repeatableFamilies.includes(choice.family)) {
      usedFamilies.add(choice.family);
    }

    // Remove chosen from pool to avoid exact dupes
    const poolIdx = availablePool.findIndex(c => c.newCode === choice.newCode);
    if (poolIdx !== -1) availablePool.splice(poolIdx, 1);
  }

  return newColors;
}
