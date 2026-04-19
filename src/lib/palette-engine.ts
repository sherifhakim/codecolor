import type { ColorItem } from "./ohuhu-colors";

export const CHROMATIC_FAMILIES = ["Y", "YR", "R", "RV", "V", "BV", "B", "BG", "G", "YG"];

const PASTEL_CODES = new Set([
  // Sweetness
  "Y02", "Y14", "Y45", "Y55", "Y62", "Y69", "YR06", "YR11", "YR43", "YR52", "YR55", "YR59", "E05", "E14", "E26", "E46", "E85", "E92", "R15", "R22", "R27", "R54", "RV04", "RV05", "RV25", "RV33", "RV34", "V14", "V22", "BV05", "BV32", "BV35", "B03", "B05", "B21", "B28", "BG24", "BG310", "G34", "G47", "CG01", "CG24", "BGY00", "YGY02", "YGY13", "WG01", "WG04", "GG24",
  // Blossoming
  "Y00", "Y03", "Y06", "Y07", "Y26", "Y42", "YR00", "YR03", "YR05", "YR07", "YR33", "YR45", "YR47", "YR56", "YR57", "YR58", "E22", "R25", "R50", "RV01", "RV23", "RV35", "V32", "V34", "V38", "BV26", "BV31", "BV38", "B02", "B06", "B310", "BG04", "BG09", "BG21", "G24", "G36", "G41", "G43", "G49", "YG06", "YG07", "YG66", "CG02", "BGY02", "YGY11", "WG10", "GG03", "GG10"
]);

const SUMMER_CODES = new Set([
  "YR57", "V18", "E22", "Y00", "Y09", "Y17", "RV35", "BG212",
  "RV39", "Y02", "YG160", "YG112", "Y14", "YR55", "G013", "V112",
  "YR511", "RV111", "E46", "BG311"
]);

const NEON_CODES = new Set([
  "B08", "FY01", "FY02", "RV08", "RV111", "Y111", "Y19", "Y28",
  "YR111", "YR112", "YR19", "YR513", "Y17", "RV310", "BG212",
  "FY03", "FY00", "V112", "V414", "RV39"
]);

export const ZONES = {
  All: () => true,
  Warm: (c: ColorItem) => ["Y", "YR", "R", "RV", "E", "YGY", "WG"].includes(c.family),
  Cold: (c: ColorItem) => ["B", "BV", "BG", "CG", "BGY"].includes(c.family),
  Vintage: (c: ColorItem) => {
    const families = ["E", "YR", "Y", "YGY", "WG", "BG", "BGY", "R", "G", "YG", "BV", "V"];
    if (!families.includes(c.family)) return false;
    if (c.family === "YGY" || c.family === "BGY") return c.s >= 5;
    return c.s >= 20 && c.s <= 50;
  },
  Summer: (c: ColorItem) => SUMMER_CODES.has(c.newCode),
  Spring: (c: ColorItem) => ["RV", "G", "YG", "Y"].includes(c.family) && c.l > 70,
  Autumn: (c: ColorItem) => ["YR", "R", "E", "Y", "YG"].includes(c.family) && c.l >= 30 && c.l <= 70,
  Winter: (c: ColorItem) => ["B", "BV", "BG", "V", "CG", "WG"].includes(c.family),
  Pastel: (c: ColorItem) => PASTEL_CODES.has(c.newCode),
  Neon: (c: ColorItem) => NEON_CODES.has(c.newCode),
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
  dataset = dataset.filter(c => c.newCode !== "0" && c.newCode !== "120");
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
      if (familyOptions.length > 0) {
        options = familyOptions;
      } else {
        // No colors in target family - walk the WHEEL to find nearest available family
        const targetFamily = targetFamilies[0];
        const targetIdx = WHEEL.indexOf(targetFamily);
        if (targetIdx !== -1) {
          const len = WHEEL.length;
          let nearestFamily: string | null = null;
          let dist = 1;
          const maxDist = Math.floor(len / 2);
          
          while (dist <= maxDist && !nearestFamily) {
            const leftIdx = (targetIdx - dist + len) % len;
            const rightIdx = (targetIdx + dist) % len;
            const leftFamily = WHEEL[leftIdx];
            const rightFamily = WHEEL[rightIdx];
            
            // Check if left family has available colors
            if (allowedChromatic.includes(leftFamily)) {
              const leftOptions = options.filter(c => c.family === leftFamily);
              if (leftOptions.length > 0) {
                nearestFamily = leftFamily;
                break;
              }
            }
            
            // Check if right family has available colors
            if (allowedChromatic.includes(rightFamily)) {
              const rightOptions = options.filter(c => c.family === rightFamily);
              if (rightOptions.length > 0) {
                nearestFamily = rightFamily;
                break;
              }
            }
            
            dist++;
          }
          
          if (nearestFamily) {
            options = options.filter(c => c.family === nearestFamily);
          }
        }
      }
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
