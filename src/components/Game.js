import React, { useEffect, useState } from "react";
import Grid from "./Grid";

import "../style.css";
import useHexGrid from "../hooks/useHexGrid";
import useDeck from "../hooks/useDeck";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import { tilePaths, tilesMap } from "../data/tiles";
import TopBar from "./TopBar";
import getResource from "../utils/getResource";
import { objects } from "../data/locations";

function Game({ scale, setView, showGameOver }) {
  const [previewCount, setPreviewCount] = useState(1);
  const [banked, setBanked] = useState([objects.x]);
  const [newCards, setNewCards] = useState([]);
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
  const [shouldShowSelected, setShouldShowSelected] = useState(true);

  const addBankSlot = () => {
    const newBanked = [...banked, objects.x];
    setBanked(newBanked);
  };

  const addPreviewSlot = () => {
    setPreviewCount(previewCount + 1);
  };

  const isGameOver =
    deck.length === 0 &&
    newCards.length === 0 &&
    banked.every((bankedItem) => bankedItem.key === "x");

  return (
    <>
      <Grid
        deck={deck}
        shouldShowSelected={shouldShowSelected}
        setShouldShowSelected={setShouldShowSelected}
        selected={shouldShowSelected && deck[0]}
        setDeck={setDeck}
        grid={grid}
        GridDataRef={GridDataRef}
        scale={scale}
        setPreviewCount={setPreviewCount}
        newCards={newCards}
        setNewCards={setNewCards}
        game={{
          addBankSlot,
          addPreviewSlot,
        }}
      />
      <TopBar
        deck={deck}
        newCards={newCards}
        shouldShowSelected={shouldShowSelected}
        selected={shouldShowSelected && deck[0]}
        setDeck={setDeck}
        banked={banked}
        setBanked={setBanked}
        previewCount={previewCount}
        grid={grid}
        isGameOver={isGameOver}
        showGameOverMenu={() => {
          showGameOver(grid);
        }}
      />
    </>
  );
}

export default Game;
