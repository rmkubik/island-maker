import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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
  SEED_LENGTH,
} from "../data/config";
import Game from "./Game";
import MainMenu from "./MainMenu";
import GameOverMenu from "./GameOverMenu";
import rng from "../utils/rng";
import JournalMenu from "./JournalMenu";
import useJournal from "../hooks/useJournal";
import useLocalStorage from "../hooks/useLocalStorage";
import createRandomString from "../utils/createRandomString";
import trackEvent from "../utils/trackEvent";
import useUser, { UserContextProvider } from "../hooks/useUser";
import useSession, { SessionContextProvider } from "../hooks/useSession";

function App() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [user, setUser] = useUser();
  const [session, setSession] = useSession();

  const [scaleRef, scale] = useScaleRef();
  const [saveData, setSaveData] = useLocalStorage(LOCAL_STORAGE_KEY, {});
  const [view, setView] = useState("mainMenu");
  const [gameId, setGameId] = useState(0);
  const [lastGrid, setLastGrid] = useState();
  const [currentSeedLabel, setCurrentSeedLabel] = useState("Random");
  const { journal, setJournal, isUnlocked, unlockItem, commitUnlocks } =
    useJournal();
  const [gameMode, setGameMode] = useState(GAME_MODE_OPTIONS.SEEDED);
  const [currentLevel, setCurrentLevel] = useState();
  const [highScores, setHighScores] = useState({});

  // Load save data
  useEffect(() => {
    if (isAppLoaded || !saveData) {
      return;
    }

    const loadedUser = saveData.user ?? {};
    if (!loadedUser.id) {
      loadedUser.id = uuidv4();
    }

    trackEvent({
      eventName: "appLoaded",
      userId: loadedUser.id,
      sessionId: session.id,
    });

    setIsAppLoaded(true);
    setJournal(saveData.journal ?? {});
    setHighScores(saveData.highScores ?? {});
    setUser(loadedUser);
  }, [saveData, isAppLoaded, user, session]);

  // Save save data
  useEffect(() => {
    const newSaveData = {
      ...saveData,
      journal,
      highScores,
      user,
      version: packageInfo.version,
    };

    setSaveData(newSaveData);
  }, [journal, highScores, user]);

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
        highScores={highScores}
      />
    ),
    gameOver: (
      <GameOverMenu
        setView={setView}
        reGenerateGame={reGenerateGame}
        lastGrid={lastGrid}
        currentLevel={currentLevel}
        currentSeedLabel={currentSeedLabel}
        gameMode={gameMode}
        highScores={highScores}
        setHighScores={setHighScores}
        replayWithNewSeed={() => {
          const seed = createRandomString(SEED_LENGTH);

          trackEvent({
            eventName: "levelRetried",
            userId: user.id,
            sessionId: session.id,
            data: {
              levelLabel: currentLevel.label,
              level: currentLevel.level,
              levelMode: currentLevel.mode,
              levelUnlockCost: currentLevel.unlockCost,
              seed,
            },
          });

          rng.setSeed(seed);
          reGenerateGame();
          setView("none");
        }}
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
        highScores={highScores}
      />
    </div>
  );
}

const withProviders = (WrappedComponent) => () => {
  return (
    <SessionContextProvider>
      <UserContextProvider>
        <WrappedComponent />
      </UserContextProvider>
    </SessionContextProvider>
  );
};

export default withProviders(App);
