import type { ColorItem } from "./ohuhu-colors";

export const CHROMATIC_FAMILIES = ["Y", "YR", "R", "RV", "V", "BV", "B", "BG", "G", "YG"];

const COMPLEMENT_MAP: Record<string, string> = {
  "Y": "V",
  "YR": "B",
  "R": "G",
  "RV": "YG",
  "V": "Y",
  "BV": "YR",
  "B": "YR",
  "BG": "R",
  "G": "R",
  "YG": "RV",
};

const SPLIT_COMPLEMENT_MAP: Record<string, [string, string]> = {
  Y: ["RV", "BV"],

  YR: ["BG", "BV"],

  R: ["YG", "BG"],

  RV: ["G", "Y"],

  V: ["YR", "YG"],

  BV: ["Y", "YR"],

  B: ["R", "YR"],

  BG: ["R", "RV"],

  G: ["R", "RV"],

  YG: ["R", "V"],
};

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
  Summer: (c: ColorItem) => SUMMER_CODES.has(c.newCode),
  Spring: (c: ColorItem) => ["RV", "G", "YG", "Y", "BG", "B", "GG"].includes(c.family),
  Autumn: (c: ColorItem) => ["YR", "R", "E", "Y"].includes(c.family),
  Winter: (c: ColorItem) => ["B", "BV", "BG", "V", "CG", "WG"].includes(c.family),
  Pastel: (c: ColorItem) => PASTEL_CODES.has(c.newCode),
  Neon: (c: ColorItem) => NEON_CODES.has(c.newCode),
} as const;

const HARMONY_MODES = [
  "Analogous", "Analogous", "Analogous",
  "Split Complementary",
  "Monochromatic",
  "Complementary",
] as const;
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

  if (currentStyle !== "Neon") {
    pool = pool.filter(c => !c.newCode.startsWith("FY"));
  }

  const allowedChromatic = [...new Set(pool.filter(c => CHROMATIC_FAMILIES.includes(c.family)).map(c => c.family))];
  const newColors: ColorItem[] = [...currentColors];
  newColors.length = currentCount;

  // Pick base hue if not Random harmony
  let baseFamilyIdx = Math.floor(Math.random() * WHEEL.length);
  if (allowedChromatic.length > 0) {
    baseFamilyIdx = WHEEL.indexOf(allowedChromatic[Math.floor(Math.random() * allowedChromatic.length)]);
  }

  // Define allowed family indices for each harmony
  let allowedIndices: number[] = [];
  const allowedFamilies: string[] = [];

  if (currentHarmony === "Analogous") {
    // [i-2, i-1, i, i+1, i+2] % 10
    allowedIndices = [
      (baseFamilyIdx - 2 + 10) % 10,
      (baseFamilyIdx - 1 + 10) % 10,
      baseFamilyIdx,
      (baseFamilyIdx + 1) % 10,
      (baseFamilyIdx + 2) % 10
    ];
  } else if (currentHarmony === "Complementary") {
    const baseFamily = WHEEL[baseFamilyIdx];
    allowedFamilies.push(baseFamily, COMPLEMENT_MAP[baseFamily]);
  } else if (currentHarmony === "Split Complementary") {
    const baseFamily = WHEEL[baseFamilyIdx];
    allowedFamilies.push(baseFamily, ...SPLIT_COMPLEMENT_MAP[baseFamily]);
  } else if (currentHarmony === "Monochromatic") {
    allowedIndices = [baseFamilyIdx];
  }

  // Snap allowed indices to zone and get allowed families
  for (const idx of allowedIndices) {
    const snapped = snapToZone(idx, allowedChromatic);
    if (snapped && !allowedFamilies.includes(snapped)) {
      allowedFamilies.push(snapped);
    }
  }

  const availablePool = [...pool];
  const usedNewCodes = new Set<string>();
  const familyUsageCount = new Map<string, number>();

  for (let i = 0; i < currentCount; i++) {
    if (currentLocks[i] && currentColors[i]) {
      newColors[i] = currentColors[i];
      usedNewCodes.add(currentColors[i].newCode);
      const mappedFamily = currentColors[i].family;
      const count = familyUsageCount.get(mappedFamily) || 0;
      familyUsageCount.set(mappedFamily, count + 1);
      continue;
    }

    let targetFamily: string | null = null;

    if (allowedFamilies.length > 0) {
      // Cycle through allowed families, distributing slots evenly
      targetFamily = allowedFamilies[i % allowedFamilies.length];
    }

    let options = availablePool.filter(c => !usedNewCodes.has(c.newCode));

    if (targetFamily) {
      // Try to get color from target family
      const familyOptions = options.filter(c => c.family === targetFamily);

      if (familyOptions.length > 0) {
        options = familyOptions;
      } else {
        const otherAllowedOptions = options.filter(c => allowedFamilies.includes(c.family));
        if (otherAllowedOptions.length > 0) {
          options = otherAllowedOptions;
        }
      }
    }

    if (options.length === 0) options = availablePool.filter(c => !usedNewCodes.has(c.newCode)); // fallback
    if (options.length === 0) options = dataset; // desperate fallback

    const choice = options[Math.floor(Math.random() * options.length)];
    newColors[i] = choice;
    usedNewCodes.add(choice.newCode);

    const mappedFamily = choice.family;
    const count = familyUsageCount.get(mappedFamily) || 0;
    familyUsageCount.set(mappedFamily, count + 1);
  }

  return newColors;
}
