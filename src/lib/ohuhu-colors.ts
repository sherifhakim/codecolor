function hexToHSL(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length == 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length == 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin;
  let h = 0, s = 0, l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return { h, s, l };
}

export const OHUHU_COLORS = [
  { oldCode: "120", oldName: "Black", newCode: "120", newName: "Black", hex: "#000000" },
  { oldCode: "B030", oldName: "Frost Blue", newCode: "B03", newName: "Frost", hex: "#bfd9e3" },
  { oldCode: "B050", oldName: "Robin's Egg Blue", newCode: "B05", newName: "Robin Egg Blue", hex: "#a4d3e9" },
  { oldCode: "B080", oldName: "Process Blue", newCode: "B112", newName: "Process Blue", hex: "#2392c8" },
  { oldCode: "B090", oldName: "Pebble Blue", newCode: "B015", newName: "Celadon Blue", hex: "#2676a6" },
  { oldCode: "B110", oldName: "Crystal Blue", newCode: "B06", newName: "Light Cerulean", hex: "#85cce6" },
  { oldCode: "B120", oldName: "Pale Blue", newCode: "BV35", newName: "Arctic Blue", hex: "#aac9e4" },
  { oldCode: "B180", oldName: "Vienna Blue", newCode: "BV311", newName: "Royal Blue", hex: "#226ab9" },
  { oldCode: "B190", oldName: "Ultramarine", newCode: "BV312", newName: "Deep Royal Blue", hex: "#2868b8" },
  { oldCode: "B220", oldName: "Pale Grayish Blue", newCode: "BV32", newName: "Pale Sky Blue", hex: "#d3e6f0" },
  { oldCode: "B250", oldName: "Light Blue", newCode: "B28", newName: "Smoke Blue", hex: "#a5c9e2" },
  { oldCode: "B270", oldName: "Vivid Blue", newCode: "BV414", newName: "Denim Blue", hex: "#7095b5" },
  { oldCode: "B340", oldName: "Lavender Blue", newCode: "BV05", newName: "Cornflower", hex: "#9dbae5" },
  { oldCode: "B440", oldName: "Cyanine Blue", newCode: "BV015", newName: "Deep Ultramarine", hex: "#4f5caa" },
  { oldCode: "B64", oldName: "Indian Blue", newCode: "B114", newName: "Cerulean Blue", hex: "#2A52BE" },
  { oldCode: "BG050", oldName: "Cool Grey 05", newCode: "BGY00", newName: "Cashmere Grey", hex: "#d1d6da" },
  { oldCode: "BG1", oldName: "Turquoise Green", newCode: "G315", newName: "Dark Emerald", hex: "#225A2F" },
  { oldCode: "BG2", oldName: "Deep Green", newCode: "G316", newName: "Deep Jade Green", hex: "#45736f" },
  { oldCode: "BG3", oldName: "Blue Grey 3", newCode: "BV31", newName: "Cloud Blue", hex: "#a8b4da" },
  { oldCode: "BG4", oldName: "Mint Blue", newCode: "B02", newName: "Light Minty Blue", hex: "#c0e1e6" },
  { oldCode: "BG5", oldName: "Dolphin Blue", newCode: "G013", newName: "Muted Turquoise", hex: "#7eafaf" },
  { oldCode: "BG6", oldName: "Peacock Green", newCode: "BG314", newName: "Peacock Green", hex: "#2d9596" },
  { oldCode: "BG68", oldName: "Turquoise Blue", newCode: "BG05", newName: "Light Sea Blue", hex: "#9bd4db" },
  { oldCode: "BG7", oldName: "Forest Green", newCode: "BG315", newName: "Castleton Green", hex: "#3e8785" },
  { oldCode: "BG8", oldName: "Teal", newCode: "BG215", newName: "Dark Pine Green", hex: "#2c9488" },
  { oldCode: "BG9", oldName: "Pigeon Blue", newCode: "BGY02", newName: "Pigeon Grey", hex: "#afbec1" },
  { oldCode: "BGⅡ03", oldName: "Blue Grey II 3", newCode: "B310", newName: "Blue Dusk", hex: "#a7bccb" },
  { oldCode: "BGⅡ05", oldName: "Blue Grey II 5", newCode: "B411", newName: "Rich Slate Blue", hex: "#7996a6" },
  { oldCode: "BGⅡ09", oldName: "Blue Grey II 9", newCode: "B415", newName: "Stormy Night", hex: "#515d6b" },
  { oldCode: "BR1", oldName: "Raw Umber", newCode: "E415", newName: "Cedar Brown", hex: "#754527" },
  { oldCode: "BR2", oldName: "Potato Brown", newCode: "YR313", newName: "Potato Brown", hex: "#A75E28" },
  { oldCode: "BR3", oldName: "Rose Beige", newCode: "YR39", newName: "Cinnamon", hex: "#F38245" },
  { oldCode: "BR208", oldName: "Black Brown", newCode: "YR57", newName: "Tropical Peach", hex: "#fc9c82" },
  { oldCode: "CG020", oldName: "Neutral Grey 02", newCode: "CG01", newName: "Cloud Grey", hex: "#e8ebe9" },
  { oldCode: "CG030", oldName: "Neutral Grey 03", newCode: "CG02", newName: "Light Grey", hex: "#e1e1e6" },
  { oldCode: "CG050", oldName: "Neutral Grey 05", newCode: "CG24", newName: "Grey", hex: "#b1b8bc" },
  { oldCode: "CG2", oldName: "Cool Grey II 2", newCode: "GG10", newName: "Soft Cool Grey", hex: "#cdd0d4" },
  { oldCode: "CG5", oldName: "Cool Grey II 5", newCode: "CG17", newName: "Cool Grey", hex: "#4d4e64" },
  { oldCode: "CGⅡ00", oldName: "Cool Grey II 0", newCode: "WG10", newName: "Porcelain", hex: "#EFF2F3" },
  { oldCode: "CGⅡ04", oldName: "Cool Grey II 4", newCode: "CG18", newName: "Icy Grey", hex: "#969fa9" },
  { oldCode: "CGⅡ07", oldName: "Cool Grey II 7", newCode: "BGY24", newName: "Storm Grey", hex: "#76818a" },
  { oldCode: "CGⅡ08", oldName: "Cool Grey II 8", newCode: "BGY25", newName: "Cracked Pepper", hex: "#6d7884" },
  { oldCode: "CGⅡ09", oldName: "Cool Grey II 9", newCode: "BGY35", newName: "Iron Grey", hex: "#696e78" },
  { oldCode: "E010", oldName: "Pale Fruit Pink", newCode: "YR00", newName: "Barely Blush", hex: "#fde1d2" },
  { oldCode: "E020", oldName: "Cotton Pearl", newCode: "YR05", newName: "Cotton Pearl", hex: "#fcc7ab" },
  { oldCode: "E030", oldName: "Pink Flamingo", newCode: "YR45", newName: "Rosewater", hex: "#fdd4c6" },
  { oldCode: "E050", oldName: "Lipstick Natural", newCode: "E85", newName: "Cherry Taupe", hex: "#c48977" },
  { oldCode: "E080", oldName: "Praline", newCode: "YR215", newName: "Aged Cherry Wood", hex: "#964410" },
  { oldCode: "E090", oldName: "Eggshell White", newCode: "YR06", newName: "Raw Cashew", hex: "#f9d6be" },
  { oldCode: "E120", oldName: "Reddish Brown", newCode: "E69", newName: "Russet Brown", hex: "#b47f6d" },
  { oldCode: "E130", oldName: "Copper", newCode: "E614", newName: "Maple Syrup", hex: "#8f665e" },
  { oldCode: "E160", oldName: "Soft Sun", newCode: "E44", newName: "Soft Sand", hex: "#f7d5b3" },
  { oldCode: "E210", oldName: "Brick Beige", newCode: "Y69", newName: "Milk Tea", hex: "#e1c5a4" },
  { oldCode: "E220", oldName: "Sand", newCode: "E46", newName: "Coral Sand", hex: "#eabb95" },
  { oldCode: "E260", oldName: "Leather", newCode: "YR314", newName: "Sandalwood", hex: "#a77a62" },
  { oldCode: "E280", oldName: "Sand White", newCode: "Y62", newName: "Sandy Beige", hex: "#f9e8d5" },
  { oldCode: "E370", oldName: "Light Walnut", newCode: "Y515", newName: "Light Walnut", hex: "#b58c6e" },
  { oldCode: "E380", oldName: "Ash Rose", newCode: "E92", newName: "Ash Rose", hex: "#dbcec7" },
  { oldCode: "E430", oldName: "Pecan", newCode: "E914", newName: "Bark Brown", hex: "#836a66" },
  { oldCode: "E432", oldName: "Vert Celadon", newCode: "E06", newName: "Bog Mist Green", hex: "#d3d0be" },
  { oldCode: "E434", oldName: "Dragon Well Tea", newCode: "E011", newName: "Pale Camo Green", hex: "#a4a898" },
  { oldCode: "E450", oldName: "Fennel Seed", newCode: "E313", newName: "Swamp Mud", hex: "#8c7e68" },
  { oldCode: "E460", oldName: "Military Olive", newCode: "E314", newName: "Military Olive", hex: "#766b5c" },
  { oldCode: "E470", oldName: "Tea Rose", newCode: "YR55", newName: "Pink Lemonade", hex: "#d6a4a6" },
  { oldCode: "FY010", oldName: "Fluorescent Yellow", newCode: "FY00", newName: "Fluorescent Yellow", hex: "#f2f14d" },
  { oldCode: "FY020", oldName: "Fluorescent Orange", newCode: "FY01", newName: "Fluorescent Orange", hex: "#fe942a" },
  { oldCode: "FY030", oldName: "Fluorescent Red", newCode: "FY02", newName: "Fluorescent Red", hex: "#fe5a66" },
  { oldCode: "G020", oldName: "Pale Lemon Yellow", newCode: "Y14", newName: "Pale Lemon Yellow", hex: "#ecefa0" },
  { oldCode: "G030", oldName: "Crescent Yellow", newCode: "Y03", newName: "Pastel Yellow", hex: "#f5f7c2" },
  { oldCode: "G050", oldName: "Celadon Green", newCode: "YG07", newName: "Honeydew Melon", hex: "#d6dd92" },
  { oldCode: "G080", oldName: "Limeade", newCode: "YG113", newName: "Pear Green", hex: "#cfcd5d" },
  { oldCode: "G1", oldName: "Emerald Green", newCode: "G312", newName: "Emerald Green", hex: "#00674f" },
  { oldCode: "G110", oldName: "Mignonette", newCode: "G41", newName: "Peppermint", hex: "#d3ecd2" },
  { oldCode: "G120", oldName: "Yellowish Green", newCode: "G34", newName: "Pale Green", hex: "#c7e6cc" },
  { oldCode: "G130", oldName: "Acid Green", newCode: "YG66", newName: "Fresh Green", hex: "#c9e1ac" },
  { oldCode: "G140", oldName: "Horseradish", newCode: "G47", newName: "Spring Green", hex: "#9fd29b" },
  { oldCode: "G2", oldName: "Vivid Green", newCode: "G310", newName: "Shamrock Green", hex: "#149253" },
  { oldCode: "G220", oldName: "Lime Green", newCode: "E05", newName: "Pale Moss", hex: "#dbe5cd" },
  { oldCode: "G260", oldName: "Apple Green", newCode: "YG29", newName: "Apple Green", hex: "#b2c185" },
  { oldCode: "G270", oldName: "Moss", newCode: "YG312", newName: "Artichoke Green", hex: "#a5b889" },
  { oldCode: "G3", oldName: "Ocean Green", newCode: "G311", newName: "Jade Green", hex: "#60c090" },
  { oldCode: "G300", oldName: "Dark Olive", newCode: "YG215", newName: "Thatch Green", hex: "#8b8572" },
  { oldCode: "G320", oldName: "Jade Green", newCode: "BG21", newName: "Mint Whisp", hex: "#e0f3e5" },
  { oldCode: "G322", oldName: "Pale Aqua Mint", newCode: "BG04", newName: "Sea Spray", hex: "#b0dde3" },
  { oldCode: "G324", oldName: "Aqua Blue", newCode: "BG19", newName: "Sea Blue", hex: "#88ccd2" },
  { oldCode: "G326", oldName: "Bright Blue", newCode: "BG09", newName: "Aquamarine", hex: "#85cdcd" },
  { oldCode: "G330", oldName: "Mineral Green", newCode: "G012", newName: "Mineral Green", hex: "#98bfb9" },
  { oldCode: "G340", oldName: "Horizon Green", newCode: "BG310", newName: "Seafoam Green", hex: "#a4dad7" },
  { oldCode: "G390", oldName: "Green", newCode: "G313", newName: "Green", hex: "#3c8b6e" },
  { oldCode: "G4", oldName: "Mint Green Light", newCode: "BG212", newName: "Bright Pine Green", hex: "#37baa2" },
  { oldCode: "G410", oldName: "Light Holly Green", newCode: "G24", newName: "Celadon", hex: "#bbd1c2" },
  { oldCode: "G420", oldName: "Green Shadow", newCode: "BG24", newName: "Sea Glass Blue", hex: "#bce3cd" },
  { oldCode: "G470", oldName: "Pine Tree Green", newCode: "YG413", newName: "Fern Green", hex: "#7b9f78" },
  { oldCode: "G490", oldName: "Viridian Green", newCode: "G210", newName: "Sea Green", hex: "#7ab99f" },
  { oldCode: "G5", oldName: "Turquoise Ink Blue", newCode: "G114", newName: "Aged Pine Green", hex: "#054F4C" },
  { oldCode: "G500", oldName: "Peacock Blue", newCode: "BG011", newName: "Teal", hex: "#1eabb9" },
  { oldCode: "G6", oldName: "Dusty Jade Green", newCode: "G113", newName: "Dusty Jade Green", hex: "#6ea999" },
  { oldCode: "G7", oldName: "Chromium Oxide Green", newCode: "YG415", newName: "Cascade Green", hex: "#61766d" },
  { oldCode: "G8", oldName: "Glass Green", newCode: "G36", newName: "Glass Green", hex: "#99DCA6" },
  { oldCode: "G9", oldName: "Meadow Green", newCode: "G112", newName: "Pale Cobalt Green", hex: "#8db9af" },
  { oldCode: "GG020", oldName: "Green Grey 02", newCode: "GG24", newName: "Wispy Grey", hex: "#cacdc8" },
  { oldCode: "GG040", oldName: "Light Jade Green Grey", newCode: "GG25", newName: "Pilgrim Haze", hex: "#b1bebc" },
  { oldCode: "GG1", oldName: "Green Grey 1", newCode: "GG03", newName: "Silver Cloud", hex: "#ced9d9" },
  { oldCode: "GG110", oldName: "Toner Grey", newCode: "GG07", newName: "Steel Grey", hex: "#848b8c" },
  { oldCode: "GG3", oldName: "Green Grey 3", newCode: "GG05", newName: "Evergreen Fog", hex: "#94a6aa" },
  { oldCode: "GG5", oldName: "Green Gray 5", newCode: "BGY15", newName: "Blue Steel Grey", hex: "#8f9ca4" },
  { oldCode: "GG9", oldName: "Green Grey 9", newCode: "BGY18", newName: "Graphite Grey", hex: "#767d81" },
  { oldCode: "GY1", oldName: "Pale Green", newCode: "G49", newName: "Sour Apple", hex: "#93F393" },
  { oldCode: "GY172", oldName: "Spectrum Green", newCode: "G43", newName: "Vintage Pale Green", hex: "#d2e7ca" },
  { oldCode: "GY173", oldName: "Dim Green", newCode: "E22", newName: "Lime Juice", hex: "#eee4c2" },
  { oldCode: "GY2", oldName: "Grass Green", newCode: "G410", newName: "Grass Green", hex: "#8dbd77" },
  { oldCode: "GY3", oldName: "Bud Green", newCode: "YG510", newName: "Bud Green", hex: "#91cc24" },
  { oldCode: "GY4", oldName: "Yellow Green", newCode: "YG012", newName: "Yellow Green", hex: "#A8D12A" },
  { oldCode: "GY42", oldName: "Bronze Green", newCode: "YG015", newName: "Dark Olive", hex: "#83885f" },
  { oldCode: "GY43", oldName: "Deep Olive Green", newCode: "YG414", newName: "Dark Fern Green", hex: "#6f8e72" },
  { oldCode: "GY5", oldName: "Absinthe", newCode: "YG211", newName: "Edamame", hex: "#639e0a" },
  { oldCode: "GY6", oldName: "Anise", newCode: "Y07", newName: "Banana Cream", hex: "#FEEB77" },
  { oldCode: "GY7", oldName: "Sugarcane", newCode: "YG06", newName: "Sugarcane", hex: "#d7e4aa" },
  { oldCode: "GY8", oldName: "Petits Pois", newCode: "YG212", newName: "Guacamole", hex: "#9c985b" },
  { oldCode: "MG020", oldName: "Blue Grey 02", newCode: "B21", newName: "Porcelain Blue", hex: "#9cb0da" },
  { oldCode: "MG030", oldName: "Blue Grey 03", newCode: "B27", newName: "Fog Blue", hex: "#becfe1" },
  { oldCode: "MG100", oldName: "Blue Grey 09", newCode: "B412", newName: "Gunmetal Blue", hex: "#678293" },
  { oldCode: "NG03", oldName: "Neutral Grey 3", newCode: "CG25", newName: "Deep Grey", hex: "#a3a8aa" },
  { oldCode: "NG06", oldName: "Neutral Grey 6", newCode: "GG16", newName: "Dark Anchor Grey", hex: "#6e7276" },
  { oldCode: "NG07", oldName: "Neutral Grey 7", newCode: "GG15", newName: "Dark Neutral Grey", hex: "#666a71" },
  { oldCode: "NG09", oldName: "Neutral Grey 9", newCode: "BGY38", newName: "Charcoal Grey", hex: "#53585f" },
  { oldCode: "P1", oldName: "Vivid Purple", newCode: "RV314", newName: "Grape Juice", hex: "#b0066b" },
  { oldCode: "P2", oldName: "Light Violet", newCode: "RV311", newName: "Pansy", hex: "#ce3690" },
  { oldCode: "P3", oldName: "Pastel Violet", newCode: "V18", newName: "Bright Lavender", hex: "#d492cc" },
  { oldCode: "P4", oldName: "Lavender", newCode: "V010", newName: "Faded Violet", hex: "#ac67b9" },
  { oldCode: "P5", oldName: "Aubergine", newCode: "V416", newName: "Deep Purple", hex: "#2d016b" },
  { oldCode: "PB1", oldName: "Sky Blue", newCode: "BV38", newName: "Sky Blue", hex: "#7ea3fe" },
  { oldCode: "PB10", oldName: "Turquoise Green Light", newCode: "BG311", newName: "Turquoise", hex: "#66d2bb" },
  { oldCode: "PB11", oldName: "Marine Blue", newCode: "B315", newName: "Deep Cerulean", hex: "#446d95" },
  { oldCode: "PB2", oldName: "Brilliant Blue", newCode: "BV310", newName: "Brilliant Blue", hex: "#2752D6" },
  { oldCode: "PB3", oldName: "Cobalt Blue", newCode: "BV314", newName: "Lapis Lazuli", hex: "#5272a9" },
  { oldCode: "PB4", oldName: "Napoleon Blue", newCode: "BV315", newName: "Cobalt Blue", hex: "#446999" },
  { oldCode: "PB5", oldName: "Prussian Blue", newCode: "BV514", newName: "Vintage Navy", hex: "#576d9c" },
  { oldCode: "PB6", oldName: "Royal Blue", newCode: "B115", newName: "Classic Blue", hex: "#305CDE" },
  { oldCode: "PB7", oldName: "Pastel Blue", newCode: "B08", newName: "Cotton Candy Blue", hex: "#84D2FC" },
  { oldCode: "PB8", oldName: "Cerulean Blue", newCode: "B111", newName: "Pool Blue", hex: "#0997d8" },
  { oldCode: "PB9", oldName: "Cloud Blue", newCode: "BG114", newName: "Faded Teal", hex: "#4293ad" },
  { oldCode: "R050", oldName: "Chocolate Pink", newCode: "YR58", newName: "Pink Sand", hex: "#fcc2b4" },
  { oldCode: "R070", oldName: "Agate", newCode: "R012", newName: "Fruit Punch", hex: "#e56b5f" },
  { oldCode: "R080", oldName: "Pale Cherry Pink", newCode: "YR43", newName: "Pale Cherry Pink", hex: "#fedccd" },
  { oldCode: "R090", oldName: "Light Tea Rose", newCode: "YR56", newName: "Light Apricot Pink", hex: "#fec7b9" },
  { oldCode: "R1", oldName: "Coral Pink", newCode: "R210", newName: "Deep Blush", hex: "#fe6c62" },
  { oldCode: "R10", oldName: "Pastel Pink", newCode: "RV08", newName: "Pastel Pink", hex: "#F87FCB" },
  { oldCode: "R11", oldName: "Mauve Shadow", newCode: "V13", newName: "Greyed Lavender", hex: "#DAB0E2" },
  { oldCode: "R110", oldName: "Sardonyx", newCode: "R15", newName: "Lychee Juice", hex: "#fac0ba" },
  { oldCode: "R12", oldName: "Rose Buvard", newCode: "R46", newName: "Old Rose", hex: "#db8b8f" },
  { oldCode: "R120", oldName: "Light Prawn", newCode: "R27", newName: "Pink Satin", hex: "#e591a3" },
  { oldCode: "R13", oldName: "Clematis", newCode: "BV29", newName: "Iris", hex: "#6675a9" },
  { oldCode: "R14", oldName: "Pale Purple", newCode: "RV18", newName: "Sheer Peach", hex: "#f597b0" },
  { oldCode: "R15", oldName: "Cerise", newCode: "RV19", newName: "Dahlia Pink", hex: "#f18cb2" },
  { oldCode: "R150", oldName: "Zinnober", newCode: "R112", newName: "Reddish Pink", hex: "#ed7171" },
  { oldCode: "R16", oldName: "Deep Violet", newCode: "RV316", newName: "Grape Jelly", hex: "#824d81" },
  { oldCode: "R17", oldName: "Pansy", newCode: "V216", newName: "Morning Glory", hex: "#645ca7" },
  { oldCode: "R170", oldName: "Lipstick Red", newCode: "R212", newName: "Mulberry", hex: "#b9596e" },
  { oldCode: "R18", oldName: "Pastel Peach", newCode: "YR04", newName: "Pastel Peach", hex: "#fbe5d1" },
  { oldCode: "R180", oldName: "Bright Red", newCode: "R016", newName: "Chili Red", hex: "#ad4a43" },
  { oldCode: "R19", oldName: "Barely Beige", newCode: "YR33", newName: "Rose Cream", hex: "#fcdacc" },
  { oldCode: "R190", oldName: "Bougainvillaea", newCode: "R26", newName: "Valentine Pink", hex: "#efa1b4" },
  { oldCode: "R2", oldName: "Vermilion", newCode: "R014", newName: "Deep Vermilion", hex: "#e63540" },
  { oldCode: "R20", oldName: "Powder Pink", newCode: "YR34", newName: "Peach Cream", hex: "#fcc8b7" },
  { oldCode: "R21", oldName: "Fruit Pink", newCode: "R16", newName: "Light Salmon", hex: "#CA858A" },
  { oldCode: "R22", oldName: "Dark Blush", newCode: "RV17", newName: "Pink", hex: "#f5a5b9" },
  { oldCode: "R23", oldName: "Rose Pink", newCode: "R38", newName: "Rose Pink", hex: "#e38fa6" },
  { oldCode: "R230", oldName: "Strong Red", newCode: "R211", newName: "Ruby", hex: "#b2556e" },
  { oldCode: "R24", oldName: "Dark Violet Light", newCode: "V38", newName: "Deep Periwinkle", hex: "#a9aad5" },
  { oldCode: "R240", oldName: "Garnet", newCode: "R59", newName: "Wine Berry", hex: "#9b5c70" },
  { oldCode: "R242", oldName: "Grayish Cherry", newCode: "R50", newName: "Orchid Wisp", hex: "#f6e6e7" },
  { oldCode: "R25", oldName: "Pale Blue Violet", newCode: "BV26", newName: "Pale Blue Violet", hex: "#aab0da" },
  { oldCode: "R250", oldName: "Antique Fuchsia", newCode: "R54", newName: "Lavender Fog", hex: "#dec0ca" },
  { oldCode: "R270", oldName: "Baby Blossoms", newCode: "R56", newName: "Puce", hex: "#d3a9b7" },
  { oldCode: "R282", oldName: "Colocasia Tonorino", newCode: "R69", newName: "Dark Mauve", hex: "#9f787c" },
  { oldCode: "R284", oldName: "Clove", newCode: "E713", newName: "Red Bean", hex: "#986466" },
  { oldCode: "R29", oldName: "Pear Color", newCode: "YR47", newName: "Dusty Peach", hex: "#f5c8b8" },
  { oldCode: "R290", oldName: "Cardinal", newCode: "R513", newName: "Deep Wine", hex: "#945a62" },
  { oldCode: "R3", oldName: "Coral Red", newCode: "R015", newName: "Crimson", hex: "#b34e53" },
  { oldCode: "R340", oldName: "Argyle Purple", newCode: "R612", newName: "Raisin", hex: "#82646a" },
  { oldCode: "R350", oldName: "Dark Purple Grey", newCode: "R615", newName: "Black Grape", hex: "#706167" },
  { oldCode: "R4", oldName: "Deep Red", newCode: "R412", newName: "Cerise", hex: "#F92E4C" },
  { oldCode: "R5", oldName: "Cherry Pink", newCode: "R413", newName: "Amaranth", hex: "#D7395B" },
  { oldCode: "R6", oldName: "Rose Red", newCode: "R213", newName: "Pomegranate", hex: "#bb5566" },
  { oldCode: "R7", oldName: "Old Red", newCode: "R514", newName: "Prune Juice", hex: "#863437" },
  { oldCode: "R8", oldName: "Geranium", newCode: "R215", newName: "Morello Cherry", hex: "#a60101" },
  { oldCode: "R9", oldName: "Pastel Rose", newCode: "R28", newName: "Pink Carnation", hex: "#fd7c95" },
  { oldCode: "RG030", oldName: "Red Grey 03", newCode: "YGY02", newName: "Abalone Grey", hex: "#e0d9d6" },
  { oldCode: "RG050", oldName: "Red Grey 05", newCode: "YGY05", newName: "Dovetail Grey", hex: "#bbafaf" },
  { oldCode: "RG080", oldName: "Red Grey 08", newCode: "WG08", newName: "Heathered Grape", hex: "#908890" },
  { oldCode: "RG110", oldName: "Red Grey 11", newCode: "WG01", newName: "Lite Lavender", hex: "#e2d8dc" },
  { oldCode: "RG120", oldName: "Red Grey 12", newCode: "WG04", newName: "Icy Lavender", hex: "#d0cdcf" },
  { oldCode: "RP1", oldName: "Vivid Reddish Purple", newCode: "RV212", newName: "Rich Raspberry", hex: "#E30B5C" },
  { oldCode: "RP6", oldName: "Vivid Pink", newCode: "RV111", newName: "Hot Pink", hex: "#f4248f" },
  { oldCode: "RV010", oldName: "Water Lily", newCode: "RV01", newName: "Water Lily", hex: "#faf0f4" },
  { oldCode: "RV030", oldName: "Light Hot Pink", newCode: "RV04", newName: "Light Orchid", hex: "#f2bed5" },
  { oldCode: "RV100", oldName: "Red Onion", newCode: "RV310", newName: "Fuchsia", hex: "#d6639d" },
  { oldCode: "RV130", oldName: "Queen Pink", newCode: "RV23", newName: "Pink Wisp", hex: "#f6d8e4" },
  { oldCode: "RV160", oldName: "Thistle", newCode: "RV33", newName: "Thistle", hex: "#ebccdf" },
  { oldCode: "RV180", oldName: "Hollyhock", newCode: "RV25", newName: "Rosy Lilac", hex: "#eeb1cd" },
  { oldCode: "RV240", oldName: "Bronze Purple", newCode: "RV514", newName: "Violet Merlot", hex: "#96647e" },
  { oldCode: "RV250", oldName: "Peony", newCode: "RV515", newName: "Ripe Mulberry", hex: "#875c79" },
  { oldCode: "RV260", oldName: "Pink", newCode: "R22", newName: "Ballet Pink", hex: "#fadee4" },
  { oldCode: "RV280", oldName: "Light Pink", newCode: "RV05", newName: "Pink Pearl", hex: "#f6bad1" },
  { oldCode: "RV300", oldName: "Tender Pink", newCode: "R25", newName: "Tender Pink", hex: "#f9acbe" },
  { oldCode: "RV330", oldName: "Strawberry Pink", newCode: "R310", newName: "Purplish Pink", hex: "#cf7693" },
  { oldCode: "RV350", oldName: "Crimson", newCode: "R312", newName: "Magenta", hex: "#F3355C" },
  { oldCode: "V020", oldName: "Pale Lilac", newCode: "RV34", newName: "Faded Lilac", hex: "#eccade" },
  { oldCode: "V030", oldName: "Mauve", newCode: "V14", newName: "Pale Purple", hex: "#cbb1d4" },
  { oldCode: "V050", oldName: "Pearl Violet", newCode: "V08", newName: "Light Violet", hex: "#a78cc2" },
  { oldCode: "V070", oldName: "Eggplant Purple", newCode: "V112", newName: "Vivid Violet", hex: "#a570af" },
  { oldCode: "V080", oldName: "Dark Violet", newCode: "V015", newName: "Deep Violet", hex: "#897195" },
  { oldCode: "V150", oldName: "Mallow", newCode: "RV35", newName: "Bright Lilac", hex: "#e0c2da" },
  { oldCode: "V210", oldName: "Signal Violet", newCode: "V013", newName: "Violet", hex: "#8c6298" },
  { oldCode: "V230", oldName: "Viola", newCode: "V22", newName: "Lavender Wisp", hex: "#d6cce6" },
  { oldCode: "V320", oldName: "Gentian Violet", newCode: "V414", newName: "Electric Indigo", hex: "#7268aa" },
  { oldCode: "V322", oldName: "Rain Flower Purple", newCode: "V32", newName: "Icy Periwinkle", hex: "#dce0ef" },
  { oldCode: "V330", oldName: "Prune", newCode: "V34", newName: "Periwinkle", hex: "#d2d5ea" },
  { oldCode: "V340", oldName: "Lavender Blue", newCode: "BV15", newName: "Dusty Periwinkle", hex: "#b6c0d6" },
  { oldCode: "V390", oldName: "Dark Slate Blue", newCode: "BV210", newName: "Blueberry", hex: "#5861b0" },
  { oldCode: "V450", oldName: "Dark Lavender", newCode: "BV115", newName: "Shadow Blue", hex: "#737196" },
  { oldCode: "WG01", oldName: "Warm Grey", newCode: "YGY11", newName: "Collingwood Grey 1", hex: "#d3c0b4" },
  { oldCode: "WG050", oldName: "Warm Grey 05", newCode: "YGY13", newName: "Oyster Grey", hex: "#d7d0c9" },
  { oldCode: "WG070", oldName: "Warm Grey 07", newCode: "YGY17", newName: "Platinum Grey", hex: "#bbb4ac" },
  { oldCode: "WG09", oldName: "Warm Grey 9", newCode: "WG37", newName: "Dark Charcoal", hex: "#666565" },
  { oldCode: "WG090", oldName: "Warm Grey 09", newCode: "YGY18", newName: "Stone Grey", hex: "#938c88" },
  { oldCode: "WG130", oldName: "Warm Grey 13", newCode: "WG38", newName: "Caviar", hex: "#57585d" },
  { oldCode: "WG3", oldName: "Warm Grey 3", newCode: "WG26", newName: "Silver Grey", hex: "#b5b1af" },
  { oldCode: "WG4", oldName: "Warm Grey 4", newCode: "WG27", newName: "Antique Silver", hex: "#a29f9e" },
  { oldCode: "Y010", oldName: "Primrose", newCode: "Y00", newName: "Lemon Mist", hex: "#fafaec" },
  { oldCode: "Y030", oldName: "Lemon Chiffon", newCode: "Y02", newName: "Lemon Chiffon", hex: "#f2f3bd" },
  { oldCode: "Y040", oldName: "Calamansi", newCode: "Y06", newName: "Butter", hex: "#f6ee94" },
  { oldCode: "Y1", oldName: "Pastel Yellow", newCode: "Y27", newName: "Sunflower", hex: "#fddc47" },
  { oldCode: "Y10", oldName: "Apricot", newCode: "YR111", newName: "Persimmon", hex: "#f49351" },
  { oldCode: "Y11", oldName: "Brown Grey", newCode: "Y611", newName: "Dark Sand", hex: "#c8a783" },
  { oldCode: "Y110", oldName: "Grayish Yellow", newCode: "Y42", newName: "Warm Ivory", hex: "#fce5c3" },
  { oldCode: "Y12", oldName: "Mahogany", newCode: "E511", newName: "Chocolate Mocha", hex: "#94746a" },
  { oldCode: "Y120", oldName: "Buttercup Yellow", newCode: "Y55", newName: "Golden Champagne", hex: "#ffe1bf" },
  { oldCode: "Y121", oldName: "Primrose", newCode: "Y34", newName: "Eggnog Yellow", hex: "#fdf2d7" },
  { oldCode: "Y13", oldName: "Chestnut Brown", newCode: "E515", newName: "Black Brown", hex: "#615857" },
  { oldCode: "Y130", oldName: "Mustard", newCode: "Y59", newName: "Marigold Yellow", hex: "#e6be80" },
  { oldCode: "Y140", oldName: "Nugget", newCode: "Y49", newName: "Autumn Leaf", hex: "#ebb873" },
  { oldCode: "Y180", oldName: "Shallow Orange Cafe", newCode: "Y215", newName: "Toffee", hex: "#cf8e4f" },
  { oldCode: "Y2", oldName: "Sunflower", newCode: "Y111", newName: "Mustard", hex: "#f2b740" },
  { oldCode: "Y210", oldName: "Deep Teak", newCode: "Y416", newName: "Golden Brown", hex: "#ac7f54" },
  { oldCode: "Y230", oldName: "Deep Cream", newCode: "E26", newName: "Pale Celery", hex: "#e6d4ac" },
  { oldCode: "Y250", oldName: "Flax", newCode: "E17", newName: "Sage Grey", hex: "#d4c7a5" },
  { oldCode: "Y3", oldName: "Barium Yellow", newCode: "Y26", newName: "Light Gold", hex: "#FFEB6C" },
  { oldCode: "Y4", oldName: "Quince", newCode: "YR17", newName: "Sunset Orange", hex: "#fbba8c" },
  { oldCode: "Y5", oldName: "Rouge Orange", newCode: "R013", newName: "Tomato", hex: "#dd7762" },
  { oldCode: "Y6", oldName: "Lemon Yellow", newCode: "Y28", newName: "Corn Yellow", hex: "#edb55a" },
  { oldCode: "Y7", oldName: "Dull Yellow", newCode: "E212", newName: "Dusty Olive", hex: "#bbab7f" },
  { oldCode: "Y8", oldName: "Olive Yellow", newCode: "Y315", newName: "Olive Yellow", hex: "#bb9855" },
  { oldCode: "Y9", oldName: "Yellow Ochre", newCode: "Y415", newName: "Sand Storm", hex: "#c79a66" },
  { oldCode: "YG040", oldName: "Yellow Grey 04", newCode: "E14", newName: "Khaki Beige", hex: "#d7c9bc" },
  { oldCode: "YR030", oldName: "Carmine Red", newCode: "YR52", newName: "Cameo Rose", hex: "#f8e0d5" },
  { oldCode: "YR070", oldName: "Light Orange", newCode: "YR59", newName: "Cantaloupe", hex: "#fab69b" },
  { oldCode: "YR090", oldName: "Peach Pie", newCode: "YR511", newName: "Pale Coral", hex: "#FF926D" },
  { oldCode: "YR1", oldName: "Dark Yellow", newCode: "Y216", newName: "Caramel", hex: "#C68830" },
  { oldCode: "YR110", oldName: "Mellow Peach", newCode: "YR11", newName: "Peachy Blush", hex: "#fadec9" },
  { oldCode: "YR172", oldName: "Tiger Lily", newCode: "YR015", newName: "Burnt Orange", hex: "#d98855" },
  { oldCode: "YR180", oldName: "Lipstick Orange", newCode: "YR213", newName: "Squash Orange", hex: "#e7875e" },
  { oldCode: "YR2", oldName: "Marigold", newCode: "Y213", newName: "Dark Marigold", hex: "#E07C14" },
  { oldCode: "YR220", oldName: "Yellowish Shade", newCode: "YR03", newName: "Pastel Blush", hex: "#fce6d5" },
  { oldCode: "YR240", oldName: "Cream", newCode: "Y45", newName: "Cream", hex: "#f3c99c" },
  { oldCode: "YR3", oldName: "Orange", newCode: "YR112", newName: "Orange", hex: "#F6610C" },
  { oldCode: "YR33", oldName: "Melon Yellow", newCode: "Y29", newName: "Melon Yellow", hex: "#ecac4a" },
  { oldCode: "YR4", oldName: "Salmon Pink", newCode: "YR07", newName: "Salmon Orange", hex: "#f3955b" },
  { oldCode: "YR5", oldName: "Terra Cotta", newCode: "YR515", newName: "Burnt Sienna", hex: "#c6511c" },
  { oldCode: "B070", oldName: "Tahitian Blue", newCode: "B09", newName: "Tahitian Blue", hex: "#54b6d9" },
  { oldCode: "B140", oldName: "Aquamarine", newCode: "BV58", newName: "Crystal Blue", hex: "#82c1ea" },
  { oldCode: "B260", oldName: "Smoky Blue", newCode: "BV48", newName: "Distressed Denim", hex: "#98aed0" },
  { oldCode: "B290", oldName: "Antwerp Blue", newCode: "BV415", newName: "Antwerp Blue", hex: "#4b83a7" },
  { oldCode: "B350", oldName: "Cornflower Blue", newCode: "BV08", newName: "Havelock Blue", hex: "#7ba0d3" },
  { oldCode: "B380", oldName: "Capri Blue", newCode: "BV013", newName: "French Ultramarine", hex: "#4661b3" },
  { oldCode: "BG070", oldName: "Cool Grey 07", newCode: "GG12", newName: "Pastel Icy Grey", hex: "#a5b2bb" },
  { oldCode: "CG070", oldName: "Neutral Grey 07", newCode: "CG28", newName: "Web Grey", hex: "#7d848c" },
  { oldCode: "E060", oldName: "Light Mahogany", newCode: "E610", newName: "Light Mahogany", hex: "#9f5024" },
  { oldCode: "E110", oldName: "Dark Suntan", newCode: "YR312", newName: "Light Earth Brown", hex: "#ca9274" },
  { oldCode: "E170", oldName: "Caribe Cocoa", newCode: "E58", newName: "Fawn Brown", hex: "#c59d87" },
  { oldCode: "E240", oldName: "Chamois", newCode: "Y413", newName: "Fawn", hex: "#d0a77d" },
  { oldCode: "E300", oldName: "Clay", newCode: "E311", newName: "Sandbar Brown", hex: "#ada28a" },
  { oldCode: "E310", oldName: "Dark Brown", newCode: "E413", newName: "Dark Brown", hex: "#9b8073" },
  { oldCode: "E400", oldName: "Cocoa Brown", newCode: "E97", newName: "Deep Rose Grey", hex: "#bea29a" },
  { oldCode: "E440", oldName: "Khaki", newCode: "E211", newName: "Light Elm Wood", hex: "#ceb58a" },
  { oldCode: "E490", oldName: "Deep Orange", newCode: "Y412", newName: "Apple Cider", hex: "#e3ac85" },
  { oldCode: "FY050", oldName: "Fluorescent Violet", newCode: "FY03", newName: "Fluorescent Violet", hex: "#7133fc" },
  { oldCode: "G060", oldName: "Celery Yellow", newCode: "YG111", newName: "Celery", hex: "#dfda91" },
  { oldCode: "G070", oldName: "Lemon Green", newCode: "YG112", newName: "Lemon Lime", hex: "#e0dc77" },
  { oldCode: "G170", oldName: "May Green", newCode: "YG160", newName: "Bright Lime", hex: "#95ce68" },
  { oldCode: "G190", oldName: "Olive Green", newCode: "YG611", newName: "Mantis Green", hex: "#85c269" },
  { oldCode: "G240", oldName: "Beige Green", newCode: "YG36", newName: "Beige Green", hex: "#b3c2a7" },
  { oldCode: "G360", oldName: "Pond Green", newCode: "BG211", newName: "Spearmint", hex: "#74cab1" },
  { oldCode: "G440", oldName: "Leaf Green", newCode: "G44", newName: "Sea Glass Green", hex: "#b9dbbe" },
  { oldCode: "GG060", oldName: "Green Grey 06", newCode: "BGY13", newName: "Seagull Grey", hex: "#99a4a7" },
  { oldCode: "MG060", oldName: "Blue Grey 06", newCode: "B311", newName: "Stone Blue", hex: "#8daebe" },
  { oldCode: "R160", oldName: "Cadmium Red", newCode: "R410", newName: "Raspberry", hex: "#db6873" },
  { oldCode: "R200", oldName: "Coralessence", newCode: "R48", newName: "Cherry Rose", hex: "#de717f" },
  { oldCode: "R280", oldName: "Currant", newCode: "R57", newName: "Rose Dust", hex: "#c1889c" },
  { oldCode: "RG150", oldName: "Red Grey 150", newCode: "WG06", newName: "Star Dust", hex: "#aea2ab" },
  { oldCode: "RV070", oldName: "Sakura Pink", newCode: "RV09", newName: "Disco Pink", hex: "#f188b0" },
  { oldCode: "RV080", oldName: "Bright Pink", newCode: "RV39", newName: "Bright Fuchsia", hex: "#c877a8" },
  { oldCode: "RV200", oldName: "Dark Orchid", newCode: "RV28", newName: "Hibiscus Pink", hex: "#d288aa" },
  { oldCode: "RV270", oldName: "Shadow Pink", newCode: "R23", newName: "Sakura", hex: "#fad2da" },
  { oldCode: "RV320", oldName: "Apricot Pink", newCode: "RV29", newName: "Plum Pink", hex: "#ce779e" },
  { oldCode: "V060", oldName: "Amethyst", newCode: "V29", newName: "Dull Violet", hex: "#9288b3" },
  { oldCode: "V160", oldName: "Deep Lilac", newCode: "RV57", newName: "Dark Lilac", hex: "#cea8cc" },
  { oldCode: "V250", oldName: "Light Lavender", newCode: "V46", newName: "Lavender", hex: "#aaa2d1" },
  { oldCode: "V270", oldName: "Lobella", newCode: "V412", newName: "Lobelia", hex: "#998ec3" },
  { oldCode: "V370", oldName: "Blue Bell", newCode: "BV28", newName: "Bluebonnet", hex: "#6e7ebf" },
  { oldCode: "Y050", oldName: "Summer Lemon", newCode: "Y09", newName: "Summer Lemon", hex: "#e7d775" },
  { oldCode: "Y260", oldName: "Yellow Dahlia", newCode: "Y39", newName: "Straw", hex: "#eac885" },
  { oldCode: "Y270", oldName: "Pale Ocre", newCode: "Y311", newName: "Termite Beige", hex: "#d6af76" },
  { oldCode: "YG080", oldName: "Yellow Grey 08", newCode: "E19", newName: "Dried Sage", hex: "#c8c1a9" },
  { oldCode: "YR170", oldName: "Chrome Orange", newCode: "YR19", newName: "Marigold Orange", hex: "#fab668" },
  { oldCode: "YR190", oldName: "Cadmium Orange", newCode: "YR513", newName: "Papaya", hex: "#f68661" },
  { oldCode: "YR250", oldName: "Moccasin", newCode: "Y46", newName: "Peach Yogurt", hex: "#f3be82" },
  { oldCode: "YR260", oldName: "Yellowish Brown", newCode: "Y410", newName: "Goldenrod", hex: "#eeb572" },
  { oldCode: "BG060", oldName: "Deep Cool Grey", newCode: "GG11", newName: "Fog Grey", hex: "#b3babc" },
  { oldCode: "Y070", oldName: "Acid Yellow", newCode: "Y19", newName: "Canary", hex: "#f2d848" },
  { oldCode: "Y080", oldName: "Lightning Yellow", newCode: "Y17", newName: "Bright Lemon Yellow", hex: "#efed72" },
  { oldCode: "0", oldName: "Colorless Blender", newCode: "0", newName: "Colorless Blender", hex: "#ffffff" },
  {
    oldCode: "YR209",
    oldName: "",
    newCode: "E47",
    newName: "Camel",
    hex: "#c5977b"
  },
  {
    oldCode: "Y145",
    oldName: "",
    newCode: "E49",
    newName: "Honey Brown",
    hex: "#af7b63"
  },
  {
    oldCode: "YR9",
    oldName: "",
    newCode: "E59",
    newName: "Chestnut",
    hex: "#865047"
  },
  {
    oldCode: "YR148",
    oldName: "",
    newCode: "E66",
    newName: "Light Fawn",
    hex: "#a07069"
  },
  {
    oldCode: "R26",
    oldName: "",
    newCode: "E75",
    newName: "Light Rose Taupe",
    hex: "#b07a7c"
  },
  {
    oldCode: "R30",
    oldName: "",
    newCode: "E81",
    newName: "Spanish Pink",
    hex: "#c99fb3"
  },
  {
    oldCode: "YG100",
    oldName: "",
    newCode: "E111",
    newName: "Pewter Green",
    hex: "#bdad96"
  },
  {
    oldCode: "YR95",
    oldName: "",
    newCode: "E513",
    newName: "Taupe Brown",
    hex: "#46353d"
  },
  {
    oldCode: "YR92",
    oldName: "",
    newCode: "E514",
    newName: "Dark Chocolate",
    hex: "#32252e"
  },
  {
    oldCode: "YR10",
    oldName: "",
    newCode: "E612",
    newName: "Brick Brown",
    hex: "#6b3533"
  },
  {
    oldCode: "YR91",
    oldName: "",
    newCode: "E615",
    newName: "Cherry Cola",
    hex: "#472a2a"
  },
  {
    oldCode: "R27",
    oldName: "",
    newCode: "E711",
    newName: "Old Mahogany",
    hex: "#916062"
  },
  {
    oldCode: "R28",
    oldName: "",
    newCode: "E814",
    newName: "Caput Mortuum",
    hex: "#765b69"
  },
  {
    oldCode: "WG0.5",
    oldName: "",
    newCode: "YR02",
    newName: "Peach Silk",
    hex: "#cdbdc2"
  },
  {
    oldCode: "YR7",
    oldName: "",
    newCode: "YR09",
    newName: "Sandstone",
    hex: "#e07c45"
  },
  {
    oldCode: "YR205",
    oldName: "",
    newCode: "YR25",
    newName: "Powder Orange",
    hex: "#e1956a"
  },
  {
    oldCode: "YR8",
    oldName: "",
    newCode: "YR29",
    newName: "Grapefruit",
    hex: "#d76c3b"
  },
  {
    oldCode: "YR20",
    oldName: "",
    newCode: "YR37",
    newName: "Roasted Cashew",
    hex: "#d18360"
  },
  {
    oldCode: "YR107",
    oldName: "",
    newCode: "YR38",
    newName: "Burnt Ochre",
    hex: "#d77e4f"
  },
  {
    oldCode: "YR212",
    oldName: "",
    newCode: "Y43",
    newName: "Warm Beige",
    hex: "#dac4bd"
  },
  {
    oldCode: "YR6",
    oldName: "",
    newCode: "Y48",
    newName: "Light Apricot",
    hex: "#d7a554"
  },
  {
    oldCode: "YR34",
    oldName: "",
    newCode: "Y210",
    newName: "Pumpkin Yellow",
    hex: "#b97317"
  }

];

export type ColorItem = {
  oldCode: string;
  oldName: string;
  newCode: string;
  newName: string;
  hex: string;
  family: string;
  saturation: number;
  brightness: number;
  h: number;
  s: number;
  l: number;
};

// Map each color to structured properties
export const COLORS: ColorItem[] = OHUHU_COLORS.map(c => {
  const code = c.newCode;
  const match = code.match(/^([A-Z]+)(\d)(\d{1,3})$/);
  let family = code, saturation = 0, brightness = 0;
  if (match) {
    family = match[1];
    saturation = parseInt(match[2]);
    brightness = parseInt(match[3]);
  }

  // Merge FY colors into their closest chromatic families
  const FY_FAMILY_MAP: Record<string, string> = {
    "FY00": "Y",   // Fluorescent Yellow → Y family
    "FY01": "YR",  // Fluorescent Orange → YR family
    "FY02": "R",   // Fluorescent Red → R family
    "FY03": "V"    // Fluorescent Violet → V family
  };

  if (FY_FAMILY_MAP[code]) {
    family = FY_FAMILY_MAP[code];
  }

  const hsl = hexToHSL(c.hex);
  return { ...c, family, saturation, brightness, ...hsl };
});

