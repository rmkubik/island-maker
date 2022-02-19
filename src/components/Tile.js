import React from "react";
import {
  LOCATION_X_OFFSET,
  LOCATION_Y_OFFSET,
  TOP_MARGIN,
} from "../data/config";
import { tileBorders } from "../data/tiles";

const Tile = ({ hex, hovered, selected, newCards }) => {
  const { x, y } = hex.toPoint();

  const isHovered = hovered && hex.equals(hovered);

  let objectImageSrc = hex.objectImage;

  if (!objectImageSrc) {
    if (isHovered) {
      if (selected) {
        objectImageSrc = selected.image;
      }
    }
  }

  return (
    <div
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
      {newCards.length > 0
        ? newCards.map((card, index) => (
            <img
              key={index}
              className="fadeOutUp"
              style={{
                position: "absolute",
                top: `${LOCATION_Y_OFFSET - (index + 1) * 80}px`,
                left: `${LOCATION_X_OFFSET}px`,
              }}
              src={card.image}
            />
          ))
        : null}
    </div>
  );
};

export default Tile;
