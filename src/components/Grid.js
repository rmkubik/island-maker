import React, { useState } from "react";

import getHexFromPointerEvent from "../utils/getHexFromPointerEvent";
import Tile from "../components/Tile";
import { objects } from "../data/locations";

const Grid = ({
  deck,
  setDeck,
  grid,
  GridDataRef,
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

        if (hex.objectType) {
          // If there is already an object on this tile
          // can't place here.
          return;
        }

        if (!selected.validTileTypes.includes(hex.tileType)) {
          // Do not place object if the clicked
          // hex is not a valid tile type
          return;
        }

        // Place object
        hex.objectType = selected.key;
        hex.objectImage = selected.image;
        grid.set(hexCoordinates, hex);

        const neighbors = grid
          .neighborsOf(hex)
          .filter((neighbor) => neighbor !== undefined);

        // onPlace, an object can modify the grid based on
        // the neighbors and grid contents.
        // The function can also return new cards to be added
        // to the deck.
        const newCardKeys = selected.onPlace?.({ hex, neighbors, grid }) ?? [];
        console.log({ newCardKeys, selected });
        const newCards = newCardKeys.map((key) => objects[key]);
        const deckWithNewCards = [...deck, ...newCards];

        // Draw next card
        const [newSelected, ...newDeck] = deckWithNewCards;

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
    </div>
  );
};

export default Grid;
