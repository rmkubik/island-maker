import React, { useState } from "react";

import getHexFromPointerEvent from "../utils/getHexFromPointerEvent";
import Tile from "../components/Tile";
import { objects } from "../data/locations";
import shouldOverrideObject from "../utils/shouldOverrideObject";
import isValidPlacement from "../utils/isValidPlacement";
import { VISUAL_Y_OFFSET } from "../data/config";

const Grid = ({
  deck,
  setDeck,
  grid,
  GridDataRef,
  scale,
  selected,
  setSelected,
  game,
}) => {
  const [hovered, setHovered] = useState();
  const [newCards, setNewCards] = useState();
  const [originHex, setOriginHex] = useState();
  const [shakeHex, setShakeHex] = useState();

  if (!grid) {
    return null;
  }

  const getHexFromPointerEventWithGridData = getHexFromPointerEvent(
    GridDataRef.current,
    scale
  );

  return (
    <div
      style={{
        position: "absolute",
        top: VISUAL_Y_OFFSET,
      }}
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

        if (!isValidPlacement({ hex, selected })) {
          setShakeHex(hex);
          return;
        } else {
          setShakeHex();
        }

        const isOverridingObject = shouldOverrideObject({ hex, selected });

        const neighbors = grid
          .neighborsOf(hex)
          .filter((neighbor) => neighbor !== undefined);

        // Allow for object overriding
        if (isOverridingObject) {
          selected.onOverride?.({ hex, neighbors, grid });
        } else {
          // Place object
          hex.objectType = selected.key;
          hex.objectImage = selected.image;

          grid.set(hexCoordinates, hex);
        }

        // onPlace, an object can modify the grid based on
        // the neighbors and grid contents.
        // The function can also return new cards to be added
        // to the deck.
        const newCardKeys =
          selected.onPlace?.({
            hex,
            neighbors,
            grid,
            game,
          }) ?? [];
        const newCards = newCardKeys.map((key) => objects[key]);
        const deckWithNewCards = [...deck, ...newCards];

        // Draw next card
        const [newSelected, ...newDeck] = deckWithNewCards;

        setOriginHex(hex);
        setNewCards(newCards);
        setDeck(newDeck);
        setSelected(newSelected);
      }}
    >
      {grid.map((hex) => (
        <Tile
          className={shakeHex && hex.equals(shakeHex) ? "shake" : ""}
          onAnimationEnd={() => setShakeHex()}
          key={JSON.stringify(hex.toPoint())}
          hex={hex}
          selected={selected}
          hovered={hovered}
          newCards={hex.equals(originHex) ? newCards : []}
        />
      ))}
    </div>
  );
};

export default Grid;
