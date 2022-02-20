import React from "react";
import { objects } from "../data/locations";
import countPopulation from "../utils/countPopulation";
import update from "../utils/update";

const TopBar = ({
  selected,
  setSelected,
  deck,
  setDeck,
  banked,
  setBanked,
  grid,
  previewCount,
}) => {
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
      <p>Current: </p>
      <img src={selected ? selected.image : objects.x.image} />
      <p>Next:</p>
      {deck
        .slice(0, previewCount)
        .map((item) => {
          if (!item) {
            return objects.x;
          }

          return item;
        })
        .map((item) => (
          <img src={item.image} />
        ))}

      <p>Deck: {deck.length}</p>
      <p>Bank:</p>
      {banked.map((bankedObject, index) => (
        <button
          onClick={(e) => {
            e.stopPropagation();

            switch (true) {
              case Boolean(selected && bankedObject.key === "x"): {
                const newBanked = update(banked, index, selected);
                setBanked(newBanked);

                const [newSelected, ...newDeck] = deck;

                setDeck(newDeck);
                setSelected(newSelected);
                return;
              }
              case Boolean(selected && bankedObject.key !== "x"): {
                const newBanked = update(banked, index, selected);
                setBanked(newBanked);

                setSelected(banked[index]);
                return;
              }
              case Boolean(!selected && bankedObject.key !== "x"): {
                const newBanked = update(banked, index, objects.x);
                setBanked(newBanked);

                setSelected(banked[index]);
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

      <p>Population: {grid ? countPopulation(grid) : 0}</p>
    </div>
  );
};

export default TopBar;
