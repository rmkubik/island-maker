import { defineGrid, extendHex, Point } from "honeycomb-grid";
import React, { useEffect, useRef, useState } from "react";

import WeightedMap from "../utils/WeightedMap";

import * as grassLandTiles from "../../assets/Tiles Grasslands/*.png";
import * as forestTiles from "../../assets/Tiles Forests/*.png";
import * as mountainTiles from "../../assets/Tiles Mountains/*.png";
import * as oceanTiles from "../../assets/Tiles Oceans/*.png";
import * as oceanWaveTiles from "../../assets/Tiles Oceans with Waves/*.png";
import * as locationImages from "../../assets/Locations 134x134/*.png";
import * as iconImages from "../../assets/Icons 134x134/*.png";
import tileCorners from "../../assets/Overlays Hex Corners/hex_corner_overlay.png";
import tileBorders from "../../assets/Overlays Hex Borders/hex_border_overlay.png";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import useScaleRef from "../hooks/useScaleRef";

// console.log({ locationImages, iconImages });

const tilePaths = {
  grassland: Object.values(grassLandTiles),
  forest: Object.values(forestTiles),
  mountain: Object.values(mountainTiles),
  ocean: Object.values(oceanTiles),
  oceanWave: Object.values(oceanWaveTiles),
};

const tilesMap = new WeightedMap({
  grassland: 50,
  forest: 15,
  mountain: 5,
  ocean: 25,
  oceanWave: 5,
});

const locations = {
  house: {
    image: locationImages["locations_colored_0"],
  },
  town: {
    image: locationImages["locations_colored_1"],
  },
  farm: {
    image: locationImages["locations_colored_5"],
  },
  windmill: {
    image: locationImages["locations_colored_6"],
  },
  inn: {
    image: locationImages["locations_colored_12"],
  },
  church: {
    image: locationImages["locations_colored_16"],
  },
};

const icons = {
  question: {
    image: iconImages["icons_colored_0"],
  },
  x: {
    image: iconImages["icons_colored_3"],
  },
};

const TOP_MARGIN = 60;

const LOCATION_SIZE = 134;
const HALF_LOCATION_SIZE = LOCATION_SIZE / 2;

const TILE_HEIGHT = 135;
const TILE_IMAGE_HEIGHT = 380;
const LOCATION_Y_OFFSET = TILE_IMAGE_HEIGHT - TILE_HEIGHT - HALF_LOCATION_SIZE;

const TILE_WIDTH = 300;
const TILE_IMAGE_WIDTH = 380;
const LOCATION_X_OFFSET = TILE_IMAGE_WIDTH / 2 - HALF_LOCATION_SIZE;

const dimensions = { width: 10, height: 10 };

const getHexFromPointerEvent = (GridData, scale) => (event) => {
  const hex = GridData.pointToHex(
    event.clientX / scale,
    event.clientY / scale - TILE_HEIGHT
  );

  return hex;
};

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
