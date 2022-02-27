import React, { useState } from "react";

import getHexFromPointerEvent from "../utils/getHexFromPointerEvent";
import Tile from "../components/Tile";
import { objects } from "../data/locations";
import shouldOverrideObject from "../utils/shouldOverrideObject";
import isValidPlacement from "../utils/isValidPlacement";
import { VISUAL_Y_OFFSET } from "../data/config";
import getNextId from "../utils/getNextId";

const Grid = ({
  deck,
  setDeck,
  grid,
  GridDataRef,
  scale,
  selected,
  game,
  newCards,
  setNewCards,
  setShouldShowSelected,
  shouldShowSelected,
  isGameOver,
}) => {
  const [hovered, setHovered] = useState();
  const [originHex, setOriginHex] = useState();
  const [shakeHex, setShakeHex] = useState();
  const [newCardLocations, setNewCardLocations] = useState([]);

  if (!grid) {
    return null;
  }

  const getHexFromPointerEventWithGridData = getHexFromPointerEvent(
    GridDataRef.current,
    scale
  );

  const getTileClassName = (hex) => {
    let className = "";

    if (shakeHex && hex.equals(shakeHex)) {
      className += " shake";
    }

    if (hex.equals(newCardLocations[0])) {
      className += " bounce";
    }

    return className;
  };

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
        if (isGameOver) {
          return;
        }

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
        const cardLocations = [];
        const newCards = newCardKeys.map((keyOrTuple) => {
          if (Array.isArray(keyOrTuple)) {
            const [key, hex] = keyOrTuple;

            cardLocations.push(hex);
            return objects[key];
          }

          return objects[keyOrTuple];
        });
        const newCardsWithIds = newCards.map((card) => {
          return {
            ...card,
            id: getNextId(),
          };
        });
        const deckWithNewCards = [...deck, ...newCardsWithIds];

        // Draw next card
        // const [newSelected, ...newDeck] = deckWithNewCards;

        const [playedCard, ...newDeck] = deck;

        if (newCardsWithIds.length === 0) {
          setShouldShowSelected(true);
        } else {
          setShouldShowSelected(false);
        }

        setOriginHex(hex);
        setNewCardLocations(cardLocations);
        setNewCards(newCardsWithIds);
        setDeck(newDeck);
      }}
    >
      {grid.map((hex) => (
        <Tile
          className={getTileClassName(hex)}
          onAnimationEnd={() => setShakeHex()}
          key={JSON.stringify(hex.toPoint())}
          hex={hex}
          selected={selected}
          hovered={hovered}
          shouldShowSelected={shouldShowSelected}
          newCards={hex.equals(originHex) ? newCards : []}
          newCard={hex.equals(originHex) ? newCards[0] : undefined}
          onNewCardAnimationEnd={() => {
            const [nextCard, ...remainingCards] = newCards;
            const [newLocation, ...remainingLocations] = newCardLocations;

            if (remainingCards.length === 0) {
              setShouldShowSelected(true);
            }

            if (nextCard) {
              setDeck([...deck, nextCard]);
              setNewCards(remainingCards);
              setNewCardLocations(remainingLocations);
            }
          }}
        />
      ))}
    </div>
  );
};

export default Grid;
