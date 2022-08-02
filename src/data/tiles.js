import WeightedMap from "../utils/WeightedMap";

import * as grassLandTiles from "../../assets/Tiles Grasslands/*.png";
import * as forestTiles from "../../assets/Tiles Forests/*.png";
import * as mountainTiles from "../../assets/Tiles Mountains/*.png";
import * as oceanTiles from "../../assets/Tiles Oceans/*.png";
import * as oceanWaveTiles from "../../assets/Tiles Oceans with Waves/*.png";

import tileCorners from "../../assets/Overlays Hex Corners/hex_corner_overlay.png";
import tileBorders from "../../assets/Overlays Hex Borders/hex_border_overlay.png";

const tilePaths = {
  grassland: Object.values(grassLandTiles),
  forest: Object.values(forestTiles),
  mountain: Object.values(mountainTiles),
  ocean: Object.values(oceanTiles),
  oceanWave: Object.values(oceanWaveTiles),
};

const tileImages = {
  ...grassLandTiles,
  ...forestTiles,
  ...mountainTiles,
  ...oceanTiles,
  ...oceanWaveTiles,
};

const tilesMap = new WeightedMap({
  grassland: 50,
  forest: 15,
  mountain: 5,
  ocean: 25,
  oceanWave: 5,
});

export { tilePaths, tilesMap, tileImages, tileBorders };
