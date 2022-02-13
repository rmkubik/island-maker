import React, { useState } from "react";
import Grid from "./Grid";

import "../style.css";
import useScaleRef from "../hooks/useScaleRef";
import useHexGrid from "../hooks/useHexGrid";
import useDeck from "../hooks/useDeck";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import { tilePaths, tilesMap } from "../data/tiles";
import { dimensions, TILE_HEIGHT, TILE_IMAGE_WIDTH } from "../data/config";
import TopBar from "./TopBar";

function App() {
  const [scaleRef, scale] = useScaleRef();

  const [banked, setBanked] = useState();
  const { GridDataRef, grid, setGrid } = useHexGrid({
    initializeHex: (hex) => {
      const tileType = tilesMap.pickRandom();
      const tileTypeImages = tilePaths[tileType];
      const tileImage = pickRandomlyFromArray(tileTypeImages);

      hex.tileType = tileType;
      hex.tileImage = tileImage;
      // hex.objectImage = pickRandomlyFromArray(Object.values(locationImages));
    },
  });
  const { deck, setDeck, selected, setSelected } = useDeck();

  return (
    <div
      ref={scaleRef}
      style={{
        width: `${dimensions.width * TILE_IMAGE_WIDTH * (2 / 3)}px`,
        height: `${dimensions.height * TILE_HEIGHT + 2 * TILE_HEIGHT}px`,
        cursor: "pointer",
      }}
    >
      <Grid
        deck={deck}
        setDeck={setDeck}
        grid={grid}
        GridDataRef={GridDataRef}
        scale={scale}
        selected={selected}
        setSelected={setSelected}
      />
      <TopBar
        selected={selected}
        setSelected={setSelected}
        deck={deck}
        setDeck={setDeck}
        banked={banked}
        setBanked={setBanked}
      />
    </div>
  );
}

export default App;
