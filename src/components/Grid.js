import { defineGrid, extendHex } from "honeycomb-grid";
import React, { useEffect, useState } from "react";

import WeightedMap from "../utils/WeightedMap";

import * as grassLandTiles from "../../assets/Tiles Grasslands/*.png";
import * as forestTiles from "../../assets/Tiles Forests/*.png";
import * as mountainTiles from "../../assets/Tiles Mountains/*.png";
import * as oceanTiles from "../../assets/Tiles Oceans/*.png";
import * as oceanWaveTiles from "../../assets/Tiles Oceans with Waves/*.png";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";

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

const TILE_HEIGHT = 135; // 380;
const TILE_WIDTH = 302; // 380;

const Grid = () => {
  const [grid, setGrid] = useState();

  useEffect(() => {
    const Hex = extendHex({
      orientation: "flat",
      size: { width: TILE_WIDTH, height: TILE_HEIGHT },
    });
    const GridData = defineGrid(Hex);

    const initialGrid = GridData.rectangle({ width: 8, height: 8 });

    setGrid(initialGrid);
  }, []);

  if (!grid) {
    return null;
  }

  return (
    <div style={{}}>
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
              top: y,
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
