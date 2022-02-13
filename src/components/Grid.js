import { defineGrid, extendHex, Point } from "honeycomb-grid";
import React, { useEffect, useRef, useState } from "react";

import { tilePaths, tileBorders, tilesMap } from "../data/tiles";
import { locations, icons } from "../data/locations";
import {
  TILE_WIDTH,
  TILE_HEIGHT,
  dimensions,
  TILE_IMAGE_WIDTH,
  TOP_MARGIN,
  LOCATION_Y_OFFSET,
  LOCATION_X_OFFSET,
} from "../data/config";

import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import useScaleRef from "../hooks/useScaleRef";
import getHexFromPointerEvent from "../utils/getHexFromPointerEvent";

const Grid = () => {
  const [scaleRef, scale] = useScaleRef();
  const [grid, setGrid] = useState();
  const GridDataRef = useRef();
  const [hovered, setHovered] = useState();
  const [deck, setDeck] = useState([]);
  const [selected, setSelected] = useState("");
  const [points, setPoints] = useState(0);
  const [banked, setBanked] = useState();

  useEffect(() => {
    const Hex = extendHex({
      orientation: "flat",
      size: { width: TILE_WIDTH, height: TILE_HEIGHT },
      tileType: undefined,
      tileImage: undefined,
      objetType: undefined,
      objectImage: undefined,
    });
    GridDataRef.current = defineGrid(Hex);

    const initialGrid = GridDataRef.current.rectangle(dimensions);

    initialGrid.forEach((hex) => {
      const tileType = tilesMap.pickRandom();
      const tileTypeImages = tilePaths[tileType];
      const tileImage = pickRandomlyFromArray(tileTypeImages);

      hex.tileType = tileType;
      hex.tileImage = tileImage;
      // hex.objectImage = pickRandomlyFromArray(Object.values(locationImages));
    });

    const initialDeck = new Array(20).fill().map(() => {
      const locationTypes = Object.values(locations);

      return pickRandomlyFromArray(locationTypes).image;
    });
    //.map(() => locations.house.image);
    // .map(() => pickRandomlyFromArray(Object.values(locationImages)));

    const initialSelected = initialDeck.shift();

    setDeck(initialDeck);
    setGrid(initialGrid);
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
      {grid.map((hex) => {
        const { x, y } = hex.toPoint();

        const isHovered = hovered && hex.equals(hovered);

        let objectImageSrc = hex.objectImage;

        if (!objectImageSrc) {
          if (isHovered) {
            if (selected) {
              objectImageSrc = selected;
            }
          }
        }

        return (
          <div
            key={`x:${x},y:${y}`}
            style={{
              position: "absolute",
              left: x,
              top: y - TOP_MARGIN,
              zIndex: Math.floor(y),
            }}
            className="tile"
          >
            <img
              style={{
                position: "absolute",
              }}
              src={hex.tileImage}
            />
            {isHovered && (
              <img
                style={{
                  position: "absolute",
                  zIndex: 100000,
                }}
                src={tileBorders}
              />
            )}
            <img
              style={{
                position: "absolute",
                top: `${LOCATION_Y_OFFSET}px`,
                left: `${LOCATION_X_OFFSET}px`,
              }}
              src={objectImageSrc}
            />
          </div>
        );
      })}
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
