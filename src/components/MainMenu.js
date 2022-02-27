import React, { useReducer, useRef, useState } from "react";
import createRandomString from "../utils/createRandomString";
import debounceTrailingEdge from "../utils/debounceTrailingEdge";
import rng from "../utils/rng";

// TODO: add a "re-seed the map" button

const MainMenu = ({ setView, reGenerateGame }) => {
  const [currentSeed, setCurrentSeed] = useState(rng.seed);
  const debounceRef = useRef(debounceTrailingEdge(500));

  const setSeed = (newSeed) => {
    setCurrentSeed(newSeed);

    debounceRef.current(() => {
      rng.setSeed(newSeed);
      reGenerateGame();
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        zIndex: 9999999999,
        cursor: "auto",
        backgroundColor: "rgba(69, 69, 69, 0.75)",
      }}
    >
      <div
        className="menu"
        style={{
          textAlign: "center",
          borderRadius: "12px",
          backgroundColor: "rgb(69, 69, 69)",
          padding: "64px",
          border: "6px solid white",
        }}
      >
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
                const newSeed = event.target.value;

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
      </div>
    </div>
  );
};

export default MainMenu;
