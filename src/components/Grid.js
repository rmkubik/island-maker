import React, { useState } from "react";

import getHexFromPointerEvent from "../utils/getHexFromPointerEvent";
import Tile from "../components/Tile";
import { objects } from "../data/locations";
import shouldOverrideObject from "../utils/shouldOverrideObject";
import isValidPlacement from "../utils/isValidPlacement";
import { GAME_MODE_OPTIONS, VISUAL_Y_OFFSET } from "../data/config";
import getNextId from "../utils/getNextId";
import isValidCard from "../utils/isValidCard";

function onClickPlayMode({
  e,
  isGameOver,
  selected,
  getHexFromPointerEventWithGridData,
  grid,
  setShakeHex,
  game,
  deck,
  setShouldShowSelected,
  setOriginHex,
  setNewCardLocations,
  setNewCards,
  setDeck,
}) {
  if (e.button !== 0) {
    // Only left click has play mode functionality right now
    return;
  }

  if (isGameOver) {
    return;
  }

  if (!selected) {
    return;
  }

  const hexCoordinates = getHexFromPointerEventWithGridData(e);
  const hex = grid.get(hexCoordinates);

  // if something is in the hex i'm targeting
  // IT gets the chance to onTargeted BEFORE
  // we check if placement is valid.
  // This means onTargeted COULD change validity
  // of the placement attempt.
  // It can also affect override and placement
  // outcomes since it can affect the grid.
  // This is PROBABLY a bad idea in the current
  // architecture, because we do not have a
  // method to animate and communicate these
  // changes to the player. However, this is
  // kinda sick and could be good to keep in
  // mind.
  const neighbors = grid
    .neighborsOf(hex)
    .filter((neighbor) => neighbor !== undefined);

  let newCardKeys = [];
  let skipPlacement = false;

  if (hex.objectType && objects[hex.objectType]?.onTargeted) {
    const { skipPlacement: _skipPlacement, newCards } = objects[
      hex.objectType
    ].onTargeted({
      hex,
      selected,
      neighbors,
      grid,
      game,
    });

    skipPlacement = _skipPlacement;
    newCardKeys.push(...newCards);
  }

  if (!skipPlacement) {
    if (!isValidPlacement({ hex, selected })) {
      setShakeHex(hex);
      return;
    } else {
      setShakeHex();
    }

    const isOverridingObject = shouldOverrideObject({ hex, selected });

    // Allow for object overriding
    if (isOverridingObject) {
      selected.onOverride?.({ hex, neighbors, grid, game });
    } else {
      // Place object
      hex.objectType = selected.key;
      hex.objectImage = selected.image;

      grid.set(hexCoordinates, hex);
    }

    // When you place an object, unlock it in the journal
    game.unlockItem(selected.key);

    // onPlace, an object can modify the grid based on
    // the neighbors and grid contents.
    // The function can also return new cards to be added
    // to the deck.
    newCardKeys =
      selected.onPlace?.({
        hex,
        neighbors,
        grid,
        game,
      }) ?? [];
  }

  const cardLocations = [];
  const newCards = newCardKeys.map((keyOrTuple) => {
    if (Array.isArray(keyOrTuple)) {
      const [key, hex] = keyOrTuple;

      cardLocations.push(hex);
      return objects[key];
    }

    return objects[keyOrTuple];
  });

  // Check if any invalid cards were added
  const validNewCards = newCards.filter(isValidCard);

  const newCardsWithIds = validNewCards.map((card) => {
    return {
      ...card,
      id: getNextId(),
    };
  });
  const deckWithNewCards = [...deck, ...newCardsWithIds];

  // Draw next card
  // const [newSelected, ...newDeck] = deckWithNewCards;

  const [playedCard, ...newDeck] = deck;

  game.commitUnlocks();

  if (newCardsWithIds.length === 0) {
    setShouldShowSelected(true);
  } else {
    setShouldShowSelected(false);
  }

  setOriginHex(hex);
  setNewCardLocations(cardLocations);
  setNewCards(newCardsWithIds);
  setDeck(newDeck);
}

