import React, { useRef, useState } from "react";
import { GAME_MODE_OPTIONS, SEED_LENGTH } from "../data/config";
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
}) => {
  const [currentSeed, setCurrentSeed] = useState(rng.getSeed());
  const debounceRef = useRef(debounceTrailingEdge(500));

  const levels = [
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Plains",
      level: "plains",
    },
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Forest",
      level: "forest",
    },
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Tiny Island",
      level: "tiny-island",
    },
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "Ocean Hole",
      level: "ocean-hole",
    },
    {
      mode: GAME_MODE_OPTIONS.PREMADE,
      label: "All Water",
      level: "all-water",
    },
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
      <div
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
      </div>
      <div
        style={{
          marginTop: "64px",
          marginBottom: "64px",
        }}
      >
        <p style={{ marginBottom: 0 }}>Levels:</p>
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
            marginBottom: "24px",
          }}
          onClick={() => {
            const dailySeed = getDailySeed();

            pickLevel({ seed: dailySeed, label: `Daily ${getTodayString()}` });
          }}
        >
          Daily
        </button>
        <ul
          style={{
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexWrap: "wrap",
            marginTop: 0,
            justifyContent: "center",
          }}
        >
          {levels.map((level) => (
            <li key={level.label}>
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
                }}
              >
                {level.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        style={{
          padding: "16px 32px",
          borderRadius: "8px",
          fontSize: "1.25em",
          cursor: "pointer",
        }}
        onClick={() => setView("none")}
      >
        Start
      </button>
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
