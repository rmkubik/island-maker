import React from "react";
import {
  LOCATION_X_OFFSET,
  LOCATION_Y_OFFSET,
  TOP_MARGIN,
} from "../data/config";
import { tileBorders } from "../data/tiles";

const Tile = ({
  hex,
  hovered,
  selected,
  newCards,
  newCard,
  className,
  onAnimationEnd,
  onNewCardAnimationEnd,
  onNewCardAnimationStart,
  shouldShowSelected,
}) => {
  const { x, y } = hex.toPoint();

  const isHovered = hovered && hex.equals(hovered);

  let objectImageSrc = hex.objectImage;

  // if (!objectImageSrc) {
  //   if (isHovered) {
  //     if (selected) {
  //       objectImageSrc = selected.image;
  //     }
  //   }
  // }

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - TOP_MARGIN,
        zIndex: Math.floor(y),
      }}
      className={`tile ${className}`}
      onAnimationEnd={onAnimationEnd}
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
      {objectImageSrc ? (
        <img
          className="pulse"
          style={{
            position: "absolute",
            top: `${LOCATION_Y_OFFSET}px`,
            left: `${LOCATION_X_OFFSET}px`,
            opacity: shouldShowSelected && isHovered ? 0.65 : 1,
          }}
          src={objectImageSrc}
        />
      ) : null}
      {isHovered && selected ? (
        <img
          className="pulse"
          style={{
            position: "absolute",
            top: `${LOCATION_Y_OFFSET - (objectImageSrc ? 50 : 0)}px`,
            left: `${LOCATION_X_OFFSET + (objectImageSrc ? 40 : 0)}px`,
            zIndex: 999999,
          }}
          src={selected.image}
        />
      ) : null}
      {/* {newCards.length > 0
        ? newCards.map((card, index) => (
            <img
              key={index}
              className="fadeOutUp"
              style={{
                position: "absolute",
                animationDelay: `${index * 1000}ms`,
                opacity: 0,
                top: `${LOCATION_Y_OFFSET - 80}px`,
                left: `${LOCATION_X_OFFSET}px`,
              }}
              src={card.image}
              onAnimationEnd={onNewCardAnimationEnd}
            />
          ))
        : null} */}
      {newCard ? (
        <img
          key={newCard.id}
          // key={index}
          // animationDelay: `${index * 1000}ms`,
          className="fadeOutUp"
          style={{
            position: "absolute",
            opacity: 0,
            top: `${LOCATION_Y_OFFSET - 80}px`,
            left: `${LOCATION_X_OFFSET}px`,
          }}
          src={newCard.image}
          onAnimationEnd={onNewCardAnimationEnd}
          onAnimationStart={onNewCardAnimationStart}
        />
      ) : null}
    </div>
  );
};

export default Tile;
