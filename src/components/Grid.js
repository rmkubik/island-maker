import React, { useState } from "react";

import getHexFromPointerEvent from "../utils/getHexFromPointerEvent";
import Tile from "../components/Tile";

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
    </div>
  );
};

export default Grid;
