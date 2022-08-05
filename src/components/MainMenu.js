import React, { useRef, useState } from "react";
import { GAME_MODE_OPTIONS, SEED_LENGTH } from "../data/config";
import { objects, objectImages } from "../data/locations";
import createRandomString from "../utils/createRandomString";
import debounceTrailingEdge from "../utils/debounceTrailingEdge";
import getDailySeed from "../utils/getDailySeed";
import getTodayString from "../utils/getTodayString";
import rng from "../utils/rng";
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
  totalPopulation,
}) => {
  const [currentSeed, setCurrentSeed] = useState(rng.getSeed());
  const debounceRef = useRef(debounceTrailingEdge(500));

  const levels = [
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Tiny Island",
      level: "tiny-island",
      icon: objects.farm.image,
      unlockCost: 0,
    },
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Plains",
      level: "plains",
      icon: objects.turnip3.image,
      unlockCost: 5,
    },
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Forest",
      level: "forest",
      icon: objects.camp.image,
      unlockCost: 20,
    },
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Mountains",
      level: "forest",
      icon: objects.mine.image,
      unlockCost: 50,
    },
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Island",
      level: "forest",
      icon: objects.ship.image,
      unlockCost: 80,
    },
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Daily",
      level: "forest",
      icon: objects.crown.image,
      unlockCost: 120,
    },
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Full Random",
      level: "forest",
      icon: objects.crown.image,
      unlockCost: 150,
    },
    // {
    //   mode: GAME_MODE_OPTIONS.PREMADE,
    //   label: "Ocean Hole",
    //   level: "ocean-hole",
    //   unlockCost: 50,
    // },
    // {
    //   mode: GAME_MODE_OPTIONS.PREMADE,
    //   label: "All Water",
    //   level: "all-water",
    //   unlockCost: 80,
    // },
  ];

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

    debounceRef.current(() => {
      rng.setSeed(seed);
      reGenerateGame();
    });
  };

  return (
    <Menu>
      <h1 style={{ marginBottom: "64px" }}>Island Maker</h1>
      <h2 style={{ margin: 0 }}>Total Population:</h2>
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
          marginTop: "64px",
          marginBottom: "64px",
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
            const isUnlocked = totalPopulation >= level.unlockCost;

            return (
              <li
                key={level.label}
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <img
                  className="icon inline-offset"
                  src={
                    objectImages[
                      isUnlocked
                        ? level.icon ?? objects.circle.image
                        : objects.question.image
                    ]
                  }
                ></img>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "center",
                    marginLeft: "1.5rem",
                    marginRight: "1.5rem",
                    flex: 1,
                  }}
                >
                  <h2
                    style={{
                      marginBottom: "0.3em",
                      marginTop: "0.3em",
                    }}
                  >
                    {level.label}
                  </h2>
                  <p
                    style={{
                      marginBottom: "0.3em",
                      marginTop: "0.3em",
                      fontSize: "0.8em",
                    }}
                  >
                    {isUnlocked
                      ? `Best: 3 population`
                      : `Unlock: ${level.unlockCost} population`}
                  </p>
                </div>
                <button
                  style={{
                    width: "fit-content",
                    fontSize: "1em",
                    borderRadius: "4px",
                    border: "none",
                    padding: "8px 12px",
                    background: "white",
                    cursor: "pointer",
                    margin: "8px",
                  }}
                  onClick={() => {
                    pickLevel(level);
                    setTimeout(() => setView("none"), 800);
                  }}
                >
                  {"Play"}
                </button>
              </li>
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
