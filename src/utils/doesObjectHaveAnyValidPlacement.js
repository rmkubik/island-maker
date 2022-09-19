import isValidPlacement from "./isValidPlacement";

const doesObjectHaveAnyValidPlacement = ({ object, grid }) => {
  if (!object) {
    return false;
  }

  if (!grid) {
    return false;
  }

  return grid.some((hex) => isValidPlacement({ hex, selected: object }));
};

export default doesObjectHaveAnyValidPlacement;
