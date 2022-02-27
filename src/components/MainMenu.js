import React, { useRef, useState } from "react";
import createRandomString from "../utils/createRandomString";
import debounceTrailingEdge from "../utils/debounceTrailingEdge";
import rng from "../utils/rng";
import Menu from "./Menu";

const MainMenu = ({ setView, reGenerateGame }) => {
  const [currentSeed, setCurrentSeed] = useState(rng.getSeed());
  const debounceRef = useRef(debounceTrailingEdge(500));

  const suggestedSeeds = [
    "8FZRNG2E",
    "FA6F7Z77",
    "ORD1WRHF",
    "KLBA15ZJ",
    "SC0KIRFC",
    "GGXEAB7F",
  ];

  const setSeed = (newSeed) => {
    // Our font only has upper case letters, players
    // will not be able to visually see lower
    // case letters.
    const upperCaseSeed = newSeed.toUpperCase();

    setCurrentSeed(upperCaseSeed);

    debounceRef.current(() => {
      rng.setSeed(upperCaseSeed);
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

              setSeed(newSeed);
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
              const newSeed = createRandomString(8);

              setSeed(newSeed);
            }}
          >
            Random
          </button>
        </div>
      </div>
      <div
        style={{
          marginTop: "64px",
          marginBottom: "64px",
        }}
      >
        <p style={{ marginBottom: 0 }}>Interesting Seeds:</p>
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
          {suggestedSeeds.map((suggestedSeed) => (
            <li key={suggestedSeed}>
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
                  setSeed(suggestedSeed);
                }}
              >
                {suggestedSeed}
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
    </Menu>
  );
};

export default MainMenu;
