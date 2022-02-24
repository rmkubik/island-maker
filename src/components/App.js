import React, { useState } from "react";
import Grid from "./Grid";

import "../style.css";
import useScaleRef from "../hooks/useScaleRef";
import useHexGrid from "../hooks/useHexGrid";
import useDeck from "../hooks/useDeck";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import { tilePaths, tilesMap } from "../data/tiles";
import {
  dimensions,
  TILE_HEIGHT,
  TILE_IMAGE_WIDTH,
  VISUAL_Y_OFFSET,
} from "../data/config";
import TopBar from "./TopBar";
import getResource from "../utils/getResource";
import { objects } from "../data/locations";

function App() {
  const [scaleRef, scale] = useScaleRef();

  const [previewCount, setPreviewCount] = useState(1);
  const [banked, setBanked] = useState([objects.x]);
  const { GridDataRef, grid } = useHexGrid({
    initializeHex: (hex) => {
      const tileType = tilesMap.pickRandom();
      const tileTypeImages = tilePaths[tileType];
      const tileImage = pickRandomlyFromArray(tileTypeImages);

      const resource = getResource(tileType);

      if (resource) {
        hex.objectType = resource.key;
        hex.objectImage = resource.image;
      }

      hex.tileType = tileType;
      hex.tileImage = tileImage;
    },
  });
  const { deck, setDeck } = useDeck();

  const addBankSlot = () => {
    const newBanked = [...banked, objects.x];
    setBanked(newBanked);
  };

  const addPreviewSlot = () => {
    setPreviewCount(previewCount + 1);
  };

  return (
    <div
      ref={scaleRef}
      style={{
        width: `${dimensions.width * TILE_IMAGE_WIDTH * (2 / 3)}px`,
        height: `${
          dimensions.height * TILE_HEIGHT + 2 * TILE_HEIGHT + VISUAL_Y_OFFSET
        }px`,
        cursor: "pointer",
      }}
    >
      <Grid
        deck={deck}
        selected={deck[0]}
        setDeck={setDeck}
        grid={grid}
        GridDataRef={GridDataRef}
        scale={scale}
        setPreviewCount={setPreviewCount}
        game={{
          addBankSlot,
          addPreviewSlot,
        }}
      />
      <TopBar
        deck={deck}
        selected={deck[0]}
        setDeck={setDeck}
        banked={banked}
        setBanked={setBanked}
        previewCount={previewCount}
        grid={grid}
      />
    </div>
  );
}

export default App;
