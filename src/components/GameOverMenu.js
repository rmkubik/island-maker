import React, { useEffect } from "react";
import Menu from "./Menu";
import countPopulation from "../utils/countPopulation";
import rng from "../utils/rng";
import convertPopulationToStars from "../utils/convertPopulationToStars";
import constructArray from "../utils/constructArray";
import { objectImages, objects } from "../data/locations";
import { GAME_MODE_OPTIONS } from "../data/config";

const GameOverMenu = ({
  setView,
  reGenerateGame,
  lastGrid,
  currentSeedLabel,
  gameMode,
  highScores,
  setHighScores,
  currentLevel,
  replayWithNewSeed,
}) => {
  const population = countPopulation(lastGrid);
  const stars = convertPopulationToStars(population);

  const existingHighScore = highScores[currentLevel.level] ?? 0;
  const isNewHighScore = population > existingHighScore;

  if (isNewHighScore) {
    setHighScores({
      ...highScores,
      [currentLevel.level]: population,
    });
  }

  useEffect(() => {
    // TODO:
    // determine if new population is greater than high score
    // show "NEW HIGH SCORE" message
    // setHighScore with the current population
  }, []);

  return (
    <Menu>
      <h1 style={{ marginBottom: "64px" }}>Run Complete!</h1>
      <h2>Population</h2>
      {isNewHighScore ? <p>New High Score!</p> : null}
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <p style={{ margin: 0, marginBottom: "0.25em" }}>Current</p>
          <p
            style={{
              fontSize: "2em",
              margin: 0,
              marginBottom: "0.85em",
            }}
          >
            {population}
          </p>
        </div>
        <div style={{ marginBottom: "64px" }}>
          <p style={{ margin: 0, marginBottom: "0.25em" }}>High Score</p>
          <p
            style={{
              fontSize: "2em",
              margin: 0,
              marginBottom: "0.85em",
            }}
          >
            {highScores[currentLevel.level] ?? 0}
          </p>
        </div>
        {/* <p style={{ margin: 0, marginBottom: "-12px" }}>Rating:</p>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {constructArray((index) => {
            let image;

            if (stars < index + 1) {
              // No star
              image = objects.x.image;
            } else if (index + 1 + 5 <= stars) {
              // This is a golden star
              image = objects.brickHouse1.image;
            } else {
              image = objects.house1.image;
            }

            return (
              <img
                style={{ marginRight: "-20px" }}
                draggable={false}
                key={index}
                src={objectImages[image]}
              />
            );
          }, 5)}
        </div> */}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "2.5em",
          alignItems: "center",
        }}
      >
        <label htmlFor="seed">Seed</label>
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
        <p>{`"${currentSeedLabel}"`}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {gameMode === GAME_MODE_OPTIONS.EDITOR && (
          <button
            style={{
              padding: "16px 32px",
              borderRadius: "8px",
              fontSize: "1.25em",
              cursor: "pointer",
              marginBottom: "16px",
            }}
            onClick={() => {
              console.log(lastGrid);
              console.log(JSON.stringify(lastGrid));
            }}
          >
            Save Map
          </button>
        )}
        <button
          className="secondary"
          style={{
            padding: "16px 32px",
            borderRadius: "8px",
            fontSize: "1.25em",
            cursor: "pointer",
            marginBottom: "16px",
          }}
          onClick={() => {
            setView("none");
          }}
        >
          Back to Map
        </button>
        <button
          className="secondary"
          style={{
            padding: "16px 32px",
            borderRadius: "8px",
            fontSize: "1.25em",
            cursor: "pointer",
            marginBottom: "16px",
          }}
          onClick={() => {
            replayWithNewSeed();
          }}
        >
          Retry
        </button>
        <button
          style={{
            padding: "16px 32px",
            borderRadius: "8px",
            fontSize: "1.25em",
            cursor: "pointer",
            marginBottom: "16px",
          }}
          onClick={() => {
            setView("mainMenu");
            reGenerateGame();
          }}
        >
          Done
        </button>
      </div>
    </Menu>
  );
};

export default GameOverMenu;
