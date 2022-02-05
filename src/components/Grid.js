import { defineGrid, extendHex } from "honeycomb-grid";
import React, { useEffect, useState } from "react";

import WeightedMap from "../utils/WeightedMap";

import * as grassLandTiles from "../../assets/Tiles Grasslands/*.png";
import * as forestTiles from "../../assets/Tiles Forests/*.png";
import * as mountainTiles from "../../assets/Tiles Mountains/*.png";
import * as oceanTiles from "../../assets/Tiles Oceans/*.png";
import * as oceanWaveTiles from "../../assets/Tiles Oceans with Waves/*.png";
import tileCorners from "../../assets/Overlays Hex Corners/hex_corner_overlay.png";
import tileBorders from "../../assets/Overlays Hex Borders/hex_border_overlay.png";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import useScaleRef from "../hooks/useScaleRef";

const tilePaths = {
  grassland: Object.values(grassLandTiles),
  forest: Object.values(forestTiles),
  mountain: Object.values(mountainTiles),
  ocean: Object.values(oceanTiles),
  oceanWave: Object.values(oceanWaveTiles),
};

const tilesMap = new WeightedMap({
  grassland: 50,
  forest: 15,
  mountain: 5,
  ocean: 25,
  oceanWave: 5,
});

const TOP_MARGIN = 60;
const TILE_HEIGHT = 135;
const TILE_IMAGE_HEIGHT = 380;
const TILE_WIDTH = 300;
const TILE_IMAGE_WIDTH = 380;
const dimensions = { width: 8, height: 8 };

const Grid = () => {
  const scaleRef = useScaleRef();
  const [grid, setGrid] = useState();

  useEffect(() => {
    const Hex = extendHex({
      orientation: "flat",
      size: { width: TILE_WIDTH, height: TILE_HEIGHT },
    });
    const GridData = defineGrid(Hex);

    const initialGrid = GridData.rectangle(dimensions);

    setGrid(initialGrid);
  }, []);

  if (!grid) {
    return null;
  }

  return (
    <div
      ref={scaleRef}
      style={{
        width: `${dimensions.width * TILE_IMAGE_WIDTH * (2 / 3)}px`,
        height: `${dimensions.height * TILE_HEIGHT + 2 * TILE_HEIGHT}px`,
      }}
    >
      {grid.map((hex) => {
        const { x, y } = hex.toPoint();

        const tileType = tilesMap.pickRandom();
        const tileTypeImages = tilePaths[tileType];
        const tileImage = pickRandomlyFromArray(tileTypeImages);

        return (
          <img
            key={`x:${x},y:${y}`}
            style={{
              position: "absolute",
              left: x,
              top: y - TOP_MARGIN,
              zIndex: Math.floor(y),
            }}
            className="tile"
            src={tileImage}
          />
        );
      })}
    </div>
  );
};

export default Grid;
