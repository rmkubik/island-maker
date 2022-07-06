import React, { useEffect, useState } from "react";

import packageInfo from "../../package.json";
import "../style.css";
import useScaleRef from "../hooks/useScaleRef";
import {
  dimensions,
  TILE_HEIGHT,
  TILE_IMAGE_WIDTH,
  VISUAL_Y_OFFSET,
  GAME_MODE_OPTIONS,
  LOCAL_STORAGE_KEY,
} from "../data/config";
import Game from "./Game";
import MainMenu from "./MainMenu";
import GameOverMenu from "./GameOverMenu";
import rng from "../utils/rng";
import JournalMenu from "./JournalMenu";
import useJournal from "../hooks/useJournal";
import useLocalStorage from "../hooks/useLocalStorage";

function App() {
  const [scaleRef, scale] = useScaleRef();
  const [saveData, setSaveData] = useLocalStorage(LOCAL_STORAGE_KEY, {});
  const [view, setView] = useState("mainMenu");
  const [gameId, setGameId] = useState(0);
  const [lastGrid, setLastGrid] = useState();
  const [currentSeedLabel, setCurrentSeedLabel] = useState("Random");
  const { journal, setJournal, isUnlocked, unlockItem, commitUnlocks } =
    useJournal();
  // seeded, editor, premade
  // config.GAME_MODE_OPTIONS
  const [gameMode, setGameMode] = useState(GAME_MODE_OPTIONS.SEEDED);
  const [currentLevel, setCurrentLevel] = useState();

  useEffect(() => {
    setJournal(saveData.journal ?? {});
  }, []);

  useEffect(() => {
    const newSaveData = { ...saveData, journal, version: packageInfo.version };

    setSaveData(newSaveData);
  }, [journal]);

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
        version={packageInfo.version}
        gameMode={gameMode}
        toggleGameMode={() => {
          switch (gameMode) {
            case GAME_MODE_OPTIONS.SEEDED:
              setGameMode(GAME_MODE_OPTIONS.EDITOR);
              break;
            case GAME_MODE_OPTIONS.EDITOR:
              setGameMode(GAME_MODE_OPTIONS.PREMADE);
              break;
            case GAME_MODE_OPTIONS.PREMADE:
              setGameMode(GAME_MODE_OPTIONS.SEEDED);
              break;
          }
        }}
        setGameMode={setGameMode}
        setCurrentLevel={setCurrentLevel}
      />
    ),
    gameOver: (
      <GameOverMenu
        setView={setView}
        reGenerateGame={reGenerateGame}
        lastGrid={lastGrid}
        currentSeedLabel={currentSeedLabel}
        gameMode={gameMode}
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
        gameMode={gameMode}
        currentLevel={currentLevel}
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
