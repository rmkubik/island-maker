import React, { useEffect, useState } from "react";
import {
  DECK_STACK_INCREMENT,
  LOCATION_SIZE,
  LOCATION_TEXT_X_OFFSET,
  LOCATION_TEXT_Y_OFFSET,
} from "../data/config";
import { objects } from "../data/locations";
import constructArray from "../utils/constructArray";
import countPopulation from "../utils/countPopulation";
import update from "../utils/update";

const TopBar = ({
  selected,
  deck,
  setDeck,
  banked,
  setBanked,
  newCards,
  grid,
  previewCount,
  shouldShowSelected,
  isGameOver,
  showGameOverMenu,
  setIsForcedGameOver,
}) => {
  const population = grid ? countPopulation(grid) : 0;
  const [prevPopulation, setPrevPopulation] = useState(population);
  // waiting, animating, finished
  const [populationAnimationState, setPopulationAnimationState] =
    useState("waiting");

  useEffect(() => {
    switch (populationAnimationState) {
      case "waiting":
        if (population !== prevPopulation) {
          // Population has changed
          setPopulationAnimationState("animating");
        }
        break;
      case "animating":
        // Do nothing while we're animating
        break;
      case "finished":
        // Save new population once we're animating
        setPrevPopulation(population);
        setPopulationAnimationState("waiting");
        break;
    }
  }, [
    grid,
    population,
    prevPopulation,
    setPrevPopulation,
    populationAnimationState,
    setPopulationAnimationState,
  ]);

  let preview = deck.slice(0, previewCount);
  const missingPreviewCount = previewCount - preview.length;

  if (missingPreviewCount > 0) {
    preview = [
      ...preview,
      ...constructArray(() => objects.x, missingPreviewCount),
    ];
  }

  return (
    <div
      className="topbar"
      style={{
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        zIndex: 10000,
        cursor: "auto",
        width: "100%",
      }}
    >
      <div>
        <p>Current: </p>
        <img
          key={selected && selected.id}
          className="slideInRight"
          src={selected ? selected.image : undefined}
        />
        <p className="cardInfo">
          {selected ? `${selected.name} - ${selected.desc}` : undefined}
        </p>
      </div>
      <div
        style={{
          width: `${Math.max(
            DECK_STACK_INCREMENT * (deck.length + newCards.length),
            DECK_STACK_INCREMENT * 3
          )}px`,
        }}
        className="deck"
      >
        <p>{`Remaining: ${Math.max(
          deck.length - (shouldShowSelected ? 1 : 0),
          0
        )}`}</p>
        {deck.slice(shouldShowSelected ? 1 : 0).map((card, index) => {
          return (
            <img
              key={card.id}
              style={{
                position: "absolute",
                zIndex: -1 * (index + 1),
                left: DECK_STACK_INCREMENT * index,
              }}
              // src={index < previewCount ? card.image : objects.circle.image}
              src={card.image}
            />
          );
        })}
        {/* <p
          className="deckNumber"
          style={{
            marginTop: `${LOCATION_TEXT_Y_OFFSET}px`,
            marginLeft: `${LOCATION_TEXT_X_OFFSET}px`,
          }}
        >
          {deck.length}
        </p> */}
      </div>
      <div>
        <p>Bank:</p>
        {banked.map((bankedObject, index) => (
          <button
            style={{
              backgroundColor: "rgba(32,32,32,0.5)",
              border: "6px solid white",
              borderRadius: "6px",
              padding: 0,
              margin: 0,
              width: `${LOCATION_SIZE}px`,
              height: `${LOCATION_SIZE}px`,
              boxSizing: "content-box",
              cursor: "pointer",
            }}
            key={index}
            onClick={(e) => {
              if (isGameOver) {
                return;
              }

              e.stopPropagation();

              switch (true) {
                case Boolean(selected && bankedObject.key === "x"): {
                  const newBanked = update(banked, index, selected);
                  setBanked(newBanked);

                  const [newSelected, ...newDeck] = deck;

                  setDeck(newDeck);
                  return;
                }
                case Boolean(selected && bankedObject.key !== "x"): {
                  const newBanked = update(banked, index, selected);
                  setBanked(newBanked);

                  // setSelected(banked[index]);
                  setDeck([banked[index], ...deck.slice(1)]);
                  return;
                }
                case Boolean(!selected && bankedObject.key !== "x"): {
                  const newBanked = update(banked, index, objects.x);
                  setBanked(newBanked);

                  // setSelected(banked[index]);
                  setDeck([banked[index], ...deck]);
                  return;
                }
                default:
                  return;
              }
            }}
          >
            {bankedObject.key !== "x" ? <img src={bankedObject.image} /> : null}
          </button>
        ))}
      </div>
      <div>
        <p>Population:</p>
        <p
          className={`textNumber ${
            populationAnimationState === "animating" ? "pulse" : null
          }`}
          onAnimationEnd={() => setPopulationAnimationState("finished")}
        >
          {population}
        </p>
      </div>
      {!isGameOver ? (
        <div
          className="slideInRight"
          style={{
            fontSize: "2em",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            justifyContent: "end",
            marginRight: "64px",
          }}
        >
          <button
            style={{
              padding: "0.25em 0.5em",
              borderRadius: "8px",
              fontSize: "0.7em",
              cursor: "pointer",
              height: "fit-content",
              width: "fit-content",
            }}
            onClick={() => setIsForcedGameOver(true)}
          >
            End Run
          </button>
        </div>
      ) : null}
      {isGameOver ? (
        <div
          className="slideInRight"
          style={{
            fontSize: "2em",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            justifyContent: "end",
            marginRight: "64px",
          }}
        >
          <p style={{ margin: 0, marginRight: "0.5em" }}>Run Complete!</p>
          <button
            style={{
              padding: "0.25em 0.5em",
              borderRadius: "8px",
              fontSize: "0.7em",
              cursor: "pointer",
              height: "fit-content",
              width: "fit-content",
            }}
            onClick={showGameOverMenu}
          >
            See Details
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default TopBar;
