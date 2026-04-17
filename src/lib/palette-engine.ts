import type { ColorItem } from "./ohuhu-colors";

export const CHROMATIC_FAMILIES = ["Y", "YR", "R", "RV", "V", "BV", "B", "BG", "G", "YG"];

const PASTEL_CODES = new Set([
  // Sweetness
  "Y02", "Y14", "Y45", "Y55", "Y62", "Y69", "YR06", "YR11", "YR43", "YR52", "YR55", "YR59", "E05", "E14", "E26", "E46", "E85", "E92", "R15", "R22", "R27", "R54", "RV04", "RV05", "RV25", "RV33", "RV34", "V14", "V22", "BV05", "BV32", "BV35", "B03", "B05", "B21", "B28", "BG24", "BG310", "G34", "G47", "CG01", "CG24", "BGY00", "YGY02", "YGY13", "WG01", "WG04", "GG24",
  // Blossoming
  "Y00", "Y03", "Y06", "Y07", "Y26", "Y42", "YR00", "YR03", "YR05", "YR07", "YR33", "YR45", "YR47", "YR56", "YR57", "YR58", "E22", "R25", "R50", "RV01", "RV23", "RV35", "V32", "V34", "V38", "BV26", "BV31", "BV38", "B02", "B06", "B310", "BG04", "BG09", "BG21", "G24", "G36", "G41", "G43", "G49", "YG06", "YG07", "YG66", "CG02", "BGY02", "YGY11", "WG10", "GG03", "GG10"
]);

export const ZONES = {
  All: () => true,
  Dark: (c: ColorItem) => CHROMATIC_FAMILIES.includes(c.family) && c.l < 35,
  Warm: (c: ColorItem) => ["Y", "YR", "R", "RV", "E", "YGY", "WG"].includes(c.family),
  Cold: (c: ColorItem) => ["B", "BV", "BG", "CG", "BGY"].includes(c.family),
  Vintage: (c: ColorItem) => {
    const families = ["E", "YR", "Y", "YGY", "WG", "BG", "BGY", "R", "G", "YG", "BV", "V"];
    if (!families.includes(c.family)) return false;
    if (c.family === "YGY" || c.family === "BGY") return c.s >= 5;
    return c.s >= 20 && c.s <= 50;
  },
  Neon: (c: ColorItem) =>
    c.family === "FY" ||
    (["RV", "R", "Y", "YR", "G", "BG"].includes(c.family) && c.s > 70),
  Summer: (c: ColorItem) => ["Y", "YR", "R", "RV", "BG", "G", "YG", "E"].includes(c.family) && c.l >= 50,
  Spring: (c: ColorItem) => ["RV", "G", "YG", "Y"].includes(c.family) && c.l > 70,
  Autumn: (c: ColorItem) => ["YR", "R", "E", "Y", "YG"].includes(c.family) && c.l >= 30 && c.l <= 70,
  Winter: (c: ColorItem) => ["B", "BV", "BG", "V", "CG", "WG"].includes(c.family),
  Pastel: (c: ColorItem) => PASTEL_CODES.has(c.newCode),
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
