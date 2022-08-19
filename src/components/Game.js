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
import doesObjectHaveAnyValidPlacement from "../utils/doesObjectHaveAnyValidPlacement";
import update from "../utils/update";

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
        case GAME_MODE_OPTIONS.EDITOR:
        case GAME_MODE_OPTIONS.PREMADE:
          // Do nothing here
          break;
      }
    },
    premadeGrid:
      (gameMode === GAME_MODE_OPTIONS.PREMADE ||
        gameMode === GAME_MODE_OPTIONS.EDITOR) &&
      levels[currentLevel?.level]?.grid,
  });
  const initialDeck = levels[currentLevel?.level]?.initialDeck?.map(
    (card) => objects[card]
  );
  const { deck, setDeck } = useDeck({
    gameMode,
    initialDeck,
  });
  const [shouldShowSelected, setShouldShowSelected] = useState(true);
  const [isForcedGameOver, setIsForcedGameOver] = useState(false);

  const [hasShownInitialGameOverMenu, setHasShownInitialGameOverMenu] =
    useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const areNoNewCardsLeft = newCards.length === 0;

    const isSelectedPlaceable = doesObjectHaveAnyValidPlacement({
      object: deck[0],
      grid,
    });
    const isSomeBankedPlaceable = banked.some((bankedItem) =>
      doesObjectHaveAnyValidPlacement({ object: bankedItem, grid })
    );
    const isPlayerOutOfValidPlacements =
      !isSelectedPlaceable && !isSomeBankedPlaceable && areNoNewCardsLeft;

    const isDeckEmpty = deck.length === 0;
    const isBankEmpty = banked.every((bankedItem) => bankedItem.key === "x");

    const isUnforcedGameOver = isDeckEmpty && areNoNewCardsLeft && isBankEmpty;

    /**
     * Grid is undefined if it has not finished loading yet. We cannot have a
     * game over before the game is finished loading.
     */
    const newIsGameOver =
      grid &&
      (isForcedGameOver || isPlayerOutOfValidPlacements || isUnforcedGameOver);

    if (newIsGameOver && !hasShownInitialGameOverMenu) {
      showGameOver(grid);
      setHasShownInitialGameOverMenu(true);
    }

    setIsGameOver(newIsGameOver);
  }, [newCards, deck, grid, banked, isForcedGameOver]);

  const addBankSlot = () => {
    const newBanked = [...banked, objects.x];
    setBanked(newBanked);
  };

  const addPreviewSlot = () => {
    setPreviewCount(previewCount + 1);
  };

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
