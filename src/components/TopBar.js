import React from "react";
import { objects } from "../data/locations";

const TopBar = ({
  selected,
  setSelected,
  deck,
  setDeck,
  banked,
  setBanked,
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
      <img src={deck.length >= 1 ? deck[0].image : objects.x.image} />
      <p>Deck: {deck.length}</p>
      <p>Bank:</p>
      <button
        onClick={(e) => {
          e.stopPropagation();

          switch (true) {
            case Boolean(selected && !banked):
              setBanked(selected);

              const [newSelected, ...newDeck] = deck;

              setDeck(newDeck);
              setSelected(newSelected);
              return;
            case Boolean(selected && banked):
              setBanked(selected);
              setSelected(banked);
              return;
            case Boolean(!selected && banked):
              setBanked();
              setSelected(banked);
              return;
            default:
              return;
          }
        }}
      >
        <img src={banked ? banked.image : objects.x.image} />
      </button>
    </div>
  );
};

export default TopBar;
