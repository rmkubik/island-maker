import React from "react";
import Menu from "./Menu";
import countPopulation from "../utils/countPopulation";
import rng from "../utils/rng";

const GameOverMenu = ({ setView, reGenerateGame, lastGrid }) => {
  return (
    <Menu>
      <h1 style={{ marginBottom: "64px" }}>Run Complete!</h1>
      <div>
        <p style={{ margin: 0, marginBottom: "0.25em" }}>Population:</p>
        <p
          style={{
            fontSize: "2em",
            margin: 0,
            marginBottom: "0.75em",
          }}
        >
          {countPopulation(lastGrid)}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "2.5em",
        }}
      >
        <label htmlFor="seed">Seed:</label>
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
          value={rng.getSeed()}
          readOnly
        />
      </div>
      <button
        style={{
          padding: "16px 32px",
          borderRadius: "8px",
          fontSize: "1.25em",
          cursor: "pointer",
          marginRight: "8px",
        }}
        onClick={() => {
          setView("none");
        }}
      >
        Back to Map
      </button>
      <button
        style={{
          padding: "16px 32px",
          borderRadius: "8px",
          fontSize: "1.25em",
          cursor: "pointer",
        }}
        onClick={() => {
          setView("mainMenu");
          reGenerateGame();
        }}
      >
        Done
      </button>
    </Menu>
  );
};

export default GameOverMenu;
