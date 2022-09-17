import React, { useEffect, useState } from "react";
import Grid from "./Grid";

import "../style.css";
import useHexGrid from "../hooks/useHexGrid";
import useDeck from "../hooks/useDeck";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import { tilePaths, biomeSettings } from "../data/tiles";
import TopBar from "./TopBar";
import getResource from "../utils/getResource";
import { objects } from "../data/locations";
import levels from "../data/levels";
import { GAME_MODE_OPTIONS } from "../data/config";
import doesObjectHaveAnyValidPlacement from "../utils/doesObjectHaveAnyValidPlacement";
import update from "../utils/update";
import trackEvent from "../utils/trackEvent";
import useUser from "../hooks/useUser";
import useSession from "../hooks/useSession";
import rng from "../utils/rng";
import countPopulation from "../utils/countPopulation";

function Game({
  scale,
  setView,
  showGameOver,
  unlockItem,
  unlockRule,
  commitUnlocks,
  gameMode,
  currentLevel,
  highScores,
}) {
  const [user] = useUser();
  const [session] = useSession();
  const [previewCount, setPreviewCount] = useState(1);
  const [banked, setBanked] = useState([objects.x]);
  const [newCards, setNewCards] = useState([]);
  const { GridDataRef, grid } = useHexGrid({
    initializeGrid: (initialGrid, state) => {
      state.biome = "oceanic";
    },
    initializeHex: (hex, state) => {
      switch (gameMode) {
        case GAME_MODE_OPTIONS.SEEDED:
          const biome = biomeSettings[state.biome];
          const tileWeights = biome.tileWeights;
          const tileType = tileWeights.pickRandom();
          const tileTypeImages = tilePaths[tileType];
          const tileImage = pickRandomlyFromArray(tileTypeImages);

          let resource = getResource(tileType, biome.resourceWeights);

          if (resource?.key === "x") {
            // We can only generate ONE xmark
            if (state.hasGeneratedXMark) {
              resource = undefined;
            }

            state.hasGeneratedXMark = true;
          }

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
    initialState: {
      biome: "classic",
      hasGeneratedXMark: false,
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

      const population = countPopulation(grid);

      trackEvent({
        eventName: "levelOver",
        userId: user.id,
        sessionId: session.id,
        data: {
          levelLabel: currentLevel.label,
          level: currentLevel.level,
          levelMode: currentLevel.mode,
          levelUnlockCost: currentLevel.unlockCost,
          seed: rng.getSeed(),
          isForcedLevelOver: isForcedGameOver,
          population,
          highScores,
          deck,
          banked,
          grid,
        },
      });
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
          unlockRule,
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