function onClickEditMode({
  e,
  isGameOver,
  selected,
  getHexFromPointerEventWithGridData,
  grid,
  setShakeHex,
  game,
  deck,
  setShouldShowSelected,
  setOriginHex,
  setNewCardLocations,
  setNewCards,
  setDeck,
}) {
  const hexCoordinates = getHexFromPointerEventWithGridData(e);
  const hex = grid.get(hexCoordinates);

  switch (e.button) {
    default:
    case 0:
      // Left click, set tile to selected
      // Place object
      if (!hex) {
        return;
      }

      // If selected has an onEditOverride, execute the override
      // function instead of placing the selected object.
      if (selected.onEditOverride) {
        const neighbors = grid
          .neighborsOf(hex)
          .filter((neighbor) => neighbor !== undefined);

        selected.onEditOverride({ hex, neighbors, grid });
        return;
      }

      if (selected === undefined) {
        hex.objectType = undefined;
        hex.objectImage = undefined;
      } else {
        hex.objectType = selected.key;
        hex.objectImage = selected.image;
      }

      grid.set(hexCoordinates, hex);
      break;
    case 1:
      // Middle click, select hovered object
      if (!hex.objectType) {
        // TODO: make this select an "eraser" object
        // instead of short circuiting.
        return;
      }

      const hoveredObjectTypeIndexInDeck = deck.findIndex(
        (card) => card.key === hex.objectType
      );

      // Scroll to the new index
      const cardsBeforeHoveredObject = deck.slice(
        0,
        hoveredObjectTypeIndexInDeck
      );
      const cardsAfterAndIncludingHoveredObject = deck.slice(
        hoveredObjectTypeIndexInDeck
      );

      setDeck([
        ...cardsAfterAndIncludingHoveredObject,
        ...cardsBeforeHoveredObject,
      ]);
      break;
    case 2:
      if (e.type === "auxclick") {
        // auxclick and contextmenu events both trigger
        // for right clicks.
        //
        // We don't want to double count right clicks,
        // so we're going to short circuit the auxclick
        // event.
        //
        // if you try try to rely on just the auxclick
        // event, you're too late to prevent the default
        // context menu behavior.
        return;
      }
      // Right click, selected hovered tile
      e.preventDefault();

      break;
  }
}

function onWheelEditMode({
  e,
  isGameOver,
  selected,
  getHexFromPointerEventWithGridData,
  grid,
  setShakeHex,
  game,
  deck,
  setShouldShowSelected,
  setOriginHex,
  setNewCardLocations,
  setNewCards,
  setDeck,
}) {
  let newDeck;

  if (e.deltaY > 0) {
    // Scrolling down, move first card to end of the deck
    newDeck = [...deck.slice(1), deck[0]];
  } else if (e.deltaY < 0) {
    // Scrolling up, move last card to beginning of deck
    newDeck = [deck[deck.length - 1], ...deck.slice(0, deck.length - 1)];
  }

  setDeck(newDeck);
}

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
  gameMode,
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

  const onClick = (e) => {
    switch (gameMode) {
      case GAME_MODE_OPTIONS.EDITOR:
        onClickEditMode({
          e,
          isGameOver,
          selected,
          getHexFromPointerEventWithGridData,
          grid,
          setShakeHex,
          game,
          deck,
          setShouldShowSelected,
          setOriginHex,
          setNewCardLocations,
          setNewCards,
          setDeck,
        });
        break;
      case GAME_MODE_OPTIONS.SEEDED:
      case GAME_MODE_OPTIONS.PREMADE:
      default:
        onClickPlayMode({
          e,
          isGameOver,
          selected,
          getHexFromPointerEventWithGridData,
          grid,
          setShakeHex,
          game,
          deck,
          setShouldShowSelected,
          setOriginHex,
          setNewCardLocations,
          setNewCards,
          setDeck,
        });
        break;
    }
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
      onClick={onClick}
      onContextMenu={onClick}
      onAuxClick={onClick}
      onWheel={(e) => {
        switch (gameMode) {
          case GAME_MODE_OPTIONS.EDITOR:
            onWheelEditMode({
              e,
              isGameOver,
              selected,
              getHexFromPointerEventWithGridData,
              grid,
              setShakeHex,
              game,
              deck,
              setShouldShowSelected,
              setOriginHex,
              setNewCardLocations,
              setNewCards,
              setDeck,
            });
            break;
          default:
            break;
        }
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
