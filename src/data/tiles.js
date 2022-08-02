import WeightedMap from "../utils/WeightedMap";

import * as grassLandTiles from "../../assets/Tiles Grasslands/*.png";
import * as forestTiles from "../../assets/Tiles Forests/*.png";
import * as mountainTiles from "../../assets/Tiles Mountains/*.png";
import * as oceanTiles from "../../assets/Tiles Oceans/*.png";
import * as oceanWaveTiles from "../../assets/Tiles Oceans with Waves/*.png";

import tileCorners from "../../assets/Overlays Hex Corners/hex_corner_overlay.png";
import tileBorders from "../../assets/Overlays Hex Borders/hex_border_overlay.png";
import reduceEntries from "../utils/reduceEntries";

const tilePaths = {
  grassland: Object.keys(grassLandTiles).map((key) => `grassland.${key}`),
  forest: Object.keys(forestTiles).map((key) => `forest.${key}`),
  mountain: Object.keys(mountainTiles).map((key) => `mountain.${key}`),
  ocean: Object.keys(oceanTiles).map((key) => `ocean.${key}`),
  oceanWave: Object.keys(oceanWaveTiles).map((key) => `oceanWave.${key}`),
};

const fixTilesKeys = (tiles, keyPrefix) => {
  const entries = Object.entries(tiles);
  const fixedKeyEntries = entries.map(([key, value]) => [
    `${keyPrefix}.${key}`,
    value,
  ]);

  return reduceEntries(fixedKeyEntries);
};

const tileImages = {
  ...fixTilesKeys(grassLandTiles, "grassland"),
  ...fixTilesKeys(forestTiles, "forest"),
  ...fixTilesKeys(mountainTiles, "mountain"),
  ...fixTilesKeys(oceanTiles, "ocean"),
  ...fixTilesKeys(oceanWaveTiles, "oceanWave"),
};

const tilesMap = new WeightedMap({
  grassland: 50,
  forest: 15,
  mountain: 5,
  ocean: 25,
  oceanWave: 5,
});

export { tilePaths, tilesMap, tileImages, tileBorders };
