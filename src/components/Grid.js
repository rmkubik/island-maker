import React, { useEffect, useState } from "react";

import { tilePaths, tilesMap } from "../data/tiles";
import { locations, icons } from "../data/locations";
import { TILE_HEIGHT, dimensions, TILE_IMAGE_WIDTH } from "../data/config";

import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import useScaleRef from "../hooks/useScaleRef";
import getHexFromPointerEvent from "../utils/getHexFromPointerEvent";
import useHexGrid from "../hooks/useHexGrid";
import Tile from "../components/Tile";

const Grid = () => {
  const [scaleRef, scale] = useScaleRef();
  const [hovered, setHovered] = useState();
  const [deck, setDeck] = useState([]);
  const [selected, setSelected] = useState("");
  const [points, setPoints] = useState(0);
  const [banked, setBanked] = useState();
  const { GridDataRef, grid, setGrid } = useHexGrid({
    initializeHex: (hex) => {
      const tileType = tilesMap.pickRandom();
      const tileTypeImages = tilePaths[tileType];
      const tileImage = pickRandomlyFromArray(tileTypeImages);

      hex.tileType = tileType;
      hex.tileImage = tileImage;
      // hex.objectImage = pickRandomlyFromArray(Object.values(locationImages));
    },
  });

  useEffect(() => {
    const initialDeck = new Array(20).fill().map(() => {
      const locationTypes = Object.values(locations);

      return pickRandomlyFromArray(locationTypes).image;
    });
    //.map(() => locations.house.image);
    // .map(() => pickRandomlyFromArray(Object.values(locationImages)));

    const initialSelected = initialDeck.shift();

    setDeck(initialDeck);
    setSelected(initialSelected);
  }, []);

  if (!grid) {
    return null;
  }

  const getHexFromPointerEventWithGridData = getHexFromPointerEvent(
    GridDataRef.current,
    scale
  );

  return (
    <div
      ref={scaleRef}
      style={{
        width: `${dimensions.width * TILE_IMAGE_WIDTH * (2 / 3)}px`,
        height: `${dimensions.height * TILE_HEIGHT + 2 * TILE_HEIGHT}px`,
        cursor: "pointer",
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
        <p>Points: {points}</p>
      </div>
    </div>
  );
};

export default Grid;
