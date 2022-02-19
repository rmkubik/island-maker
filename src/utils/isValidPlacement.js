import shouldOverrideObject from "./shouldOverrideObject";

function isValidPlacement({ hex, selected }) {
  // Objects can specify other objects that they can override
  const isOverridingObject = shouldOverrideObject({ hex, selected });

  if (selected.requireOverride && (!hex.objectType || !isOverridingObject)) {
    // If selected type requires override and we're not overriding
    // anything, this placement fails.
    // Check for NOT valid object types as well.
    return false;
  }

  if (!isOverridingObject && hex.objectType) {
    // We only do this check if we're not overriding this object
    // If there is already an object on this tile
    // can't place here.
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
