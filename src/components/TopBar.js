import React from "react";
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
  grid,
  previewCount,
}) => {
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
      }}
    >
      <div>
        <p>Current: </p>
        <img src={selected ? selected.image : objects.x.image} />
        <p>{selected ? `${selected.name} - ${selected.desc}` : undefined}</p>
      </div>
      <div
        style={{
          width: `${LOCATION_SIZE + DECK_STACK_INCREMENT * deck.length}px`,
        }}
        className="deck"
      >
        <p>{`Remaining: ${Math.max(deck.length - 1, 0)}`}</p>
        {deck.slice(1).map((card, index) => {
          return (
            <img
              key={index}
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
              background: "none",
              border: "6px solid white",
              borderRadius: "6px",
              padding: 0,
              margin: 0,
            }}
            key={index}
            onClick={(e) => {
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
                  setDeck([banked[index], ...deck]);
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
            <img src={bankedObject.image} />
          </button>
        ))}
      </div>
      <div>
        <p>Population:</p>
        <p className="textNumber">{grid ? countPopulation(grid) : 0}</p>
      </div>
    </div>
  );
};

export default TopBar;
