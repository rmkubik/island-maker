import WeightedMap from "../utils/WeightedMap";

import * as grassLandTiles from "../../assets/Tiles Grasslands/*.png";
import * as forestTiles from "../../assets/Tiles Forests/*.png";
import * as mountainTiles from "../../assets/Tiles Mountains/*.png";
import * as oceanTiles from "../../assets/Tiles Oceans/*.png";
import * as oceanWaveTiles from "../../assets/Tiles Oceans with Waves/*.png";

import tileCorners from "../../assets/Overlays Hex Corners/hex_corner_overlay.png";
import tileBorders from "../../assets/Overlays Hex Borders/hex_border_overlay.png";
import reduceEntries from "../utils/reduceEntries";
import combineEntriesWithKeys from "../utils/combineEntriesWithKeys";

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

const tileNames = {
  grassland: "Grassland",
  forest: "Forest",
  mountain: "Mountain",
  ocean: "Ocean",
  oceanWave: "Ocean with Wave",
};

const _biomeSettings = {
  plains: {
    tileWeights: new WeightedMap({
      grassland: 73,
      forest: 15,
      mountain: 4,
      ocean: 5,
      oceanWave: 3,
    }),
    resourceWeights: {
      turnip: 10,
      fish: 0,
      tracks: 3,
      ruins: 0,
      xMark: 0,
    },
  },
  classic: {
    tileWeights: new WeightedMap({
      grassland: 50,
      forest: 15,
      mountain: 5,
      ocean: 25,
      oceanWave: 5,
    }),
    resourceWeights: {
      turnip: 8,
      fish: 6,
      tracks: 3,
      ruins: 0,
      xMark: 0,
    },
  },
  oceanic: {
    tileWeights: new WeightedMap({
      grassland: 34,
      forest: 3,
      mountain: 3,
      ocean: 50,
      oceanWave: 10,
    }),
    resourceWeights: {
      turnip: 1,
      fish: 10,
      tracks: 2,
      ruins: 0,
      xMark: 5,
    },
  },
  forested: {
    tileWeights: new WeightedMap({
      grassland: 35,
      forest: 35,
      mountain: 5,
      ocean: 23,
      oceanWave: 2,
    }),
    resourceWeights: {
      turnip: 5,
      fish: 4,
      tracks: 5,
      ruins: 4,
      xMark: 0,
    },
  },
  rugged: {
    tileWeights: new WeightedMap({
      grassland: 45,
      forest: 20,
      mountain: 15,
      ocean: 15,
      oceanWave: 5,
    }),
    resourceWeights: {
      turnip: 6,
      fish: 0,
      tracks: 2,
      ruins: 6,
      xMark: 0,
    },
  },
};
const biomeSettings = combineEntriesWithKeys(Object.entries(_biomeSettings));

export {
  tilePaths,
  tilesMap,
  tileImages,
  tileBorders,
  tileNames,
  biomeSettings,
};
