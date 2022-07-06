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
import levels from "../data/levels";
import { GAME_MODE_OPTIONS } from "../data/config";

function Game({
  scale,
  setView,
  showGameOver,
  unlockItem,
  commitUnlocks,
  gameMode,
  currentLevel,
}) {
  const [previewCount, setPreviewCount] = useState(1);
  const [banked, setBanked] = useState([objects.x]);
  const [newCards, setNewCards] = useState([]);
  const { GridDataRef, grid } = useHexGrid({
    initializeHex: (hex) => {
      switch (gameMode) {
        case GAME_MODE_OPTIONS.SEEDED:
        case GAME_MODE_OPTIONS.EDITOR:
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
          break;
        case GAME_MODE_OPTIONS.PREMADE:
          // Do nothing here
          break;
      }
    },
    premadeGrid:
      gameMode === GAME_MODE_OPTIONS.PREMADE &&
      levels[currentLevel?.level]?.grid,
  });
  const { deck, setDeck } = useDeck({ gameMode });
  const [shouldShowSelected, setShouldShowSelected] = useState(true);
  const [isForcedGameOver, setIsForcedGameOver] = useState(false);

  const addBankSlot = () => {
    const newBanked = [...banked, objects.x];
    setBanked(newBanked);
  };

  const addPreviewSlot = () => {
    setPreviewCount(previewCount + 1);
  };

  const isGameOver =
    isForcedGameOver ||
    (deck.length === 0 &&
      newCards.length === 0 &&
      banked.every((bankedItem) => bankedItem.key === "x"));

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
        isGameOver={isGameOver}
        game={{
          addBankSlot,
          addPreviewSlot,
          unlockItem,
          commitUnlocks,
        }}
        gameMode={gameMode}
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
        setIsForcedGameOver={setIsForcedGameOver}
        showGameOverMenu={() => {
          showGameOver(grid);
        }}
        showJournal={() => setView("journal")}
      />
    </>
  );
}

export default Game;
