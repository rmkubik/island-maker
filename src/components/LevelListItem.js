import { useRef } from "react";
import { GAME_MODE_OPTIONS } from "../data/config";
import { objectImages, objects } from "../data/locations";

const LevelListItem = ({ level, isUnlocked, highScore, onPlayClick }) => {
  const playButtonRef = useRef();

  const levelStyle = {};

  if (level.adjustIconOffset) {
    levelStyle.marginTop = `-${level.adjustIconOffset}px`;
  }

  return (
    <li
      style={{
        display: "flex",
        flexDirection: "row",
        marginBottom: "1rem",
      }}
    >
      <img
        className="icon inline-offset"
        style={levelStyle}
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
            marginTop: "0.15em",
          }}
        >
          {isUnlocked ? level.label : "Locked"}
        </h2>
        <p
          style={{
            marginBottom: "0.3em",
            marginTop: "0.15em",
            fontSize: "0.8em",
          }}
        >
          {isUnlocked
            ? `Best: ${highScore} population`
            : `Unlocks at ${level.unlockCost} population`}
        </p>
      </div>
      <button
        ref={playButtonRef}
        className={isUnlocked ? "" : "locked"}
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
          if (!isUnlocked) {
            playButtonRef.current.classList.remove("shake");
            // This triggers a document reflow in between class
            // assignments so the animation plays again.
            void playButtonRef.current.offsetWidth;
            playButtonRef.current.classList.add("shake");
            return;
          }

          onPlayClick(level);
        }}
      >
        {level.mode === GAME_MODE_OPTIONS.EDITOR ? "Edit" : "Play"}
      </button>
    </li>
  );
};

export default LevelListItem;
