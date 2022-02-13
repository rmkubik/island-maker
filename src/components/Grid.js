import React, { useState } from "react";

import { icons } from "../data/locations";

import getHexFromPointerEvent from "../utils/getHexFromPointerEvent";
import Tile from "../components/Tile";

const Grid = ({
  deck,
  setDeck,
  grid,
  GridDataRef,
  banked,
  setBanked,
  scale,
  selected,
  setSelected,
}) => {
  const [hovered, setHovered] = useState();

  if (!grid) {
    return null;
  }

  const getHexFromPointerEventWithGridData = getHexFromPointerEvent(
    GridDataRef.current,
    scale
  );

  return (
    <div
      onMouseMove={(e) => {
        const hex = getHexFromPointerEventWithGridData(e);

        setHovered(hex);
      }}
      onMouseLeave={(e) => {
        setHovered();
      }}
      onClick={(e) => {
        if (!selected) {
          return;
        }

        const hexCoordinates = getHexFromPointerEventWithGridData(e);

        const hex = grid.get(hexCoordinates);
        hex.objectImage = selected;
        grid.set(hexCoordinates, hex);

        const [newSelected, ...newDeck] = deck;

        setDeck(newDeck);
        setSelected(newSelected);
      }}
    >
      {grid.map((hex) => (
        <Tile
          key={JSON.stringify(hex.toPoint())}
          hex={hex}
          selected={selected}
          hovered={hovered}
        />
      ))}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          position: "absolute",
          zIndex: 10000,
        }}
      >
        <p>Current: </p>
        <img src={selected ? selected : icons.x.image} />
        <p>Next:</p>
        <img src={deck.length >= 1 ? deck[0] : icons.x.image} />
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
          <img src={banked ? banked : icons.x.image} />
        </button>
      </div>
    </div>
  );
};

export default Grid;
