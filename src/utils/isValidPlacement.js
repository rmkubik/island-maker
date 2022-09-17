import { objects } from "../data/locations";
import shouldOverrideObject from "./shouldOverrideObject";

function isValidPlacement({ hex, selected }) {
  if (!hex) {
    return;
  }

  // Objects can specify other objects that they can override
  const isOverridingObject = shouldOverrideObject({ hex, selected });

  if (selected.requireOverride && (!hex.objectType || !isOverridingObject)) {
    // If selected type requires override and we're not overriding
    // anything, this placement fails.
    // Check for NOT valid object types as well.
    return false;
  }

  const hexObject = objects[hex.objectType];
  const isValidTargeter =
    hexObject &&
    hexObject.isTargeterValid &&
    !hexObject.isTargeterValid({ targeter: selected });

  if (!isOverridingObject && !isValidTargeter && hex.objectType) {
    // We only do this check if we're not overriding this object
    // If there is already an object on this tile
    // can't place here unless it's our selected is a valid targeter
    // for the targeted hex.
    return false;
  }

  if (!selected.validTileTypes) {
    return false;
  }

  if (!selected.validTileTypes.includes(hex.tileType)) {
    // Do not place object if the clicked
    // hex is not a valid tile type
    return false;
  }

  return true;
}

export default isValidPlacement;
