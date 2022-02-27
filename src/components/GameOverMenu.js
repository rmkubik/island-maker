import React from "react";
import Menu from "./Menu";

const GameOverMenu = ({ setView, reGenerateGame }) => {
  return (
    <Menu>
      <h1 style={{ marginBottom: "64px" }}>Game Over!</h1>
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
