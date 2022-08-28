import React, { useRef, useState } from "react";
import { GAME_MODE_OPTIONS, SEED_LENGTH } from "../data/config";
import { objects, objectImages } from "../data/locations";
import useIsDev from "../hooks/useIsDev";
import createRandomString from "../utils/createRandomString";
import debounceTrailingEdge from "../utils/debounceTrailingEdge";
import getDailySeed from "../utils/getDailySeed";
import getTodayString from "../utils/getTodayString";
import rng from "../utils/rng";
import LevelListItem from "./LevelListItem";
import Menu from "./Menu";

const MainMenu = ({
  setView,
  reGenerateGame,
  currentSeedLabel,
  setCurrentSeedLabel,
  version,
  gameMode,
  toggleGameMode,
  setGameMode,
  setCurrentLevel,
  highScores,
}) => {
  const [currentSeed, setCurrentSeed] = useState(rng.getSeed());
  const debounceRef = useRef(debounceTrailingEdge(500));
  const isDev = useIsDev();

  const levels = [
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Tiny Island",
      level: "tiny-island",
      icon: objects.house1.image,
      unlockCost: 0,
    },
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Stacking",
      level: "mid-island",
      icon: objects.house3.image,
      adjustIconOffset: 38,
      unlockCost: 4,
    },
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Plains",
      level: "plains",
      icon: objects.farm.image,
      unlockCost: 14,
    },
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Mountains",
      level: "mountains",
      icon: objects.mine.image,
      unlockCost: 28,
    },
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Archipelago",
      level: "islands",
      icon: objects.ship.image,
      unlockCost: 55,
    },
    // {
    //   mode: GAME_MODE_OPTIONS.PREMADE,
    //   label: "Forest",
    //   level: "forest",
    //   icon: objects.camp.image,
    //   unlockCost: 75,
    // },
    // TODO: The current BEST for the daily
    // is your all time daily best score...
    // Which KIND OF makes sense... but you
    // probably actually usually want to see your
    // best score for the current day and NOT
    // your best ALL TIME daily high score.
    {
      mode: GAME_MODE_OPTIONS.SEEDED,
      label: `Daily ${getTodayString()}`,
      level: "daily",
      seed: getDailySeed(),
      icon: objects.crown.image,
      unlockCost: 75,
    },
    {
      mode: GAME_MODE_OPTIONS.SEEDED,
      label: "Full Random",
      level: "random",
      icon: objects.crown.image,
      unlockCost: 125,
    },
    // {
    //   mode: GAME_MODE_OPTIONS.PREMADE,
    //   label: "Ocean Hole",
    //   level: "ocean-hole",
    //   unlockCost: 50,
    // },
  ];

  if (isDev) {
    levels.push({
      mode: GAME_MODE_OPTIONS.EDITOR,
      label: "Map Editor",
      level: "all-water",
      unlockCost: 0,
    });
  }

  const pickLevel = (level) => {
    // Set seed
    let seed;

    if (level.seed) {
      // Our font only has upper case letters, players
      // will not be able to visually see lower
      // case letters.
      seed = level.seed.toUpperCase();
    } else {
      // If no seed provided, use a random one
      seed = createRandomString(SEED_LENGTH);
    }

    setCurrentSeed(seed);
    setCurrentSeedLabel(level.label || "Random");
    setCurrentLevel(level);

    if (level.mode) {
      setGameMode(level.mode);
    } else {
      setGameMode(GAME_MODE_OPTIONS.SEEDED);
    }

    rng.setSeed(seed);
    reGenerateGame();
    // debounceRef.current(() => {
    //   rng.setSeed(seed);
    //   reGenerateGame();
    // });
  };

  const totalPopulation = Object.values(highScores).reduce(
    (total, curr) => total + curr,
    0
  );

  return (
    <Menu>
      <h1 style={{ marginBottom: "72px" }}>Island Maker</h1>
      <h2 style={{ marginBottom: "24px", margin: 0 }}>Total Population:</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "1.5em" }}>{totalPopulation}</p>
        <img
          className="icon inline-offset"
          src={objectImages[objects.house1.image]}
        />
      </div>
      {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "48px",
        }}
      >
        <label htmlFor="seed">Seed:</label>
        <div>
          <input
            style={{
              width: "fit-content",
              fontSize: "1em",
              borderRadius: "4px",
              border: "none",
              padding: "8px 12px",
              marginRight: "16px",
            }}
            id="seed"
            name="seed"
            value={currentSeed}
            onChange={(event) => {
              const newSeed = event.target.value.toUpperCase();

              pickLevel({ seed: newSeed, label: "Random" });
            }}
          />
          <button
            style={{
              width: "fit-content",
              fontSize: "1em",
              borderRadius: "4px",
              border: "none",
              padding: "8px 12px",
              background: "white",
              cursor: "pointer",
            }}
            onClick={() => {
              const newSeed = createRandomString(SEED_LENGTH);

              pickLevel({ seed: newSeed, label: "Random" });
            }}
          >
            Random
          </button>
        </div>
        <p>{`"${currentSeedLabel}"`}</p>
      </div> */}
      <div
        style={{
          marginTop: "32px",
          marginBottom: "64px",
          padding: "1rem",
          maxHeight: "60vh",
          borderRadius: "6px",
          overflowY: "scroll",
          backgroundColor: "rgb(90, 90, 90)",
        }}
      >
        {/* <p style={{ marginBottom: 0 }}>Levels:</p> */}
        {/* <button
          style={{
            width: "fit-content",
            fontSize: "1em",
            borderRadius: "4px",
            border: "none",
            padding: "8px 12px",
            background: "white",
            cursor: "pointer",
            margin: "8px",
            marginBottom: "24px",
          }}
          onClick={() => {
            const dailySeed = getDailySeed();

            pickLevel({ seed: dailySeed, label: `Daily ${getTodayString()}` });
          }}
        >
          Daily
        </button> */}
        <ul
          style={{
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexWrap: "wrap",
            marginTop: 0,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {levels.map((level) => {
            return (
              <LevelListItem
                key={level.label}
                isUnlocked={totalPopulation >= level.unlockCost}
                highScore={highScores[level.level] ?? 0}
                level={level}
                onPlayClick={() => {
                  pickLevel(level);
                  setView("none");
                  // setTimeout(() => setView("none"), 800);
                }}
              />
            );
          })}
        </ul>
      </div>
      {/* <button
        style={{
          padding: "16px 32px",
          borderRadius: "8px",
          fontSize: "1.25em",
          cursor: "pointer",
        }}
        onClick={() => setView("none")}
      >
        Start
      </button> */}
      <div
        style={{
          margin: "0",
          display: "flex",
          placeContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={toggleGameMode}
          style={{
            width: "fit-content",
            fontSize: "0.7em",
            borderRadius: "4px",
            border: "none",
            padding: "8px 12px",
            background: "white",
            cursor: "pointer",
            margin: "8px",
          }}
        >
          {gameMode}
        </button>
        <p
          style={{
            margin: "0",
          }}
        >
          Ver: {version}
        </p>
      </div>
    </Menu>
  );
};

export default MainMenu;
