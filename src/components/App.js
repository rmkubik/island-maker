import React, { useState } from "react";

import "../style.css";
import useScaleRef from "../hooks/useScaleRef";
import {
  dimensions,
  TILE_HEIGHT,
  TILE_IMAGE_WIDTH,
  VISUAL_Y_OFFSET,
} from "../data/config";
import Game from "./Game";
import MainMenu from "./MainMenu";
import GameOverMenu from "./GameOverMenu";
import rng from "../utils/rng";
import JournalMenu from "./JournalMenu";
import useJournal from "../hooks/useJournal";

function App() {
  const [scaleRef, scale] = useScaleRef();
  const [view, setView] = useState("mainMenu");
  const [gameId, setGameId] = useState(0);
  const [lastGrid, setLastGrid] = useState();
  const [currentSeedLabel, setCurrentSeedLabel] = useState("Random");
  const { isUnlocked, unlockItem, commitUnlocks } = useJournal();

  const reGenerateGame = () => {
    rng.resetCurrentSeed();
    setGameId(gameId + 1);
  };

  const views = {
    mainMenu: (
      <MainMenu
        setView={setView}
        reGenerateGame={reGenerateGame}
        currentSeedLabel={currentSeedLabel}
        setCurrentSeedLabel={setCurrentSeedLabel}
      />
    ),
    gameOver: (
      <GameOverMenu
        setView={setView}
        reGenerateGame={reGenerateGame}
        lastGrid={lastGrid}
        currentSeedLabel={currentSeedLabel}
      />
    ),
    journal: <JournalMenu setView={setView} isUnlocked={isUnlocked} />,
    none: null,
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
      {views[view]}
      <Game
        key={gameId}
        scale={scale}
        showGameOver={(grid) => {
          if (view !== "none") {
            // Game only has authority to set the view if no
            // other view is already showing.
            return;
          }

          setLastGrid(grid);
          setView("gameOver");
        }}
        setView={(newView) => {
          if (view !== "none") {
            // Game only has authority to set the view if no
            // other view is already showing.
            return;
          }

          setView(newView);
        }}
        unlockItem={unlockItem}
        commitUnlocks={commitUnlocks}
      />
    </div>
  );
}

export default App;
